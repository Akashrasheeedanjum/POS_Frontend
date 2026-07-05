"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllVAT, syncVatVersion, updateVAT } from "@/lib/actions/VatRates.actions"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

interface VatRate {
  code: string
  rate: string
  isActive: boolean
  _id: string
}

interface VatRateFormProps {
  vatRateIds: string[]
  onVatRatesUpdate: (vatRates: string[]) => void
}

export default function VatRateForm({ vatRateIds, onVatRatesUpdate }: VatRateFormProps) {
  const [vatRates, setVatRates] = useState<VatRate[]>([])
  const [initialVatRates, setInitialVatRates] = useState<VatRate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchVatRates = async () => {
    setIsLoading(true)
    try {
      const vatRatesData = await getAllVAT();
      // Filter to only show active VAT rates that are in our vatRateIds
      const filteredVatRates = vatRatesData.filter((rate: VatRate) =>
        rate.isActive
      )
      setVatRates(filteredVatRates)
      setInitialVatRates(filteredVatRates)
    } catch (error) {
      console.error("Failed to fetch VAT rates:", error)
      toast.error("Failed to load VAT rates")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVatRates()
  }, [vatRateIds])

  const handleChange = (index: number, value: string) => {
    const newVatRates = [...vatRates]
    newVatRates[index] = {
      ...newVatRates[index],
      rate: value
    }
    setVatRates(newVatRates)
  }

  const handleSave = async () => {
    try {
          // Filter only changed VAT rates
    const changedRates = vatRates.filter((vatRate, index) => 
      vatRate.rate !== initialVatRates[index]?.rate
    );


    if (changedRates.length === 0) {
      toast.error("No changes to update");
      return;
    }

    // Update only changed VAT rates
    await Promise.all(
      changedRates.map((vatRate) =>
        updateVAT(vatRate._id, {
          code: vatRate.code,
          rate: Number(vatRate.rate),
          isActive: vatRate.isActive
        })
      )
    );
      
      await syncVatVersion()
      
      toast.success("VAT rates updated successfully")
      await fetchVatRates()
    } catch (error) {
      console.error("Error saving VAT rates:", error)
      toast.error("Failed to update VAT rates")
    }
  }

  const getLabelLetter = (code: string) => {
    switch (code) {
      case "VAT1": return "(A)"
      case "VAT2": return "(B)"
      case "VAT3": return "(C)"
      case "VAT4": return "(D)"
      default: return ""
    }
  }
  return (
    <Card className="w-full">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl font-bold">VAT rate</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {isLoading ? (
            <div>Loading VAT rates...</div>
          ) : (
            vatRates?.map((rate, index) => (
              <div key={rate.code} className="space-y-2">
                <Label htmlFor={rate.code} className="block text-sm font-medium">
                  {getLabelLetter(rate.code)} {rate.code}
                </Label>
                <div className="flex items-center">
                  <Input
                    id={rate.code}
                    value={rate?.rate?.toString()}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleChange(index, value)
                      }
                    }}
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-primary hover:bg-primary/90"
          >
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}