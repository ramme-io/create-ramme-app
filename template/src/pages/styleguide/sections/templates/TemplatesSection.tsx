// src/pages/styleguide/sections/templates/TemplatesSection.tsx
import React from 'react';
import {
  Card,
  Button,
  Input,
  Icon,
  PageHeader,
  SectionHeader,
  ActionBar,
} from '@ramme-io/ui';


const TemplatesSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Page & Layout Templates" />
      <p className="text-muted-foreground -mt-6">
        Combine these high-level components to quickly build consistent and professional page layouts.
      </p>

      {/* Page Layout Example */}
      <Card id="template-standard" className="scroll-mt-20 p-6">
        <div className="p-6">
          <PageHeader
            title="Standard Page Template"
            description="A standard page layout with a header, content sections, and a persistent action bar."
            actions={
              <Button variant="primary" iconBefore={<Icon name="plus" />}>
                Add New Item
              </Button>
            }
          />
        </div>
        <div className="p-6 border-t border-border space-y-4">
          <SectionHeader title="User Details" />
          <p className="text-muted-foreground">This is the main content area for a section. You can place forms, tables, or any other content here.</p>
          <Input type="text" placeholder="Example Input" />
        </div>
        <ActionBar>
          <Button variant="outline">Cancel</Button>
          <Button variant="primary" iconBefore={<Icon name="save" />}>
            Save Changes
          </Button>
        </ActionBar>
      </Card>

      {/* Responsive Layout Example */}
      <Card id="template-responsive" className="scroll-mt-20 p-6">
        <div className="p-6">
            <PageHeader
                title="Responsive Two-Column Template"
                description="This layout features a sidebar that stacks on mobile screens. Try resizing your browser to see it in action."
            />
        </div>
        <div className="p-6 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <main className="lg:col-span-2 space-y-6">
                    <SectionHeader title="Main Content" />
                    <Card className="p-6">
                        <p className="text-text">This is the primary content area. On large screens, it takes up two-thirds of the available space.</p>
                    </Card>
                </main>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <SectionHeader title="Sidebar" />
                    <Card className="p-6">
                        <h4 className="font-semibold text-text mb-2">Metadata</h4>
                        <p className="text-muted-foreground text-sm">This sidebar stacks below the main content on smaller screens.</p>
                    </Card>
                </aside>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default TemplatesSection;