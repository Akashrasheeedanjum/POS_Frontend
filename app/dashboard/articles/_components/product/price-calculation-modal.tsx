"use client"

import React, { useCallback } from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Save, X } from "lucide-react"
import { PriceCalculation } from "./price-calculation"

interface PriceCalculationModalProps {
  categoryId: string
  purchasePrice: number
  data: {
    vatId: string,
    vatCode: string
    vatRate: number
    priceVatExcl: number
    priceVatIncl: number
    minPrice: string
    // purchasePrice: number
    grossProfitMargin: number
  }
  onClose: () => void
  onSave: (data: any) => void
}

export function PriceCalculationModal({ categoryId, data, onClose, onSave ,purchasePrice}: PriceCalculationModalProps) {
  // console.log("ALL Format Data ", data)
  const [localData, setLocalData] = React.useState(data)

  const handleDataChange = useCallback((newData: any) => {
    setLocalData(newData)
  }, [])

  const handleSave = useCallback(() => {
    onSave(localData)
  }, [localData, onSave])

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg font-semibold">Price Category {categoryId}</DialogTitle>
        </DialogHeader>

        <PriceCalculation data={{...localData,purchasePrice}} onChange={handleDataChange} categoryId={categoryId} />

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 hover:bg-gray-50">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
