import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false
};

const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        openLoader: (state) => {
            state.isOpen = true;
        },
        closeLoader: (state) => {
            state.isOpen = false;
        },
    },
});

export const { openLoader, closeLoader, isOpen } = loaderSlice.actions;

export default loaderSlice.reducer;
