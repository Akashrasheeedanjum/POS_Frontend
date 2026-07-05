'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/Redux/store'
import cloneDeep from 'lodash/cloneDeep';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { filterTicketDeCloture, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/ticketDeCloture';

const SearchFilters = () => {

    const dispatch = useDispatch<AppDispatch>();

    const pageLimit = useSelector((state: RootState) => state.ticketDeCloture.pageLimitTicketDeCloture);
    const query = useSelector((state: RootState) => state.ticketDeCloture.query);

     const [periodFilter, setPeriodFilter] = useState<any>();


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
          dispatch(filterTicketDeCloture({query:queryObject, limit:pageLimit, page: 1}))
        }else{
          delete queryObject.period;

          dispatch(setQuery(queryObject))
          dispatch(setPageNumber(1)); 
          dispatch(filterTicketDeCloture({query:queryObject}))
        }
    }


  return (
    <>
<div className='pl-4 border-b-2 pb-2 mt-4 flex flex-col LMB:items-center lg:items-end lg:flex-row w-full'>


  <div className='flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[15%]'>
    <p className='font-semibold text-[14px]'>Period</p>
    <div className='mt-2 flex items-center gap-4'>
  <div className='w-full'>
  <Select 
  value={periodFilter} onValueChange={(val) => handlePeriodChange("", val)}
  >
    <SelectTrigger className='' id="searchFilter">
      <SelectValue className='text-[14px]' placeholder="All Periods" />
    </SelectTrigger>
    <SelectContent className='h-[9.5rem] text-[14px]'>
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
  </div>
  </div>
  </div>

    {/* <p>{selectedRowDataForRedux}</p> */}
</div>

    </>
  )
}

export default SearchFilters
