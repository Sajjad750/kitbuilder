import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config'
let URL = config.url.API_URL

const initialState = {
  isLoading: false,
  categoriesData: [],
  searchedCategories: [],
  isSearchActive: false,
  hasMoreCategories: true,
  relatedProducts: [],
  selectedCategoryName:"",
  page:1,
  limit:3,
  relatedKit: [],
  error: null
};


export const fetchCategories = createAsyncThunk(
  'userdata/fetchCategories',
  async ({ id, page, limit }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${URL}/api/category/catDataFront/?id=${id}&page=${page}&limit=${limit}`);
      console.log(response.data, "fetch categories");
      return response.data;
    } catch (err) {
      console.log(err, "error");
      return rejectWithValue(err.response.data.msg);
    }
  }
);

export const searchCategories = createAsyncThunk(
  'userdata/searchCategories',
  async ({ id, searchTerm, page, limit }, { dispatch, rejectWithValue }) => {
    try {
      const queryString = `?id=${id}&searchTerm=${searchTerm}&page=${page}&limit=${limit}`;
      const response = await axios.get(`${URL}/api/category/searchCategories${queryString}`);
      console.log(response, "searchCategories");
      return response.data;
    } catch (err) {
      console.log(err, "data");
      if (err.response.status === 404) {
        return {
          categories: [],
          hasMoreCategories: false
        };
      }
      return rejectWithValue(err.response.data.msg);
    }

  }
);

// export const fetchCategories = createAsyncThunk(
//   'userdata/fetchCategories',
//   async ({ id, page, limit }, { dispatch, rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${URL}/api/category/catDataFront/?id=${id}&page=${page}&limit=${limit}`);
//       console.log(response.data,"fetch categories")
//       return response.data;
//     } catch (err) {
//       console.log(err,"error")
//       return rejectWithValue(err.response.data.msg);
//     }
//   }
// );



// export const searchCategories = createAsyncThunk(
//   'userdata/searchCategories',
//   async ({ id, searchTerm, page, limit }, { dispatch, rejectWithValue }) => {
//     try {
//       const queryString = `?id=${id}&searchTerm=${searchTerm}&page=${page}&limit=${limit}`;
//       const response = await axios.get(`${URL}/api/category/searchCategories${queryString}`);
//       console.log(response, "searchCategories")
//       return response.data;
//     } catch (err) {
//       // Assuming the error response has a field named 'msg'
//       console.log(err, "data")
//       return rejectWithValue(err.response.data.msg);
//     }
//   }
// );





// Old implementation without specific retailer
// export const fetchCategories = createAsyncThunk(
//   'userdata/fetchCategories',
//   async (isAuthenticated, { dispatch }) => {
//     const headers = {
//       'x-auth-token': isAuthenticated
//     };
//     const response = await axios.get(`${URL}/api/category/catData`, { headers });
//     console.log(response, "Response Categories")
//     return response.data;
//   }
// );

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setIsSearchActive: (state, action) => {
      state.isSearchActive = action.payload;
    },
    setrelatedProducts: (state, action) => {
      state.relatedProducts = action.payload;
    },
    setrelatedKit: (state, action) => {
      state.relatedKit = action.payload;
    },
    setselectedCategoryName: (state, action) => {
      state.selectedCategoryName = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    }
        
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.error = null;
        state.isLoading = false;
        state.categoriesData = action.payload.categories;  // Only set the latest categories
        state.hasMoreCategories = action.payload.hasMoreCategories;  // Set the hasMoreCategories flag
        state.isSearchActive = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      // .addCase(searchCategories.fulfilled, (state, action) => {
      //   state.error = null;
      //   state.categoriesData = action.payload.categories;  // Only set the latest categories
      //   state.hasMoreCategories = action.payload.hasMoreCategories;  // Set the hasMoreCategories flag
      //   state.isSearchActive = true;
      // });
      .addCase(searchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.categoriesData = action.payload.categories;
        state.hasMoreCategories = action.payload.hasMoreCategories;
        state.isSearchActive = true;
      });

  },
});

export const { setIsSearchActive, setrelatedProducts, setrelatedKit,setselectedCategoryName,setPage,setLimit } = categorySlice.actions;

export default categorySlice.reducer;

