import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    canvas:null,
    active:null,
    triggerCanvas:false,
    svgInstance:null,
    textInstance:null,
    logoInstance:null,
    imageUploadTimestamp:Date.now(),
    textUploadTimestamp:false,
    view:null,
    fieldvalue:"",
    fontcolor:"",
    fontfamily:"",
    selectedimagef:"",
    selectedimageb:"",
    designsData:null,
    selectedcolor:"",
    // activeDesign:null,
    paths:[],
    // activeproduct:{
    //     linkfront:"https://res.cloudinary.com/da60naxj0/image/upload/v1685080617/userUploads/PM28front_uss5yp.svg",
    //     linkback:"https://res.cloudinary.com/da60naxj0/image/upload/v1685080617/userUploads/PM28back_xumf50.svg"
    // },
    // activeproduct:{
    //     linkfront:"https://res.cloudinary.com/da60naxj0/image/upload/v1685339595/userUploads/PM28front_example_f3ijic.svg",
    //     linkback:"https://res.cloudinary.com/da60naxj0/image/upload/v1682682521/userUploads/mwzobhwpryrupg66zva5.svg"
    // },
    // activeproduct:{
    //     linkfront:"",
    //     linkback:""
    // },
    selectedDesign:null,
    selectedDesignId:"",
    activeside:"front",
};

const usercanvasSlice= createSlice({
    name: 'usercanvas',
    initialState,
    reducers: {
        setcanvas: (state, { payload }) => {
            state.canvas = payload;
        },setactive: (state, { payload }) => {
            state.active = payload;
        },setsvgInstance: (state, { payload }) => {
            state.svgInstance = payload;
        },settextInstance: (state, { payload }) => {
            state.textInstance = payload;
        },setlogoInstance: (state, { payload }) => {
            state.logoInstance = payload;
        },setactiveSide: (state, { payload }) => {
            state.activeside = payload;
        },setview: (state, { payload }) => {
            state.view = payload;
        },setfieldvalue: (state, { payload }) => {
            state.fieldvalue = payload;
        },setfontcolor: (state, { payload }) => {
            state.fontcolor = payload;
        },setfontfamily: (state, { payload }) => {
            state.fontfamily = payload;
        },setpaths: (state, { payload }) => {
            state.paths = payload;
        },settriggerCanvas: (state, { payload }) => {
            state.triggerCanvas = payload;
        },
        setimageUploadTimestamp: (state) => {
            state.imageUploadTimestamp = Date.now();
        },
        settextUploadTimestamp: (state, { payload }) => {
            state.textUploadTimestamp = payload;
        },
        setselectedDesignId:(state, { payload }) => {
            state.selectedDesignId = payload;
        },
        setselectedDesign:(state, { payload }) => {
            state.selectedDesign = payload;
        },
        setselectedimagef: (state, { payload }) => {
            state.selectedimagef = payload;
        },
        setselectedimageb: (state, { payload }) => {
            state.selectedimageb = payload;
        },
        setselectedcolor: (state, { payload }) => {
            state.selectedcolor = payload;
        },
        setdesignsData: (state, { payload }) => {
            state.designsData = payload;
        },
        // setactiveproduct: (state, action) => {
        //     state.linkfront = action.payload.linkfront;
        //     state.linkback = action.payload.linkback;
        //   },
    },
});

export const {setcanvas,setactive,setsvgInstance,settextInstance,setlogoInstance,setactiveSide,setview,setfieldvalue,setfontcolor,setfontfamily,setpaths,settriggerCanvas,setimageUploadTimestamp,settextUploadTimestamp,setselectedDesign,setselectedDesignId,setselectedimagef,setselectedimageb,setdesignsData,setselectedcolor} = usercanvasSlice.actions;

export default usercanvasSlice.reducer;
