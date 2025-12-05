/**
 * @file settings.sitemap.ts
 * @repository ramme-app-starter
 * @description
 * Defines the Information Architecture (IA) for the "Settings" layout.
 * Imports components from the /pages/settings/ directory.
 */
import type { SitemapEntry } from '../../core/sitemap-entry';

// --- 1. Import from the new /pages/settings/ directory ---
import ProfilePage from '../../pages/settings/ProfilePage';
import BillingPage from '../../pages/settings/BillingPage';
import TeamPage from '../../pages/settings/TeamPage';

// --- 2. Export with the correct name ---
export const settingsSitemap: SitemapEntry[] = [
  {
    id: 'settings.profile',
    path: 'profile',
    title: 'Profile',
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