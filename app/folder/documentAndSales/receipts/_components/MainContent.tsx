'use client';
import React, { useEffect, useMemo, useState } from 'react'
import SearchFilters from './SearchFilters'
import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { filterReceipts, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/receiptSlice';
import { getEmployees } from '@/lib/actions/user.actions';
import { toast } from 'sonner';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allReceipts = useSelector((state: RootState) => state.receipt.allReceipts);
    const isReceiptsLoading = useSelector((state: RootState) => state.receipt.isReceiptsLoading);
    const pageNumber = useSelector((state: RootState) => state.receipt.pageNumberReceipts);
    const pageLimit = useSelector((state: RootState) => state.receipt.pageLimitReceipts);
    const receiptsCount = useSelector((state: RootState) => state.receipt.receiptsCount);
    const filterQuery = useSelector((state: RootState) => state.receipt.query);

    const [columnSizing, setColumnSizing] = useState({});
    const [allEmployees, setAllEmployees] = useState([]);


    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

      useEffect(() => {
        dispatch(filterReceipts({}));
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
            { accessorKey: "register", header: "Register", size: 50 },
            { accessorKey: "employee.name", header: "Employee", size: 140 },
            { accessorKey: "receiptType", header: "Document", size: 150 },
            { accessorKey: "ticketNumber", header: "Ticket No.", size: 200 },
            { accessorKey: "createdAt", header: "Created Date", size: 130 },
            { accessorKey: "totalAmount_VatIncluded", header: "Total Amount", size: 140 },
            { accessorKey: "paymentMethod", header: "Payment Method", size: 150 },
            { accessorKey: "customer.nameDenomination", header: "Customers", size: 200 },
            { accessorKey: "totalAmount_VatExcluded", header: "Amount VAT excl", size: 150 },
            { accessorKey: "totalVat_amount", header: "VAT Amount", size: 140 },
            { accessorKey: "vatVersionLabel", header: "VAT Version", size: 250 },
            { accessorKey: "basePrice_withoutVat_1", header: "Base 1", size: 140 },
            { accessorKey: "basePrice_withoutVat_2", header: "Base 2", size: 140 },
            { accessorKey: "basePrice_withoutVat_3", header: "Base 3", size: 140 },
            { accessorKey: "basePrice_withoutVat_4", header: "Base 4", size: 140 },
            { accessorKey: "vat1_appliedAmount", header: "VAT 1", size: 140 },
            { accessorKey: "vat2_appliedAmount", header: "VAT 2", size: 140 },
            { accessorKey: "vat3_appliedAmount", header: "VAT 3", size: 140 },
            { accessorKey: "vat4_appliedAmount", header: "VAT 4", size: 140 },
          ],
          []
        );


      const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
      };
    
        const totalItems = Number(receiptsCount)
          const table = useReactTable({
            data: allReceipts,
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
              dispatch(filterReceipts({
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
          isDataLoading={isReceiptsLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={receiptsCount}
          />
          </div>
            </div>
    </div>
  )
}

export default MainContent
