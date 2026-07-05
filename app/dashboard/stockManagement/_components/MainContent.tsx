'use client';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { toast } from 'sonner';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import { useSession } from '@clerk/nextjs';
import { StockCellAction } from './StockCellAction';
import { editModalOpen, filterArticlesForStock, setPageLimit, setPageNumber } from '@/app/Redux/Slices/stockSlice';
import { setToken } from '@/app/Redux/Slices/articlesSlice';
import { StockEditorModal } from './StocksEditorModal';

const MainContent = () => {

    const { session } = useSession();  
    const userAccesses:any = session?.user?.publicMetadata?.accesses
    const userRole:any = session?.user?.publicMetadata?.role  
    const token:any = session?.user?.publicMetadata?.token

    const dispatch = useDispatch<AppDispatch>();
    const allArticles = useSelector((state: RootState) => state.stocks.allArticles);
    const isArticlesLoading = useSelector((state: RootState) => state.stocks.isArticlesLoading);
    const pageNumber = useSelector((state: RootState) => state.stocks.pageNumberArticle);
    const pageLimit = useSelector((state: RootState) => state.stocks.pageLimitArticle);
    const articlesCount = useSelector((state: RootState) => state.stocks.articlesCount);
    const filterQuery = useSelector((state: RootState) => state.stocks.query);

    const isEditOpen = useSelector((state: RootState) => state.stocks.openEditModal);
    const selectedArticleForStock = useSelector((state: RootState) => state.stocks.selectedArticle);

    const [columnSizing, setColumnSizing] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [showForm, setShowForm] = useState(false)



  useEffect(() => {
    if(token){
      dispatch(setToken(token));
      dispatch(filterArticlesForStock({}))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
    }
  }, [token]);

        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "productId", header: "Product ID", size: 200 },
            { accessorKey: "designation", header: "Designation", size: 140 },
            { accessorKey: "quantityStock", header: "QuantityStock", size: 150 },
            { accessorKey: "lastAddedStock", header: "Last Added Stock", size: 150 },
            { accessorKey: "quantityMinimum", header: "Quantity Minimum", size: 200 },
            { accessorKey: "category.name", header: "Category", size: 150 },
            { accessorKey: "subCategory.name", header: "Sub-Category", size: 200 },

            { accessorFn: (row) => row?.supplier?.nameDenomination ?? row?.supplier, 
                header: "Supplier", size: 130 },
            {
              id: 'actions',
              accessorKey: 'actions',
              header: 'Actions',
              cell: ({ row }) => <StockCellAction data={row.original} />
            }
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    
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
              dispatch(filterArticlesForStock({
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
  return (
    <div className=" h-[calc(100dvh-56px)] overflow-y-auto scrollbar-custom">
      {/* <SearchFilters employees={allEmployees}/> */}
           <div className='flex flex-col items-center lg:items-start NLP:flex-row gap-4 LS:justify-center'>
      
      <div className="w-[100%] NLP:w-[95%] pt-4 px-4 NLP:px-0 NLP:pl-4">
          <ScrollableTable 
          table={table}
          isDataLoading={isArticlesLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={articlesCount}
          />

        {isEditOpen && (userRole == 'admin' || userAccesses?.manageTheStock === true) && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className=" h-full  max-h-screen    relative   overflow-auto py-2" style={{ scrollbarWidth: 'none' }} >
              <StockEditorModal
                mode="edit"
                initialData={selectedArticleForStock}
                onSave={() => { dispatch(editModalOpen({ isModalOpen: false, userData: null })) }}
                onCancel={() => { dispatch(editModalOpen({ isModalOpen: false, userData: null })) }}
              />
    
            </div>
          </div>
        )}
          </div>
            </div>
    </div>
  )
}

export default MainContent
