import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { docsSitemap } from './docs.sitemap';
import { SitemapProvider } from '../../engine/runtime/SitemapContext';
import AppHeader from '../../components/AppHeader';
import AppFooter from '../../components/AppFooter';
import { Icon } from '@ramme-io/ui';
import PageTitleUpdater from '../../components/PageTitleUpdater';

const DocsLayout: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans">
      <AppHeader />
      
      <main className="flex-grow flex flex-col">
        {/* --- TOP NAVIGATION BAR --- */}
        <div className="bg-card border-b border-border sticky top-16 z-30 w-full">
          <nav className="w-full px-6">
            <ul className="flex items-center gap-6 h-12">
              {docsSitemap.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path || ''}
                    end={!item.children || item.children.length === 0}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="w-full flex-1 flex flex-col">
          <SitemapProvider value={docsSitemap}>
            <PageTitleUpdater />
            
            {/* Page Content */}
            <div className="flex-1">
              <Outlet />
            </div>

            {/* Footer - Now part of the content flow */}
            <div className="border-t border-border mt-auto w-full bg-background">
              <div className="max-w-7xl mx-auto px-6">
                 <AppFooter />
              </div>
            </div>
          </SitemapProvider>
        </div>
      </main>
    </div>
  );
};

export default DocsLayout;