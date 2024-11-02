import React, { useEffect } from "react";
import {
  Container,
  ContentLeft,
  ContentRight,
  ForgotPasswordLink,
  FormContent,
  ImgWrapper,
  Wrapper,
} from "../style";
import registerImg from "../../../assets/icons/img/forgot.png";
import { Button, Divider, Form, Input } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/auth/actions";
import { Loading } from "@/shared/components";
import { selectAuth } from "@/redux/auth/selectors";

const Register = () => {
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess]);
  return (
    <Loading isLoading={isLoading}>
      <Container>
        <Wrapper>
          <ContentLeft>
            <FormContent>
              <h1>Ro'yxatdan o'ting</h1>
              <Divider />

              <Form
                initialValues={{
                  remember: true,
                }}
                layout="vertical"
                autoComplete="off"
                style={{ fontWeight: "bold" }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Ism"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Iltimos, Ismingizni kiriting!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Ism"
                    size="large"
                  />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Iltimos, emailingizni kiriting!",
                    },
                    {
                      type: "email",
                      message: "Iltimos, to'g'ri email manzilini kiriting!",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Parol"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Iltimos, parolingizni kiriting!",
                    },
                    {
                      min: 8,
                      message: "Parol kamida 8 belgidan iborat bo'lishi kerak!",
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        "Parol kamida bitta katta harf, bitta kichik harf, bitta raqam va bitta maxsus belgi bo'lishi kerak!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Parol"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%", margin: "20px 0 0 0" }}
                    size="large"
                  >
                    Ro'yxatdan o'tish
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
              <img src={registerImg} alt="icon" className="register-img" />
            </ImgWrapper>
          </ContentRight>
        </Wrapper>
      </Container>
    </Loading>
  );
};

export default Register;
