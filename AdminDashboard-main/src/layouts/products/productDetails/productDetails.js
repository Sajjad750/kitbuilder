import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import "./productDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { setactiveProduct } from "features/productsData/productsSlice";
import { useState } from "react";
import { ReactSVG } from "react-svg";
import DynamicSelect from "layouts/addCategories/DynamicSelect";
const ProductDetailsPage = () => {
  const dispatch = useDispatch();
  const { activeProduct } = useSelector((state) => state.products);
  const [view, setview] = useState(true);
  console.log(activeProduct, "this is blah");

  return (
    <>
      <Box
        mt={3}
        mb={3}
        ml={6}
        sx={{ padding: "10px", width: "100%", borderRadius: "10px", boxShadow: "2px 2px 2px 2px" }}
      >
        <Grid container>
          <Grid item xs={6} sx={{ padding: "10px" }}>
            <Typography className="mfeb" sx={{ textAlign: "left" }} component="h1" variant="h5">
              View Product Details
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ padding: "10px", textAlign: "right" }}>
              <CancelIcon
                onClick={() => dispatch(setactiveProduct([]))}
                sx={{ color: "#3891EE", cursor: "pointer" }}
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} mt={3}>
              <TextField
                value={activeProduct[0].name}
                disabled
                type="text"
                id="product-name"
                label="Product Name"
                variant="outlined"
                fullWidth
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                disabled
                type="text"
                id="category"
                label="Category"
                variant="outlined"
                fullWidth
              />
            </Grid> */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">
                List Image:
              </Typography>
              <Box>
                {activeProduct[0].productImage ? (
                  <img
                    src={activeProduct[0].productImage}
                    style={{ width: "50px", height: "50px", marginTop: "6px", borderRadius: "6px" }}
                  />
                ) : (
                  "Loading..."
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">
                Front SVG:
              </Typography>
              <Box>
                {activeProduct[0].linkfront ? (
                  <img
                    src={activeProduct[0].linkfront}
                    style={{ width: "50px", height: "50px", marginTop: "6px", borderRadius: "6px" }}
                  />
                ) : (
                  "Loading..."
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography sx={{ display: "inline", fontWeight: "light" }} variant="h6">
                Back SVG:
              </Typography>
              <Box>
                {activeProduct[0].linkback ? (
                  <img
                    src={activeProduct[0].linkback}
                    style={{ width: "50px", height: "50px", marginTop: "6px", borderRadius: "6px" }}
                  />
                ) : (
                  "Loading..."
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={12}>
              <FormControlLabel
                control={<Checkbox checked={activeProduct[0].isActive} />}
                label="Active"
              />
            </Grid>
            <Grid container mt={4} ml={3}>
              <Grid item xs={6}>
                <button
                  onClick={() => dispatch(setactiveProduct([]))}
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
        </Grid>
      </Box>
    </>
  );
};

export default ProductDetailsPage;
