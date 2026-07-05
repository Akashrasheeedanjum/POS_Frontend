import { Article, priceCategory } from "@/lib/actions/articles.actions";
import { Customer } from "@/lib/actions/customers.actions";

// function to get customer's enabled priceCategory
export function getEnabledPriceListKey(customer:Customer|null) {
  if (customer?.usePriceList1) return 'priceCategory1';
  if (customer?.usePriceList2) return 'priceCategory2';
  if (customer?.usePriceList3) return 'priceCategory3';
  if (customer?.usePriceList4) return 'priceCategory4';

  // If none are true
  return 'priceCategory1';
}

export function customerBillsWithoutGst(customer?: Customer | null): boolean {
  return customer?.billWithoutVat === true;
}

// function to get priceCategory from product for customer's price calculations
export function getVatRateForSale(
  latestVatVersion: Record<string, number> | null | undefined,
  vatCode?: string,
  fallbackRate?: number,
  customer?: Customer | null,
): number {
  if (customerBillsWithoutGst(customer)) {
    return 0;
  }

  if (latestVatVersion && vatCode && latestVatVersion[vatCode] != null) {
    return Number(latestVatVersion[vatCode]);
  }
  if (fallbackRate != null && !Number.isNaN(Number(fallbackRate))) {
    return Number(fallbackRate);
  }
  return 0;
}

export function calculateSaleLinePrices(
  priceVatExcl: number,
  vatRate: number,
  quantity: number,
) {
  const singleUnitPriceVatIncl =
    vatRate > 0
      ? priceVatExcl + (priceVatExcl * vatRate) / 100
      : priceVatExcl;

  return {
    singleUnitPrice_vatExclude: priceVatExcl,
    singleUnitPrice_vatInclude: singleUnitPriceVatIncl,
    rateOfVat_atPurchase: vatRate,
    total: singleUnitPriceVatIncl * quantity,
  };
}

export function productPriceCategory(product:any, priceCatEnabled: any) {

  if(!priceCatEnabled) priceCatEnabled = 'priceCategory1'  //if customer was not selected means priceCatEnabled is empty

   

    // if customer was selected and his priceCategory was found in product
    if (product.hasOwnProperty(priceCatEnabled) && product[priceCatEnabled]) return product[priceCatEnabled]
    else if(!product.hasOwnProperty(priceCatEnabled) && !product[priceCatEnabled]){
      //else if customer was selected but his priceCategory was not found in product then assign priceCategory1
      return product['priceCategory1']
    }


  return null;

}