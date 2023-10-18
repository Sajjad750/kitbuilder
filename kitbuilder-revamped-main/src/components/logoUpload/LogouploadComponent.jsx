import React, { useState } from 'react';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setfrontimages, setbackimages } from '../../redux/userData/userdataSlice';
import { loadLogo } from '../../Utility/canvas/canvasHelpers';
import { setselectedimagef, setselectedimageb, setimageUploadTimestamp } from '../../redux/canvasData/canvasData';
import axios from 'axios';
import CancelIcon from '@mui/icons-material/Cancel';
import { closeLoader, openLoader } from '../../redux/Loader/loaderSlice';

const NewLogoUpload = () => {
    const { frontimages, backimages } = useSelector((state) => state.userdata);
    const { activeside } = useSelector((state) => state.canvas);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleFileInputChange = async (event) => {
        if (event.target.files[0] && event.target.files[0].type.startsWith("image/")) {
            dispatch(openLoader()); // Open the loader
            const newImages = [...frontimages];
            const formData = new FormData();
            formData.append('file', event.target.files[0]);
            formData.append('upload_preset', 'vcmakbux');
            formData.append('folder', 'userUploads');
            try {
                const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
                newImages.push(res.data.secure_url);
                dispatch(setfrontimages(newImages));
                dispatch(setselectedimagef(res.data.secure_url));
                loadLogo(res.data.secure_url);
            } catch (err) {
                dispatch(closeLoader()); // Close the loader
                console.error(err);
            } finally {
                dispatch(closeLoader()); // Close the loader
            }
        }
        event.target.value = null;
    };

    const handleRemove = (index) => {
        const newImages = [...frontimages];
        newImages.splice(index, 1);
        if (newImages.length < 1) {
            dispatch(setselectedimagef("")); // Clear the selected image
        }
        dispatch(setfrontimages(newImages));
    };


    // const handleFileInputChange = async (event, images, isFront) => {
    //     if (event.target.files[0] && event.target.files[0].type.startsWith("image/")) {
    //         dispatch(openLoader()); // Open the loader
    //         const newImages = [...images];
    //         const formData = new FormData();
    //         formData.append('file', event.target.files[0]);
    //         formData.append('upload_preset', 'vcmakbux');
    //         formData.append('folder', 'userUploads');
    //         try {
    //             const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
    //             newImages.push(res.data.secure_url);
    //             if (isFront) {
    //                 dispatch(setfrontimages(newImages));
    //                 dispatch(setselectedimagef(res.data.secure_url));
    //                 loadLogo(res.data.secure_url);
    //             } else {
    //                 dispatch(setbackimages(newImages));
    //                 dispatch(setselectedimageb(res.data.secure_url));
    //                 loadLogo(res.data.secure_url);
    //             }
    //         } catch (err) {
    //             dispatch(closeLoader()); // Close the loader
    //             console.error(err);
    //         } finally {
    //             dispatch(closeLoader()); // Close the loader
    //         }
    //     }
    //     event.target.value = null;
    // };

    // const handleRemove = (index, origin) => {
    //     if (origin === "front") {
    //         const newImages = [...frontimages];
    //         newImages.splice(index, 1);
    //         if (newImages.length < 1) {
    //             dispatch(setselectedimagef("")); // Clear the selected image for front
    //         }
    //         dispatch(setfrontimages(newImages));
    //     } else if (origin === "back") {
    //         const newImages = [...backimages];
    //         newImages.splice(index, 1);
    //         if (newImages.length < 1) {
    //             dispatch(setselectedimageb("")); // Clear the selected image for back
    //         }
    //         dispatch(setbackimages(newImages));
    //     }

    // };

    return (
        <Grid sx={{ marginBottom: { xs: "60px", md: "0px" } }} item xs={12} md={5}>
            <Typography className='nunito-b' sx={{ color: "white", fontSize: "32px" }}>
                Add Logos
            </Typography>
            <Typography className='nunito-r' sx={{ color: "white", fontSize: "20px" }}>
                {activeside === "front" ? "Front Logo" : "Back Logo"}
            </Typography>
            <Box mt={4}>
                <label>
                    <img style={{ width: "100%", height: "auto", cursor: "pointer" }} src={"https://res.cloudinary.com/da60naxj0/image/upload/v1693391698/userUploads/Group_259_ufseik.png"} />
                    <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(event) => {
                            if (activeside === "front") {
                                handleFileInputChange(event, frontimages, true);
                            } else {
                                handleFileInputChange(event, backimages, false);
                            }
                        }}
                    />
                </label>
            </Box>
            <Grid container mt={3} spacing={2}>
                {frontimages.map((img, index) => (
                    <Grid key={index} item xs={12} md={6} sx={{ textAlign: "center", position: "relative" }}>
                        <Box
                            onClick={() => {
                                if (activeside === "front") {
                                    dispatch(setselectedimagef(img));
                                } else {
                                    dispatch(setselectedimageb(img));
                                }
                                dispatch(setimageUploadTimestamp());
                            }}
                            sx={{
                                display: "flex",
                                position: "relative",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100px",
                                border: "1px solid #ddd",
                                textAlign: "center",
                                cursor: "pointer",
                                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden" // Ensures content does not overflow
                            }}
                        >
                            <img
                                style={{
                                    maxWidth: "100%", // Ensures image does not exceed its container
                                    maxHeight: "100%", // Ensures image does not exceed its container
                                    objectFit: "contain",
                                    objectPosition: "center center",
                                    background: "white",
                                    padding: "2px",
                                    margin: "5px",
                                    border: "1px solid #ddd",
                                }}
                                src={img}
                            />

                            <CancelIcon
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleRemove(index, activeside);
                                }}
                                sx={{ cursor: "pointer", position: "absolute", fontSize: "16px", top: "0px", right: "0px", background: "white", color: "#3C90A0", borderRadius: "50%" }}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>


        </Grid>
    );
}

export default NewLogoUpload;
