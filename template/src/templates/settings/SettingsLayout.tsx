import React, { useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  type SidebarItem,
  type IconName,
} from '@ramme-io/ui';
import { settingsSitemap } from './settings.sitemap';
import rammeLogo from '../../assets/orange.png';
import { useAuth } from '../../features/auth/AuthContext';
import { SitemapProvider } from '../../engine/runtime/SitemapContext';
import PageTitleUpdater from '../../components/PageTitleUpdater';
import TemplateSwitcher from '../../components/TemplateSwitcher';

const SettingsLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // --- Actions ---
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all user data? This cannot be undone.')) {
      localStorage.removeItem('users');
      window.location.reload();
    }
  };

  // --- Data Mapping ---
  // We combine the Sitemap navigation with the System Actions (Reset/Logout)
  // so they all live harmoniously in the new "Zero Jank" sidebar list.
  const sidebarItems: SidebarItem[] = useMemo(() => {
    // 1. Navigation Items
    const navItems: SidebarItem[] = settingsSitemap.map((item) => ({
      id: item.id,
      label: item.title,
      icon: (item.icon as IconName) || 'settings',
      href: item.path ? `/settings/${item.path}` : '/settings',
    }));

    // 2. System Actions (Appended to bottom)
    const actionItems: SidebarItem[] = [
      {
        id: 'action-reset',
        label: 'Reset Data',
        icon: 'refresh-cw' as IconName,
        onClick: handleResetData,
      },
      {
        id: 'action-logout',
        label: 'Logout',
        icon: 'log-out' as IconName,
        onClick: logout,
      }
    ];

    return [...navItems, ...actionItems];
  }, [logout]);

  // Determine active item (only for nav items, actions don't stay active)
  const activeItemId = useMemo(() => {
    const active = sidebarItems.find(item => 
      item.href && item.href !== '/settings' && location.pathname.startsWith(item.href)
    );
    return active?.id || (location.pathname === '/settings' ? sidebarItems[0]?.id : undefined);
  }, [location.pathname, sidebarItems]);

  return (
    <SitemapProvider value={settingsSitemap}>
      <PageTitleUpdater />
      
      <div className="flex h-screen bg-background text-foreground">
        <Sidebar
          className="relative border-border"
          items={sidebarItems}
          activeItemId={activeItemId}
          // Handle both Navigation (href) and Actions (onClick)
          onNavigate={(item) => {
            if (item.href) {
              navigate(item.href);
            }
            // item.onClick is handled automatically by the Sidebar component if present
          }}
          user={user ? {
            name: user.name,
            email: user.email,
            avatarUrl: undefined // Add avatar URL if available in user object
          } : undefined}
          logo={
            <div className="flex items-center gap-2 px-2">
              <img src={rammeLogo} alt="Ramme" className="h-7 w-auto" />
              <span className="text-xl font-bold">Ramme</span>
            </div>
          }
          // Inject the TemplateSwitcher into the footer slot (above the user profile)
          footerSlot={
            <div className="mb-2">
              <TemplateSwitcher />
            </div>
          }
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
            <Outlet />
          </main>
        </div>
      </div>
    </SitemapProvider>
  );
};

export default SettingsLayout;