"use client"

import type React from "react"

import { useEffect, useCallback, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"
import { getAllVAT } from "@/lib/actions/VatRates.actions"

interface PriceCalculationProps {
  data: {
    vatId: string | any
    vatCode: string
    vatRate: number
    priceVatExcl: number
    priceVatIncl: number
    minPrice: string
    purchasePrice: number
    grossProfitMargin: number
  }
  onChange: (data: any) => void
  categoryId: string
}

interface VatRate {
  _id: string
  code: string
  rate: number
  isActive: boolean
}

export function PriceCalculation({ data, onChange, categoryId }: PriceCalculationProps) {
  // console.log("Price Calculation Data", data)
  const [vatRates, setVatRates] = useState<VatRate[]>([])

  // Fetch VAT rates from backend
  useEffect(() => {
    const fetchVatRates = async () => {
      try {
        const result = await getAllVAT()
        setVatRates(result)
        // console.log("Vat Result", result)
        // ✅ Set default VAT code (first one) only if not already set
        if (!data.vatCode && result.length > 0) {
          const defaultVat = result[0]
          // console.log('defaultVatdefaultVat', defaultVat)
          onChange({
            ...data,
            vatCode: defaultVat.code,
            vatRate: defaultVat.rate,
            vatId: defaultVat._id
          })
        }
        // ✅ Set default VAT code (first one) only if not already set
        if (typeof data.vatId == 'object' && data.vatId.code) {
          onChange({
            ...data,
            vatCode: data.vatId.code,
            vatRate: data.vatId.rate,
            vatId: data.vatId._id
          })
        } else if (!data.vatCode && result.length > 0) {
          const defaultVat = result[0]

          onChange({
            ...data,
            vatCode: defaultVat.code,
            vatRate: defaultVat.rate,
            vatId: defaultVat._id
          })
        }
      } catch (error) {
        console.error("Failed to fetch VAT rates", error)
      }
    }

    fetchVatRates()
  }, [])


  const getSelectedVatObject = useCallback(
    (vatCode: string): VatRate | undefined => {
      return vatRates.find((vat) => vat.code === vatCode)
    },
    [vatRates],
  )


  // Get backend VAT rate based on selected VAT code
  const getBackendVatRate = useCallback(
    (vatCode: string): { vatRate: number; vatId: string } => {
      const vat = getSelectedVatObject(vatCode)
      // console.log("Selected VAT for code:", vatCode, "is", vat)
      return {
        vatRate: vat ? vat.rate : 0,
        vatId: vat ? vat._id : "",
      }
    },
    [getSelectedVatObject],
  )

  const selectedVat = getSelectedVatObject(data.vatCode)

  if (selectedVat) {
    // console.log("Selected full VAT info:", selectedVat._id, selectedVat.code, selectedVat.rate)
  }

  // Calculate VAT inclusive price using BACKEND VAT RATE, not form data
  useEffect(() => {
    if (data.priceVatExcl && data.vatCode && vatRates.length > 0) {
      // Use backend VAT rate instead of data.vatRate
      const { vatRate: backendVatRate } = getBackendVatRate(data.vatCode)

      if (backendVatRate >= 0) {
        const vatAmount = data.priceVatExcl * (backendVatRate / 100)
        const priceWithVat = data.priceVatExcl + vatAmount
        const newPriceVatIncl = Number(priceWithVat.toFixed(2))

        // Only update if the calculated value is different
        if (newPriceVatIncl !== data.priceVatIncl) {
          onChange({
            ...data,
            priceVatIncl: newPriceVatIncl,
            vatRate: backendVatRate, // Update form data with backend rate
          })
        }
      }
    }
  }, [data.priceVatExcl, data.vatCode, data, vatRates, getBackendVatRate, onChange])

  // Calculate gross profit margin when purchase price or VAT exclusive price changes
  useEffect(() => {
    if (data.purchasePrice && data.priceVatExcl && data.purchasePrice > 0) {
      const grossProfit = data.priceVatExcl - data.purchasePrice
      const grossProfitMargin = (grossProfit / data.purchasePrice) * 100
      const newGrossProfitMargin = Number(grossProfitMargin.toFixed(1))

      // Only update if the calculated value is different
      if (newGrossProfitMargin !== data.grossProfitMargin) {
        onChange({
          ...data,
          grossProfitMargin: newGrossProfitMargin,
        })
      }
    }
  }, [data.purchasePrice, data.priceVatExcl, onChange, data])

  const handleNumberInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      const numValue = value === "" ? 0 : Number(value)
      onChange({ ...data, [name]: numValue })
    },
    [data, onChange],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      onChange({ ...data, [name]: value })
    },
    [data, onChange],
  )

  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      if (name === "vatCode") {
        // When VAT code changes, update both vatCode and vatRate from backend
        // console.log('name', name)
        // console.log('value', value)
        const backendVatRate = getBackendVatRate(value)
        // console.log('on change backendVatRate', backendVatRate)
        onChange({
          ...data,
          vatCode: value,
          vatRate: backendVatRate.vatRate,
          vatId: backendVatRate.vatId, // Set VAT ID from backend
          // Set backend rate immediately

        })
      } else {
        onChange({ ...data, [name]: value })
      }
    },
    [data, onChange, getBackendVatRate],
  )

  return (
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Calculator className="h-5 w-5 text-cyan-600 mr-2" />
        <h3 className="text-md font-medium">Price Calculation {categoryId}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`vatCode${categoryId}`} className="text-sm font-medium">
              VAT Code {categoryId}
            </Label>
            <div className="flex gap-2">
              <Select value={data.vatCode} onValueChange={(value) => handleSelectChange("vatCode", value)}>
                <SelectTrigger className="w-28 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {vatRates.map((vat) => (
                    <SelectItem key={vat._id} value={vat.code}>
                      {vat.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <span className="text-gray-500 font-medium">{getBackendVatRate(data.vatCode).vatRate || 0}%</span>
                {/* <span className="text-xs text-green-600">(Backend)</span> */}
              </div>
            </div>
            {data.vatCode && (
              <p className="text-xs text-blue-600">Using backend VAT rate: {getBackendVatRate(data.vatCode).vatRate}%</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`priceVatIncl${categoryId}`} className="text-sm font-medium">
              Price VAT incl {categoryId}
            </Label>
            <Input
              id={`priceVatIncl${categoryId}`}
              name="priceVatIncl"
              value={data.priceVatIncl || ""}
              type="number"
              step="0.01"
              className="bg-gray-100 border-gray-300"
              readOnly
            />
            <p className="text-xs text-green-600">Auto-calculated with backend VAT</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`priceVatExcl${categoryId}`} className="text-sm font-medium">
              Price VAT excl {categoryId}
            </Label>
            <Input
              id={`priceVatExcl${categoryId}`}
              name="priceVatExcl"
              value={data.priceVatExcl || ""}
              onChange={handleNumberInputChange}
              type="number"
              step="0.01"
              className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`minPrice${categoryId}`} className="text-sm font-medium">
              Min. Price {categoryId}
            </Label>
            <Input
              id={`minPrice${categoryId}`}
              name="minPrice"
              value={data.minPrice}
              onChange={handleInputChange}
              type="number"
              step="0.01"
              className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice" className="text-sm font-medium">
              Purchase Price
            </Label>
            <Input
              id="purchasePrice"
              name="purchasePrice"
              value={data.purchasePrice}
              readOnly
              className="border-gray-300 bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-blue-600">From main form</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`grossProfitMargin${categoryId}`} className="text-sm font-medium">
              Gross profit {categoryId}
            </Label>
            <div className="relative">
              <Input
                id={`grossProfitMargin${categoryId}`}
                name="grossProfitMargin"
                value={data.grossProfitMargin || 0}
                className="pr-8 bg-gray-100 border-gray-300"
                readOnly
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <span className="text-gray-500">%</span>
              </div>
            </div>
            <p className="text-xs text-green-600">Auto-calculated</p>
          </div>
        </div>
      </div>
    </div>
  )
}
