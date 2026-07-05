"use client";
import React, { useEffect } from 'react'
import ButtonsSection from './ButtonsSection'
import SearchFilters from './SearchFilters'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import SuppliersTable from './SuppliersTable';
import { ColumnDef } from '@tanstack/react-table';
import { SupplierCellAction } from './SupplierCellAction';
import {filterSuppliers } from '@/app/Redux/Slices/supplierSlice';
import { useSession } from '@clerk/nextjs';
import { toast } from 'sonner';
import { setToken } from '@/app/Redux/Slices/customerSlice';


export const columns: ColumnDef<any>[] = [
  {
    id: 'numberProvided',
    accessorKey: 'numberProvided',
    header: 'No. provided.',
    enableResizing: true
  },
  {
    id: 'nameDenomination',
    accessorKey: 'nameDenomination',
    header: 'Name Denomination',
    enableResizing: true
  },
  {
    id: 'contact',
    accessorKey: 'contact',
    header: 'Contact',
    enableResizing: true
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: 'Adresse',
    enableResizing: true
  },
  {
    id: 'city.cityName',
    accessorKey: 'city.cityName',
    header: 'City',
    enableResizing: true
  },
  {
    id: 'zipCode',
    accessorKey: 'zipCode',
    header: 'ZipCode',
    enableResizing: true
  },
  {
    id: 'tel1',
    accessorKey: 'tel1',
    header: 'Tel 1',
    enableResizing: true
  },
  {
    id: 'tel2',
    accessorKey: 'tel2',
    header: 'Tel 2',
    enableResizing: true
  },
  {
    id: 'fax',
    accessorKey: 'fax',
    header: 'Fax',
    enableResizing: true
  },
  {
    id: 'accountNumber',
    accessorKey: 'accountNumber',
    header: 'Account Number',
    enableResizing: true
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    enableResizing: true
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <SupplierCellAction data={row.original} />
  }
];

const SuppliersPageContent = () => {
    
    const dispatch = useDispatch<AppDispatch>();
    const allSuppliers = useSelector((state: RootState) => state.supplier.allSuppliers);
        
    const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token
    
      useEffect(() => {
        dispatch(setToken(token));  //because token is same for whole app
        if(token){
        dispatch(filterSuppliers({}))
        .unwrap()
        .catch((err) => {
          toast.error(err);
        });
    }
      }, [token, dispatch]);

  return (
    <div className=" h-[calc(100dvh-56px)] overflow-y-auto p-4 md:px-4">
      <ButtonsSection />
      <SearchFilters />
      <SuppliersTable 
      columns={columns}
      data={allSuppliers}
      />
    </div>
  )
}

export default SuppliersPageContent
