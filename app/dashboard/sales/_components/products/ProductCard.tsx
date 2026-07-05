// "use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/currency"
import { Article } from "@/lib/actions/articles.actions"
import { useState } from "react"
import DeleteConfirmationModal from "@/components/modal/DeleteConfirmationModal"

interface ProductCardProps {
  product: Article
  onAddToCart: (product: Article) => void
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {

  const [lowStockProduct, setAddLowStockProduct] = useState(false);
  const handleAddToCart = () => {
   if(product.quantityStock != null && product.quantityStock <= 0){
    setAddLowStockProduct(true)
    return
  }
  onAddToCart(product)
}

const confirmAddToCart = () =>{
  onAddToCart(product)
  setAddLowStockProduct(false)
  }
  return (

    <>
    {
      lowStockProduct && (
      <DeleteConfirmationModal
        open={lowStockProduct}
        onClose={() => setAddLowStockProduct(false)}
        onConfirm={confirmAddToCart}
        message={`This item is out of stock .. continue?`}
      />
      )
    }
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 text-white border-0 overflow-hidden relative"
      onClick={handleAddToCart}
      >
      <CardContent className="p-2 h-full flex flex-col">
        <div className="aspect-square h-24 mb-1 relative overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm   ">
          <Image
            src={product.image || "/placeholder.svg"}
            // alt={product.name}
            alt={String(product.designation)}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-1">
          <h3 className="font-medium text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2.5rem] text-center">
            {/* {product.name} */}
            {String(product.designation)}
          </h3>

          <div className="space-y-2">
            <div className="text-center">
              <div className="bg-white/30 text-white border border-white/50 rounded-full px-3 py-1 font-medium text-sm inline-block">
                {product?.priceCategory1 ? formatCurrency(Number(product?.priceCategory1?.priceVatIncl)) : '---'}
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 text-white border border-white/40 rounded px-2 py-1 text-xs inline-block">
                {/* Stock: {product.stock} */}
                Stock: {product.quantityStock}
              </div>
            </div>
          </div>
        </div>

        {/* Hover effect indicator */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-xs font-bold">+</span>
          </div>
        </div>

        {/* Click ripple effect */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
      </CardContent>
    </Card>
      </>
  )
}
