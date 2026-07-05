import { Article, getAllArticles } from '@/lib/actions/articles.actions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';



interface ArticlesState {
  allArticles: Article[];
  selectedArticle: Article | null;
  articleToDelete: Article | null;
  openEditModal: boolean;
  openDeleteModal: boolean;
  articlesCount?: number;
  pageNumberArticle: number;
  pageLimitArticle: number;
  query: any;
  isArticlesLoading: boolean;
  selectedRowData: Article | null;
  isAddNewUser: boolean;
  token?: string 
}

const initialState: ArticlesState = {
  allArticles: [],
  selectedArticle: null,
  articleToDelete: null,
  openEditModal: false,
  openDeleteModal: false,
  articlesCount: undefined,
  pageNumberArticle: 1,
  pageLimitArticle: 5,
  query: '',
  isArticlesLoading: false,
  selectedRowData: null,
  isAddNewUser: false,
  token: ''
};


// thunks for api calls
// Async thunk
export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async ({ page, limit }: { page: number; limit: number }) => {
    const result = await getAllArticles({ page, limit });
    return {
      articles: result.data,
      count: result.total
    };
  }
);




export const filterArticles = createAsyncThunk(
  'articles/filterArticles',
  async ({ search, page, limit }: { search?: any; page?: number; limit?: number }, thunkAPI) => {
    try {
    const state = thunkAPI.getState() as RootState;
    const token = state.article.token; // 👈 Get token from Redux
    // console.log('token....2 in redux', token)
    const result = await getAllArticles({ search, page, limit }, token);
    return {
      articles: result.data,
      count: result.total
    };
    } catch (error:any) {
            // Send the error message to Redux rejected action
      return thunkAPI.rejectWithValue(error.message);
    }

  }
);



// Slice

const ArticlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action: PayloadAction<Article>) => {
      state.allArticles.unshift(action.payload); // recently added at top
    },
    editModalOpen: (state, action: PayloadAction<{ isModalOpen: boolean; userData: Article | null }>) => {
      state.openEditModal = action.payload.isModalOpen;
      state.selectedArticle = action.payload.userData;
    },
    deleteModalOpen: (state, action: PayloadAction<{ isDeleteModalOpen: boolean; article: Article }>) => {
      state.openDeleteModal = action.payload.isDeleteModalOpen;
      state.articleToDelete = action.payload.article;
    },
    refreshListOnUpdate: (state, action: PayloadAction<Article>) => {
      state.allArticles = state.allArticles.map((art) =>
        art._id === action.payload._id ? action.payload : art
      );
    },
    refreshListOnDelete: (state, action: PayloadAction<string | undefined>) => {
      console.log('action.payload', action.payload)
      state.allArticles = state.allArticles.filter((art) => art._id !== action.payload);
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumberArticle = action.payload;
    },
    setPageLimit: (state, action: PayloadAction<number>) => {
      state.pageLimitArticle = action.payload;
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
      state.isAddNewUser = action.payload;
    },
    setSelectedRowData: (state, action: PayloadAction<Article | null>) => {
      state.selectedRowData = action.payload;
    },
    setToken: (state, action: PayloadAction<any>) => {
      state.token = action.payload;
    },
   
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isArticlesLoading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.allArticles = action.payload.articles;
        state.articlesCount = action.payload.count;
        state.isArticlesLoading = false;
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.isArticlesLoading = false;
        state.allArticles = []
        state.articlesCount = 0
      })

      .addCase(filterArticles.pending, (state) => {
        state.isArticlesLoading = true;
      })
      .addCase(filterArticles.fulfilled, (state, action) => {
        state.allArticles = action.payload.articles;
        state.articlesCount = action.payload.count
        state.isArticlesLoading = false;
      })
      .addCase(filterArticles.rejected, (state) => {
        state.isArticlesLoading = false;
        state.allArticles = []
        state.articlesCount = 0
      });

  },
});

export const {
  addArticle,
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
  setSelectedRowData,
  setToken
  
} = ArticlesSlice.actions;

export default ArticlesSlice.reducer;