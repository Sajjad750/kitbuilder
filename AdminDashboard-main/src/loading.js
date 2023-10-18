import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect } from 'react'

import { openLoader } from "features/Loader/loaderSlice";
import { closeLoader } from "features/Loader/loaderSlice";
import { useDispatch,useSelector } from "react-redux";

export default function Loading() {
    const { isOpen } = useSelector(state => state.loader);
    return (
        <div>
            <Backdrop
                style={{ zIndex: 999 }}
                sx={{ color: "#007ACC", zIndex: 9999 }}
                open={isOpen}
            >
                <CircularProgress color="inherit" style={{ color: "#D40000" }} />
            </Backdrop>
        </div>
    );
}
