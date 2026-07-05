import React, { useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '@/app/Redux/store';
import {filterCustomers, setToken} from '@/app/Redux/Slices/customerSlice';

import { CustomerCellAction } from './CustomerCellAction';
import ButtonsSection from './ButtonsSection';
import SearchFilters from './SearchFilters';
import CustomerTable from './CustomerTable';
import { useSession } from '@clerk/nextjs';
import { toast } from 'sonner';



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
    id: 'EOID',
    accessorKey: 'EOID',
    header: 'EO-ID',
    enableResizing: true
  },
  {
    id: 'FID',
    accessorKey: 'FID',
    header: 'F-ID',
    enableResizing: true
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    enableResizing: true
  },
  {
    id: 'tel1',
    accessorKey: 'tel1',
    header: 'Tel1',
    enableResizing: true
  },
  {
    id: 'tel2',
    accessorKey: 'tel2',
    header: 'Tel2',
    enableResizing: true
  },
  {
    id: 'billingAddress.address',
    accessorKey: 'billingAddress.address',
    header: 'Billing Address',
    enableResizing: true
  },
  {
    id: 'billingAddress.city.cityName',
    accessorKey: 'billingAddress.city.cityName',
    header: 'Billing City',
    enableResizing: true
  },
  {
    id: 'billingAddress.zipCode',
    accessorKey: 'billingAddress.zipCode',
    header: 'Billing ZipCode',
    enableResizing: true
  },
  {
    id: 'country.countryName',
    accessorKey: 'country.countryName',
    header: 'Country',
    enableResizing: true
  },
  {
    id: 'vatNumber',
    accessorKey: 'vatNumber',
    header: 'VatNumber',
    enableResizing: true
  },
  {
    id: 'permanentDiscount',
    accessorKey: 'permanentDiscount',
    header: 'PermanentDiscount',
    enableResizing: true
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Registration Date',
    enableResizing: true
  },
  {
    id: 'billWithoutVat',
    accessorKey: 'billWithoutVat',
    header: 'BillWithoutVat',
    enableResizing: true
  },
  {
    id: 'usePriceList1',
    accessorKey: 'usePriceList1',
    header: 'UsePriceList1',
    enableResizing: true
  },
  {
    id: 'usePriceList2',
    accessorKey: 'usePriceList2',
    header: 'UsePriceList2',
    enableResizing: true
  },
  {
    id: 'usePriceList3',
    accessorKey: 'usePriceList3',
    header: 'UsePriceList3',
    enableResizing: true
  },
  {
    id: 'usePriceList4',
    accessorKey: 'usePriceList4',
    header: 'UsePriceList4',
    enableResizing: true
  },
  {
    id: 'fidelity',
    accessorKey: 'fidelity',
    header: 'Fidelity',
    enableResizing: true
  },
  {
    id: 'blockClient',
    accessorKey: 'blockClient',
    header: 'BlockClient',
    enableResizing: true
  },
  {
    id: 'deliveryAddress.address',
    accessorKey: 'deliveryAddress.address',
    header: 'DeliveryAddress',
    enableResizing: true
  },
  {
    id: 'remarks',
    accessorKey: 'remarks',
    header: 'Remarks',
    enableResizing: true
  },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'UpdatedAt',
    enableResizing: true
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <CustomerCellAction data={row.original} />
  }
];
const CustomerPageContent = () => {

    const dispatch = useDispatch<AppDispatch>();
    const allCustomers = useSelector((state: RootState) => state.customer.allCustomers);
    const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token

   useEffect(() => {
     dispatch(setToken(token));
    if(token){
      dispatch(filterCustomers({token}))
        .unwrap()
        .catch((err) => {
          toast.error(err);
        });
    }
  }, [token,dispatch]);

  return (
<>
   <div className=" h-[calc(100dvh-56px)] overflow-y-auto p-4 md:px-4">
     <ButtonsSection />
     <SearchFilters />
     <CustomerTable 
     columns={columns}
       data={allCustomers}
     />
   </div>

</>
  )
}

export default CustomerPageContent
