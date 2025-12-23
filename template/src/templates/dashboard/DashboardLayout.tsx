import React, { useState } from 'react'; // <-- Added useState
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
  ChatFAB, // <-- NEW: Import FAB
} from '@ramme-io/ui';
import { dashboardSitemap } from './dashboard.sitemap';
import { SitemapProvider } from '../../contexts/SitemapContext';
import PageTitleUpdater from '../../components/PageTitleUpdater';
import AppHeader from '../../components/AppHeader';
import { AIChatWidget } from '../../components/AIChatWidget'; // <-- NEW: Import Widget
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';

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
                    end
                    icon={child.icon ? <Icon name={child.icon} /> : undefined}
                    tooltip={child.title}
                    className="pl-10" 
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
  // 1. STATE: Track if the chat window is open
  const [isChatOpen, setIsChatOpen] = useState(false);
  useWorkflowEngine();

  return (
    <SitemapProvider value={dashboardSitemap}>
      <PageTitleUpdater />
      <SidebarProvider>
        <div className="flex h-screen bg-background text-foreground relative">
          <Sidebar>
            <AppSidebarContent />
          </Sidebar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-8">
              <Outlet />
            </main>
          </div>

          {/* --- AI COPILOT SECTION --- */}
          
          {/* 2. The Widget: Only renders when open */}
          {isChatOpen && (
            <AIChatWidget onClose={() => setIsChatOpen(false)} />
          )}

          {/* 3. The Button: Fixed to bottom-right */}
          <div className="fixed bottom-6 right-6 z-50">
            <ChatFAB 
              onClick={() => setIsChatOpen(!isChatOpen)} 
              tooltipContent={isChatOpen ? "Close Assistant" : "Open Bodewell AI"}
            />
          </div>

        </div>
      </SidebarProvider>
    </SitemapProvider>
  );
};

export default DashboardLayout;