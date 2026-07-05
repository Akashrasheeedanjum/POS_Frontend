
export interface SubCategory {
  id: string
  name: string
}
export interface Category {
  id: string
  name: string
  slug: string
  subCategories?: SubCategory[]
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  categoryId: string
  subCategoryId: string
  stock: number
  description?: string
}

// export interface CartItem {
//   id: string
//   productId: string
//   name: string
//   price: number
//   quantity: number
//   total: number
// }
export interface CartItem {
  articleId: string;
  article_productId: string
  nameAtPurchase: string
  quantityAtPurchase: number
  singleUnitPrice_vatExclude: number
  singleUnitPrice_vatInclude?: number
  codeOfVat_atPurchase: string
  rateOfVat_atPurchase: number
  articleCategory: string
  total: number
}

export interface User {
  id: string
  name: string
  role: string
}AbstractRange

export interface LatestVatVersion {
  _id: string
  versionLabel: string
  VAT1: number
  VAT2: number
  VAT3: number
  VAT4: number
  effectiveFrom: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

// export * from './sales';