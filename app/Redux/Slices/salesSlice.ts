import { Article, getAllArticles } from '@/lib/actions/articles.actions';
import { Customer } from '@/lib/actions/customers.actions';
import { getAllPaymentMethods, PaymentMethod } from '@/lib/actions/paymentMethods.actions';
import { articlesForSales, getLatestVatVersion, getWaitingTickets } from '@/lib/actions/sales.actions';
import { LatestVatVersion } from '@/types/sales';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';



interface SalesState {
  isCustomerModalOpen: boolean;
  selectedCustomerForTicket: Customer | null;
  selectedProductForCart: Article | null;
  allProducts: Article[];
  latestVatVersion: LatestVatVersion | null;
  paymentMethods: PaymentMethod[];
  waitingTickets: any;
  waitingTicketsCount: number;
  cartState: string;
  waitingTicketData: any;
  isWaitTicketsLoading: boolean;
//   selectedArticle: Article | null;
//   articleToDelete: Article | null;
//   openEditModal: boolean;
//   openDeleteModal: boolean;
  productsCount?: number;
//   pageNumberArticle: number;
//   pageLimitArticle: number;
//   query: any;
  isProductsLoading: boolean;
//   selectedRowData: Article | null;
//   isAddNewUser: boolean;

}

const initialState: SalesState = {
    isCustomerModalOpen: false,
    selectedCustomerForTicket: null,
    selectedProductForCart: null,
    allProducts: [],
    latestVatVersion: null,
    paymentMethods: [],
    waitingTickets: [],
    waitingTicketsCount: 0,
    cartState: '',
    waitingTicketData: null,
    isWaitTicketsLoading: false,
//   selectedArticle: null,
//   articleToDelete: null,
//   openEditModal: false,
//   openDeleteModal: false,
  productsCount: undefined,
//   pageNumberArticle: 1,
//   pageLimitArticle: 5,
//   query: '',
  isProductsLoading: false,
//   selectedRowData: null,
//   isAddNewUser: false,
};



