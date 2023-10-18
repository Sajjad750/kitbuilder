import { Backdrop, CircularProgress } from "@mui/material";
import React from 'react'
import { useSelector } from "react-redux";


export default function Loading() {
    const { primary } = useSelector((state) => state.userdata)
    const { isOpen } = useSelector((state) => state.loader)

    useEffect(() => {
      console.log(isOpen,"isOpen isOpen")
    }, [isOpen])
    
    return (
        <div>
            <Backdrop
                style={{ zIndex: 1 }}
                sx={{ color: primary ? primary : "#007ACC", 
                zIndex: 9999,
             }}
                open={isOpen}
            >
                <CircularProgress color="inherit" style={{ color: "#D40000" }} />
            </Backdrop>
        </div>
    );
}
