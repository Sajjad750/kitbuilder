import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open:false,
    title:"",
    message: "",
    request:{
        state:false,
        action:""
    }
};

const confirmationModalSlice = createSlice({
    name: 'confirmationModal',
    initialState,
    reducers: {
        openCon: (state, { payload }) => {
            state.open = true;
            state.title = payload.title;
            state.message = payload.message;
            state.request.state = payload.request.state;
            state.request.action = payload.request.action;
        },
        closeCon: (state) => {
            state.open = false;
        },
        setRequest:(state,{payload})=>{
            state.request.state = payload.state;
            state.request.action = payload.action;
        }
    },
});

export const { openCon, closeCon,setRequest } = confirmationModalSlice.actions;

export default confirmationModalSlice.reducer;
