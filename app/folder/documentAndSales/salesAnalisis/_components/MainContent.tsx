'use client';
import React, { useEffect, useMemo, useState } from 'react'
import ScrollableTable from '../../documents/_components/ScrollableTable'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import { getEmployees } from '@/lib/actions/user.actions';
import { toast } from 'sonner';
import { filterSalesAnalisis, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/salesanalisisSlice';
import { Search } from 'lucide-react';
import SearchFilters from './SearchFilters';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const isReceiptsLoading = useSelector((state: RootState) => state.salesanalisis.isReceiptsLoading);
    const pageNumber = useSelector((state: RootState) => state.salesanalisis.pageNumberReceipts);
    const pageLimit = useSelector((state: RootState) => state.salesanalisis.pageLimitReceipts);
    const receiptsCount = useSelector((state: RootState) => state.salesanalisis.receiptsCount);
    const filterQuery = useSelector((state: RootState) => state.salesanalisis.query);
    const allSalesAnalisis = useSelector((state: RootState) => state.salesanalisis.allSalesAnalisis);
    console.log(allSalesAnalisis, "allSalesAnalisis");
    const [columnSizing, setColumnSizing] = useState({});
    const [allEmployees, setAllEmployees] = useState([]);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

    useEffect(() => {
        dispatch(filterSalesAnalisis({}));
        const getAllEmployees = async () => {
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
            // { accessorKey: "employee.name", header: "Employee", size: 140 },
            { accessorKey: "receiptType", header: "Document", size: 150 },
            { accessorKey: "ticketNumber", header: "Ticket No.", size: 200 },
            { accessorKey: "createdAt", header: "Date", size: 130 },
            { accessorKey: "time", header: "Time", size: 130 },
            { accessorKey: "article.nameAtPurchase", header: "Article", size: 250 },
            { accessorKey: "article.articleCategory", header: "Category", size: 150 },
            { accessorKey: "article.quantityAtPurchase", header: "Qunatity", size: 100 },
            { accessorKey: "article.totalPrice_vatInclude", header: "Price Vat Incl", size: 150 },
            { accessorKey: "employee.name", header: "Employee", size: 140 },
            { accessorKey: "customer.nameDenomination", header: "Customers", size: 250 },
            { accessorKey: "article.singleUnitPrice_vatExclude", header: "Unit Price VAT excl", size: 250 },
            { accessorKey: "article.rateOfVat_atPurchase", header: "VAT %", size: 140 },
            { accessorKey: "article.margin", header: "Margin", size: 140 },
            { accessorKey: "article.supplierName", header: "Supplier", size: 250 },
        ],
        []
    );


    const paginationState = {
        pageIndex: pageNumber - 1,
        pageSize: pageLimit,
    };
console.log(paginationState, "paginationState");
    const totalItems = Number(receiptsCount)
    const table = useReactTable({
        data: allSalesAnalisis,
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
            dispatch(filterSalesAnalisis({
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
            <SearchFilters  employees={allEmployees}/>
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
