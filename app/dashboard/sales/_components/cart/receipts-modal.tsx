"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/currency"
import {
  X,
  Save,
  Printer,
  Copy,
  ReceiptIcon as CashRegister,
  CreditCard,
  Banknote,
  FileText,
  Globe,
} from "lucide-react"
import type { CartItem } from "@/types/sales"
import { toast } from "sonner"
import { AppDispatch, store } from "@/app/Redux/store"
import { PaymentMethod } from "@/lib/actions/paymentMethods.actions"
import BalanceDueModal from "./BalanceDueModal"
import { createTicket, getLatestVatVersion } from "@/lib/actions/sales.actions"
import { cleanTicketData, getDueDate } from "../../Helper/cleanTicketData"
import { cartEmpty, filterProducts, setSelectedCustomerForTicket } from "@/app/Redux/Slices/salesSlice"
import { useDispatch } from "react-redux"
import { useCart } from "../../hooks/useCart"
import { ClipLoader } from "react-spinners"
import { paymentsTableHTMLGenerator, receiptTableHTMLGenerator } from "../ReceiptGenerators/HTMLTableGenerators"
import { Bank, getprofiles, UserProfile } from "@/lib/actions/profile.actions"
import { openPrintTab } from "@/app/settings/printer/Helper/printFunction"
import { getSelectedTemplate } from "@/lib/actions/printerSettings.actions"
import { Template } from "@/app/settings/printer/printer-settings"
import { useSession } from "@clerk/nextjs"
import RecordedOperation from "./RecordedOperation"

interface ReceiptsModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  totalAmount: number
}

  export function buildReceiptData({
  enterpriseProfile,
  bankAccounts,
  latestVats,
  customerData,
  formattedDate
}: {
  enterpriseProfile: UserProfile
  bankAccounts: Bank[]
  latestVats: any
  customerData: any
  formattedDate: string
}) {
  if (!enterpriseProfile || !latestVats || !customerData) {
    throw new Error("Receipt data not ready")
  }

  return {
    companyName: enterpriseProfile.name ?? " ",
    companyStreetAddress: enterpriseProfile.address ?? " ",
    companyCityAddress: `${enterpriseProfile.zipCode ?? " "} ${enterpriseProfile.city ?? " "}`,
    companyCountry: customerData.country?.countryName ?? "Pakistan",
    companyVatNumber: enterpriseProfile.indicatonMandatory ?? " ",
    companyEmail: enterpriseProfile.email ?? " ",
    companyTelphone: enterpriseProfile.tel ?? " ",

    companyBankName1: bankAccounts?.[0]?.bankName ?? " ",
    companyBankAccount1: bankAccounts?.[0]?.bankNumber ?? " ",
    companyBankName2: bankAccounts?.[1]?.bankName ?? " ",
    companyBankAccount2: bankAccounts?.[1]?.bankNumber ?? " ",
    companyBankName3: bankAccounts?.[2]?.bankName ?? " ",
    companyBankAccount3: bankAccounts?.[2]?.bankNumber ?? " ",
    companyBankName4: bankAccounts?.[3]?.bankName ?? " ",
    companyBankAccount4: bankAccounts?.[3]?.bankNumber ?? " ",

    customerCode: customerData.customerCode ?? " ",
    customerName: customerData.nameDenomination  ?? " ",
    customerStreetAddress: customerData.billingAddress?.address  ?? " ",
    customerCityAddress: `${customerData.billingAddress?.zipCode ?? " "} ${customerData.billingAddress?.city?.cityName ?? " "}`,
    customerCountry: customerData.country?.countryName ?? " ",
    customerVatNumber: customerData.vatNumber ?? " ",
    customerFOID: customerData.EOID ?? " ",
    customerEID: customerData.FID ?? " ",
    customerNumber: customerData.tel1 ?? " ",

    vatRat1: `${latestVats.VAT1}%`,
    vatRat2: `${latestVats.VAT2}%`,
    vatRat3: `${latestVats.VAT3}%`,
    vatRat4: `${latestVats.VAT4}%`,

    base1: 0,
    base2: 0,
    base3: 0,
    base4: 0,
    totalRemise: 0,
    totalHT: 0,
    TVA: 0,
    totalTTC: 0,
    factureNumber: " ",
    date: formattedDate ?? " ",
    balanceDue: 0,
    showBalanceDue: false
  }
}

