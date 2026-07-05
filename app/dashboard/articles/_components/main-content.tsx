"use client"
import { useEffect, useState } from "react"
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { editModalOpen, filterArticles, setPageLimit, setPageNumber, setOpenDeleteModal, refreshListOnDelete, setToken } from "@/app/Redux/Slices/articlesSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from "@tanstack/react-table"
import { filterSuppliers } from "@/app/Redux/Slices/supplierSlice"
import ProductFilter from "./product-filter"
import DataTable from "../../suppliers/_components/DataTable"
import { ProductForm } from "./product/product-form"
import { Article, deleteArticles } from "@/lib/actions/articles.actions"
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal"
import { toast } from "sonner"
import { useSession } from '@clerk/nextjs';



interface DataTableProps<TData, TValue> {
  columns: ColumnDef<any>[];
}
export default function MainContent<TData, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch<AppDispatch>();
  const isUserLoading = useSelector((state: RootState) => state.article.isArticlesLoading);
  const pageLimit = useSelector((state: RootState) => state.article.pageLimitArticle);
  const pageNumber = useSelector((state: RootState) => state.article.pageNumberArticle);
  const articlesCount = useSelector((state: RootState) => state.article.articlesCount);
  const allArticles = useSelector((state: RootState) => state.article.allArticles);
  const isEditOpen = useSelector((state: RootState) => state.article.openEditModal);
  const openDeleteModal = useSelector((state: RootState) => state.article.openDeleteModal);
  const articleToDelete = useSelector((state: RootState) => state.article.articleToDelete);
  // console.log("allArticles",allArticles)
  const filterQuery = useSelector((state: RootState) => state.article.query);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'contact': false,
    'address': false,
    'tel2': false,
  });
  const [columnSizing, setColumnSizing] = useState({});

    const { session } = useSession();
    const userAccesses:any = session?.user?.publicMetadata?.accesses
    const userRole:any = session?.user?.publicMetadata?.role

    const token:any = session?.user?.publicMetadata?.token
    
  useEffect(() => {
    if(token){
      dispatch(setToken(token));
      dispatch(filterArticles({}))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
    }
  }, [token]);



  const paginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageLimit,
  };

  // console.log("ALl Articles table Data  ",allArticles)
  const totalItems = Number(articlesCount)
  const table = useReactTable({
    data: allArticles,

    columns,
    pageCount: Math.ceil(totalItems / paginationState.pageSize),
    state: {
      pagination: paginationState,
      columnVisibility,
      columnSizing
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange' as ColumnResizeMode,
    // ✅ UPDATED: Update context values instead of useQueryState

    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(paginationState) : updater;
      dispatch(setPageNumber(newState.pageIndex + 1));  //to increase page number in redux
      dispatch(setPageLimit(newState.pageSize));     //to increase page limit in redux

      /*fetch filtered results with same query from redux but different page numbers, 
      Note: Query is changed in searchFilters component*/
      dispatch(filterArticles({
        search: filterQuery,
        page: newState.pageIndex + 1,
        limit: newState.pageSize,
      }));
    },

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualFiltering: true
  });


    const confirmDelete = async() => {
      try {
        const deleted = await deleteArticles(articleToDelete?._id, token)
        if(deleted?.statusCode == 200){
          dispatch(refreshListOnDelete(articleToDelete?._id))
          dispatch(setOpenDeleteModal(false))
          toast.success('Article deleted successfully!')
        }
      } catch (error:any) {
      console.error('Error while deleting article', error)
      toast.error(`${error?.message}`)
      }
  
    }



  return (

    <>
              <DeleteConfirmationModal
            open={openDeleteModal}
            onClose={() => dispatch(setOpenDeleteModal(false))}
            onConfirm={confirmDelete}
            message={`Delete article with Name: ${articleToDelete?.designation}?`}
          />
   
    <main className="   h-[calc(100dvh-52px)] overflow-y-auto p-4 md:px-4">
      <ProductFilter />
      {/* Your product table would go here */}
      <div className=" mt-4 p-4 border rounded-md">
        <Button
        disabled={userRole != 'admin' && userAccesses?.addProductForm === false}
          onClick={() => setShowForm(true)}
          className={`bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 ${userAccesses?.addProductForm === false ? 'cursor-not-allowed': ''}`}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Product
        </Button>
        {/* <DataTable /> */}
        {/* Resuable Datatable  */}

        {/* <ProductForm  /> */}
      </div>
      <DataTable
        editModalOpen={editModalOpen}
        isUserLoading={isUserLoading}
        pageLimit={pageLimit}
        pageNumber={pageNumber}
        table={table}
        usersCount={articlesCount}


      />
      {showForm && (userRole == 'admin' || userAccesses?.addProductForm === true) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className=" h-full  max-h-screen    relative   overflow-auto py-2" style={{ scrollbarWidth: 'none' }} >
            <ProductForm
              mode="add"
              onSave={(data) => {
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />

          </div>
        </div>
      )}
      {isEditOpen && (userRole == 'admin' || userAccesses?.modifyProductForm === true) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className=" h-full  max-h-screen    relative   overflow-auto py-2" style={{ scrollbarWidth: 'none' }} >
            <ProductForm
              mode="edit"
              onSave={() => { dispatch(editModalOpen({ isModalOpen: false, userData: null })) }}
              onCancel={() => setShowForm(false)}
            />

          </div>
        </div>
      )}
    </main>
    </>
  )
}
