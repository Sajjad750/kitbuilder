import React, { useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import CustomStepper from "../../components/customStepper/CustomStepper";
import { Link } from "react-router-dom";
import ConfettiExplosion from "react-confetti-explosion";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import styled from "styled-components";

// component
import BlackOverlay from "../../components/templates/overlays/blackOverlay";
import ImageBackground from "../../components/templates/imagesComponent/ImageBackground";
import WhiteButton from "../../components/templates/button/WhiteButton";
import OutlinedButton from "../../components/templates/button/OutlinedButton";

const Container = styled.div`
  height: 100vh;
  position: relative;
  z-index: 0;
`;

const Wrapper = styled.div`
  width: 80%;
  margin: auto;
  padding: 5rem 0;
`;

const TextWrapper = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const ButtonBox = styled.div`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 2rem;
`;

const WelcomePage = () => {
  const backgroundImageURL =
    "https://res.cloudinary.com/da60naxj0/image/upload/v1692879203/userUploads/Group_252_voxrim.png";
  const steps = [
    // "Enter Brand Name & Choose Colors",
    // "Choose your kit",
    // "Design more kit & Order your personalized kit",
    "Brand Identity",
    "Kit Selection",
    "Design & Order",
  ];

  const [explode, setExplode] = useState(false);

  // Get selectedcolors array from Redux store
  const selectedcolors =
    useSelector((state) => state.userdata.selectedcolors) || [];
  const { name } = useSelector((state) => state.userdata);

  // Provide default values if any color is missing
  const defaultColors = ["#FF5733", "#33FF57", "#5733FF"];
  const confettiColors = selectedcolors.map(
    (color, index) => color || defaultColors[index]
  );

  // Set explode to true when the component mounts
  useEffect(() => {
    setExplode(true);
    // Reset after 5 seconds
    setTimeout(() => setExplode(false), 5000);
  }, []);

  return (
    <Container>
      <BlackOverlay />
      <ImageBackground imagePath={backgroundImageURL} />

      <Box>
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {explode && (
            <ConfettiExplosion
              force={0.9}
              duration={5000}
              particleCount={200}
              floorHeight={window.innerHeight + 200}
              colors={confettiColors}
            />
          )}
        </div>

        <Wrapper sx={{ maxWidth: "1440px", margin: "auto" }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={7}>
              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                alignItems="center"
                style={{ height: "50%" }}
              >
                <CustomStepper activeStep={0} steps={steps} />
              </Grid>

              <Grid
                container
                item
                xs={12}
                justifyContent="center"
                alignItems="center"
                // style={{ height: "50%" }}
              >
                <TextWrapper>
                  <Typography
                    className="nunito-b"
                    sx={{ fontSize: "32px", color: "white", mb: 2 }}
                  >
                    Hi Team {name ? name : ""}!
                  </Typography>
                  <Typography
                    className="nunito-r"
                    sx={{ fontSize: "18px", color: "white", mb: 2 }}
                  >
                    Welcome to your personalized kit designer
                  </Typography>
                  <Link to="/choosekit">
                    <WhiteButton>Choose Your Kit Here</WhiteButton>
                  </Link>
                </TextWrapper>
              </Grid>
              <ButtonBox>
                <Link to="/askname">
                  <OutlinedButton
                    handleClick={console.log("Previous button clicked!")}
                  >
                    Back
                  </OutlinedButton>
                </Link>

                <Link to="/choosekit">
                  <WhiteButton
                    handleClick={console.log("Previous button clicked!")}
                  >
                    Next
                  </WhiteButton>
                </Link>
              </ButtonBox>
            </Grid>
          </Grid>
        </Wrapper>
      </Box>
    </Container>
  );
};

export default WelcomePage;
