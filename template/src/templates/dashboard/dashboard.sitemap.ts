import { type SitemapEntry } from '../../core/sitemap-entry';
import { appManifest } from '../../config/app.manifest';
import Dashboard from '../../pages/Dashboard';
import AiChat from '../../pages/AiChat';
import Welcome from '../../pages/Welcome'; // ✅ Import the new page

export const dashboardSitemap: SitemapEntry[] = [
  // ✅ 1. The New Landing Page
  {
    id: 'welcome',
    path: 'welcome',
    title: 'Start Here',
    icon: 'rocket',
    component: Welcome,
  },
];

// A. Dynamic Pages from Manifest
if (appManifest.pages) {
  appManifest.pages.forEach(page => {
    const isDashboard = page.slug === 'dashboard';
    
    dashboardSitemap.push({
      id: page.id,
      title: page.title,
      // ✅ FIX: Map the main dashboard to 'app' instead of root ''
      // This prevents conflict with the layout root
      path: isDashboard ? 'app' : page.slug,
      icon: isDashboard ? 'layout-dashboard' : 'file-text',
      component: Dashboard,
    });
  });
}

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