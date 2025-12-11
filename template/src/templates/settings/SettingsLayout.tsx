/**
 * @file SettingsLayout.tsx
 * @repository ramme-app-starter
 * @description
 * Sidebar-Only layout. Moved TemplateSwitcher to SidebarContent.
 * Includes all previous fixes (href, icons, conditional branding, providers, etc.).
 * Confirmed handleResetData is included.
 */
import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
  Button,
  Icon,
  Avatar,
  Menu,
  MenuItem,
  MenuDivider,
  useTheme,
  type ThemeName,
} from '@ramme-io/ui';
import { settingsSitemap } from './settings.sitemap';
import rammeLogo from '../../assets/orange.png';
import { useAuth } from '../../contexts/AuthContext';
import { appManifest } from '../../config/navigation';
import type { ManifestLink } from '../../core/manifest-types';
import { SitemapProvider } from '../../contexts/SitemapContext';
import PageTitleUpdater from '../../components/PageTitleUpdater';
// --- Import TemplateSwitcher ---
import TemplateSwitcher from '../../components/TemplateSwitcher';

// NavLink wrapper - Correctly maps href to 'to'
const SidebarNavLink = React.forwardRef<HTMLAnchorElement, any>(
  ({ end, href, ...props }, ref) => {
    return <NavLink ref={ref} to={href || ''} {...props} end={end} />;
  },
);
SidebarNavLink.displayName = 'SidebarNavLink';

// Sidebar Content Component
const AppSidebarContent: React.FC = () => {
  const { isOpen, toggle } = useSidebar();
  const { theme, availableThemes, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const userNavLinks = appManifest.userMenu;

  // --- handleResetData function remains here ---
  const handleResetData = () => {
    if (
      window.confirm(
        'Are you sure you want to reset all user data? This cannot be undone.',
      )
    ) {
      localStorage.removeItem('users');
      window.location.reload();
    }
  };

  return (
    <>
      <SidebarHeader>
        {/* Header now only contains Branding and Toggle */}
        <div className={`flex items-center w-full h-full ${isOpen ? 'justify-between' : 'justify-end'}`}>
          {/* Branding Link */}
          <Link
            to="/settings"
            className={`flex items-center gap-2 transition-opacity duration-200 ${!isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}
            aria-hidden={!isOpen} tabIndex={!isOpen ? -1 : undefined}
          >
            <img src={rammeLogo} alt="Ramme Logo" className="h-7 w-auto" />
            <span className="text-xl font-bold text-text">Ramme</span>
          </Link>

          {/* TemplateSwitcher REMOVED from here */}

          {/* Toggle Button */}
          <Button
            variant="ghost" size="icon" onClick={toggle}
            className="hidden md:flex"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <Icon name={isOpen ? 'panel-left-close' : 'panel-left-open'} />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* --- MOVED TemplateSwitcher HERE --- */}
        {/* Only visible when sidebar is open */}
        <div className={`mb-4 transition-opacity duration-200 ${!isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
             <TemplateSwitcher />
        </div>

        {/* --- Sitemap Menu --- */}
        <SidebarMenu>
          {settingsSitemap.map((item) => (
            <SidebarMenuItem
              key={item.id} as={SidebarNavLink}
              href={item.path ? `/settings/${item.path}` : '/settings'} end
              icon={item.icon ? <Icon name={item.icon} /> : undefined}
              tooltip={item.title}
            >
              {item.title}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
         {user && (
           <Menu position="top-right" trigger={
             <button className="flex items-center gap-3 w-full text-left rounded-md p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary">
               <Avatar name={user.name} size="sm" />
               <div className={`flex-1 transition-opacity duration-200 ${!isOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>
                 <p className="font-semibold text-sm text-text">{user.name}</p>
                 <p className="text-xs text-muted-foreground">{user.email}</p>
               </div>
             </button>
           }>
            {/* User Menu Content */}
            {userNavLinks.map((link: ManifestLink) => (
              <MenuItem key={link.id} asChild icon={link.icon ? <Icon name={link.icon} /> : undefined}>
                <Link to={link.path}>{link.title}</Link>
              </MenuItem>
            ))}
            <MenuDivider />
            {availableThemes.map((themeName: string) => (
              <MenuItem key={themeName} onClick={() => setTheme(themeName as ThemeName)}>
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              </MenuItem>
            ))}
            <MenuDivider />
            {/* Calls handleResetData */}
            <MenuItem onClick={handleResetData} icon={<Icon name="refresh-cw" />}> Reset Data </MenuItem>
            {/* Calls logout */}
            <MenuItem onClick={logout} icon={<Icon name="log-out" />}> Logout </MenuItem>
          </Menu>
         )}
      </SidebarFooter>
    </>
  );
};

// Main layout component
const SettingsLayout: React.FC = () => {
  return (
    <SitemapProvider value={settingsSitemap}>
      <PageTitleUpdater />
      <SidebarProvider>
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar>
            <AppSidebarContent />
          </Sidebar>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <main className="p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SitemapProvider>
  );
};

export default SettingsLayout;