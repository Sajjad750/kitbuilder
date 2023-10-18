import React, { useEffect, useState } from 'react'
import './accordion.css'
import { Box } from '@mui/system'
import { Button, CircularProgress, Grid } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';
import { setbackimages, setfrontimages } from '../../redux/userData/userdataSlice';
// import { handleFileInputChangeb, handleFileInputChangef } from '../../Utility/Image/imageUpload';
import { handlelogoselect } from '../../Utility/Image/imageSelect';
import { loadLogo } from '../../Utility/canvas/canvasHelpers';
import { setimageUploadTimestamp, setlogoInstance, setselectedimagef, setselectedimageb } from '../../redux/canvasData/canvasData';
import axios from 'axios';

const LogoUpload = ({ summary, setdeletionIndex, Upperindex }) => {
    const { frontimages, backimages } = useSelector((state) => state.userdata)
    const { canvas, logoInstance, activeside, selectedimagef, selectedimageb } = useSelector((state) => state.canvas)
    const dispatch = useDispatch()
    const [loading, setloading] = useState(false)

    // Background Removal

    const handleFileInputChange = async (event, images, isFront) => {
        if (event.target.files[0] && event.target.files[0].type.startsWith("image/")) {
            setloading(true)
            const newImages = [...images];
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            formData.append('upload_preset', 'vcmakbux');
            formData.append('folder', 'userUploads');
            try {
                const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
                newImages.push(res.data.secure_url);
                // if (isFront) {
                //     dispatch(setfrontimages(newImages))
                // } else {
                //     dispatch(setbackimages(newImages))
                // }
                if (isFront) {
                    dispatch(setfrontimages(newImages));
                    dispatch(setselectedimagef(res.data.secure_url));
                    loadLogo(res.data.secure_url); // Render the selected image on the canvas
                } else {
                    dispatch(setbackimages(newImages));
                    dispatch(setselectedimageb(res.data.secure_url));
                    loadLogo(res.data.secure_url); // Render the selected image on the canvas
                }
                
                
                setloading(false)

            } catch (err) {
                console.error(err);
                setloading(false)

            }
        }
        event.target.value = null;
    };

    const handleRemove = (index, origin) => {
        if (origin === "front") {
            const newImages = [...frontimages];
            newImages.splice(index, 1);
            if (newImages.length < 1) {
                dispatch(setselectedimagef("")); // Clear the selected image for front
            }
            dispatch(setfrontimages(newImages));
        } else if (origin === "back") {
            const newImages = [...backimages];
            newImages.splice(index, 1);
            if (newImages.length < 1) {
                dispatch(setselectedimageb("")); // Clear the selected image for back
            }
            dispatch(setbackimages(newImages));
        }
        
    };

    return (
        <div>
            <details className="style2" >
                <summary className='mfm'>{summary}</summary>
                <div className="content">
                    <Grid container >
                        {
                            (Upperindex === 0 && frontimages.length > 0) ?
                                frontimages.map((data, index) => {
                                    return <Grid key={index} item xs={3} sx={{ padding: "5px 3px", }}>
                                        <Box onClick={() => {
                                            dispatch(setselectedimagef(frontimages[index]))
                                            dispatch(setimageUploadTimestamp())
                                        }} sx={{ display: "flex", position: "relative", justifyContent: "center", alignItems: "center", height: "100px", border: "1px solid grey", textAlign: "center",cursor:"pointer" }}>
                                            <img alt="objetc" src={frontimages[index]} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2px 0px" }} />
                                            <CancelIcon onClick={(event) => {
                                                event.stopPropagation();
                                                handleRemove(index, activeside)
                                            }} sx={{ cursor: "pointer", position: "absolute", fontSize: "16px", top: "0px", right: "0px", background: "white", color: "#3C90A0", borderRadius: "50%" }} />
                                        </Box>
                                    </Grid>
                                }) : null
                        }
                    </Grid>
                    <Grid container>
                        {
                            (Upperindex === 1 && backimages.length > 0) ?
                                backimages.map((data, index) => {
                                    return <Grid key={index} item xs={3} sx={{ padding: "5px 3px" }}>
                                        <Box onClick={() => {
                                            dispatch(setselectedimageb(backimages[index]))
                                            dispatch(setimageUploadTimestamp())
                                        }} sx={{ display: "flex", position: "relative", justifyContent: "center", alignItems: "center", height: "100px", border: "1px solid grey", textAlign: "center",cursor:"pointer" }}>
                                            <img alt="objetc" src={backimages[index]} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "2px 0px" }} />
                                            <CancelIcon onClick={(event) => {
                                                 event.stopPropagation();
                                                handleRemove(index, activeside)
                                            }} sx={{ cursor: "pointer", position: "absolute", fontSize: "16px", top: "0px", right: "0px", background: "white", color: "#3C90A0", borderRadius: "50%" }} />
                                        </Box>
                                    </Grid>
                                }) : null
                        }
                    </Grid>
                    <Grid container item xs={12}>
                        <label className="custom-file-upload" >
                            {loading ?
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {/* <span>Loading</span> */}
                                    <CircularProgress sx={{ color: "#3C90A0", margin: "0px 26px" }} size={24} />
                                </div>
                                : "Upload"
                            }
                            <input
                                type="file"
                                name="myImage"
                                disabled={loading}
                                onChange={(event) => {
                                    if (Upperindex === 0) {
                                        console.log("font images component")
                                        handleFileInputChange(event, frontimages, true);
                                    } else if (Upperindex === 1) {
                                        console.log("back images component")
                                        handleFileInputChange(event, backimages, false);
                                    }
                                }}
                            />
                        </label>
                    </Grid>
                </div>
            </details>
        </div>
    )
}

export default LogoUpload