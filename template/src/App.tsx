import { Routes, Route, Navigate } from 'react-router-dom';
import { generateRoutes } from './core/route-generator';

// --- 1. IMPORT ALL THREE TEMPLATES ---
import DashboardLayout from './templates/dashboard/DashboardLayout';
import { dashboardSitemap as dashboardSitemap } from './templates/dashboard/dashboard.sitemap';
import DocsLayout from './templates/docs/DocsLayout';
import { docsSitemap as docsSitemap } from './templates/docs/docs.sitemap';
import SettingsLayout from './templates/settings/SettingsLayout'; // <-- NEW
import { settingsSitemap as settingsSitemap } from './templates/settings/settings.sitemap'; // <-- NEW

// Other Imports
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/styleguide/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        {/* Default redirect to the dashboard's root */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard Template Routes */}
        <Route path="/dashboard/*" element={<DashboardLayout />}>
          {' '}
          {/* <-- Added /* */}
          {generateRoutes(dashboardSitemap)}
        </Route>

        {/* Docs Template Routes */}
        <Route path="/docs/*" element={<DocsLayout />}>
          {' '}
          {/* <-- Added /* */}
          {generateRoutes(docsSitemap)}
        </Route>

        {/* --- 2. ADD THE NEW SETTINGS LAYOUT ROUTE --- */}
        <Route path="/settings/*" element={<SettingsLayout />}>
          {generateRoutes(settingsSitemap)}
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;