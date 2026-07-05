import { apiDelete, apiGet, apiPost, apiPut } from "../api";

export interface Country {
  _id?: string;
  countryName?: string;
  countryCode?: string;
  __v?:number
  // Add other fields if your Country schema has them
}

export interface City {
  _id?: string;
  cityName?: string;
  countryId?: string;
  __v?:number
  // Add other fields if your Country schema has them
}

export interface Address {
    address?: string;
    city?: City;
    zipCode?: string;
  _id?: string;
  __v?:number
}



export interface Customer {
  _id: string;
  vatNumber?: string;
  billWithoutVat?: boolean;
  usePriceList1?: boolean;
  usePriceList2?: boolean;
  usePriceList3?: boolean;
  usePriceList4?: boolean;
  permanentDiscount?: number;
  fidelity?: number;
  blockClient?: boolean;
  customerCode?: string;
  nameDenomination?: string;
  firstName?: string;
  EOID?: string;
  FID?: string;
  billingAddress?: any;
  deliveryAddress?: any;
  country?: any;
  tel1?: string;
  tel2?: string;
  email?: string;
  remarks?: string;
  createdAt?: string; // from timestamps: true
  updatedAt?: string;
}


export const createCustomer = async (customerData: Customer, token?: string) => {
  return apiPost('/customers/createCustomer', customerData, token);
};

export const updateCustomer = async (_id: string, data: Omit<Customer,'_id'>, token?: string) => {
  return apiPut(`/customers/updateCustomer/${_id}`, data, token);
};

export const deleteCustomer = async (id: string|undefined, token?: string) => {
  return apiDelete(`/customers/deleteCustomer/${id}`, token);
};

export const getAllCustomers = async ({
  query = '',
  page = 1,
  limit = 5
}: {
  query?: string;
  page?: number;
  limit?: number;
},
token?: string
) => {
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
 
  // console.log('token....3 in actions', token)
  return apiGet(`/customers/getAllCustomers?${params.toString()}`, token);
};

// export const getAllCustomers = async ({
//   query = '',
//   page = 1,
//   limit = 5
// }: {
//   query?: string;
//   page?: number;
//   limit?: number;
// }) => {
//   const params = new URLSearchParams();

//   // Don't double encode the query string
//   if (query) {
//     // Parse and append individual query params
//     const queryParams = new URLSearchParams(query);
//     queryParams.forEach((value, key) => {
//       params.set(key, value);
//     });
//   }

//   params.set('page', page.toString());
//   params.set('limit', limit.toString());

//   console.log('params....', params);
//   console.log('params.toString()', params.toString());

//   return apiGet(`/customers/getAllCustomers?${params.toString()}`);
// };


export const getNewCustomerNumber = async (token?: string) => {
  return apiGet(`/customers/getNewCustomerNumber`, token);
};

export const getCustomersCount = async () => {
  return apiGet(`/customers/totalCustomersCount`);
};

export const getAllCities = async () => {
  return apiGet(`/cityCountries/citiesList`);
};

export const getCityById = async (id:string) => {
  return apiGet(`/cityCountries/getCity/${id}`);
};
export const getAllCountries = async () => {
  return apiGet(`/cityCountries/countriesList`);
};

export const getCountryById = async (id:string) => {
  return apiGet(`/cityCountries/getCountry/${id}`);
};
// export const getFinancialParametersId = async (id: string) => {
//   return apiGet(`/financial-parameters/${id}`);
// };


export const createCity = async (cityData: City) => {
  return apiPost('/cityCountries/createCity', cityData);
};

export const createCountry = async (counrtryData: Country) => {
  return apiPost('/cityCountries/createCountry', counrtryData);
};

// return if exist with name otherwise create it