

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// KitBuilder Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

// React Hook Form
import { useForm } from "react-hook-form";
import axios from "axios";


function Cover() {
  const { register, handleSubmit, formState: { errors }} = useForm();
  const navigate = useNavigate();
  // Submit Data to Server

  const onSubmit = async(data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/admin", data);
      console.log(response.data);
      alert("Admin Registered Successfully")
      navigate("/authentication/sign-in");
    } catch (error) {
      alert(error.response.data)
      // console.error(error);
    }
}

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
            <MDBox mb={2}>
              <MDInput {...register("name", { required: true, maxLength: 20,minLength:2 })} type="text" label="Name" variant="standard" fullWidth />
            </MDBox>
              {errors.name && errors.name.type ? errors.name.type === "required" ? <p className="error-message">Name is Required</p> : errors.name.type === "maxLength" ? <p className="error-message">maxLength is 20 Characters only</p> : errors.name.type === "minLength" ? <p className="error-message">minLength is 2 Characters atleast</p> : "" : null}
            <MDBox mb={2}>
              <MDInput {...register("email", { required: true, maxLength: 20})} type="email" label="Email" variant="standard" fullWidth />
            </MDBox>
              {errors.email && errors.email.type ? errors.email.type === "required" ? <p className="error-message">Email is Required</p> : errors.email.type === "maxLength" ? <p className="error-message">maxLength is 20 Characters only</p> : errors.email.type === "minLength" ? <p className="error-message">minLength is 2 Characters atleast</p> : "" : null}
            <MDBox mb={2}>
              <MDInput {...register("password", { required: true, maxLength: 20,minLength:5 })} type="password" label="Password" variant="standard" fullWidth />
            </MDBox>
              {errors.password && errors.password.type ? errors.password.type === "required" ? <p className="error-message">Password is Required</p> : errors.password.type === "maxLength" ? <p className="error-message">maxLength is 20 Characters only</p> : errors.password.type === "minLength" ? <p className="error-message">minLength is 5 Characters atleast</p> : "" : null}
            <MDBox mb={2}>
              <MDInput {...register("password2", { required: true, maxLength: 20,minLength:5 })} type="password" label="Password" variant="standard" fullWidth />
            </MDBox>
              {errors.password2 && errors.password2.type ? errors.password2.type === "required" ? <p className="error-message">Password is Required</p> : errors.password2.type === "maxLength" ? <p className="error-message">maxLength is 20 Characters only</p> : errors.password2.type === "minLength" ? <p className="error-message">minLength is 5 Characters atleast</p> : "" : null}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            {/* <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" type="submit" color="info" fullWidth>
                Sign Up
              </MDButton>
            </MDBox> */}
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
