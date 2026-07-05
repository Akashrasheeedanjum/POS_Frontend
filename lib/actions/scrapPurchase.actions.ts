import { apiGet, apiPost } from '../api';

export interface ScrapPurchase {
  _id: string;
  purchaseNo: string;
  supplier: { _id: string; nameDenomination: string };
  materialType: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  remainingQuantity: number;
  status: string;
  remarks?: string;
  purchaseDate: string;
}

export interface CreateScrapPurchasePayload {
  supplier: string;
  materialType: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  remarks?: string;
}

export const createScrapPurchase = async (
  data: CreateScrapPurchasePayload,
  token?: string,
) => apiPost('/scrap-purchase/create', data, token);

export const getScrapPurchases = async (
  availableOnly = false,
  token?: string,
) => {
  const result = await apiGet<ScrapPurchase[] | ScrapPurchase>(
    `/scrap-purchase/all?availableOnly=${availableOnly}`,
    token,
  );
  return Array.isArray(result) ? result : result ? [result] : [];
};
