'use client';
import React, { useEffect, useMemo, useState } from 'react'
// import SearchFilters from './SearchFilters'
// import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import SearchFilters from './SearchFilters';
import { filterGroupedPayments, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/groupedPaymentSlice';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector((state: RootState) => state.groupedPayment.allData);
    const isGroupedPaymentLoading = useSelector((state: RootState) => state.groupedPayment.isGroupedPaymentLoading);
    const pageNumber = useSelector((state: RootState) => state.groupedPayment.pageNumberGroupedPayment);
    const pageLimit = useSelector((state: RootState) => state.groupedPayment.pageLimitGroupedPayment);
    const groupedPaymentCount = useSelector((state: RootState) => state.groupedPayment.totalCount);
    const filterQuery = useSelector((state: RootState) => state.groupedPayment.query);

    const [columnSizing, setColumnSizing] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

      useEffect(() => {
        dispatch(filterGroupedPayments({}));
      }, []);

      const hasDecimal = (num: number) => num.toString().includes(".");

      const numberCell = ({ getValue }: { getValue: () => any }) => {
      const val = getValue();
      return typeof val === "number" && val > 0 && hasDecimal(val) ? val.toFixed(2) : val;
      };


        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "methodName", header: "Payment Method", size: 150 },
            { accessorKey: "totalAmount", header: "Amount", size: 180, cell: numberCell},
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    

      const totalItems = Number(groupedPaymentCount)
          const table = useReactTable({
            data: allData,
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
              dispatch(filterGroupedPayments({
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
      <SearchFilters />
           <div className='flex flex-col items-center lg:items-start NLP:flex-row gap-4 LS:justify-center'>
      
      <div className="w-[100%] md:w-[50%]  pt-4 px-4 md:px-0 md:pl-4">
          <ScrollableTable 
          table={table}
          isDataLoading={isGroupedPaymentLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={groupedPaymentCount}
          paginateOnSmall={true}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
