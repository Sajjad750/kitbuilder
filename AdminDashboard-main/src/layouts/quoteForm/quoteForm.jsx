import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

const defaultTheme = createTheme();

export default function AddRetailerForm() {
  const [logoUrl, setLogoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formloading, setformLoading] = useState(false);
  const { register, handleSubmit, control, setError, clearErrors, formState: { errors } } = useForm();
  const [message, setMessage] = useState(null);

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     fullName: data.get('fullName'),
  //     logo: logoUrl
  //   });
  // };

  const handleFileInputChange = async (event) => {
    if (event.target.files[0] && event.target.files[0].type.startsWith("image/")) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', event.target.files[0]);
      formData.append('upload_preset', 'vcmakbux');
      formData.append('folder', 'userUploads');
      try {
        const res = await axios.post('https://api.cloudinary.com/v1_1/da60naxj0/image/upload', formData);
        setLogoUrl(res.data.secure_url);
        clearErrors("logo");
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    event.target.value = null;
  };

  const onSubmit = async (data) => {
    if (!logoUrl) {
      setError("logo", {
        type: "manual",
        message: "Please upload a logo"
      });
      return;
    }

    setformLoading(true);
    setMessage(null);

    try {
      const response = await axios.post('http://localhost:5000/api/retailers/getretailerquote', {
        ...data,
        logo: logoUrl
      });

      if (response.status === 200) {
        setMessage("Form submitted successfully!");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setMessage(error.response?.data || "An error occurred while submitting the form.");
    } finally {
      setformLoading(false);
    }
  };





  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Get a Quote
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  {...register("name", { required: "Full Name is required" })}
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />

              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  fullWidth
                  id="email"
                  label="Email Address"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  {...register("domains", {
                    required: "Domain is required",
                    pattern: {
                      value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
                      message: "Invalid domain format"
                    }
                  })}
                  type="text"
                  id="domains"
                  label="Domain"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.domains)}
                  helperText={errors.domains?.message}
                />

              </Grid>

              <Grid item xs={12}>
                <TextField
                  {...register("phone", {
                    required: "phone is required"
                  })}
                  type="number"
                  id="phone"
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  error={Boolean(errors.phone)}
                  helperText={errors.phone && errors.phone.message}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                >
                  Upload Your platform Logo
                  <input
                    type="file"
                    hidden
                    onChange={handleFileInputChange}
                  />
                </Button>
                {loading && <Typography sx={{ color: "dodgerblue" }} variant="body2">Uploading...</Typography>}
                {
                  logoUrl && !loading && <Typography sx={{ color: "dodgerblue" }} variant="body2">Logo uploaded successfully!</Typography>
                }
                {errors.logo && <Typography variant="body2" color="error">{errors.logo.message}</Typography>}
                {logoUrl && (
                  <>
                    <img src={logoUrl} alt="Uploaded Logo" style={{ width: '100%', maxWidth: "100px", height: "auto", marginTop: '10px' }} />
                  </>
                )}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Get a Quote
            </Button>

            {formloading && <Typography sx={{ color: "dodgerblue" }} variant="body2">Submitting Form...</Typography>}
            {message && !formloading && <Typography sx={{ color: "dodgerblue" }} variant="body2">{message}</Typography>}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}