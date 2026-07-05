'use client';
import React, { useEffect, useMemo, useState } from 'react'
// import SearchFilters from './SearchFilters'
// import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import SearchFilters from './SearchFilters';
import { filterBookIncome, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/bookIncomeSlice';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector((state: RootState) => state.bookIncome.allData);
    const isReceiptsLoading = useSelector((state: RootState) => state.bookIncome.isBookIncomeLoading);
    const pageNumber = useSelector((state: RootState) => state.bookIncome.pageNumberBookIncome);
    const pageLimit = useSelector((state: RootState) => state.bookIncome.pageLimitBookIncome);
    const bookIncomesCount = useSelector((state: RootState) => state.bookIncome.totalCount);
    const filterQuery = useSelector((state: RootState) => state.bookIncome.query);

    const [columnSizing, setColumnSizing] = useState({});


    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

      useEffect(() => {
        dispatch(filterBookIncome({}));
      }, []);

      const hasDecimal = (num: number) => num.toString().includes(".");
      const numberCell = ({ getValue }: { getValue: () => any }) => {
      const val = getValue();
      return typeof val === "number" && val > 0 && hasDecimal(val) ? val.toFixed(2) : val;
      };
        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "ticketsCreatedDate", header: "Date", size: 150 },
            { accessorKey: "totalAmountVatExcl", header: "Amount VAT excl", size: 180, cell: numberCell },
            { accessorKey: "totalVatAmount", header: "VAT", size: 150, cell: numberCell },
            { accessorKey: "totalAmountVatIncl", header: "Amount", size: 200 , cell: numberCell},
            { accessorKey: "totalBasePrice_1", header: "Base 1", size: 140 , cell: numberCell},
            { accessorKey: "totalBasePrice_2", header: "Base 2", size: 140 , cell: numberCell},
            { accessorKey: "totalBasePrice_3", header: "Base 3", size: 140 , cell: numberCell},
            { accessorKey: "totalBasePrice_4", header: "Base 4", size: 140 , cell: numberCell},
            { accessorKey: "totalVat1AppliedAmount", header: "VAT 1", size: 140 , cell: numberCell},
            { accessorKey: "totalVat2AppliedAmount", header: "VAT 2", size: 140 , cell: numberCell},
            { accessorKey: "totalVat3AppliedAmount", header: "VAT 3", size: 140 , cell: numberCell},
            { accessorKey: "totalVat4AppliedAmount", header: "VAT 4", size: 140 , cell: numberCell},
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    

      const totalItems = Number(bookIncomesCount)
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
              dispatch(filterBookIncome({
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
      
      <div className="w-[100%] NLP:w-[95%] pt-4 px-4 NLP:px-0 NLP:pl-4">
          <ScrollableTable 
          table={table}
          isDataLoading={isReceiptsLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={bookIncomesCount}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
