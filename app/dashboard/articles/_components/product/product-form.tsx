"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "./image-upload"
import { PriceCategoryButton } from "./price-category-button"
import { PriceCalculationModal } from "./price-calculation-modal"
import { getAllCategories } from "@/lib/actions/categories.actions"
import { createArticles, updateArticles } from "@/lib/actions/articles.actions"
import { toast } from "sonner"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { addArticle, filterArticles, setOpenEditModal, refreshListOnUpdate } from "@/app/Redux/Slices/articlesSlice"
import { trackChangedFields } from "../../Helper/TrackChangedFields"
import { ClipLoader, FadeLoader } from "react-spinners"
import { allSuppliers, Supplier } from "@/lib/actions/suppliers.action"
import { usePathname } from 'next/navigation';

import { useSession } from '@clerk/nextjs';
export interface ProductFormData {
  _id?: string;
  productId: string
  designation: string
  category: string
  subCategory: string
  quantityStock: number
  quantityMinimum: number
  supplier: string
  refArt: string
  purchasePrice: number
  pmp: number
  manageStock: boolean
  remarks: string
  imageUrl: string | Blob
  priceCategories: {
    [key: string]: {
      vatId: string,
      vatCode: string
      vatRate: number
      priceVatExcl: number
      priceVatIncl: number
      minPrice: string
      // purchasePrice: number
      grossProfitMargin: number
    }
  }
}
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
  mode?: 'add' | 'edit'; // Add mode prop
  initialData?: ProductFormData | null; // For edit mode
  onSave?: (data: ProductFormData) => void
  onCancel?: () => void
}

