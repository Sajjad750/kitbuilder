import React from "react";
import styled from "styled-components";

export default function WhiteButton({ children, handleClick }) {
  const ButtonTemplate = styled.button`
    font-size: 1.1rem;
    font-family: "Nunito";
    font-weight: 600;
    background-color: transparent;
    color: #fff;
    padding: 0.985rem 3rem;
    border-radius: 0.4rem;
    border: 1px #fff solid;
    letter-spacing: 0.5px;
    cursor: pointer;
    transition: all 0.25s ease-out;

    &:hover {
      background-color: #960909;
      border: 1px #960909 solid;
      color: #fff;
    }
    @media (max-width: 600px) {
      padding: 0.97rem 3rem;
    }
  `;
  return (
    <ButtonTemplate onClick={() => handleClick}>{children}</ButtonTemplate>
  );
}
