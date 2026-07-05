import { getBestSellers } from '@/lib/actions/folder/bestSellers.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface BestSellersState {
    isCustomerModalOpen: boolean
    allBestSellers: any[];
    bestSellersTotalVatIncl: number;
    bestSellersTotalVatExcl: number;
    bestSellersVatAmountSum: number
    bestSellersCount?: number;
    pageNumberBestSellers: number;
    pageLimitBestSellers: number;
    query: any;
    isBestSellersLoading: boolean;

}

const initialState: BestSellersState = {
isCustomerModalOpen: false,
  allBestSellers: [],
  bestSellersCount: undefined,
  pageNumberBestSellers: 1,
  pageLimitBestSellers: 5,
  query: '',
  isBestSellersLoading: false,
  bestSellersTotalVatIncl: 0,
  bestSellersTotalVatExcl: 0,
  bestSellersVatAmountSum: 0
};


// thunks for api calls
export const filterBestSellers = createAsyncThunk(
  'bestSellers/filterBestSellers',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await getBestSellers({ query, page, limit });
    return {
      articlesData: result.articlesData,
      count: result.total
    };
  }
);





// Slice

const bestSellersSlice = createSlice({
  name: 'bestSellers',
  initialState,
  reducers: {
      setOpenCustomerModal: (state, action: PayloadAction<{ isModalOpen: boolean}>) => {
         state.isCustomerModalOpen = action.payload.isModalOpen;// recently added at top
      },
    // addSupplier: (state, action: PayloadAction<Supplier>) => {
    //   state.allSuppliers.unshift(action.payload); // recently added at top
    // },
//     editModalOpen: (state, action: PayloadAction<{ isModalOpen: boolean; userData: Supplier|null }>) => {
//       state.openEditModal = action.payload.isModalOpen;
//       state.selectedSupplier = action.payload.userData;
//     },
//     deleteModalOpen: (state, action: PayloadAction<{ isDeleteModalOpen: boolean; supplier: Supplier }>) => {
//       state.openDeleteModal = action.payload.isDeleteModalOpen;
//       state.supplierToDelete = action.payload.supplier;
//     },
//     refreshListOnUpdate: (state, action: PayloadAction<Supplier>) => {
//       state.allSuppliers = state.allSuppliers.map((supp) =>
//         supp._id === action.payload._id ? action.payload : supp
//       );
//     },
//     refreshListOnDelete: (state, action: PayloadAction<string|undefined>) => {
//       state.allSuppliers = state.allSuppliers.filter((supp) => supp._id !== action.payload);
//     },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberBestSellers = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitBestSellers = action.payload;
    },
    setQuery: (state, action: PayloadAction<any>) => {
      state.query = action.payload;
    },
//     setOpenEditModal: (state, action: PayloadAction<boolean>) => {
//       state.openEditModal = action.payload;
//     },
//     setOpenDeleteModal: (state, action: PayloadAction<boolean>) => {
//       state.openDeleteModal = action.payload;
//     },
//     setIsAddNewUser: (state, action: PayloadAction<boolean>) => {
//       state.IsAddNewUser = action.payload;
//     },
//     setSelectedRowData: (state, action: PayloadAction<Supplier|null>) => {
//       state.selectedRowData = action.payload;
//     },
//   },
},
  extraReducers: (builder) => {
    builder
        .addCase(filterBestSellers.pending, (state) => {
          state.isBestSellersLoading = true;
        })
        .addCase(filterBestSellers.fulfilled, (state, action) => {
          state.allBestSellers = action.payload.articlesData;
          state.bestSellersCount = action.payload.count
          state.isBestSellersLoading = false;
        })
        .addCase(filterBestSellers.rejected, (state) => {
          state.isBestSellersLoading = false;
          state.allBestSellers = []
          state.bestSellersCount= 0
        });       
  },
});

export const {
setOpenCustomerModal,
//   addSupplier,
//   editModalOpen,
//   deleteModalOpen,
//   refreshListOnUpdate,
//   refreshListOnDelete,
  setPageNumber,
  setPageLimit,
  setQuery,
//   setOpenEditModal,
//   setOpenDeleteModal,
//   setIsAddNewUser,
//   setSelectedRowData
} = bestSellersSlice.actions;

export default bestSellersSlice.reducer;