import React from "react";
import styled from "styled-components";

const ImageBg = styled.img`
  position: absolute;
  z-index: -2;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export default function ImageBackground({ imagePath }) {
  return (
    <ImageBg
      src={imagePath}
      loading="lazy"
      width="auto"
      height="auto"
      alt="Background"
    />
  );
}
