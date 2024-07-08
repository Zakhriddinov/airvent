import styled from "styled-components";
import { Layout } from "antd";
import { Link } from "react-router-dom";

const Container = styled(Layout)`
  height: 100vh;
  padding: 20px;
  padding: 100px;
  background-color: white;
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  /* align-items: center; */
`;

const FormContent = styled.div`
  max-width: 400px;
  width: 100%;
  h1 {
    font-size: 36px;
  }
`;

const ImgWrapper = styled.div`
  /* border-radius: 20px; */
  /* box-shadow: 0 0 20px 3px #96beee26; */
  img {
    border-radius: 20px;
    width: 500px;
    height: 650px;
  }
`;

const ContentRight = styled.div`
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const ContentLeft = styled.div`
  display: flex;
  /* align-items: center; */
  justify-content: center;
  width: 50%;
`;

const ForgotPasswordLink = styled(Link)`
  color: #1640d6;
`;
export {
  Container,
  Wrapper,
  FormContent,
  ImgWrapper,
  ContentRight,
  ContentLeft,
  ForgotPasswordLink,
};
