import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { Icon } from '@ramme-io/ui';

/**
 * @file ProtectedRoute.tsx
 * @description The "Security Gatekeeper" for the application.
 *
 * ARCHITECTURAL ROLE:
 * This component wraps all private routes (Dashboard, Settings, Docs) in `App.tsx`.
 * It acts as a middleware that checks the user's authentication status before
 * allowing access to the child components (Outlet).
 *
 * KEY FEATURES:
 * 1. **Auth Verification:** Automatically redirects unauthenticated users to `/login`.
 * 2. **Loading State:** Displays a spinner while the Auth Provider is initializing,
 * preventing "flash of login screen" bugs.
 * 3. **History Management:** Uses `replace` on redirect to ensure the browser
 * back button works correctly (skips the restricted page).
 */

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You can replace this with a proper loading spinner component
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icon name="loader-circle" className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;