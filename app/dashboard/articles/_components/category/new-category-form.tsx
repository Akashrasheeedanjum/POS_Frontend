"use client"

import { useState } from "react"
import { FolderPlus } from "lucide-react"

export function NewCategoryForm({
  onAddCategory,
}: {
  onAddCategory: (name: string) => void
}) {
  const [newCategoryName, setNewCategoryName] = useState("")

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName)
      setNewCategoryName("")
    }
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-medium text-gray-700">New Category</h3>
      </div>
      <div className="p-4">
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-1 min-w-[180px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddCategory()
              }
            }}
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  )
}
