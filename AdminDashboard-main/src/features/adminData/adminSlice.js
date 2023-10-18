import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config'
import { openLoader } from 'features/Loader/loaderSlice';
import { closeLoader } from 'features/Loader/loaderSlice';
// import jwt from 'jsonwebtoken';

let URL = config.url.API_URL

const initialState = {
  admin: [],
  isAuthenticated: "",
  quotesData: [],
  currentQuote: [],
  infoData: {
    retailers: "",
    products: "",
    categories: "",
    quotations: "",
  },
  isLoading: false,
  userRole: null,
  error: null,
  message: null
};

// Async thunk to fetch retailers data from API
export const fetchAdmin = createAsyncThunk(
  'admin/fetchAdmin',
  async (isAuthenticated) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/admin`, { headers });
    console.log(response.data,"admin slice")
    return response.data;
  }
);

// Async thunk to fetch retailers data from API
export const fetchInfoData = createAsyncThunk(
  'admin/fetchInfoData',
  async (isAuthenticated) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    console.log(isAuthenticated,"auth auth auth")
    const response = await axios.get(`${URL}/api/admin/infodata`, { headers });
    return response.data;
  }
);

// Async thunk to fetch Quotes data from API
export const fetchQuotesData = createAsyncThunk(
  'admin/fetchQuotesData',
  async (isAuthenticated, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    console.log(isAuthenticated,"isAuthenticated")
    console.log(headers,"headers")
    const response = await axios.get(`${URL}/api/mails`, { headers });
    dispatch(fetchInfoData(isAuthenticated))
    return response.data;
  }
);

// Async thunk to fetch newsletter data from API
export const sendNewsLetter = createAsyncThunk(
  'admin/sendNewsLetter',
  async ({ formData, isAuthenticated }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(openLoader()); // Display loader

      const headers = {
        'x-auth-token': isAuthenticated
      };
      const response = await axios.post(`${URL}/api/newsletter/send-newsletter`, formData, { headers });

      dispatch(closeLoader()); // Hide loader
      return response.data;
    } catch (error) {
      dispatch(closeLoader()); // Hide loader
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while trying to send the newsletter.');
    }
  }
);

// export const sendNewsLetter = createAsyncThunk(
//   'admin/sendNewsLetter',
//   async ({formData,isAuthenticated}) => {
//     const headers = {
//       'x-auth-token': isAuthenticated
//     };
//     const response = await axios.post(`${URL}/api/newsletter/send-newsletter`,formData,{headers});
//     return response.data;
//   }
// );

export const deleteQuoteData = createAsyncThunk(
  'admin/deleteQuoteData',
  async ({ id, isAuthenticated }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(openLoader()); // Display loader

      const headers = {
        'x-auth-token': isAuthenticated
      };
      const response = await axios.delete(`${URL}/api/mails/${id}`, { headers });

      dispatch(closeLoader()); // Hide loader

      dispatch(fetchQuotesData(isAuthenticated))
      return response.data;
    } catch (error) {
      dispatch(closeLoader()); // Hide loader

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while trying to delete the quote.');
    }
  }
);


// export const deleteQuoteData = createAsyncThunk(
//   'admin/deleteQuoteData',
//   async ({id,isAuthenticated},{dispatch}) => {
//     const headers = {
//       'x-auth-token': isAuthenticated
//     };
//     const response = await axios.delete(`${URL}/api/mails/${id}`,{headers});
//     dispatch(fetchQuotesData(isAuthenticated))
//     return response.data;
//   }
// );

export const updateAdminProfile = createAsyncThunk(
  'admin/updateAdminProfile',
  async ({ id, formData, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.put(`${URL}/api/admin/${id}`, formData, { headers });
    dispatch(fetchAdmin(isAuthenticated));
    return response.data;
  }
);

//   Async thunk to update admin profile 
export const updateAdminPassword = createAsyncThunk(
  'admin/updateAdminPassword',
  async ({ formData, isAuthenticated }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.post(`${URL}/api/admin/password`, formData, { headers });
    return response.data;
  }
);

export const authAdmin = createAsyncThunk(
  'admin/authAdmin',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${URL}/api/auth`, formData);
      return response.data;
    } catch (error) {
      // Check if error response exists and has data
      if (error.response && error.response.data) {
        // If so, rejectWithValue to dispatch rejected action with the server error message
        return rejectWithValue(error.response.data);
      }
      // If there's no error response or no data, dispatch with a general error message
      return rejectWithValue('An error occurred while trying to authenticate.');
    }
  }
);


const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Other reducer functions here
    setisAuthenticated: (state, { payload }) => {
      state.isAuthenticated = payload;
    },
    setinfoData: (state, { payload }) => {
      state.infoData.retailers = payload.retailers;
      state.infoData.products = payload.products;
      state.infoData.categories = payload.categories;
      state.infoData.quotations = payload.quotations;
    },
    setcurrentQuote: (state, { payload }) => {
      state.currentQuote = payload;
    },
    seterrornull: (state) => {
      state.error = null;
      state.message = null
    },
    setMessage: (state, { payload }) => {
      state.message = payload;
    }


  },
  extraReducers: (builder) => {
    builder
      // Handle fullfilent while updating retailer status
      .addCase(fetchAdmin.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Handle updating retailer status
      .addCase(fetchAdmin.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
        state.admin = action.payload
      })
      // Handle fullfilent while updating retailer status
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(authAdmin.fulfilled, (state, action) => {
        state.userRole = action.payload.userType;
        state.isAuthenticated = action.payload.accessToken;
        state.isLoading = false;
        state.error = null;
        console.log(action.payload.userType)
      })

      .addCase(authAdmin.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })

      .addCase(fetchInfoData.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
        state.infoData.retailers = action.payload.retailers
        state.infoData.quotations = action.payload.quotations
        state.infoData.products = action.payload.products
        state.infoData.categories = action.payload.categories

      })

      .addCase(fetchQuotesData.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code\
        console.log(action.payload,"action.payload")
        state.quotesData = action.payload
      })
      .addCase(sendNewsLetter.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(sendNewsLetter.fulfilled, (state, action) => {
        state.error = null;
        state.message = action.payload; // use the message from the server
      })

      .addCase(deleteQuoteData.pending, (state) => {
        state.error = null;
        state.message = null;
      })
      .addCase(deleteQuoteData.fulfilled, (state, action) => {
        state.error = null;
        state.message = action.payload; // or use action.payload.message if the server returns a success message
      })
      .addCase(deleteQuoteData.rejected, (state, action) => {
        state.error = action.payload;
      })

  },
});

export const { setisAuthenticated, setinfoData, setcurrentQuote, seterrornull, setMessage } = adminSlice.actions;

export default adminSlice.reducer;
