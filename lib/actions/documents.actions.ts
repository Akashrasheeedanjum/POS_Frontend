import { apiGet } from "../api";

export const getAllArticles = async ({
  search = '',
  page = 1,
  limit = 5
}: {
  search?: string;
  page?: number;
  limit?: number;
},
token?: string
) => {
  
  const params = new URLSearchParams();

  // Append parsed query string params to the main params
  if (search) {
    const queryParams = new URLSearchParams(search);
    queryParams.forEach((value, key) => {
      params.set(key, value);
    });
  }

  params.set('page', page.toString());
  params.set('limit', limit.toString());
  
 
  return apiGet(`/articles?${params.toString()}`, token);
};