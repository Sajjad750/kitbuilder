import React from 'react';
import { Button, Typography, Container, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../components/customButton/customButton';

const ThankYou = () => {

  const navigate = useNavigate()
  const backgroundImageURL = "https://res.cloudinary.com/da60naxj0/image/upload/v1692879203/userUploads/Group_252_voxrim.png";

  return (
      <Box
        sx={{
          backgroundImage: `url(${backgroundImageURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'auto', // To ensure content fits in 100vh
          padding: "5vh 5vh",
          boxSizing: 'border-box', // Include padding in height
          height: '100vh', // Set height to 100vh
          display:"flex",
          justifyContent:"center",
          alignItems:"center"
        }}
      >
        <Paper
          sx={{
            padding: 2,
            textAlign: 'center',
            color: 'text.primary',
            width:"80%",
            margin:"auto"
          }}
        >
          <Typography variant="h4" component="h2" >
            Thank you
          </Typography>
          <Typography variant="body1" component="p" sx={{ textAlign: "center" }}>
            We have received your quote request. Our team will contact you as soon as possible.
          </Typography>
          <CustomButton
            style={{ marginTop: "20px" }}
            className="nunito-b"
            backgroundColor="#960909"
            fontColor="white"
            hoverColor="white"
            hoverFontColor="#960909"
            borderRadius="30px"
            border="2px solid #960909"
            width={"185px"}
            height={"42px"}
            onClick={() => {
              navigate('/saveddesigns')
            }}
          >
            Go Back
          </CustomButton>
        </Paper>
      </Box>
  );
}

export default ThankYou;
