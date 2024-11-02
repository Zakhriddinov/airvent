import React, { useEffect } from 'react';
import {
  Container,
  ContentLeft,
  ContentRight,
  ForgotPasswordLink,
  FormContent,
  ImgWrapper,
  Wrapper,
} from '../style';
import loginImg from '../../../assets/icons/img/auth.png';
import { Button, Checkbox, Divider, Form, Input } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { useNavigate } from 'react-router-dom';
import { login } from '@/redux/auth/actions';
import { Loading } from '@/shared/components';

const Login = () => {
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess || isLoading) navigate('/');
  }, [isSuccess, isLoading]);

  return (
    <Loading isLoading={isLoading}>
      <Container>
        <Wrapper>
          <ContentLeft>
            <FormContent>
              <h1>Kirish</h1>
              <Divider />

              <Form
                initialValues={{
                  remember: true,
                }}
                layout="vertical"
                autoComplete="off"
                style={{ fontWeight: 'bold' }}
                onFinish={onFinish}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Iltimos, emailingizni kiriting!',
                    },
                    {
                      type: 'email',
                      message: "Iltimos, to'g'ri email manzilini kiriting!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                </Form.Item>
                <Form.Item
                  label="Parol"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: 'Iltimos, parolingizni kiriting!',
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
                  <Input.Password prefix={<LockOutlined />} placeholder="Parol" size="large" />
                </Form.Item>

                <div className="footer">
                  <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                    <Checkbox>Meni eslab qol</Checkbox>
                  </Form.Item>
                  {/* <ForgotPasswordLink to="/forgetpassword">
                    Parolni unutdingizmi?
                  </ForgotPasswordLink> */}
                </div>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%', margin: '20px 0 0 0' }}
                    size="large"
                    loading={isLoading}
                  >
                    Kirish
                  </Button>
                </Form.Item>
                {/* <p>
                  yoki{' '}
                  <ForgotPasswordLink to="/register">Hozir ro'yxatdan o'ting!</ForgotPasswordLink>
                </p> */}
              </Form>
            </FormContent>
          </ContentLeft>
          <ContentRight>
            <ImgWrapper>
              <img src={loginImg} alt="icon" />
            </ImgWrapper>
          </ContentRight>
        </Wrapper>
      </Container>
    </Loading>
  );
};

export default Login;
