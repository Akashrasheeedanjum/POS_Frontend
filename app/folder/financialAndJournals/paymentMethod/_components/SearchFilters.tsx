'use client';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/Redux/store'
import cloneDeep from 'lodash/cloneDeep';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { filterPaymentMethods, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/paymentMethodsSlice';
import { getYearMonth } from '../../bookIncome/_components/SearchFilters';

export function formatToDDMMYYYY(dateString:any) {
  const date = new Date(dateString); // parse input

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getTodayInBrussels() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Brussels",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return formatter.format(new Date());
}

export function convertToISODate(ddmmyyyy:any) {
  const [day, month, year] = ddmmyyyy.split("/");

  // padStart ensures 2-digit day/month
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return isoDate;
}

const today1 = getTodayInBrussels()

const SearchFilters = () => {

    const dispatch = useDispatch<AppDispatch>();

    const grandTotalAmount = useSelector((state: RootState) => state.paymentMethods.grandTotalAmount);
    const pageLimit = useSelector((state: RootState) => state.paymentMethods.pageLimitPaymentMethods);
    const query = useSelector((state: RootState) => state.paymentMethods.query);


    const [dateFrom, setDateFrom] = useState<any>(convertToISODate(today1));
    const [dateTo, setDateTo] = useState<any>(convertToISODate(today1));

    const [selectedButton, setSelectedButton] = useState("all") // default selected

  const buttons = [
    { label: "All payments", value: "all" },
    { label: "Tickets", value: "receipt" },
    { label: "Invoices", value: "invoice" },
  ]






        const handleDateChange = (field: string, value: any | boolean) => {
          if(field == 'dateFrom') setDateFrom(value)
          else if(field == 'dateTo') setDateTo(value)
                    
          let queryObject:any = cloneDeep(query)
          if(Object.keys(queryObject).length == 0) queryObject = {}

          if(value && field == 'dateFrom') {
            const val = formatToDDMMYYYY(value) 
            queryObject.periodFrom = val
          }else if(value && field === 'dateTo'){
            const val = formatToDDMMYYYY(value) 
            queryObject.periodTo= val
          }
          
          if(!value && (field == 'dateFrom')) {
            const today = getTodayInBrussels() 
            queryObject.periodFrom = today
            setDateFrom(convertToISODate(today))
          }
          if(!value && (field == 'dateTo')) {
            const today = getTodayInBrussels() 
            queryObject.periodTo = today
            setDateTo(convertToISODate(today))
          }

          if(Object.keys(queryObject).length !=0){

            dispatch(setQuery(queryObject))
            dispatch(setPageNumber(1));  
            dispatch(filterPaymentMethods({query:queryObject, limit:pageLimit, page: 1}))
          }else{
            delete queryObject.periodFrom;
            delete queryObject.periodTo;

            dispatch(setQuery(queryObject))
            dispatch(setPageNumber(1)); 
            dispatch(filterPaymentMethods({query:queryObject}))
          }
      }

        const handleButtonChange = (field: string, value: any | boolean) => {
          setSelectedButton(value)

          
          let queryObject:any = cloneDeep(query)
          if(Object.keys(queryObject).length == 0) queryObject = {}
          if(value != 'all') {
            queryObject.receiptType = value
          }

          if(!queryObject.periodFrom) queryObject.periodFrom = getTodayInBrussels()
          if(!queryObject.periodTo) queryObject.periodTo = getTodayInBrussels()
          
          if(Object.keys(queryObject).length !=0 && value != 'all'){

            dispatch(setQuery(queryObject))
            dispatch(setPageNumber(1));  
            dispatch(filterPaymentMethods({query:queryObject, limit:pageLimit, page: 1}))
          }else{
            console.log('queryObject', queryObject)
            delete queryObject.receiptType;

            dispatch(setQuery(queryObject))
            dispatch(setPageNumber(1)); 
            dispatch(filterPaymentMethods({query:queryObject}))
          }
      }


  return (
    <>
<div className='pl-4 border-b-2 pb-2 mt-4 flex flex-col LMB:items-center lg:items-end lg:flex-row w-full'>

  {/* First Column: Payment Date */}
  <div className='flex flex-col LMB:w-[70%] ELMB:w-[50%] SMS:w-[40%]'>
    <p className='font-semibold text-[14px]'>Payment date</p>
    <div className='mt-2 flex flex-col items-center md:flex-row  md:justify-start gap-4 md:gap-2'>
      <div className='w-[90%] lg:w-[45%]'>
        <Input
          type={'date'}
          value={typeof dateFrom !== 'object' ? dateFrom : ''}
          onChange={(e) => handleDateChange("dateFrom", e.target.value)}
          className={cn(
            'w-full md:max-w-sm placeholder:text-gray-300 border border-gray-200',
            'date-icon-right'
          )}
        />
      </div>
      <div className='flex w-[90%] lg:w-[50%] gap-2 items-center'>
        <p>To</p>
        <Input
          type={'date'}
          value={typeof dateTo !== 'object' ? dateTo : ''}
          onChange={(e) => handleDateChange("dateTo", e.target.value)}
          className={cn(
            'w-full md:max-w-sm placeholder:text-gray-300 border border-gray-200',
            'date-icon-right'
          )}
        />
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
