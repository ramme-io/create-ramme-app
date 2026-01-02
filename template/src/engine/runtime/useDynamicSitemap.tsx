import { useMemo } from 'react';
import { useManifest, useBridgeStatus } from './ManifestContext';
import { DynamicPage } from '../renderers/DynamicPage';
import { type SitemapEntry } from '../types/sitemap-entry';
import { type IconName } from '@ramme-io/ui';

/**
 * @hook useDynamicSitemap
 * @description 
 * - In 'Static Mode' (npm run dev): Merges dynamic pages with the hardcoded sitemap.
 * - In 'Live Mode' (Builder): REPLACES the sitemap entirely to show only the user's design.
 */
export const useDynamicSitemap = (staticSitemap: SitemapEntry[]) => {
  const manifest = useManifest();
  const status = useBridgeStatus();
  const isLive = status === 'live'; // ✅ Detect Live Mode

  return useMemo(() => {
    // 1. Convert Manifest Pages -> Sitemap Entries
    const dynamicEntries: SitemapEntry[] = (manifest.pages || []).map((page) => ({
      id: page.id,
      path: page.slug,
      title: page.title,
      icon: (page.icon as IconName) || 'layout',
      component: () => <DynamicPage pageId={page.id} />
    }));

    // 2. ✅ OPTIMIZATION: Exclusive Mode
    // If we are connected to the Builder (Live) AND have dynamic content,
    // we drop the static "Showcase" pages. 
    // This makes the Kernel feel like a blank slate to the user.
    if (isLive && dynamicEntries.length > 0) {
        // console.log("🚀 [Sitemap] Live Mode Active: Hiding static pages.");
        return dynamicEntries;
    }

    // 3. Static/Hybrid Mode (Keep existing logic for local dev)
    const staticIds = new Set(staticSitemap.map(s => s.id));
    const uniqueDynamic = dynamicEntries.filter(d => !staticIds.has(d.id));

    return [...staticSitemap, ...uniqueDynamic];
  }, [manifest, staticSitemap, isLive]);
};