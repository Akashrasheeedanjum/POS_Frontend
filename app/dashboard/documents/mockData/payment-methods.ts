import type React from "react"
import { CreditCard, Wallet } from "lucide-react"

// Keep keys aligned with your component's PaymentMethod union
export type PaymentMethodKey = "CASH" | "BANCONTACT" | "VISA" | "MASTERCARD" | "CHEQUE" | "ONLINE"

export type PaymentMethodDef = {
  key: PaymentMethodKey
  label: string
  // we pass the icon component so UI can render it
  icon: React.ComponentType<{ className?: string }>
}

// You can swap this file with an API call later.
// Example shape you can return from your API:
// [{ key: "CASH", label: "Cash" }, ...] and map to icons in the component.
export const paymentMethods: ReadonlyArray<PaymentMethodDef> = [
  { key: "CASH", label: "Cash", icon: Wallet },
  { key: "BANCONTACT", label: "Bancontact", icon: CreditCard },
  { key: "VISA", label: "Visa", icon: CreditCard },
  { key: "MASTERCARD", label: "Mastercard", icon: CreditCard },
  { key: "CHEQUE", label: "Cheque", icon: CreditCard },
  { key: "ONLINE", label: "Online", icon: CreditCard },
] as const
