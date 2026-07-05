'use client';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { useSidebar } from '@/components/ui/sidebar';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { toast } from 'sonner';
import { filterDocuments, setOpenCustomerModal, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/documentSlice';
import CustomerModal from './CustomerModal';
import { RotateCcw, } from "lucide-react"

const SearchFilters = () => {

  // const {filterCustomer} = useCustomerManagement()
  const dispatch = useDispatch<AppDispatch>();

  const pageNumber = useSelector((state: RootState) => state.customer.pageNumber);
  const pageLimit = useSelector((state: RootState) => state.customer.pageLimit);
  const selectedCustomer:any = useSelector((state: RootState) => state.customer.selectedCustomerForDocument);
  const isCustomerModalOpen = useSelector((state: RootState) => state.document.isCustomerModalOpen);

  const allDocsTotalVatIncl = useSelector((state: RootState) => state.document.allDocsTotalVatIncl);
  const allDocsTotalVatExcl = useSelector((state: RootState) => state.document.allDocsTotalVatExcl);
  const allDocsTotalDueAmount = useSelector((state: RootState) => state.document.allDocsTotalDueAmount);


    const [periodFilter, setPeriodFilter] = useState<any>();
    const [documentFilter, setDocumentFilter] = useState<any>();
    const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null);
    
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
      const query:any = {}
      if(value) {
        const val = getYearMonth(value.toLowerCase()) 
        query.period = val
      }
      if(documentFilter) query.receiptType = documentFilter
      if(Object.keys(query).length !=0){
        dispatch(setQuery(query))
        dispatch(setPageNumber(1));  
        dispatch(filterDocuments({query:query, limit:pageLimit, page: 1}))
      }else{
        dispatch(setQuery({}))
        dispatch(setPageNumber(1)); 
        dispatch(filterDocuments({}))
      }
  }


  const handleDocumentChange = (field: string, value: any | boolean) => {
  setDocumentFilter(value)
  const query:any = {}
  if(value) query.receiptType = value
  if(periodFilter) query.period = getYearMonth(periodFilter.toLowerCase())
        if(Object.keys(query).length !=0){
        dispatch(setQuery(query))
        dispatch(setPageNumber(1));  
        dispatch(filterDocuments({query:query, limit:pageLimit, page: 1}))
      }else{
        dispatch(setQuery({}))
        dispatch(setPageNumber(1)); 
        dispatch(filterDocuments({}))
      }
    
  }
 

    const handleModalClose = () => {
      dispatch(setOpenCustomerModal({isModalOpen:false}))
    }

    const getCustomerData = (userData:any) => {
        setSelectedCustomerData(userData)
    }

useEffect(() => {
  if (!isCustomerModalOpen && selectedCustomerData) {
    const query = { customer: selectedCustomerData._id };

    dispatch(setQuery(query));
    dispatch(setPageNumber(1));  
    dispatch(filterDocuments({ query, limit: pageLimit, page: 1 }));
  }
}, [isCustomerModalOpen, selectedCustomerData]);

const handleCustomerReset = () => {
  if(!selectedCustomerData) return
        setSelectedCustomerData(null)
        dispatch(setQuery({}))
        dispatch(setPageNumber(1)); 
        dispatch(filterDocuments({}))
}


  return (
    <>
         {isCustomerModalOpen && (  
      <CustomerModal 
       open={isCustomerModalOpen}
       mode='add'
       onClose={handleModalClose}
       customerData={getCustomerData}
      />
           )}

<div className='pl-4 border-b-2 pb-2 mt-4 flex LS:justify-center flex-col LMB:items-center lg:items-start lg:flex-row w-full'>
  <div className='flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[15%]'>
    <p className='font-semibold text-[14px]'>Period</p>
    <div className='mt-2 flex items-center gap-4'>
  <div className='w-full'>
  <Select value={periodFilter} onValueChange={(val) => handlePeriodChange("", val)}>
    <SelectTrigger className='' id="searchFilter">
      <SelectValue className='text-[14px]' placeholder="Select Period" />
    </SelectTrigger>
    <SelectContent className='h-[9.5rem] text-[14px]'>
      <SelectItem value="">Select Period</SelectItem>
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

  <div className={`flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[15%]`}>
    <p className='font-semibold text-[14px]'>Documents</p>
    <div className='mt-2 flex flex-col md:flex-row  items-center gap-4'>
  
  <div className='w-full'>
  <Select value={documentFilter} onValueChange={(value) => handleDocumentChange("",value)}>
    <SelectTrigger className='text-[14px]' id="searchFilter">
      <SelectValue placeholder="All documents" />
    </SelectTrigger>

    <SelectContent className='text-[14px] h-[9.5rem]'>
      <SelectItem value="">All documents</SelectItem>
      <SelectItem value="invoice">Invoice</SelectItem>
      <SelectItem value="quote">Quotes</SelectItem>
      <SelectItem value="salesOrder">Sale Orders</SelectItem>
      <SelectItem value="deliveryNote">Delivery Notes</SelectItem>
    </SelectContent>
  </Select>
  </div>
  </div>
  </div>

<div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />

  <div className='mt-2 lg:mt-0 flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[20%]'>
    <Button 
    onClick={() => dispatch(setOpenCustomerModal({isModalOpen: true}))}
    className='text-[14px] h-[1.5rem] mb-1'>Customers</Button>
    <div className='flex w-full'>
        <Input
          type='text'
          disabled={true}
          value={selectedCustomerData ? selectedCustomerData.nameDenomination: ''}
          placeholder='Select customer'
          className={cn(
            ' md:max-w-sm placeholder:text-gray-300 border-gray-300')}
            />
            <Button variant="outline" size="icon" className="ml-1 bg-primary hover:bg-primary/90 rounded-r-sm  px-1 " 
            onClick={handleCustomerReset}>
                <RotateCcw className="h-4 w-4  " />
                <span className="sr-only">Reset</span>
            </Button>
        {/* <Button 
    onClick={() => setSelectedCustomerData(null)}
    className='text-[14px] ml-1 w-[20%]'>
    <RotateCcw className="h-8 w-8  " />
    </Button> */}
      </div>
  </div>

  <div className='flex items-stretch mt-2 lg:mt-0 gap-4 md:ml-10 h-full'>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[14px]'>Total VAT inc.</p>
      <p className='text-[14px] mt-3'>{allDocsTotalVatIncl} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[14px]'>Total VAT excl</p>
      <p className='text-[14px] mt-3 text-blue-500'>{allDocsTotalVatExcl} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[14px]'>Total Due Balance</p>
      <p className='text-[14px] mt-3 text-red-500'>{allDocsTotalDueAmount} €</p>
    </div>
  </div>

</div>
    </>
  )
}

export default SearchFilters
