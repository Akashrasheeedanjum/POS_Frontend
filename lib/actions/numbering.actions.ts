import { NumberingData } from "@/app/settings/numbering/page";
import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export const createNumbering = async (user: any) => {
  return apiPost('/numbering', user);
};
export const updateNumbering = async (id: string | undefined, numberData: NumberingData) => {
  return apiPut(`/numbering/${id}`, numberData);
};
export const deleteNumbering = async (id: string) => {
  return apiDelete(`/numbering${id}`);
};
export const getAllNumbering = async () => {
  return apiGet('/numbering');
};
export const getNUmberingId = async (id: string) => {
  return apiGet(`/numbering/${id}`);
};
