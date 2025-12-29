import { type SitemapEntry } from '../../engine/types/sitemap-entry';

// --- PAGE IMPORTS ---
// ✅ Corrected: Kept named import for OverviewPage based on your index.ts export
import { OverviewPage } from '../../features/overview'; 
import AiChat from '../../features/ai/pages/AiChat';

import Styleguide from '../../features/styleguide/Styleguide';

// --- SECTION IMPORTS ---
import TemplatesSection from '../../features/styleguide/sections/templates/TemplatesSection';
import LayoutSection from '../../features/styleguide/sections/layout/LayoutSection';
import ThemingSection from '../../features/styleguide/sections/theming/ThemingSection';
import NavigationSection from '../../features/styleguide/sections/navigation/NavigationSection';
import TablesSection from '../../features/styleguide/sections/tables/TablesSection';
import ChartsSection from '../../features/styleguide/sections/charts/ChartsSection';
import ElementsSection from '../../features/styleguide/sections/elements/ElementsSection';
import FormsSection from '../../features/styleguide/sections/forms/FormsSection';
import FeedbackSection from '../../features/styleguide/sections/feedback/FeedbackSection';
import UtilitiesSection from '../../features/styleguide/sections/utilities/UtilitiesSection';
import ColorsSection from '../../features/styleguide/sections/colors/ColorsSection';
import IconsSection from '../../features/styleguide/sections/icons/IconsSection';

export const docsSitemap: SitemapEntry[] = [
  {
    id: 'dashboard',
    path: '', // Index route
    title: 'Dashboard',
    icon: 'home',
    component: OverviewPage,
  },
  {
    id: 'ai-chat',
    path: 'ai-chat',
    title: 'AI Chat',
    icon: 'bot',
    component: AiChat,
  },
  {
    id: 'styleguide',
    path: 'styleguide',
    title: 'Style Guide',
    icon: 'palette',
    component: Styleguide,
    children: [
        { id: 'templates', path: 'templates', title: 'Templates', component: TemplatesSection },
        { id: 'layout', path: 'layout', title: 'Layout', component: LayoutSection },
        { id: 'theming', path: 'theming', title: 'Theming', component: ThemingSection },
        { id: 'navigation', path: 'navigation', title: 'Navigation', component: NavigationSection },
        { id: 'tables', path: 'tables', title: 'Tables', component: TablesSection },
        { id: 'charts', path: 'charts', title: 'Charts', component: ChartsSection },
        { id: 'elements', path: 'elements', title: 'Elements', component: ElementsSection },
        { id: 'forms', path: 'forms', title: 'Forms', component: FormsSection },
        { id: 'feedback', path: 'feedback', title: 'Feedback', component: FeedbackSection },
        { id: 'utilities', path: 'utilities', title: 'Utilities', component: UtilitiesSection },
        { id: 'colors', path: 'colors', title: 'Colors', component: ColorsSection },
        { id: 'icons', path: 'icons', title: 'Icons', component: IconsSection },
    ],
  },
];