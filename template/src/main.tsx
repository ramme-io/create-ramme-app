import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider, ToastProvider } from '@ramme-io/ui';
import { AuthProvider } from './contexts/AuthContext'; // <-- 1. Import the AuthProvider
import '@ramme-io/ui/style.css';
import './index.css';

// This import activates all AG Grid Enterprise features
import 'ag-grid-enterprise';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          {/* 2. Wrap the entire App component with the AuthProvider */}
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);