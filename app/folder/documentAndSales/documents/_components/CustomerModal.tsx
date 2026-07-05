'use client';
import { CustomerCellAction } from '@/app/customers/_components/CustomerCellAction';
import CustomerForm from '@/app/customers/_components/CustomerForm';
import CustomerTable from '@/app/customers/_components/CustomerTable';
import { cityCountryCreation } from '@/app/customers/Helper/handleCityCountryCreation';
import { transformCustomerData } from '@/app/customers/Helper/transformCustomerData';
import { transformSearchFieldValue } from '@/app/customers/Helper/transformSearchFieldValue';
import { deepTrimObject } from '@/app/dashboard/suppliers/Helper/deepTrimObject';
import { addCustomer, filterCustomers, selectCustomerForDocument, setIsAddNewUser, setPageNumber, setQuery, setToken } from '@/app/Redux/Slices/customerSlice';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { CustomSelect } from '@/components/custom-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createCustomer, getNewCustomerNumber } from '@/lib/actions/customers.actions';
import { getDefaultCustomerFormData } from '@/app/customers/Helper/getDefaultCustomerFormData';
import { cn } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { FileSearch, Plus, Check, X,  } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useSession } from '@clerk/nextjs';



export const columns: ColumnDef<any>[] = [
  {
    id: 'customerCode',
    accessorKey: 'customerCode',
    header: 'CustomerCode',
    enableResizing: true
  },
  {
    id: 'nameDenomination',
    accessorKey: 'nameDenomination',
    header: 'NameDenomination',
    enableResizing: true
  },
  {
    id: 'firstName',
    accessorKey: 'firstName',
    header: 'FirstName',
    enableResizing: true
  },
  {
    id: 'billingAddress.zipCode',
    accessorKey: 'billingAddress.zipCode',
    header: 'Billing ZipCode',
    enableResizing: true
  },
  {
    id: 'billingAddress.city.cityName',
    accessorKey: 'billingAddress.city.cityName',
    header: 'Billing City',
    enableResizing: true
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: any }) => <CustomerCellAction data={row.original} />
  }
];

type SelectType = 'edit' | 'add';
interface CustomerDialogProps {
  open: boolean;
  mode: SelectType;
  onChange?: (key: string, value: any) => void;
  // setUserData: (userData: Supplier | null) => void;
  handleData?: () => void;
  onClose: () => void;
  customerData: (userData:any) => void
}

