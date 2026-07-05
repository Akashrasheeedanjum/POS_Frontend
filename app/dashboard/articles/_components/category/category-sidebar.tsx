"use client"
import { Search, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "./category-modal"

export function CategorySidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
}: {
  categories: Category[]
  selectedCategory: Category | null
  setSelectedCategory: (category: Category) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
}) {
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r bg-gray-50 flex flex-col">
      <div className="p-3 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[30vh] md:max-h-none">
        <ul className="py-2">
          {filteredCategories.map((category) => (
            <li key={category._id}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm flex items-center gap-2",
                  selectedCategory?._id === category._id ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-gray-100",
                )}
              >
                <Tag className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{category.name}</span>
                {category.subCategories.length > 0 && (
                  <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">
                    {category.subCategories.length}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
