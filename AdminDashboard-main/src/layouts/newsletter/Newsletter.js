import React, { useEffect, useState } from 'react'
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { Box, Button, Container, CssBaseline, Grid, TextareaAutosize, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { openCon } from 'features/confirmationModal/confirmationModal';
import { setRequest } from 'features/confirmationModal/confirmationModal';
import { sendNewsLetter } from 'features/adminData/adminSlice';
import './news.css'
import { openLoader } from 'features/Loader/loaderSlice';
import { closeLoader } from 'features/Loader/loaderSlice';
import { seterrornull } from 'features/adminData/adminSlice';
import { setMessage } from 'features/adminData/adminSlice';

export const Newsletter = () => {
    const request = useSelector(state => state.confirmationModal.request)
    const { isAuthenticated,error,message } = useSelector(state => state.admin)
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [formData, setformData] = useState([])
    const dispatch = useDispatch()

    const onSubmit = async (data, e) => {
        // Code for Server Request
        setformData(data)
        dispatch(openCon({ title: "Message Broadcast Confirmation!", message: "Are you sure you want to Send Email to Subscribers?", request: { state: false, action: "sendEmaiLSubscriber" } }))
    }
    useEffect(() => {
        if (request.state && request.action === "sendEmaiLSubscriber") {
            dispatch(sendNewsLetter({ formData, isAuthenticated }));
            dispatch(setRequest({ state: false, action: "" }));
            setformData([])
            reset();
        }
    }, [request])

    useEffect(() => {
        if (error) {
          alert("Error: " + error);
          dispatch(seterrornull())
        }
      }, [error]);

      useEffect(() => {
        if (message) {
          alert("Success: " + message);
          dispatch(setMessage(null));
        }
      }, [message]);

    return (
        <DashboardLayout>
            <DashboardNavbar absolute />
            <MDBox mt={8}>
                <Container component="main">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            marginBottom: 8,
                            marginLeft: 3,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography className='mfeb' sx={{ textAlign: "left" }} component="h1" variant="h5">
                            Enter Data to Broadcast
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("subject", { required: true, minLength: 3 })}
                                        fullWidth
                                        id="subject"
                                        label="Subject"
                                        autoFocus
                                        error={!!errors.subject}
                                        helperText={errors.subject?.type === "required" ? "Subject is Required" : errors.subject?.type === "minLength" ? "Minimum length is 3 characters" : null}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        {...register("message", { required: true, minLength: 3 })}
                                        fullWidth
                                        multiline
                                        rows={4}
                                        id="message"
                                        label="Message"
                                        error={!!errors.message}
                                        helperText={errors.message?.type === "required" ? "Message is Required" : errors.message?.type === "minLength" ? "Minimum length is 3 characters" : null}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item sx={{ display: "flex", justifyContent: "space-around" }}>
                                <button
                                    type="submit"
                                    style={{
                                        marginTop: '1rem',
                                        marginBottom: '0.5rem',
                                        maxWidth: "30%",
                                        background: "black",
                                        color: "white",
                                        width: '100%',
                                        border: 'none',
                                        padding: '0.5rem 1rem',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        borderRadius: "10px"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.backgroundColor = '#3593A4';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.backgroundColor = 'black';
                                    }}
                                >
                                    Broadcast
                                </button>
                            </Grid>
                        </Box>

                    </Box>
                </Container>
            </MDBox>
            <Footer />
        </DashboardLayout>
    )
}