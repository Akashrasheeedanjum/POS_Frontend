import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export interface FinancialParameters {
  _id: string
  vatRates: any[]
  paymentMethods: any[]
  allowSaleOnCredit: boolean
  currencySymbol: string
  decimalPlaces: number
  enableFidelity: boolean
  fidelityBonus: number
  fidelityTotalPurchaseRequired: number
  enableDailyGoal: boolean
  dailyTurnoverGoal: number
  __v?: number
}

export const createfinancialParameters = async (financeData: FinancialParameters) => {
  return apiPost('/financial-parameters', financeData);
};

export const updateFinancialParameters = async (id: string, financeData: Omit<FinancialParameters,'id'>) => {
  return apiPut(`/financial-parameters/${id}`, financeData);
};
export const deletefinancial = async (id: string) => {
  return apiDelete(`/financial-parameters/${id}`);
};
export const getfinancialparameters = async () => {
  return apiGet(`/financial-parameters`);
};
export const getFinancialParametersId = async (id: string) => {
  return apiGet(`/financial-parameters/${id}`);
};
