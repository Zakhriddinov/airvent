import { Layout } from 'antd';
import styled from 'styled-components';

const { Header } = Layout;

export const Container = styled(Header)`
  padding: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 10px;
  background-color: #f4f9fd;
`;

export const Profile = styled.div``;
export const ProfileDropdownWrap = styled.div`
  display: flex;
  gap: 10px;
  font-weight: bold;
`;
