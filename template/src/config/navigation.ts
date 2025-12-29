/**
 * @file navigation.ts
 * @repository ramme-app-starter
 * @description
 * This is the central manifest for all GLOBAL, shared navigation elements.
 * Corrected paths to point within the /settings layout.
 */
import type { ManifestLink } from '../engine/types/manifest-types';

interface AppManifest {
  userMenu: ManifestLink[];
  settingsMenu: ManifestLink[];
  footerLinks: ManifestLink[];
}

export const appManifest: AppManifest = {
  /**
   * Used for the user dropdown menu in the AppHeader.
   * NOTE: Logout is handled by the onClick={logout} in AppHeader,
   * so it's removed from this manifest.
   */
  userMenu: [
    {
      id: 'user.profile',
      // --- FIX: Point to the settings layout ---
      path: '/settings/profile', // Correct path
      title: 'Your Profile',
      icon: 'user',
    },
    {
      id: 'user.settings',
      // --- FIX: Point to the settings layout base ---
      path: '/settings', // Correct path
      title: 'Settings',
      icon: 'settings',
    },
    // --- REMOVED: Logout link is redundant ---
    // {
    //   id: 'user.logout',
    //   path: '/login', // Was pointing here, but onClick is better
    //   title: 'Log Out',
    //   icon: 'logOut',
    // },
  ],

  /**
   * Used for a dedicated settings page (e.g., /settings/...)
   * These paths were already correct.
   */
  settingsMenu: [
    {
      id: 'settings.account',
      path: '/settings/profile',
      title: 'Account',
      icon: 'user',
    },
    {
      id: 'settings.billing',
      path: '/settings/billing',
      title: 'Billing',
      icon: 'creditCard',
    },
    {
      id: 'settings.team',
      path: '/settings/team',
      title: 'Team Members',
      icon: 'users',
    },
  ],

  /**
   * Used in the AppFooter. (Placeholders)
   */
  footerLinks: [
    {
      id: 'footer.help',
      path: '/help',
      title: 'Help Center',
    },
    {
      id: 'footer.terms',
      path: '/terms',
      title: 'Terms of Service',
    },
  ],
};