import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Address, Country } from "@/lib/actions/customers.actions";

import { useDispatch } from 'react-redux';
import { AppDispatch } from "@/app/Redux/store";
import { deleteModalOpen, editModalOpen } from "@/app/Redux/Slices/customerSlice";
import { useSession } from '@clerk/nextjs';


interface CustomerCellActionProps {
  data: {
  _id: string;
  vatNumber?: string;
  billWithoutVat?: boolean;
  usePriceList2?: boolean;
  permanentDiscount?: number;
  fidelity?: number;
  blockClient?: boolean;
  customerCode?: string;
  nameDenomination?: string;
  firstName?: string;
  billingAddress?: Address;
  deliveryAddress?: Address;
  country?: Country;
  tel1?: string;
  tel2?: string;
  email?: string;
  remarks?: string;
  createdAt?: string; // from timestamps: true
  updatedAt?: string;
  };
}

export const CustomerCellAction = ({ data }: CustomerCellActionProps) => {
    const dispatch = useDispatch<AppDispatch>();


  const handleEdit = () => {
    console.log('data of user', data)
    dispatch(editModalOpen({isModalOpen:true, userData:data}))
    // Add navigation, modal open, or form fill logic here
  };

  const handleDelete = () => {
    dispatch(deleteModalOpen({isDeleteModalOpen:true, customer:data}))
    // Add delete confirmation/modal or API call logic here
  };

        const { session } = useSession();
    const userAccesses:any = session?.user?.publicMetadata?.accesses
    const userRole:any = session?.user?.publicMetadata?.role

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-full w-full py-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleEdit}
        disabled={userRole != 'admin' && userAccesses?.customerAccess === false}
        >
            <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}
        disabled={userRole != 'admin' && userAccesses?.customerAccess === false}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
};
