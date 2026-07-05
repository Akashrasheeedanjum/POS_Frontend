// Base Article from API
export interface Article {
  _id: string
  productId: string
  designation: string
  quantityStock: number
  quantityMinimum: number
  supplier: {_id: string, nameDenomination: string}
  refArt: string
  purchasePrice: number
  priceCategory1: {
    vatId: {
      code: string
      rate: number
    }
    priceVatExcl: number
    priceVatIncl: number
    minPrice: number
    grossProfitMargin: number
  }
    priceCategory2: {
    vatId: {
      code: string
      rate: number
    }
    priceVatExcl: number
    priceVatIncl: number
    minPrice: number
    grossProfitMargin: number
  }
    priceCategory3: {
    vatId: {
      code: string
      rate: number
    }
    priceVatExcl: number
    priceVatIncl: number
    minPrice: number
    grossProfitMargin: number
  }
    priceCategory4: {
    vatId: {
      code: string
      rate: number
    }
    priceVatExcl: number
    priceVatIncl: number
    minPrice: number
    grossProfitMargin: number
  }
    category?: {name:string}
    // 🔑 Extra fields
  totalPriceVatExcl?: number;
  totalPriceVatIncl?: number;
  vatAmount?: number;
  isEdited?: boolean;
  
}

// When user selects an article
export interface SelectedArticle extends Article {
  unitPriceVatExcl: number // user input (default: priceCategory1.priceVatExcl)
  unitPriceVatIncl: number // user input (default: priceCategory1.priceVatIncl
  isEdited?: boolean; // ✅ allow kar diya
  quantity: number       // user input (default: 1)
  discount: number  
  [key: string]: any;     // user input (default: 0)
}

// Line item after calculation for invoice
export interface InvoiceLineItem extends SelectedArticle {
  unitPriceVatExcl: number
  unitPriceVatIncl: number
  totalPriceVatExcl: number
  totalPriceVatIncl: number
  vatAmount: number
  vatRate: any
  buyingPrice: number
}
