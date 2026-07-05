'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/Redux/store'
import cloneDeep from 'lodash/cloneDeep';
import { Calendar, CalendarDays } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { filterCashBook, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/cashBookSlice';
import { convertToISODate, formatToDDMMYYYY, getTodayInBrussels } from '../../paymentMethod/_components/SearchFilters';

const SearchFilters = () => {

    const dispatch = useDispatch<AppDispatch>();

    const grandTotalAmount = useSelector((state: RootState) => state.cashBook.grandTotalAmount);
    const pageLimit = useSelector((state: RootState) => state.cashBook.pageLimitCashBook);
    const query = useSelector((state: RootState) => state.cashBook.query);


     const [periodFilter, setPeriodFilter] = useState<any>();
    const [activeView, setActiveView] = useState<"period" | "date">("period")
    const [date, setDate] = useState<any>();

    function getYearMonth(monthName: string): string | null {
  const date = new Date();
  const year = date.getFullYear();

  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  
  if (isNaN(monthIndex)) return null; // invalid month name

  const formattedMonth = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${formattedMonth}`;
}



    const handlePeriodChange = (field: string, value: any | boolean) => {
        setPeriodFilter(value)

        
        let queryObject:any = cloneDeep(query)
        if(Object.keys(queryObject).length == 0) queryObject = {}
        if(value) {
          const val = getYearMonth(value.toLowerCase()) 
          queryObject.period = val
        }
        
        if(Object.keys(queryObject).length !=0 && value){

          dispatch(setQuery(queryObject))
          dispatch(setPageNumber(1));  
          dispatch(filterCashBook({query:queryObject, limit:pageLimit, page: 1}))
        }else if(!value){
          delete queryObject.period;

          dispatch(setQuery({}))
          dispatch(setPageNumber(1)); 
          dispatch(filterCashBook({}))
        }
    }

            const handleDateChange = (field: string, value: any | boolean) => {
              if(field == 'date') setDate(value)

                        
              let queryObject:any = cloneDeep(query)
              if(Object.keys(queryObject).length == 0) queryObject = {}
    
              if(value && field == 'date') {
                const val = formatToDDMMYYYY(value) 
                queryObject.createdAt = val
              }
              
              if(!value && (field == 'date')) {
                const today = getTodayInBrussels() 
                queryObject.createdAt = today
                setDate(convertToISODate(today))
              }
    
              if(Object.keys(queryObject).length !=0){
    
                dispatch(setQuery(queryObject))
                dispatch(setPageNumber(1));  
                dispatch(filterCashBook({query:queryObject, limit:pageLimit, page: 1}))
              }else{
                delete queryObject.createdAt;
    
                dispatch(setQuery(queryObject))
                dispatch(setPageNumber(1)); 
                dispatch(filterCashBook({query:queryObject}))
              }
          }

  const handleFilterChange = (filter:any) => {
    if(filter == 'period'){
      setActiveView("period")
      handlePeriodChange("", "")
    }else if(filter == 'date'){
      setActiveView("date")
      handleDateChange("date", "")
    }
  }

  return (
    <>
<div className='pl-4 border-b-2 pb-2 mt-4 flex flex-col LMB:items-center lg:items-end lg:flex-row w-full'>

<div className="flex flex-col LMB:w-[60%] ELMB:w-[50%] gap-2 SMS:w-[25%]">
      <p className="font-semibold text-[14px]">Period</p>

      <div className="flex gap-2">
       
        <div className="flex">
          <button
            onClick={() => handleFilterChange("period")}
            className={cn(
              "py-[1px] px-[6px] rounded-sm",
              activeView === "period" ? "bg-gray-200" : "bg-transparent"
            )}
          >
            <Calendar />
          </button>

          <button
            onClick={() => handleFilterChange("date")}
            className={cn(
              "py-[1px] px-[6px] rounded-sm",
              activeView === "date" ? "bg-gray-200" : "bg-transparent"
            )}
          >
            <CalendarDays />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-4 w-full">
          {activeView === "period" ? (
            <Select
              value={periodFilter}
              onValueChange={(val) => handlePeriodChange("", val)}
            >
              <SelectTrigger id="searchFilter">
                <SelectValue className="text-[14px]" placeholder="All Periods" />
              </SelectTrigger>
              <SelectContent className="h-[9.5rem] text-[14px]">
                <SelectItem value="">All Periods</SelectItem>
                <SelectItem value="january">January</SelectItem>
                <SelectItem value="february">February</SelectItem>
                <SelectItem value="march">March</SelectItem>
                <SelectItem value="april">April</SelectItem>
                <SelectItem value="may">May</SelectItem>
                <SelectItem value="june">June</SelectItem>
                <SelectItem value="july">July</SelectItem>
                <SelectItem value="august">August</SelectItem>
                <SelectItem value="september">September</SelectItem>
                <SelectItem value="october">October</SelectItem>
                <SelectItem value="november">November</SelectItem>
                <SelectItem value="december">December</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="date"
              value={typeof date !== "object" ? date : ""}
              // onChange={(e) => setDate(e.target.value)}
              onChange={(e) => handleDateChange("date", e.target.value)}
              className={cn(
                "w-full md:max-w-sm placeholder:text-gray-300 border border-gray-200",
                "date-icon-right"
              )}
            />
          )}
        </div>
      </div>
    </div>



  <div className='flex justify-center gap-2 lg:gap-1 lg:pb-1 lg:flex-col mt-2 lg:ml-8  lg:justify-start LMB:w-[60%] ELMB:w-[50%] SMS:w-[25%]'>
    <p className='font-semibold text-[14px]'>Cash Total</p>
    <p className='font-semibold text-[14px]'>{grandTotalAmount?.toFixed(2)} €</p>
  </div>

</div>

    </>
  )
}

export default SearchFilters
