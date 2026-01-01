import { useMemo } from 'react';
import { useManifest } from './ManifestContext';
import { DynamicPage } from '../renderers/DynamicPage';
import { type SitemapEntry } from '../types/sitemap-entry';
import { type IconName } from '@ramme-io/ui';

/**
 * @hook useDynamicSitemap
 * @description Merges the static sitemap (boilerplate) with dynamic pages from the Live Manifest.
 */
export const useDynamicSitemap = (staticSitemap: SitemapEntry[]) => {
  const manifest = useManifest();

  return useMemo(() => {
    // 1. Convert Manifest Pages -> Sitemap Entries
    const dynamicEntries: SitemapEntry[] = (manifest.pages || []).map((page) => ({
      id: page.id,
      path: page.slug,
      title: page.title,
      icon: (page.icon as IconName) || 'layout', // Default icon
      // ⚡️ MAGIC: We create a component wrapper on the fly
      component: () => <DynamicPage pageId={page.id} />
    }));

    // 2. Filter out duplicates (if a dynamic page overrides a static ID)
    const staticIds = new Set(staticSitemap.map(s => s.id));
    const uniqueDynamic = dynamicEntries.filter(d => !staticIds.has(d.id));

    // 3. Return Combined List
    return [...staticSitemap, ...uniqueDynamic];
  }, [manifest, staticSitemap]);
};