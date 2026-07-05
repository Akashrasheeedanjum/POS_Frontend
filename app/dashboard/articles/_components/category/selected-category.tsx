"use client"

import { useState } from "react"
import { Edit, Trash2, Check } from "lucide-react"
import type { Category } from "./category-modal"

export function SelectedCategory({
  selectedCategory,
  onRename,
  onDelete,
}: {
  selectedCategory: Category | null
  onRename: (newName: string) => void
  onDelete: () => void
}) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [renamingValue, setRenamingValue] = useState("")

  const handleStartRenaming = () => {
    if (selectedCategory) {
      setRenamingValue(selectedCategory.name)
      setIsRenaming(true)
    }
  }

  const handleRename = () => {
    onRename(renamingValue)
    setIsRenaming(false)
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700">Selected Category</h3>
      </div>
      <div className="p-4">
        {selectedCategory ? (
          <>
            {isRenaming ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={renamingValue}
                  onChange={(e) => setRenamingValue(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleRename}
                  className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  <Check className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-lg font-medium text-gray-800 px-3 py-2 bg-gray-100 rounded-md flex-grow">
                  {selectedCategory.name}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleStartRenaming}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Rename"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">No category selected</p>
        )}
      </div>
    </div>
  )
}
