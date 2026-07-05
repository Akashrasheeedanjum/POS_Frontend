import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export const createVatRates = async(vatRate: any) => {
    return apiPost('/vat-rates', vatRate);
  };

export const updateVAT = async  ( id:string, vatRate: any) => {
    return apiPut(`/vat-rates/${id}`, vatRate);
  };
  export const deleteVAT = async  ( id:string) => {
    return apiDelete(`/vat-rates/${id}`);
  };
  export const getAllVAT = async( ) => {
    return apiGet('/vat-rates');
  };
  export const getVAtId = async(id:string ) => {
    return apiGet(`/vat-rates/${id}`);
  };


  export const syncVatVersion = async  () => {
      return apiPut(`/vatRate-version`);
    };
