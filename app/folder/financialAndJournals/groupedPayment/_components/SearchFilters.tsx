'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/Redux/store'
import cloneDeep from 'lodash/cloneDeep';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTodayInBrussels } from '../../paymentMethod/_components/SearchFilters';
import { filterGroupedPayments, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/groupedPaymentSlice';

const SearchFilters = () => {

    const dispatch = useDispatch<AppDispatch>();

    const grandTotalAmount = useSelector((state: RootState) => state.groupedPayment.grandTotalAmount);
    const pageLimit = useSelector((state: RootState) => state.groupedPayment.pageLimitGroupedPayment);
    const query = useSelector((state: RootState) => state.groupedPayment.query);


    const [selected, setSelected] = useState<string[]>(['receipt', 'invoice']);
    const [dateFrom, setDateFrom] = useState<any>();
    const [dateTo, setDateTo] = useState<any>();

    const [selectedButton, setSelectedButton] = useState("all") // default selected

  const buttons = [
    { label: "All payments", value: "all" },
    { label: "Tickets", value: "receipt" },
    { label: "Invoices", value: "invoice" },
  ]

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
          dispatch(filterGroupedPayments({query:queryObject, limit:pageLimit, page: 1}))
        }else{
          delete queryObject.period;

          dispatch(setQuery(queryObject))
          dispatch(setPageNumber(1)); 
          dispatch(filterGroupedPayments({query:queryObject}))
        }
    }

            const handleButtonChange = (field: string, value: any | boolean) => {
              setSelectedButton(value)
    
              let queryObject:any = cloneDeep(query)
              if(Object.keys(queryObject).length == 0) queryObject = {}
              if(value != 'all') {
                queryObject.receiptType = value
              }
    
              
              if(Object.keys(queryObject).length !=0 && value != 'all'){
    
                dispatch(setQuery(queryObject))
                dispatch(setPageNumber(1));  
                dispatch(filterGroupedPayments({query:queryObject, limit:pageLimit, page: 1}))
              }else{
                delete queryObject.receiptType;
    
                dispatch(setQuery(queryObject))
                dispatch(setPageNumber(1)); 
                dispatch(filterGroupedPayments({query:queryObject}))
              }
          }


  return (
    <>
<div className='pl-4 border-b-2 pb-2 mt-4 flex flex-col LMB:items-center lg:items-end lg:flex-row w-full'>


  <div className='flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[15%]'>
    <p className='font-semibold text-[14px]'>Period of Sale</p>
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

{/* Second Column: Buttons */}
<div className="flex flex-col LMB:w-[80%] ELMB:w-[50%] SMS:w-[33%] ml-4 lg:ml-0">
  <div className="flex-grow" />  {/* <-- this pushes buttons down */}
  <div className="my-4 lg:my-0 flex justify-center gap-4 lg:gap-3">
    {buttons.map((btn) => (
      <button
        key={btn.value}
        onClick={() => handleButtonChange("", btn.value)}
        className={`flex text-[14px] items-center rounded-md py-[5px] px-2 font-medium ${
          selectedButton === btn.value
            ? "bg-sky-500 text-white border-sky-500 hover:bg-sky-500/90"
            : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
        }`}
      >
        {btn.label}
      </button>
    ))}
  </div>
</div>


  {/* Third Column: Total Amount */}
  <div className='flex justify-center gap-2 lg:gap-1 lg:pb-1 lg:flex-col lg:ml-2  lg:justify-start LMB:w-[60%] ELMB:w-[50%] SMS:w-[25%]'>
    <p className='font-semibold text-[14px]'>Total Amount</p>
    <p className='font-semibold text-[14px]'>{grandTotalAmount?.toFixed(2)} €</p>
  </div>

</div>

    </>
  )
}

export default SearchFilters
