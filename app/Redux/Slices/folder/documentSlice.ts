import { getAllDocuments } from '@/lib/actions/folder.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';



interface DocumentState {
    isCustomerModalOpen: boolean
    allDocuments: any[];
    allDocsTotalVatIncl: number;
    allDocsTotalVatExcl: number;
    allDocsTotalDueAmount: number
//   selectedSupplier: Supplier | null;
//   supplierToDelete: Supplier | null;
//   IsAddNewUser: boolean,
//   openEditModal: boolean;
//   openDeleteModal: boolean;
  documentsCount?: number;
  pageNumberDocuments: number;
  pageLimitDocuments: number;
  query: any;
  isDocumentsLoading: boolean;
//   selectedRowData: Supplier | null;

}

const initialState: DocumentState = {
isCustomerModalOpen: false,
  allDocuments: [],
//   selectedSupplier: null,
//   supplierToDelete: null,
//   IsAddNewUser: false,
//   openEditModal: false,
//   openDeleteModal: false,
  documentsCount: undefined,
  pageNumberDocuments: 1,
  pageLimitDocuments: 5,
  query: '',
  isDocumentsLoading: false,
  allDocsTotalVatIncl:0,
  allDocsTotalVatExcl: 0,
  allDocsTotalDueAmount: 0
//   selectedRowData: null
};


// thunks for api calls
export const filterDocuments = createAsyncThunk(
  'document/filterDocuments',
  async ({ query, page, limit }: { query?: any; page?: number; limit?: number }) => {
    const result = await getAllDocuments({ query, page, limit });
    return {
      tickets: result.documents,
      count: result.count,
      allDocsTotalVatIncl: result.totalVatIncl,
      allDocsTotalVatExcl: result.totalVatExcl,
      allDocsTotalDueAmount: result.totalDueAmount,

    };
  }
);





// Slice

const documentSlice = createSlice({
  name: 'document',
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
      state.pageNumberDocuments = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitDocuments = action.payload;
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
        .addCase(filterDocuments.pending, (state) => {
          state.isDocumentsLoading = true;
        })
        .addCase(filterDocuments.fulfilled, (state, action) => {
          state.allDocuments = action.payload.tickets;
          state.documentsCount = action.payload.count
          state.isDocumentsLoading = false;
          state.allDocsTotalVatIncl = action.payload.allDocsTotalVatIncl;
          state.allDocsTotalVatExcl = action.payload.allDocsTotalVatExcl;
          state.allDocsTotalDueAmount = action.payload.allDocsTotalDueAmount;
        })
        .addCase(filterDocuments.rejected, (state) => {
          state.isDocumentsLoading = false;
          state.allDocuments = []
          state.documentsCount= 0
          state.allDocsTotalVatIncl = 0
          state.allDocsTotalVatExcl = 0
          state.allDocsTotalDueAmount = 0
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
} = documentSlice.actions;

export default documentSlice.reducer;