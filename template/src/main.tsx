import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { ThemeProvider, ToastProvider } from '@ramme-io/ui';
import { AuthProvider } from './features/auth/AuthContext.tsx'; 
import { MqttProvider } from './engine/runtime/MqttContext';
import "@ramme-io/ui/index.css"; 
import './index.css';

// 1. Data Seeder (Critical for Auth)
import { initializeDataLake } from './engine/runtime/data-seeder';

// 2. Manifest Provider (Critical for Builder Preview)
import { ManifestProvider } from './engine/runtime/ManifestContext';

// 3. AG Grid Enterprise
import 'ag-grid-enterprise';

// Initialize mock data immediately on boot
initializeDataLake();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🛡️ KEEPS THE BRIDGE ALIVE: Wraps the entire app */}
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