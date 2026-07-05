
import { useState } from "react"
import { FileText, FileCheck, Users, Truck, CreditCard, ShoppingCart } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { setSelectedTab } from "@/app/Redux/Slices/newDocuments/documentSlice"

const documentTypes = [
  {
    id: "invoice",
    name: "Invoice",
    icon: FileText,
    iconColor: "text-blue-600",
  },
  {
    id: "quote",
    name: "Quotation",
    icon: FileCheck,
    iconColor: "text-purple-600",
  },
  {
    id: "customer-order",
    name: "Customer Order",
    icon: Users,
    iconColor: "text-cyan-600",
  },
  {
    id: "deliveryNote",
    name: "Delivery note",
    icon: Truck,
    iconColor: "text-amber-600",
  },
  {
    id: "creditNote",
    name: "Credit Note",
    icon: CreditCard,
    iconColor: "text-pink-600",
  },
  {
    id: "purchase-order",
    name: "Purchase order",
    icon: ShoppingCart,
    iconColor: "text-teal-600",
  },
]

export default function DocumentTabs() {
 
  const dispatch = useDispatch<AppDispatch>()
  const selectedTab = useSelector((state: RootState) => state.newdocument.selectedTab)
    const handleSelectTab = (id: string, name: string) => {
    dispatch(setSelectedTab({ id, name })) // ✅ send both id & name
  }
  return (
    <div className=" bg-gray-50 p-1">
      <div className="max-w-full mx-auto">
        <div className="bg-gray-100 rounded-lg p-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1">
            {documentTypes.map((doc) => {
              const Icon = doc.icon
              const isSelected = selectedTab.id === doc.id 

              return (
                <button
                  key={doc.id}
                   onClick={() => handleSelectTab(doc.id, doc.name)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-md
                    transition-all duration-200
                    ${isSelected ? "bg-white shadow-sm" : "bg-transparent hover:bg-white/50"}
                  `}
                >
                  <Icon className={`w-6 h-6 mb-1 ${doc.iconColor}`} />
                  <span className="text-xs font-medium text-gray-700 text-center leading-tight">{doc.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
