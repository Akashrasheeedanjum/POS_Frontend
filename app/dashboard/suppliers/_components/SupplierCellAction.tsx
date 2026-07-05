import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Address, Country, Customer } from "@/lib/actions/customers.actions";

import { useDispatch } from 'react-redux';
import { City } from "@/lib/actions/customers.actions";
import { AppDispatch } from "@/app/Redux/store";
import { deleteModalOpen, editModalOpen } from "@/app/Redux/Slices/supplierSlice";
// import type { AppDispatch } from '../reduxToolKit/store';
// import {editModalOpen, deleteModalOpen} from '../reduxToolKit/customerSlice'; 
interface SupplierCellActionProps {
  data: {
  _id: string;
  numberProvided?: string;
  vatNumber?: string;
  nameDenomination?: string;
  contact?: string;
  address?: string;
  city?: City;
  zipCode?: string;
  tel1?: string;
  tel2?: string;
  fax?: string;
  accountNumber?: string;
  email?: string;
  remarks?: string; 
  createdAt?: string; // from timestamps: true
  updatedAt?: string;
  };
}

export const SupplierCellAction = ({ data }: SupplierCellActionProps) => {
    const dispatch = useDispatch<AppDispatch>();


  const handleEdit = () => {
    dispatch(editModalOpen({isModalOpen:true, userData:data}))
    // Add navigation, modal open, or form fill logic here
  };

  const handleDelete = () => {
    dispatch(deleteModalOpen({isDeleteModalOpen:true, supplier:data}))
    // Add delete confirmation/modal or API call logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-full w-full py-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};
