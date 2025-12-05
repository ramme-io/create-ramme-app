// src/pages/styleguide/sections/layout/LayoutSection.tsx
import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  Icon,
  Accordion,
  AccordionItem,
  useTheme,
  SectionHeader,
  type ThemeName,
} from '@ramme-io/ui';

const LayoutSection: React.FC = () => {
  const { theme, availableThemes, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drawer states specific to this section
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);
  const [isLeftDrawerOpen, setIsLeftDrawerOpen] = useState(false);
  const [isTopDrawerOpen, setIsTopDrawerOpen] = useState(false);
  const [isBottomDrawerOpen, setIsBottomDrawerOpen] = useState(false);

  return (
    <div className="space-y-8">
      <SectionHeader title="Layout & Structure" />
      <p className="text-muted-foreground -mt-6">
        This section showcases high-level components for structuring pages and content. For low-level layout helpers like flexbox or grid, see the "Utilities" section.
      </p>

      {/* Theme Info */}
      <Card id="layout-theme"  className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Theme Controls</h3>
        <p className="text-lg text-muted-foreground">
          Active Theme: <span className="font-bold text-primary">{theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
        </p>
        <div className="mt-4 flex items-center space-x-2">
          <label htmlFor="layout-theme-select" className="text-text">Switch Theme:</label>
          <Select
            id="layout-theme-select"
            options={availableThemes.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))}
            value={theme}
            onChange={(e) => setTheme(e.target.value as ThemeName)}
            className="w-40"
          />
        </div>
      </Card>

      {/* Typography */}
      <Card id="layout-typography" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Typography</h3>
         <p className="text-muted-foreground mb-6">
          The typographic scale is controlled by font-size (<code className="bg-primary/10 text-primary px-1 rounded">text-*</code>) and font-weight (<code className="bg-primary/10 text-primary px-1 rounded">font-*</code>) utility classes.
        </p>
        <div className="space-y-4">
            <div className="flex items-baseline justify-between"><h1 className="text-5xl font-extrabold text-text">Heading 1</h1><code className="text-sm text-muted-foreground">.text-5xl .font-extrabold</code></div>
            <div className="flex items-baseline justify-between"><h2 className="text-4xl font-bold text-text">Heading 2</h2><code className="text-sm text-muted-foreground">.text-4xl .font-bold</code></div>
            <div className="flex items-baseline justify-between"><h3 className="text-3xl font-semibold text-text">Heading 3</h3><code className="text-sm text-muted-foreground">.text-3xl .font-semibold</code></div>
            <div className="flex items-baseline justify-between"><p className="text-base text-text">Paragraph text</p><code className="text-sm text-muted-foreground">.text-base</code></div>
            <div className="flex items-baseline justify-between"><p className="text-sm text-muted-foreground">Small text for captions</p><code className="text-sm text-muted-foreground">.text-sm</code></div>
        </div>
      </Card>

      {/* Card Examples */}
      <Card id="layout-card" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Cards</h3>
        <p className="text-muted-foreground mb-6">
          The Card is a flexible container. Use props to override default theme styles for background, border, padding, and shadow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6"><h4 className="font-semibold text-lg mb-2 text-text">Default Card</h4><p className="text-text-light">This card uses theme defaults.</p></Card>
          <Card className="p-6" shadow="shadow-xl"><h4 className="font-semibold text-lg mb-2 text-text">Shadow Override</h4><p className="text-text-light">This card has a large `shadow-xl`.</p></Card>
          <Card className="p-6" background="bg-primary/30" border="border-2 border-primary/50"><h4 className="font-semibold text-lg mb-2 text-primary">Style Override</h4><p className="text-primary/80">Custom background and a thicker, colored border.</p></Card>
        </div>
      </Card>

      {/* Modals */}
      <Card id="layout-modal" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Modals</h3>
        <Button onClick={() => setIsModalOpen(true)} variant="accent">Open Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Layout Test Modal"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirm</Button>
            </div>
          }
        >
          <p className="text-text">This is a modal instance from the layout section.</p>
          <Input type="text" placeholder="Modal Input Field" className="mt-4" />
        </Modal>
      </Card>

      {/* Drawers */}
      <Card id="layout-drawer" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Drawers</h3>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => setIsRightDrawerOpen(true)}>Open Right Drawer</Button>
          <Button onClick={() => setIsLeftDrawerOpen(true)}>Open Left Drawer</Button>
          <Button onClick={() => setIsTopDrawerOpen(true)}>Open Top Drawer</Button>
          <Button onClick={() => setIsBottomDrawerOpen(true)}>Open Bottom Drawer</Button>
        </div>
        <Drawer isOpen={isRightDrawerOpen} onClose={() => setIsRightDrawerOpen(false)} position="right" title="Right-Side Drawer"><p className="p-4 text-text">This drawer slides in from the right.</p></Drawer>
        <Drawer isOpen={isLeftDrawerOpen} onClose={() => setIsLeftDrawerOpen(false)} position="left" title="Left-Side Drawer"><p className="p-4 text-text">This drawer slides in from the left.</p></Drawer>
        <Drawer isOpen={isTopDrawerOpen} onClose={() => setIsTopDrawerOpen(false)} position="top" title="Top Drawer"><p className="p-4 text-text">This drawer slides down from the top.</p></Drawer>
        <Drawer isOpen={isBottomDrawerOpen} onClose={() => setIsBottomDrawerOpen(false)} position="bottom" title="Bottom Drawer"><p className="p-4 text-text">This drawer slides up from the bottom.</p></Drawer>
      </Card>

      {/* Accordion */}
      <Card id="layout-accordion" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Accordion / Collapsible Panels</h3>
        <Accordion>
          <AccordionItem id="item1" header="Section 1: What is this boilerplate?"><p className="p-4 text-text">This is a React and Tailwind CSS boilerplate designed for rapid prototyping. It comes with a comprehensive set of pre-built, theme-aware UI components.</p></AccordionItem>
          <AccordionItem id="item2" header="Section 2: How do I use it?"><p className="p-4 text-text">Simply use `npm create ramme-app@latest` to start a new project. Explore this Style Guide for component examples.</p></AccordionItem>
        </Accordion>
      </Card>
    </div>
  );
};

export default LayoutSection;