import { createSlice } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { config } from '../../config'
// let URL = config.url.API_URL

const initialState = {
    name: "",
    primary: "",
    secondary: "",
    sidecolor: "",
    selectedcolors: [],
    pathselectedcolors:[],
    selectedkit: "",
    activecomponent: 1,
    frontimages: [],
    backimages: [],
    categoriesData: [],
    selectedCategory: [],
    breadcrumbs: [],
    activeproduct: {
        linkfront: "",
        linkback: "",
        _id:"",
        name:"",
    },
    activeDesign: null,
    pathColors:{},
    pathColorsBack:{},
    pathColorsFront:{},
    activeProducts:[]
};

// export const fetchCategories = createAsyncThunk(
//     'userdata/fetchCategories',
//     async (isAuthenticated,{dispatch}) => {
//       const headers = {
//         'x-auth-token': isAuthenticated
//       };
//       const response = await axios.get(`${URL}/api/category/catData`,{headers});
//       console.log(response,"Response Categories")
//       return response.data;
//     }
//   );

const userdataSlice = createSlice({
    name: 'userdata',
    initialState,
    reducers: {
        setColor: (state, { payload }) => {
            if (payload.primary) {
                state.primary = payload.primary;
            } else if (payload.secondary) {
                state.secondary = payload.secondary;
            } else if (payload.sidecolor) {
                state.sidecolor = payload.sidecolor;
            }
        },
        setName: (state, { payload }) => {
            state.name = payload;
        },
        setSelected: (state, { payload }) => {
            state.selectedcolors = payload;
        },
        setpathselectedcolors: (state, { payload }) => {
            state.pathselectedcolors = payload;
        },
        setKit: (state, { payload }) => {
            state.selectedkit = payload;
        },
        setactiveComponent: (state, { payload }) => {
            state.activecomponent = payload;
        },
        setfrontimages: (state, { payload }) => {
            state.frontimages = payload;
        },
        setbackimages: (state, { payload }) => {
            state.backimages = payload;
        },
        setbreadcrumbs: (state, { payload }) => {
            state.breadcrumbs = payload;
        },
        setselectedCategory: (state, { payload }) => {
            state.selectedCategory = payload;
        },
        setactiveproduct: (state, action) => {
            state.activeproduct.linkfront = action.payload.linkfront;
            state.activeproduct.linkback = action.payload.linkback;
            state.activeproduct._id = action.payload._id;
            state.activeproduct.name = action.payload.name;
        },
        setactiveDesign: (state, { payload }) => {
            state.activeDesign = payload;
        },
        setPathColors: (state, { payload }) => {
            state.pathColors = payload;
        },
        setPathColorsFront: (state, { payload }) => {
            state.pathColorsFront = payload;
        },
        setPathColorsBack: (state, { payload }) => {
            state.pathColorsBack = payload;
        },
        // pathColorsBack
        // pathColorsFront
        setActiveProducts: (state, { payload }) => {
            state.activeProducts = payload;
        }
    },
    // extraReducers: (builder) => {
    //   builder
    //     .addCase(fetchCategories.fulfilled, (state, action) => {
    //       state.isLoading = false;
    //       state.error = null;
    //       state.categoriesData = action.payload;
    //       state.selectedCategory = action.payload
    //     })

    // },
});

export const { setColor, setName, setSelected, setKit, setactiveComponent, setfrontimages, setbackimages, setbreadcrumbs, setselectedCategory, setactiveproduct, setactiveDesign,setpathselectedcolors,setPathColors,setActiveProducts,setPathColorsFront,setPathColorsBack } = userdataSlice.actions;

export default userdataSlice.reducer;
