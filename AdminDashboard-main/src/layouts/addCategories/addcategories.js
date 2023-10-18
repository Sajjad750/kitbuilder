import { Checkbox, FormControlLabel, Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box, FormHelperText } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicSelect from './DynamicSelect';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addCategory } from 'features/cartegoriesData/categoriesSlice';
import FileSearchComponent from 'layouts/filesSection/SearchBar';
import { closeLoader } from 'features/Loader/loaderSlice';
import { openLoader } from 'features/Loader/loaderSlice';
import { resetState } from 'features/cartegoriesData/categoriesSlice';

function AddCategory() {
  const [isActive, setIsActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setselectedCategory] = useState(null);
  const { isAuthenticated, userRole } = useSelector((state) => state.admin);
  const { menuItems, categories, catData, isLoading, isSuccess, errorMessage } = useSelector((state) => state.categories);


  const dispatch = useDispatch()

  const fileInputRef = useRef(null);
  // const { register, handleSubmit, formState: { errors } } = useForm();
  const { register, formState: { errors }, handleSubmit, reset } = useForm()
  const handleCheckboxChange = (event) => {
    setIsActive(event.target.checked);
  };

  useEffect(() => {
    // Reset the state when the component unmounts
    return () => {
      dispatch(resetState())
    };
  }, []);


  // const onSubmit = async (data, e) => {
  //   if (selectedFile) {
  //     const formData = {
  //       ...data,
  //       parent: selectedCategory,
  //       image: selectedFile,
  //       isActive
  //     }
  //     dispatch(addCategory({ formData, isAuthenticated }))
  //     // Clear the states after submission
  //     setselectedCategory(null);
  //     setSelectedFile(null);
  //     setIsActive(false);
  //     // Reset the form fields
  //     reset();
  //   } else if (!selectedFile) {
  //     alert("Please upload an Image")
  //   }
  // }


  const onSubmit = async (data, e) => {
    if (selectedFile) {
      const formData = {
        ...data,
        parent: selectedCategory,
        image: selectedFile,
        isActive
      }
      dispatch(openLoader()) // Open the loader here
      dispatch(addCategory({ formData, isAuthenticated }))
      // Clear the states after submission
      setselectedCategory(null);
      setSelectedFile(null);
      setIsActive(false);
      // Reset the form fields
      reset();
    } else if (!selectedFile) {
      alert("Please upload an Image");
    }
  }

  // error handling
  useEffect(() => {
    if (!isLoading) {
      dispatch(closeLoader(false)) // Close the loader when not loading
      if (isSuccess) {
        alert("Category added successfully!");
      } else if (errorMessage) {
        alert(`Error: ${errorMessage}`);
      }
    }
  }, [isLoading, isSuccess, errorMessage]);



  // File Upload funtions
  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
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
    <>
      <DashboardLayout>
        <Typography mb={2} mt={2}>
          Add Category
        </Typography>
        <Box component="form" id="addcategory-form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                id="category-name"
                {...register("name", { required: true })}
                label="Category Name"
                variant="outlined"
                fullWidth
                error={errors?.name}
                helperText={errors?.name?.type === "required" ? <p style={{ fontSize: '0.75rem', color: '#F44D40' }}>
                  Category Name is required
                </p> : null}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {
                catData && catData.length > 0 ? <DynamicSelect options={catData} setselectedCategory={setselectedCategory} /> : null
              }

            </Grid>
            <Grid item xs={12}>
              {
                selectedFile && <img src={selectedFile} style={{ width: "100px", height: "100px", display: "block" }} />
              }
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileInput}
                style={{ display: 'none' }}
                ref={fileInputRef}

              />
              <label htmlFor="contained-button-file">
                <button onClick={handleButtonClick} style={{ backgroundColor: "#4DC85B", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", marginTop: "20px" }}>
                  Upload
                </button>
              </label>

            </Grid>
            <Grid item xs={12}>
              {/* <FileSearchComponent setFile={setSelectedFile} /> */}
              {
                userRole === "admin" ? <FileSearchComponent setFile={setSelectedFile} allowedFileTypes={['.jpeg', '.png', ".jpg", ".gif", ".webp", ".ico", ".jfif"]} /> : null
              }


            </Grid>
            <Grid item xs={12} md={12}>
              <FormControlLabel
                control={<Checkbox checked={isActive} onChange={handleCheckboxChange} />}
                label="Active"
              />
            </Grid>
            <Grid container mt={4} ml={3}>
              <Grid item xs={12}>
                <button type="submit" style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Add Category</button>

                &nbsp;&nbsp;&nbsp;
                <button style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>

              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </>
  );
}
AddCategory.Layout = DashboardLayout;
export default AddCategory;
