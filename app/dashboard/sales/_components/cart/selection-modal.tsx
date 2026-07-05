"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, ChevronUp, ChevronDown, RotateCcw, Edit } from "lucide-react"
import { SelectionModalProps } from "@/types/modal-types"

export function SelectionModal({
  isOpen,
  onClose,
  title,
  subtitle,
  data,
  columns,
  searchConfig,
  onSelect,
  showNewButton = false,
  showContentButton = false,
  showWordContentButton = false,
  showCustomersButton = false,
  customFooter,
}: SelectionModalProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [searchValue, setSearchValue] = useState("")

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchConfig || !searchValue.trim()) return data

    return data.filter((item) => {
      const fieldValue = item[searchConfig.field]
      return fieldValue?.toString().toLowerCase().includes(searchValue.toLowerCase())
    })
  }, [data, searchConfig, searchValue])

  const handleRowClick = (index: number) => {
    setSelectedIndex(index)
  }

  const handleOk = () => {
    if (selectedIndex !== null && filteredData[selectedIndex]) {
      onSelect(filteredData[selectedIndex])
    }
  }

 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0 gap-0"  >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b bg-gray-100">
          <div className="flex items-center gap-2">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          
          </div>
    
        </DialogHeader>

          <>
            {/* Subtitle */}
            {subtitle && (
              <div className="px-4 py-2 bg-gray-50 border-b">
                <p className="text-sm text-gray-600">{subtitle}</p>
              </div>
            )}

            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="min-w-full">
                  {/* Table Header */}
                  <div className="sticky top-0 bg-gray-600 text-white">
                    <div className="flex">
                      {columns.map((column, index) => (
                        <div
                          key={column.key}
                          className={`px-3 py-2 text-sm font-medium border-r border-gray-500 last:border-r-0 ${column.width}`}
                        >
                          {column.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="bg-white">
                    {filteredData.map((item, index) => (
                      <div
                        key={index}
                        className={`flex cursor-pointer border-b border-gray-200 hover:bg-gray-50 ${
                          selectedIndex === index ? "bg-cyan-400 text-white" : ""
                        }`}
                        onClick={() => handleRowClick(index)}
                      >
                        {columns.map((column) => (
                          <div
                            key={column.key}
                            className={`px-3 py-2 text-sm border-r border-gray-200 last:border-r-0 ${column.width} ${
                              column.key === "sellPrice" || column.key === "amount" ? "text-right" : ""
                            }`}
                          >
                            {item[column.key]}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 p-4 space-y-4">
              {/* Search Section */}
              {searchConfig && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">Search by:</span>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">{searchConfig.label}:</label>
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={searchConfig.placeholder}
                      className="w-48"
                    />
                    <Button variant="outline" size="sm" className="p-2 bg-transparent">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Custom Footer Content */}
              {customFooter && <div>{customFooter}</div>}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {showContentButton && (
                    <Button variant="outline" size="sm">
                      Content
                    </Button>
                  )}
                  {showWordContentButton && (
                    <Button variant="outline" size="sm">
                      word content
                    </Button>
                  )}
                  {showCustomersButton && (
                    <Button variant="outline" size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                      Customers
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="p-2 bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {showNewButton && (
                    <Button variant="outline" size="sm" className="bg-orange-500 text-white hover:bg-orange-600">
                      New
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleOk}
                    disabled={selectedIndex === null}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Ok
                  </Button>
                  <Button variant="outline" onClick={onClose} className="bg-purple-500 text-white hover:bg-purple-600">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </>
      </DialogContent>
    </Dialog>
  )
}
