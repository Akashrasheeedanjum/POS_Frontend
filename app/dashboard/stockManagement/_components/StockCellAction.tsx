"use client"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDispatch } from 'react-redux'
import { AppDispatch } from "@/app/Redux/store"
import { Article } from "@/lib/actions/articles.actions"
import { useSession } from '@clerk/nextjs';
import { editModalOpen } from "@/app/Redux/Slices/stockSlice"

interface StockCellActionProps {
  data: Article
}

export const StockCellAction = ({ data }: StockCellActionProps) => {
  const dispatch = useDispatch<AppDispatch>()
 
const handleEdit = () => {
    dispatch(editModalOpen({
      isModalOpen: true,
      userData: {
        _id: data._id ?? '',
        productId: data.productId || '',
        designation: data.designation || '',
        category : typeof data.category == 'object' ?  data.category : "",
        subCategory:typeof data.subCategory == 'object' ? data.subCategory : "",
        quantityStock: data.quantityStock || 0,
        quantityMinimum: data.quantityMinimum || 0,
        supplier: data.supplier || ''
    }
      
    }))
  }



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
        disabled={userRole != 'admin' && userAccesses?.modifyProductForm === false}
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Stock
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}