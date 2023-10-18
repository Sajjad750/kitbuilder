import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, TextField, Grid, Box, Typography } from '@mui/material';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { config } from '../../config'
import axios from 'axios'
import { fetchActivatedDisabledRetailers } from "features/retailersData/retailersSlice";
import { fetchNotActivatedRetailers } from "features/retailersData/retailersSlice";
import { fetchRetailers } from "features/retailersData/retailersSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchInfoData } from "features/adminData/adminSlice";
import AddRetailerForm from "layouts/quoteForm/quoteForm";

export default function RetailerForm() {
    const { register, handleSubmit, formState: { errors }, watch,reset } = useForm()
    const password = watch("password");  // watch the password field
    let URL = config.url.API_URL
    const { isAuthenticated } = useSelector(state => state.admin)
    const dispatch = useDispatch()

    const onSubmit = async (data, e) => {
        // To Do: Your submit logic here
        console.log(data, "add retailer signup");
        try {
            const response = await axios.post(`${URL}/api/retailers`, data);
            if (response.status === 200) {
                dispatch(fetchActivatedDisabledRetailers())
                dispatch(fetchNotActivatedRetailers());
                dispatch(fetchRetailers(isAuthenticated));
                dispatch(fetchInfoData(isAuthenticated))
                reset()
                alert('Retailer added successfully:', response.data);
                console.log('Retailer added successfully:', response.data);
            } else {
                alert('Error adding retailer:', response.data);
                console.log('Error adding retailer:', response.data);
            }
        } catch (error) {
            alert(error)
            console.log(error)
        }
    }

    return (
        <>
            <DashboardLayout>
                <Box component="main">


                {/* <RetailerForm />  */}
                    <Typography component="h1" variant="h5">
                        Retailer Form
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("name", { required: true, maxLength: 50, minLength: 2 })}
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    error={errors.name ? true : false}
                                    helperText={
                                        errors.name && errors.name.type === "required" && "Name is required" ||
                                        errors.name && errors.name.type === "minLength" && "Minimum length is 2 characters" ||
                                        errors.name && errors.name.type === "maxLength" && "Maximum length is 50 characters"
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register("email", {
                                        required: true,
                                        maxLength: 255,
                                        minLength: 5,
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Invalid email address format"
                                        }
                                    })}
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    error={errors.email ? true : false}
                                    helperText={
                                        errors.email && errors.email.type === "required" && "Email is required" ||
                                        errors.email && errors.email.type === "minLength" && "Minimum length is 5 characters" ||
                                        errors.email && errors.email.type === "maxLength" && "Maximum length is 255 characters" ||
                                        errors.email && errors.email.type === "pattern" && "Invalid email address format"
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register("password", { required: true, maxLength: 255, minLength: 5 })}
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type="password"
                                    error={errors.password ? true : false}
                                    helperText={
                                        errors.password && errors.password.type === "required" && "Password is required" ||
                                        errors.password && errors.password.type === "minLength" && "Minimum length is 5 characters" ||
                                        errors.password && errors.password.type === "maxLength" && "Maximum length is 255 characters"
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    {...register("confirmPassword", {
                                        required: true,
                                        validate: value =>
                                            value === password || "The passwords do not match"
                                    })}
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    type="password"
                                    error={errors.confirmPassword ? true : false}
                                    helperText={
                                        errors.confirmPassword && errors.confirmPassword.type === "required" && "Confirm Password is required" ||
                                        errors.confirmPassword && errors.confirmPassword.type === "validate" && errors.confirmPassword.message
                                    }
                                />
                            </Grid>
                        </Grid>
                        <button type="submit" style={{ marginTop: "20px", backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 40px", borderRadius: "5px", cursor: "pointer" }}>Submit</button>

                    </Box>
                </Box>
                <AddRetailerForm/>
            </DashboardLayout>
        </>
    );
}
