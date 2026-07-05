"use client"

import { FinancialParameters, getfinancialparameters, updateFinancialParameters } from "@/lib/actions/financialParameters.actions"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import VatRateForm from "./_components/vate-rate"
import PaymentMethods from "./_components/payment-methods"
import LocalSettings from "./_components/local-settings"
import { Button } from "@/components/ui/button"
import { HashLoader } from "react-spinners"


export default function Page() {
  const [financialParams, setFinancialParams] = useState<FinancialParameters | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [hasChanges, setHasChanges] = useState(false)
  const [updatedParams, setUpdatedParams] = useState<Partial<FinancialParameters>>({})

  useEffect(() => {
    const fetchFinancialParams = async () => {
      try {
        setIsLoading(true)
        const params = await getfinancialparameters()
        
        setFinancialParams(params[0])
      } catch (error) {
        console.error("Error fetching financial parameters:", error)
        toast.error("Failed to fetch financial settings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFinancialParams()
  }, [])

  const handleUpdateFinancialParams = (changedParams: Partial<FinancialParameters>) => {
    if (!financialParams) return

    setUpdatedParams((prev) => ({
      ...prev,
      ...changedParams,
    }))
    setHasChanges(true)
  }

  const saveAllChanges = async () => {
    if (!financialParams || !hasChanges) return

    try {
      setIsLoading(true)
      const newParams = { ...financialParams, ...updatedParams }
      if(!newParams.currencySymbol.trim()){
        toast.error("Currency Symbol cannot be empty")
        return;
      }
      if(newParams.currencySymbol){
        newParams.currencySymbol = newParams.currencySymbol.trim()
      }
      const { __v, _id, vatRates,paymentMethods, ...rest } = newParams
      const newParamsData = {
        ...rest,
        vatRates: Array.isArray(vatRates) ? vatRates.map(rate => rate._id) : [],
        paymentMethods: Array.isArray(paymentMethods) ? paymentMethods.map(pm => (pm._id ? pm._id : pm)) : []
      };
      
      await updateFinancialParameters(_id, newParamsData as any)

      setFinancialParams(newParams)
      setHasChanges(false)
      setUpdatedParams({})
      toast.success("Financial settings updated successfully")
    } catch (error) {
      console.error("Error updating financial parameters:", error)
      toast.error("Failed to update financial settings")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">
    <HashLoader color="#E4D8D2" size={60}/>
    </div>
  }

  if (!financialParams) {
    return <div className="flex justify-center items-center h-full">
      <div className="text-center text-red-500">
      No financial settings found.
      </div>
      </div>
  }

  console.log('financialParams.paymentMethods', financialParams.paymentMethods)
  return (
    // <div className="p-6 h-full max-h-screen overflow-auto">
    <div className="p-6 h-[calc(100dvh-56px)] overflow-y-auto">
      <div className="w-full flex flex-col md:flex-row justify-around gap-6 md:gap-10">
        <VatRateForm
          vatRateIds={financialParams.vatRates}
          onVatRatesUpdate={(vatRates) => handleUpdateFinancialParams({ vatRates })}
        />

        <PaymentMethods
          paymentMethodIds={financialParams.paymentMethods as any}
          // allowSaleOnCredit={financialParams.allowSaleOnCredit}
          allowSaleOnCredit={updatedParams.allowSaleOnCredit ?? financialParams.allowSaleOnCredit}
          onPaymentMethodsUpdate={(paymentMethods) => handleUpdateFinancialParams({ paymentMethods })}
          onSaleOnCreditChange={(allowSaleOnCredit) => handleUpdateFinancialParams({ allowSaleOnCredit })}
        />
      </div>

      <LocalSettings
        currencySymbol={updatedParams.currencySymbol ?? financialParams.currencySymbol}
        decimalPlaces={updatedParams.decimalPlaces ?? financialParams.decimalPlaces}
        enableFidelity={updatedParams.enableFidelity ?? financialParams.enableFidelity}
        fidelityBonus={updatedParams.fidelityBonus ?? financialParams.fidelityBonus}
        fidelityTotalPurchaseRequired={updatedParams.fidelityTotalPurchaseRequired ?? financialParams.fidelityTotalPurchaseRequired}
        enableDailyGoal={updatedParams.enableDailyGoal ?? financialParams.enableDailyGoal}
        dailyTurnoverGoal={updatedParams.dailyTurnoverGoal ?? financialParams.dailyTurnoverGoal}
        onLocalSettingsUpdate={(settings) => handleUpdateFinancialParams(settings)}
      />

      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button onClick={saveAllChanges} disabled={isLoading} className="shadow-lg" size="lg">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
