/**
 * @file AppHeader.tsx
 * @repository ramme-app-starter
 * @description This is the global application header.
 *
 * @developer_notes
 * STRATEGIC REFACTOR:
 * 1. Cleaned up Ghost Bridge telemetry for production feel.
 * 2. Kept all A.D.A.P.T. navigation and z-index fixes.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Menu,
  MenuItem,
  MenuDivider,
  Icon,
  useTheme,
  type ThemeName,
} from '@ramme-io/ui';
import { useAuth } from '../features/auth/AuthContext';

// --- STRATEGIC IMPORTS ---
import { appManifest } from '../config/navigation';
import type { ManifestLink } from '../engine/types/manifest-types';
import TemplateSwitcher from './TemplateSwitcher';
import rammeLogo from '../assets/orange.png'; 

const AppHeader: React.FC = () => {
  const { theme, availableThemes, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const userNavLinks = appManifest.userMenu;

  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all user data to the original mock data? This cannot be undone.',
      )
    ) {
      localStorage.removeItem('users');
      window.location.reload();
    }
  };

  return (
    // Z-INDEX FIX: Set to z-50 to render above the z-40 sidebar.
    <header className="flex items-center justify-between p-4 bg-card border-b border-border shadow-sm sticky top-0 z-50">
      
      {/* --- 1. LOGO BLOCK --- */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <img src={rammeLogo} alt="Ramme Logo" className="h-8 w-auto" />
        <h1 className="text-2xl font-bold text-text">Ramme</h1>
      </Link>

      {/* --- 2. USER ACTIONS --- */}
      <div className="flex items-center gap-4">
        <TemplateSwitcher />
        {user && (
          <Menu
            trigger={
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <Avatar name={user.name} size="sm" />
              </button>
            }
          >
            {/* User Info */}
            <div className="p-2 text-sm text-muted-foreground">
              <p className="font-semibold text-text">{user.name}</p>
              <p>{user.email}</p>
            </div>
            <MenuDivider />

            {/* Navigation Links */}
            {userNavLinks.map((link: ManifestLink) => (
              <MenuItem
                key={link.id}
                asChild
                icon={link.icon ? <Icon name={link.icon} /> : undefined}
              >
                <Link to={link.path}>{link.title}</Link>
              </MenuItem>
            ))}
            <MenuDivider />

            {/* Theme Switcher */}
            <div className="p-2 text-sm text-muted-foreground">
              <p>
                Active Theme:{' '}
                <span className="font-semibold text-text">{theme}</span>
              </p>
            </div>
            {availableThemes.map((themeName: string) => (
              <MenuItem
                key={themeName}
                onClick={() => setTheme(themeName as ThemeName)}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </MenuItem>
            ))}
            <MenuDivider />

            {/* Actions */}
            <MenuItem onClick={handleResetData} icon={<Icon name="refresh-cw" />}>
              Reset Data
            </MenuItem>
            <MenuItem onClick={logout} icon={<Icon name="log-out" />}>
              Logout
            </MenuItem>
          </Menu>
        )}
      </div>
    </header>
  );
};

export default AppHeader;