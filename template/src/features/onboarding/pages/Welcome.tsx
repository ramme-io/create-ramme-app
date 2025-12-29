import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Icon, 
  Badge,
  SectionHeader 
} from '@ramme-io/ui';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HERO */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-violet-600 text-primary-foreground p-8 md:p-12">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-none backdrop-blur-sm">
            v1.2.0 Starter Kit
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Your Ramme App is Ready.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            You have successfully scaffolded a production-ready prototype environment. 
            This kit comes pre-wired with Authentication, Mock Data, and the A.D.A.P.T. architecture.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              variant="secondary" 
              className="font-semibold"
              iconLeft="layout-dashboard"
              onClick={() => navigate('/dashboard/app')}
            >
              Open Live Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              iconLeft="book-open"
              onClick={() => navigate('/docs')}
            >
              Read Documentation
            </Button>
          </div>
        </div>
        
        {/* Decorative Background Icon */}
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <Icon name="box" size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION 1: ARCHITECTURE */}
        <div className="space-y-4">
          <SectionHeader title="Project Architecture" />
          <div className="grid gap-4">
            <Card className="p-4 flex gap-4 hover:border-primary/50 transition-colors cursor-default">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 h-fit">
                <Icon name="database" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Data Lake</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Mock data is seeded into <code>localStorage</code> on boot. 
                  Edit <code>src/data/mockData.ts</code> to change the schema.
                </p>
              </div>
            </Card>

            <Card className="p-4 flex gap-4 hover:border-primary/50 transition-colors cursor-default">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 h-fit">
                <Icon name="git-branch" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Logic Engine</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Workflows and signals are processed in real-time by 
                  <code>useWorkflowEngine.ts</code>. Supports MQTT and simulated sensors.
                </p>
              </div>
            </Card>

            <Card className="p-4 flex gap-4 hover:border-primary/50 transition-colors cursor-default">
              <div className="p-3 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 h-fit">
                <Icon name="layout" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Dynamic Routing</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pages are generated from <code>app.manifest.ts</code>. 
                  Visual blocks connect automatically to data sources.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* SECTION 2: RESOURCES */}
        <div className="space-y-4">
          <SectionHeader title="Developer Resources" />
          
          <Card className="p-6 space-y-6">
            <div>
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Icon name="palette" size={16} className="text-muted-foreground" />
                Component Library
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Browse the full suite of accessible UI components available in this project.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate('/styleguide')}>
                View Style Guide
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Icon name="settings" size={16} className="text-muted-foreground" />
                Configuration
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Manage global settings, user profile templates, and billing layouts.
              </p>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                Open Settings
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="font-semibold flex items-center gap-2 mb-2">
                <Icon name="github" size={16} className="text-muted-foreground" />
                Community
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Need help? Check the docs or open an issue on GitHub.
              </p>
              <a 
                href="https://github.com/ramme-io/create-app" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex"
              >
                <Button variant="ghost" size="sm">GitHub Repo &rarr;</Button>
              </a>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Welcome;