import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider, ToastProvider } from '@ramme-io/ui';
import { AuthProvider } from './features/auth/AuthContext.tsx'; 
import { MqttProvider } from './engine/runtime/MqttContext';
import "@ramme-io/ui/index.css";
import './index.css';
import { initializeDataLake } from './engine/runtime/data-seeder';

import { ManifestProvider } from './engine/runtime/ManifestContext';

// This import activates all AG Grid Enterprise features
import 'ag-grid-enterprise';

initializeDataLake();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ManifestProvider>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <MqttProvider>
              <App />
            </MqttProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
    </ManifestProvider>
  </React.StrictMode>,
);