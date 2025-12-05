import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { docsSitemap } from './docs.sitemap';
import { SitemapProvider } from '../../contexts/SitemapContext';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import { Icon } from '@ramme-io/ui';
import PageTitleUpdater from '../../components/PageTitleUpdater';

const DocsLayout: React.FC = () => {
  return (
    // Add a wrapper div with the correct theme classes
    <div className="bg-background text-foreground">
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow">
          <div className="bg-background border-b border-border sticky top-16 z-30">
            <nav className="container mx-auto px-4">
              <ul className="flex items-center gap-4 h-12">
                {docsSitemap.map((item) => (
                  <li key={item.id}>
                    <NavLink
                      to={item.path || ''}
                      end={!item.children || item.children.length === 0}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted'
                        }`
                      }
                    >
                      {item.icon && <Icon name={item.icon} className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="container mx-auto p-4 md:p-8">
            <SitemapProvider value={docsSitemap}>
              <PageTitleUpdater />
              <Outlet />
            </SitemapProvider>
          </div>
        </main>
        <AppFooter />
      </div>
    </div>
  );
};

export default DocsLayout;