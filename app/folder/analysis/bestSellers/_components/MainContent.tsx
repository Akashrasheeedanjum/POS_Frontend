'use client';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
// import { filterReceipts, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/receiptSlice';
import { toast } from 'sonner';
import SearchFilters from '@/app/folder/documentAndSales/receipts/_components/SearchFilters';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import { filterBestSellers, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/bestSellersSlice';
import { getEmployees } from '@/lib/actions/user.actions';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allBestSellers = useSelector((state: RootState) => state.bestSellers.allBestSellers);
    const isBestSellersLoading = useSelector((state: RootState) => state.bestSellers.isBestSellersLoading);
    const pageNumber = useSelector((state: RootState) => state.bestSellers.pageNumberBestSellers);
    const pageLimit = useSelector((state: RootState) => state.bestSellers.pageLimitBestSellers);
    const bestSellersCount = useSelector((state: RootState) => state.bestSellers.bestSellersCount);
    const filterQuery = useSelector((state: RootState) => state.bestSellers.query);

    const [columnSizing, setColumnSizing] = useState({});
    const [allEmployees, setAllEmployees] = useState([]);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

      useEffect(() => {
        dispatch(filterBestSellers({}));
                const getAllEmployees = async() => {
                  try {
                    const employees = await getEmployees()
                    setAllEmployees(employees)
                  } catch (error) {
                    console.error(`Failed to fetch employyes`, error)
                    toast.error(`${error}`)
                  }
                }
        
                getAllEmployees()
      }, []);

        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "article_productId", header: "Product ID", size: 150 },
            { accessorKey: "nameAtPurchase", header: "Article", size: 200 },
            { accessorKey: "totalQuantity", header: "Quantity", size: 100 },
            { accessorKey: "totalVatExcl", header: "Total VAT Excl", size: 200 },
            { accessorKey: "totalVatIncl", header: "Total VAT Incl", size: 200 }
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    
        const totalItems = Number(bestSellersCount)
          const table = useReactTable({
            data: allBestSellers,
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
              dispatch(filterBestSellers({
              query: filterQuery,
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
      <SearchFilters employees={allEmployees}/>
           <div className='flex flex-col items-center lg:items-start NLP:flex-row gap-4 LS:justify-center'>
      
      <div className="w-[100%] NLP:w-[95%] pt-4 px-4 NLP:px-0 NLP:pl-4">
          <ScrollableTable 
          table={table}
          isDataLoading={isBestSellersLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={bestSellersCount}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
