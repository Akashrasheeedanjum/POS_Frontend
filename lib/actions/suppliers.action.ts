import { apiDelete, apiGet, apiPost, apiPut } from "../api";
import { City } from "./customers.actions";




export interface Supplier {
  _id: string;
  numberProvided?: string;
  vatNumber?: string;
  nameDenomination?: string;
  contact?: string;
  address?: string;
  city?: any;
  zipCode?: string;
  tel1?: string;
  tel2?: string;
  fax?: string;
  accountNumber?: string;
  email?: string;
  remarks?: string;
  createdAt?: string; // from timestamps: true
  updatedAt?: string;
}


export const createSupplier = async (supplierData: Supplier, token?: string) => {
  return apiPost('/suppliers/createSupplier', supplierData, token);
};

export const updateSupplier = async (_id: string, data: Omit<Supplier,'_id'>, token?: string) => {
  return apiPut(`/suppliers/updateSupplier/${_id}`, data, token);
};

export const deleteSupplier = async (id: string|undefined, token?: string) => {
  return apiDelete(`/suppliers/deleteSupplier/${id}`, token);
};

export const getAllSuppliers = async ({
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
 
  return apiGet(`/suppliers/getAllSuppliers?${params.toString()}`, token);
};


export const allSuppliers = async (token?: string) => { 
  return apiGet(`/suppliers/allSuppliers`, token);
};



export const getSuppliersCount = async (token?: string) => {
  return apiGet(`/suppliers/totalSuppliersCount`,token);
};
