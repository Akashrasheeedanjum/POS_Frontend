import React, { useEffect, useRef, useState } from 'react'
import {
  ColumnDef,
  ColumnResizeMode,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { transformCustomerData } from '../Helper/transformCustomerData';
import { deleteCustomer, updateCustomer } from '@/lib/actions/customers.actions';
import { toast } from 'sonner';
import DeleteConfirmationModal from './DeleteModal';
import { useSelector,useDispatch } from 'react-redux';

import { useSidebar } from '@/components/ui/sidebar';
import CustomerForm from './CustomerForm';
import { trackChangedFields } from '@/app/dashboard/suppliers/Helper/TrackChangedFields';
import { AppDispatch, RootState } from '@/app/Redux/store';
import DataTable from '@/app/dashboard/suppliers/_components/DataTable';
import { editModalOpen, filterCustomers, refreshListOnDelete, 
  refreshListOnUpdate, setOpenDeleteModal, setPageLimit, 
setPageNumber, selectCustomerForDocument } from '@/app/Redux/Slices/customerSlice';
import { deepTrimObject } from '@/app/dashboard/suppliers/Helper/deepTrimObject';
import { cityCountryCreation } from '../Helper/handleCityCountryCreation';
import { useSession } from '@clerk/nextjs';


interface DataTableProps<TData, TValue> {
  columns: ColumnDef<any>[];
  data: TData[];
  pageSizeOptions?: number[];
}



export default function CustomerTable<TData, TValue>({
  columns,
  data,
  pageSizeOptions = [5, 10, 20, 30, 40, 50],
}: DataTableProps<TData, TValue>) {


  const dispatch = useDispatch<AppDispatch>();
  const { session } = useSession();
  const isUserLoading = useSelector((state: RootState) => state.customer.isCustomersLoading);
  const openEditModal = useSelector((state: RootState) => state.customer.openEditModal);
  const selectedCustomer = useSelector((state: RootState) => state.customer.selectedCustomer);
  const customerToDelete = useSelector((state: RootState) => state.customer.customerToDelete);
  const openDeleteModal = useSelector((state: RootState) => state.customer.openDeleteModal);
  const usersCount = useSelector((state: RootState) => state.customer.customersCount);
  const pageNumber = useSelector((state: RootState) => state.customer.pageNumber);
  const pageLimit = useSelector((state: RootState) => state.customer.pageLimit);
  const filterQuery = useSelector((state: RootState) => state.customer.query);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'billWithoutVat': false,
    'usePriceList1': false,
    'usePriceList2': false,
    'usePriceList3': false,
    'usePriceList4': false,
    'fidelity': false,
    'blockClient': false,
    'deliveryAddress.address': false,
    'remarks': false,
    'updatedAt': false,
    'EOID': false,
    'FID': false,
    'email': false,
    "tel1": false,
    "tel2": false,
    'country': false,
    'firstName': false,

  });

      const [columnSizing, setColumnSizing] = useState({});
      const [selectedRowData, setSelectedRowData] = useState<any>(null);
      const [userData, setUserData] = useState<any>()

       const token:any = session?.user?.publicMetadata?.token

    // This effect syncs context value to local state
    useEffect(() => {
      setUserData(selectedCustomer)
      setSelectedRowData(selectedCustomer);
    }, [selectedCustomer]); // runs whenever selectedCustomer changes


  const paginationState = {
    pageIndex: pageNumber - 1,
    pageSize: pageLimit,
  };

    const totalItems = Number(usersCount)
      const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(totalItems / paginationState.pageSize),
        state: {
          pagination: paginationState,
          columnVisibility,
          columnSizing
        },
        onColumnVisibilityChange: setColumnVisibility,
        onColumnSizingChange: setColumnSizing,
        columnResizeMode: 'onChange' as ColumnResizeMode,
            // ✅ UPDATED: Update context values instead of useQueryState
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater(paginationState) : updater;
      dispatch(setPageNumber(newState.pageIndex + 1));
      dispatch(setPageLimit(newState.pageSize));

          /*fetch filtered results with same query from redux but different page numbers, 
          Note: Query is changed in searchFilters component*/
            dispatch(filterCustomers({
            query: filterQuery,
            page: newState.pageIndex + 1,
            limit: newState.pageSize,
      }));  

    },

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        manualFiltering: true
      });



