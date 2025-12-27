import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  type SidebarItem,
  ChatFAB,
  type IconName, // Type for safety
} from '@ramme-io/ui'; // ✅ Import only what exists in v1.2.0

import { dashboardSitemap } from './dashboard.sitemap';
import { SitemapProvider } from '../../contexts/SitemapContext';
import PageTitleUpdater from '../../components/PageTitleUpdater';
import AppHeader from '../../components/AppHeader';
import { AIChatWidget } from '../../components/AIChatWidget';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';

// Main Layout Component
const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useWorkflowEngine();

  // 1. Transform Sitemap to Sidebar Items
  // The new Sidebar expects a simple array of items.
  const sidebarItems: SidebarItem[] = useMemo(() => {
    return dashboardSitemap.map((route) => ({
      id: route.id,
      label: route.title,
      icon: route.icon as IconName, // Ensure your sitemap strings match valid icon names
      href: route.path ? `/dashboard/${route.path}` : '/dashboard',
      // Note: v1.2.0 Sidebar currently handles top-level items. 
      // If you need nested items, we would flatten them here or update Sidebar.tsx later.
    }));
  }, []);

  // 2. Determine Active Item based on URL
  const activeItemId = useMemo(() => {
    // Find the item whose href matches the start of the current path
    const active = sidebarItems.find(item => 
      item.href !== '/dashboard' && location.pathname.startsWith(item.href!)
    );
    // Default to dashboard (first item) if no specific match
    return active?.id || sidebarItems[0]?.id;
  }, [location.pathname, sidebarItems]);

  return (
    <SitemapProvider value={dashboardSitemap}>
      <PageTitleUpdater />
      
      {/* 3. New Layout Structure (No Provider needed) */}
      <div className="flex h-screen bg-background text-foreground relative">
        
        <Sidebar
          className="relative border-border"
          items={sidebarItems}
          activeItemId={activeItemId}
          onNavigate={(item) => {
            if (item.href) navigate(item.href);
          }}
          user={{
            name: "Demo User",
            email: "user@example.com",
            avatarUrl: "https://i.pravatar.cc/150?u=ramme"
          }}
          logo={
            <div className="flex items-center gap-2 px-2 font-bold text-xl tracking-tight">
              <span className="text-primary">Ramme</span>App
            </div>
          }
        />

        <div className="flex flex-col flex-1 overflow-hidden">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-8 bg-muted/20">
            <Outlet />
          </main>
        </div>

        {/* --- AI COPILOT SECTION --- */}
        {isChatOpen && (
          <AIChatWidget onClose={() => setIsChatOpen(false)} />
        )}

        <div className="fixed bottom-6 right-6 z-50">
          <ChatFAB 
            onClick={() => setIsChatOpen(!isChatOpen)} 
            tooltipContent={isChatOpen ? "Close Assistant" : "Open Bodewell AI"}
          />
        </div>

      </div>
    </SitemapProvider>
  );
};

export default DashboardLayout;