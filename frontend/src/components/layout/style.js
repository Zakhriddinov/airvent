import { Layout, Menu } from 'antd';
import styled from 'styled-components';

const { Sider, Content } = Layout;

const Container = styled(Layout)`
  background-color: #f4f9fd;
  padding-bottom: 24px;
`;

const Sidebar = styled(Sider)`
  margin: 20px 0 20px 20px !important;
  min-width: 256px !important;
  width: 100%;
  padding: 20px 0;
  border-radius: 6px;
`;

const MenuWrap = styled(Menu)`
  background-color: transparent;
  font-weight: 550;
  border-inline-end: none !important;
`;

const Main = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 100vh;
  height: 100%;
  /* height: 100%; */
`;

const LinkLogo = styled.div`
  width: 100%;
  cursor: pointer;
  display: flex;
  margin-bottom: 20px;
  img {
    width: 180px;
    margin: 0 auto;
  }
`;
export { Container, Sidebar, Main, MenuWrap, LinkLogo };
