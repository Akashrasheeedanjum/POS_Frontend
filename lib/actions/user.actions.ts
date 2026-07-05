import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export const createUser = async (user: any) => {
    return apiPost('/auth/register', user);
  };
export const updateTheUser = async  ( id:string|undefined, user: any) => {
    return apiPut(`/auth/profile/update/${id}`, user);
  };
export const updateAccess = async  ( id:string, user: any) => {
    return apiPut(`/auth/update-access/${id}`, user);
  };
export const deleteTheUser = async  ( id:string|undefined) => {
    return apiDelete(`/auth/profile/${id}`);
  };
export const getAllUsers = async( ) => {
    return apiGet(`/auth`);
  };

export const getEmployees = async() => {
    return apiGet(`/auth/getEmployees`);
  };
