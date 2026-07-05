'use client';
import React, { useEffect, useState } from 'react'
import CustomerModal from '../../documents/_components/CustomerModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { RotateCcw } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/app/Redux/store'
import { filterReceipts, setOpenCustomerModal, setPageNumber, setQuery } from '@/app/Redux/Slices/folder/receiptSlice';

const SearchFilters = ({employees}: {employees:any[]}) => {

    const dispatch = useDispatch<AppDispatch>();
    const isCustomerModalOpen = useSelector((state: RootState) => state.receipt.isCustomerModalOpen);
    const pageLimit = useSelector((state: RootState) => state.receipt.pageLimitReceipts);
    const receiptsTotalVatIncl = useSelector((state: RootState) => state.receipt.receiptsTotalVatIncl);
    const receiptsTotalVatExcl = useSelector((state: RootState) => state.receipt.receiptsTotalVatExcl);
    const receiptsVatAmountSum = useSelector((state: RootState) => state.receipt.receiptsVatAmountSum);

     const [selectedCustomerData, setSelectedCustomerData] = useState<any>(null);
     const [periodFilter, setPeriodFilter] = useState<any>();
     const [employeeFilter, setEmployeeFilter] = useState<any>();


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
        dispatch(filterReceipts({ query, limit: pageLimit, page: 1 }));
      }
    }, [isCustomerModalOpen, selectedCustomerData]);


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
          // if(documentFilter) query.receiptType = documentFilter
          if(Object.keys(query).length !=0){
            dispatch(setQuery(query))
            dispatch(setPageNumber(1));  
            dispatch(filterReceipts({query:query, limit:pageLimit, page: 1}))
          }else{
            dispatch(setQuery({}))
            dispatch(setPageNumber(1)); 
            dispatch(filterReceipts({}))
          }
      }

    const handleEmployeeChange = (field: string, value: any) => {
      console.log('value', value)
    setEmployeeFilter(value.name)
    const query:any = {}
    if(value) query.employee = value
    if(periodFilter) query.period = getYearMonth(periodFilter.toLowerCase())
          if(Object.keys(query).length !=0){
          dispatch(setQuery(query))
          dispatch(setPageNumber(1));  
          dispatch(filterReceipts({query:query, limit:pageLimit, page: 1}))
        }else{
          dispatch(setQuery({}))
          dispatch(setPageNumber(1)); 
          dispatch(filterReceipts({}))
        }
      
    }

    const handleCustomerReset = () => {
      if(!selectedCustomerData) return
            setSelectedCustomerData(null)
            dispatch(setQuery({}))
            dispatch(setPageNumber(1)); 
            dispatch(filterReceipts({}))
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
  <Select 
  value={periodFilter} onValueChange={(val) => handlePeriodChange("", val)}
  >
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

  {/* <div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />

  <div className={`flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[15%]`}>
    <p className='font-semibold text-[14px]'>Register</p>
    <div className='mt-2 flex flex-col md:flex-row  items-center gap-4'>
  
  <div className='w-full'>
  <Select 
//   value={documentFilter} onValueChange={(value) => handleDocumentChange("",value)}
  >
    <SelectTrigger className='text-[14px]' id="searchFilter">
      <SelectValue placeholder="All" />
    </SelectTrigger>

    <SelectContent className='text-[14px] h-[9.5rem]'>
      <SelectItem value="">All</SelectItem>
      <SelectItem value="1">1</SelectItem>
      <SelectItem value="2">2</SelectItem>
      <SelectItem value="3">3</SelectItem>
      <SelectItem value="4">4</SelectItem>
    </SelectContent>
  </Select>
  </div>
  </div>
  </div> */}

<div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />

  <div className={`flex flex-col LMB:w-[60%] ELMB:w-[50%] SMS:w-[15%]`}>
    <p className='font-semibold text-[14px]'>Employee</p>
    <div className='mt-2 flex flex-col md:flex-row  items-center gap-4'>
  
  <div className='w-full'>
  <Select 
  value={employeeFilter} onValueChange={(value:any) => handleEmployeeChange("",value)}
  >
    <SelectTrigger className='capitalize text-[14px]' id="searchFilter">
      <SelectValue placeholder="All" />
    </SelectTrigger>

    <SelectContent className='text-[14px] h-[9.5rem]'>
      <SelectItem value="">All</SelectItem>
      {employees?.map((emp:any) => (
        <SelectItem className='capitalize' key={emp._id} value={emp._id}>{emp.name}</SelectItem>
      ))}
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
            onClick={handleCustomerReset}
            >
                <RotateCcw className="h-4 w-4  " />
                <span className="sr-only">Reset</span>
            </Button>
      </div>
  </div>

  <div className='flex items-stretch mt-2 lg:mt-0 gap-4 md:ml-10 h-full'>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[14px]'>Total VAT inc.</p>
      <p className='text-[14px] mt-3'>{receiptsTotalVatIncl} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[14px]'>Total VAT excl</p>
      <p className='text-[14px] mt-3 text-blue-500'>{receiptsTotalVatExcl} €</p>
    </div>
    <div className='flex flex-col items-center md:items-start'>
      <p className='font-semibold text-[14px]'>Total Vat Amount</p>
      <p className='text-[14px] mt-3 text-red-500'>{receiptsVatAmountSum} €</p>
    </div>
  </div>

</div>
    </>
  )
}

export default SearchFilters
