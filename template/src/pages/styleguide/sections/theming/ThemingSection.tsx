import React, { useState, useEffect } from 'react';
import {
  SectionHeader,
  Card,
  CodeBlock,
  Alert,
  useTheme,
  ButtonGroup,
  Button,
  Icon,
} from '@ramme-io/ui';
import type { ThemeName } from '@ramme-io/ui';


// --- HELPER DATA ---

interface ColorInfo {
  name: string;
  variable: string;
  category: 'Brand' | 'UI' | 'Text & Borders' | 'Form Controls' | 'Notifications' | 'Charts';
}

// UPDATED: Added new color definitions
const colorPaletteData: ColorInfo[] = [
  { name: 'Primary', variable: '--app-primary-color', category: 'Brand' },
  { name: 'Primary Content', variable: '--app-primary-foreground-color', category: 'Brand' },
  { name: 'Secondary', variable: '--app-secondary-color', category: 'Brand' },
  { name: 'Accent', variable: '--app-accent-color', category: 'Brand' },
  { name: 'Destructive', variable: '--app-danger-color', category: 'Brand' },
  { name: 'Page Background', variable: '--app-bg-color', category: 'UI' },
  { name: 'Card Background', variable: '--app-card-bg-color', category: 'UI' },
  { name: 'Default Text', variable: '--app-text-color', category: 'Text & Borders' },
  { name: 'Border', variable: '--app-border-color', category: 'Text & Borders' },
  { name: 'Input Border', variable: '--app-input-border-color', category: 'Form Controls' },
  { name: 'Input Focus Ring', variable: '--app-input-focus-ring-color', category: 'Form Controls' },
  { name: 'Info', variable: '--app-info-color', category: 'Notifications' },
  { name: 'Info Content', variable: '--app-info-foreground-color', category: 'Notifications' },
  { name: 'Success', variable: '--app-success-color', category: 'Notifications' },
  { name: 'Success Content', variable: '--app-success-foreground-color', category: 'Notifications' },
  { name: 'Warning', variable: '--app-warning-color', category: 'Notifications' },
  { name: 'Warning Content', variable: '--app-warning-foreground-color', category: 'Notifications' },
  { name: 'Chart 1', variable: '--app-chart-1', category: 'Charts' },
  { name: 'Chart 2', variable: '--app-chart-2', category: 'Charts' },
  { name: 'Chart 3', variable: '--app-chart-3', category: 'Charts' },
  { name: 'Chart 4', variable: '--app-chart-4', category: 'Charts' },
  { name: 'Chart 5', variable: '--app-chart-5', category: 'Charts' },
];

interface PropertyInfo {
  name: string;
  variable: string;
  category: 'Typography' | 'Shape';
}

const propertyAuditData: PropertyInfo[] = [
  { name: 'Sans Serif Font', variable: '--app-font-sans', category: 'Typography' },
  { name: 'Base Font Size', variable: '--app-font-size-base', category: 'Typography' },
  { name: 'Radius Small', variable: '--app-border-radius-sm', category: 'Shape' },
  { name: 'Radius Medium', variable: '--app-border-radius-md', category: 'Shape' },
  { name: 'Radius Large', variable: '--app-border-radius-lg', category: 'Shape' },
];

// --- HELPER COMPONENTS ---

