import React from 'react';
import { Spin } from 'antd';
import { Container } from './style';

const PageLoader = () => {
  return (
    <Container>
      <Spin size="large"  />
    </Container>
  );
};
export default PageLoader;