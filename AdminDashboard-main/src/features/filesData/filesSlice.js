import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config'
import { closeLoader } from 'features/Loader/loaderSlice';
import { openLoader } from 'features/Loader/loaderSlice';

let URL = config.url.API_URL

const initialState = {
  files: [],
  filteredFiles: [],
  isLoading: false,
  deleteFilesState: {
    error: null,
    message: null,
  },
  sendFileDataState: {
    error: null,
    message: null,
  }
};

// Async thunk to fetch files data from API
export const fetchFiles = createAsyncThunk(
  'admin/fetchFiles',
  async (isAuthenticated, { dispatch }) => {
    console.log(isAuthenticated, " token***********")
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/filesystem`, { headers });
    const filteredSliceData = response.data.slice(0, 10)
    dispatch(setfilteredFiles(filteredSliceData))
    console.log(response.data, "File slice")
    return response.data;
  }
);


// Async thunk to delete file data from API
export const deleteFiles = createAsyncThunk(
  'admin/deleteFiles',
  async ({ id, isAuthenticated }, { dispatch, rejectWithValue }) => {
    try {
      dispatch(openLoader()); // Display loader
      const headers = {
        'x-auth-token': isAuthenticated
      };
      const response = await axios.delete(`${URL}/api/filesystem/${id}`, { headers });
      dispatch(closeLoader()); // Hide loader
      dispatch(fetchFiles(isAuthenticated))
      return response.data;
    } catch (error) {
      dispatch(closeLoader()); // Hide loader
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while trying to delete the file.');
    }
  }
);

export const sendFileData = createAsyncThunk(
  'admin/sendFileData',
  async ({ isAuthenticated, requestData }, { dispatch, rejectWithValue }) => {
    try {
      const headers = {
        'x-auth-token': isAuthenticated
      };
      const response = await axios.post(`${URL}/api/filesystem`, requestData, { headers });

      dispatch(closeLoader()); // Hide loader

      dispatch(fetchFiles(isAuthenticated))
      return response.data;
    } catch (error) {
      dispatch(closeLoader()); // Hide loader

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('An error occurred while trying to send the file.');
    }
  }
);



// Async thunk to fetch retailers data from API
export const filterFileData = createAsyncThunk(
  'admin/filterFileData',
  async ({ isAuthenticated, filterText }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/filesystem/filter/${filterText}`, { headers });
    console.log(response.data)
    dispatch(setfilteredFiles(response.data))
    return response.data;
  }
);

// //   Async thunk to update retailer profile 
// export const updateAdminProfile = createAsyncThunk(
//   'admin/updateAdminProfile',
//   async ({id,formData,isAuthenticated}, { dispatch }) => {
//     const headers = {
//       'x-auth-token': isAuthenticated
//     };
//     const response = await axios.put(`${URL}/api/admin/${id}`,formData,{headers});
//     // Your Retailer Data code goes Here call the function which will update the retailer data
//     dispatch(fetchAdmin(isAuthenticated));
//     return response.data;
//   }
// );

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    // Other reducer functions here
    setfilteredFiles: (state, { payload }) => {
      state.filteredFiles = payload;
    },
    clearDeleteFilesMessage: (state) => {
      state.deleteFilesState.message = null;
    },
    clearDeleteFilesError: (state) => {
      state.deleteFilesState.error = null;
    },
    clearSendFileDataMessage: (state) => {
      state.sendFileDataState.message = null;
    },
    clearSendFileDataError: (state) => {
      state.sendFileDataState.error = null;
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.fulfilled, (state, action) => {
        // Your Logic here after fullfilment of Update code
        state.files = action.payload
      })
      // Update your reducers
      .addCase(deleteFiles.pending, (state) => {
        state.deleteFilesState.error = null;
        state.deleteFilesState.message = null;
      })
      .addCase(deleteFiles.fulfilled, (state, action) => {
        state.deleteFilesState.error = null;
        state.deleteFilesState.message = action.payload; // or action.payload.message
      })
      .addCase(deleteFiles.rejected, (state, action) => {
        state.deleteFilesState.error = action.payload;
      })

      .addCase(sendFileData.pending, (state) => {
        state.sendFileDataState.error = null;
        state.sendFileDataState.message = null;
      })
      .addCase(sendFileData.fulfilled, (state, action) => {
        state.sendFileDataState.error = null;
        state.sendFileDataState.message = action.payload; // or action.payload.message
      })
      .addCase(sendFileData.rejected, (state, action) => {
        state.sendFileDataState.error = action.payload;
      })

  },
});

export const {
  setfilteredFiles,
  clearDeleteFilesMessage,
  clearDeleteFilesError,
  clearSendFileDataMessage,
  clearSendFileDataError
} = fileSlice.actions;

export default fileSlice.reducer;
