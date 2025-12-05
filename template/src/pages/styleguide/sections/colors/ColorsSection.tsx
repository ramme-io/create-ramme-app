// src/pages/styleguide/sections/colors/ColorsSection.tsx
import React from 'react';
import { Card, SectionHeader } from '@ramme-io/ui';

// Sub-component for your themed colors
const ThemeColorSwatch: React.FC<{ name: string; utility: string; }> = ({ name, utility }) => {
  const bgClass = utility.startsWith('text-') ? 'bg-background' : `bg-${utility.split('-')[1]}`;
  const textClass = utility.startsWith('text-') ? 'text-text' : '';
  const borderClass = utility.startsWith('border-') ? 'border-4 border-border' : 'border border-border';

  return (
    <div className="flex flex-col w-36 text-center">
      <div className={`h-24 w-full rounded-lg flex items-center justify-center ${bgClass} ${borderClass}`}>
        {utility.startsWith('text-') && <span className={`text-2xl font-bold ${textClass}`}>Aa</span>}
      </div>
      <div className="mt-2">
        <p className="font-semibold text-text">{name}</p>
        <p className="text-sm text-muted-foreground font-mono">{utility}</p>
      </div>
    </div>
  );
};

// Sub-component for default Tailwind colors
const TailwindColorSwatch: React.FC<{ name: string; className: string; }> = ({ name, className }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className={`w-10 h-10 rounded-full shrink-0 ${className}`} />
      <div className="text-sm font-medium text-text">{name}</div>
    </div>
  );
};

// The main component for the full colors page
const ColorsSection: React.FC = () => {
  const themeColors = [
    { name: 'Primary', utility: 'bg-primary' },
    { name: 'Secondary', utility: 'bg-secondary' },
    { name: 'Accent', utility: 'bg-accent' },
    { name: 'Text', utility: 'text-text' },
    { name: 'Background', utility: 'bg-background' },
    { name: 'Card', utility: 'bg-card' },
    { name: 'Border', utility: 'border-border' },
    { name: 'Hover', utility: 'bg-bg-hover' },
  ];

  const defaultColors = [
    { name: 'Slate', className: 'bg-slate-500' },
    { name: 'Gray', className: 'bg-gray-500' },
    { name: 'Zinc', className: 'bg-zinc-500' },
    { name: 'Neutral', className: 'bg-neutral-500' },
    { name: 'Stone', className: 'bg-stone-500' },
    { name: 'Red', className: 'bg-red-500' },
    { name: 'Orange', className: 'bg-orange-500' },
    { name: 'Amber', className: 'bg-amber-500' },
    { name: 'Yellow', className: 'bg-yellow-500' },
    { name: 'Lime', className: 'bg-lime-500' },
    { name: 'Green', className: 'bg-green-500' },
    { name: 'Emerald', className: 'bg-emerald-500' },
    { name: 'Teal', className: 'bg-teal-500' },
    { name: 'Cyan', className: 'bg-cyan-500' },
    { name: 'Sky', className: 'bg-sky-500' },
    { name: 'Blue', className: 'bg-blue-500' },
    { name: 'Indigo', className: 'bg-indigo-500' },
    { name: 'Violet', className: 'bg-violet-500' },
    { name: 'Purple', className: 'bg-purple-500' },
    { name: 'Fuchsia', className: 'bg-fuchsia-500' },
    { name: 'Pink', className: 'bg-pink-500' },
    { name: 'Rose', className: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
       <SectionHeader title="Color Palette" />
       <p className="text-muted-foreground -mt-6">A showcase of the dynamic, theme-aware colors and the default Tailwind CSS color palette available for use.</p>
      
      <Card id="colors-theme" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-2 text-text">Themed Color Palette</h3>
        <p className="text-muted-foreground mb-8">
          These colors are defined by the current theme and will change dynamically when you switch themes. These colors are defined in the theme and can be applied using utility classes like bg-*, text-*, and border-*.
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {themeColors.map((color) => (
            <ThemeColorSwatch
              key={color.name}
              name={color.name}
              utility={color.utility}
            />
          ))}
        </div>
      </Card>
      
      <Card id="colors-tailwind" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-2 text-text">Default Tailwind Palette</h3>
        <p className="text-muted-foreground mb-8">
          A summary of the static default colors built into Tailwind CSS. Each color typically comes in 10 shades (e.g., `slate-50` to `slate-900`).
          You can view the{' '}
          <a
            href="https://tailwindcss.com/docs/customizing-colors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            full palette on the official documentation site
          </a>.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8">
          {defaultColors.map((color) => (
            <TailwindColorSwatch
              key={color.name}
              name={color.name}
              className={color.className}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ColorsSection;