const ColorSwatch: React.FC<{ color: ColorInfo; value: string }> = ({ color, value }) => {
  if (!value) {
    return <div className="border border-border rounded-lg h-36 bg-background animate-pulse"></div>;
  }
  const [r, g, b] = value.split(' ').map(Number);
  const hex = `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;

  return (
    <div className="border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="h-24" style={{ backgroundColor: `rgb(${value})` }}></div>
      <div className="p-3 text-sm bg-card">
        <p className="font-semibold text-foreground">{color.name}</p>
        <div className="mt-2 text-xs font-mono text-muted-foreground space-y-1">
          <p>var({color.variable})</p>
          <p>{`rgb(${value})`}</p>
          <p>{hex.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

const ColorPalette: React.FC<{ colors: ColorInfo[] }> = ({ colors }) => {
  const { theme } = useTheme();
  const [colorValues, setColorValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      const newValues: Record<string, string> = {};
      colors.forEach(color => {
        newValues[color.variable] = computedStyle.getPropertyValue(color.variable).trim();
      });
      setColorValues(newValues);
    }, 50);

    return () => clearTimeout(timer);
  }, [theme, colors]);

  const groupedColors = colors.reduce((acc, color) => {
      (acc[color.category] = acc[color.category] || []).push(color);
      return acc;
  }, {} as Record<string, ColorInfo[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedColors).map(([category, colorsInCategory]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold mb-3">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {colorsInCategory.map(color => (
              <ColorSwatch key={color.variable} color={color} value={colorValues[color.variable] || ''} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const PropertyDisplay: React.FC<{ property: PropertyInfo; value: string }> = ({ property, value }) => {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-foreground">{property.name}</div>
        <div className="text-xs font-mono text-muted-foreground mt-1">
          var({property.variable})
        </div>
        <div className="text-sm font-mono text-primary mt-2">{value}</div>
      </div>
      {property.category === 'Shape' && (
        <div
          className="w-16 h-16 bg-primary/20 border-2 border-dashed border-primary/50"
          style={{ borderRadius: value }}
        ></div>
      )}
      {property.category === 'Typography' && property.variable.includes('font-sans') && (
        <div className="text-3xl text-primary" style={{ fontFamily: value }}>Aa</div>
      )}
    </div>
  );
};

const LiveAuditSection: React.FC<{ title: string; data: PropertyInfo[] }> = ({ title, data }) => {
  const { theme } = useTheme();
  const [liveValues, setLiveValues] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      const newValues: Record<string, string> = {};
      data.forEach(prop => {
        newValues[prop.variable] = computedStyle.getPropertyValue(prop.variable).trim();
      });
      setLiveValues(newValues);
    }, 50);
    return () => clearTimeout(timer);
  }, [theme, data]);

  return (
    <Card className="mb-6 p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(prop => (
          <PropertyDisplay key={prop.variable} property={prop} value={liveValues[prop.variable] || '...'} />
        ))}
      </div>
    </Card>
  );
};

// --- MAIN COMPONENT ---

const ThemingSection: React.FC = () => {
  const { theme, setTheme, availableThemes, borderRadius, setBorderRadius, fontSize, setFontSize } = useTheme();

  const radii = [ { label: 'None', value: '0rem' }, { label: 'Sm', value: '0.25rem' }, { label: 'Md', value: '0.5rem' }, { label: 'Lg', value: '1rem' }];
  const fontSizes = [ { label: 'Sm', value: '0.875rem' }, { label: 'Base', value: '1rem' }, { label: 'Lg', value: '1.125rem' }];
  
  const themeCssVariables = `
  .dark {
    /* ... existing variables ... */
  }
  `;

  return (
    <div id="theming">
      <SectionHeader title="Theming System" />
      <p className="mt-2 mb-6 text-muted-foreground">
        An interactive guide to the visual identity of your application.
      </p>

      <Card className="mb-6 p-6">
        <h2 className="text-xl font-bold mb-4">Theme Playground</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground/80">Color Theme</label>
            <ButtonGroup>
              {availableThemes.map((t: ThemeName) => (
                <Button 
                  key={t}
                  variant={theme === t ? 'primary' : 'secondary'}
                  onClick={() => setTheme(t)}
                >
                  {t}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground/80">Border Radius</label>
            <ButtonGroup>
              {radii.map(r => (
                <Button
                  key={r.value}
                  variant={borderRadius === r.value ? 'primary' : 'secondary'}
                  onClick={() => setBorderRadius(r.value)}
                >
                  {r.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-foreground/80">Base Font Size</label>
            <ButtonGroup>
              {fontSizes.map(fs => (
                <Button
                  key={fs.value}
                  variant={fontSize === fs.value ? 'primary' : 'secondary'}
                  onClick={() => setFontSize(fs.value)}
                >
                  {fs.label}
                </Button>
              ))}
            </ButtonGroup>
          </div>
        </div>
      </Card>

      <LiveAuditSection title="Live Typography Audit" data={propertyAuditData.filter(p => p.category === 'Typography')} />
      <LiveAuditSection title="Live Shape Audit" data={propertyAuditData.filter(p => p.category === 'Shape')} />
      
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-bold mb-2">Live Color Palette</h2>
        <p className="text-muted-foreground mb-4">The swatches below use the live CSS variables from the active theme. Use the controls above to see them update.</p>
        <ColorPalette colors={colorPaletteData} />
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="text-xl font-bold mb-2">Core Theme Variables</h2>
        <p className="mb-4">To create a theme, copy an existing block in `src/index.css` and customize the variable values.</p>
        <Alert variant="info" title="Color Format" className="mb-4">
          All color variables must be defined as three space-separated R G B values (e.g., `255 255 255`) for Tailwind's opacity modifiers to work.
        </Alert>
        <CodeBlock language="css" code={themeCssVariables.trim()} />
      </Card>
    </div>
  );
};

export default ThemingSection;