// src/pages/styleguide/sections/feedback/FeedbackSection.tsx
import React from 'react';
import {
  Card,
  Button,
  TippyTooltip,
  EmptyState,
  Alert,
  useToast,
  SectionHeader
} from '@ramme-io/ui';

const FeedbackSection: React.FC = () => {
  const { addToast } = useToast();

  const handleEmptyStateClearSearch = () => {
    addToast('Search cleared!', 'info');
  };
  const handleEmptyStateAddItem = () => {
    addToast('Navigating to "Add Item" page...', 'success');
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Feedback Components" />
      <p className="text-muted-foreground -mt-6">
        Use these components to provide feedback to the user in response to their actions or system events.
      </p>

      {/* Alerts */}
      <Card id="feedback-alerts" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Alerts</h3>
        <div className="space-y-4">
          <Alert variant="info" title="Informational Message">
            This is a standard informational alert.
          </Alert>
          <Alert variant="success" title="Success!">
            Your action was completed successfully.
          </Alert>
          <Alert variant="warning" title="Warning">
            There might be a problem with your configuration.
          </Alert>
          <Alert variant="danger" title="Error: Unable to Proceed">
            We could not save your changes.
          </Alert>
        </div>
      </Card>

      {/* Tooltips */}
      <Card id="feedback-tooltip" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Tooltips</h3>
        <p className="text-muted-foreground mb-6">Tooltips are powered by Tippy.js for robust positioning and accessibility.</p>
        <div className="flex flex-wrap items-center gap-8">
          <TippyTooltip content="This is a top tooltip." placement="top">
            <Button variant="secondary">Hover Me (Top)</Button>
          </TippyTooltip>
          <TippyTooltip content="This is a right tooltip." placement="right">
            <Button variant="secondary">Hover Me (Right)</Button>
          </TippyTooltip>
           <TippyTooltip content="This is a bottom tooltip." placement="bottom">
            <Button variant="secondary">Hover Me (Bottom)</Button>
          </TippyTooltip>
           <TippyTooltip content="This is a left tooltip." placement="left">
            <Button variant="secondary">Hover Me (Left)</Button>
          </TippyTooltip>
        </div>
      </Card>

      {/* Toast Notifications */}
      <Card id="feedback-toast" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Toast Notifications</h3>
         <p className="text-muted-foreground mb-6">Click the buttons to trigger a global toast notification. Ensure the application is wrapped in a <code className="bg-primary/10 text-primary px-1 rounded">ToastProvider</code>.</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={() => addToast('This is a default toast.')}>Show Default</Button>
          <Button onClick={() => addToast('Success message!', 'success')}>Show Success</Button>
          <Button onClick={() => addToast('Informational message.', 'info')}>Show Info</Button>
          <Button onClick={() => addToast('Warning message.', 'warning')}>Show Warning</Button>
          <Button onClick={() => addToast('Error message!', 'error')}>Show Error</Button>
        </div>
      </Card>

      {/* Empty State */}
      <Card id="feedback-empty" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Empty State / No Data</h3>
        <div className="space-y-12">
          <EmptyState
            title="No Data Found"
            description="It looks like there's no information to display here yet."
            icon="bar-chart-2"
          />
          <EmptyState
            title="Search Results Empty"
            description="We couldn't find any items matching your search criteria."
            icon="search"
            actionButton={<Button variant="primary" onClick={handleEmptyStateClearSearch}>Clear Search</Button>}
          />
           <EmptyState
            title="Welcome! Get Started"
            description="You haven't created any items yet. Click the button below to add your first entry."
            icon="rocket"
            actionButton={<Button variant="accent" onClick={handleEmptyStateAddItem}>Add New Item</Button>}
          />
        </div>
      </Card>
    </div>
  );
};

export default FeedbackSection;