export const filterProducts = createAsyncThunk(
  'sales/filterProducts',
  async ({ search, token}: { search?: any, token?:any}, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const reduxToken = state.customer.token; 

      const result = await articlesForSales({ search}, token? token: reduxToken);
      return {
        products: result.data,
        count: result.total
      };
      
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchVatVersion = createAsyncThunk(
  'sales/fetchVatVersion',
  async ({token}:{token?:any}, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const reduxToken = state.customer.token; 
      const resp = await getLatestVatVersion(token?token:reduxToken);
      return resp;
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'sales/fetchPaymentMethods',
 async ({token}:{token?:any}, thunkAPI) => {
  try {
      const state = thunkAPI.getState() as RootState;
      const reduxToken = state.customer.token; 
    const resp = await getAllPaymentMethods(token?token: reduxToken);
    return resp;
      } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchWaitingTickets = createAsyncThunk(
  'sales/fetchWaitingTickets',
  async ({token}:{token?:any}, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;
      const reduxToken = state.customer.token; 
      const resp = await getWaitingTickets(token?token:reduxToken);
      return {
        tickets: resp.tickets,
        count: resp.count
      };
    } catch (error:any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);




// Slice

const SalesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setOpenCustomerModal: (state, action: PayloadAction<{ isModalOpen: boolean}>) => {
         state.isCustomerModalOpen = action.payload.isModalOpen;// recently added at top
      },
    setSelectedCustomerForTicket: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomerForTicket = action.payload;
    },
    selectArticleForCart: (state, action: PayloadAction<{userData: Article|null }>) => {
      state.selectedProductForCart = action.payload.userData;
    },
    cartEmpty: (state, action: PayloadAction<string>) => {
      state.cartState = action.payload;
    },
    setWaitingTicketData: (state, action: PayloadAction<any>) => {
      state.waitingTicketData = action.payload;
    },
    updateWaitingTicketsList: (state, action: PayloadAction<any>) => {
      state.waitingTickets = action.payload;
    },
    updateWaitingTicketsCount: (state, action: PayloadAction<number>) => {
      state.waitingTicketsCount = action.payload;
    },
    // addArticle: (state, action: PayloadAction<Article>) => {
    //   state.allArticles.unshift(action.payload); // recently added at top
    // },
    // editModalOpen: (state, action: PayloadAction<{ isModalOpen: boolean; userData: Article | null }>) => {
    //   state.openEditModal = action.payload.isModalOpen;
    //   state.selectedArticle = action.payload.userData;
    // },
    // deleteModalOpen: (state, action: PayloadAction<{ isDeleteModalOpen: boolean; article: Article }>) => {
    //   state.openDeleteModal = action.payload.isDeleteModalOpen;
    //   state.articleToDelete = action.payload.article;
    // },
    // refreshListOnUpdate: (state, action: PayloadAction<Article>) => {
    //   state.allArticles = state.allArticles.map((art) =>
    //     art._id === action.payload._id ? action.payload : art
    //   );
    // },
    // refreshListOnDelete: (state, action: PayloadAction<string | undefined>) => {
    //   console.log('action.payload', action.payload)
    //   state.allArticles = state.allArticles.filter((art) => art._id !== action.payload);
    // },
    // setPageNumber: (state, action: PayloadAction<number>) => {
    //   state.pageNumberArticle = action.payload;
    // },
    // setPageLimit: (state, action: PayloadAction<number>) => {
    //   state.pageLimitArticle = action.payload;
    // },
    // setQuery: (state, action: PayloadAction<any>) => {
    //   state.query = action.payload;
    // },
    // setOpenEditModal: (state, action: PayloadAction<boolean>) => {
    //   state.openEditModal = action.payload;
    // },
    // setOpenDeleteModal: (state, action: PayloadAction<boolean>) => {
    //   state.openDeleteModal = action.payload;
    // },
    // setIsAddNewUser: (state, action: PayloadAction<boolean>) => {
    //   state.isAddNewUser = action.payload;
    // },
    // setSelectedRowData: (state, action: PayloadAction<Article | null>) => {
    //   state.selectedRowData = action.payload;
    // },
   
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(filterProducts.pending, (state) => {
        state.isProductsLoading = true;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.allProducts = action.payload.products;
        state.productsCount = action.payload.count
        state.isProductsLoading = false;
      })
      .addCase(filterProducts.rejected, (state) => {
        state.isProductsLoading = false;
        state.allProducts = []
        state.productsCount = 0
      })
      .addCase(fetchVatVersion.fulfilled, (state, action) => {
        state.latestVatVersion = action.payload;
      })
      .addCase(fetchVatVersion.rejected, (state) => {
        state.latestVatVersion = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state) => {
        state.paymentMethods = [];
      })
      .addCase(fetchWaitingTickets.pending, (state) => {
        state.isWaitTicketsLoading = true;
      })
      .addCase(fetchWaitingTickets.fulfilled, (state, action) => {
        state.waitingTickets = action.payload.tickets;
        state.waitingTicketsCount = action.payload.count
        state.isWaitTicketsLoading = false
      })
      .addCase(fetchWaitingTickets.rejected, (state) => {
        state.waitingTickets = [];
        state.waitingTicketsCount = 0 
        state.isWaitTicketsLoading = false
      })
      

  },
});

export const {
    setOpenCustomerModal,
    setSelectedCustomerForTicket,
    selectArticleForCart,
    cartEmpty,
    setWaitingTicketData,
    updateWaitingTicketsList,
    updateWaitingTicketsCount
//   addArticle,
//   editModalOpen,
//   deleteModalOpen,
//   refreshListOnUpdate,
//   refreshListOnDelete,
//   setPageNumber,
//   setPageLimit,
//   setQuery,
//   setOpenEditModal,
//   setOpenDeleteModal,
//   setIsAddNewUser,
//   setSelectedRowData,
  
} = SalesSlice.actions;

export default SalesSlice.reducer;