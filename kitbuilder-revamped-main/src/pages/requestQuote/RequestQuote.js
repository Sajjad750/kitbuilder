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
import ScrollToTop from '../../components/scrollTop/scrolltotop';
import { useForm } from "react-hook-form";
import { openModal } from '../../redux/Modal/modalSlice';
import { openLoader, closeLoader } from '../../redux/Loader/loaderSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { config } from '../../config'
import { Link, useNavigate } from 'react-router-dom';
import { Stack, useMediaQuery } from '@mui/material';
import Cookies from 'js-cookie';
import CustomButton from '../../components/customButton/customButton';


const theme = createTheme();

export default function Requestquote() {
    // const { register, handleSubmit, formState: { errors } } = useForm();
    const { register, handleSubmit, formState: { errors }, getValues, setError, clearErrors, watch } = useForm()

    const { designsData } = useSelector((state) => state.canvas)
    const { activeDesign, activeProducts } = useSelector((state) => state.userdata)
    const [isChecked, setisChecked] = useState(false)
    const dispatch = useDispatch();
    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate()
    // Watch the values of quantity, smallSize, mediumSize, and largeSize
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692704621/userUploads/index_hdcvd0.png";


    const handleChange = (event) => {
        setisChecked(event.target.checked);
    };


    function processCanvasData(frontCanvasDataJson, backCanvasDataJson) {
        let frontData = JSON.parse(frontCanvasDataJson);  // Convert the JSON string back into an object
        let backData = JSON.parse(backCanvasDataJson);
        let result = {
            front: {
                textObjects: [],
                imageObjects: [],
                svgObjects: []
            },
            back: {
                textObjects: [],
                imageObjects: [],
                svgObjects: []
            }
        };

        [frontData, backData].forEach((data, index) => {
            let side = index === 0 ? "front" : "back";
            data.objects.forEach((obj) => {
                if (obj.type === 'i-text' || obj.type === 'text') {
                    result[side].textObjects.push({
                        text: obj.text,
                        color: obj.fill,
                        fontFamily: obj.fontFamily
                    });
                } else if (obj.type === 'image') {
                    result[side].imageObjects.push({
                        src: obj.src
                    });
                } else if (obj.type === 'group') { // SVGs as group in fabric
                    let layerName = obj.id;  // Layer name
                    let svgObject = {
                        layerName: layerName,
                        paths: []
                    };
                    obj.objects.forEach(path => {
                        if (path.type === 'path') {
                            svgObject.paths.push({
                                color: path.fill,
                                id: path.id
                            });
                        }
                    });
                    result[side].svgObjects.push(svgObject);
                }
            });
        });

        return result;
    }


    // Base URL
    let URL = config.url.API_URL

    const onSubmit = async (data, e) => {
        console.log(data, "data");
        let encryptedRetId = JSON.parse(Cookies.get('retId'));
        if (!encryptedRetId) {
            alert("Please allow cookies for better experience of the application!")
            return;
        }

        // Create an array to store the combined product data
        const products = [];

        // Loop through the activeProducts array
        for (let index = 0; index < activeProducts.length; index++) {
            const productData = data.products[index];
            console.log(productData, "productData")
            // Check the sum of sizes for each product
            const totalSize = Number(productData.smallSize) + Number(productData.mediumSize) + Number(productData.largeSize);
            if (totalSize !== Number(productData.quantity)) {
                setError(`products[${index}].smallSize`, { type: "validate", message: "Sum of sizes must be equal to the total quantity" });
                setError(`products[${index}].mediumSize`, { type: "validate", message: "Sum of sizes must be equal to the total quantity" });
                setError(`products[${index}].largeSize`, { type: "validate", message: "Sum of sizes must be equal to the total quantity" });
                return;  // stop the onSubmit execution
            } else {
                clearErrors([`products[${index}].smallSize`, `products[${index}].mediumSize`, `products[${index}].largeSize`]);
            }

            // Process the canvas data for the product
            const processedCanvasData = processCanvasData(activeProducts[index].front.data, activeProducts[index].back.data);
            console.log(processedCanvasData,"processedCanvasData")
            const modifiedFront = {
                designPreview: activeProducts[index].front.designPreview,  // Assuming designPreview exists in activeProducts
                data: processedCanvasData.front
            };

            const modifiedBack = {
                designPreview: activeProducts[index].back.designPreview,  // Assuming designPreview exists in activeProducts
                data: processedCanvasData.front
            };

            // Combine the form data, processed canvas data, and the product's data
            const combinedData = {
                ...productData,
                front: modifiedFront,
                back: modifiedBack
            };
            products.push(combinedData);
        }

        // Destructure the data object to exclude individual fields
        const { smallSize, mediumSize, largeSize, quantity, ...otherData } = data;

        const requestData = {
            ...otherData,
            products,  // Include the products array in the requestData
            // ... other properties
        };
        console.log(requestData, "requestData")
        // Code for Server Request
        try {
            dispatch(openLoader(true))
            // const response = await axios.post(`${URL}/api/mails`, requestData);
            const response = await axios.post(`${URL}/api/mails`, requestData, {
                headers: { 'X-RetId': JSON.stringify(encryptedRetId) }
            });
            if (isChecked) { // Only make the request if isChecked is true
                try {
                    await axios.post(`${URL}/api/newsletter`, { email: requestData.email });
                } catch (subscribeError) {
                    // error happened, but we're not handling it or logging it
                }
            }
            if (response.status === 200) {
                // Store response data in cookie
                // Cookies.set('retId', JSON.stringify(response.data));
                // console.log(response, "This is response")
                dispatch(closeLoader());
                dispatch(openModal({ message: "Data Sent Successfully", variant: "success" }));
                e.target.reset();
                navigate('/thankyou')
            } else {
                dispatch(closeLoader());
                console.log(response)
                throw new Error(`Server responded with status code ${response.status}`);
            }
        } catch (error) {
            dispatch(closeLoader());
            console.log(error)
            let errorMessage = error.response?.data?.message || error.message;
            dispatch(openModal({ message: errorMessage, variant: "error" }));
        }
    }
    console.log(activeProducts, "activeProducts")
    console.log(activeDesign, "activeDesign")


    return (
        <ThemeProvider theme={theme}>
            <Box component="main"
                sx={{
                    backgroundImage: `url(${backgroundImageURL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    overflow: 'auto', // To ensure content fits in 100vh
                    padding: "5vh 5vh",
                    boxSizing: 'border-box', // Include padding in height
                    height: '100vh' // Set height to 100vh
                }}
            >
                {/* <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
                        {
                            activeDesign && <img style={{ width: "100%", maxWidth: "300px", height: "auto" }} src={activeDesign['front'].designPreview} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
                        {
                            activeDesign && <img style={{ width: "100%", maxWidth: "300px", height: "auto" }} src={activeDesign['back'].designPreview} />
                        }
                    </Grid>
                </Grid> */}

                <CssBaseline />
                <ScrollToTop />
                <Box
                    sx={{
                        marginTop: 8,
                        marginBottom: 8,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography className='nunito-b wc' sx={{ textAlign: "left" }} component="h1" variant="h5">
                        Request a Quote
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("firstName", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    error={errors.firstName ? true : false}
                                    helperText={
                                        errors.firstName && errors.firstName.type === "required" && "First Name is required" ||
                                        errors.firstName && errors.firstName.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.firstName && errors.firstName.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("lastName", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    error={errors.lastName ? true : false}
                                    helperText={
                                        errors.lastName && errors.lastName.type === "required" && "Last Name is required" ||
                                        errors.lastName && errors.lastName.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.lastName && errors.lastName.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("companyName", { minLength: 3, maxLength: 200 })}
                                    name="companyName"
                                    fullWidth
                                    id="companyName"
                                    label="Company Name"
                                    error={errors.companyName ? true : false}
                                    helperText={
                                        errors.companyName && errors.companyName.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.companyName && errors.companyName.type === "maxLength" && "Maximum length is 200 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("countryName", { required: true, maxLength: 30, minLength: 3 })}
                                    id="countryName"
                                    fullWidth
                                    label="Country/Region"
                                    error={errors.countryName ? true : false}
                                    helperText={
                                        errors.countryName && errors.countryName.type === "required" && "Country Name is required" ||
                                        errors.countryName && errors.countryName.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.countryName && errors.countryName.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("streetAddress", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    id="streetAddress"
                                    label="Street Address"
                                    error={errors.streetAddress ? true : false}
                                    helperText={
                                        errors.streetAddress && errors.streetAddress.type === "required" && "Street Address is required" ||
                                        errors.streetAddress && errors.streetAddress.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.streetAddress && errors.streetAddress.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("apartmentName")}
                                    name="apartmentName"
                                    fullWidth
                                    id="apartmentName"
                                    label="Apartment/Unit"
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("cityName", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    id="cityName"
                                    label="Town/City"
                                    error={errors.cityName ? true : false}
                                    helperText={
                                        errors.cityName && errors.cityName.type === "required" && "City/Town Name is required" ||
                                        errors.cityName && errors.cityName.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.cityName && errors.cityName.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("regionName", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    id="regionName"
                                    label="State/Country"
                                    error={errors.regionName ? true : false}
                                    helperText={
                                        errors.regionName && errors.regionName.type === "required" && "Region Name is required" ||
                                        errors.regionName && errors.regionName.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.regionName && errors.regionName.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("postalCode", { required: true, maxLength: 30, minLength: 3 })}
                                    fullWidth
                                    id="postalCode"
                                    label="Postal Code"
                                    error={errors.postalCode ? true : false}
                                    helperText={
                                        errors.postalCode && errors.postalCode.type === "required" && "Postal Code is required" ||
                                        errors.postalCode && errors.postalCode.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.postalCode && errors.postalCode.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    {...register("phoneNumber", { required: true, maxLength: 30, minLength: 3 })}
                                    type={"number"}
                                    fullWidth
                                    id="phoneNumber"
                                    label="Phone Number"
                                    error={errors.phoneNumber ? true : false}
                                    helperText={
                                        errors.phoneNumber && errors.phoneNumber.type === "required" && "Phone Number is required" ||
                                        errors.phoneNumber && errors.phoneNumber.type === "minLength" && "Minimum length is 3 characters" ||
                                        errors.phoneNumber && errors.phoneNumber.type === "maxLength" && "Maximum length is 30 characters"
                                    }
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    type="email"
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    error={Boolean(errors.email)}
                                    helperText={errors.email && errors.email.message}
                                    className="nunito-r"
                                    sx={{
                                        '& label.Mui-focused': {
                                            color: 'white',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'white',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                        '& .MuiFormLabel-root': {
                                            color: 'white',
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid container justifyContent={"center"} spacing={4} sx={{ margin: "auto" }}>
                                {
                                    // Check if activeProducts exists and is not empty
                                    activeProducts && activeProducts.length > 0 ? activeProducts.map((value, index) => (
                                        <React.Fragment key={index}>
                                            <Grid container item>
                                                <Grid item xs={12} md={6}>
                                                    <img src={value.front.designPreview} style={{ width: "100%", height: "auto", maxWidth: "100px" }} />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <img src={value.back.designPreview} style={{ width: "100%", height: "auto", maxWidth: "100px" }} />
                                                </Grid>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography variant="h5" sx={{ color: "white" }}>Sizes and Quantity</Typography>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    {...register(`products[${index}].quantity`, { required: "Quantity is required", min: { value: 1, message: "Quantity must be greater than 0" } })}
                                                    type={"number"}
                                                    fullWidth
                                                    id={`quantity-${index}`}
                                                    label="Product Quantity"
                                                    error={!!errors?.products?.[index]?.quantity}
                                                    helperText={errors?.products?.[index]?.quantity?.message}
                                                    className="nunito-r"
                                                    sx={{
                                                        '& label.Mui-focused': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomColor: 'white',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiFormLabel-root': {
                                                            color: 'white',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    {...register(`products[${index}].smallSize`, { required: true, min: 0 })}
                                                    type={"number"}
                                                    fullWidth
                                                    id={`smallSize-${index}`}
                                                    label="Small Size Quantity"
                                                    error={!!errors?.products?.[index]?.smallSize}
                                                    helperText={errors?.products?.[index]?.smallSize?.message}
                                                    className="nunito-r"
                                                    sx={{
                                                        '& label.Mui-focused': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomColor: 'white',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiFormLabel-root': {
                                                            color: 'white',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    {...register(`products[${index}].mediumSize`, { required: true, min: 0 })}
                                                    type={"number"}
                                                    fullWidth
                                                    id={`mediumSize-${index}`}
                                                    label="Medium Size Quantity"
                                                    error={!!errors?.products?.[index]?.mediumSize}
                                                    helperText={errors?.products?.[index]?.mediumSize?.message}
                                                    className="nunito-r"
                                                    sx={{
                                                        '& label.Mui-focused': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomColor: 'white',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiFormLabel-root': {
                                                            color: 'white',
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    {...register(`products[${index}].largeSize`, { required: true, min: 0 })}
                                                    type={"number"}
                                                    fullWidth
                                                    id={`largeSize-${index}`}
                                                    label="Large Size Quantity"
                                                    error={!!errors?.products?.[index]?.largeSize}
                                                    helperText={errors?.products?.[index]?.largeSize?.message}
                                                    className="nunito-r"
                                                    sx={{
                                                        '& label.Mui-focused': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottomColor: 'white',
                                                        },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&:hover fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                borderColor: 'white',
                                                            },
                                                        },
                                                        '& .MuiInputBase-input': {
                                                            color: 'white',
                                                        },
                                                        '& .MuiFormLabel-root': {
                                                            color: 'white',
                                                        }
                                                    }}
                                                />
                                            </Grid>

                                            {/* ... rest of your Grid items for TextFields ... */}
                                        </React.Fragment>
                                    )) : (
                                        // Render something if activeProducts is empty or undefined
                                        <Grid item xs={12}>
                                            <Typography variant="h6" sx={{ color: "white" }}>No active products available.</Typography>
                                        </Grid>
                                    )
                                }
                            </Grid>

                            {/* 
                            <Grid container spacing={4} sx={{ margin: "auto" }}>

                                <Grid container item>
                                    <Grid item xs={12} md={6}>
                                        <img src={value.linkfront} style={{ width: "100%", height: "auto", maxWidth: "100px" }} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <img src={value.linkback} style={{ width: "100%", height: "auto", maxWidth: "100px" }} />
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ color: "white" }}>Sizes and Quantity</Typography>
                                </Grid>
                            </Grid> */}

                            <Grid item xs={12}>
                                <FormControlLabel
                                    className='wc'
                                    control={
                                        <Checkbox
                                            checked={isChecked}
                                            onChange={handleChange}
                                            color="primary"
                                            className='wc'
                                        />
                                    }
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Stack sx={{ marginTop: "30px" }} direction={isSmallScreen ? 'column' : 'row'} spacing={2} alignItems={isSmallScreen ? 'center' : 'flex-start'}>
                            <CustomButton
                                onClick={() => {
                                    navigate('/saveddesigns')
                                }}
                                className="nunito-b"
                                type="submit"
                                fullWidth={isSmallScreen}
                                variant="contained"
                                backgroundColor="#960909"
                                fontColor="white"
                                hoverColor="white"
                                hoverFontColor="#960909"
                                borderRadius="30px"
                                border="2px solid #960909"
                                width={isSmallScreen ? '100%' : 'auto'}
                                height="40px"
                            >
                                Back
                            </CustomButton>

                            <CustomButton
                                className="nunito-b"
                                type="submit"
                                fullWidth={isSmallScreen}
                                variant="contained"
                                backgroundColor="#960909"
                                fontColor="white"
                                hoverColor="white"
                                hoverFontColor="#960909"
                                borderRadius="30px"
                                border="2px solid #960909"
                                width={isSmallScreen ? '100%' : 'auto'}
                                height="40px"
                            >
                                Request a Quote
                            </CustomButton>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}