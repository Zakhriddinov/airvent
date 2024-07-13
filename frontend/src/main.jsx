import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Routing } from '@/routes/route';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1640d6',
        fontFamily: 'Nunito, sans-serif',
      },
    }}
  >
    <BrowserRouter>
      <Provider store={store}>
        <Routing />
      </Provider>
    </BrowserRouter>
  </ConfigProvider>
);
