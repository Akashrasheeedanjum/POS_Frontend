export const transformCustomerData = (data: any) => {
  const transformed = { ...data };

  if (transformed.billingAddress?.city && typeof transformed.billingAddress.city === 'object') {
    transformed.billingAddress.city = transformed.billingAddress.city._id;
  } else if (
    transformed.billingAddress?.city === '' ||
    transformed.billingAddress?.city === null ||
    transformed.billingAddress?.city === undefined
  ) {
    delete transformed.billingAddress.city;
  }

  if (transformed.deliveryAddress?.city && typeof transformed.deliveryAddress.city === 'object') {
    transformed.deliveryAddress.city = transformed.deliveryAddress.city._id;
  } else if (
    transformed.deliveryAddress?.city === '' ||
    transformed.deliveryAddress?.city === null ||
    transformed.deliveryAddress?.city === undefined
  ) {
    delete transformed.deliveryAddress.city;
  }

  const hasDeliveryData =
    transformed.deliveryAddress?.address?.trim() ||
    transformed.deliveryAddress?.city ||
    transformed.deliveryAddress?.zipCode?.trim();

  if (!hasDeliveryData) {
    delete transformed.deliveryAddress;
  }
 
  if(transformed.deliveryAddress?._id && typeof transformed.deliveryAddress === 'object'){
    delete transformed.deliveryAddress._id
  }
  if(transformed.billingAddress?._id && typeof transformed.billingAddress === 'object'){
    delete transformed.billingAddress._id
  }

  if (transformed.country && typeof transformed.country === 'object') {
    transformed.country = transformed.country._id;
  }

    // 3. Handle usePriceList fields
  const priceListKeys = ['usePriceList1', 'usePriceList2', 'usePriceList3', 'usePriceList4'];

  const activeKey = priceListKeys.find(key => transformed[key] === true);
  // Remove all price list keys first
  priceListKeys.forEach(key => delete transformed[key]);
  // Then keep only the one that was true
  if (activeKey) {
    transformed[activeKey] = true;
  }


  return transformed;
};
