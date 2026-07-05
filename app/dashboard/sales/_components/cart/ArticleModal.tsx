import DataTable from '@/app/dashboard/suppliers/_components/DataTable'
import { editModalOpen, filterArticles, setPageLimit, setPageNumber, setQuery, setToken } from '@/app/Redux/Slices/articlesSlice'
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from "@tanstack/react-table"
import { AppDispatch, RootState } from '@/app/Redux/store';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { VatRate } from "@/lib/actions/articles.actions";
import { ArticleCellAction } from '@/app/dashboard/articles/_components/ArticleCellAction';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Check, FileSearch, Plus, RotateCcw, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { selectArticleForCart } from '@/app/Redux/Slices/salesSlice';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { transformSearchFieldValue } from '@/app/customers/Helper/transformSearchFieldValue';
import { ProductForm } from '@/app/dashboard/articles/_components/product/product-form';
import { useSession } from '@clerk/nextjs';
type Article = {
  productId: string;
  designation: string;
  quantityStock: number;
  quantityMinimum: number;
  supplier: string;
  refArt: string;
  vatCode: VatRate;
};

export const columns: ColumnDef<any>[] = [
  {
    id: 'productId',
    accessorKey: 'productId',
    header: 'Product ID',
    enableResizing: false
  },
  {
    id: 'designation',
    accessorKey: 'designation',
    header: 'Designation',
    enableResizing: false
  },
    {
    id: 'refArt',
    accessorKey: 'refArt',
    header: 'RefArt',
    enableResizing: false
  },
  {
    id: 'quantityStock',
    accessorKey: 'quantityStock',
    header: 'QuantityStock',
    enableResizing: false
  },
  {
    id: 'priceCategory1.priceVatIncl',
    accessorFn: (row) => row?.priceCategory1?.priceVatIncl ?? '---',
    header: 'Sell price',
    enableResizing: false
  },
  // {
  //   id: 'quantityMinimum',
  //   accessorKey: 'quantityMinimum',
  //   header: 'Quantity Minimum',
  //   enableResizing: true
  // },
  // {
  //   id: 'Supplier',
  //   accessorKey: 'supplier',
  //   header: 'Supplier',
  //   enableResizing: true
  // },
  // {
  //   id: 'category',
  //   accessorKey: 'category.name',
  //   header: 'Category',
  //   enableResizing: true
  // },
  // {
  //   id: 'subCategory',
  //   accessorKey: 'subCategory.name',
  //   header: 'Sub-Category',
  //   enableResizing: true
  // },
  // // {
  // //   id: 'tel2',
  // //   accessorKey: 'tel2',
  // //   header: 'Tel 2',
  // //   enableResizing: true
  // // },
  // // {
  // //   id: 'fax',
  // //   accessorKey: 'fax',
  // //   header: 'Fax',
  // //   enableResizing: true
  // // },
  // // {
  // //   id: 'accountNumber',
  // //   accessorKey: 'accountNumber',
  // //   header: 'Account Number',
  // //   enableResizing: true
  // // },
  // // {
  // //   id: 'email',
  // //   accessorKey: 'email',
  // //   header: 'Email',
  // //   enableResizing: true
  // // },
  // {
  //   id: 'actions',
  //   accessorKey: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => <ArticleCellAction data={row.original} />
  // }
];
type SelectType = 'edit' | 'add';
interface ArticleDialogProps {
  open: boolean;
  mode: SelectType;
  // onChange?: (key: string, value: any) => void;
  // setUserData: (userData: Supplier | null) => void;
  // handleData?: () => void;
  onClose: () => void;
  // productData: (data:any) => void
   onArticleSelect?: (article: any) => void;
   preserveExistingBehavior?: boolean;
}
const ArticleModal = ({
  open,
  mode,
  // onChange,
  // setUserData,
  // handleData,
  onClose,
  // productData
  onArticleSelect,
  preserveExistingBehavior = true
}: ArticleDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const isUserLoading = useSelector((state: RootState) => state.article.isArticlesLoading);
  const filterQuery = useSelector((state: RootState) => state.article.query);
  const pageLimit = useSelector((state: RootState) => state.article.pageLimitArticle);
  const pageNumber = useSelector((state: RootState) => state.article.pageNumberArticle);
  const allArticles = useSelector((state: RootState) => state.article.allArticles);
  const articlesCount = useSelector((state: RootState) => state.article.articlesCount);

  const selectedProduct = useSelector((state: RootState) => state.sales.selectedProductForCart);
  
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'contact': false,
    'address': false,
    'tel2': false,
  });

  const [searchType, setSearchType] = useState('productId')
  const [searchQuery, setSearchQuery] = useState("")
   const [showForm, setShowForm] = useState(false)

  const [columnSizing, setColumnSizing] = useState({});
  const { session } = useSession();
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

    const handleOkay = () => {
    if(!selectedProduct){
        toast.error('Article was not Selected!')
        return
    }
    console.log('selectedProduct', selectedProduct)
      if (onArticleSelect) {
      onArticleSelect(selectedProduct);
    }
      if (preserveExistingBehavior) {
      dispatch(selectArticleForCart({ userData: selectedProduct }));
    }
    // productData(selectedProduct)
    onClose()
  }

      const handleSearch = () => {
          // console.log(`Searching for ${searchQuery} by ${searchType}`)
          // Implement your search logic here
          if (!searchQuery?.trim() || !searchType) {
              toast.error(`${!searchType ? 'Select a filter!' : 'Provide Search value!'}`)
              return
          }
  
          if (searchType) {
              const value = transformSearchFieldValue(searchQuery)
  
              const query = { [searchType]: value?.trim() }
              // console.log('query', query)
              dispatch(setQuery(query))    //setting new query in the redux so it can be fetched every where
              dispatch(setPageNumber(1));  //set page number to 1 for this new query
              dispatch(filterArticles({ search: query, limit: pageLimit, page: 1 }))
          } else {
              // if we don't have any query
              dispatch(setQuery({}))
              dispatch(setPageNumber(1));
              dispatch(filterArticles({}))
          }
      }

      const handleReset = () => {
        dispatch(setQuery({}))
        dispatch(setPageNumber(1));
        dispatch(filterArticles({}))
        setSearchType('productId')
        setSearchQuery("")
        // Additional reset logic
    }
  

  return (
<>

    <Dialog  open={open} onOpenChange={onClose}>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="scrollbar-custom max-h-[90vh] max-w-[80vw] overflow-auto p-0 "
      >
        <Card className="w-full border-none bg-transparent shadow-none">
          <CardHeader className="flex flex-row items-center justify-between rounded-tl-md bg-[#DAAC95] p-3 text-white">
            <CardTitle className="text-xl font-medium text-black">
              Select Article
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-[30%] overflow-y-auto pb-2">
              <DataTable
                editModalOpen={editModalOpen}
                isUserLoading={isUserLoading}
                pageLimit={pageLimit}
                pageNumber={pageNumber}
                table={table}
                usersCount={articlesCount}
                selectCustomerForDocument={selectArticleForCart}
              />
            </div>

            <div className="flex border-t-2 pt-2 ">
              <div
                className="w-[55%] mt-4 flex flex-col pr-2 border-r-2
                  "
              >
                <p className="font-semibold">Search by:</p>
                <div className="mt-2 flex items-center justify-between">
                  {/* <Label className='font-medium' htmlFor="cityFilter">City</Label> */}
                  <div className="w-[30%] mr-4">
                    <Select
                    value={searchType}
                    onValueChange={(value) => setSearchType(value)}
                    >
                      <SelectTrigger className="" id="searchFilter">
                        <SelectValue placeholder="Select Field" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[15rem] flex flex-col overflow-y-auto">
                        <SelectItem className='hover:bg-gray-200 cursor-pointer' value="productId">Product ID</SelectItem>
                        <SelectItem className='hover:bg-gray-200 cursor-pointer' value="designation">Article name</SelectItem>
                        <SelectItem className='hover:bg-gray-200 cursor-pointer' value="supplier">Supplier</SelectItem>
                        <SelectItem className='hover:bg-gray-200 cursor-pointer' value="refArt">Ref art provided</SelectItem>
                        <SelectItem className='hover:bg-gray-200 cursor-pointer' value="quantityStock">Quantity Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='mr-4'>
                    <Input
                        type='text'
                        placeholder="Search..."

                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full ELMB:w-[200px] rounded-r-md border-l-0 bg-white bg-background shadow-sm transition-colors  focus-visible:ring-1 focus-visible:ring-ring dark:placeholder-white`}
                    />
                  </div>
                  <div>
                  <Button
                      onClick={handleSearch}
                      className=""
                      >
                    <FileSearch className="mr-2 h-4 w-4" /> Find{' '}
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-l-none rounded-r-md bg-muted/90 px-1 " onClick={handleReset}>
                      <RotateCcw className="h-4 w-4  " />
                  </Button>
                  </div>
                </div>
              </div>
              <div className=' w-[40%] flex items-end pl-2'>
                <div className='w-[40%]'>
                  <Button type='button'
                  onClick={() => setShowForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> <span className="text-[14px]">New Article</span>
                  </Button>
                </div>
                <div className='flex justify-end gap-2 w-[60%]'>
                  <Button type='button' className='bg-blue-400 hover:bg-blue-600'
                  onClick={handleOkay}
                  >
                    <Check className="mr-2 h-4 w-4" /> <span className="text-[14px]">Ok</span>
                  </Button>
                  <Button className='bg-red-400 hover:bg-red-600' type='button'
                  onClick={() => onClose()}
                  >
                    <X className="mr-2 h-4 w-4" /> <span className="text-[14px]">Cancel</span>
                  </Button>

                </div>
              </div>
            </div>

      {showForm && (
      <Dialog  open={showForm} onOpenChange={() => setShowForm(false)}>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="scrollbar-custom max-h-[90vh] max-w-[80vw] overflow-auto p-0 "
      >
      <Card className="w-full border-none bg-transparent shadow-none">
       <ProductForm
              mode="add"
              onSave={(data) => {
                setShowForm(false)
              }}
              onCancel={() => setShowForm(false)}
            />
        </Card>
      </DialogContent>
    </Dialog>
      )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
</>
  )
}

export default ArticleModal
