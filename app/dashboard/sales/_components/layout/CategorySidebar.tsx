// "use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { categories } from "../../data/mockData"
import { useEffect, useState } from "react"
import { getAllCategories } from "@/lib/actions/categories.actions"
import { toast } from "sonner"
import { Category, SubCategory } from "@/lib/actions/articles.actions"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/app/Redux/store"
import { filterProducts } from "@/app/Redux/Slices/salesSlice"

interface CategorySidebarProps {
  selectedCategory: string | null
  selectedSubCategory: string | null
  onCategorySelect: (categoryId: string | null) => void
  onSubCategorySelect: (subCategoryId: string | null) => void
}

export default function CategorySidebar({ selectedCategory,
  selectedSubCategory,
  onCategorySelect,
  onSubCategorySelect, }: CategorySidebarProps) {

    const dispatch = useDispatch<AppDispatch>();

    const [categories, setCategories] = useState<Category[]>([])

  const selectedCat:any = categories?.find((cat) => cat._id === selectedCategory)

  useEffect(() => {
    const fetchCategories = async() => {
      try {
      const resp =  await getAllCategories()
      setCategories(resp)
      } catch (error) {
        console.error(error)
        toast.error(`${error}`)
      }
    }

    fetchCategories()
  }, [])

  // console.log('selectedCategory', selectedCategory)
  // console.log('selectedSubCategory', selectedSubCategory)


  const handleCategorySelect = (category:any, subCat:any = '') => {

    if(category == 'all'){
    dispatch(filterProducts({}))
    onCategorySelect(null)
    onSubCategorySelect(null)
    return
    }


    const query:any = {}
    if(category != 'all' && typeof category == 'object' && !subCat){
      query.category = category?._id 
      onCategorySelect(category._id)
    }else if(typeof subCat == 'object'){
      query.category = category?._id 
      query.subCategory = subCat?._id 
      onSubCategorySelect(subCat?._id)
    }
    dispatch(filterProducts({ search: query}))
  
  }

  return (
    <div className="w-full 2xl:w-48 bg-slate-200 border-b lg:border-b-0 lg:border-r border-slate-300 flex 2xl:flex-col">
      <div className="p-3 2xl:p-4 border-b border-slate-300 hidden 2xl:block">
        <h2 className="font-semibold text-slate-800">
          {selectedCat?.subCategories && selectedCat.subCategories.length > 0
            ? "Subcategories"
            : "Categories"}

        </h2>
      </div>

      <div className="flex 2xl:flex-col flex-1 overflow-x-auto 2xl:overflow-x-visible 2xl:overflow-y-auto">
        {/* Back button if subcategories are showing */}
        {selectedCat?.subCategories && selectedCat.subCategories.length > 0 && (
          <Button
            variant="ghost"
            className="flex-shrink-0 2xl:w-full justify-start rounded-none border-r 2xl:border-r-0 2xl:border-b border-slate-300 py-3 px-4 text-slate-700 hover:bg-slate-300 text-sm whitespace-nowrap"
            onClick={() => onCategorySelect(null)}
          >
            ← Back to Categories
          </Button>
        )}

        {/* If subcategories available and category is selected, show subcategories */}
        {selectedCat?.subCategories && selectedCat.subCategories.length > 0 ? (
          selectedCat.subCategories.map((sub:SubCategory) => (
            <Button
              key={sub._id}
              variant="ghost"
              className={cn(
                "flex-shrink-0 2xl:w-full justify-start rounded-none border-r 2xl:border-r-0 2xl:border-b border-slate-300 py-3 px-4 text-slate-700 hover:bg-slate-300 text-sm whitespace-nowrap",
                selectedSubCategory === sub._id && "bg-slate-300 font-semibold",
              )}
              onClick={() => handleCategorySelect(selectedCat, sub)} 
            >
              {sub.name}
            </Button>
          ))
        ) : (
          <>
            <Button
              variant="ghost"
              className={cn(
                "flex-shrink-0 2xl:w-full justify-start rounded-none border-r 2xl:border-r-0 2xl:border-b border-slate-300 py-3 px-4 text-slate-700 hover:bg-slate-300 text-sm whitespace-nowrap",
                selectedCategory === null && "bg-slate-300 font-semibold",
              )}
              onClick={() => handleCategorySelect('all')}
            >
              All Products
            </Button>

            {categories.map((category) => (
              <Button
                key={category._id}
                variant="ghost"
                className={cn(
                  "flex-shrink-0 2xl:w-full justify-start rounded-none border-r 2xl:border-r-0 2xl:border-b border-slate-300 py-3 px-4 text-slate-700 hover:bg-slate-300 text-sm whitespace-nowrap",
                  selectedCategory === category._id && "bg-slate-300 font-semibold",
                )}
                // onClick={() => onCategorySelect(category._id)}
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
              </Button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
