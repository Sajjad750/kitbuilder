import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config'

let URL = config.url.API_URL

const initialState = {
  products: [],
  isLoading: false,
  isSuccess: false,
  errorMessage: null,
  error: null,
  activeProduct:[],
  isProductEdit:{
    active:false,
    currentId:""
  }
};

// Async thunk to fetch products data from API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (isAuthenticated) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/product`,{headers});
    console.log(response.data)
    return response.data;
  }
);

//   Async thunk to delete retailer 
  export const deleteProduct = createAsyncThunk(
    'products/deleteProducts',
    async ({id,isAuthenticated},{dispatch}) => {
      const headers = {
        'x-auth-token': isAuthenticated
      };
      const response = await axios.delete(`${URL}/api/product/${id}`,{headers});
      dispatch(fetchProducts(isAuthenticated));
      return response.data;
    }
  );

  // Async thunk to updateRetailerStatus retailers data from API
  export const updateproduct = createAsyncThunk(
      'products/updateProduct',
      async ({id,formData,isAuthenticated}, { dispatch }) => {
        const headers = {
          'x-auth-token': isAuthenticated
        };
        console.log(id,formData)
        const response = await axios.put(`${URL}/api/product/${id}`,formData,{headers});
        dispatch(fetchProducts(isAuthenticated));
        return response.data;
      }
    );

    //   Async thunk to Add category 
    export const addProduct = createAsyncThunk(
      'products/addProduct',
      async ({id,formData,isAuthenticated},{dispatch}) => {
        const headers = {
          'x-auth-token': isAuthenticated
        };
        console.log(formData,"formData")
        console.log(isAuthenticated,"isAuthenticated")
        const response = await axios.post(`${URL}/api/product/${id}`,formData,{headers});
        dispatch(fetchProducts(isAuthenticated))
        return response.data;
      }
    );
    


  const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      // Other reducer functions here
      setactiveProduct: (state,{payload}) => {
        state.activeProduct = payload;
    },
    setisProductEdit: (state,{payload}) => {
      state.isProductEdit.active = payload.active;
      state.isProductEdit.currentId = payload.currentId;
    },
    resetState: (state) => {
      state.errorMessage = null;
      state.isSuccess = false;
    },
    
    },
    extraReducers: (builder) => {
      builder
        // Handle pending state while fetching data
        .addCase(fetchProducts.pending, (state) => {
          state.isLoading = true;
        })
        // Handle successful data fetching
        .addCase(fetchProducts.fulfilled, (state, action) => {
          state.isLoading = false;
          state.error = null;
          if (Array.isArray(action.payload)) {
            state.products = action.payload;
          } else {
            state.products = [];
          }
        })
        
        // Handle error while fetching data
        .addCase(fetchProducts.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.error.message;
        })

        .addCase(addProduct.pending, (state) => {
          state.isLoading = true;
          state.isSuccess = false;
          state.errorMessage = null;
        })
        .addCase(addProduct.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.errorMessage = null;
        })
        .addCase(addProduct.rejected, (state, action) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.errorMessage = action.error.message;
        })
    
    },
  });
  
export const { setactiveProduct,setisProductEdit,resetState } = productsSlice.actions;

export default productsSlice.reducer;
