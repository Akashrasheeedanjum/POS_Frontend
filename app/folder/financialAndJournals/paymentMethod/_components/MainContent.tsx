'use client';
import React, { useEffect, useMemo, useState } from 'react'
// import SearchFilters from './SearchFilters'
// import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import SearchFilters, { getTodayInBrussels } from './SearchFilters';
import { filterPaymentMethods, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/paymentMethodsSlice';


export function formatDate(info: any) {
  const dateString = info.getValue(); // <-- this is your "documentDate" string
  const date = new Date(dateString);

  if (isNaN(date.getTime())) return ""; // guard for invalid dates

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatTime(info: any) {
  const dateString = info.getValue();
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`; // 24-hour format
}

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector((state: RootState) => state.paymentMethods.allData);
    const isPaymentMethodsLoading = useSelector((state: RootState) => state.paymentMethods.isPaymentMethodsLoading);
    const pageNumber = useSelector((state: RootState) => state.paymentMethods.pageNumberPaymentMethods);
    const pageLimit = useSelector((state: RootState) => state.paymentMethods.pageLimitPaymentMethods);
    const paymentMethodsCount = useSelector((state: RootState) => state.paymentMethods.totalCount);
    const filterQuery = useSelector((state: RootState) => state.paymentMethods.query);

    const [columnSizing, setColumnSizing] = useState({});


    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

    const today = getTodayInBrussels()

    const intialQuery = {
      periodFrom: today,
      periodTO: today,
    }

      useEffect(() => {
        dispatch(filterPaymentMethods({query: intialQuery}));
      }, []);

      const hasDecimal = (num: number) => num.toString().includes(".");

      const numberCell = ({ getValue }: { getValue: () => any }) => {
      const val = getValue();
      return typeof val === "number" && val > 0 && hasDecimal(val) ? val.toFixed(2) : val;
      };




        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "transaction", header: "Transaction", size: 150 },
            { accessorKey: "documentDate", header: "Document date", size: 180, cell: formatDate},
            { accessorKey: "documentDate", header: "Time", size: 150, cell: formatTime },
            { accessorKey: "documentNbr", header: "Document nbr", size: 200 },
            { accessorKey: "paymentDate", header: "Payment date", size: 140, cell: formatDate },
            { accessorKey: "paymentMethod", header: "Payment method", size: 140 },
            { accessorKey: "paymentAmount", header: "Amount", size: 140 , cell: numberCell},
            { accessorKey: "register", header: "Register", size: 140},
            { accessorKey: "employee", header: "Employee", size: 140},
            { accessorKey: "part", header: "Part", size: 220}
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    

      const totalItems = Number(paymentMethodsCount)
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
              dispatch(filterPaymentMethods({
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
          isDataLoading={isPaymentMethodsLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={paymentMethodsCount}
          noFoundMessage={'No record! Try changing filter!'}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
