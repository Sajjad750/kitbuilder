import { Checkbox, FormControlLabel, Grid, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography, Box } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilesData } from './FindFile';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import DynamicSelect from 'layouts/addCategories/DynamicSelect';
import axios from 'axios';
import { setRequest } from 'features/confirmationModal/confirmationModal';
import { openCon } from 'features/confirmationModal/confirmationModal';
import { updateCategory } from 'features/cartegoriesData/categoriesSlice';
import { addProduct } from 'features/productsData/productsSlice';
import FileSearchComponent from 'layouts/filesSection/SearchBar';
import { SignalCellularNull } from '@mui/icons-material';
import { ReactSVG } from 'react-svg';
import { resetState } from 'features/productsData/productsSlice';
import { closeLoader } from 'features/Loader/loaderSlice';
import { openLoader } from 'features/Loader/loaderSlice';


function AddProduct() {
  const [isActive, setIsActive] = useState(false);
  // States for Files Data
  const [ProductImageFile, setProductImageFile] = useState(null);
  const [ProductFrontSVG, setProductFrontSVG] = useState(null);
  const [ProductBackSVG, setProductBackSVG] = useState(null);
  // const [ProductOverlayFrontFile, setProductOverlayFrontFile] = useState(null);
  // const [ProductOverlayBackFile, setProductOverlayBackFile] = useState(null);

  // References for Image Input
  const fileInputRefFront = useRef(null);
  const fileInputRefBack = useRef(null);
  const fileInputRefImage = useRef(null);
  const formRef = useRef(null);

  // const fileInputRefFrontOverlay = useRef(null);
  // const fileInputRefBackOverlay = useRef(null);

  // Category Selection State
  const [selectedCategory, setselectedCategory] = useState(null);
  const [formData, setformData] = useState(null);
  const { isAuthenticated, userRole } = useSelector(state => state.admin)
  const { isLoading,isSuccess,errorMessage } = useSelector(state => state.products)
  const request = useSelector(state => state.confirmationModal.request)
  const dispatch = useDispatch()
  const { catData } = useSelector(state => state.categories)
  const { register, formState: { errors }, handleSubmit, reset } = useForm();

  const handleCheckboxChange = (event) => {
    setIsActive(event.target.checked);
  };

  const clearFormData = () => {
    setProductImageFile(null)
    setProductFrontSVG(null)
    setProductBackSVG(null)
    setselectedCategory(null)
    setIsActive(false)
    formRef.current.reset();
  }

  useEffect(() => {
    // Reset the state when the component unmounts
    return () => {
      dispatch(resetState())
    };
  }, []);

  const onSubmit = async (data, e) => {
    console.log(data, "data here data")
    // Code for Server Request
    console.log(selectedCategory, "selectedCategory")
    if (ProductImageFile && selectedCategory && ProductFrontSVG && ProductBackSVG) {
      const formData = {
        ...data,
        isActive: isActive,
        // parent:selectedCategory,
        linkfront: ProductFrontSVG,
        linkback: ProductBackSVG,
        // frontOverlay: ProductOverlayFrontFile,
        // backOverlay: ProductOverlayBackFile,
        productImage: ProductImageFile
      }
      console.log(formData, "All data")
      setformData(formData)
      dispatch(openCon({ title: "Product Addition Confirmation!", message: "Are you sure you want to add Product?", request: { state: false, action: "addProduct" } }))
    } else {
      alert("Please Fill all the Required Fields")
    }
  }

  // Error handling useEffect
  useEffect(() => {
    if (!isLoading) {
      dispatch(closeLoader(false)) // Close the loader when not loading
      if (isSuccess) {
        alert("Product added successfully!");
      } else if (errorMessage) {
        alert(`Error: ${errorMessage}`);
      }
    }
  }, [isLoading, isSuccess, errorMessage]);


  useEffect(() => {
    if (request.state && request.action === "addProduct") {
      const id = selectedCategory;
      dispatch(openLoader()) // Open the loader here
      dispatch(addProduct({ id, formData, isAuthenticated }));
      dispatch(setRequest({ state: false, action: "" }));
      setformData({});
      clearFormData();
    }
  }, [request]);

  // useEffect(() => {
  //   if (request.state && request.action === "addProduct") {
  //     const id = selectedCategory
  //     console.log(id, "id here")
  //     console.log(formData, "formData")
  //     dispatch(addProduct({ id, formData, isAuthenticated }));
  //     dispatch(setRequest({ state: false, action: "" }));
  //     setformData({})
  //     clearFormData()
  //   }
  // }, [request])

  const uploadFile = async (fileInput, stateSetter) => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vcmakbux');
        formData.append('folder', 'userUploads');
        const res = await axios.post(
          'https://api.cloudinary.com/v1_1/da60naxj0/image/upload',
          formData
        );
        stateSetter(res.data.secure_url);
      }
    }
  };

  const handleFileInputFront = async (event) => {
    const file = event.target.files[0];
    // Check if the file type is SVG
    if (file && file.type !== 'image/svg+xml') {
      alert('Please upload an SVG file.');
      return;
    }
    await uploadFile(event.target, setProductFrontSVG);
  };
  const handleFileInputBack = async (event) => {
    const file = event.target.files[0];
    // Check if the file type is SVG
    if (file && file.type !== 'image/svg+xml') {
      alert('Please upload an SVG file.');
      return;
    }
    await uploadFile(event.target, setProductBackSVG);
  };


  const handleFileInputImage = async (event) => {
    await uploadFile(event.target, setProductImageFile);
  };

  const handleButtonClick = (event, called) => {
    event.preventDefault()
    if (called == "fileInputRefImage") {
      fileInputRefImage.current.click();
    }
    else if (called == "fileInputRefFront") {
      fileInputRefFront.current.click();
    }
    else if (called == "fileInputRefBack") {
      fileInputRefBack.current.click();
    }
  };


  return (
    <>
      <DashboardLayout>
        <Typography mb={2} mt={2}>
          Add Product
        </Typography>

        <Box component="form" ref={formRef} onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register("name", { required: true })}
                type="text"
                id="product-name"
                label="Product Name"
                variant="outlined"
                fullWidth
                error={errors?.name}
                helperText={errors?.name?.type === "required" ? <p style={{ fontSize: '0.75rem', color: '#F44D40' }}>
                  Product Name is required
                </p> : null}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={Boolean()}>
                {
                  catData && catData.length > 0 ? <DynamicSelect options={catData} setselectedCategory={setselectedCategory} /> : null
                }
              </FormControl>

            </Grid>
            <Grid item xs={12} md={6}>
              <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">List Image:</Typography>
              &nbsp;&nbsp;
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileInputImage}
                style={{ display: 'none' }}
                ref={fileInputRefImage}
              />
              <label htmlFor="contained-button-file">
                <button onClick={(event) => {
                  handleButtonClick(event, "fileInputRefImage")
                }} style={{ backgroundColor: "#4DC85B", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
                  Upload File
                </button>
              </label>
              <Box>
                {
                  ProductImageFile && <img src={ProductImageFile} style={{ width: "50px", height: "50px", marginTop: "6px", borderRadius: "6px" }} />
                }

              </Box>
              {

              }

            </Grid>
            <Grid item xs={12}>
              {
                userRole === "admin" ? <FileSearchComponent setFile={setProductImageFile} allowedFileTypes={['.jpeg', '.png', ".jpg", ".gif", ".webp", ".ico", ".jfif"]} /> : null
              }


            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileInputFront}
                style={{ display: 'none' }}
                ref={fileInputRefFront}
              />
              <label htmlFor="contained-button-file">
                <button onClick={(event) => {
                  handleButtonClick(event, "fileInputRefFront")
                }} style={{ backgroundColor: "#4DC85B", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
                  Upload SVG FrontSide
                </button>
              </label>
              <Box>
                {
                  ProductFrontSVG &&
                  <ReactSVG
                    src={ProductFrontSVG}
                    beforeInjection={(svg) => {
                      svg.setAttribute('style', 'width: 50px; height: 50px; border-radius: 6px;');
                    }}
                  />
                }
              </Box>
              {/* <Box>
                {
                  ProductFrontSVG && <img src={ProductFrontSVG} style={{ width: "50px", height: "50px", marginTop: "6px", borderRadius: "6px" }} />
                }

              </Box> */}
            </Grid>
            <Grid item xs={12}>
              {
                userRole === "admin" ? <FileSearchComponent setFile={setProductImageFile} allowedFileTypes={['.svg']} /> : null
              }


            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="contained-button-file"
                type="file"
                onChange={handleFileInputBack}
                style={{ display: 'none' }}
                ref={fileInputRefBack}
              />
              <label htmlFor="contained-button-file">
                <button onClick={(event) => {
                  handleButtonClick(event, "fileInputRefBack")
                }} style={{ backgroundColor: "#4DC85B", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>
                  Upload SVG BackSide
                </button>
              </label>
              <Box>
                {
                  ProductBackSVG &&
                  <ReactSVG
                    src={ProductBackSVG}
                    beforeInjection={(svg) => {
                      svg.setAttribute('style', 'width: 50px; height: 50px; border-radius: 6px;');
                    }}
                  />
                }
              </Box>
              {/* <Box>
                {
                  ProductBackSVG && <img src={ProductBackSVG} style={{ width: "50px", height: "50px", marginTop: "6px", borderRadius: "6px" }} />
                }

              </Box> */}
            </Grid>
            <Grid item xs={12}>
              {
                userRole === "admin" ? <FileSearchComponent setFile={setProductImageFile} allowedFileTypes={['.svg']} /> : null
              }
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControlLabel
                control={<Checkbox checked={isActive} onChange={handleCheckboxChange} />}
                label="Active"
              />
            </Grid>
            <Grid container mt={4} ml={3}>
              <Grid item xs={6}>
                <button type="submit" style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Add product</button>

                &nbsp;&nbsp;&nbsp;
                <button onClick={(e) => {
                  e.preventDefault()
                  clearFormData()
                }} style={{ backgroundColor: "dodgerblue", color: "white", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer" }}>Cancel</button>

              </Grid>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </>
  );
}
AddProduct.Layout = DashboardLayout;

export default AddProduct;