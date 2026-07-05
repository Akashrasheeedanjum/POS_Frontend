'use client';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils';
import { FileSearch } from 'lucide-react'
import React, { useState } from 'react'
import { useSidebar } from '@/components/ui/sidebar';
import { CustomSelect } from '@/components/custom-select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { filterSuppliers, setPageNumber, setQuery } from '@/app/Redux/Slices/supplierSlice';
import { transformSearchFieldValue } from '@/app/customers/Helper/transformSearchFieldValue';
import { toast } from 'sonner';


const SearchFilters = () => {

const dispatch = useDispatch<AppDispatch>();

  const pageNumber = useSelector((state: RootState) => state.supplier.pageNumberSupplier);
  const pageLimit = useSelector((state: RootState) => state.supplier.pageLimitSupplier);
  const filterQuery = useSelector((state: RootState) => state.supplier.query);

    const [cityFilter, setCityFilter] = useState<any>();
    const [searchFilterField, setSearchFilterField] = useState<any>();
    const [searchFieldValue, setSearchFieldValue] = useState<any>();

    const handleCityChange = (field: string, value: any | boolean) => {
      setCityFilter(value)
      if(value){
        const query = {'city': value._id}
      dispatch(setQuery(query))
      dispatch(setPageNumber(1));   
      dispatch(filterSuppliers({query:query, limit:pageLimit, page:1}))
        
      }else{
      dispatch(setQuery({}))
      dispatch(setPageNumber(1)); 
      dispatch(filterSuppliers({}))
      }

  }

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
      dispatch(filterSuppliers({query:query, limit:pageLimit, page:1}))  //fetch results with new query + pageNumber
    }else{
      // if we don't have any query
      dispatch(setQuery({}))
      dispatch(setPageNumber(1)); 
      dispatch(filterSuppliers({}))
    }
  }

  const { open } = useSidebar(); 

  return (
    <>
<div className='my-4 flex flex-col ELMB:items-center md:items-start lg:flex-row w-full'>
  <div className='flex flex-col ELMB:w-[50%] xl:w-[25%]'>
    <p className='font-semibold'>List Suppliers by city</p>
    <div className='mt-2 flex items-center gap-4'>
  <Label className='font-medium' htmlFor="cityFilter">City</Label>
  <div className='w-full'>
  <CustomSelect
  extraOption={{ label: "All Cities", value: "" }}
  type='cities'  value={cityFilter?.cityName}
   onChange={(val) => handleCityChange("", val)} 
   />
  </div>
  </div>
  </div>

  <div className="hidden md:block mx-4 w-px self-stretch bg-[#F0ECEA]" />
  <div className={`mt-4 lg:mt-0 flex flex-col ELMB:w-[50%] 
  ${open ? 'md:w-[90%] lg:w-[60%]' : 'md:w-[60%] lg:w-[59%] xl:w-[60%]'}
   lg:mr-3 xl:mr-0
  `}>
    <p className='font-semibold'>Search Filter</p>
    <div className='mt-2 flex flex-col md:flex-row  items-center gap-4'>
  {/* <Label className='font-medium' htmlFor="cityFilter">City</Label> */}
  <div className='w-full md:w-[50%]'>
  <Select value={searchFilterField} onValueChange={(value) => setSearchFilterField(value)}>
    <SelectTrigger className='' id="searchFilter">
      <SelectValue placeholder="Select Field" />
    </SelectTrigger>
    <SelectContent className='h-[9.5rem]'>
      <SelectItem value="">Select Field</SelectItem>
      <SelectItem value="numberProvided">Supplier Code</SelectItem>
      <SelectItem value="nameDenomination">Name - Denomination</SelectItem>
      <SelectItem value="city">City</SelectItem>
      <SelectItem value="zipCode">Zip Code</SelectItem>
    </SelectContent>
  </Select>
  </div>
  <div className='w-full md:w-[50%]'>
    {searchFilterField === 'city' ? 
    <CustomSelect extraOption={{ label: "All Cities", value: "" }} 
    type='cities'
    value={searchFieldValue?.cityName}
    onChange={(val) => setSearchFieldValue(val)} />
  :
    <Input
      placeholder={`Value for ${searchFilterField?? 'Field'}...`}
      value={typeof searchFieldValue !== 'object'? searchFieldValue : ''}
      onChange={(e) => setSearchFieldValue(e.target.value)}
        className={cn('w-full md:max-w-sm placeholder:text-gray-300')}
    />
    }
  </div>
  <Button 
  onClick={handleSearch}
  className='w-[50%] md:w-[25%]'><FileSearch className="mr-2 h-4 w-4" /> Find </Button>
  </div>
  </div>
</div>
    </>
  )
}

export default SearchFilters
