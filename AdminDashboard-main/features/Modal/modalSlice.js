import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    message: "",
    variant: ""
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, { payload }) => {
            state.isOpen = true;
            state.message = payload.message;
            state.variant = payload.variant;
        },
        closeModal: (state, { payload }) => {
            state.isOpen = false;
            state.message = "";
            state.variant = payload === "success" ? "success" : payload === "error" ? "error" : "warning"
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
