// ramme-app-starter/template/src/templates/dashboard/DashboardLayout.tsx
import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
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
} from '@ramme-io/ui';
import { dashboardSitemap } from './dashboard.sitemap';
import { SitemapProvider } from '../../contexts/SitemapContext';
import PageTitleUpdater from '../../components/PageTitleUpdater';
import AppHeader from '../../components/AppHeader';

// NavLink wrapper - Correct
const SidebarNavLink = React.forwardRef<HTMLAnchorElement, any>(
  ({ end, href, ...props }, ref) => {
    return <NavLink ref={ref} to={href || ''} {...props} end={end} />;
  },
);
SidebarNavLink.displayName = 'SidebarNavLink';

// Sidebar Content Component
const AppSidebarContent: React.FC = () => {
  const { isOpen, toggle } = useSidebar();
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-end w-full h-full">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="hidden md:flex mr-1"
          >
            <Icon name={isOpen ? 'panel-left-close' : 'panel-left-open'} />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {dashboardSitemap.map((item) => (
            <React.Fragment key={item.id}>
              <SidebarMenuItem
                as={SidebarNavLink}
                href={item.path ? `/dashboard/${item.path}` : '/dashboard'}
                // --- THIS IS THE FIX ---
                // Force exact match for all parent links
                end
                icon={item.icon ? <Icon name={item.icon} /> : undefined}
                tooltip={item.title}
              >
                {item.title}
              </SidebarMenuItem>
              {item.children &&
                isOpen &&
                item.children.map((child) => (
                  <SidebarMenuItem
                    key={child.id}
                    as={SidebarNavLink}
                    href={`/dashboard/${item.path}/${child.path}`}
                    // --- THIS IS THE FIX ---
                    // 'end' was already here, which is correct
                    end
                    icon={child.icon ? <Icon name={child.icon} /> : undefined}
                    tooltip={child.title}
                    className="pl-10" // Indent child items
                  >
                    {child.title}
                  </SidebarMenuItem>
                ))}
            </React.Fragment>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter />
    </>
  );
};

// Main Layout Component
const DashboardLayout: React.FC = () => {
  return (
    <SitemapProvider value={dashboardSitemap}>
      <PageTitleUpdater />
      <SidebarProvider>
        <div className="flex h-screen bg-background text-foreground">
          <Sidebar>
            <AppSidebarContent />
          </Sidebar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-8">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SitemapProvider>
  );
};

export default DashboardLayout;