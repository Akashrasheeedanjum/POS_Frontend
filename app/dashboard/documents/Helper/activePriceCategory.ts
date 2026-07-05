export function getActivePriceCategory(article: any, selectedCustomer: any) {
  let activeCategory: keyof typeof article | null = null;

  if (selectedCustomer?.usePriceList4) activeCategory = "priceCategory4";
  else if (selectedCustomer?.usePriceList3) activeCategory = "priceCategory3";
  else if (selectedCustomer?.usePriceList2) activeCategory = "priceCategory2";
  else if (selectedCustomer?.usePriceList1) activeCategory = "priceCategory1";

  // agar wo category article me nahi hai to fallback to priceCategory1
  return (activeCategory && article[activeCategory]) || article.priceCategory1;
}