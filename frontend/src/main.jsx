// src/main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // File CSS gốc

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);