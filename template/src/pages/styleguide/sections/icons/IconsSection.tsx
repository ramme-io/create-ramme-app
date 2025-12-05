// src/pages/styleguide/sections/icons/IconsSection.tsx
import React from 'react';
import { Card, Icon, SectionHeader } from '@ramme-io/ui';
import type { IconName } from '@ramme-io/ui';

// A sample list of icons to display in the gallery.
const iconList: { name: IconName; category: string }[] = [
  { name: 'home', category: 'Navigation' },
  { name: 'user', category: 'User' },
  { name: 'settings', category: 'System' },
  { name: 'search', category: 'Actions' },
  { name: 'plus', category: 'Actions' },
  { name: 'minus', category: 'Actions' },
  { name: 'x', category: 'Actions' },
  { name: 'check', category: 'Actions' },
  { name: 'chevron-down', category: 'Navigation' },
  { name: 'chevron-up', category: 'Navigation' },
  { name: 'chevron-left', category: 'Navigation' },
  { name: 'chevron-right', category: 'Navigation' },
  { name: 'log-out', category: 'User' },
  { name: 'edit', category: 'Actions' },
  { name: 'trash-2', category: 'Actions' },
  { name: 'copy', category: 'Actions' },
  { name: 'mail', category: 'Communication' },
  { name: 'phone', category: 'Communication' },
  { name: 'calendar', category: 'Time' },
  { name: 'clock', category: 'Time' },
  { name: 'bell', category: 'System' },
  { name: 'alert-triangle', category: 'System' },
  { name: 'info', category: 'System' },
  { name: 'help-circle', category: 'System' },
];

const IconsSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Icons (Lucide)" />
      <p className="text-muted-foreground -mt-6">
        This project uses the <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lucide</a> icon library. Use the generic `Icon` component to display any icon by name.
      </p>

      <Card id="icons-usage"  className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Usage</h3>
        <p className="text-muted-foreground mb-4">
          Import the `Icon` component and provide the `name` of the icon you wish to display. You can also pass any other props that Lucide icons accept, such as `size` or `className`.
        </p>
        <div className="bg-card-alt p-4 rounded-md">
          <code className="text-sm text-text whitespace-pre-wrap">
            {`import { Icon } from '@ramme-io/ui';

<Icon name="home" size={24} className="text-primary" />`}
          </code>
        </div>
      </Card>

      <Card id="icons-gallery" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Icon Gallery</h3>
        <p className="text-muted-foreground mb-6">
          This is a small sample of the icons available. For a full list, please visit the official Lucide documentation.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {iconList.map((icon) => (
            <div
              key={icon.name}
              className="flex flex-col items-center justify-center p-4 bg-card-alt rounded-lg text-center"
            >
              <Icon name={icon.name} size={32} className="mb-2 text-text" />
              <code className="text-xs text-muted-foreground">{icon.name}</code>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default IconsSection;