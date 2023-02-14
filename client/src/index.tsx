import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './customTheme.scss'
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.tsx';


const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
    <App />
);
