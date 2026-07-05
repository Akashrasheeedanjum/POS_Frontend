import { isEqual } from 'lodash';

export const trackChangedFields = (userData: any, selectedRowData: any) => {
  const changedFields: Record<string, any> = {};

  const idBasedFields = new Set([
    'category',
    'subCategory',
    'priceCategory1',
    'priceCategory2',
    'priceCategory3',
    'priceCategory4',
  ]);

  for (const key in userData) {
    const currentVal = userData[key];
    const originalVal = selectedRowData[key];

    if (idBasedFields.has(key) && currentVal && originalVal?._id) {
      const isCategoryField = key === 'category' || key === 'subCategory';

      const isChanged = isCategoryField
        ? currentVal !== originalVal._id
        : currentVal.priceVatIncl !== originalVal.priceVatIncl;

      if (isChanged) {
        changedFields[key] = currentVal;
      }
    } else if (!isEqual(currentVal, originalVal)) {
      changedFields[key] = currentVal;
    }
  }

  return changedFields;
};