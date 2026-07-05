import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '@/lib/actions/customers.actions';
import {
  getAllCustomers,
  getAllCities,
  getAllCountries,
  getCustomersCount
} from '@/lib/actions/customers.actions';
import { RootState } from '../store';

// import type { RootState } from "@/store";
interface CustomerState {
  allCustomers: Customer[];
  cities: any[];
  countries: any[];
  selectedCustomer: Customer | null;
  customerToDelete: Customer | null;
  IsAddNewUser: boolean,
  openEditModal: boolean;
  openDeleteModal: boolean;
  customersCount?: number;
  pageNumber: number;
  pageLimit: number;
  query:any;
  isCustomersLoading: boolean;
  selectedCustomerForDocument: Customer | null;
  token?: string 
}

const initialState: CustomerState = {
  allCustomers: [],
  cities: [],
  countries: [],
  selectedCustomer: null,
  customerToDelete: null,
  IsAddNewUser: false,
  openEditModal: false,
  openDeleteModal: false,
  customersCount: undefined,
  pageNumber: 1,
  pageLimit: 5,
  query: '',
  isCustomersLoading: false,
  selectedCustomerForDocument: null,
  token: ''
};


// thunks for api calls
// Async thunk
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await getAllCustomers({ page, limit });
    return {
      customers: result.customers,
      count: result.count
    };
  }
);



export const filterCustomers = createAsyncThunk(
  'customer/filterCustomers',
  // async ({ query, page, limit }: { query?: any; page?: number; limit?: number }, thunkAPI) => {

  //   try {
  async (params: { token?: string; query?: any; page?: number; limit?: number }, thunkAPI) => {
    try {
      const { token, query, page, limit } = params;

    const state = thunkAPI.getState() as RootState;
    const reduxToken = state.customer.token; // 👈 Get token from Redux
    // console.log('token....2 in redux', token)
    const result  = await getAllCustomers({ query, page, limit }, token?token: reduxToken);
    return {
      customers: result.customers,
      count:result.count
    };
    } catch (error:any) {
      // Send the error message to Redux rejected action
      return thunkAPI.rejectWithValue(error.message);
    }

  }
);

// Slice
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.allCustomers.unshift(action.payload); // recently added at top
    },
    editModalOpen: (state, action: PayloadAction<{ isModalOpen: boolean; userData: Customer|null }>) => {
      state.openEditModal = action.payload.isModalOpen;
      state.selectedCustomer = action.payload.userData;
    },
    selectCustomerForDocument: (state, action: PayloadAction<{userData: Customer|null }>) => {
      state.selectedCustomerForDocument = action.payload.userData;
    },
    deleteModalOpen: (state, action: PayloadAction<{ isDeleteModalOpen: boolean; customer: Customer }>) => {
      state.openDeleteModal = action.payload.isDeleteModalOpen;
      state.customerToDelete = action.payload.customer;
    },
    refreshListOnUpdate: (state, action: PayloadAction<Customer>) => {
      state.allCustomers = state.allCustomers.map((cust) =>
        cust._id === action.payload._id ? action.payload : cust
      );
    },
    refreshListOnDelete: (state, action: PayloadAction<string|undefined>) => {
      state.allCustomers = state.allCustomers.filter((cust) => cust._id !== action.payload);
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimit = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
    setOpenEditModal: (state, action: PayloadAction<boolean>) => {
      state.openEditModal = action.payload;
    },
    setOpenDeleteModal: (state, action: PayloadAction<boolean>) => {
      state.openDeleteModal = action.payload;
    },
    setIsAddNewUser: (state, action: PayloadAction<boolean>) => {
      state.IsAddNewUser = action.payload;
    },
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isCustomersLoading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.allCustomers = action.payload.customers;
        state.customersCount = action.payload.count;
        state.isCustomersLoading = false;
      })
      .addCase(fetchCustomers.rejected, (state) => {
        state.isCustomersLoading = false;
        state.allCustomers = []
        state.customersCount = 0
      })
       .addCase(filterCustomers.pending, (state) => {
      state.isCustomersLoading = true;
    })
    .addCase(filterCustomers.fulfilled, (state, action) => {
      state.allCustomers = action.payload.customers;
      state.customersCount = action.payload.count;
      state.isCustomersLoading = false;
    })
    .addCase(filterCustomers.rejected, (state) => {
      state.isCustomersLoading = false;
      state.allCustomers = []
      state.customersCount = 0
    });

  },
});

export const {
  addCustomer,
  editModalOpen,
  deleteModalOpen,
  refreshListOnUpdate,
  refreshListOnDelete,
  setPageNumber,
  setPageLimit,
  setQuery,
  setOpenEditModal,
  setOpenDeleteModal,
  setIsAddNewUser,
  selectCustomerForDocument,
  setToken
} = customerSlice.actions;

export default customerSlice.reducer;