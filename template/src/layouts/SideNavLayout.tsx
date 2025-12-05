import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageWithSideNav } from '../components/PageWithSideNav';
import type { NavItem } from '../components/LocalSideNav';

interface SideNavLayoutProps {
  navItems: NavItem[];
  sideNavHeader?: React.ReactNode;
  contentWidth?: 'fixed' | 'full';
}

const SideNavLayout: React.FC<SideNavLayoutProps> = ({
  navItems,
  sideNavHeader,
  contentWidth = 'fixed',
}) => {
  return (
    <PageWithSideNav
      navItems={navItems}
      sideNavHeader={sideNavHeader}
      contentWidth={contentWidth}
    >
      <Outlet />
    </PageWithSideNav>
  );
};

export default SideNavLayout;