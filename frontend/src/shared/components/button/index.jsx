import React from "react";
import { Container } from "./style";

const Button = ({ children, type, onClick, width, height, disabled }) => {
  return (
    <Container
      disabled={disabled}
      onClick={onClick}
      type={type}
      width={width}
      height={height}
    >
      {children}
    </Container>
  );
};

export default Button;
