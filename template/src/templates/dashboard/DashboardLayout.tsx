import React, { useState, useMemo } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  type SidebarItem,
  ChatFAB,
  type IconName, 
} from '@ramme-io/ui'; 

import { dashboardSitemap } from './dashboard.sitemap';
import { SitemapProvider } from '../../engine/runtime/SitemapContext';
import PageTitleUpdater from '../../components/PageTitleUpdater';
import AppHeader from '../../components/AppHeader';
import { AIChatWidget } from '../../components/AIChatWidget';
import { useWorkflowEngine } from '../../engine/runtime/useWorkflowEngine';

// ✅ 1. IMPORT THE HOOK
import { useDynamicSitemap } from '../../engine/runtime/useDynamicSitemap';

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  useWorkflowEngine();

  // ✅ 2. GET LIVE DATA (Merges Static + Builder Data)
  const liveSitemap = useDynamicSitemap(dashboardSitemap);

  // ✅ 3. BUILD SIDEBAR FROM LIVE DATA
  const sidebarItems: SidebarItem[] = useMemo(() => {
    // We map over 'liveSitemap' instead of 'dashboardSitemap'
    return liveSitemap.map((route) => ({
      id: route.id,
      label: route.title,
      icon: route.icon as IconName, 
      // Handle the path logic safely
      href: route.path.startsWith('/') ? route.path : `/dashboard/${route.path}`,
    }));
  }, [liveSitemap]); // Re-run whenever the Builder sends an update

  // 4. Determine Active Item
  const activeItemId = useMemo(() => {
    const active = sidebarItems.find(item => 
      item.href !== '/dashboard' && location.pathname.startsWith(item.href!)
    );
    return active?.id || sidebarItems[0]?.id;
  }, [location.pathname, sidebarItems]);

  return (
    // ✅ 5. PASS LIVE SITEMAP TO CONTEXT (For Breadcrumbs/Titles)
    <SitemapProvider value={liveSitemap}>
      <PageTitleUpdater />
      
      <div className="flex h-screen bg-background text-foreground relative">
        
        <Sidebar
          className="relative border-border"
          items={sidebarItems} // Now contains your new page!
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