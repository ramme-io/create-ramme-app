/**
 * @file sitemap-entry.ts
 * @repository ramme-app-starter
 * @description This file defines the canonical TypeScript interface for a single
 * sitemap entry. It is the "schema" or "contract" that governs the entire
 * Sitemap-Driven Architecture.
 *
 * STRATEGIC IMPORTANCE:
 * 1. Designer DX: It provides strict type-safety and autocompletion for any
 * designer editing a `sitemap.ts` file, dramatically lowering the risk of errors.
 * 2. Repo-Linking: It directly imports `IconName` from `@ramme-io/ui`, creating
 * a type-safe link between our starter kit and our component library.
 * 3. AI-Ready: This interface is the precise data structure that the AI Assistant
 * in the (private) `ramme-app-builder` will be trained to generate.
 * The "Architect" phase of the A.D.A.P.T. Framework will result in the
 * AI creating an array of these objects.
 */

// Import the type definition for all available icon names from our open-source
// UI library. This is a critical integration point.
import { type IconName } from '@ramme-io/ui';

/**
 * Defines the required shape for a single entry in any `sitemap.ts` file.
 */
export interface SitemapEntry {
  /**
   * A unique string identifier.
   * Used by React as the `key` prop during route generation.
   * e.g., 'dashboard.home'
   */
  id: string;

  /**
   * The URL path segment for this route.
   * e.g., 'home', 'users', 'settings'
   */
  path: string;

  /**
   * The human-readable name for the route.
   * Used to populate navigation links, breadcrumbs, and page titles.
   * e.g., 'Home', 'User Management'
   */
  title: string;

  /**
   * (Optional) The name of the icon to display in the navigation.
   * This MUST be a valid `IconName` from the `@ramme-io/ui` library.
   * e.g., 'home', 'users', 'settings'
   */
  icon?: IconName;

  /**
   * The actual React component to render when this route is active.
   * e.g., DashboardPage, SettingsPage
   */
  component: React.ComponentType;

  /**
   * (Optional) An array of nested `SitemapEntry` objects.
   * This is the property that enables recursive, nested navigation
   * (e.g., /settings/profile, /settings/billing).
   */
  children?: SitemapEntry[];
}