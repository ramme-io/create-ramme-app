/**
 * @file SitemapContext.tsx
 * @repository ramme-app-starter
 * @description This file implements a React Context for the sitemap.
 *
 * STRATEGIC IMPORTANCE:
 * This context is the "plumbing" that makes our swappable layout
 * strategy possible. It allows a top-level layout component (like
 * `DashboardLayout.tsx` or `DocsLayout.tsx`) to "provide" its specific
 * sitemap array (e.g., `dashboard.sitemap.ts`) to all of its children.
 *
 * Any component deep in the tree (like a sidebar, breadcrumbs, or page
 * header) can then "consume" this sitemap data using the `useSitemap`
 * hook to render the correct navigation, titles, and icons.
 *
 * This effectively decouples the navigation UI from the sitemap data,
 * allowing us to change the entire application's IA simply by changing
 * the data provided by the `SitemapProvider`.
 */

import { createContext, useContext } from 'react';
// Import the canonical "schema" for a sitemap entry
import type { SitemapEntry } from '../types/sitemap-entry';

// 1. Create the context
// We initialize it with an empty array as a safe default.
// This context will hold the sitemap array specific to the active layout.
const SitemapContext = createContext<SitemapEntry[]>([]);

/**
 * A custom hook to easily access the active sitemap array.
 * This abstracts the `useContext` logic and provides a clean API
 * for components that need to read the sitemap.
 *
 * @returns {SitemapEntry[]} The sitemap array provided by the nearest
 * `SitemapProvider`.
 */
export const useSitemap = () => {
  const context = useContext(SitemapContext);

  // This is a critical developer-friendly check.
  // If a component tries to call `useSitemap` outside of a layout
  // that provides the context, we throw an explicit error.
  if (context === undefined) {
    throw new Error('useSitemap must be used within a SitemapProvider');
  }
  
  return context;
};

// 3. Export the Provider
// We export the Provider component directly. This is what our layout
// components will use to wrap their content and supply the sitemap data.
//
// Example Usage (in a layout file):
// <SitemapProvider value={dashboardSitemap}>
//   <AppHeader />
//   <AppSidebar />
//   <Outlet />
// </SitemapProvider>
export const SitemapProvider = SitemapContext.Provider;