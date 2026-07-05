import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export interface PaymentMethod{
  _id?: string;
  name?: string;
  isActive?: boolean;
  __v?: number;
}

export const createPaymentMethod = async (method: PaymentMethod) => {
    return apiPost('/payment-methods', method);
  };

export const updatePaymentMethodId = async  ( id:string, user: any) => {
    return apiPut(`/payment-methods/${id}`, user);
  };
export const deletePaymentMethod = async  ( id:string|undefined) => {
    return apiDelete(`/payment-methods/${id}`);
  };
export const getAllPaymentMethods = async(token?: string) => {
    return apiGet('/payment-methods', token);
  };
export const getPaymentMethodsId = async(id:string ) => {
    return apiGet(`/payment-methods/${id}`);
  };
