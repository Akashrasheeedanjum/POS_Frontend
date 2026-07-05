import React, { useEffect, useState } from 'react'
import {
  ColumnDef,
  ColumnResizeMode,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import DeleteConfirmationModal from '@/app/customers/_components/DeleteModal';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { refreshListOnDelete, refreshListOnUpdate, setOpenDeleteModal, setPageLimit,
   setPageNumber, editModalOpen, 
   filterSuppliers} from '@/app/Redux/Slices/supplierSlice';
import SupplierForm from './SupplierForm';
import { transformSupplierData } from '../Helper/transformSupplierData';
import { deleteSupplier, updateSupplier } from '@/lib/actions/suppliers.action';
import { trackChangedFields } from '../Helper/TrackChangedFields';
import DataTable from './DataTable';
import { deepTrimObject } from '../Helper/deepTrimObject';
import { supplierCityCountryCreation } from '../Helper/handleCityCountryCreation';
import { useSession } from '@clerk/nextjs';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<any>[];
  data: TData[];
  pageSizeOptions?: number[];
}

export default function SuppliersTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {


  const dispatch = useDispatch<AppDispatch>();
  const openEditModal = useSelector((state: RootState) => state.supplier.openEditModal);
  const openDeleteModal = useSelector((state: RootState) => state.supplier.openDeleteModal);
  const pageNumber = useSelector((state: RootState) => state.supplier.pageNumberSupplier);
  const pageLimit = useSelector((state: RootState) => state.supplier.pageLimitSupplier);

  const isUserLoading = useSelector((state: RootState) => state.supplier.isSuppliersLoading);
  const selectedUser = useSelector((state: RootState) => state.supplier.selectedSupplier);
  const userToDelete = useSelector((state: RootState) => state.supplier.supplierToDelete);
  const usersCount = useSelector((state: RootState) => state.supplier.suppliersCount);
  
  const filterQuery = useSelector((state: RootState) => state.supplier.query);
    const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token


  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'contact': false,
    'address': false,
    'tel2': false,
  });

      const [columnSizing, setColumnSizing] = useState({});
      const [selectedRowData, setSelectedRowData] = useState<any>(null);
      const [userData, setUserData] = useState<any>()

    useEffect(() => {
      setUserData(selectedUser);
      setSelectedRowData(selectedUser);
    }, [selectedUser]); // runs whenever selectedSupplier changes


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
      dispatch(setPageNumber(newState.pageIndex + 1));  //to increase page number in redux
      dispatch(setPageLimit(newState.pageSize));     //to increase page limit in redux

      /*fetch filtered results with same query from redux but different page numbers, 
      Note: Query is changed in searchFilters component*/
        dispatch(filterSuppliers({
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
    const newData = { ...prev };
      setDeepValue(newData, path, value);
      return newData;
  });
  
};


const handleUpdate = async() => {

  const {_id} = selectedRowData
  const updatedUserData = await supplierCityCountryCreation(userData)
  const trimmedData = deepTrimObject(updatedUserData);   //to trim the data of fields before submission
  const changedFields = trackChangedFields(trimmedData, selectedRowData)
  
  if (Object.keys(changedFields).length === 0) {
    toast.info("No changes to update.");
    return;
  }

  const data = transformSupplierData(changedFields)

  try {
    const updatedUser = await updateSupplier(_id, data, token)
    dispatch(refreshListOnUpdate(updatedUser))
    toast.success('Supplier Updated successfully!') 
    handleModalClose()
  } catch (error:any) {
    console.error('Error while updating Supplier', error)
    toast.error(`${error?.message}`)
  }
  
}

  const confirmDelete = async() => {
    try {
      const deleted = await deleteSupplier(userToDelete?._id, token)
      if(deleted?.statusCode == 200){
        dispatch(refreshListOnDelete(userToDelete?._id))
        dispatch(setOpenDeleteModal(false))
        toast.success('Supplier deleted successfully!')
      }
    } catch (error:any) {
    console.error('Error while deleting Supplier', error)
    toast.error(`${error?.message}`)
    }

  }

  const handleModalClose = () => {
    setSelectedRowData(null)
    setUserData(null)
    dispatch(editModalOpen({isModalOpen:false, userData:null}))
  }

  return (
    <>
          <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => dispatch(setOpenDeleteModal(false))}
        onConfirm={confirmDelete}
        message={`Do you want to delete supplier with Denomination-Name: ${userToDelete?.nameDenomination}?`}
      />

      {openEditModal && (
      <SupplierForm
      open={openEditModal}
      mode="edit"
      onChange={handleValueChange}
      userData={userData}
      handleData={handleUpdate}
      onClose={handleModalClose}
      />
      )}
    
      {/* previously here was code which is now in TableCode.tsx if needed in future */}
      <DataTable 
      table={table}
      isUserLoading={isUserLoading}
      pageLimit={pageLimit}
      pageNumber={pageNumber}
      editModalOpen={editModalOpen}
      usersCount={usersCount}
      />

</>
  )
}

