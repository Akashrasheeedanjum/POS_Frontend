import type React from "react"
export interface ArticleData {
  id: string
  designation: string
  refArt: string
  qtyStock: number
  sellPrice: number
}

export interface CustomerData {
  code: string
  denomination: string
  firstName: string
  zipCode: string
  city: string
  awais:string
}

export interface DocumentData {
  register: string
  document: string
  number: string
  date: string
  customer: string
  amount: string
}

export interface ColumnConfig {
  key: string
  label: string
  width: string
}

export interface SearchConfig {
  field: string
  label: string
  placeholder: string
}

export interface SelectionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  data: any[]
  columns: ColumnConfig[]
  searchConfig?: SearchConfig
  onSelect: (item: any) => void
  showNewButton?: boolean
  showContentButton?: boolean
  showWordContentButton?: boolean
  showCustomersButton?: boolean
  customFooter?: React.ReactNode
}
