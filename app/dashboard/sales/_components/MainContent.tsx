'use client';
import React, { useEffect, useMemo, useState } from 'react';
import CategorySidebar from './layout/CategorySidebar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/app/Redux/store';
import { useCart } from '../hooks/useCart';
import ProductGrid from './products/ProductGrid';
import CartSidebar from './cart/CartSidebar';
import {
  fetchPaymentMethods,
  fetchVatVersion,
  filterProducts
} from '@/app/Redux/Slices/salesSlice';
import { useSession } from '@clerk/nextjs';
import { setToken } from '@/app/Redux/Slices/customerSlice';
import { toast } from 'sonner';

const MainContent = () => {
  //   const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // console.log('userTimezone', userTimezone); // e.g. "Europe/Brussels"

  const dispatch = useDispatch<AppDispatch>();

  const { session } = useSession();
  const token: any = session?.user?.publicMetadata?.token;

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const products = useSelector((state: RootState) => state.sales.allProducts);
  const isProductsLoading = useSelector(
    (state: RootState) => state.sales.isProductsLoading
  );

  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalAmount,
    getTotalItems
  } = useCart();

  // Find selected category object

  // Filter logic
  const filteredProducts = useMemo(() => {
    if (selectedSubCategory) {
      return products.filter(
        (p: any) => p.subCategory?._id === selectedSubCategory
      );
    }
    if (selectedCategory) {
      return products.filter((p: any) => p.category?._id === selectedCategory);
    }
    return products;
  }, [selectedCategory, selectedSubCategory, products]);

  useEffect(() => {
    dispatch(setToken(token));

    if (token) {
      dispatch(filterProducts({ token: token }))
        .unwrap()
        .catch((err) => {
          toast.error(err);
        });

      dispatch(fetchVatVersion({ token }));
      dispatch(fetchPaymentMethods({ token }));
    }
  }, [token, dispatch]);

  return (
    <div className=" flex h-[calc(100dvh-52px)]  flex-col overflow-y-auto bg-slate-100 ">
      {/* <Header /> */}

      {/* Desktop Layout - 3 columns side by side */}
      <div className="hidden flex-1 overflow-hidden 2xl:flex">
        <CategorySidebar
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          onCategorySelect={(id) => {
            setSelectedCategory(id);
            setSelectedSubCategory(null);
          }}
          onSubCategorySelect={(id) => setSelectedSubCategory(id)}
        />
        <ProductGrid
          products={filteredProducts}
          onAddToCart={addToCart}
          isProductsLoading={isProductsLoading}
        />
        <CartSidebar
          allProducts={products}
          cartItems={cartItems}
          totalAmount={getTotalAmount()}
          totalItems={getTotalItems()}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onAddToCart={addToCart}
        />
      </div>
      {/* Large Screen and Xtra Large Screen - 3 columns side by side */}
      <div className="hidden w-full flex-1 overflow-hidden lg:flex lg:flex-col xl:flex xl:flex-col   2xl:hidden">
        {/* <p>This is large Screen</p> */}
        {/* Categories - Horizontal scroll on Large Screen and Xtra Large Screen */}
        <div className=" flex   flex-shrink-0 overflow-hidden ">
          <CategorySidebar
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onCategorySelect={(id) => {
              setSelectedCategory(id);
              setSelectedSubCategory(null);
            }}
            onSubCategorySelect={(id: any) => setSelectedSubCategory(id)}
          />
        </div>
        <div className="flex flex-1 overflow-hidden ">
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
            isProductsLoading={isProductsLoading}
          />
          <CartSidebar
            allProducts={products}
            cartItems={cartItems}
            totalAmount={getTotalAmount()}
            totalItems={getTotalItems()}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onAddToCart={addToCart}
          />
        </div>
      </div>
      {/* Mobile/Tablet Layout - Vertical Stack */}
      <div className="flex flex-1 flex-col overflow-hidden lg:hidden">
        {/* Categories - Horizontal scroll on mobile */}
        <div className="flex-shrink-0">
          <CategorySidebar
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onCategorySelect={(id) => {
              setSelectedCategory(id);
              setSelectedSubCategory(null);
            }}
            onSubCategorySelect={(id: any) => setSelectedSubCategory(id)}
          />
        </div>

        {/* Products Grid - Scrollable to show all products */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid
            products={filteredProducts}
            onAddToCart={addToCart}
            isProductsLoading={isProductsLoading}
          />
        </div>

        {/* Cart - Fixed height at bottom */}
        <div className="max-h-[50vh] flex-shrink-0">
          <CartSidebar
            allProducts={products}
            cartItems={cartItems}
            totalAmount={getTotalAmount()}
            totalItems={getTotalItems()}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onAddToCart={addToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
