import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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
import { setisProductEdit } from 'features/productsData/productsSlice';
import { updateproduct } from 'features/productsData/productsSlice';
import { setisCategoryEdit } from 'features/cartegoriesData/categoriesSlice';
import { updateCategory } from 'features/cartegoriesData/categoriesSlice';

const theme = createTheme();

export default function EditCategoryData() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {isCategoryEdit} = useSelector(state => state.categories)
    const {isAuthenticated} = useSelector(state => state.admin)
    const dispatch = useDispatch();
    const [nameEnabled, setNameEnabled] = useState(false);
    // const [priceEnabled, setPriceEnabled] = useState(false);
    // const [urlSlugEnabled, seturlSlugEnabled] = useState(false);
    // const [frontLinkEnabled, setfrontLinkEnabled] = useState(false);
    // const [backLinkEnabled, setbackLinkEnabled] = useState(false);
    const [formData, setformData] = useState({});
    const request = useSelector(state => state.confirmationModal.request)


    const onSubmit = async (data, e) => {
        // Code for Server Request
        const Dataset = Object.keys(data).reduce((acc, key) => {
            if (data[key] !== undefined) {
              acc[key] = data[key];
            }
            return acc;
          }, {});
          console.log(Dataset,"form data category")
          if (Object.keys(Dataset).length > 0) {
            setformData(Dataset)
            handleCategoryUpdate()
          } 
    }

    const handleCategoryUpdate = () => {
        dispatch(openCon({title:"Category Update Confirmation!",message:"Are you sure you want to Update Category Data?",request:{state:false,action:"updateCategory"}}))    
      };
    
      useEffect(()=>{
        if(request.state && request.action === "updateCategory"){
          const id = isCategoryEdit.currentId
          dispatch(updateCategory({id,formData,isAuthenticated}));
          dispatch(setRequest({state:false,action:""}));
          dispatch(setisCategoryEdit({active:false,currentId:""}))
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
                        marginLeft:3,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography className='mfeb' sx={{ textAlign: "left" }} component="h1" variant="h5">
                        Edit Category Data
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("name", {required:nameEnabled ? true : false , maxLength: nameEnabled ? 30 : null, minLength:nameEnabled ? 3 : null  })}
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
                            {/* <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("urlslug", {required:urlSlugEnabled ? true : false , maxLength: urlSlugEnabled ? 30 : null, minLength:urlSlugEnabled ? 3 : null  })}
                                    autoComplete="urlslug"
                                    type={"urlslug"}
                                    fullWidth
                                    id="urlslug"
                                    label="Url Slug"
                                    onDoubleClick={() => seturlSlugEnabled(true)}
                                    disabled={!urlSlugEnabled}
                                />
                                <Box className='mfb' sx={{ color: "red", fontWeight: "bold" }}>
                                    {urlSlugEnabled  ? errors.urlSlugEnabled && errors.urlSlugEnabled.type ? errors.urlSlugEnabled.type === "required" ? <p>Phone Number is Required</p> : errors.urlSlugEnabled.type === "minLength" ? <p>minLength is 3 Characters</p> : errors.urlSlugEnabled.type === "maxLength" ? <p>maxLength is 30 Characters only</p> : "" : null : null}
                                </Box>
                            </Grid> */}
                        </Grid>
                        <Grid item sx={{display:"flex",justifyContent:"space-around"}}>
                        <Button
                            onClick={()=>{ 
                                dispatch(setisCategoryEdit({active:false,currentId:""}))
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