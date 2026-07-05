import { apiDelete, apiGet, apiPost, apiPut } from "../api";

interface Bank{
  bankName: string;
  bankNumber: string
}

export const createNewBank = async (bank: Bank) => {
    return apiPost('/banks', bank);
  };

export const updateBank = async  ( id:string, bank: Bank) => {
    return apiPut(`/banks/${id}`, bank);
  };
export const deleteBank = async  ( id:string|undefined) => {
    return apiDelete(`/banks/${id}`);
  };
export const getAllBanks = async( ) => {
    return apiGet('/banks');
  };
export const getBankId = async(id:string ) => {
    return apiGet(`/banks/${id}`);
  };
