import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: "",
    primary: "",
    secondary: "",
    sidecolor: "",
    selectedcolors: [],
    selectedkit: "",
    activecomponent: 1,
    frontimages: [],
    backimages: [],
    selectedimagef:"",
    selectedimageb:""
};

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
        setselectedimagef: (state, { payload }) => {
            state.selectedimagef = payload;
        },
        setselectedimageb: (state, { payload }) => {
            state.selectedimageb = payload;
        }
    },
});

export const { setColor, setName, setSelected, setKit, setactiveComponent, setfrontimages, setbackimages , setselectedimagef, setselectedimageb} = userdataSlice.actions;

export default userdataSlice.reducer;
