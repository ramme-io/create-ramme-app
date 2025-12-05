import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PageWithSideNav } from '../components/PageWithSideNav';
import { useSitemap } from '../contexts/SitemapContext'; // Import the custom hook

const DataLayout: React.FC = () => {
  const location = useLocation();
  const sitemap = useSitemap(); // Consume the sitemap from context
  const isDocsTemplate = location.pathname.startsWith('/docs');

  if (isDocsTemplate) {
    const dataSitemapSection = sitemap.find(item => item.id === 'data');
    
    const navItems = (dataSitemapSection?.children || []).map(child => ({
      label: child.title,
      href: child.path,
      icon: child.icon,
    }));

    return (
      <PageWithSideNav
        sideNavHeader={
          <h2 className="text-lg font-semibold tracking-tight mb-2">
            {dataSitemapSection?.title || 'Data'}
          </h2>
        }
        navItems={navItems}
      >
        <Outlet />
      </PageWithSideNav>
    );
  }

  return <Outlet />;
};

export default DataLayout;