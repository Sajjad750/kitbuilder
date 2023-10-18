import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    canvas:null,
    active:null,
    svgInstance:null,
    textInstance:null,
    logoInstance:null,
    activeside:"front",
    view:null,
    fieldvalue:"CR7",
    fontcolor:"",
    fontfamily:"",
    paths:[]
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
        }
    },
});

export const {setcanvas,setactive,setsvgInstance,settextInstance,setlogoInstance,setactiveSide,setview,setfieldvalue,setfontcolor,setfontfamily,setpaths} = usercanvasSlice.actions;

export default usercanvasSlice.reducer;
