import React from "react";
import styled from "styled-components";

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

export default function blackOverlay() {
  return <Overlay />;
}
