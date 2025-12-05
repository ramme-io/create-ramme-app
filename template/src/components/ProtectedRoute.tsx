import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from '@ramme-io/ui';

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