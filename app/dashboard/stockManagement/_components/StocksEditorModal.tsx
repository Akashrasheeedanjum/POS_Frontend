"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getAllCategories } from "@/lib/actions/categories.actions"
import { createArticles, updateArticles, updateStock } from "@/lib/actions/articles.actions"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { ClipLoader, FadeLoader } from "react-spinners"
import { allSuppliers, Supplier } from "@/lib/actions/suppliers.action"
import { usePathname } from 'next/navigation';

import { useSession } from '@clerk/nextjs';
import { trackChangedFields } from "../../articles/Helper/TrackChangedFields"
import { filterArticlesForStock, refreshListOnUpdate, setOpenEditModal, StockData } from "@/app/Redux/Slices/stockSlice"


interface StrictPriceCategory {
  vatId: string;
  vatCode: string;
  vatRate: number;
  priceVatExcl: number;
  priceVatIncl: number;
  minPrice: string;
  grossProfitMargin: number;
}
interface ProductFormProps {
  mode?: 'edit'; // Add mode prop
  initialData?: StockData | null; // For edit mode
  onSave?: (data: StockData) => void
  onCancel?: () => void
}

export function StockEditorModal({ mode = 'edit', initialData = null, onSave, onCancel }: ProductFormProps) {
  
//   console.log("initialData in modal", initialData)
    const [formData, setFormData] = useState<StockData>(
    mode === 'edit' && initialData
      ? initialData
      : {
        _id: "",
        productId: "",
        designation: "",
        category: "",
        subCategory: "",
        quantityStock: 0,
        quantityMinimum: 0,
        supplier: ""
      })
  type Category = {
    _id: string;
    name: string;
    subCategories: { _id: string; name: string, category: string, createdAt: string, updatedAt: string }[] | undefined;
    // Add other fields as needed
  };

  const [saving, setSaving] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>();
  const articleData = useSelector((state: RootState) => state.article.selectedArticle);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const { session } = useSession();
  const token:any = session?.user?.publicMetadata?.token



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!formData.newStockQuantity || formData.newStockQuantity <= 0) {
        toast.error('Please enter valid stock!');
        return
    }

    try {
      setSaving(true)
        if (!formData._id) {
          toast.error("Article ID not found for update!");
          return;
        }

        const updatedArticle = await updateStock(formData._id, Number(formData.newStockQuantity), token); // ✅ send _id
        dispatch(refreshListOnUpdate(updatedArticle));
        dispatch(filterArticlesForStock({}));
        toast.success('Article Stock updated successfully!');
      
      onSave?.(formData);

    } catch (error) {
      console.error('Error while creating a new Article', error)
      toast.error(`${error}`)
    } finally {
      setSaving(false)
    }

  };



  useEffect(() => {
    if (mode === 'edit' && articleData) {
      setFormData({
        _id: articleData._id || '', // ✅ Add this line
        productId: articleData.productId || "",
        designation: articleData.designation || "",
        category: typeof articleData.category === 'object'
          ? articleData.category._id
          : articleData.category || "",
        subCategory: typeof articleData.subCategory === 'object' ? articleData.subCategory._id : 'nai ha object',
        quantityStock: articleData.quantityStock || 0,
        quantityMinimum: articleData.quantityMinimum || 0,
        supplier: typeof articleData.supplier === 'object' ? articleData.supplier._id: articleData.supplier || "",

      });
      setIsFormInitialized(true);
    }
  }, [mode, articleData, isFormInitialized]);



  const closeModal = () => {
    dispatch(setOpenEditModal(false))
    onCancel?.()

  }

  const pathname = usePathname();

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto">
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg flex flex-row items-center justify-between p-5">
          <CardTitle className="text-xl font-medium flex items-center">
            <span className="mr-2">Edit Stock</span>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
              {formData.productId || "Draft"}
            </Badge>
          </CardTitle>
          {pathname.includes('/dashboard/sales') ? null
          : <Button
            type="button"
            onClick={closeModal}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-700/30"
          >
            <X className="h-5 w-5" />
          </Button>}
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">



            {/* Middle and Right Columns - Form Fields */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId" className="text-sm font-medium">
                    Product ID
                  </Label>
                  <Input
                    id="productId"
                    name="productId"
                    disabled={true}
                    value={formData.productId}
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-sm font-medium">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    name="designation"
                    disabled={true}
                    value={formData.designation}
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">
                      Category
                    </Label>
                    <Input
                      disabled={true}
                      value={typeof formData.category === 'object' ? formData.category.name : formData.category}
                      type="text"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCategory" className="text-sm font-medium">
                      Sub-category
                    </Label>
                    <Input
                      disabled={true}
                      value={typeof formData.subCategory === 'object' ? formData.subCategory.name : formData.subCategory}
                      type="text"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-sm font-medium">
                    Supplier
                  </Label>
                    <Input
                    disabled={true}
                      value={typeof formData.supplier === 'object' ? formData.supplier.nameDenomination : formData.supplier}
                      type="text"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                </div>

              </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantityStock" className="text-sm font-medium">
                      Current stock
                    </Label>
                    <Input
                      id="quantityStock"
                      name="quantityStock"
                      disabled={true}
                      value={formData.quantityStock}
                      type="number"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantityMinimum" className="text-sm font-medium">
                      Quantity Minimum
                    </Label>
                    <Input
                      id="quantityMinimum"
                      name="quantityMinimum"
                      disabled={true}
                      value={formData.quantityMinimum}
                      type="number"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantityStock" className="text-sm font-medium">
                      New Stock
                    </Label>
                    <Input
                      id="newStockQuantity"
                      name="newStockQuantity"
                      value={formData.newStockQuantity}
                      onChange={handleInputChange}
                      type="number"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>



            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={closeModal} className="border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className={`bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700
                ${saving ? 'cursor-not-allowed' : ''}
                `}
            >

              {saving ?
                <ClipLoader color="#E4D8D2" size={15} />
                :
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update
                </>
              }

            </Button>
          </div>
        </CardContent>

      </Card>

    </form>
  )
}