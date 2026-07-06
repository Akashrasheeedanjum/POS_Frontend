import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { HashLoader } from "react-spinners";
import { cn } from '@/lib/utils';
import { flexRender, Table } from '@tanstack/react-table';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/app/Redux/store';
import { usePathname } from 'next/navigation';

interface DataTableProps {
  table: Table<any>;
  isUserLoading: boolean;
  editModalOpen: ({ isModalOpen, userData }: { isModalOpen: boolean, userData: any }) => any;
  pageNumber: number;
  pageLimit: number;
  usersCount: number | undefined;
  pageSizeOptions?: number[];
  selectCustomerForDocument?: ({ userData }: { userData: any }) => any
}

const DataTable = ({
  table,
  isUserLoading,
  editModalOpen,
  pageNumber,
  pageLimit,
  usersCount,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
  selectCustomerForDocument
}: DataTableProps) => {

  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

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


  const paginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageLimit,
  };

    const totalItems = Number(usersCount)

    const smallTablesPaths = [
  '/folder/documentAndSales',
  '/dashboard/sales'
];
  return (
    <>
      {/* toggle button */}
      {table?.getRowModel()?.rows?.length ? (
        <details className="self-start relative mt-4 border rounded p-2 w-fit bg-white dark:bg-white dark:text-black">
          <summary className="cursor-pointer text-[12px] font-medium">Toggle Columns</summary>
          {/* <div className="absolute left-0 mt-1 z-50 w-max rounded border bg-white p-2 shadow-md"> */}
          <div className="absolute left-0 mt-1 z-50 w-max rounded border bg-white p-2 shadow-md h-40 overflow-y-auto scrollbar-custom">
            {table.getAllColumns()?.map((column) => (
              <div key={column.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                <label className="capitalize">{column.columnDef.header?.toString?.() ?? column.id}</label>
              </div>
            ))}
          </div>
        </details>
      ) : null}

{/* resizeable table */}
  {/* <div ref={tableRef} className="w-[280px] LMB:w-[400px] ELMB:w-[600px] md:w-[500px] lg:w-[900px] rounded-md border overflow-x-auto overflow-y-scroll scrollbar-custom h-[400px]"> */}
  {/* <div ref={tableRef} className={`${open ? 'w-[280px] LMB:w-[400px] ELMB:w-[600px] md:w-[475px] lg:w-[730px] NLP:w-[960px] LS:w-[1150px] ELS:w-[1300px]': 'w-[280px] LMB:w-[400px] ELMB:w-[600px] md:w-[680px] lg:w-[950px] NLP:w-[1200px] LS:w-[1350px] ELS:w-[1500px]'} rounded-md border overflow-x-auto overflow-y-scroll  h-[400px]`}> */}
  <div ref={tableRef} className={`w-full rounded-md border overflow-x-auto overflow-y-auto scrollbar-custom max-h-full ${smallTablesPaths.some(path => pathname.includes(path)) ? 'h-[min(200px,40vh)] sm:h-[200px]': 'h-[min(400px,55vh)] sm:h-[400px]'}`}>
    
    {isUserLoading ? (
        <div className='w-full h-full flex flex-col justify-center items-center'>
        <HashLoader color="#E4D8D2" size={60}/>
        </div>
  ) : (<>
  
  {/* Sticky Table Header (not scrollable) */}
{table?.getRowModel()?.rows?.length ? (
  <>
  <div className="sticky top-0 z-30">
    <table
      className="min-w-full bg-white dark:bg-white dark:text-black"
      style={{
        width:
          table
            .getHeaderGroups()?.[0]
            ?.headers?.reduce((total, header) => total + header.getSize(), 0) ?? '100%',
      }}
    >
      <thead >
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
                </table>
              </div>

              {/* Scrollable Table Body */}
              <div className="max-h-[calc(80vh-220px)] md:max-h-[calc(90dvh-240px)]">

                <table
                  className="min-w-full"
                  style={{
                    width:
                      table
                        .getHeaderGroups()?.[0]
                        ?.headers?.reduce((total, header) => total + header.getSize(), 0) ?? '100%',
                  }}
                >
                  <tbody>
                    {/* {table?.getRowModel()?.rows?.length ? ( */}
                    {table?.getRowModel().rows?.map((row) => (
                      <tr
                        onClick={() => {
                          setSelectedRowId(row.id);
                          if (selectCustomerForDocument) {
                            dispatch(selectCustomerForDocument({ userData: row.original }))
                          }
                        }}
                        key={row.id}
                        data-state={row.getIsSelected() ? 'selected' : undefined}
                        className={cn('', row.id === selectedRowId && 'bg-muted dark:bg-gray-800', 'cursor-pointer hover:bg-muted/50 transition-colors')}
                        onDoubleClick={() => {

                          // setSelectedRowData(row.original); // for viewing only in the modal
                          // dispatch(setOpenEditModal(true));
                          dispatch(editModalOpen({ isModalOpen: true, userData: row.original }))
                        }}
                      >
                        {row.getVisibleCells()?.map((cell) => (
                          <td
                            key={cell.id}
                            style={{
                              width: `${cell.column.getSize()}px`,
                            }}
                            className="p-2 align-middle ml-4 border-r border-gray-200 dark:border-gray-700"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                      // ) : (
                      //   <tr>
                      //     <td colSpan={columns.length} className="h-24 text-center">
                      //       No results.
                      //     </td>
                      //   </tr>
                      // )
                    }
                  </tbody>
                </table>
              </div>
            </>) : (<div className='w-full h-full flex flex-col justify-center items-center'>
              <h2 className='text-red-500 text-[1.25rem]'>No record available...</h2>
            </div>)}
        </>)}
      </div>

      {/* pagination */}


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
    </>
  )
}

export default DataTable
