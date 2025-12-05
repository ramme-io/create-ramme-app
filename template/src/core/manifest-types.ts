/**
 * @file manifest-types.ts
 * @repository ramme-app-starter
 * @description Defines the canonical types for "link" entries used in
 * the global app.manifest.ts. These are distinct from SitemapEntry
 * as they do not require a `component` and are used for shared
 * navigation elements like user menus, settings, or footers.
 */
import { type IconName } from '@ramme-io/ui';

export interface ManifestLink {
  /**
   * A unique string identifier.
   * e.g., 'user.profile'
   */
  id: string;
  
  /**
   * The URL path for the link.
   * e.g., '/profile', '/settings/billing'
   */
  path: string;
  
  /**
   * The human-readable name for the link.
   * e.g., 'Your Profile', 'Billing'
   */
  title: string;
  
  /**
   * (Optional) The name of the icon from @ramme-io/ui.
   * e.g., 'user', 'settings'
   */
  icon?: IconName;
  
  /**
   * (Optional) An array of nested links for creating sub-menus.
   */
  children?: ManifestLink[];
}