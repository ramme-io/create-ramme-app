/**
 * @file PageTitleUpdater.tsx
 * @repository ramme-app-starter
 * @description Updates the browser tab title based on the current route
 * by looking up the title in the active sitemap.
 */
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSitemap } from '../engine/runtime/SitemapContext'; // Import our context hook
import type { SitemapEntry } from '../engine/types/sitemap-entry';

// Helper function to recursively find a route by path
const findRouteByPath = (
  sitemap: SitemapEntry[],
  pathname: string,
  basePath: string = '',
): SitemapEntry | null => {
  for (const entry of sitemap) {
    // Construct the full path for the current entry
    const fullPath = `${basePath}/${entry.path}`.replace(/\/+/g, '/'); // Normalize slashes

    if (pathname === fullPath) {
      return entry;
    }

    if (entry.children) {
      const foundInChildren = findRouteByPath(
        entry.children,
        pathname,
        fullPath,
      );
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return null;
};

const PageTitleUpdater: React.FC = () => {
  const location = useLocation();
  const sitemap = useSitemap(); // Get the sitemap from the current layout's context

  useEffect(() => {
    // Determine the base path prefix based on the current top-level route
    let baseRoutePrefix = '';
    if (location.pathname.startsWith('/dashboard')) {
      baseRoutePrefix = '/dashboard';
    } else if (location.pathname.startsWith('/docs')) {
      baseRoutePrefix = '/docs';
    } else if (location.pathname.startsWith('/settings')) {
      baseRoutePrefix = '/settings';
    }

    const currentRoute = findRouteByPath(sitemap, location.pathname, baseRoutePrefix);

    if (currentRoute) {
      document.title = `Ramme - ${currentRoute.title}`;
    } else {
      // Fallback title if no route is matched (e.g., for 404 or base layout path)
      document.title = 'Ramme - App Starter';
    }
    // Rerun effect whenever the pathname or the sitemap context changes
  }, [location.pathname, sitemap]);

  return null; // This component doesn't render anything itself
};

export default PageTitleUpdater;