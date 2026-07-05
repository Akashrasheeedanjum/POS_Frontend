import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "../api";


export interface ReportData{
periodFrom: string;
periodTo: string;
cashWithDrawal_atClosing: number;
totalInCheckoutCounter: number;
newCashFund: number; 
cashFundFor: string;
}

export const getLastClosingReport = async ({
  query = '',
  page = 1,
  limit = 5
}: {
  query?: string;
  page?: number;
  limit?: number;
},
token?: string) => {
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
 

  return apiGet(`/xz-reports?${params.toString()}`, token);
};


export const createZReport = async (reportData: ReportData, token?: string) => {
  return apiPost('/xz-reports/createZReport', reportData, token);
};


export const singleZReport = async(id:string|undefined ) => {
  console.log('...........id', id)
    return apiGet(`/xz-reports/singleZReport/${id}`);
};