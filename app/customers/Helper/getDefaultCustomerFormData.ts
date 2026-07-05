export function getDefaultCustomerFormData(customerCode?: string | number) {
  return {
    customerCode: customerCode?.toString() ?? '',
    vatNumber: '',
    nameDenomination: '',
    firstName: '',
    EOID: '',
    FID: '',
    billWithoutVat: false,
    usePriceList1: true,
    usePriceList2: false,
    usePriceList3: false,
    usePriceList4: false,
    permanentDiscount: 0,
    fidelity: 0,
    blockClient: false,
    billingAddress: {
      address: '',
      city: 'Lahore',
      zipCode: '',
    },
    deliveryAddress: {
      address: '',
      city: '',
      zipCode: '',
    },
    country: 'Pakistan',
    tel1: '',
    tel2: '',
    email: '',
    remarks: '',
  };
}
