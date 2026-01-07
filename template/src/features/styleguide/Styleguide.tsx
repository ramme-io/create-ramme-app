import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, type SidebarItem, type IconName, Icon } from '@ramme-io/ui';
import { useSitemap } from '../../engine/runtime/SitemapContext';

const Styleguide: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sitemap = useSitemap();

  // 1. Get Styleguide Section Data
  const styleguideSection = useMemo(() => {
    return sitemap.find(item => item.id === 'styleguide');
  }, [sitemap]);

  // 2. Transform to Sidebar Items
  const navItems = useMemo<SidebarItem[]>(() => {
    if (!styleguideSection?.children) return [];

    return styleguideSection.children.map((child) => ({
      id: child.id,
      label: child.title,
      icon: (child.icon as IconName) || 'hash', 
      href: child.path ? `/docs/styleguide/${child.path}` : '/docs/styleguide',
    }));
  }, [styleguideSection]);

  // 3. Determine Active Item
  const activeItemId = useMemo(() => {
    const active = navItems.find(item => 
      location.pathname === item.href || 
      (item.href && location.pathname.startsWith(item.href))
    );
    return active?.id;
  }, [location.pathname, navItems]);

  if (!location.pathname.startsWith('/docs') || !styleguideSection) {
    return <Outlet />;
  }

  return (
    <div className="flex w-full min-h-[calc(100vh-7rem)]">
      {/* SIDEBAR */}
      <div className="sticky top-[7rem] h-[calc(100vh-7rem)] z-20 hidden md:block">
        <Sidebar
          // ✅ FIX 1: Removed 'w-64'. Let the Sidebar component manage its own width.
          // ✅ FIX 2: Added 'h-full' so it fills the sticky container perfectly.
          className="h-full border-r border-border bg-card/50 backdrop-blur-sm"
          items={navItems}
          activeItemId={activeItemId}
          onNavigate={(item) => {
            if (item.href) navigate(item.href);
          }}
          logo={
            <div className="flex items-center gap-2 px-1 py-2 text-muted-foreground">
              <Icon name="book-open" className="h-4 w-4" />
              <span className="font-semibold text-xs uppercase tracking-wider">Reference</span>
            </div>
          }
        />
      </div>

      {/* MAIN CONTENT */}
      {/* ✅ FIX 3: Re-added padding (p-6) so content doesn't hit the edges. */}
      <main className="flex-1 min-w-0 bg-background overflow-x-hidden p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Styleguide;