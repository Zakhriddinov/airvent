import React, { useEffect } from "react";
import { Container } from "./style";
import NotFoundIcon from "../../assets/icons/svg/404.svg?react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const redirectHomePage = () => {
    navigate("/");
  };
  return (
    <Container>
      <NotFoundIcon />
      <h2>Xato 404</h2>
      <p style={{ fontWeight: "550" }}>
        Kechirasiz, siz so'ragan sahifa mavjud emas
      </p>
      <Button type="primary" onClick={redirectHomePage}>
        Bosh sahifa
      </Button>
    </Container>
  );
};

export default NotFoundPage;