// type PaymentMethod = "CASH" | "BANCONTACT" | "VISA" | "MASTERCARD" | "CHEQUE" | "ONLINE"

export function ReceiptsModal({ isOpen, onClose, cartItems, totalAmount }: ReceiptsModalProps) {

   const dispatch = useDispatch<AppDispatch>();

       const { session } = useSession();
    const token:any = session?.user?.publicMetadata?.token

  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [receivedAmount, setReceivedAmount] = useState<string>("")
  const [received, setReceived] = useState<number>(0)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>()
  // const [paymentMethodsState, setPaymentMethodsState] = useState<PaymentMethod[]>([])
  const [receiptType, setReceiptType] = useState("receipt")
  const [printCopies, setPrintCopies] = useState(1)
  const [printEnabled, setPrintEnabled] = useState(true)
  const [cashDrawerEnabled, setCashDrawerEnabled] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState("EN")

  const [BalanceDueModalOpen, setBalanceDueModalOpen] = useState(false)
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);
  
  const [enterpriseProfile, setEnterpriseProfile] = useState<UserProfile | null>(null)
  const [bankAccounts, setBankAccounts] = useState<Bank[]>([])
  const [latestVats, setLatestVats] = useState<any>()
  const [selectedTemplate, setSelectedTemplate] = useState<Template|undefined>()
  
  // const received = Number.parseFloat(receivedAmount) || 0
  // let received = 0
  const [toRender, setToRender] = useState<number>(0.00)
  const [toRenderModalOpen, setToRenderModalOpen] = useState(false)

  const getAmountEntering = () => Number.parseFloat(receivedAmount) || 0
  const getTotalReceived = () => received + getAmountEntering()
  const getLeftToPay = () => Math.max(0, totalAmount - getTotalReceived())
  const getChange = () => Math.max(0, getTotalReceived() - totalAmount)

  useEffect(() => {
    setToRender(getChange())
  }, [receivedAmount, received, totalAmount])
   
  const leftToPay = getLeftToPay()

  const paymentMethodsRef = useRef<any[]>([]);
  // Reset form when modal opens

   const fetchedPaymentMethods = store.getState().sales.paymentMethods
  
  // Default UI for unknown payment methods


  useEffect(() => {
    if (isOpen) {
      setReceivedAmount("")
      setReceived(0)
      setToRender(0)
      paymentMethodsRef.current = []
      setSelectedPaymentMethod(fetchedPaymentMethods[0])
    }
  }, [isOpen, fetchedPaymentMethods])

  const handleNumberClick = (num: string) => {
    if (num === "DEL") {
      setReceivedAmount((prev) => prev.slice(0, -1))
    } else if (num === ".") {
      if (!receivedAmount.includes(".")) {
        setReceivedAmount((prev) => prev + ".")
      }
    } else {
      setReceivedAmount((prev) => prev + num)
    }
  }

  const handleQuickAmount = (amount: number) => {
    setReceivedAmount((prev) => {
      const current = Number.parseFloat(prev) || 0
      return (current + amount).toFixed(2)
    })
  }

const today = new Date();
const day = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
const year = today.getFullYear();

