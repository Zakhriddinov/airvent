import React from "react";
import { Container } from "./style";
import { Result } from "antd";
const RegisterInfo = () => {
  return (
    <Container>
      <Result
        title="Hisobingizni tasdiqlang"
        subTitle="Hisobingizni tasdiqlash uchun elektron pochtangizni tekshiring"
        style={{ fontWeight: "600" }}
      />
    </Container>
  );
};

export default RegisterInfo;
