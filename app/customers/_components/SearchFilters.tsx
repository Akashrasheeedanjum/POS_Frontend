'use client';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils';
import { FileSearch } from 'lucide-react'
import React, { useState } from 'react'

import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import { transformSearchFieldValue } from '../Helper/transformSearchFieldValue';
import { CustomSelect } from '@/components/custom-select';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { filterCustomers, setPageNumber, setQuery } from '@/app/Redux/Slices/customerSlice';
import { toast } from 'sonner';

const SearchFilters = () => {

  // const {filterCustomer} = useCustomerManagement()
  const dispatch = useDispatch<AppDispatch>();

  const pageNumber = useSelector((state: RootState) => state.customer.pageNumber);
  const pageLimit = useSelector((state: RootState) => state.customer.pageLimit);

    const [cityFilter, setCityFilter] = useState<any>();
    const [searchFilterField, setSearchFilterField] = useState<any>();
    const [searchFieldValue, setSearchFieldValue] = useState<any>();
    
  //   const handleCityChange = (field: string, value: any | boolean) => {
  //     setCityFilter(value)
  //     if(value){
  //       // filterCustomer({'billingAddress.city': value._id})
  //       const query = {'billingAddress.city': value._id}
  //       dispatch(filterCustomers({query, limit:pageLimit, page: pageNumber}))
  //     }else{
  //       // filterCustomer({})
  //       dispatch(filterCustomers({}))
  //     }

  // }


    const handleCityChange = (field: string, value: any | boolean) => {
      setCityFilter(value)
      if(value){
        const query = {'billingAddress.city': value._id}
        dispatch(setQuery(query))
        dispatch(setPageNumber(1));  
        dispatch(filterCustomers({query:query, limit:pageLimit, page: 1}))
      }else{
        dispatch(setQuery({}))
        dispatch(setPageNumber(1)); 
        dispatch(filterCustomers({}))
      }
  }



  // const handleSearch = () => {

  //   if(searchFilterField){
  //     const value = transformSearchFieldValue(searchFieldValue)

  //     const query = {[searchFilterField]: value}
  //     dispatch(filterCustomers({query}))
  //   }else{
  //    dispatch(filterCustomers({}))
  //   }
    
  // }
  const handleSearch = () => {
if(!searchFieldValue?.trim() || !searchFilterField){
      toast.error(`${!searchFilterField? 'Select a filter!': 'Provide Search value!'}`)
      return
}

    if(searchFilterField){
      const value = transformSearchFieldValue(searchFieldValue)

      const query = {[searchFilterField]: value?.trim()}
      dispatch(setQuery(query))    //setting new query in the redux so it can be fetched every where
      dispatch(setPageNumber(1));  //set page number to 1 for this new query
      dispatch(filterCustomers({query:query, limit:pageLimit, page:1}))
    }else{
     // if we don't have any query
     dispatch(setQuery({}))
     dispatch(setPageNumber(1)); 
     dispatch(filterCustomers({}))
    }
    
  }

  return (
    <>
<div className="my-4 flex w-full flex-col gap-4 lg:flex-row">
  <div className="flex w-full flex-col lg:w-[25%] xl:w-[25%]">
    <p className="font-semibold">List Customers by city</p>
    <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
  <Label className="shrink-0 font-medium" htmlFor="cityFilter">City</Label>
  <div className='w-full'>
  <CustomSelect 
  extraOption={{ label: "All Cities", value: "" }} 
  type='cities' value={cityFilter?.cityName} 
  onChange={(val) => handleCityChange("", val)} />
  </div>
  </div>
  </div>

  <div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />
  <div className={`mt-0 flex w-full flex-col lg:flex-1 lg:mr-3 xl:mr-0`}>
    <p className="font-semibold">Search Filter</p>
    <div className="mt-2 flex flex-col items-stretch gap-3 sm:gap-4 md:flex-row md:items-center">
  {/* <Label className='font-medium' htmlFor="cityFilter">City</Label> */}
  <div className='w-full md:w-[50%]'>
  <Select value={searchFilterField} onValueChange={(value) => setSearchFilterField(value)}>
    <SelectTrigger className='' id="searchFilter">
      <SelectValue placeholder="Select Field" />
    </SelectTrigger>
    <SelectContent className='h-[9.5rem]'>
      <SelectItem value="">Select Field</SelectItem>
      <SelectItem value="customerCode">Customer Code</SelectItem>
      <SelectItem value="nameDenomination">Name - Denomination</SelectItem>
      <SelectItem value="firstName">First Name</SelectItem>
      <SelectItem value="email">Email</SelectItem>
      <SelectItem value="tel1">Tel 1</SelectItem>
      <SelectItem value="billingAddress.address">Adresse</SelectItem>
      <SelectItem value="billingAddress.city">City</SelectItem>
      <SelectItem value="billingAddress.zipCode">Zip Code</SelectItem>
      <SelectItem value="country">Country</SelectItem>
      <SelectItem value="vatNumber">N° Vat</SelectItem>
      <SelectItem value="createdAt">Registration Date</SelectItem>
    </SelectContent>
  </Select>
  </div>
  <div className='w-full md:w-[50%]'>
    {searchFilterField === 'country'|| searchFilterField === 'billingAddress.city'? 
    <CustomSelect extraOption={{ label: "All", value: "" }} 
    type={searchFilterField === 'country'? 'countries': 'cities'} 
    value={searchFilterField === 'country' ? searchFieldValue?.countryName: searchFieldValue?.cityName}
    onChange={(val) => setSearchFieldValue(val)} />
  :
    <Input
      placeholder={`Value for ${searchFilterField?? 'Field'}...`}
      type={searchFilterField == 'createdAt'? 'date': 'text'}
      value={typeof searchFieldValue !== 'object'? searchFieldValue : ''}
      onChange={(e) => setSearchFieldValue(e.target.value)}
      // className={cn('w-full md:max-w-sm placeholder:text-gray-300')}
        className={cn(
    'w-full md:max-w-sm placeholder:text-gray-300',
    searchFilterField === 'createdAt' && 'date-icon-right'
  )}
    />
    }
  </div>
  <Button
  onClick={handleSearch}
  className="w-full md:w-auto md:min-w-[7rem]"><FileSearch className="mr-2 h-4 w-4" /> Find </Button>
  </div>
  </div>

</div>
    </>
  )
}

export default SearchFilters
