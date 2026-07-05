"use client"

import { useState, useCallback, useEffect } from "react"
import type { CartItem, LatestVatVersion, Product } from "@/types/sales"
import { Article, Category } from "@/lib/actions/articles.actions"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/app/Redux/store"
import { Customer } from "@/lib/actions/customers.actions"
import { toast } from "sonner"
import { calculateSaleLinePrices, getEnabledPriceListKey, getVatRateForSale, productPriceCategory } from "../Helper/getCustomersPriceList"
import { cartEmpty, setWaitingTicketData } from "@/app/Redux/Slices/salesSlice"

export const useCart = () => {

  const dispatch = useDispatch<AppDispatch>();
  // const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartItems, setCartItems] = useState<any[]>([])
  const [cartArticles, setCartArticles] = useState<Article[]>([])
  const selectedCustomerForTicket = useSelector((state: RootState) => state.sales.selectedCustomerForTicket);
  const latestVatVersion = useSelector((state: RootState) => state.sales.latestVatVersion);
  const cartState = useSelector((state: RootState) => state.sales.cartState);
  const selectedProduct = useSelector((state: RootState) => state.sales.selectedProductForCart);
  const waitingTicketData = useSelector((state: RootState) => state.sales.waitingTicketData);

  useEffect(() => {
    if(!cartItems.length) return
    // console.log('re-run...........')
    setCartItems(prev => 
      prev.map((item) => {
        let customerPriceCategory = null
        if(selectedCustomerForTicket){
          customerPriceCategory = getEnabledPriceListKey(selectedCustomerForTicket)
        }
      // console.log('re-run2', customerPriceCategory)
      // console.log('re-run2.5 item', item)
      
      const currentProduct = cartArticles.find((art) => art._id === item.articleId)
      // console.log('re-run2.75 currentProduct', currentProduct)

      const selectedPriceCategory = productPriceCategory(currentProduct, customerPriceCategory? customerPriceCategory : '')
      const singleUnitPriceVatExcl = selectedPriceCategory?.priceVatExcl
      const vatRate = getVatRateForSale(
        latestVatVersion as Record<string, number> | null,
        selectedPriceCategory?.vatId?.code,
        selectedPriceCategory?.vatId?.rate,
        selectedCustomerForTicket,
      )
      const prices = calculateSaleLinePrices(
        Number(singleUnitPriceVatExcl),
        vatRate,
        item.quantityAtPurchase,
      )
   
      return {
      ...item,
      codeOfVat_atPurchase: selectedPriceCategory?.vatId?.code,
      rateOfVat_atPurchase: prices.rateOfVat_atPurchase,
      singleUnitPrice_vatExclude: prices.singleUnitPrice_vatExclude,
      singleUnitPrice_vatInclude: prices.singleUnitPrice_vatInclude,
      articleCategory: typeof currentProduct?.category == 'object' ? currentProduct?.category?.name : '',
      total: prices.total,
    }
  })
    )

}, [selectedCustomerForTicket, latestVatVersion]);


useEffect(() => {
  if(cartState == 'empty'){
    setCartItems([])
    dispatch(cartEmpty(''))
  }

  if(waitingTicketData){
    waitingTicketData?.articles?.map((art:any) => {
      addToCart(art?.articleId, art?.quantityOnHold)
    })
    dispatch(setWaitingTicketData(null))
  }

  // console.log('useEffect....')
}, [cartState, waitingTicketData])   //when receipt is created 


useEffect(() => {
  if(selectedProduct){
    addToCart(selectedProduct)
  }
}, [selectedProduct])
  


  const addToCart = useCallback((product: Article, quantity = 1) => {
    // console.log('product in cart', product)
  setCartArticles(prev => [
    ...prev, 
    product
  ]);

    let customerPriceCategory = null
    if(selectedCustomerForTicket){
      customerPriceCategory = getEnabledPriceListKey(selectedCustomerForTicket)
    }
    // console.log('customerPriceCategory', customerPriceCategory)
    const selectedPriceCategory = productPriceCategory(product, customerPriceCategory? customerPriceCategory : '')

    // console.log('selectedPriceCategory', selectedPriceCategory)
    if(!selectedPriceCategory) {
      toast.error('No priceCategory found for selected product!')
      return
    }

    const singleUnitPriceVatExcl = selectedPriceCategory?.priceVatExcl
    const vatRate = getVatRateForSale(
      latestVatVersion as Record<string, number> | null,
      selectedPriceCategory?.vatId?.code,
      selectedPriceCategory?.vatId?.rate,
      selectedCustomerForTicket,
    )
    if (singleUnitPriceVatExcl == null || Number.isNaN(Number(singleUnitPriceVatExcl))) {
      toast.error('Product price is missing. Complete production or set price list 1.')
      return
    }
    const prices = calculateSaleLinePrices(Number(singleUnitPriceVatExcl), vatRate, quantity)

    setCartItems((prev:any) => {
      const existingItem = prev.find((item:any) => item.articleId === product._id)

      if (existingItem) {
        const mergedQty = existingItem.quantityAtPurchase + quantity
        const mergedPrices = calculateSaleLinePrices(
          Number(singleUnitPriceVatExcl),
          vatRate,
          mergedQty,
        )
        return prev.map((item:any) =>
          item.articleId === product._id
            ? {
                ...item,
                quantityAtPurchase: mergedQty,
                rateOfVat_atPurchase: mergedPrices.rateOfVat_atPurchase,
                singleUnitPrice_vatExclude: mergedPrices.singleUnitPrice_vatExclude,
                singleUnitPrice_vatInclude: mergedPrices.singleUnitPrice_vatInclude,
                total: mergedPrices.total,
              }
            : item,
        )
      }

      return [
        ...prev,
        {
          articleId: product._id,
          article_productId: product.productId,
          nameAtPurchase: product.designation,
          quantityAtPurchase: quantity,
          codeOfVat_atPurchase: selectedPriceCategory?.vatId?.code,
          rateOfVat_atPurchase: prices.rateOfVat_atPurchase,
          singleUnitPrice_vatExclude: prices.singleUnitPrice_vatExclude,
          singleUnitPrice_vatInclude: prices.singleUnitPrice_vatInclude,
          articleCategory: typeof product.category == 'object' ? product.category?.name : '',
          total: prices.total,
        },
      ]
    })

    // console.log('cartItems', cartItems)
  }, [selectedCustomerForTicket, latestVatVersion])

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.articleId !== cartItemId))
  }, [])

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      // console.log('cartItemId in update', cartItemId)
      // console.log('quantity in update', quantity)
      if (quantity <= 0) {
        removeFromCart(cartItemId)
        return
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.articleId === cartItemId
            ? {
                ...item,
                quantityAtPurchase: quantity,
                total: item.singleUnitPrice_vatInclude * quantity,
              }
            : item,
        ),
      )
    },
    [removeFromCart],
  )

  const getTotalAmount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.total, 0)
  }, [cartItems])

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantityAtPurchase, 0)
  }, [cartItems])

  const makeCartEmpty = useCallback(() => {
    setCartItems([])
  }, [])
  
  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalAmount,
    getTotalItems,
    makeCartEmpty
  }
}
