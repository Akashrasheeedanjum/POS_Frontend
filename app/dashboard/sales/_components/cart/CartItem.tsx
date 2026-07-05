"use client"

import type { CartItem as CartItemType } from "@/types/sales"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/currency"
import { Minus, Plus, X } from "lucide-react"

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const incrementQuantity = () => {
    onUpdateQuantity(item.articleId, item.quantityAtPurchase + 1)
  }

  const decrementQuantity = () => {
    if (item.quantityAtPurchase > 1) {
      onUpdateQuantity(item.articleId, item.quantityAtPurchase - 1)
    }
  }

  return (
    <div className="flex items-center justify-between py-2 px-2 bg-white rounded-lg shadow-sm border border-slate-200 group hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={decrementQuantity}
          disabled={item.quantityAtPurchase <= 1}
          className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <div className="w-8 text-center">
          <span className="text-xs font-extralight text-slate-800">{item.quantityAtPurchase}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={incrementQuantity}
          className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-slate-200"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 mx-4 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{item.nameAtPurchase}</p>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-bold text-slate-800">{formatCurrency(item.total)}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.articleId)}
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
