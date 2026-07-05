"use client"

import { ChevronUp, ChevronDown } from "lucide-react"
import type { Category } from "./category-modal"

export function PositionControls({
  selectedCategory,
  categories,
  onMoveCategory,
}: {
  selectedCategory: Category | null
  categories: Category[]
  onMoveCategory: (direction: "up" | "down") => void
}) {
  const selectedIndex = selectedCategory ? categories.findIndex((c) => c._id === selectedCategory._id) : -1

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700">Position</h3>
      </div>
      <div className="p-4 flex justify-center gap-4">
        <button
          onClick={() => onMoveCategory("up")}
          disabled={!selectedCategory || selectedIndex <= 0}
          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move Up"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <button
          onClick={() => onMoveCategory("down")}
          disabled={!selectedCategory || selectedIndex === categories.length - 1 || selectedIndex === -1}
          className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move Down"
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
