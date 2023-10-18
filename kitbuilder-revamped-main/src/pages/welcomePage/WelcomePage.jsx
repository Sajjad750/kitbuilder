import React, { useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import CustomButton from '../../components/customButton/customButton';
import CustomStepper from '../../components/customStepper/CustomStepper';
import { Link } from 'react-router-dom';
import ConfettiExplosion from 'react-confetti-explosion';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const WelcomePage = () => {
    const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692879203/userUploads/Group_252_voxrim.png";
    const steps = ['Enter Brand Name & Choose Colors', 'Choose your kit', 'Design more kit & Order your personalized kit'];

    const [explode, setExplode] = useState(false);

    // Get selectedcolors array from Redux store
    const selectedcolors = useSelector((state) => state.userdata.selectedcolors) || [];
    const {name} = useSelector((state) => state.userdata);

    // Provide default values if any color is missing
    const defaultColors = ["#FF5733", "#33FF57", "#5733FF"];
    const confettiColors = selectedcolors.map((color, index) => color || defaultColors[index]);

    // Set explode to true when the component mounts
    useEffect(() => {
        setExplode(true);
        // Reset after 5 seconds
        setTimeout(() => setExplode(false), 5000);
    }, []);


    return (
        <Box
            sx={{
                height: '100vh',
                backgroundImage: `url(${backgroundImageURL})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                overflow: 'auto', // Set overflow to hidden to ensure content fits in 100vh
            }}
        >
            <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {explode && <ConfettiExplosion force={0.9} duration={5000} particleCount={200} floorHeight={window.innerHeight + 200} colors={confettiColors} />}
            </div>
            <Box sx={{ maxWidth: "1440px", margin: 'auto' }}>
                <Grid container >
                    <Grid item xs={12} md={6}>
                        <Grid container item xs={12} justifyContent="center" alignItems="center" style={{ height: '50%', marginTop: "10%" }}>
                            <CustomStepper activeStep={0} steps={steps} />
                        </Grid>

                        <Grid container item xs={12} justifyContent="center" alignItems="center" style={{ height: '50%' }}>
                            <Box display="flex" flexDirection="column" width="80%" height="100%">
                                <Box mb={2} flexGrow={1} display="flex" flexDirection="column" justifyContent="center">
                                    <Typography className='nunito-b' sx={{ fontSize: "32px", color: "white", mb: 2 }}>
                                        Hi Team {name ? name : ""}!
                                    </Typography>
                                    <Typography className='nunito-r' sx={{ fontSize: "18px", color: "white", mb: 2 }}>
                                        Welcome to your personalized kit designer
                                    </Typography>
                                <Link to="/choosekit">
                                    <CustomButton
                                        className="nunito-b"
                                        backgroundColor="#960909"
                                        fontColor="white"
                                        hoverColor="white"
                                        hoverFontColor="#960909"
                                        borderRadius="30px"
                                        border="2px solid #960909"
                                        width="260px"
                                        height="50px"
                                    >
                                        Choose Your Kit Here
                                    </CustomButton>
                                </Link>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ width: "80%", margin: { xs: "15vh auto 20px auto", md: "25vh auto 20px auto" } }}>
                        <Grid container item xs={12} sm={12} md={12} direction={{ xs: 'column', sm: 'column', md: 'row' }} justifyContent={{ xs: 'center', sm: 'center', md: 'space-between' }} alignItems="center">
                            <Grid item xs={12} sm={6} md="auto" sx={{ marginBottom: { xs: "10px", sm: "10px", md: "0px" } }}>
                                <Link to="/askname">
                                    <CustomButton
                                        className="nunito-b"
                                        backgroundColor="#960909"
                                        fontColor="white"
                                        hoverColor="white"
                                        hoverFontColor="#960909"
                                        borderRadius="30px"
                                        border="2px solid #960909"
                                        width="150px"
                                        height="50px"
                                        onClick={() => console.log('Previous button clicked!')}
                                    >
                                        Previous
                                    </CustomButton>
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={6} md="auto">
                                <Link to="/choosekit">
                                    <CustomButton
                                        className="nunito-b"
                                        backgroundColor="#960909"
                                        fontColor="white"
                                        hoverColor="white"
                                        hoverFontColor="#960909"
                                        borderRadius="30px"
                                        border="2px solid #960909"
                                        width="150px"
                                        height="50px"
                                        onClick={() => console.log('Next button clicked!')}
                                    >
                                        Next
                                    </CustomButton>
                                </Link>
                            </Grid>
                        </Grid>

                    </Box>
                </Grid>
            </Box>
        </Box>
    );
}

export default WelcomePage;
