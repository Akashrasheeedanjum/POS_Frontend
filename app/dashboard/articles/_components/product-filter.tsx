
"use client";
import { useEffect, useState } from "react"
import ProductCategory from "./product-category"
import ProductFilterClient from "./product-filter-client"
import { getAllCategories } from "@/lib/actions/categories.actions";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/Redux/store";
import { filterArticles, setPageNumber, setQuery } from "@/app/Redux/Slices/articlesSlice";

export default function ProductFilter() {
  const dispatch = useDispatch<AppDispatch>();

  const [categories, setCategories] = useState([])

  const pageLimit = useSelector((state: RootState) => state.article.pageLimitArticle);


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const serverCategories = await getAllCategories();
        setCategories(serverCategories);

      } catch (error) {
        console.error("Failed to fetch categories", error);
        toast.error(`Failed to fetch categories`)
      }
    }

    fetchCategories()
  }, []);

  const handleCategoryChange = (value: any) => {
    if (value != 'all') {
      const query = { 'category': value }
      dispatch(setQuery(query))
      dispatch(setPageNumber(1));
      dispatch(filterArticles({ search: query, limit: pageLimit, page: 1 }))

    } else {
      dispatch(setQuery({}))
      dispatch(setPageNumber(1));
      dispatch(filterArticles({}))
    }
  }
  return (
    <div className="bg-muted/30 px-4 py-2 rounded-md">
      <div className="flex flex-col   lg:flex-row lg:justify-between lg:items-center  h-full  ">
        <div className="flex flex-col">
          <h2 className="text-base font-medium mb-2">List products by category</h2>
          <div className="  flex md:flex-row flex-col  gap-2   ">

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div>
                {/* <label htmlFor="category" className="block text-sm mb-1">
                Category
              </label> */}
                <div className="flex items-center">
                  <select
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    id="category"
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-[180px]"
                    defaultValue="PC"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                  <button className="ml-2 p-1">
                    <span className="sr-only">List view</span>
                    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M2 4H13"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 7.5H13"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 11H13"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div  >
              <ProductCategory />
            </div>

          </div>
        </div>

        <div className="  h-full ">
          <h2 className="text-lg font-medium mb-2">Search Filter</h2>
          <ProductFilterClient />
        </div>
      </div>
    </div>
  )
}