const CustomerModal = ({
  open,
  mode,
  onChange,
  // setUserData,
  handleData,
  onClose,
  customerData
}: CustomerDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();

    const { session } = useSession();
    const userAccesses:any = session?.user?.publicMetadata?.accesses
    const userRole:any = session?.user?.publicMetadata?.role

  const allCustomers = useSelector((state: RootState) => state.customer.allCustomers);
  const isAddNewUser = useSelector((state: RootState) => state.customer.IsAddNewUser);
  const selectedCustomer = useSelector((state: RootState) => state.customer.selectedCustomerForDocument);
  const pageLimit = useSelector((state: RootState) => state.customer.pageLimit);

  const [searchFilterField, setSearchFilterField] = useState<any>();
  const [searchFieldValue, setSearchFieldValue] = useState<any>();
  const [userData, setUserData] = useState<any>(getDefaultCustomerFormData());
  const [newCode, setNewCode] = useState<number | undefined>();

  const token:any = session?.user?.publicMetadata?.token

  useEffect(() => {
        if(token){
          dispatch(setToken(token));
          dispatch(filterCustomers({token}))
            .unwrap()
            .catch((err) => {
              toast.error(err);
            });
        }
  }, []);

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

  const PRICE_LIST_KEYS = [
  "usePriceList1",
  "usePriceList2",
  "usePriceList3",
  "usePriceList4",
];

  const setDeepValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const deepRef = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  deepRef[lastKey] = value;
};

  const handleValueChange = (path: string, value: any | boolean) => {
  setUserData((prev: any) => {
    const newData = { ...getDefaultCustomerFormData(), ...prev };

    // If the field being updated is one of the usePriceList switches
    if (PRICE_LIST_KEYS.includes(path) && value === true) {
      // Set only the selected key to true, others to false
      PRICE_LIST_KEYS.forEach((key) => {
        newData[key] = key === path;
      });
    } else {
      // For all other cases, do a regular update
      setDeepValue(newData, path, value);
    }

    return newData;
  });
};

    const handleModalClose = () => {
      dispatch(setIsAddNewUser(false))
      setUserData(getDefaultCustomerFormData())
      setNewCode(undefined)
    }

  const handleAddCustomer = async () => {
    try {
      const newCustCode = await getNewCustomerNumber(token)
      if (newCustCode) {
        setNewCode(newCustCode)
        setUserData(getDefaultCustomerFormData(newCustCode))
      } else {
        setUserData(getDefaultCustomerFormData())
      }
      dispatch(setIsAddNewUser(true))
    } catch (error) {
      console.error(error)
      setUserData(getDefaultCustomerFormData())
      dispatch(setIsAddNewUser(true))
      toast.error('Using manual customer code')
    }
  }

  const handleSave = async() => {

    const updatedUserData = await cityCountryCreation(userData)
    // return
    const trimmedData = deepTrimObject(updatedUserData);
    const data = transformCustomerData(trimmedData)
    try {
      if (!data?.customerCode && newCode) {
        data.customerCode = String(newCode)
      }
    const newCustomer = await createCustomer(data, token)
    dispatch(addCustomer(newCustomer))
    toast.success('Customer created successfully!')
    handleModalClose()
    } catch (error) {
      console.error('Error while creating a new Customer', error)
      toast.error(`Error ${error}`)
    }

  }

  const handleOkay = () => {
    if(!selectedCustomer){
        toast.error('Customer is not Selected!')
        return
    }
    console.log('selectedCustomer', selectedCustomer)
    customerData(selectedCustomer)
    onClose()
  }

  const handleCancel = () => {
    dispatch(selectCustomerForDocument({userData: null}))
    onClose()
  }



  return (
    <>
    {isAddNewUser && (userRole == 'admin' || userAccesses?.customerAccess === true) && (

        <CustomerForm 
        newCode={newCode}
        open={isAddNewUser}
        mode='add'
        onChange={handleValueChange}
        userData={userData}
        handleData={handleSave}
        onClose={handleModalClose}
        />
    )}

      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="scrollbar-custom max-h-[90vh] max-w-[80vw] overflow-auto p-0 "
        >
          <Card className="w-full border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row items-center justify-between rounded-tl-md bg-[#DAAC95] p-3 text-white">
              <CardTitle className="text-xl font-medium text-black">
                Select Customer
              </CardTitle>
            </CardHeader>

            <CardContent className="pb-16">
              <div className="h-[60%] pb-2">
                <CustomerTable columns={columns} data={allCustomers} />
              </div>

              <div className="flex border-t-2 pt-2 ">
                <div
                  className={`mt-4 flex flex-col ELMB:w-[50%] pr-2 border-r-2
                  `}
                >
                  <p className="font-semibold">Search by:</p>
                  <div className="mt-2 flex items-center  gap-4">
                    {/* <Label className='font-medium' htmlFor="cityFilter">City</Label> */}
                    <div className="w-full">
                      <Select
                        value={searchFilterField}
                        onValueChange={(value) => setSearchFilterField(value)}
                      >
                        <SelectTrigger className="" id="searchFilter">
                          <SelectValue placeholder="Select Field" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[15rem] flex flex-col overflow-y-auto">
                          <SelectItem className='hover:bg-gray-200 cursor-pointer' value="">Select Field</SelectItem>
                          <SelectItem className='hover:bg-gray-200 cursor-pointer' value="customerCode">Customer Code</SelectItem>
                          <SelectItem className='hover:bg-gray-200 cursor-pointer' value="nameDenomination">Name - Denomination</SelectItem>
                          <SelectItem className='hover:bg-gray-200 cursor-pointer' value="firstName">First Name</SelectItem>
                          <SelectItem className='hover:bg-gray-200 cursor-pointer' value="billingAddress.city">City</SelectItem>
                          <SelectItem className='hover:bg-gray-200 cursor-pointer' value="billingAddress.zipCode">Zip Code</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      {searchFilterField === 'country' ||
                      searchFilterField === 'billingAddress.city' ? (
                        <CustomSelect
                          extraOption={{ label: 'All', value: '' }}
                          type={
                            searchFilterField === 'country'
                              ? 'countries'
                              : 'cities'
                          }
                          value={
                            searchFilterField === 'country'
                              ? searchFieldValue?.countryName
                              : searchFieldValue?.cityName
                          }
                          onChange={(val) => setSearchFieldValue(val)}
                        />
                      ) : (
                        <Input
                          placeholder={`Value for ${
                            searchFilterField ?? 'Field'
                          }...`}
                          type={
                            searchFilterField == 'createdAt' ? 'date' : 'text'
                          }
                          value={
                            typeof searchFieldValue !== 'object'
                              ? searchFieldValue
                              : ''
                          }
                          onChange={(e) => setSearchFieldValue(e.target.value)}
                          // className={cn('w-full md:max-w-sm placeholder:text-gray-300')}
                          className={cn(
                            'w-full placeholder:text-gray-300 md:max-w-sm',
                            searchFilterField === 'createdAt' &&
                              'date-icon-right'
                          )}
                        />
                      )}
                    </div>
                    <Button
                      onClick={handleSearch}
                      className="w-[50%]"
                    >
                      <FileSearch className="mr-2 h-4 w-4" /> Find{' '}
                    </Button>
                  </div>
                </div>
                <div className='w-[50%] flex items-end pl-2'>
                <div className='w-[40%]'>
                <Button type='button'
                disabled={userRole != 'admin' && userAccesses?.customerAccess === false}
                onClick={handleAddCustomer}
                >
                  <Plus className="mr-2 h-4 w-4" /> <span className="text-[14px]">New Customer</span>
                </Button>
                </div>
                <div className='flex justify-end gap-2 w-[60%]'>
                <Button type='button' className='bg-blue-400 hover:bg-blue-600'
                onClick={handleOkay}
                >
                  <Check className="mr-2 h-4 w-4" /> <span className="text-[14px]">Ok</span>
                </Button>
                <Button className='bg-red-400 hover:bg-red-600' type='button' 
                onClick={handleCancel}
                >
                  <X className="mr-2 h-4 w-4" /> <span className="text-[14px]">Cancel</span>
                </Button>
                
                </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerModal;
