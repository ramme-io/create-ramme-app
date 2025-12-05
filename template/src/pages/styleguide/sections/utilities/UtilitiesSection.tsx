// src/pages/styleguide/sections/utilities/UtilitiesSection.tsx
import React from 'react';
import { Card, SectionHeader } from '@ramme-io/ui';

// A small component to render the visual items inside our flex examples
const FlexItem: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`h-8 w-8 rounded-md bg-primary flex-shrink-0 ${className}`} />
);


// Updated component to accept an optional description and a more flexible example
const UtilityClassReference: React.FC<{
  title: string;
  classes: {
    name: string;
    description: string;
    exampleClass?: string;
    exampleNode?: React.ReactNode; // Allow passing a custom node for the example
  }[];
  sectionDescription?: React.ReactNode;
}> = ({ title, classes, sectionDescription }) => (
  <Card className="mb-8 p-6">
    <h3 className="text-2xl font-semibold mb-2 text-text">{title}</h3>
    {/* Render the description if it exists */}
    {sectionDescription && <div className="mb-4 text-text-light">{sectionDescription}</div>}
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b-2 border-border text-text w-1/4">Class Name</th>
            <th className="p-2 border-b-2 border-border text-text w-1/2">Description</th>
            <th className="p-2 border-b-2 border-border text-text w-1/4">Example</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((item, index) => (
            <tr key={index} className="hover:bg-primary/5">
              <td className="p-2 border-b border-border text-text-light font-mono">{item.name}</td>
              <td className="p-2 border-b border-border text-text-light">{item.description}</td>
              <td className="p-2 border-b border-border">
                {/* Render the custom node if it exists, otherwise fall back to the simple class example */}
                {item.exampleNode ? item.exampleNode : (
                  <div className={`flex items-center justify-center p-2 rounded ${item.exampleClass}`}>
                    <span className={`text-sm ${item.exampleClass?.includes('text-') ? '' : 'text-text'}`}>{item.name}</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const UtilitiesSection: React.FC = () => {
  const spacingClasses = [
    { name: 'p-4', description: 'Sets 1rem (16px) of padding on all sides.', exampleClass: 'bg-primary/10' },
    { name: 'pt-6', description: 'Sets 1.5rem of padding on the top.', exampleClass: 'bg-primary/10' },
    { name: 'px-8', description: 'Sets 2rem of padding on the left and right (x-axis).', exampleClass: 'bg-primary/10' },
    { name: 'm-2', description: 'Sets 0.5rem of margin on all sides.', exampleClass: 'bg-accent/20' },
    { name: 'mx-auto', description: 'Sets auto margin on the left and right, often for centering.', exampleClass: 'bg-accent/20 w-1/2' },
  ];

  const flexboxClasses = [
    { name: 'justify-start', description: 'Aligns items to the start of the main axis.', exampleNode: <div className="flex justify-start border border-border rounded-md p-2 space-x-2"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
    { name: 'justify-center', description: 'Aligns items to the center of the main axis.', exampleNode: <div className="flex justify-center border border-border rounded-md p-2 space-x-2"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
    { name: 'justify-end', description: 'Aligns items to the end of the main axis.', exampleNode: <div className="flex justify-end border border-border rounded-md p-2 space-x-2"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
    { name: 'justify-between', description: 'Distributes items evenly with space between them.', exampleNode: <div className="flex justify-between border border-border rounded-md p-2"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
    { name: 'items-start', description: 'Aligns items to the start of the cross-axis.', exampleNode: <div className="flex items-start border border-border rounded-md p-2 h-20 space-x-2"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
    { name: 'items-center', description: 'Aligns items to the center of the cross-axis.', exampleNode: <div className="flex items-center border border-border rounded-md p-2 h-20 space-x-2"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
    { name: 'gap-4', description: 'Sets a 1rem gap between flex items.', exampleNode: <div className="flex justify-start border border-border rounded-md p-2 gap-4"><FlexItem /><FlexItem className="bg-secondary" /><FlexItem className="bg-accent" /></div> },
  ];

  const typographyClasses = [
    { name: 'text-lg', description: 'Sets a large font size.', exampleClass: 'text-lg' },
    { name: 'font-bold', description: 'Applies a bold font weight.', exampleClass: 'font-bold' },
    { name: 'text-center', description: 'Centers the text.', exampleClass: 'text-center' },
    { name: 'text-primary', description: 'Applies the primary theme color to the text.', exampleClass: 'text-primary font-semibold' },
    { name: 'italic', description: 'Makes the text italic.', exampleClass: 'italic' },
    { name: 'truncate', description: 'Truncates overflowing text with an ellipsis.', exampleClass: 'truncate w-24' },
  ];

  const borderClasses = [
    { name: 'rounded-lg', description: 'Applies a large border radius.', exampleClass: 'border-2 border-accent h-10' },
    { name: 'border-2', description: 'Sets a 2px border width.', exampleClass: 'border-2 border-primary h-10' },
    { name: 'border-dashed', description: 'Sets the border style to dashed.', exampleClass: 'border-2 border-dashed border-secondary h-10' },
    { name: 'divide-y', description: 'Adds a border between vertical items.', exampleClass: '' },
  ];

  const shadowClasses = [
    { name: 'shadow-sm', description: 'Applies a small box shadow.', exampleClass: 'shadow-sm border border-border' },
    { name: 'shadow-lg', description: 'Applies a large box shadow.', exampleClass: 'shadow-lg border border-border' },
    { name: 'shadow-inner', description: 'Applies an inner shadow.', exampleClass: 'shadow-inner border border-border' },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Tailwind CSS Utility Classes" />
      <p className="text-text-light -mt-6 mb-8">
        A quick reference for some of the most common utility classes available in Tailwind. For a full list, always refer to the official Tailwind CSS documentation.
      </p>

      <div id="utilities-spacing" className=" scroll-mt-20">
        <UtilityClassReference
        title="Spacing (Padding & Margin)"
        classes={spacingClasses}
        sectionDescription={ <p>Tailwind's spacing scale is based on a <code className="bg-primary/10 text-primary px-1 rounded">0.25rem</code> unit, where <code className="bg-primary/10 text-primary px-1 rounded">1rem = 16px</code> by default. The number in the class name is a multiplier. For example, <code className="bg-primary/10 text-primary px-1 rounded">p-4</code> equals <code className="bg-primary/10 text-primary px-1 rounded">4 * 0.25rem = 1rem (16px)</code>.</p> }
      />
      </div>


      <div id="utilities-flexbox" className=" scroll-mt-20">
        <UtilityClassReference
        title="Flexbox"
        classes={flexboxClasses}
        sectionDescription={ <p>Flexbox is a layout model for arranging items in a single dimension—either a row or a column. Use <code className="bg-primary/10 text-primary px-1 rounded">justify-*</code> to control spacing along the main axis and <code className="bg-primary/10 text-primary px-1 rounded">items-*</code> for alignment on the cross axis.</p> }
      />
      </div>

      {/* Moved Layout Utilities Section */}
      <Card id="utilities-layout" className="p-6 mb-8 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-2 text-text">Layout (Display, Sizing, Position)</h3>
        <p className="text-text-light mb-6">
          Use these utility classes to control the display, sizing, and positioning of elements. These are fundamental for building any UI structure.
        </p>
        <div className="space-y-8">
          <div>
            <h4 className="text-lg font-semibold mb-2 text-text">Display</h4>
            <div className="space-y-4">
              <div><p className="text-text-light mb-1"><code className="bg-primary/10 text-primary px-1 rounded">display: block</code> (takes up the full width available)</p><div className="bg-secondary/20 p-2 rounded-md"><div className="block bg-secondary text-white p-2 rounded">.block</div><div className="block bg-secondary text-white p-2 rounded mt-1">.block</div></div></div>
              <div><p className="text-text-light mb-1"><code className="bg-primary/10 text-primary px-1 rounded">display: inline-block</code> (flows with text, respects width/height)</p><div className="bg-secondary/20 p-2 rounded-md"><div className="inline-block bg-secondary text-white p-2 rounded">.inline-block</div><div className="inline-block bg-secondary text-white p-2 rounded ml-1">.inline-block</div></div></div>
              <div><p className="text-text-light mb-1"><code className="bg-primary/10 text-primary px-1 rounded">display: grid</code> (for two-dimensional layouts)</p><div className="grid grid-cols-3 gap-2 bg-secondary/20 p-2 rounded-md"><div className="bg-secondary text-white p-2 rounded text-center">1</div><div className="bg-secondary text-white p-2 rounded text-center">2</div><div className="bg-secondary text-white p-2 rounded text-center">3</div></div></div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mt-6 mb-2 text-text">Sizing</h4>
            <div className="space-y-4">
              <div><p className="text-text-light mb-1"><code className="bg-primary/10 text-primary px-1 rounded">w-1/2</code> (50% width)</p><div className="bg-accent/20 p-2 rounded-md"><div className="w-1/2 bg-accent text-white p-2 rounded">.w-1/2</div></div></div>
              <div><p className="text-text-light mb-1"><code className="bg-primary/10 text-primary px-1 rounded">w-full</code> (100% width)</p><div className="bg-accent/20 p-2 rounded-md"><div className="w-full bg-accent text-white p-2 rounded">.w-full</div></div></div>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mt-6 mb-2 text-text">Positioning</h4>
            <p className="text-text-light mb-2">Positioning utilities require a parent with a set position (like <code className="bg-primary/10 text-primary px-1 rounded">relative</code>) for <code className="bg-primary/10 text-primary px-1 rounded">absolute</code> children to be placed correctly.</p>
            <div className="relative bg-red-600/10 p-4 rounded-md h-24"><p className="text-text-light">Parent (.relative)</p><div className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded text-sm">.absolute .top-2 .right-2</div></div>
          </div>
        </div>
      </Card>

      <div id="utilities-typography" className="scroll-mt-20">
        <UtilityClassReference title="Typography" classes={typographyClasses} />
        </div>
      <div id="utilities-borders" className="scroll-mt-20">
        <UtilityClassReference title="Borders & Rounded Corners" classes={borderClasses} />
        </div>
      <div id="utilities-shadows" className="scroll-mt-20">
        <UtilityClassReference title="Shadows" classes={shadowClasses} />
        </div>
    </div>
  );
};

export default UtilitiesSection;