import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config'

let URL = config.url.API_URL

const initialState = {
  retailers: [],
  notActivatedRetailers: [],
  activatedDisabled:[],
  activatedNotDisabled:[],
  isLoading: false,
  currentRetailer: [],
  error: null,
  isRetailerProfile: {
    active: false,
    currentId: ""
  }

};

// Async thunk to fetch retailers data from API
export const fetchRetailers = createAsyncThunk(
  'retailers/fetchRetailers',
  async (isAuthenticated) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/retailers`, { headers });
    return response.data;
  }
);

// Async thunk to fetch specific retailers data from API
export const fetchSpecificRetailers = createAsyncThunk(
  'retailers/fetchSpecificRetailer',
  async (id) => {
    const response = await axios.get(`${URL}/api/retailers/${id}`);
    return response.data;
  }
);

// Async thunk to fetch notActivated retailers data from API
export const fetchNotActivatedRetailers = createAsyncThunk(
  'retailers/fetchNotActivatedRetailers',
  async () => {
    const response = await axios.get(`${URL}/api/retailers/notActivated`);
    return response.data;
  }
);

// Async thunk to fetch Activated and Disabled retailers data from API
export const fetchActivatedDisabledRetailers = createAsyncThunk(
  'retailers/fetchActivatedDisabledRetailers',
  async () => {
    const response = await axios.get(`${URL}/api/retailers/ActivatedAndDisabled`);
    return response.data;
  }
);

// Async thunk to Update Activated and Disabled retailers data from API
export const updateActivatedDisabledRetailers = createAsyncThunk(
  'retailers/updateActivatedDisabledRetailers',
  async ({id,isDisabled,isAuthenticated},{dispatch}) => {
    const response = await axios.put(`${URL}/api/retailers/ActivatedAndDisabled/${id}`,{isDisabled});
    if(response.status === 200) {
      dispatch(fetchActivatedDisabledRetailers())
       dispatch(fetchNotActivatedRetailers());
       dispatch(fetchRetailers(isAuthenticated));
    }
    return response.data;
  }
);


// Async thunk to fetch Activated and Not Disabled retailers data from API
export const fetchActivatedNotDisabledRetailers = createAsyncThunk(
  'retailers/fetchActivatedNotDisabledRetailers',
  async () => {
    const response = await axios.get(`${URL}/api/retailers/ActivatedAndNotDisabled`);
    console.log(response,"response data")
    return response.data;
  }
);


// Async thunk to Update Activated and Not Disabled retailers data from API
export const updateActivatedNotDisabledRetailers = createAsyncThunk(
  'retailers/updateActivatedNotDisabledRetailers',
  async ({id,isActivated,isAuthenticated},{dispatch}) => {
    const response = await axios.put(`${URL}/api/retailers/ActivatedAndNotDisabled/${id}`, {isActivated});
    if(response.status === 200) {
      dispatch(fetchActivatedNotDisabledRetailers());
      dispatch(fetchNotActivatedRetailers());
      dispatch(fetchRetailers(isAuthenticated));
    }
    return response.data;
  }
);

// Async thunk to updateRetailerStatus retailers data from API
export const updateRetailerStatus = createAsyncThunk(
  'retailers/updateRetailerStatus',
  async ({ id, isAuthenticated }, { dispatch }) => {
    // console.log(isAuthenticated,"isAuthenticated here is token")
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.put(`${URL}/api/admin/changeRetailerStatus/${id}`, null, { headers });
    dispatch(fetchNotActivatedRetailers(isAuthenticated));
    dispatch(fetchRetailers(isAuthenticated));
    return response.data;
  }
);

//   Async thunk to delete retailer 
export const deleteRetailer = createAsyncThunk(
  'retailers/deleteRetailer',
  async ({ deletionId, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    // console.log(isAuthenticated,"request token")
    // console.log(deletionId,"request deletionId")
    const response = await axios.delete(`${URL}/api/admin/deleteRetailer/${deletionId}`, { headers });
    // console.log(response,"reponse")
    dispatch(fetchNotActivatedRetailers(isAuthenticated));
    dispatch(fetchRetailers(isAuthenticated));
    return response.data;
  }
);

//   Async thunk to update retailer profile 
export const updateRetailerProfile = createAsyncThunk(
  'admin/updateRetailerProfile',
  async ({ id, formData, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.put(`${URL}/api/admin/updateRetailerProfie/${id}`, formData, { headers });
    // Your Retailer Data code goes Here call the function which will update the retailer data
    dispatch(fetchRetailers(isAuthenticated));
    return response.data;
  }
);

const retailersSlice = createSlice({
  name: 'retailers',
  initialState,
  reducers: {
    // Other reducer functions here
    setisRetailerProfile: (state, { payload }) => {
      state.isRetailerProfile.active = payload.active;
      state.isRetailerProfile.currentId = payload.currentId;
    },
    setcurrentRetailer: (state, { payload }) => {
      state.currentRetailer = payload;
    },
    setactivatedDisabled: (state, { payload }) => {
      state.activatedDisabled = payload;
    },
    setactivatedNotDisabled: (state, { payload }) => {
      state.activatedNotDisabled = payload;
    },

    
  },
  extraReducers: (builder) => {
    builder
      // Handle pending state while fetching data
      .addCase(fetchRetailers.pending, (state) => {
        state.isLoading = true;
      })
      // Handle successful data fetching
      .addCase(fetchRetailers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.retailers = action.payload;
      })
      // Handle error while fetching data
      .addCase(fetchRetailers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle pending state while fetching notActivated retailers data
      .addCase(fetchNotActivatedRetailers.pending, (state) => {
        state.isLoading = true;
      })
      // Handle successful notActivated retailers data fetching
      .addCase(fetchNotActivatedRetailers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.notActivatedRetailers = action.payload;
      })
      // Handle error while fetching notActivated retailers data
      .addCase(fetchNotActivatedRetailers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Handle updating retailer status
      .addCase(updateRetailerStatus.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
      })
      // Handle error while updating retailer status
      .addCase(updateRetailerStatus.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchActivatedDisabledRetailers.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
        state.activatedDisabled = action.payload
      })
      .addCase(fetchActivatedNotDisabledRetailers.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
        state.activatedNotDisabled = action.payload
      })
      // Handle fullfilent while updating retailer status
      .addCase(deleteRetailer.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Handle updating retailer status
      .addCase(deleteRetailer.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
      })

  },
});

export const { setisRetailerProfile, setcurrentRetailer,setactivatedDisabled,setactivatedNotDisabled } = retailersSlice.actions;

export default retailersSlice.reducer;
