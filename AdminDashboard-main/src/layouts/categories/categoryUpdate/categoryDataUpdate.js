import React, { useEffect, useRef, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { setRequest } from 'features/confirmationModal/confirmationModal';

import { openCon } from 'features/confirmationModal/confirmationModal';
import { setisRetailerProfile } from 'features/retailersData/retailersSlice';
import { updateRetailerProfile } from 'features/retailersData/retailersSlice';
import { setisProductEdit } from 'features/productsData/productsSlice';
import { updateproduct } from 'features/productsData/productsSlice';
import { setisCategoryEdit } from 'features/cartegoriesData/categoriesSlice';
import { updateCategory } from 'features/cartegoriesData/categoriesSlice';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import { setactiveCategory } from 'features/cartegoriesData/categoriesSlice';
import axios from 'axios';
import DynamicSelect from 'layouts/addCategories/DynamicSelect';

const theme = createTheme();

export default function EditCategoryData() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {isCategoryEdit,activeCategory,catData} = useSelector(state => state.categories)
    const {isAuthenticated} = useSelector(state => state.admin)
    const dispatch = useDispatch();
    const [formData, setformData] = useState({});
    const request = useSelector(state => state.confirmationModal.request)
    
    const [isActive, setIsActive] = useState(activeCategory.isActive);
    const [selectedFile, setSelectedFile] = useState(activeCategory.image);
    const [categoryName, setcategoryName] = useState(activeCategory.name);
    const [categoryPosition, setcategoryPosition] = useState(activeCategory.position);
    const [categorySlug, setcategorySlug] = useState(activeCategory.urlslug);
    const [selectedCategory,setselectedCategory] = useState(null);

    const fileInputRef = useRef(null);
    useEffect(()=>{
        setIsActive(activeCategory.isActive)
        setcategorySlug(activeCategory.urlslug)
        setcategoryPosition(activeCategory.position)
        setcategoryName(activeCategory.name)
    },[activeCategory])


    const onSubmit = async (data, e) => {
        // Code for Server Request
        console.log(data,"Ok hy")
        console.log(selectedCategory,"selectedCategory")
        // parent:parentCategory,
        const formData = {
          ...data,
          isActive: isActive,
          image:selectedFile,
          parent:selectedCategory
        }
          if (Object.keys(formData).length > 0) {
            setformData(formData)
            handleCategoryUpdate()
          }
        console.log(formData,"formData")
    }

    const handleCategoryUpdate = () => {
        dispatch(openCon({title:"Category Update Confirmation!",message:"Are you sure you want to Update Category Data?",request:{state:false,action:"updateCategory"}}))    
      };
    
      useEffect(()=>{
        if(request.state && request.action === "updateCategory"){
          const id = isCategoryEdit.currentId
          console.log(id,"id here")
          if(formData.parent !== id){
            dispatch(updateCategory({id,formData,isAuthenticated}));
            dispatch(setRequest({state:false,action:""}));
            dispatch(setisCategoryEdit({active:false,currentId:""}))
            setformData({})
          }else{
            alert("Error Action not Valid due to same category and parent")
          }

        }
      },[request])

    const handleCheckboxChange = (event) => {
        setIsActive(event.target.checked);
      };


    // File Upload funtions  
    const handleFileInput = async(event) => {
        const file = event.target.files[0];
        if(file && file.type.startsWith("image/")){
            // console.log(file,"file")
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'vcmakbux');
            formData.append('folder', 'userUploads');
        // do something with the file, like upload to server or cloudinary API
        const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
        console.log(res.data.secure_url)
        setSelectedFile(res.data.secure_url);
    }
    };
    
    const handleButtonClick = (event) => {
        event.preventDefault()
        fileInputRef.current.click()
    };
        


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
      <Typography mb={2} mt={2}>
        Update Category
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
      <TextField
        id="category-name"
        {...register("name", { required: true })}
        onChange={(event)=>{setcategoryName(event.target.value)}}
        // label="Category Name"
        variant="outlined"
        value={categoryName}
        fullWidth
        error={errors?.name}
        helperText={errors?.name?.type === "required" ? <p style={{ fontSize: '0.75rem', color: '#F44D40' }}>
        Category Name is required
      </p> : null}
      />
      </Grid>
      <Grid item xs={12} md={6}>
      <FormControl fullWidth error={Boolean(errors.productCategory)}>
      {/* <InputLabel id="demo-simple-select-label">Parent Category</InputLabel> */}

        {
         catData && catData.length > 0 ? <DynamicSelect options={catData} setselectedCategory={setselectedCategory} />  : null
        }

    
      {errors.productCategory && (
        <p style={{ fontSize: '0.75rem', color: '#F44D40', marginLeft: '14px' }}>
          Parent category is required
        </p>
      )}
    </FormControl>
      </Grid>
      {/* <Grid item xs={12} md={6}>
        <TextField
         {...register("urlslug", { required: true, minLength: 3 })}
          type="text"
          id="url-slug"
          value={categorySlug}
        onChange={(event)=>{setcategorySlug(event.target.value)}}
        //   label="URL Slug"
          variant="outlined"
          fullWidth
          error={errors?.urlslug}
          helperText={errors?.urlslug?.type === "required" ?  <p style={{ fontSize: '0.75rem', color: '#F44D40'}}>
          Category Url Slug is required
        </p> : null}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
         {...register("position", { required: true })}
          type="number"
          id="position"
          value={categoryPosition}
          onChange={(event)=>{setcategoryPosition(event.target.value)}}
        //   label="Position"
          variant="outlined"
          fullWidth
          error={errors?.position}
          helperText={errors?.position?.type === "required" ?  <p style={{ fontSize: '0.75rem', color: '#F44D40' }}>
          Category Position is required
        </p> : null}
        />
      </Grid> */}
      <Grid item xs={12} md={6}>
        <img src={selectedFile} style={{width:"80px",height:"80px"}} />
      </Grid>
      <Grid item xs={12}>
      <input
        accept="image/*"
        id="contained-button-file"
        type="file"
        onChange={handleFileInput}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
      <label htmlFor="contained-button-file">
        <button onClick={handleButtonClick} style={{backgroundColor: "#4DC85B", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer"}}>
          Upload 
        </button>
      </label>
      </Grid>
      <Grid item xs={12} md={12}>
        <FormControlLabel
          control={<Checkbox checked={isActive} onChange={handleCheckboxChange} />}
          label="Active"
        />
      </Grid>
      <Grid container mt={4} ml={3}>
      <Grid item xs={6}>
        <button type="submit"  style={{backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer"}}> Update Category</button>

        &nbsp;&nbsp;&nbsp;
        <button onClick={()=>{dispatch(setisCategoryEdit({active:false,currentId:""}))}} style={{backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer"}}>Cancel</button>

      </Grid>
      </Grid>
    </Grid>
    </Box>

                </Box>
            </Container>
        </ThemeProvider>
    );
}