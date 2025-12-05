import React, { useState } from 'react';
import { Button, Drawer, Icon } from '@ramme-io/ui';
import LocalSideNav from './LocalSideNav';
import type { NavItem } from './LocalSideNav';

interface PageWithSideNavProps {
  navItems: NavItem[];
  children: React.ReactNode;
  sideNavHeader?: React.ReactNode;
  contentWidth?: 'fixed' | 'full';
}

export const PageWithSideNav: React.FC<PageWithSideNavProps> = ({
  navItems,
  children,
  sideNavHeader,
  contentWidth = 'fixed',
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const contentContainerClass = contentWidth === 'fixed'
    ? 'max-w-7xl mx-auto'
    : '';

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* --- Mobile Header --- */}
      <div className="md:hidden p-4 bg-card border-b border-border flex items-center justify-between sticky top-[65px] z-10">
        {sideNavHeader}
        <Button onClick={() => setIsMobileNavOpen(true)} variant="ghost" size="icon">
          <Icon name="panel-left" />
        </Button>
      </div>

      {/* --- Desktop Sidebar --- */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border p-4 sticky top-[65px] h-[calc(100vh-65px)]">
        {sideNavHeader}
        <LocalSideNav navItems={navItems} className="mt-1" />
      </aside>
      
      {/* --- Mobile Drawer --- */}
      <Drawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        position="left"
      >
        <div className="p-4">
            <Button 
              onClick={() => setIsMobileNavOpen(false)} 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4"
            >
                <Icon name="x" />
            </Button>
            <div className="mt-2">{sideNavHeader}</div>
            <LocalSideNav navItems={navItems} onLinkClick={() => setIsMobileNavOpen(false)} />
        </div>
      </Drawer>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className={contentContainerClass}>
          {children}
        </div>
      </main>
    </div>
  );
};