import React from "react";
import CustomButton from "../../components/customButton/customButton";
import { Grid, Typography, useMediaQuery } from "@mui/material";
// import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import styled from "styled-components";

const Container = styled.div`
  height: 100vh;
  position: relative;
  z-index: 0;
`;

const Overlay = styled.div`
  background-color: #00000040;
  position: absolute;
  z-index: -1;
  width: 50%;
  height: 100%;
  object-fit: cover;
  border-radius: 0 20% 20% 0;
  filter: blur(40px);

  @media (max-width: 600px) {
    display: none;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: center;
  height: 100vh;
  width: 80%;
  margin: auto;
`;

const CustomImage = styled.img`
  width: 150px;

  @media (max-width: 600px) {
    margin: 0 auto;
  }
`;

const ImageBg = styled.img`
  position: absolute;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonBox = styled.div`
  margin-top: 2rem;
`;

const backgroundImageLink =
  "https://res.cloudinary.com/da60naxj0/image/upload/v1692704621/userUploads/index_hdcvd0.png";
const shirtImageLink =
  "https://res.cloudinary.com/da60naxj0/image/upload/v1692692781/userUploads/shirt_bghrtj.png";

const StartDesign = () => {
  const isUpTo670px = useMediaQuery("(max-width:670px)");
  const isUpTo400px = useMediaQuery("(max-width:400px)");
  const isUpTo290px = useMediaQuery("(max-width:290px)");

  // Retrieve the logo URL from the cookie
  const logoFromCookie = Cookies.get("retailerLogo");
  const logoToRender = logoFromCookie || shirtImageLink;

  return (
    <div>
      <Container>
        <Overlay />
        <ImageBg
          src={backgroundImageLink}
          loading="lazy"
          width="auto"
          height="auto"
        />
        <Grid container>
          {/* Left Side */}
          <Grid
            item
            xs={isUpTo670px ? 12 : 6}
            container
            justify="center"
            sx={{
              marginTop: "-55px",
              "@media (max-width:870px)": {
                paddingLeft: "120px",
              },
              "@media (max-width:670px)": {
                paddingLeft: "0px",
                justifyContent: "center",
              },
            }}
          >
            <ContentContainer>
              <CustomImage
                src={logoToRender}
                alt="Description"
                loading="lazy"
                width="auto"
                height="auto"
              />
              <Typography
                sx={{
                  color: "white",
                  textAlign: isUpTo670px ? "center" : null,
                  fontWeight: "900",
                  fontSize: {
                    xs: "24px",
                    md: "30px",
                    lg: "46px",
                  },
                }}
                className="nunito-b"
                variant="h4"
                gutterBottom
              >
                Design Your Own Kit
              </Typography>

              <Typography
                sx={{
                  width: isUpTo400px ? "95%" : null,
                  color: "white",
                  margin: isUpTo400px ? "5px auto 15px auto" : null,
                  textAlign: isUpTo670px ? "center" : null,
                  fontSize: {
                    xs: "12px",
                    md: "16px",
                    lg: "22px",
                  },
                }}
                className="nunito-r"
                variant="body1"
                paragraph
              >
                The most powerful and interactive Custom kit Designer
              </Typography>

              <ButtonBox>
                <Link to="/askname">
                  <CustomButton
                    style={{ margin: isUpTo670px ? "0px auto 0px auto" : null }}
                    className="nunito-b"
                    backgroundColor="#960909"
                    fontColor="white"
                    hoverColor="white"
                    hoverFontColor="#960909"
                    borderRadius=".4rem"
                    border="2px solid #960909"
                    hoverBorder="2px solid #960909"
                    width={
                      isUpTo290px ? "230px" : isUpTo400px ? "280px" : "380px"
                    }
                    height={
                      isUpTo290px ? "30px" : isUpTo400px ? "40px" : "50px"
                    }
                    onClick={() => console.log("Button clicked!")}
                  >
                    Start Designing
                  </CustomButton>
                </Link>
              </ButtonBox>
            </ContentContainer>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default StartDesign;
