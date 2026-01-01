import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { generateRoutes } from './engine/renderers/route-generator';
import { ThemeProvider } from '@ramme-io/ui';
import { AuthProvider } from './features/auth/AuthContext';
import { MqttProvider } from './engine/runtime/MqttContext';


// --- 1. IMPORT AUTH CLUSTER ---
import { AuthLayout } from './features/auth/pages/AuthLayout';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';

// --- 2. IMPORT TEMPLATES ---
import DashboardLayout from './templates/dashboard/DashboardLayout';
import { dashboardSitemap } from './templates/dashboard/dashboard.sitemap';
import { useDynamicSitemap } from './engine/runtime/useDynamicSitemap';
import DocsLayout from './templates/docs/DocsLayout';
import { docsSitemap } from './templates/docs/docs.sitemap';
import SettingsLayout from './templates/settings/SettingsLayout';
import { settingsSitemap } from './templates/settings/settings.sitemap';

// Other Imports
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

// --- 3. DATA SEEDER ---
import { initializeDataLake } from './engine/runtime/data-seeder';

import ScrollToTop from './components/ScrollToTop';
import HashLinkScroll from './components/HashLinkScroll';


function App() {
  
  // Trigger data seeding on mount
  useEffect(() => {
    initializeDataLake();
  }, []);

  const liveDashboardRoutes = useDynamicSitemap(dashboardSitemap);

  console.log("🗺️ ROUTER MAP:", liveDashboardRoutes.map(r => ({ path: r.path, id: r.id })));
  

  return (
    <ThemeProvider>
      
      <AuthProvider>
        <MqttProvider>
          <ScrollToTop />
          <HashLinkScroll />
          <Routes>
            {/* --- NEW AUTH CLUSTER --- */}
            {/* This handles the layout and background for all auth pages */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
            </Route>

            {/* Fallback for legacy /login access */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />

            {/* --- PROTECTED APP ROUTES --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard/welcome" replace />} />

              {/* Dashboard Template */}
              <Route path="/dashboard/*" element={<DashboardLayout />}>
              <Route index element={<Navigate to="welcome" replace />} />
                {generateRoutes(liveDashboardRoutes)}
              </Route>

              {/* Docs Template */}
              <Route path="/docs/*" element={<DocsLayout />}>
                {generateRoutes(docsSitemap)}
              </Route>

              {/* Settings Template */}
              <Route path="/settings/*" element={<SettingsLayout />}>
                {generateRoutes(settingsSitemap)}
              </Route>
            </Route>

            {/* 404 Handler */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MqttProvider>
      </AuthProvider>
      
    </ThemeProvider>
  );
}

export default App;