export function ProductForm({ mode = 'add', initialData = null, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    mode === 'edit' && initialData
      ? initialData
      : {
        productId: "",
        designation: "",
        category: "",
        subCategory: "",
        quantityStock: 0,
        quantityMinimum: 0,
        supplier: "",
        refArt: "",
        purchasePrice: 0,
        pmp: 0,
        manageStock: true,
        remarks: "",
        imageUrl: "",
        priceCategories: {
          "1": {
            vatId: "",
            vatCode: "", // Empty - will be filled from backend
            vatRate: 0, // Will be updated from backend when vatCode is selected
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0,
          },
          "2": {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0,
          },
          "3": {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0,
          },
          "4": {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0,
          },
        },
      })
  type Category = {
    _id: string;
    name: string;
    subCategories: { _id: string; name: string, category: string, createdAt: string, updatedAt: string }[] | undefined;
    // Add other fields as needed
  };

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<any>()
  const [saving, setSaving] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  // const [subCategories, setSubCategories] = useState<Category["subCategories"]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [activePriceCategory, setActivePriceCategory] = useState<string | null>(null)
  const articleData = useSelector((state: RootState) => state.article.selectedArticle);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [vatRates, setVatRates] = useState<any[]>([]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const { session } = useSession();
  const token:any = session?.user?.publicMetadata?.token
  // const handleSelectChange = (name: string, value: string) => {
  //   setFormData((prev) => ({ ...prev, [name]: value }))
  // }


  // 🔄 Handle dropdown changes
  const handleSelectChange = (field: string, value: string) => {
    // If the field is "category", update both category and reset subCategory
    if (field === "category") {
      const selectedCategory = categories.find((cat) => cat._id === value);
      setSubCategories(selectedCategory?.subCategories || []);

      // ✅ Update both category and reset subCategory in one call
      setFormData((prev) => ({
        ...prev,
        category: value,
        subCategory: "", // Reset subCategory when category changes
      }));
    } else {
      // For all other fields like subCategory, just update that field
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };



  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleImageUpload = (previewUrl: string, file: File) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: previewUrl, // For UI preview only
    }))
    setImageFile(file) // Save actual file for FormData
  }

  const handleImageDelete = () => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }))
    setImageFile(null)
  }


  const handlePriceCategoryUpdate = (categoryId: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      priceCategories: {
        ...prev.priceCategories,
        [categoryId]: data,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("formData  too much hrdworking i got it", formData)
    const filteredPriceCategories = Object.fromEntries(
      Object.entries(formData.priceCategories)
        .filter(([_, category]) =>
          category.priceVatExcl !== 0 && category.vatCode !== ""
        )
        .map(([key, category]) => [
          key,
          {
            // vatId: category.vatId,
            vatId: typeof category.vatId === "object"
              ? (category.vatId as { _id: string })._id || ""
              : category.vatId,

            priceVatExcl: category.priceVatExcl,
            priceVatIncl: category.priceVatIncl,
            minPrice: category.minPrice,
            grossProfitMargin: category.grossProfitMargin
          }
        ])
    );
    const cleanedFormData = {
      ...formData,
      priceCategories: filteredPriceCategories,
    };
    delete cleanedFormData._id;
    // console.log('cleanedFormData', cleanedFormData)
    const { priceCategories, imageUrl, ...preparedData } = {
      ...cleanedFormData,
      // quantityStock: Number(formData.qtyStock || 0),
      // quantityMinimum: Number(formData.qtyMin || 0),
      pmp: Number(formData.pmp ?? 0),
      purchasePrice: Number(formData.purchasePrice ?? 0),
      // must be valid too
      ...(cleanedFormData.priceCategories?.["1"] !== undefined && { priceCategory1: cleanedFormData.priceCategories?.["1"] }),
      ...(cleanedFormData.priceCategories?.["2"] !== undefined && { priceCategory2: cleanedFormData.priceCategories?.["2"] }),
      ...(cleanedFormData.priceCategories?.["3"] !== undefined && { priceCategory3: cleanedFormData.priceCategories?.["3"] }),
      ...(cleanedFormData.priceCategories?.["4"] !== undefined && { priceCategory4: cleanedFormData.priceCategories?.["4"] }),
    }

    // console.log("updated prepared data ", preparedData)

    //  const formDataToSend = new FormData()
    //   formDataToSend.append("file", imageFile)
    //   formDataToSend.append("createArticleDto", JSON.stringify(preparedData))
    // return

    if(!preparedData?.priceCategory1 || !preparedData?.priceCategory1.priceVatExcl){
      toast.error('Price Category 1 cannot be empty')
      return
    }

    try {
      setSaving(true)
      if (mode === 'add') {
        const newArticle: any = await createArticles(preparedData, imageFile, token);
        dispatch(addArticle(newArticle))
        dispatch(filterArticles({}));
        toast.success('Article created successfully!')

      }
      else {
        if (!formData._id) {
          toast.error("Article ID not found for update!");
          return;
        }
        const changedFields = trackChangedFields(preparedData, articleData)
        if (Object.keys(changedFields).length === 0 && !imageFile) {
          toast.error('No changes detected!')
          return
        }
        const updatedArticle = await updateArticles(formData._id, changedFields, imageFile, token); // ✅ send _id
        dispatch(refreshListOnUpdate(updatedArticle));
        dispatch(filterArticles({}));
        toast.success('Article updated successfully!');
      }
      onSave?.(formData);

    } catch (error) {
      console.error('Error while creating a new Article', error)
      toast.error(`${error}`)
    } finally {
      setSaving(false)
    }

  };





  // // console.log("Articles Form Data ",articleData)
  // console.log("All Form Data  State",formData)

  // 🔄 Call this function when component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(); // Call your server action
        // console.log("All categories:", data); // 👀 Check what is coming
        setCategories(data); // Save to state
        const resp = await allSuppliers(token)
        setSuppliers(resp.suppliers)
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();

  }, []);

  useEffect(() => {
    if (mode === 'edit' && articleData) {
      // Find the selected category
      // console.log('article data in useEffect', articleData)
      setFormData({
        _id: articleData._id, // ✅ Add this line
        productId: articleData.productId || "",
        designation: articleData.designation || "",
        // Handle category - check if object or string
        category: typeof articleData.category === 'object'
          ? articleData.category._id
          : articleData.category || "",
        // Handle subCategory - check if object or string
        // Handle subCategory - specifically use the _id from the subCategory object
        subCategory: typeof articleData.subCategory === 'object' ? articleData.subCategory._id : 'nai ha object',
        quantityStock: articleData.quantityStock || 0,
        quantityMinimum: articleData.quantityMinimum || 0,
        // category: typeof articleData.category === 'object'
        // ? articleData.category._id
        // : articleData.category || "",
        supplier: typeof articleData.supplier === 'object' ? articleData.supplier._id: articleData.supplier || "",
        refArt: articleData.refArt || "",
        purchasePrice: articleData.purchasePrice || 0,
        pmp: articleData.pmp || 0,
        manageStock: articleData.manageStock ?? true,
        remarks: articleData.remarks || "",
        imageUrl: articleData.image || "",
        priceCategories: {
          "1": articleData.priceCategory1 as StrictPriceCategory || {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0
          },
          "2": articleData.priceCategory2 as StrictPriceCategory || {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0
          },
          "3": articleData.priceCategory3 as StrictPriceCategory || {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0
          },
          "4": articleData.priceCategory4 as StrictPriceCategory || {
            vatId: "",
            vatCode: "",
            vatRate: 0,
            priceVatExcl: 0,
            priceVatIncl: 0,
            minPrice: "",
            grossProfitMargin: 0
          }
        }
      });

      setSubCategories(articleData.subCategory ? [articleData.subCategory] : [])


      if (articleData.image) {
        setImagePreviewUrl(articleData.image);
      }
      setIsFormInitialized(true);
    }
  }, [mode, articleData, categories, isFormInitialized]);

  useEffect(() => {
    // console.log("✅ formData updated:", formData);
    //  console.log('article data in useEffect', articleData)
  }, [formData, articleData]);


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
            <span className="mr-2">{mode == 'add' ? "New Product" : "Edit Product"}</span>
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
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              <ImageUpload
                imageUrl={formData.imageUrl}
                onUpload={handleImageUpload}
                onDelete={handleImageDelete} />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="manageStock"
                    checked={formData.manageStock}
                    onCheckedChange={(checked) => handleSwitchChange("manageStock", checked)}
                  />
                  <Label htmlFor="manageStock">Manage stock</Label>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Last sale</h3>
                <p className="text-gray-700">No records</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700">Price Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["1", "2", "3", "4"].map((categoryId) => (
                    <PriceCategoryButton
                      key={categoryId}
                      categoryId={categoryId}
                      onClick={() => setActivePriceCategory(categoryId)}
                      hasData={formData.priceCategories[categoryId].priceVatExcl > 0}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Middle and Right Columns - Form Fields */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId" className="text-sm font-medium">
                    Product ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    required
                    readOnly={mode === 'edit'} // Make ID read-only in edit mode
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-sm font-medium">
                    Designation <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
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
                    {/* <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    /> */}
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[150px] overflow-y-auto">
                        {categories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subCategory" className="text-sm font-medium">
                      Sub-category
                    </Label>
                    <Select
                      value={formData.subCategory}
                      onValueChange={(value) => handleSelectChange("subCategory", value)}
                    // disabled={subCategories.length === 0} // 🔒 Disable if no subcategories
                    >
                      <SelectTrigger className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[150px] overflow-y-auto">
                        {subCategories.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantityStock" className="text-sm font-medium">
                      Qty stock
                    </Label>
                    <Input
                      id="quantityStock"
                      name="quantityStock"
                      value={formData.quantityStock}
                      onChange={handleInputChange}
                      type="number"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantityMinimum" className="text-sm font-medium">
                      Qty Min.
                    </Label>
                    <Input
                      id="quantityMinimum"
                      name="quantityMinimum"
                      value={formData.quantityMinimum}
                      onChange={handleInputChange}
                      type="number"
                      className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier" className="text-sm font-medium">
                    Supplier
                  </Label>
                  {/* <Input
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  /> */}
                  <Select
                      value={formData.supplier}
                      onValueChange={(value) => handleSelectChange("supplier", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[150px] overflow-y-auto">
                        {suppliers.map((supp) => (
                          <SelectItem key={supp._id} value={supp._id}>
                            {supp.nameDenomination}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="refArt" className="text-sm font-medium">
                    Ref art provided
                  </Label>
                  <Input
                    id="refArt"
                    name="refArt"
                    value={formData.refArt}
                    onChange={handleInputChange}
                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchasePrice" className="text-sm font-medium">
                    Purchase Price
                  </Label>
                  <Input
                    id="purchasePrice"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleInputChange}

                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <Label htmlFor="pmp" className="text-sm font-medium">
                    PMP
                  </Label>
                  <Input
                    id="pmp"
                    name="pmp"
                    value={formData.pmp}
                    onChange={handleInputChange}

                    className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-sm font-medium">
                  Remarks
                </Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows={3}
                  className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                />
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
                  {mode == 'add' ? "Save" : "Update"}
                </>
              }

            </Button>
          </div>
        </CardContent>

      </Card>

      {activePriceCategory && (
        <PriceCalculationModal
          purchasePrice={formData.purchasePrice}
          categoryId={activePriceCategory}
          data={formData.priceCategories[activePriceCategory]}

          onClose={() => setActivePriceCategory(null)}
          onSave={(data) => {
            handlePriceCategoryUpdate(activePriceCategory, data)
            setActivePriceCategory(null)
          }}
        />
      )}
    </form>
  )
}