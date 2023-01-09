import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/styles.scss";
import reportWebVitals from './reportWebVitals';
import AppRouter from "./routers/AppRouter";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);
reportWebVitals();
