import { type SitemapEntry } from '../../engine/types/sitemap-entry';
import { appManifest } from '../../config/app.manifest';

// Existing pages (Legacy location)
import Welcome from '../../features/onboarding/pages/Welcome'; 
import { OverviewPage } from '../../features/overview'; 
import AiChat from '../../features/ai/pages/AiChat'; 

// ✅ NEW: Import from the Feature Domain (Clean API)
import { UsersPage } from '../../features/users'; 

export const dashboardSitemap: SitemapEntry[] = [
  // 1. The New Landing Page
  {
    id: 'welcome',
    path: 'welcome',
    title: 'Start Here',
    icon: 'rocket',
    component: Welcome,
  },

  // 3. ✅ The User Management Module
  {
    id: 'users',
    path: 'users',
    title: 'Users',
    icon: 'users',
    component: UsersPage,
  }
];

// B. Dynamic Modules
if (appManifest.modules?.includes('ai-chat')) {
  dashboardSitemap.push({
    id: 'ai-chat',
    path: 'ai-chat',
    title: 'AI Assistant',
    icon: 'bot',
    component: AiChat,
  });
}