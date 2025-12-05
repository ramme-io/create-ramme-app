/**
 * @file route-generator.tsx
 * @description This file is the core engine of the Sitemap-Driven Architecture.
 * Its purpose is to dynamically generate all application routes by reading directly
 * from a designer-friendly `sitemap` array. This abstracts all routing logic
 * away from our designers, empowering them to manage the app's structure from
 * a single, simple configuration file.
 */

import { Route, Navigate } from 'react-router-dom';
// CORRECTED IMPORT: Point to the canonical type definition
import type { SitemapEntry } from './sitemap-entry';

/**
 * Recursively generates React Router `<Route>` components from a sitemap array.
 * @param {SitemapEntry[]} routes - The array of sitemap entries to process.
 * @returns {JSX.Element[]} An array of React Router `<Route>` components.
 */

export const generateRoutes = (routes: SitemapEntry[]) => {
  return routes.map((route) => {
    // Check if the current route is a "parent" route with children
    if (route.children && route.children.length > 0) {
      // Get the path of the first child to use for redirection
      const firstChildPath = route.children[0].path;
      
      return (
        // Create the parent <Route> (e.g., /data)
        <Route key={route.id} path={route.path} element={<route.component />}>
          
          {/* PROFESSIONAL PROTOTYPING: This is a key feature for DX.
            It creates an "index" route that automatically redirects the user
            from the parent path (e.g., /data) to its first child (e.g., /data/grid).
            This prevents designers from ever seeing a blank parent page.
          */}
          <Route index element={<Navigate to={firstChildPath} replace />} />
          
          {/* Recursively generate all nested child routes */}
          {generateRoutes(route.children)}
        </Route>
      );
    }

    // Standard case: This is a simple route with no children.
    return <Route key={route.id} path={route.path} element={<route.component />} />;
  });
};