// const setDeepValue = (obj: any, path: string, value: any) => {
//   const keys = path.split('.');
//   const lastKey = keys.pop()!;
//   const deepRef = keys.reduce((acc, key) => {
//     if (!acc[key]) acc[key] = {};
//     return acc[key];
//   }, obj);
//   deepRef[lastKey] = value;
// };


// Deep clone utility
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }

  const clonedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone((obj as any)[key]);
    }
  }

  return clonedObj;
}

// Your existing constants and functions
const PRICE_LIST_KEYS = [
  "usePriceList1",
  "usePriceList2",
  "usePriceList3",
  "usePriceList4",
];

const setDeepValue = (obj: any, path: string, value: any) => {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = obj;

  keys.forEach((key) => {
    if (typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {}; // initialize safely
    }
    current = current[key];
  });

  current[lastKey] = value;
};

// Updated handleValueChange
const handleValueChange = (path: string, value: any | boolean) => {

  setUserData((prev: any) => {
    // Deep clone prev to safely update nested properties without mutation issues
    const newData = deepClone(prev);

    if (PRICE_LIST_KEYS.includes(path) && value === true) {
      // Set only the selected key to true, others to false
      PRICE_LIST_KEYS.forEach((key) => {
        newData[key] = key === path;
      });
    } else {
      setDeepValue(newData, path, value);
    }
    return newData;
  });
};


const handleUpdate = async() => {
  const {_id} = selectedRowData
  const updatedUserData = await cityCountryCreation(userData)
  const trimmedData = deepTrimObject(updatedUserData);
    const changedFields = trackChangedFields(trimmedData, selectedRowData)
  
    if (Object.keys(changedFields).length === 0) {
      toast.info("No changes to update.");
      return;
    }
    
    const data = transformCustomerData(changedFields)
  try {
    const updatedUser = await updateCustomer(_id, data, token)
    dispatch(refreshListOnUpdate(updatedUser))
    handleModalClose()
    toast.success('Customer Updated successfully!')
  } catch (error:any) {
    console.error('Error while updating Customer', error)
    toast.error(`${error?.message}`)
  }
  
}

  const confirmDelete = async() => {
    try {
      const deleted = await deleteCustomer(customerToDelete?._id, token)
      if(deleted?.statusCode == 200){
        dispatch(refreshListOnDelete(customerToDelete?._id))
        dispatch(setOpenDeleteModal(false))
        toast.success('Customer deleted successfully!')
      }
    } catch (error:any) {
    console.error('Error while deleting Customer', error)
    toast.error(`${error?.message}`)
    }

  }


    const handleModalClose = () => {
      setSelectedRowData(null)
      setUserData(null)
      dispatch(editModalOpen({isModalOpen:false, userData:null}))
    }

  return (
    // <div className="py-4 flex flex-col items-center md:items-start">
    <>

      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => dispatch(setOpenDeleteModal(false))}
        onConfirm={confirmDelete}
        message={`Do you want to delete customer with name: ${customerToDelete?.firstName}?`}
      />
      
      {openEditModal && (  
       <CustomerForm 
       open={openEditModal}
       mode='edit'
       onChange={handleValueChange}
       userData={userData}
       handleData={handleUpdate}
       onClose={handleModalClose}
       />
       )}

     <DataTable 
       table={table}
       editModalOpen={editModalOpen}
       isUserLoading={isUserLoading}
       pageLimit={pageLimit}
       pageNumber={pageNumber}
       usersCount={usersCount}
       selectCustomerForDocument={selectCustomerForDocument}
     />
</>
  )
}

