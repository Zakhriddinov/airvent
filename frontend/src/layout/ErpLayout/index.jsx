import { ErpContextProvider } from '@/context/erp';

import { Layout } from 'antd';

const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow layoutPadding"
        style={{
          margin: '30px auto',
          width: '100%',
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
