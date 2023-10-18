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
// import { updateAdminProfile } from 'features/adminData/adminSlice';

import { openCon } from 'features/confirmationModal/confirmationModal';
import { setisRetailerProfile } from 'features/retailersData/retailersSlice';
import { updateRetailerProfile } from 'features/retailersData/retailersSlice';


// import axios from 'axios';
// import { config } from '../../config'

const theme = createTheme();

export default function EditRetailerProfile() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {isRetailerProfile} = useSelector(state => state.retailers)
    const {isAuthenticated} = useSelector(state => state.admin)
    const dispatch = useDispatch();
    const [nameEnabled, setNameEnabled] = useState(false);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [phoneEnabled, setPhoneEnabled] = useState(false);
    const [formData, setformData] = useState({});
    const request = useSelector(state => state.confirmationModal.request)

    // useEffect(()=>{
    //     if(isRetailerProfile.active){
    //         console.log(isRetailerProfile,"useeffect retaler")
    //     }
    // },[])

    const onSubmit = async (data, e) => {
        // Code for Server Request
        const Dataset = Object.keys(data).reduce((acc, key) => {
            if (data[key] !== undefined) {
              acc[key] = data[key];
            }
            return acc;
          }, {});
          console.log(Dataset,"form data")
          if (Object.keys(Dataset).length > 0) {
            setformData(Dataset)
            handleRetailerProfileUpdate()
          } 
    }

    const handleRetailerProfileUpdate = () => {
        dispatch(openCon({title:"Profile Update Confirmation!",message:"Are you sure you want to Update Retailer Data?",request:{state:false,action:"updateRetailerProfile"}}))    
      };
    
      useEffect(()=>{
        if(request.state && request.action === "updateRetailerProfile"){
          const id = isRetailerProfile.currentId
          dispatch(updateRetailerProfile({id,formData,isAuthenticated}));
          dispatch(setRequest({state:false,action:""}));
          dispatch(setisRetailerProfile({active:false,currentId:""}))
          setformData({})
        }
      },[request])


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
                        Edit Retailer Profile
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
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
                            {/* <Grid item xs={12} sm={6}>
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
                            </Grid> */}
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
                            onClick={()=>{ 
                                dispatch(setisRetailerProfile({active:false,currentId:""}))
                            }}
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
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}