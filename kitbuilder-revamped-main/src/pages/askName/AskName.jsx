import React, { useState } from 'react';
import { Grid, Box, useMediaQuery, TextField, Typography } from '@mui/material';
import CustomButton from '../../components/customButton/customButton';
import CustomStepper from '../../components/customStepper/CustomStepper';
import CustomAccordion from '../../components/customAccordion/CustomAccordion';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { setName, setSelected } from '../../redux/userData/userdataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../../redux/Modal/modalSlice';

const AskName = () => {
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692776472/userUploads/Group_251_m6ecex.png"; // Replace with your image URL

    const isUpTo670px = useMediaQuery('(max-width:670px)');

    // const [activeStep, setActiveStep] = useState(0); 
    const steps = ['Enter Brand Name & Choose Colors', 'Choose your kit', 'Design more kit & Order your personalized kit']; // Define your steps here
    const [expandedAccordion, setExpandedAccordion] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedcolors } = useSelector((state) => state.userdata);


    const onSubmit = (data) => {
        const colorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/; // Regular expression to validate hex color codes
        // Check if all colors are selected and are valid color codes
        if (selectedcolors.length === 3 && selectedcolors.every(color => color && colorPattern.test(color))) {
            dispatch(setName(data.askName));
            navigate('/welcome');
        } else {
            // Show customized snackbar with a specified message
            dispatch(openModal({ message: "Please select all color variants", variant: "error" }));
        }
    }
    
    

    return (
        <Box
            sx={{
                minHeight: '100vh', // Ensures the container at least occupies the full viewport height.
                backgroundImage: `url(${backgroundImageURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'visible', // Allows scrolling if content overflows.
                paddingBottom: '10%'
            }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>

                <Box sx={{ maxWidth: "1440px", margin: 'auto' }}>
                    <Grid container >
                        {/* Left Section */}
                        <Grid item xs={12} md={6}>
                            {/* Top Subsection */}
                            <Grid container item xs={12} justifyContent="center" alignItems="center" style={{ height: '50%' }}>
                                <CustomStepper activeStep={0} steps={steps} />
                            </Grid>

                            {/* Bottom Subsection */}
                            <Grid container item xs={12} justifyContent="center" alignItems="center" style={{ height: '50%' }}>

                                {/* This Box now acts as a flex container */}
                                <Box display="flex" flexDirection="column" width="80%" height="100%">

                                    <Box mb={2} flexGrow={1} display="flex" flexDirection="column" justifyContent="center"> {/* flexGrow allows this Box to expand */}
                                        <Typography className='nunito-b' sx={{ fontSize: "26px", color: "white", mb: 2 }}>
                                            Enter Your Brand Name & Choose Colors
                                        </Typography>
                                        <Box sx={{ width: "100%" }}> {/* Wrap the TextField to maintain background */}
                                            <Typography className='nunito-b' sx={{ fontSize: "18px", color: "white" }}>
                                                Enter your Club or Team Name
                                            </Typography>
                                            <TextField
                                                {...register("askName", { required: true, maxLength: 30 })}
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Enter your Club or Team Name...."
                                                error={Boolean(errors.askName)} // This will render the error state if there's an error
                                                helperText={errors.askName && (errors.askName.type === "required" ? "Company-Name is Required" : "Max length is 30 characters")} // This will display the error message
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: '10px',
                                                        backgroundColor: 'white',
                                                        width: "100%"
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: 'transparent',
                                                    },
                                                    '& .MuiInputBase-input': {  // Targeting the input text
                                                        fontFamily: 'nunito',  // Replace with your specific font family
                                                        fontWeight: 700,
                                                    },
                                                    '& .MuiInputBase-input::placeholder': {  // Targeting the placeholder
                                                        fontFamily: 'nunito',
                                                        fontWeight: 700
                                                    },
                                                    mt: 2
                                                }}
                                            />

                                        </Box>
                                    </Box>

                                    {/* The CustomAccordion components */}
                                    <Typography className='nunito-b' sx={{ fontSize: "18px", color: "white" }}>
                                        Choose the Brand Colors for your Personalized Kit Designer
                                    </Typography>
                                    <CustomAccordion
                                        heading="Primary Color"
                                        colorType="Primary"
                                        isExpanded={expandedAccordion === "Primary Color"}
                                        onChange={() => setExpandedAccordion(expandedAccordion !== "Primary Color" ? "Primary Color" : null)}
                                    />
                                    <CustomAccordion
                                        sx={{ mt: 2 }}
                                        heading="Secondary Color A"
                                        colorType="Secondary A"
                                        isExpanded={expandedAccordion === "Secondary Color A"}
                                        onChange={() => setExpandedAccordion(expandedAccordion !== "Secondary Color A" ? "Secondary Color A" : null)}
                                    />
                                    <CustomAccordion
                                        sx={{ mt: 2 }}
                                        heading="Secondary Color B"
                                        colorType="Secondary B"
                                        isExpanded={expandedAccordion === "Secondary Color B"}
                                        onChange={() => setExpandedAccordion(expandedAccordion !== "Secondary Color B" ? "Secondary Color B" : null)}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Right Section */}
                        <Grid container item xs={12} md={6} justifyContent="flex-end" sx={{ height: { xs: "0vh", md: "0vh" }, paddingRight: { xs: "0%", md: "10%" } }} alignItems="flex-end">
                        </Grid>

                        <Grid container item xs={12} sx={{ height: "50vh", paddingRight: { xs: "0px", md: "10%" }, justifyContent: { xs: "center", md: "flex-end" } }} alignItems="flex-end">
                            <CustomButton
                                style={{ margin: isUpTo670px ? "0px auto 0px auto" : null }}
                                className="nunito-b"
                                backgroundColor="#960909"
                                fontColor="white"
                                hoverColor="white"
                                hoverFontColor="#960909"
                                border="2px solid #960909"
                                fontFamily="Times New Roman"
                                borderRadius="30px"
                                width="150px"
                                height="50px"
                                type="submit"
                                // width={ isUpTo290px ? "230px" : isUpTo400px ? "280px" : "380px"}
                                // height={ isUpTo290px ? "30px" : isUpTo400px ? "40px" : "50px"}
                                onClick={() => console.log('Button clicked!')}
                            >
                                Next
                            </CustomButton>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </Box>
    );
}

export default AskName;
