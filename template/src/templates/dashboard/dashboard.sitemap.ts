import { type SitemapEntry } from '../../core/sitemap-entry';
import { appManifest } from '../../config/app.manifest';
import Dashboard from '../../pages/Dashboard';
import AiChat from '../../pages/AiChat';

export const dashboardSitemap: SitemapEntry[] = [];

// A. Dynamic Pages from Manifest
if (appManifest.pages) {
  appManifest.pages.forEach(page => {
    const isDashboard = page.slug === 'dashboard';
    
    dashboardSitemap.push({
      id: page.id,
      title: page.title,
      // Map root to Dashboard, others to their slug
      path: isDashboard ? '' : page.slug,
      icon: isDashboard ? 'layout-dashboard' : 'file-text',
      component: Dashboard, // Map everything to the Universal Renderer
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