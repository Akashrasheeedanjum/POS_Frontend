'use client';
import React, { useEffect, useMemo, useState } from 'react'
// import SearchFilters from './SearchFilters'
// import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import SearchFilters from './SearchFilters';
import { filterSalesJournal, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/salesJournalSlice';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector((state: RootState) => state.salesJournal.allData);
    const isSalesJournalLoading = useSelector((state: RootState) => state.salesJournal.isSalesJournalLoading);
    const pageNumber = useSelector((state: RootState) => state.salesJournal.pageNumberSalesJournal);
    const pageLimit = useSelector((state: RootState) => state.salesJournal.pageLimitSalesJournal);
    const salesJournalCount = useSelector((state: RootState) => state.salesJournal.totalCount);
    const filterQuery = useSelector((state: RootState) => state.salesJournal.query);

    const [columnSizing, setColumnSizing] = useState({});


    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

      useEffect(() => {
        dispatch(filterSalesJournal({}));
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


        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "createdAt", header: "Date", size: 150, cell: formatDate },
            { accessorKey: "receiptType", header: "Document", size: 150 },
            { accessorKey: "ticketNumber", header: "N°", size: 200 },
            { accessorKey: "customerName", header: "Customers", size: 200 },
            { accessorKey: "", header: "N° TVA/ SIREN", size: 200 },
            { accessorKey: "totalAmount_VatExcluded", header: "Amount VAT excl", size: 180, cell: numberCell },
            { accessorKey: "totalVat_amount", header: "VAT", size: 180, cell: numberCell },
            { accessorKey: "totalAmount_VatIncluded", header: "Amount", size: 180, cell: numberCell},
            { accessorKey: "basePrice_withoutVat_1", header: "Base 1", size: 180, cell: numberCell },
            { accessorKey: "basePrice_withoutVat_2", header: "Base 2", size: 180, cell: numberCell },
            { accessorKey: "basePrice_withoutVat_3", header: "Base 3", size: 180, cell: numberCell },
            { accessorKey: "basePrice_withoutVat_4", header: "Base 4", size: 180, cell: numberCell },
            { accessorKey: "vat1_appliedAmount", header: "VAT 1", size: 180, cell: numberCell },
            { accessorKey: "vat2_appliedAmount", header: "VAT 2", size: 180, cell: numberCell },
            { accessorKey: "vat3_appliedAmount", header: "VAT 3", size: 180, cell: numberCell },
            { accessorKey: "vat4_appliedAmount", header: "VAT 4", size: 180, cell: numberCell },
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    

      const totalItems = Number(salesJournalCount)
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
              dispatch(filterSalesJournal({
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
          isDataLoading={isSalesJournalLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={salesJournalCount}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
