"use client"

import { Button } from "@/components/ui/button"
import { Tag, Check } from "lucide-react"

interface PriceCategoryButtonProps {
  categoryId: string
  onClick: () => void
  hasData: boolean
}

export function PriceCategoryButton({ categoryId, onClick, hasData }: PriceCategoryButtonProps) {
  return (
    <Button
      type="button"
      variant={hasData ? "default" : "outline"}
      onClick={onClick}
      className={`w-full px-2 ${
        hasData
          ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
          : "border-gray-300 hover:bg-gray-50"
      }`}
    >
      {hasData ? <Check className="h-4 w-4 mr-1" /> : <Tag className="h-4 w-10 mr-1" />}
      Price Category {categoryId}
    </Button>
  )
}
