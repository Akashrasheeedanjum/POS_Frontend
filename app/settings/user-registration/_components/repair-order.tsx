"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { getAllVAT } from "@/lib/actions/VatRates.actions"
import { toast } from "sonner"


interface RepairOrderProps{
    manageRepairs?: boolean
    vatCodeApplied?: number
    endOrderMessage?: string
    onRepairOrderUpdate: (settings: {
        manageRepairs?: boolean
        vatCodeApplied?: number
        endOrderMessage?: string
    }) => void
}

interface VatRate{
    _id: string
    code: string,
    rate: number,
    isActive: boolean,
    __v: number
}

export default function RepairOrder({
    manageRepairs,
    vatCodeApplied,
    endOrderMessage,
    onRepairOrderUpdate
}: RepairOrderProps) {

    const [vatRates, setVatRates] = useState<VatRate[]>([])

    useEffect(() => {
        //fetching available vat-rates so it can be showned in drop down list and then selected
        const fetchVatRates = async () => {
          try {
            const params = await getAllVAT()
            const activeParams = params?.filter((param:VatRate) => param.isActive)
            setVatRates(activeParams)
          } catch (error) {
            console.error("Error fetching vat-rates:", error)
            toast.error("Failed to fetch vat-rates")
          }
        }
    
        fetchVatRates()
      }, [])


    const handleChange = (field: string, value: string | number | boolean) => {
        onRepairOrderUpdate({ [field]: value })
      }

    return (


        <div className="max-w-4xl mx-auto p-6 md:p-0">
  <div className="flex flex-col md:flex-row gap-6">
    {/* Repair Order Card */}
    <div className="p-6 max-w-md border border-gray-200 rounded-md w-full">
      <h1 className="text-lg font-medium mb-4">Repair order</h1>

      <div className="flex justify-between items-center mb-3">
        <span className="text-sm">Manage the repairs</span>
        <Switch 
          checked={manageRepairs} 
          onCheckedChange={(checked) => handleChange('manageRepairs', checked)} 
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm">VAT code applied</span>
        <div className="flex items-center gap-2">
          <span className="text-sm">{vatCodeApplied || "N/A"}%</span>
          <div className="relative">
            {vatRates?.length > 0 && (
              <select
                value={vatCodeApplied}
                onChange={(e) => handleChange('vatCodeApplied', Number(e.target.value))}
                className="appearance-none border border-gray-300 rounded px-2 py-1 pr-8 text-sm focus:outline-none"
              >
                {vatRates.map((vate) => (
                  <option key={vate._id} value={vate.rate}>
                    {vate.code.replace(/[^\d]/g, '')}
                  </option>
                ))}
              </select>
            )}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* End Order Message Card */}
    <div className="p-6 max-w-md border border-gray-200 rounded-md w-full">
      <p className="text-lg font-medium mb-4">End order message</p>
      <textarea
        placeholder="<< MERCI DE VOTRE VISITE >>"
        value={endOrderMessage}
        onChange={(e) => handleChange('endOrderMessage', e.target.value)}
        className="w-full h-32 border border-gray-300 rounded-md p-2 text-sm focus:outline-none resize-none"
      />
    </div>
  </div>
</div>


        // <div className="max-w-4xl mx-auto p-6 md:p-0">
        //     <div className="p-6 max-w-md border border-gray-200 rounded-md">
        //         <h1 className="text-lg font-medium mb-4">Repair order</h1>

        //         <div className="flex justify-between items-center mb-3">
        //             <span className="text-sm">Manage the repairs</span>
        //             <Switch 
        //             checked={manageRepairs} 
        //             onCheckedChange={(checked) => handleChange('manageRepairs', checked)} />
        //         </div>

        //         <div className="flex justify-between items-center">
        //             <span className="text-sm">VAT code applied</span>
        //             <div className="flex items-center gap-2">
        //                 <span className="text-sm">{vatCodeApplied || "N/A"}%</span>
        //                 <div className="relative">
        //                 {vatRates?.length > 0 && (
        //                     <select
        //                     value={vatCodeApplied}
        //                     onChange={(e) => handleChange('vatCodeApplied', e.target.value)}
        //                         className="appearance-none  border border-gray-300 rounded px-2 py-1 pr-8 text-sm focus:outline-none"
        //                     >
        //                      {vatRates.map((vate) => (
        //                         <option 
        //                         key={vate._id}
        //                         value={vate.rate}
        //                         >
        //                             {vate.code.replace(/[^\d]/g, '')}
        //                             </option>
        //                      ))}   
        //                     </select>
        //                 )}
        //                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1">
        //                         <ChevronDown className="h-4 w-4 text-gray-500" />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}
