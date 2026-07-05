export const transformSupplierData = (data: any) => {
  const transformed = { ...data };

  if (transformed.city && typeof transformed.city === 'object') {
    transformed.city = transformed.city._id;
  }

  return transformed;
};
