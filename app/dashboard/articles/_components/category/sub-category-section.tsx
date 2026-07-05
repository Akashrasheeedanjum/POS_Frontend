"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Category } from "./category-modal"

export function SubCategorySection({
  selectedCategory,
  onAddSubCategory,
  onDeleteSubCategory,
}: {
  selectedCategory: Category | null
  onAddSubCategory: (name: string) => void
  onDeleteSubCategory: (id: string) => void
}) {
  const [newSubCategoryName, setNewSubCategoryName] = useState("")

  const handleAddSubCategory = () => {
    if (newSubCategoryName.trim()) {
      onAddSubCategory(newSubCategoryName)
      setNewSubCategoryName("")
    }
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center flex-wrap gap-2">
        <h3 className="font-medium text-gray-700">Sub-categories</h3>
        {selectedCategory && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="New sub-category"
              value={newSubCategoryName}
              onChange={(e) => setNewSubCategoryName(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSubCategory()
                }
              }}
            />
            <button
              onClick={handleAddSubCategory}
              disabled={!newSubCategoryName.trim()}
              className="p-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className="p-4 max-h-[30vh] overflow-y-auto">
        {selectedCategory ? (
          selectedCategory.subCategories.length > 0 ? (
            <ul className="divide-y">
              {selectedCategory.subCategories.map((subCategory) => (
                <li key={subCategory._id} className="py-2 first:pt-0 last:pb-0 flex justify-between items-center">
                  <span className="text-gray-800 truncate">{subCategory.name}</span>
                  <button
                    onClick={() => onDeleteSubCategory(subCategory._id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No sub-categories added yet</p>
          )
        ) : (
          <p className="text-gray-500 italic">Select a category first</p>
        )}
      </div>
    </div>
  )
}
