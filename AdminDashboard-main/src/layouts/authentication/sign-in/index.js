import { useEffect, useState } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { Box } from "@mui/system";
// React Hook Form
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setisAuthenticated } from "features/adminData/adminSlice";
import {config} from '../../../config'
import { openModal } from "features/Modal/modalSlice";
import { authAdmin } from "features/adminData/adminSlice";
import { seterrornull } from "features/adminData/adminSlice";


function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  // const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const { register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  const {isAuthenticated,error} = useSelector(state => state.admin)
  const URL = config.url.API_URL;
  const dispatch = useDispatch()

  const onSubmit = (data) => {
    try{
      dispatch(authAdmin(data))
    }catch(error){
      console.log(error)
    }
  }


  useEffect(() => {
    if (error) {
      alert("Error: " + "Invalid Username / Password");
      // alert("Error: " + error);
      dispatch(seterrornull())
    } else if (isAuthenticated) {
      navigate("/");
      dispatch(seterrornull())
    }
  }, [error, isAuthenticated]);

  useEffect(() => {
  
    return () => {
      dispatch(seterrornull())
    }
  }, [third])
  
  


  return (
    <Box>
    <BasicLayout image={bgImage} >
      <Card >
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
          style={{paddingBottom:"30px"}}
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={2}>
            Sign in
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <MDInput {...register("email", { required: true })} type="email" label="Email" fullWidth />
            </MDBox>
            <MDBox mb={2}>
              <MDInput {...register("password", { required: true })} type="password" label="Password" fullWidth />
            </MDBox>
              {/*  onClick={handleSetRememberMe} */}
            {/* onChange={handleSetRememberMe} */}

            {/* <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe}  />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox> */}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" type="submit" color="info" fullWidth>
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
    </Box>
  );
}

export default Basic;
