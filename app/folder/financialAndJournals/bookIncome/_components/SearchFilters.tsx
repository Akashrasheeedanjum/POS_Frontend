'use client';
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/Redux/store'
import { filterBookIncome, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/bookIncomeSlice';
import cloneDeep from 'lodash/cloneDeep';

  export function getYearMonth(monthName: string): string | null {
  const date = new Date();
  const year = date.getFullYear();

  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
  
  if (isNaN(monthIndex)) return null; // invalid month name

  const formattedMonth = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${formattedMonth}`;
}

const SearchFilters = () => {

    const dispatch = useDispatch<AppDispatch>();
    const grandTotals = useSelector((state: RootState) => state.bookIncome.grandTotals);
    const pageLimit = useSelector((state: RootState) => state.bookIncome.pageLimitBookIncome);
    const query1 = useSelector((state: RootState) => state.bookIncome.query);


    const [selected, setSelected] = useState<string[]>(['receipt', 'invoice']);

     const [periodFilter, setPeriodFilter] = useState<any>();




        const handlePeriodChange = (field: string, value: any | boolean) => {
          setPeriodFilter(value)

          
          let queryObject:any = cloneDeep(query1)
          if(Object.keys(queryObject).length == 0) queryObject = {}
          if(value) {
            const val = getYearMonth(value.toLowerCase()) 
            queryObject.period = val
          }
          
          if(Object.keys(queryObject).length !=0 && value){

            dispatch(setQuery(queryObject))
            dispatch(setPageNumber(1));  
            dispatch(filterBookIncome({query:queryObject, limit:pageLimit, page: 1}))
          }else{
            delete queryObject.period;

            dispatch(setQuery(queryObject))
            dispatch(setPageNumber(1)); 
            dispatch(filterBookIncome({query:queryObject}))
          }
      }


  const handleCheckBoxChange = (value: string) => {
    let updated:any = [];
    setSelected(prev => {
    updated = prev.includes(value)
      ? prev.filter(v => v !== value) 
      : [...prev, value]; 
    return updated;
  });

  let queryObject:any = cloneDeep(query1)
  if(Object.keys(queryObject).length == 0) queryObject = {}

  if(updated.length === 1) queryObject.receiptType = updated[0]
  else{
    queryObject.receiptType = ''
  }
 
  dispatch(setQuery(queryObject))
  dispatch(setPageNumber(1));  
  dispatch(filterBookIncome({query:queryObject, limit:pageLimit, page: 1}))

  };


  return (
    <>
<div className='pl-4 border-b-2 pb-2 mt-4 flex LS:justify-center flex-col LMB:items-center lg:items-start lg:flex-row w-full'>
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

  

<div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />

 <div className="flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[8%]">
      <p className="font-semibold text-[14px] mb-[8px]">Related to</p>
      <div className="flex lg:flex-col gap-1 lg:gap-0">
        <label className="flex items-center lg:gap-2">
          <input
            type="checkbox"
            checked={selected.includes("receipt")}
            onChange={() => handleCheckBoxChange("receipt")}
          />
          <span className='text-[12px] font-semibold'>Ticket</span>
        </label>

        <label className="flex items-center lg:gap-2">
          <input
            type="checkbox"
            checked={selected.includes("invoice")}
            onChange={() => handleCheckBoxChange("invoice")}
          />
          <span className='text-[12px] font-semibold'>Invoice</span>
        </label>
      </div>
    </div>

<div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />

  <div className='flex items-stretch mt-2 lg:mt-0 gap-2 h-full'>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px]'>Total VAT excl</p>
      <p className='text-[12px] font-semibold mt-3 '>{grandTotals[0]?.grandTotalAmountVatExcl?.toFixed(2)} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px]'>Total Vat</p>
      <p className='text-[12px] font-semibold mt-3 '>{grandTotals[0]?.grandTotalVatAmount?.toFixed(2)} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px]'>Total VAT inc.</p>
      <p className='text-[12px] font-semibold mt-3'>{grandTotals[0]?.grandTotalAmountVatIncl?.toFixed(2)} €</p>
    </div>
  </div>

<div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />

<div className='flex flex-col gap-[6px]'>
  <div className='flex items-stretch mt-2 lg:mt-0 gap-2 h-full'>
    <div className='flex flex-col items-center md:items-start'>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>Base 1</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalBasePrice_1?.toFixed(2)} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>VAT 1</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalVat1AppliedAmount?.toFixed(2)} €</p>
    </div>
    </div>

    <div className='flex flex-col items-center md:items-start'>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>Base 2</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalBasePrice_2?.toFixed(2)} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>VAT 2</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalVat2AppliedAmount?.toFixed(2)} €</p>
    </div>
    </div>
    <div className='flex flex-col items-center md:items-start'>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>Base 3</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalBasePrice_3?.toFixed(2)} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>VAT 3</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalVat3AppliedAmount?.toFixed(2)} €</p>
    </div>
    </div>

    <div className='flex flex-col items-center md:items-start'>

    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>Base 4</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalBasePrice_4?.toFixed(2)} €</p>
    </div>
        <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[12px] text-gray-400'>VAT 4</p>
      <p className='text-[12px] text-gray-400'>{grandTotals[0]?.grandTotalVat4AppliedAmount?.toFixed(2)} €</p>
    </div>
    </div>
  </div>
</div>
  
</div>
    </>
  )
}

export default SearchFilters
