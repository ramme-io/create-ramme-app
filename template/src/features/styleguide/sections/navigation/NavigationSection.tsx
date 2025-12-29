// src/pages/styleguide/sections/navigation/NavigationSection.tsx
import React, { useState } from 'react';
import {
  Card,
  Button,
  Input,
  Stepper,
  Tabs,
  TabPanel,
  Menu,
  MenuItem,
  MenuDivider,
  Breadcrumbs,
  BreadcrumbItem,
  Icon,
  SectionHeader,
} from '@ramme-io/ui';


const NavigationSection: React.FC = () => {
  const handleMenuItemClick = (item: string) => {
    alert(`Menu Item Clicked: ${item}`);
  };

  const stepperSteps = [
    { label: 'Account Setup', summary: 'Create your account' },
    { label: 'Personal Details', summary: 'Add your information' },
    { label: 'Verification', summary: 'Verify your email' },
    { label: 'Done', summary: 'You are all set!' },
  ];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="space-y-8">
      <SectionHeader title="Navigation Components" />
      <p className="text-muted-foreground -mt-6">
        A collection of components designed to help users navigate through pages and content flows.
      </p>

      <Card id="navigation-stepper" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Stepper</h3>
        <p className="text-muted-foreground mb-6">
          Guide users through a multi-step process with the Stepper component.
        </p>
        <Stepper steps={stepperSteps} currentStep={currentStep} />
        <div className="flex justify-center mt-6 gap-4">
            <Button onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>Previous</Button>
            <Button onClick={() => setCurrentStep(s => Math.min(stepperSteps.length - 1, s + 1))} disabled={currentStep === stepperSteps.length - 1}>Next</Button>
        </div>
      </Card>

      <Card id="navigation-tabs" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Tabs with Icons</h3>
        <Tabs defaultActiveTab="tab1">
          <TabPanel id="tab1" label="Dashboard" icon={<Icon name="layout-dashboard" />}>
            <div className="p-4">
                <p className="text-text">Content for the Dashboard tab.</p>
            </div>
          </TabPanel>
          <TabPanel id="tab2" label="Users" icon={<Icon name="users" />}>
            <div className="p-4">
                <p className="text-text">Content for User Management.</p>
            </div>
          </TabPanel>
          <TabPanel id="tab3" label="Settings" icon={<Icon name="settings" />}>
            <div className="p-4">
                <p className="text-text">Content for Application Settings.</p>
            </div>
          </TabPanel>
        </Tabs>
      </Card>

      <Card id="navigation-menus" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Menus</h3>
        <div className="flex flex-wrap items-center gap-8">
          <Menu
            trigger={<Button variant="primary">Menu with Icons</Button>}
          >
            <MenuItem icon={<Icon name="edit" />} onClick={() => handleMenuItemClick('Edit')}>
              Edit Profile
            </MenuItem>
            <MenuItem icon={<Icon name="copy" />} onClick={() => handleMenuItemClick('Duplicate')}>
              Duplicate
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<Icon name="archive" />} onClick={() => handleMenuItemClick('Archive')}>
              Archive
            </MenuItem>
            <MenuItem icon={<Icon name="trash-2" />} onClick={() => handleMenuItemClick('Delete')}>
              Delete
            </MenuItem>
          </Menu>
          
          <Menu
            trigger={<Button variant="secondary">Simple Menu</Button>}
          >
            <MenuItem icon={<Icon name="settings" />} onClick={() => handleMenuItemClick('Account Settings')}>Account Settings</MenuItem>
            <MenuItem icon={<Icon name="user-plus" />} onClick={() => handleMenuItemClick('Invite Team')}>Invite Team</MenuItem>
            <MenuDivider />
            <MenuItem icon={<Icon name="help-circle" />} onClick={() => handleMenuItemClick('Support')}>Support</MenuItem>
          </Menu>
        </div>
      </Card>

      <Card id="navigation-breadcrumbs" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Breadcrumbs with Icons</h3>
        <div className="space-y-4">
          <Breadcrumbs>
            <BreadcrumbItem icon={<Icon name="home" />} label="Home"  />
            <BreadcrumbItem icon={<Icon name="folder" />} label="Dashboard"  />
            <BreadcrumbItem icon={<Icon name="file-text" />} label="Current Page" isCurrent />
          </Breadcrumbs>
        </div>
      </Card>
    </div>
  );
};

export default NavigationSection;