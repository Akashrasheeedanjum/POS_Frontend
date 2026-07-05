'use client';
import { AppDispatch } from '@/app/Redux/store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { flexRender, Table } from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { HashLoader } from 'react-spinners';

interface DataTableProps {
  table: Table<any>;
  isDataLoading?: boolean;
  editModalOpen?: ({ isModalOpen, userData }: { isModalOpen: boolean, userData: any }) => any;
  pageNumber: number;
  pageLimit: number;
  dataCount: number | undefined;
  pageSizeOptions?: number[];
  selectRowDataForRedux?: ({ data }: { data: any }) => any
  noFoundMessage?: any;
  paginateOnSmall?: boolean
}

const ScrollableTable = ({
    table,
    isDataLoading,
    editModalOpen, 
    pageNumber, 
    pageLimit, 
    dataCount,
    pageSizeOptions = [5, 10, 20, 30, 40, 50],
    selectRowDataForRedux,
    noFoundMessage,
    paginateOnSmall = false
}: DataTableProps) => {

  const paginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageLimit,
  };

  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const totalItems = Number(dataCount)
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        setSelectedRowId(null); // clear selection
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="">
        <div ref={tableRef} className="max-h-[400px] min-h-[300px] w-[100%] max-w-[100%]  overflow-x-auto scrollbar-custom  border border-gray-300 rounded-md">
        {isDataLoading ? (
        <div className='w-full h-[300px] flex flex-col justify-center items-center'>
        <HashLoader color="#E4D8D2" size={60}/>
        </div>
  ) : (
    <>
    {table?.getRowModel()?.rows?.length ? (
          <table className=""
          style={{
        width:table.getHeaderGroups()?.[0]?.headers?.reduce((total, header) => total + header.getSize(), 0) ?? '100%',
         }}
          >

                  <thead className="sticky top-0 z-30 bg-white dark:bg-white dark:text-black border-b">
                    {table.getHeaderGroups()?.map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers?.map((header) => (
                          <th
                            key={header.id}
                            style={{
                              width: `${header.getSize()}px`,
                              position: 'relative',
                            }}
                            // className={`relative group border-b p-2 text-left font-medium ${header.id === 'actions'? 'pl-8': ''}`}
                            className={`relative group border-b py-2 px-2 md:font-medium text-center align-middle ${header.id === 'actions' ? '' : ''}`}

                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanResize() && (
                              <div
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                                className={cn(
                                  'absolute right-0 top-0 h-full w-1 cursor-col-resize bg-transparent group-hover:bg-muted',
                                  header.column.getIsResizing() && 'bg-primary'
                                )}
                              />
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

            <tbody>
          {table?.getRowModel().rows?.map((row) => (
            <tr
            onClick={() => {
            setSelectedRowId(row.id);
            if(selectRowDataForRedux){
              selectRowDataForRedux({data: row.original})
            }
            }}
              key={row.id}
              data-state={row.getIsSelected() ? 'selected' : undefined}
              className={cn('',row.id === selectedRowId && 'bg-muted dark:bg-gray-800', 'cursor-pointer hover:bg-muted/50 transition-colors')}
                onDoubleClick={() => {
                
                // setSelectedRowData(row.original); // for viewing only in the modal
                // dispatch(setOpenEditModal(true));
                // dispatch(editModalOpen({isModalOpen:true, userData:row.original}))
              }}
            >
              {row.getVisibleCells()?.map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    width: `${cell.column.getSize()}px`,
                  }}
                  className={`p-2 align-middle ml-4 border-r border-gray-200 dark:border-gray-700 text-center
                          ${
                    cell.column.id === 'balanceDue' &&
                    (cell.getValue() as number) != 0
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
            </tbody>
          </table>
    ) : (<div className='w-full h-[300px] flex flex-col justify-center items-center'>
      <h2 className='text-red-500 text-[1.25rem]'>{noFoundMessage ? noFoundMessage : 'No record available...'}</h2>
  </div>)}
    </>
      )}
        </div>
      </div>

      {!paginateOnSmall ? 
             <div className="w-full flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row">
            <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 w-full items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                {totalItems > 0 ? (
                  <>
                    Showing{' '}
                    {paginationState.pageIndex * paginationState.pageSize + 1} to{' '}
                    {Math.min((paginationState.pageIndex + 1) * paginationState.pageSize, totalItems)}{' '}
                    of {totalItems} entries
                  </>
                ) : (
                  'No entries found'
                )}
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                  <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${paginationState.pageSize}`}
                    onValueChange={(value) => table.setPageSize(Number(value))} // ✅ Keeps logic same but now changes pageLimit in context
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={paginationState.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {pageSizeOptions?.map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
      
            <div className="flex w-full items-center justify-between gap-2 sm:justify-end">
              <div className="flex w-[150px] items-center justify-center text-sm font-medium">
                {totalItems > 0 ? (
                  <>Page {paginationState.pageIndex + 1} of {table.getPageCount()}</>
                ) : (
                  'No pages'
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        :
        <div className="w-full flex flex-col items-center justify-end gap-2 space-x-2 py-4 sm:flex-row md:flex-col">
            <div className="flex flex-col  gap-2 lg:gap-0 w-full items-center justify-between">
              <div className="flex-1 text-sm text-muted-foreground">
                {totalItems > 0 ? (
                  <>
                    Showing{' '}
                    {paginationState.pageIndex * paginationState.pageSize + 1} to{' '}
                    {Math.min((paginationState.pageIndex + 1) * paginationState.pageSize, totalItems)}{' '}
                    of {totalItems} entries
                  </>
                ) : (
                  'No entries found'
                )}
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                  <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
                  <Select
                    value={`${paginationState.pageSize}`}
                    onValueChange={(value) => table.setPageSize(Number(value))} // ✅ Keeps logic same but now changes pageLimit in context
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={paginationState.pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {pageSizeOptions?.map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
      
            <div className="flex w-full items-center justify-center gap-2">
              <div className="flex w-[150px] items-center justify-center text-sm font-medium">
                {totalItems > 0 ? (
                  <>Page {paginationState.pageIndex + 1} of {table.getPageCount()}</>
                ) : (
                  'No pages'
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <DoubleArrowLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <DoubleArrowRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
      }
      </>
  )
}

export default ScrollableTable
