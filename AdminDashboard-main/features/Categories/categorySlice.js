import { createSlice } from '@reduxjs/toolkit';
import { Categories } from './Categories'

const initialState = {
    isLoading: false,
    categories: Categories,
};

const categorySlice = createSlice({
    name: 'categories',
    initialState
});

// export const { openModal, closeModal } = categorySlice.actions;

export default categorySlice.reducer;
