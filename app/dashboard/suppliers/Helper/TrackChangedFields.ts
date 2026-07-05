import { isEqual } from 'lodash';

export const trackChangedFields = (userData: any, selectedRowData: any) => {
  const changedFields: Record<string, any> = {};
  for (const key in userData) {
    if (!isEqual(userData[key], selectedRowData[key])) {
      changedFields[key] = userData[key];
    }
  }
  return changedFields;
};