import React from 'react';
import CustomButton from '../../components/customButton/customButton';
import { Grid, Typography, Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';


const ContentContainer = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center', // This will make sure the content is centered vertically
    height: '100vh',  // Adjusted to full viewport height
});

const CustomImage = styled('img')({
    width: '150px',
    // marginBottom: '16px',
});

const backgroundImageLink = "https://res.cloudinary.com/da60naxj0/image/upload/v1692704621/userUploads/index_hdcvd0.png";
const shirtImageLink = "https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png";

const StartDesign = () => {
    const isUpTo670px = useMediaQuery('(max-width:670px)');
    const isUpTo400px = useMediaQuery('(max-width:400px)');
    const isUpTo290px = useMediaQuery('(max-width:290px)');

       // Retrieve the logo URL from the cookie
       const logoFromCookie = Cookies.get('retailerLogo');
       const logoToRender = logoFromCookie || shirtImageLink;

    return (
        <div>
            <Grid container sx={{
                backgroundImage: `url(${backgroundImageLink})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: 'cover',
                height: '100vh'
            }}>
                {/* Left Side */}
                <Grid item xs={isUpTo670px ? 12 : 6} container justify="center" sx={{
                    marginTop: "-55px", '@media (max-width:870px)': {
                        paddingLeft: '120px',
                    },
                    '@media (max-width:670px)': {
                        paddingLeft: '0px',
                        justifyContent: 'center',
                    },
                }} >
                    <ContentContainer sx={{ margin: "auto" }}>
                        <CustomImage sx={{ margin: isUpTo670px ? "0px auto 0px auto" : null,width:"100%",height:"auto",maxWidth:"80px" }} src={logoToRender} alt="Description" />
                        <Typography
                            sx={{
                                color: "white",
                                textAlign: isUpTo670px ? "center" : null,
                                marginTop:"20px",
                                fontSize: {
                                    xs: '24px',
                                    md: '30px',
                                    lg: '38px',
                                }
                            }}
                            className="nunito-b"
                            variant="h4"
                            gutterBottom>
                            Design Your Own Kit
                        </Typography>

                        <Typography
                            sx={{
                                width:isUpTo400px ? "95%" : null,
                                color: "white",
                                margin:isUpTo400px ? "5px auto 15px auto" : null,
                                textAlign: isUpTo670px ? "center" : null,
                                fontSize: {
                                    xs: '12px',
                                    md: '16px',
                                    lg: '18px',
                                }
                            }}
                            className='nunito-r'
                            variant="body1"
                            paragraph>
                            The most powerful and interactive Custom kit Designer
                        </Typography>
                        <Link  to="/askname">
                        <CustomButton
                            style={{ margin: isUpTo670px ? "0px auto 0px auto" : null }}
                            className="nunito-b"
                            backgroundColor="#960909"
                            fontColor="white"
                            hoverColor="white"
                            hoverFontColor="#960909"
                            borderRadius="30px"
                            border="2px solid #960909"
                            hoverBorder="2px solid #960909"
                            width={ isUpTo290px ? "230px" : isUpTo400px ? "280px" : "380px"}
                            height={ isUpTo290px ? "30px" : isUpTo400px ? "40px" : "50px"}
                            onClick={() => console.log('Button clicked!')}
                        >
                            Start Designing
                        </CustomButton>
                        </Link>
                    </ContentContainer>
                </Grid>

                {/* Right Side */}
                <Grid
                    item
                    xs={6}
                    sx={{
                        marginTop: "-55px",
                        '@media (max-width:670px)': {
                            display: 'none',
                        },
                    }}
                ></Grid>
            </Grid>
        </div>
    )
}

export default StartDesign;
