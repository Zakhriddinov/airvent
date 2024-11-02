import React, { useEffect, useLayoutEffect } from 'react';
import { logout as logoutAction } from '@/redux/auth/actions';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PageLoader from '@/shared/components/pageLoader';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function asyncLogout() {
    dispatch(logoutAction());
  }

  // useLayoutEffect(() => {
  // dispatch(crud.resetState());
  // dispatch(erp.resetState());
  // }, []);
  useEffect(() => {
    asyncLogout();
    navigate('/login');
  }, []);
  return <PageLoader />;
};

export default Logout;
