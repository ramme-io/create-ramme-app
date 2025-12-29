/**
 * @file settings.sitemap.ts
 * @repository ramme-app-starter
 * @description
 * Defines the Information Architecture (IA) for the "Settings" layout.
 * Imports components from the /pages/settings/ directory.
 */
import type { SitemapEntry } from '../../engine/types/sitemap-entry';

// --- 1. Import from the new /pages/settings/ directory ---
import ProfilePage from '../../features/settings/pages/ProfilePage';
import BillingPage from '../../features/settings/pages/BillingPage';
import TeamPage from '../../features/settings/pages/TeamPage';

// --- 2. Export with the correct name ---
export const settingsSitemap: SitemapEntry[] = [
  {
    id: 'profile',
    path: 'profile',
    title: 'My Profile',
    icon: 'user',
    component: ProfilePage,
  },
  {
    id: 'settings.billing',
    path: 'billing',
    title: 'Billing',
    icon: 'credit-card',
    component: BillingPage,
  },
  {
    id: 'settings.team',
    path: 'team',
    title: 'Team',
    icon: 'users',
    component: TeamPage,
  },
];