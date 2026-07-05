import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export interface Bank {
  _id: string;
  bankName?: string;
  bankNumber?: string;
}

export interface OptionalParameters {
  checkUpdateAtStartup?: boolean;
  touchKeyboardEnabledByDefault: boolean;
  roundCashPaymentsTo5Cents: boolean;
  backupAtClosing: boolean;
  identificationBeforeEachSale: boolean;
  managementPanels: boolean;
  keyboardInCapitalActivated: boolean;
  proposeLastDocumentTypeUsed: boolean;
  checkStockAtSale: boolean;
  endOrderMessage?: string;
  includeSalesInInboundHistory: boolean;
  includeSalesByClientInClosure: boolean;
  simplifiedFinancialReport: boolean;
  multiStoreVersionKeepLocalHistory: boolean;
  deleteDataLocallyAfterSentToServer: boolean;
  manageRepairs: boolean;
  vatCodeApplied?: number;
  _id: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  address?: string;
  city?: string;
  zipCode?: string;
  tel?: string;
  fax?: string;
  email?: string;
  indicatonMandatory?: string;
  banks: Bank[] | [];
  optionalParameters?: OptionalParameters;
  __v: number
}




export const createProfile = async (user: any) => {
    return apiPost('/user-profiles', user);
  };

export const updateUserprofile = async  ( id:string|undefined, user: any) => {
    return apiPut(`/user-profiles/${id}`, user);
  };
export const deleteUserprofile = async  ( id:string) => {
    return apiDelete(`/user-profiles${id}`);
  };
export const getprofiles = async( ) => {
    return apiGet(`/user-profiles`);
  };
export const getprofilesId = async(id:string ) => {
    return apiGet(`/user-profiles/${id}`);
  };