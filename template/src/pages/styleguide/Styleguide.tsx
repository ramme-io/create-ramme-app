import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageWithSideNav } from '../../components/PageWithSideNav';
import { useSitemap } from '../../contexts/SitemapContext';

const Styleguide: React.FC = () => {
  const location = useLocation();
  const sitemap = useSitemap();
  const isDocsTemplate = location.pathname.startsWith('/docs');

  if (isDocsTemplate) {
    // Find the 'styleguide' section from the sitemap to get its children
    const styleguideSitemapSection = sitemap.find(item => item.id === 'styleguide');
    
    // Transform the sitemap children into the shape the nav component expects
    const navItems = (styleguideSitemapSection?.children || []).map(child => ({
      label: child.title,
      href: child.path,
      icon: child.icon,
    }));

    return (
      <PageWithSideNav
        sideNavHeader={
          <h2 className="text-lg font-semibold tracking-tight mb-2">
            {styleguideSitemapSection?.title || 'Style Guide'}
          </h2>
        }
        navItems={navItems}
      >
        <Outlet />
      </PageWithSideNav>
    );
  }

  // In the dashboard template, the main layout handles navigation.
  return <Outlet />;
};

export default Styleguide;