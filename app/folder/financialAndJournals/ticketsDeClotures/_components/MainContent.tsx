'use client';
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { ColumnDef, ColumnResizeMode, getCoreRowModel, getPaginationRowModel, useReactTable, VisibilityState } from '@tanstack/react-table';
import ScrollableTable from '@/app/folder/documentAndSales/documents/_components/ScrollableTable';
import SearchFilters from './SearchFilters';
import { filterTicketDeCloture, setPageLimit, setPageNumber } from '@/app/Redux/Slices/folder/ticketDeCloture';
import { formatDate, formatTime } from '../../paymentMethod/_components/MainContent';
import ReceiptTemplate from '@/app/dashboard/lastClosing/_components/ReceiptTemplate';
import { fetchSingleZReport, filterLastClosing, selectRowDataForRedux } from '@/app/Redux/Slices/lastClosingSlice';
import { BounceLoader, ClockLoader, HashLoader } from 'react-spinners';

const MainContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allData = useSelector((state: RootState) => state.ticketDeCloture.allData);
    const isGroupedPaymentLoading = useSelector((state: RootState) => state.ticketDeCloture.isTicketDeClotureLoading);
    const pageNumber = useSelector((state: RootState) => state.ticketDeCloture.pageNumberTicketDeCloture);
    const pageLimit = useSelector((state: RootState) => state.ticketDeCloture.pageLimitTicketDeCloture);
    const groupedPaymentCount = useSelector((state: RootState) => state.ticketDeCloture.totalCount);
    const filterQuery = useSelector((state: RootState) => state.ticketDeCloture.query);

    const reportData = useSelector((state: RootState) => state.lastClosing.data);
    const isLastClosingLoading = useSelector((state: RootState) => state.lastClosing.isLastClosingLoading);
    
    const selectedRowDataForRedux = useSelector((state: RootState) => state.lastClosing.selectedRowDataForRedux);
    const isSingleZReportLoading = useSelector((state: RootState) => state.lastClosing.isSingleZReportLoading);
    const singleZReportData = useSelector((state: RootState) => state.lastClosing.singleZReportData);

    const [columnSizing, setColumnSizing] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    });

    console.log('selectedRowDataForRedux de cloture', selectedRowDataForRedux)
      useEffect(() => {
        if(selectedRowDataForRedux){
          dispatch(fetchSingleZReport(selectedRowDataForRedux?._id))
        }else{
          dispatch(filterLastClosing({}));
          dispatch(filterTicketDeCloture({}));
        }
      }, [selectedRowDataForRedux]);
      

        const columns = useMemo<ColumnDef<any>[]>(
          () => [
            { accessorKey: "reportNumber", header: "Report Number", size: 150 },
            { accessorKey: "createdAt", header: "Date", size: 150, cell: formatDate },
            { accessorKey: "createdAt", header: "Time", size: 150, cell: formatTime },
            { accessorKey: "employeeName", header: "User", size: 150 },
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

              dispatch(filterTicketDeCloture({
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

          
  const handleSelectDocument = ({ data }: { data: any }) => {
    console.log('data in ticket de cloture', data)
   
    dispatch(selectRowDataForRedux({data: data}))
    // console.log("Parent received selected document:", userData);
  };
  return (
    <div className=" h-[calc(100dvh-56px)] overflow-y-auto scrollbar-custom">
      <SearchFilters />
           <div className='flex flex-col items-center md:items-start NLP:flex-row gap-4 LS:justify-center'>
      
      <div className="w-[100%] md:w-[80%] NLP:w-[50%] pt-4 px-4 md:px-0 md:pl-4">
          <ScrollableTable 
          table={table}
          isDataLoading={isGroupedPaymentLoading}
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          dataCount={groupedPaymentCount}
          paginateOnSmall={true}
          selectRowDataForRedux={handleSelectDocument}
          />
          </div>

            <div
              className="
                mt-1 max-h-[75vh] w-[90%] md:w-[80%] NLP:w-[50%] flex flex-col
                overflow-auto scrollbar-custom
                lg:px-2 pb-10 py-3 
              "
            >
              <div className="flex justify-center h-full overflow-x-hidden scrollbar-custom">
              {singleZReportData[0] && Object.keys(singleZReportData[0]).length > 0 ?   
                   <ReceiptTemplate data={singleZReportData[0]} 
                   styles={"bg-gray-500 text-white"}
                   />
                  : 
                <div       
                className={[
                  "bg-gray-500 text-white",
                  "rounded-sm border border-border",
                  "mx-auto",
                  "lg:p-[18px]",
                  "shadow-sm",
                  "overflow-x-auto lg:overflow-x-hidden",
                  "h-[60vh]",
                  "w-[550px]",
                  "font-mono text-[13px] leading-5 whitespace-pre",
                  "scrollbar-custom",
                  
                ].join(" ")}>
                  <div className='h-full flex justify-center items-center'>
                    {isSingleZReportLoading ? 
                  <ClockLoader color="#f6f5fa" size={60} speedMultiplier={2}/>
                  :  
                  <p>Select a row from table and wait!</p>
                  }
                  </div>
                </div>}
              </div>
            </div>
        </div>
    </div>
  )
}

export default MainContent
