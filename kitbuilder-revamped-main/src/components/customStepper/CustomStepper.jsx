import React from 'react';
import { Stepper, Step, StepLabel, StepConnector, styled } from '@mui/material';

const CustomConnector = styled(StepConnector)(({ theme }) => ({
    '&.MuiStepConnector-root::after': {
      content: '""',
      position: 'absolute',
      width: '12px',
      height: '12px',
      backgroundColor: '#960909',
      borderRadius: '50%',
      top: '-30%',
      left: '50%', // Adjust this value
      transform: 'translate(-50%, -50%)',
    },
  }));
  

const CustomStepper = ({ activeStep, steps }) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel connector={<CustomConnector />}>
      {steps.map((label, index) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CustomStepper;
