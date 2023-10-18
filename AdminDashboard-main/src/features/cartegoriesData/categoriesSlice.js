import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { config } from '../../config'
import { fetchInfoData } from 'features/adminData/adminSlice';

let URL = config.url.API_URL
// const dispatch = useDispatch()

const initialState = {
  categories: [],
  childCatData: [],
  catData: [],
  isLoading: false,
  isSuccess: false,  // Add this
  errorMessage: null, // Add this
  error: null,
  activeCategory: [],
  menuItems: [],
  isCategoryEdit: {
    active: false,
    currentId: ""
  },
  formModal: false,
  activeCategoryData: []
};

// Async thunk to fetch categories data from API
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (isAuthenticated, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/category`, { headers });
    console.log(response)
    return response.data;
  }
);


// Async thunk to fetch categories data from API
export const fetchCatData = createAsyncThunk(
  'categories/fetchCatData',
  async (isAuthenticated) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    // console.log("CAT Data hit")
    const response = await axios.get(`${URL}/api/category/catData`, { headers });
    // console.log(response, "catdATA")
    return response.data;
  }
);

// Async thunk to fetch categories data from API
export const fetchCategoryChilds = createAsyncThunk(
  'categories/fetchCategoryChilds',
  async ({ catId, isAuthenticated }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.get(`${URL}/api/category/${catId}/children`, { headers });
    return response.data;
  }
);

// Async thunk to updateCategory data from API
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, formData, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.put(`${URL}/api/category/${id}`, formData, { headers });
    dispatch(fetchCategories(isAuthenticated));
    dispatch(fetchCatData(isAuthenticated));
    return response.data;
  }
);


//   Async thunk to delete category 
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async ({ id, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.delete(`${URL}/api/category/${id}`, { headers });
    dispatch(fetchCategories(isAuthenticated));
    dispatch(fetchCatData(isAuthenticated));
    dispatch(fetchInfoData(isAuthenticated))
    return response.data;
  }
);

//   Async thunk to delete SubCategory 
export const deleteSubCategory = createAsyncThunk(
  'categories/deleteSubCategory',
  async ({ subCatId, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    const response = await axios.delete(`${URL}/api/category/subcategory/${subCatId}`, { headers });
    dispatch(fetchCategories(isAuthenticated));
    dispatch(fetchCatData(isAuthenticated));
    dispatch(fetchInfoData(isAuthenticated))
    return response.data;
  }
);


//   Async thunk to Add category 
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async ({ formData, isAuthenticated }, { dispatch }) => {
    const headers = {
      'x-auth-token': isAuthenticated
    };
    console.log(formData, "formData")
    console.log(isAuthenticated, "isAuthenticated")
    const response = await axios.post(`${URL}/api/category`, formData, { headers });
    dispatch(fetchCategories(isAuthenticated));
    dispatch(fetchCatData(isAuthenticated));
    dispatch(fetchInfoData(isAuthenticated))
    return response.data;
  }
);

//   Async thunk to Add category 
// export const addSubCategory = createAsyncThunk(
//   'categories/addCategory',
//   async ({catId,formData,isAuthenticated},{dispatch}) => {
//     const headers = {
//       'x-auth-token': isAuthenticated
//     };
//     const response = await axios.post(`${URL}/api/category/${catId}/subcategories`,formData,{headers});
//     dispatch(fetchCategories())
//     return response.data;
//   }
// );




// // Async thunk to updateSubCategory  data from API
// export const updateSubCategory = createAsyncThunk(
//   'categories/updateSubCategory',
//   async ({catId,subCatId,formtext,isAuthenticated}, { dispatch }) => {
//     const headers = {
//       'x-auth-token': isAuthenticated
//     };
//     const response = await axios.put(`${URL}/api/category/${catId}/subcategories/${subCatId}`,{name:formtext},{headers});
//     dispatch(fetchCategories());
//     return response.data;
//   }
// );


const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Other reducer functions here
    setactiveCategory: (state, { payload }) => {
      // console.log(state.activeCategory,"active",payload,"payload")
      state.activeCategory = payload;
    },
    setisCategoryEdit: (state, { payload }) => {
      state.isCategoryEdit.active = payload.active;
      state.isCategoryEdit.currentId = payload.currentId;
    },
    setformModal: (state, { payload }) => {
      state.formModal = payload
    },
    setactiveCategoryData: (state, { payload }) => {
      state.activeCategoryData = payload
    },
    setmenuItems: (state, { payload }) => {
      state.menuItems = payload
    },
    resetState: (state) => {
      state.errorMessage = null;
      state.isSuccess = false;
    },

  },
  extraReducers: (builder) => {
    builder
      // Handle pending state while fetching data
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      // Handle successful data fetching
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.categories = action.payload;
      })
      // Handle error while fetching data
      .addCase(fetchCategoryChilds.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.childCatData = action.payload;
      })
      .addCase(fetchCatData.fulfilled, (state, action) => {
        // state.isLoading = false;
        // console.log(action.payload,"cat Data")
        state.catData = action.payload;
      })
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = null;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = null;
        // Other logic if necessary...
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.error.message;
      })



  },
});

export const { setactiveCategory, setisCategoryEdit, setformModal, setactiveCategoryData, setmenuItems,resetState } = categoriesSlice.actions;

export default categoriesSlice.reducer;
