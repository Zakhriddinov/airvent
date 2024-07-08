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
import resetImg from "../../../assets/icons/img/password.png";
import { Button, Checkbox, Divider, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  return (
    <Container>
      <Wrapper>
        <ContentLeft>
          <FormContent>
            <h1>Parolni tiklash</h1>
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
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Parol"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "The new password that you entered do not match!",
                        ),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Parolni tasdiqlash"
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

export default ResetPassword;
