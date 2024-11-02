import React from 'react';
import { Container } from './style';

import { Routes, Route, Navigate } from 'react-router-dom';
import {
  Register,
  Login,
  ForgetPassword,
  ResetPassword,
  RegisterInfo,
  MailVerification,
} from '@/pages/Auth';
import NotFoundPage from '../pages/not-found';

const AuthRouter = () => {
  return (
    <Container>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Navigate to="/login" replace />} path="/logout" />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword/:userId/:shortId" element={<ResetPassword />} />
        <Route path="/" element={<Login />} />
        <Route path="/verify-email/:userId/:shortId" element={<MailVerification />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
};

export default AuthRouter;
