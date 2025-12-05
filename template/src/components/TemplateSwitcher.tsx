/**
 * @file TemplateSwitcher.tsx
 * @repository ramme-app-starter
 * @description A reusable component to switch between application templates.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TemplateSwitcher: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isDocs = location.pathname.startsWith('/docs');
  const isSettings = location.pathname.startsWith('/settings');

  return (
    <div className="bg-muted text-muted-foreground p-1 rounded-md text-sm flex items-center gap-1">
      <Link
        to="/dashboard"
        className={`px-3 py-1 rounded ${
          isDashboard
            ? 'bg-background shadow-sm text-foreground font-semibold'
            : ''
        }`}
      >
        Dashboard
      </Link>
      <Link
        to="/docs"
        className={`px-3 py-1 rounded ${
          isDocs ? 'bg-background shadow-sm text-foreground font-semibold' : ''
        }`}
      >
        Docs
      </Link>
      <Link
        to="/settings"
        className={`px-3 py-1 rounded ${
          isSettings
            ? 'bg-background shadow-sm text-foreground font-semibold'
            : ''
        }`}
      >
        Settings
      </Link>
    </div>
  );
};

export default TemplateSwitcher;