import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config'
import { openLoader } from 'features/Loader/loaderSlice';
import { closeLoader } from 'features/Loader/loaderSlice';



let URL = config.url.API_URL

const initialState = {
  tickets: [],
  currentTicket: [],
  selectedTicket: [],
  error: null,
  isSuccess: false,
  isLoading: false, // Add isLoading state
};

// Async thunk to fetch products data from API
export const fetchTickets = createAsyncThunk(
  'products/fetchTickets',
  async () => {
    const response = await axios.get(`${URL}/api/tickets`);
    // console.log(response.data,"this us console")
    return response.data;
  }
);

export const fetchSpecificTickets = createAsyncThunk(
  'products/fetchTickets',
  async () => {
    const response = await axios.get(`${URL}/api/tickets`);
    console.log(response.data)
    return response.data;
  }
);

export const deleteTicket = createAsyncThunk(
  'products/deleteTicket',
  async ({ id, isAuthenticated }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        'x-auth-token': isAuthenticated
      };
      dispatch(openLoader()); 
      const response = await axios.delete(`${URL}/api/tickets/${id}`, { headers });
      dispatch(fetchTickets());
      dispatch(closeLoader()); 
      return response.data;
    } catch (error) {
      dispatch(closeLoader()); 
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


export const updateTicket = createAsyncThunk(
  'products/updateTicket',
  async ({ id, data, isAuthenticated }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        'x-auth-token': isAuthenticated
      };
      const response = await axios.put(`${URL}/api/tickets/${id}`, data, { headers });
      dispatch(fetchTickets());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);



export const addTicket = createAsyncThunk(
  'products/addTicket',
  async ({ data, isAuthenticated }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        'x-auth-token': isAuthenticated
      };
      dispatch(openLoader());
      const response = await axios.post(`${URL}/api/tickets`, data, { headers });
      dispatch(fetchTickets());
      dispatch(closeLoader());
      return response.data;
    } catch (error) {
      dispatch(closeLoader());
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);


const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // Other reducer functions here
    setcurrentTicket: (state, { payload }) => {
      state.currentTicket = payload;
    },
    setselectedTicket: (state, { payload }) => {
      state.selectedTicket = payload;
    },
    resetState: (state) => {
      state.error = null;
      state.isSuccess = false;
    },



  },
  extraReducers: (builder) => {
    builder
      // Handle successful data fetching
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.tickets = action.payload;
      })
      .addCase(addTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.isSuccess = true;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.error = action.payload;
        state.isSuccess = false;
        state.isLoading = false;
      })
      .addCase(deleteTicket.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = action.payload;
        state.error = null; // Clear the error
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.error = action.payload;
      })
    .addCase(updateTicket.fulfilled, (state, action) => {
      state.tickets = action.payload;
      state.error = null; // Clear the error
    })
},
  });

export const { setcurrentTicket, setselectedTicket,resetState } = ticketsSlice.actions;

export default ticketsSlice.reducer;