const formattedDate = `${day}/${month}/${year}`;
          const fetchEnterpriseUser = async () => {
            try {
              if(token){

                const [params, vats, template] = await Promise.all([
                  getprofiles(),
                  getLatestVatVersion(token),
                  getSelectedTemplate()
                ])
                
                //  console.log('params', params)
                setEnterpriseProfile(params[0])
                setBankAccounts(params[0]?.banks)
                // console.log('vats...', vats)
                setLatestVats(vats)
                setSelectedTemplate(template) 
              }
            } catch (error:any) {
              console.error("Failed to fetch data", error)
              toast.error(`${error.message}`)
            } 
          }
        useEffect(() => {

      
          fetchEnterpriseUser()
        }, [])




  const executeSave = async (data: any) => {

    setSaveLoading(true)
    
    let ticketData:any = null
    try {

    if(!token) throw new Error('Session Expired! Re-Login')

    const [profilesResult, vatsResult, templateResult] = await Promise.allSettled([
      getprofiles(),
      getLatestVatVersion(token),
      getSelectedTemplate()
    ])

    const profiles = profilesResult.status === 'fulfilled' ? profilesResult.value : []
    const vats = vatsResult.status === 'fulfilled'
      ? vatsResult.value
      : { VAT1: 18, VAT2: 5, VAT3: 0, VAT4: 0 }
    const template = templateResult.status === 'fulfilled' ? templateResult.value : undefined

       const enterprise = profiles?.[0] ?? {
      name: 'Lahore POS',
      address: 'Lahore',
      city: 'Lahore',
      zipCode: '',
      email: '',
      tel: '',
      indicatonMandatory: '',
      banks: [],
    }
    const customer = store.getState().sales.selectedCustomerForTicket

    if (!customer) {
      toast.error("Please select a customer before saving the sale")
      return
    }

    const receiptData = buildReceiptData({
      enterpriseProfile: enterprise,
      bankAccounts: enterprise.banks ?? [],
      latestVats: vats,
      customerData: customer,
      formattedDate
    })

    if(!data?.dueDate && data?.receiptType != 'receipt' && data?.totalAmount - data?.receivedAmount != 0){
      data.dueDate = getDueDate()
    }

    const confirmInvoiceTableDemo = receiptTableHTMLGenerator(data?.cartItems)
    
 
    ticketData = cleanTicketData(data)
    const resp = await createTicket(ticketData, token)

    const confirmPaymentMethodsDemo = paymentsTableHTMLGenerator(resp?.paymentMethods) 
    receiptData.factureNumber = resp?.ticketNumber
    receiptData.base1 = resp?.basePrice_withoutVat_1?.toFixed?.(2) ?? '0.00'
    receiptData.base2 = resp?.basePrice_withoutVat_2?.toFixed?.(2) ?? '0.00'
    receiptData.base3 = resp?.basePrice_withoutVat_3?.toFixed?.(2) ?? '0.00'
    receiptData.base4 = resp?.basePrice_withoutVat_4?.toFixed?.(2) ?? '0.00'
    receiptData.totalHT = resp?.totalAmount_VatExcluded?.toFixed?.(2) ?? '0.00'
    receiptData.TVA = resp?.totalVat_amount?.toFixed?.(2) ?? '0.00'
    receiptData.totalTTC = resp?.totalAmount_VatIncluded?.toFixed?.(2) ?? '0.00'
    
    const prepareDataForTemplate = {
    data: receiptData,
    confirmInvoiceTableDemo: confirmInvoiceTableDemo,
    confirmPaymentMethodsDemo:confirmPaymentMethodsDemo 
    }

    if (printEnabled) {
      try {
        await openPrintTab(prepareDataForTemplate, template)
      } catch (printError: any) {
        console.warn('Receipt print failed:', printError)
        toast.warning(
          printError?.message ||
            'Sale saved, but receipt could not be printed. Allow popups and try again.',
        )
      }
    }

    dispatch(setSelectedCustomerForTicket(null))
    dispatch(filterProducts({ token }))
    dispatch(cartEmpty('empty'))
    setReceivedAmount('')
    setReceived(0)
    paymentMethodsRef.current = []
    toast.success(`${ticketData.receiptType.toUpperCase()} created successfully!`)
    onClose()
  } catch (error:any) {
    if(error.statusCode == 401){
      toast.error('Session Expired! Re-Login')
      return
    }
    const receiptLabel = ticketData?.receiptType?.toUpperCase?.() || 'RECEIPT'
    console.error(`Error creating new ${receiptLabel}`, error)
    toast.error(error?.message || String(error))
  }finally{
    setSaveLoading(false)
  }
};

  const onConfirm = (value:boolean) => {
    setBalanceDueModalOpen(false)
      if (value && pendingSaveData) {
    executeSave(pendingSaveData);
    setPendingSaveData(null);
  }
  }

  const applyPaymentToRef = (amount: number) => {
    if (amount <= 0 || !selectedPaymentMethod?._id) return

    const existingMethod = paymentMethodsRef.current.find(
      (meth) => meth?.paymentMethod_id === selectedPaymentMethod._id
    )

    if (existingMethod) {
      existingMethod.paymentAmount += amount
    } else {
      paymentMethodsRef.current.push({
        paymentMethod_id: selectedPaymentMethod._id,
        paymentMethod_name: selectedPaymentMethod.name,
        paymentAmount: amount,
      })
    }
  }

  const buildSaveData = (finalReceived: number) => {
    const customer = store.getState().sales.selectedCustomerForTicket?._id
    if (!customer) {
      toast.error('Could not find selected Customer!')
      return null
    }

    return {
      cartItems,
      totalAmount,
      receivedAmount: finalReceived,
      paymentMethods: [...paymentMethodsRef.current],
      leftToPay: Math.max(0, totalAmount - finalReceived),
      toRender: Math.max(0, finalReceived - totalAmount),
      receiptType,
      printCopies,
      printEnabled,
      cashDrawerEnabled,
      language: selectedLanguage,
      customer,
    }
  }

  const prepareSaveData = () => {
    const amountToAdd = getAmountEntering()
    const finalReceived = received + amountToAdd

    if (amountToAdd > 0) {
      applyPaymentToRef(amountToAdd)
      setReceived(finalReceived)
      setReceivedAmount('')
    }

    if (paymentMethodsRef.current.length === 0 && finalReceived > 0 && selectedPaymentMethod?._id) {
      paymentMethodsRef.current.push({
        paymentMethod_id: selectedPaymentMethod._id,
        paymentMethod_name: selectedPaymentMethod.name,
        paymentAmount: amountToAdd > 0 ? finalReceived : received,
      })
    }

    return buildSaveData(amountToAdd > 0 ? finalReceived : received)
  }

  const handleSave = () => {
    const amountToAdd = getAmountEntering()
    const totalReceived = getTotalReceived()

    if (receiptType === 'receipt' && totalReceived <= 0) {
      toast.error('Specify a payment please!')
      return
    }

    if (receiptType === 'receipt' && totalReceived < totalAmount && amountToAdd <= 0) {
      toast.error('Enter the remaining payment amount')
      return
    }

    if (!selectedPaymentMethod?._id && amountToAdd > 0) {
      toast.error('Select a payment method')
      return
    }

    if (getChange() > 0 && amountToAdd > 0) {
      setToRenderModalOpen(true)
      return
    }

    const saveData = prepareSaveData()
    if (!saveData) return

    if (receiptType !== 'receipt' && saveData.receivedAmount < totalAmount) {
      setPendingSaveData(saveData)
      setBalanceDueModalOpen(true)
      return
    }

    executeSave(saveData)
  }

  const onRenderConfirm = (value: boolean) => {
    setToRenderModalOpen(false)
    if (!value) return

    const saveData = prepareSaveData()
    if (saveData) {
      executeSave(saveData)
    }
  }

  const handleCancel = () => {
    setReceivedAmount('')
    setReceived(0)
    paymentMethodsRef.current = []
    dispatch(setSelectedCustomerForTicket(null))
    dispatch(cartEmpty('empty'))
    onClose()
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="mb-0 shrink-0 rounded-t-lg bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl font-bold">
              <CashRegister className="mr-2 h-6 w-6" />
              Save the sale
            </DialogTitle>
           
          </div>
        </DialogHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* Receipt Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="receipt-type" className="text-sm font-medium">
              Receipt Type
            </Label>
            <Select value={receiptType} onValueChange={setReceiptType}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receipt">Produces a receipt</SelectItem>
                <SelectItem value="invoice">Produces an invoice</SelectItem>
                <SelectItem value="quote">Produces a quote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-4 text-center">
                <Label className="text-sm text-red-700 font-medium">To pay</Label>
                <div className="text-2xl font-bold text-red-800">{formatCurrency(totalAmount)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <Label className="text-sm text-blue-700 font-medium">Received</Label>
                <div className="text-2xl font-bold text-blue-800">{formatCurrency(received)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-4 text-center">
                <Label className="text-sm text-orange-700 font-medium">Left to pay</Label>
                <div className="text-2xl font-bold text-orange-800">{formatCurrency(leftToPay)}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4 text-center">
                <Label className="text-sm text-green-700 font-medium">To render</Label>
                <div className="text-2xl font-bold text-green-800">{formatCurrency(toRender > 0 ? toRender : 0)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Input & Keypad */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Payment Amount</Label>
                <Input
                  type="text"
                  value={receivedAmount}
                  onChange={(e) => setReceivedAmount(e.target.value)}
                  placeholder="0.00"
                  className="text-xl font-mono text-center placeholder:text-black/30"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(10)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  +Rs10
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(20)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  +Rs20
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(50)}
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  +Rs50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setReceivedAmount(Math.max(0, totalAmount - received).toFixed(2))}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  Exact
                </Button>
              </div>

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                  <Button
                    key={num}
                    variant="outline"
                    className="h-12 text-lg font-semibold hover:bg-slate-100 bg-transparent"
                    onClick={() => handleNumberClick(num.toString())}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="h-12 text-lg font-semibold hover:bg-slate-100 bg-transparent"
                  onClick={() => handleNumberClick("0")}
                >
                  0
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-lg font-semibold hover:bg-slate-100 bg-transparent"
                  onClick={() => handleNumberClick(".")}
                >
                  .
                </Button>
                <Button
                  variant="outline"
                  className="h-12 text-sm font-semibold hover:bg-red-50 text-red-600 bg-transparent"
                  onClick={() => handleNumberClick("DEL")}
                >
                  DEL
                </Button>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Payment Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* {paymentMethodsArray.map((method) => { */}
                {fetchedPaymentMethods.map((method) => {
                  const IconComponent = method?.name?.toUpperCase() == 'CASH' ? Banknote : method?.name?.toUpperCase() == 'CHEQUE' ?  FileText : method?.name?.toUpperCase() == 'ONLINE' ? Globe : CreditCard
                  const methodColor = method?.name?.toUpperCase() == 'CASH' ? "bg-green-600 hover:bg-green-700" : method?.name?.toUpperCase() == 'CHEQUE' ? "bg-purple-600 hover:bg-purple-700" :  method?.name?.toUpperCase() == 'ONLINE' ? "bg-cyan-600 hover:bg-cyan-700" : "bg-gray-500 hover:bg-gray-600"
                  return (
                    <Button
                      key={method._id}
                      variant={selectedPaymentMethod?._id === method._id ? "default" : "outline"}
                      className={`h-16 flex flex-col items-center justify-center gap-2 ${
                        selectedPaymentMethod?._id === method._id ? `${methodColor} text-white` : "hover:bg-slate-50"
                      }`}
                      onClick={() => setSelectedPaymentMethod(method)}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="text-xs font-medium">{method.name}</span>
                    </Button>
                  )
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Print Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="print-enabled"
                  checked={printEnabled}
                  onChange={(e) => setPrintEnabled(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="print-enabled" className="text-sm">
                  Enable printing
                </Label>
              </div>
            </div>

            {/* Copies */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <Copy className="w-4 h-4 mr-2" />
                Copies
              </Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={printCopies}
                onChange={(e) => setPrintCopies(Number.parseInt(e.target.value) || 1)}
                className="w-20"
              />
            </div>

            {/* Cash Drawer */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center">
                <CashRegister className="w-4 h-4 mr-2" />
                Cash drawer
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="cash-drawer"
                  checked={cashDrawerEnabled}
                  onChange={(e) => setCashDrawerEnabled(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="cash-drawer" className="text-sm">
                  Open drawer
                </Label>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="flex items-center justify-center gap-2">
            <Label className="text-sm font-medium">Language:</Label>
            {["FR", "EN", "NL"].map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
                className={selectedLanguage === lang ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {lang}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t bg-white p-4">
            <Button variant="outline" onClick={handleCancel} className="bg-transparent px-8">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-green-700 px-8 hover:from-green-700 hover:to-green-800"
              disabled={getTotalReceived() <= 0 || saveLoading}
            >
              {!saveLoading ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Receipt
                </>
              ) : (
                <ClipLoader color="#ffffff" size={20} />
              )}
            </Button>
        </div>
      </DialogContent>
{BalanceDueModalOpen && (
      <BalanceDueModal
        open={BalanceDueModalOpen}
        onClose={() => setBalanceDueModalOpen(false)}
        onConfirm={onConfirm}
        message={'There remains a balance Due .. continue?'}
      />
)}

{toRenderModalOpen && (
      <RecordedOperation
        open={toRenderModalOpen}
        onClose={() => setToRenderModalOpen(false)}
        onConfirm={onRenderConfirm}
        toRender={toRender}
        message={'Recorded Operation..'}
      />
)}
    </Dialog>
  )
}
