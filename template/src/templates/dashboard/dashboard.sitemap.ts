import { type SitemapEntry } from '../../core/sitemap-entry';

// Component Imports
import Dashboard from '../../pages/Dashboard';
import AiChat from '../../pages/AiChat';
import DataGridPage from '../../pages/DataGridPage';
import Styleguide from '../../pages/styleguide/Styleguide';
import DataLayout from '../../layouts/DataLayout';

// Style Guide Section Imports
import TemplatesSection from '../../pages/styleguide/sections/templates/TemplatesSection';
import LayoutSection from '../../pages/styleguide/sections/layout/LayoutSection';
import ThemingSection from '../../pages/styleguide/sections/theming/ThemingSection';
import NavigationSection from '../../pages/styleguide/sections/navigation/NavigationSection';
import TablesSection from '../../pages/styleguide/sections/tables/TablesSection';
import ChartsSection from '../../pages/styleguide/sections/charts/ChartsSection';
import ElementsSection from '../../pages/styleguide/sections/elements/ElementsSection';
import FormsSection from '../../pages/styleguide/sections/forms/FormsSection';
import FeedbackSection from '../../pages/styleguide/sections/feedback/FeedbackSection';
import UtilitiesSection from '../../pages/styleguide/sections/utilities/UtilitiesSection';
import ColorsSection from '../../pages/styleguide/sections/colors/ColorsSection';
import IconsSection from '../../pages/styleguide/sections/icons/IconsSection';

// --- ADD THIS IMPORT ---
import ItemSelectorPage from '../../pages/prototypes/ItemSelectorPage';


export const dashboardSitemap: SitemapEntry[] = [
  {
    id: 'dashboard',
    path: '',
    title: 'Home Overview',
    icon: 'layout-dashboard',
    component: Dashboard,
  },
  
    // --- ADD THIS NEW SITEMAP ENTRY ---
  {
    id: 'entity-selector-prototype',
    path: 'prototypes/entity-selector',
    title: 'Entity Prototype',
    icon: 'beaker',
    component: ItemSelectorPage,
  },
  {
    id: 'ai-chat',
    path: 'ai-chat',
    title: 'AI Chat',
    icon: 'bot',
    component: AiChat,
  },
  {
    id: 'data',
    path: 'data',
    title: 'Data',
    icon: 'database',
    component: DataLayout,
    children: [
      { id: 'users', path: 'users', title: 'Users', component: DataGridPage, icon: 'table' }
    ],
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