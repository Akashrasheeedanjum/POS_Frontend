import { getAllReceipts } from '@/lib/actions/folder/receipt.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface ReceiptState {
    isCustomerModalOpen: boolean
    allReceipts: any[];
    receiptsTotalVatIncl: number;
    receiptsTotalVatExcl: number;
    receiptsVatAmountSum: number
//   selectedSupplier: Supplier | null;
//   supplierToDelete: Supplier | null;
//   IsAddNewUser: boolean,
//   openEditModal: boolean;
//   openDeleteModal: boolean;
  receiptsCount?: number;
  pageNumberReceipts: number;
  pageLimitReceipts: number;
  query: any;
  isReceiptsLoading: boolean;
//   selectedRowData: Supplier | null;

}

const initialState: ReceiptState = {
isCustomerModalOpen: false,
  allReceipts: [],
//   selectedSupplier: null,
//   supplierToDelete: null,
//   IsAddNewUser: false,
//   openEditModal: false,
//   openDeleteModal: false,
  receiptsCount: undefined,
  pageNumberReceipts: 1,
  pageLimitReceipts: 5,
  query: '',
  isReceiptsLoading: false,
receiptsTotalVatIncl: 0,
receiptsTotalVatExcl: 0,
receiptsVatAmountSum: 0
//   selectedRowData: null
};


// thunks for api calls
export const filterReceipts = createAsyncThunk(
  'receipts/filterReceipts',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await getAllReceipts({ query, page, limit });
    return {
      receipts: result.receipts,
      count: result.count,
      receiptsTotalVatIncl: result.totalVatIncl,
      receiptsTotalVatExcl: result.totalVatExcl,
      receiptsVatAmountSum: result.vatAmountSum,

    };
  }
);





// Slice

const receiptSlice = createSlice({
  name: 'receipt',
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
      state.pageNumberReceipts = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitReceipts = action.payload;
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
        .addCase(filterReceipts.pending, (state) => {
          state.isReceiptsLoading = true;
        })
        .addCase(filterReceipts.fulfilled, (state, action) => {
          state.allReceipts = action.payload.receipts;
          state.receiptsCount = action.payload.count
          state.isReceiptsLoading = false;
          state.receiptsTotalVatIncl = action.payload.receiptsTotalVatIncl;
          state.receiptsTotalVatExcl = action.payload.receiptsTotalVatExcl;
          state.receiptsVatAmountSum = action.payload.receiptsVatAmountSum;
        })
        .addCase(filterReceipts.rejected, (state) => {
          state.isReceiptsLoading = false;
          state.allReceipts = []
          state.receiptsCount= 0
          state.receiptsTotalVatIncl = 0
          state.receiptsTotalVatExcl = 0
          state.receiptsVatAmountSum = 0
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
} = receiptSlice.actions;

export default receiptSlice.reducer;