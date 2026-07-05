import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

import {
  Supplier,
  getAllSuppliers,
  getSuppliersCount
} from '@/lib/actions/suppliers.action';
import { RootState } from '../store';


interface SupplierState {
  allSuppliers: Supplier[];
  selectedSupplier: Supplier | null;
  supplierToDelete: Supplier | null;
  IsAddNewUser: boolean,
  openEditModal: boolean;
  openDeleteModal: boolean;
  suppliersCount?: number;
  pageNumberSupplier: number;
  pageLimitSupplier: number;
  query: any;
  isSuppliersLoading: boolean;
  selectedRowData: Supplier | null;

}

const initialState: SupplierState = {
  allSuppliers: [],
  selectedSupplier: null,
  supplierToDelete: null,
  IsAddNewUser: false,
  openEditModal: false,
  openDeleteModal: false,
  suppliersCount: undefined,
  pageNumberSupplier: 1,
  pageLimitSupplier: 5,
  query: '',
  isSuppliersLoading: false,
  selectedRowData: null
};


// thunks for api calls
// Async thunk
export const fetchSuppliers = createAsyncThunk(
  'supplier/fetchSuppliers',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await getAllSuppliers({ page, limit });
    return {
      suppliers: result.suppliers,
      count: result.count
    };
  }
);


// export const filterSuppliers = createAsyncThunk(
//   'supplier/filterSuppliers',
//   async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
//     const filtered = await getAllSuppliers({ query, page, limit });
//     return filtered;
//   }
// );

export const filterSuppliers = createAsyncThunk(
  'supplier/filterSuppliers',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }, thunkAPI) => {

    try {
      const state = thunkAPI.getState() as RootState;
      const token = state.customer.token; // 👈 Get token from Redux
          // console.log('token....2 in redux', token)
      const result = await getAllSuppliers({ query, page, limit }, token);
      return {
        suppliers: result.suppliers,
        count: result.count
      };
      
    } catch (error:any) {
       return thunkAPI.rejectWithValue(error.message);
    }
  }
);



// Slice

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.allSuppliers.unshift(action.payload); // recently added at top
    },
    editModalOpen: (state, action: PayloadAction<{ isModalOpen: boolean; userData: Supplier|null }>) => {
      state.openEditModal = action.payload.isModalOpen;
      state.selectedSupplier = action.payload.userData;
    },
    deleteModalOpen: (state, action: PayloadAction<{ isDeleteModalOpen: boolean; supplier: Supplier }>) => {
      state.openDeleteModal = action.payload.isDeleteModalOpen;
      state.supplierToDelete = action.payload.supplier;
    },
    refreshListOnUpdate: (state, action: PayloadAction<Supplier>) => {
      state.allSuppliers = state.allSuppliers.map((supp) =>
        supp._id === action.payload._id ? action.payload : supp
      );
    },
    refreshListOnDelete: (state, action: PayloadAction<string|undefined>) => {
      state.allSuppliers = state.allSuppliers.filter((supp) => supp._id !== action.payload);
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberSupplier = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitSupplier = action.payload;
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
    setSelectedRowData: (state, action: PayloadAction<Supplier|null>) => {
      state.selectedRowData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isSuppliersLoading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.allSuppliers = action.payload.suppliers;
        state.suppliersCount = action.payload.count;
        state.isSuppliersLoading = false;
      })
      .addCase(fetchSuppliers.rejected, (state) => {
        state.isSuppliersLoading = false;
        state.allSuppliers = []
        state.suppliersCount = 0
      })

       .addCase(filterSuppliers.pending, (state) => {
      state.isSuppliersLoading = true;
    })
    .addCase(filterSuppliers.fulfilled, (state, action) => {
      state.allSuppliers = action.payload.suppliers;
      state.suppliersCount = action.payload.count
      state.isSuppliersLoading = false;
    })
    .addCase(filterSuppliers.rejected, (state) => {
      state.isSuppliersLoading = false;
      state.allSuppliers = []
      state.suppliersCount= 0
    });

  },
});

export const {
  addSupplier,
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
  setSelectedRowData
} = supplierSlice.actions;

export default supplierSlice.reducer;