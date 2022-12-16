import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.min.css';
import 'animate.css';
import "./font/iconfont.css";
import App from './App';
import './index.scss';

ConfigProvider.config({
    theme: {
        primaryColor: '#ffe895',
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
