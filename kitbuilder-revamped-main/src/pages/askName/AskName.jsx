import React, { useState } from "react";
import { Grid, Box, useMediaQuery, TextField, Typography } from "@mui/material";
// import CustomButton from "../../components/customButton/customButton";
import CustomStepper from "../../components/customStepper/CustomStepper";
import CustomAccordion from "../../components/customAccordion/CustomAccordion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setName, setSelected } from "../../redux/userData/userdataSlice";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../redux/Modal/modalSlice";
import styled from "styled-components";

// component
import BlackOverlay from "../../components/templates/overlays/blackOverlay";
import WhiteButton from "../../components/templates/button/WhiteButton";

// styles
const Container = styled.div`
  position: relative;
  z-index: 0;
  overflow: hidden;
`;

const Wrapper = styled.div`
  width: 80%;
  margin: auto;
  padding: 5rem 0;
`;

const ImageBg = styled.img`
  position: absolute;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FormContainer = styled.div`
  margin-top: 4rem;
`;

const TeamNameWrapper = styled.div`
  margin: 2rem 0;
`;

const AccordionBox = styled.div`
  padding: 0.5rem 0;
`;

const ButtonBox = styled.div`
  margin-top: 2rem;
`;

const AskName = () => {
  const backgroundImageURL =
    "https://res.cloudinary.com/da60naxj0/image/upload/v1692776472/userUploads/Group_251_m6ecex.png"; // Replace with your image URL

  // const isUpTo670px = useMediaQuery("(max-width:670px)");

  // const [activeStep, setActiveStep] = useState(0);
  const steps = [
    // "Enter Brand Name & Choose Colors",
    // "Choose your kit",
    // "Design more kit & Order your personalized kit",
    "Brand Identity",
    "Kit Selection",
    "Design & Order",
  ]; // Define your steps here
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedcolors } = useSelector((state) => state.userdata);

  const onSubmit = (data) => {
    const colorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/; // Regular expression to validate hex color codes
    // Check if all colors are selected and are valid color codes
    if (
      selectedcolors.length === 3 &&
      selectedcolors.every((color) => color && colorPattern.test(color))
    ) {
      dispatch(setName(data.askName));
      navigate("/welcome");
    } else {
      // Show customized snackbar with a specified message
      dispatch(
        openModal({
          message: "Please select all color variants",
          variant: "error",
        })
      );
    }
  };

  return (
    <Container>
      <BlackOverlay />
      <ImageBg
        src={backgroundImageURL}
        loading="lazy"
        width="auto"
        height="auto"
      />

      <Wrapper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ maxWidth: "1440px", margin: "auto" }}>
            <Grid container justifyContent="center">
              {/* Left Section */}
              <Grid item xs={12} md={7}>
                {/* Top Subsection */}
                <Grid
                  container
                  item
                  xs={12}
                  justifyContent="center"
                  alignItems="center"
                  // style={{ height: "50%" }}
                >
                  <CustomStepper activeStep={0} steps={steps} />
                </Grid>

                {/* Bottom Subsection */}
                <FormContainer>
                  <Grid
                    container
                    item
                    xs={12}
                    justifyContent="center"
                    alignItems="center"
                    // style={{ height: "50%" }}
                  >
                    <Typography
                      className="nunito-b"
                      sx={{ fontSize: "30px", color: "white", mb: 2 }}
                    >
                      Enter Your Brand Name & Choose Colors
                    </Typography>

                    <Box sx={{ width: "100%" }}>
                      <TeamNameWrapper>
                        <Typography
                          className="nunito-b"
                          sx={{ fontSize: "18px", color: "white" }}
                        >
                          Enter your Club or Team Name
                        </Typography>

                        <AccordionBox>
                          <TextField
                            {...register("askName", {
                              required: true,
                              maxLength: 30,
                            })}
                            fullWidth
                            variant="outlined"
                            placeholder="Enter your Club or Team Name...."
                            error={Boolean(errors.askName)} // This will render the error state if there's an error
                            helperText={
                              errors.askName &&
                              (errors.askName.type === "required"
                                ? "Company-Name is Required"
                                : "Max length is 30 characters")
                            } // This will display the error message
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "10px",
                                backgroundColor: "white",
                                width: "100%",
                              },
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "& .MuiInputBase-input": {
                                // Targeting the input text
                                fontFamily: "nunito", // Replace with your specific font family
                                fontWeight: 700,
                              },
                              "& .MuiInputBase-input::placeholder": {
                                // Targeting the placeholder
                                fontFamily: "nunito",
                                fontWeight: 700,
                              },
                              mt: 2,
                            }}
                          />
                        </AccordionBox>
                      </TeamNameWrapper>
                      {/* Wrap the TextField to maintain background */}

                      {/* The CustomAccordion components */}
                      <AccordionBox>
                        <Typography
                          className="nunito-b"
                          sx={{ fontSize: "18px", color: "white" }}
                        >
                          Choose the Brand Colors for your Personalized Kit
                          Designer
                        </Typography>
                      </AccordionBox>

                      <AccordionBox>
                        <CustomAccordion
                          heading="Primary Color"
                          colorType="Primary"
                          isExpanded={expandedAccordion === "Primary Color"}
                          onChange={() =>
                            setExpandedAccordion(
                              expandedAccordion !== "Primary Color"
                                ? "Primary Color"
                                : null
                            )
                          }
                        />
                      </AccordionBox>
                      <AccordionBox>
                        <CustomAccordion
                          sx={{ mt: 2 }}
                          heading="Secondary Color A"
                          colorType="Secondary A"
                          isExpanded={expandedAccordion === "Secondary Color A"}
                          onChange={() =>
                            setExpandedAccordion(
                              expandedAccordion !== "Secondary Color A"
                                ? "Secondary Color A"
                                : null
                            )
                          }
                        />
                      </AccordionBox>
                      <AccordionBox>
                        <CustomAccordion
                          sx={{ mt: 2 }}
                          heading="Secondary Color B"
                          colorType="Secondary B"
                          isExpanded={expandedAccordion === "Secondary Color B"}
                          onChange={() =>
                            setExpandedAccordion(
                              expandedAccordion !== "Secondary Color B"
                                ? "Secondary Color B"
                                : null
                            )
                          }
                        />
                      </AccordionBox>
                    </Box>

                    <ButtonBox>
                      <WhiteButton handleClick={console.log("Button clicked!")}>
                        Next
                      </WhiteButton>
                    </ButtonBox>
                  </Grid>
                </FormContainer>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Wrapper>
    </Container>
  );
};

export default AskName;
