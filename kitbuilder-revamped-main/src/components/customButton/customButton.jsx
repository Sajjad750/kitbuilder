import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/system';

const StyledButton = styled(({ 
    backgroundColor, 
    fontColor, 
    fontFamily, 
    borderRadius, 
    width, 
    height, 
    textAlign, 
    hoverColor, 
    hoverFontColor,
    border,
    hoverBorder,
    fontSize,
    ...otherProps 
}) => 
  <Button {...otherProps} />
)(({ 
    backgroundColor, 
    fontColor, 
    fontFamily, 
    borderRadius, 
    width, 
    height, 
    textAlign, 
    hoverColor,
    hoverFontColor,
    border,
    hoverBorder,
    fontSize,
}) => ({
    backgroundColor,
    color: fontColor,
    fontFamily,
    borderRadius,
    width,
    height,
    textAlign,
    border,
    fontSize,
    '&:hover': {
      backgroundColor: hoverColor ? hoverColor : undefined,
      color: hoverFontColor ? hoverFontColor : undefined,
      border: hoverBorder
    },
}));

const CustomButton = ({ 
    backgroundColor, 
    fontColor, 
    fontFamily, 
    borderRadius, 
    width, 
    height, 
    textAlign, 
    hoverColor,
    hoverFontColor,
    border,
    hoverBorder,
    fontSize,
    ...otherProps
 }) => (
    <StyledButton 
        backgroundColor={backgroundColor}
        fontColor={fontColor}
        fontFamily={fontFamily}
        borderRadius={borderRadius}
        width={width}
        height={height}
        textAlign={textAlign}
        hoverColor={hoverColor}
        hoverFontColor={hoverFontColor}
        border={border}
        hoverBorder={hoverBorder}
        fontSize={fontSize}
        {...otherProps} // This will pass the type prop (and any other props) to StyledButton
    >
        {otherProps.children}
    </StyledButton>
);

export default CustomButton;
