import { Routes, Route, Navigate } from 'react-router-dom';
import { generateRoutes } from './core/route-generator';
import { useEffect } from 'react'; // <-- 1. Import useEffect

// --- 1. IMPORT ALL THREE TEMPLATES ---
import DashboardLayout from './templates/dashboard/DashboardLayout';
import { dashboardSitemap as dashboardSitemap } from './templates/dashboard/dashboard.sitemap';
import DocsLayout from './templates/docs/DocsLayout';
import { docsSitemap as docsSitemap } from './templates/docs/docs.sitemap';
import SettingsLayout from './templates/settings/SettingsLayout';
import { settingsSitemap as settingsSitemap } from './templates/settings/settings.sitemap';

// Other Imports
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/styleguide/NotFound';

// --- 2. IMPORT THE SEEDER ---
import { initializeDataLake } from './core/data-seeder'; 

function App() {
  
  // ✅ 3. TRIGGER DATA SEEDING ON MOUNT
  // This checks localStorage and injects our mock database if missing.
  useEffect(() => {
    initializeDataLake();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        {/* Default redirect to the dashboard's root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Template Routes */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          {generateRoutes(dashboardSitemap)}
        </Route>

        {/* Docs Template Routes */}
        <Route path="/docs/*" element={<DocsLayout />}>
          {generateRoutes(docsSitemap)}
        </Route>

        {/* Settings Layout Route */}
        <Route path="/settings/*" element={<SettingsLayout />}>
          {generateRoutes(settingsSitemap)}
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;