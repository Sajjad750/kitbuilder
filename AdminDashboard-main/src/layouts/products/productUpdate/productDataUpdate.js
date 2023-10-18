import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "features/retailersData/retailersSlice";
import { setRequest } from "features/confirmationModal/confirmationModal";
// import { updateAdminProfile } from 'features/adminData/adminSlice';

import { openCon } from "features/confirmationModal/confirmationModal";
import { setisRetailerProfile } from "features/retailersData/retailersSlice";
import { updateRetailerProfile } from "features/retailersData/retailersSlice";
import { setisProductEdit } from "features/productsData/productsSlice";
import { updateproduct } from "features/productsData/productsSlice";
import { Checkbox, FormControl, FormControlLabel } from "@mui/material";
import axios from "axios";

const theme = createTheme();

export default function EditProductData() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isProductEdit, activeProduct } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [formData, setformData] = useState({});
  const request = useSelector((state) => state.confirmationModal.request);

  // References for Image Input
  const fileInputRefFront = useRef(null);
  const fileInputRefBack = useRef(null);
  const fileInputRefImage = useRef(null);
  const fileInputRefFrontOverlay = useRef(null);
  const fileInputRefBackOverlay = useRef(null);

  // States for Files Data
  const [ProductImageFile, setProductImageFile] = useState(activeProduct.productImage);
  const [ProductOverlayFrontFile, setProductOverlayFrontFile] = useState(
    activeProduct.frontOverlay
  );
  const [ProductOverlayBackFile, setProductOverlayBackFile] = useState(activeProduct.backOverlay);
  const [ProductFrontSVG, setProductFrontSVG] = useState(activeProduct.linkfront);
  const [ProductBackSVG, setProductBackSVG] = useState(activeProduct.linkback);

  //  States for Data Updation
  const [name, setname] = useState(activeProduct.name);
  const [position, setposition] = useState(activeProduct.position);
  const [urlslug, seturlslug] = useState(activeProduct.urlslug);
  const [isActive, setisActive] = useState(activeProduct.isActive);
  const [heightBasketPage, setheightBasketPage] = useState(activeProduct.heightBasketPage);
  const [editorGripScale, seteditorGripScale] = useState(activeProduct.editorGripScale);
  const [dimensionWidth, setdimensionWidth] = useState(activeProduct.dimensionWidth);
  const [dimensionHeight, setdimensionHeight] = useState(activeProduct.dimensionHeight);
  const [defaultToggleColor, setdefaultToggleColor] = useState(activeProduct.defaultToggleColor);

  const handleProductUpdate = () => {
    dispatch(
      openCon({
        title: "Product Update Confirmation!",
        message: "Are you sure you want to Update Product Data?",
        request: { state: false, action: "updateProduct" },
      })
    );
  };

  useEffect(() => {
    if (request.state && request.action === "updateProduct") {
      const id = isProductEdit.currentId;
      console.log(id,"id")
      dispatch(updateproduct({ id, formData, isAuthenticated }));
      dispatch(setRequest({ state: false, action: "" }));
      dispatch(setisProductEdit({ active: false, currentId: "" }));
      setformData({});
    }
  }, [request]);

  const handleCheckboxChange = (event) => {
    setisActive(event.target.checked);
  };

  const onSubmit = async (data, e) => {
    // Code for Server Request
    console.log(data, "data");
    // if (ProductImageFile && selectedCategory && ProductFrontSVG && ProductBackSVG) {
      const formData = {
        ...data,
        isActive: isActive,
        // parent:selectedCategory,
        linkfront: ProductFrontSVG,
        linkback: ProductBackSVG,
        frontOverlay: ProductOverlayFrontFile,
        backOverlay: ProductOverlayBackFile,
        productImage: ProductImageFile,
      };
      console.log(formData, "formData");
      setformData(formData);
      dispatch(
        openCon({
          title: "Product Updation Confirmation!",
          message: "Are you sure you want to Update Product?",
          request: { state: false, action: "updateProduct" },
        })
      );
    // } else {
    //   alert("Please Fill all the Required Fields");
    // }
  };

  const uploadFile = async (fileInput, stateSetter) => {
    const file = fileInput.files[0];
    console.log(file,"file")
    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "vcmakbux");
      formData.append("folder", "userUploads");
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/da60naxj0/image/upload",
        formData
      );
      stateSetter(res.data.secure_url);
    }
  };

  const handleFileInputFront = async (event) => {
    const file = event.target.files[0];
    // Check if the file type is SVG
    // if (!file.type.includes("svg")) {
    //   alert("Please upload an SVG file.");
    //   return;
    // }
    await uploadFile(event.target, setProductFrontSVG);
  };
  const handleFileInputBack = async (event) => {
    const file = event.target.files[0];
    // Check if the file type is SVG
    // if (!file.type.includes("svg")) {
    //   alert("Please upload an SVG file.");
    //   return;
    // }
    await uploadFile(event.target, setProductBackSVG);
  };
  const handleFileInputImage = async (event) => {
    await uploadFile(event.target, setProductImageFile);
  };
  const handleFileInputBackOverlay = async (event) => {
    await uploadFile(event.target, setProductOverlayBackFile);
  };
  const handleFileInputFrontOverlay = async (event) => {
    await uploadFile(event.target, setProductOverlayFrontFile);
  };

  const handleButtonClick = (event, called) => {
    event.preventDefault();
    if (called == "fileInputRefImage") {
      fileInputRefImage.current.click();
    } else if (called == "fileInputRefFrontOverlay") {
      fileInputRefFrontOverlay.current.click();
    } else if (called == "fileInputRefBackOverlay") {
      fileInputRefBackOverlay.current.click();
    } else if (called == "fileInputRefFront") {
      fileInputRefFront.current.click();
    } else if (called == "fileInputRefBack") {
      fileInputRefBack.current.click();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />

        <Box
          sx={{
            marginTop: 8,
            marginBottom: 8,
            marginLeft: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography className="mfeb" sx={{ textAlign: "left" }} component="h1" variant="h5">
            Edit Product Data
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("name", { required: true })}
                  type="text"
                  id="product-name"
                  label="Product Name"
                  variant="outlined"
                  fullWidth
                  onChange={(event)=>{
                    setname(event.target.value)
                  }}
                  value={name}
                  error={errors?.name}
                  helperText={
                    errors?.name?.type === "required" ? (
                      <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                        Product Name is required
                      </p>
                    ) : null
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={Boolean()}>
                  {/* {catData && catData.length > 0 ? (
                    <DynamicSelect options={catData} setselectedCategory={setselectedCategory} />
                  ) : null} */}
                </FormControl>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  {...register("urlslug", { required: true })}
                  type="text"
                  id="url-slug"
                  label="URL Slug"
                  variant="outlined"
                  fullWidth
                  onChange={(event)=>{
                    seturlslug(event.target.value)
                  }}
                  value={urlslug}
                  error={errors?.urlslug}
                  helperText={
                    errors?.urlslug?.type === "required" ? (
                      <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                        Product URL Slug is required
                      </p>
                    ) : null
                  }
                />
              </Grid> */}
              <Grid item xs={12} md={6}>
                <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">
                  List Image:
                </Typography>
                &nbsp;&nbsp;
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileInputImage}
                  style={{ display: "none" }}
                  ref={fileInputRefImage}
                />
                <label htmlFor="contained-button-file">
                  <button
                    onClick={(event) => {
                      handleButtonClick(event, "fileInputRefImage");
                    }}
                    style={{
                      backgroundColor: "#4DC85B",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Upload File
                  </button>
                </label>
                <Box>
                  {ProductImageFile && (
                    <img
                      src={ProductImageFile}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "6px",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </Box>
              </Grid>
              {/* <Grid item container justifyContent={"center"} xs={12} md={12}>
                <Grid item xs={12} md={5}>
                  <TextField
                    {...register("dimensionWidth", { required: true })}
                    type="number"
                    id="dimensions-width"
                    label="Dimensions (Width)"
                    variant="outlined"
                    fullWidth
                    onChange={(event)=>{
                        setdimensionWidth(event.target.value)
                    }}
                    value={dimensionWidth}
                    error={errors?.dimensionWidth}
                    helperText={
                      errors?.dimensionWidth?.type === "required" ? (
                        <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                          Product Dimension Width is required
                        </p>
                      ) : null
                    }
                  />
                </Grid>
                <Grid item xs={12} md={1} sx={{ textAlign: "center" }}>
                  <Typography sx={{ color: "#1E90FF" }}>X</Typography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    {...register("dimensionHeight", { required: true })}
                    type="number"
                    id="dimensions-height"
                    label="Dimensions (Height)"
                    variant="outlined"
                    fullWidth
                    onChange={(event)=>{
                        setdimensionHeight(event.target.value)
                    }}
                    value={dimensionHeight}
                    error={errors?.dimensionHeight}
                    helperText={
                      errors?.dimensionHeight?.type === "required" ? (
                        <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                          Product Dimension-Height is required
                        </p>
                      ) : null
                    }
                  />
                </Grid>
              </Grid> */}
              {/* <Grid item xs={12} md={6}>
                <TextField
                  {...register("editorGripScale", { required: true })}
                  type="number"
                  id="editor-grip-scale"
                  label="Editor Grip Scale"
                  variant="outlined"
                  fullWidth
                  onChange={(event)=>{
                    seteditorGripScale(event.target.value)
                  }}
                  value={editorGripScale}
                  error={errors?.editorGripScale}
                  helperText={
                    errors?.editorGripScale?.type === "required" ? (
                      <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                        Product Editor-Grip-Scale is required
                      </p>
                    ) : null
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("heightBasketPage", { required: true })}
                  type="number"
                  id="height-basket-page"
                  label="Height Basket Page"
                  variant="outlined"
                  fullWidth
                  onChange={(event)=>{
                    setheightBasketPage(event.target.value)
                  }}
                  value={heightBasketPage}
                  error={errors?.heightBasketPage}
                  helperText={
                    errors?.heightBasketPage?.type === "required" ? (
                      <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                        Product Height-Basket-Page is required
                      </p>
                    ) : null
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("defaultToggleColor", { required: true })}
                  type="text"
                  id="default-toggle-color"
                  label="Default Toggle Color"
                  variant="outlined"
                  fullWidth
                  onChange={(event)=>{
                    setdefaultToggleColor(event.target.value)
                  }}
                  value={defaultToggleColor}
                  error={errors?.defaultToggleColor}
                  helperText={
                    errors?.defaultToggleColor?.type === "required" ? (
                      <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                        Product Default-Toggle-Color is required
                      </p>
                    ) : null
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  {...register("position", { required: true })}
                  type="number"
                  id="position"
                  label="Position"
                  variant="outlined"
                  fullWidth
                  onChange={(event)=>{
                    setposition(event.target.value)
                  }}
                  value={position}
                  error={errors?.position}
                  helperText={
                    errors?.position?.type === "required" ? (
                      <p style={{ fontSize: "0.75rem", color: "#F44D40" }}>
                        Product Position is required
                      </p>
                    ) : null
                  }
                />
              </Grid> */}
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileInputFront}
                  style={{ display: "none" }}
                  ref={fileInputRefFront}
                />
                <label htmlFor="contained-button-file">
                  <button
                    onClick={(event) => {
                      handleButtonClick(event, "fileInputRefFront");
                    }}
                    style={{
                      backgroundColor: "#4DC85B",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Upload SVG FrontSide
                  </button>
                </label>
                <Box>
                  {ProductFrontSVG && (
                    <img
                      src={ProductFrontSVG}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "6px",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </Box>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">
                  Front Overlay:
                </Typography>
                &nbsp;&nbsp;
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileInputFrontOverlay}
                  style={{ display: "none" }}
                  ref={fileInputRefFrontOverlay}
                />
                <label htmlFor="contained-button-file">
                  <button
                    onClick={(event) => {
                      handleButtonClick(event, "fileInputRefFrontOverlay");
                    }}
                    style={{
                      backgroundColor: "#1E90FF",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Upload File
                  </button>
                </label>
                <Box>
                  {ProductOverlayFrontFile && (
                    <img
                      src={ProductOverlayFrontFile}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "6px",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </Box>
              </Grid> */}
              <Grid item xs={12}>
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileInputBack}
                  style={{ display: "none" }}
                  ref={fileInputRefBack}
                />
                <label htmlFor="contained-button-file">
                  <button
                    onClick={(event) => {
                      handleButtonClick(event, "fileInputRefBack");
                    }}
                    style={{
                      backgroundColor: "#4DC85B",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Upload SVG BackSide
                  </button>
                </label>
                <Box>
                  {ProductBackSVG && (
                    <img
                      src={ProductBackSVG}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "6px",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={<Checkbox checked={isActive} onChange={handleCheckboxChange} />}
                  label="Active"
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">
                  Back Overlay:
                </Typography>
                &nbsp;&nbsp;
                <input
                  accept="image/*"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileInputBackOverlay}
                  style={{ display: "none" }}
                  ref={fileInputRefBackOverlay}
                />
                <label htmlFor="contained-button-file">
                  <button
                    onClick={(event) => {
                      handleButtonClick(event, "fileInputRefBackOverlay");
                    }}
                    style={{
                      backgroundColor: "#1E90FF",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Upload File
                  </button>
                </label>
                <Box>
                  {ProductOverlayBackFile && (
                    <img
                      src={ProductOverlayBackFile}
                      style={{
                        width: "50px",
                        height: "50px",
                        marginTop: "6px",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </Box>
              </Grid> */}
              <Grid container mt={4} ml={3}>
                <Grid item xs={6}>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "dodgerblue",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Update product
                  </button>
                  &nbsp;&nbsp;&nbsp;
                  <button
                    onClick={() => {
                      dispatch(setisProductEdit({ active: false, currentId: "" }));
                    }}
                    style={{
                      backgroundColor: "dodgerblue",
                      color: "white",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
