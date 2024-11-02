import React from "react";
import {
  Container,
  ContentLeft,
  ContentRight,
  ForgotPasswordLink,
  FormContent,
  ImgWrapper,
  Wrapper,
} from "../style";
import resetImg from "../../../assets/icons/img/reset.png";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const ForgetPassword = () => {
  return (
    <Container>
      <Wrapper>
        <ContentLeft>
          <FormContent>
            <h1>Parolni unutdingizmi</h1>
            <Divider />

            <Form
              initialValues={{
                remember: true,
              }}
              layout="vertical"
              autoComplete="off"
              style={{ fontWeight: "bold" }}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: "100%" }}
                  size="large"
                >
                  Parolni yangilash
                </Button>
              </Form.Item>
              <p>
                yoki{" "}
                <ForgotPasswordLink to="/login">
                  Ro'yxatdan o'tganmisiz
                </ForgotPasswordLink>
              </p>
            </Form>
          </FormContent>
        </ContentLeft>
        <ContentRight>
          <ImgWrapper>
            <img src={resetImg} alt="icon" />
          </ImgWrapper>
        </ContentRight>
      </Wrapper>
    </Container>
  );
};

export default ForgetPassword;
