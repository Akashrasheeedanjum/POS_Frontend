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
import { deleteModalOpen, editModalOpen } from "@/app/Redux/Slices/articlesSlice"
import { Article } from "@/lib/actions/articles.actions"
import { useSession } from '@clerk/nextjs';

interface ArticleCellActionProps {
  data: Article
}

export const ArticleCellAction = ({ data }: ArticleCellActionProps) => {
  const dispatch = useDispatch<AppDispatch>()
 
const handleEdit = () => {
  console.log("🟢 handleEdit clicked - Article data:", data); // ✅ Check here
  console.log("🆔 Article ID:", data._id); // ✅ Specifically check _id
    dispatch(editModalOpen({
      isModalOpen: true,
      userData: {
        _id: data._id,
        productId: data.productId || '',
        designation: data.designation,
        category : typeof data.category == 'object' ?  data.category : "",
        subCategory:typeof data.subCategory == 'object' ? data.subCategory : "",
        quantityStock: data.quantityStock || 0,
        quantityMinimum: data.quantityMinimum || 0,
        supplier: data.supplier || '',
        refArt: data.refArt || '',
        purchasePrice: data.purchasePrice || 0,
        pmp: data.pmp || 0,
        manageStock: data.manageStock || true,
        remarks: data.remarks || '',
        image: data.image || '',
       priceCategory1: data.priceCategory1 || {
        vatId: "",
        vatCode: "",
        vatRate: 0,
        priceVatExcl: 0,
        priceVatIncl: 0,
        minPrice: "",
        grossProfitMargin: 0
      },
      priceCategory2: data.priceCategory2 || {
        vatId: "",
        vatCode: "",
        vatRate: 0,
        priceVatExcl: 0,
        priceVatIncl: 0,
        minPrice: "",
        grossProfitMargin: 0
      },
      priceCategory3: data.priceCategory3 || {
        vatId: "",
        vatCode: "",
        vatRate: 0,
        priceVatExcl: 0,
        priceVatIncl: 0,
        minPrice: "",
        grossProfitMargin: 0
      },
      priceCategory4: data.priceCategory4 || {
        vatId: "",
        vatCode: "",
        vatRate: 0,
        priceVatExcl: 0,
        priceVatIncl: 0,
        minPrice: "",
        grossProfitMargin: 0
      }
    }
      
    }))
  }

  const handleDelete = () => {
    dispatch(deleteModalOpen({
      isDeleteModalOpen: true,
      article: data
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
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}
        disabled={userRole != 'admin' && userAccesses?.modifyProductForm === false}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}