import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from 'features/retailersData/retailersSlice';
import { setRequest } from 'features/confirmationModal/confirmationModal';
import { updateAdminProfile } from 'features/adminData/adminSlice';
import { openCon } from 'features/confirmationModal/confirmationModal';


// Input field password
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { updateAdminPassword } from 'features/adminData/adminSlice';

// import axios from 'axios';
// import { config } from '../../config'

const theme = createTheme();

export default function EditProfile({ seteditProfile }) {
    // For the first form
    const { register: register1, handleSubmit: handleSubmit1, formState: { errors: errors1 } } = useForm();

    // For the second form
    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm();


    const { admin, isAuthenticated } = useSelector(state => state.admin)
    const dispatch = useDispatch();
    const [nameEnabled, setNameEnabled] = useState(false);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [phoneEnabled, setPhoneEnabled] = useState(false);
    const [formData, setformData] = useState({});
    const request = useSelector(state => state.confirmationModal.request)
    // add this to your component
    const [showPassword, setShowPassword] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const onSubmit = async (data, e) => {
        // Code for Server Request
        const Dataset = Object.keys(data).reduce((acc, key) => {
            if (data[key] !== undefined) {
                acc[key] = data[key];
            }
            return acc;
        }, {});
        console.log(Dataset, "data")
        if (Object.keys(Dataset).length > 0) {
            setformData(Dataset)
            handleAdminProfileUpdate()
        }
    }


    const onPasswordSubmit = async (data, e) => {
        // Before sending request, check if new password and confirmation match
        if (data.newPassword !== data.confirmNewPassword) {
            alert("New passwords do not match");
            return;
        }

        // If they do match, continue with request
        const Dataset = Object.keys(data).reduce((acc, key) => {
            if (data[key] !== undefined) {
                acc[key] = data[key];
            }
            return acc;
        }, {});

        console.log(Dataset, "data")

        if (Object.keys(Dataset).length > 0) {
            setformData(Dataset)
            handleChangePassword() // Call API function to handle password change
        }
    }

    const handleChangePassword = () => {
        // setupdationId(retailerId)
        dispatch(openCon({ title: "Password Update Confirmation!", message: "Are you sure you want to Update your Password?", request: { state: false, action: "updateAdminPassword" } }))
    };


    useEffect(() => {
        if (request.state && request.action === "updateAdminPassword") {
            console.log(formData, "formData formData")
            dispatch(updateAdminPassword({ formData, isAuthenticated }));
            dispatch(setRequest({ state: false, action: "" }));
            setformData({})
            seteditProfile(false)
            alert("Password Changed Successfully")
        }
    }, [request])


    const handleAdminProfileUpdate = () => {
        // setupdationId(retailerId)
        dispatch(openCon({ title: "Profile Update Confirmation!", message: "Are you sure you want to Update your Data?", request: { state: false, action: "updateAdminProfile" } }))
    };

    useEffect(() => {
        if (request.state && request.action === "updateAdminProfile") {
            const id = admin[0]._id
            dispatch(updateAdminProfile({ id, formData, isAuthenticated }));
            dispatch(setRequest({ state: false, action: "" }));
            seteditProfile(false)
            setformData({})
            //   setupdationId("")
        }
    }, [request])


    return (
        <ThemeProvider theme={theme}>
            <Container component="main">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography className='mfeb' sx={{ textAlign: "left" }} component="h1" variant="h5">
                        Edit Profile
                    </Typography>


                    <Box component="form" onSubmit={handleSubmit1(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    {...register1("name", { required: true, maxLength: 30, minLength: 3 })}
                                    autoComplete="off"
                                    defaultValue={admin[0]?.name || ''}
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    variant="outlined"
                                    error={errors1?.name}
                                    helperText={
                                        errors1?.name &&
                                        (errors1?.name?.type === "required" && "Full-Name is Required") ||
                                        (errors1?.name?.type === "maxLength" && "Name cannot exceed 30 characters") ||
                                        (errors1?.name?.type === "minLength" && "Name should be at least 3 characters")
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    {...register1("email", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    defaultValue={admin[0]?.email || ''}
                                    autoComplete="off"
                                    type={"email"}
                                    id="email"
                                    label="Email Address"
                                    variant="outlined"
                                    error={errors1?.email}
                                    helperText={
                                        errors1?.email &&
                                        (errors1?.email?.type === "required" && "Email is Required") ||
                                        (errors1?.email?.type === "maxLength" && "Email cannot exceed 30 characters") ||
                                        (errors1?.email?.type === "minLength" && "Email should be at least 3 characters")
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    {...register1("phone", { required: true, maxLength: 30, minLength: 3 })}
                                    autoComplete="off"
                                    defaultValue={admin[0]?.phone || ''}
                                    type={"number"}
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    variant="outlined"
                                    error={errors1?.phone}
                                    helperText={
                                        errors1?.phone &&
                                        (errors1?.phone?.type === "required" && "Phone Number is Required") ||
                                        (errors1?.phone?.type === "maxLength" && "Phone number cannot exceed 30 digits") ||
                                        (errors1?.phone?.type === "minLength" && "Phone number should be at least 3 digits")
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                                <Button
                                    onClick={() => { seteditProfile(false) }}
                                    variant="contained"
                                    sx={{ width: '45%', background: "black", "&:hover": { backgroundColor: '#3593A4' } }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ width: '45%', background: "black", "&:hover": { backgroundColor: '#3593A4' } }}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>



                    <Box
                        sx={{
                            marginTop: 8,
                            marginBottom: 8,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography className='mfeb' sx={{ textAlign: "left" }} component="h1" variant="h5">
                            Change Password
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit2(onPasswordSubmit)} sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        {...register2("oldPassword", { required: true, maxLength: 30, minLength: 5 })}
                                        autoComplete="off"
                                        type={showOldPassword ? 'text' : 'password'}
                                        fullWidth
                                        id="oldPassword"
                                        label="Old Password"
                                        variant="outlined"
                                        error={errors2?.oldPassword}
                                        helperText={
                                            errors2?.oldPassword &&
                                            (errors2?.oldPassword?.type === "required" && "Old password is Required") ||
                                            (errors2?.oldPassword?.type === "maxLength" && "Old password cannot exceed 30 characters") ||
                                            (errors2?.oldPassword?.type === "minLength" && "Old password should be at least 6 characters")
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle old password visibility"
                                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                    >
                                                        {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        {...register2("newPassword", { required: true, maxLength: 30, minLength: 5 })}
                                        autoComplete="new-password"
                                        type={showNewPassword ? 'text' : 'password'}
                                        fullWidth
                                        id="newPassword"
                                        label="New Password"
                                        variant="outlined"
                                        error={errors2?.newPassword}
                                        helperText={
                                            errors2?.newPassword &&
                                            (errors2?.newPassword?.type === "required" && "New password is Required") ||
                                            (errors2?.newPassword?.type === "maxLength" && "New password cannot exceed 30 characters") ||
                                            (errors2?.newPassword?.type === "minLength" && "New password should be at least 6 characters")
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle new password visibility"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                    >
                                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        {...register2("confirmNewPassword", { required: true, maxLength: 30, minLength: 5 })}
                                        autoComplete="off"
                                        type={showConfirmNewPassword ? 'text' : 'password'}
                                        fullWidth
                                        id="confirmNewPassword"
                                        label="Confirm New Password"
                                        variant="outlined"
                                        error={errors2?.confirmNewPassword}
                                        helperText={
                                            errors2?.confirmNewPassword &&
                                            (errors2?.confirmNewPassword?.type === "required" && "Confirmation of new password is Required") ||
                                            (errors2?.confirmNewPassword?.type === "maxLength" && "Confirmation of new password cannot exceed 30 characters") ||
                                            (errors2?.confirmNewPassword?.type === "minLength" && "Confirmation of new password should be at least 6 characters")
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm new password visibility"
                                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                        onMouseDown={(event) => event.preventDefault()}
                                                    >
                                                        {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item container>
                                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                        <Button
                                            onClick={() => { seteditProfile(false) }}
                                            variant="contained"
                                            sx={{ width: '90%', background: "black", "&:hover": { backgroundColor: '#3593A4' } }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{ width: '90%', background: "black", "&:hover": { backgroundColor: '#3593A4' } }}
                                        >
                                            Update Password
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>



                    {/* <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("name", {required:nameEnabled ? true : false , maxLength: nameEnabled ? 30 : null, minLength:nameEnabled ? 3 : null  })}
                                    autoComplete="given-name"
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    onDoubleClick={() => setNameEnabled(true)}
                                    disabled={!nameEnabled}
                                />
                                <Box className='mfb' sx={{ color: "red", fontWeight: "bold" }}>
                                    {nameEnabled ? errors.Name && errors.Name.type ? errors.Name.type === "required" ? <p>First-Name is Required</p> : errors.Name.type === "minLength" ? <p>minLength is 3 Characters</p> : errors.Name.type === "maxLength" ? <p>maxLength is 30 Characters only</p> : "" : null : null}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("email",{required:emailEnabled ? true : false , maxLength: emailEnabled ? 30 : null, minLength:emailEnabled ? 3 : null  })}
                                    fullWidth
                                    type={"email"}
                                    id="email"
                                    label="Email Address"
                                    autoComplete="email"
                                    onDoubleClick={() => setEmailEnabled(true)}
                                    disabled={!emailEnabled}
                                />
                                <Box className='mfb' sx={{ color: "red", fontWeight: "bold" }}>
                                    { emailEnabled ? errors.email && errors.email.type ? errors.email.type === "required" ? <p>Email is Required</p> : errors.email.type === "minLength" ? <p>minLength is 3 Characters</p> : errors.email.type === "maxLength" ? <p>maxLength is 30 Characters only</p> : "" : null : null}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("phone", {required:phoneEnabled ? true : false , maxLength: phoneEnabled ? 30 : null, minLength:phoneEnabled ? 3 : null  })}
                                    autoComplete="phone-number"
                                    type={"number"}
                                    fullWidth
                                    id="phone"
                                    label="Phone Number"
                                    onDoubleClick={() => setPhoneEnabled(true)}
                                    disabled={!phoneEnabled}
                                />
                                <Box className='mfb' sx={{ color: "red", fontWeight: "bold" }}>
                                    {phoneEnabled  ? errors.phoneNumber && errors.phoneNumber.type ? errors.phoneNumber.type === "required" ? <p>Phone Number is Required</p> : errors.phoneNumber.type === "minLength" ? <p>minLength is 3 Characters</p> : errors.phoneNumber.type === "maxLength" ? <p>maxLength is 30 Characters only</p> : "" : null : null}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <Button
                                variant="contained"
                                component="label"
                                >
                                Upload Profile
                                <input
                                    type="file"
                                    hidden
                                />
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item sx={{display:"flex",justifyContent:"space-around"}}>
                        <Button
                            onClick={()=>{ seteditProfile(false)}}
                            className='mfeb quotebtn brrd'
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3, mb: 2, maxWidth: "30%", background: "black", "&:hover": {
                                    backgroundColor: '#3593A4'
                                }
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            // onClick={()=>{ seteditProfile(false)}}
                            className='mfeb quotebtn brrd'
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3, mb: 2, maxWidth: "30%", background: "black", "&:hover": {
                                    backgroundColor: '#3593A4'
                                }
                            }}
                        >
                            Update
                        </Button>
                        </Grid>
                    </Box> */}

                </Box>
            </Container>
        </ThemeProvider>
    );
}