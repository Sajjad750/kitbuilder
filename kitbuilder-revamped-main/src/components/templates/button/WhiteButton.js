import React from "react";
import styled from "styled-components";

export default function WhiteButton({ children, handleClick }) {
  const ButtonTemplate = styled.button`
    font-size: 1.1rem;
    font-family: "Nunito";
    font-weight: 600;
    background-color: #fff;
    color: #960909;
    padding: 1rem 3rem;
    border-radius: 0.4rem;
    border: none;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s ease-out;

    &:hover {
      background-color: #960909;
      color: #fff;
    }
  `;
  return (
    <ButtonTemplate onClick={() => handleClick}>{children}</ButtonTemplate>
  );
}
