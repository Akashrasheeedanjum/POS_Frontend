'use client';
import React, { useEffect, useMemo, useState } from 'react'
// import SearchFilters from './SearchFilters'
// import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import SearchFilters from './SearchFilters';
import { filterCashBook, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/cashBookSlice';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector((state: RootState) => state.cashBook.allData);
    const isCashBookLoading = useSelector((state: RootState) => state.cashBook.isCashBookLoading);
    const pageNumber = useSelector((state: RootState) => state.cashBook.pageNumberCashBook);
    const pageLimit = useSelector((state: RootState) => state.cashBook.pageLimitCashBook);
    const cashBookCount = useSelector((state: RootState) => state.cashBook.totalCount);
    const filterQuery = useSelector((state: RootState) => state.cashBook.query);

    const [columnSizing, setColumnSizing] = useState({});


    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

      useEffect(() => {
        dispatch(filterCashBook({}));
      }, []);

      const hasDecimal = (num: number) => num.toString().includes(".");

      const numberCell = ({ getValue }: { getValue: () => any }) => {
      const val = getValue();
      return typeof val === "number" && val > 0 && hasDecimal(val) ? val.toFixed(2) : val;
      };

function formatDate(info: any) {
  const dateString = info.getValue(); // <-- this is your "documentDate" string
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return ""; // guard for invalid dates

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatTime(info: any) {
  const dateString = info.getValue();
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`; // 24-hour format
}


        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "documentDate", header: "Document date", size: 180, cell: formatDate},
            { accessorKey: "documentDate", header: "Time", size: 150, cell: formatTime },
            { accessorKey: "document", header: "Document", size: 150 },
            { accessorKey: "documentNbr", header: "N°", size: 200 },
            { accessorKey: "employee", header: "Employee", size: 200 },
            { accessorKey: "paymentAmount", header: "Amount", size: 140 , cell: numberCell},
            { accessorKey: "paymentMethod", header: "Payment method", size: 140 },
            { accessorKey: "", header: "Part", size: 220}
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    

      const totalItems = Number(cashBookCount)
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
              dispatch(filterCashBook({
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
          isDataLoading={isCashBookLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={cashBookCount}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
