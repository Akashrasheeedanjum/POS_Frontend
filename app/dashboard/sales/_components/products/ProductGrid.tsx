// "use client"

import type { LatestVatVersion, Product } from "@/types/sales"
import ProductCard from "./ProductCard"
import { Article } from "@/lib/actions/articles.actions"
import { Customer } from "@/lib/actions/customers.actions"
import { HashLoader } from "react-spinners"

interface ProductGridProps {
  products: Article[]
  onAddToCart: (product: Article) => void
  isProductsLoading: boolean;
}

export default function ProductGrid({ products, onAddToCart, isProductsLoading }: ProductGridProps) {
    return (
      <>
    {isProductsLoading ? (
          <div className='w-full h-full flex flex-col justify-center items-center'>
          <HashLoader color="#E4D8D2" size={60}/>
          </div>
    ) : (<>
    {products.length ? (
          <div className="flex-1 p-3 sm:p-2 lg:p-2 bg-gradient-to-br from-slate-100 to-slate-200 overflow-y-auto scrollbar-custom">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-7 gap-2 sm:gap-2 lg:gap-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
   ) : (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 min-h-[300px]">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No products found</h3>
          <p className="text-slate-500">Run Production first to create sellable products, or check category filters.</p>
        </div>
      </div>
      )}
    
</>)}

</>
)

}
