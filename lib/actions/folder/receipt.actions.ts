import { apiDelete, apiGet, apiPost, apiPut } from "../../api";

export const getAllReceipts = async ({
  query = '',
  page = 1,
  limit = 5
}: {
  query?: string;
  page?: number;
  limit?: number;
}) => {
  const params = new URLSearchParams();

  // Append parsed query string params to the main params
  if (query) {
    const queryParams = new URLSearchParams(query);
    queryParams.forEach((value, key) => {
      params.set(key, value);
    });
  }

  params.set('page', page.toString());
  params.set('limit', limit.toString());
 
  return apiGet(`/sales-management/allReceipts?${params.toString()}`);
};