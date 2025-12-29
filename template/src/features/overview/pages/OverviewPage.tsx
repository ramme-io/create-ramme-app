import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PageHeader, 
  Card,
  BarChart, 
  Button,
  Icon,
  Badge
} from '@ramme-io/ui';

// 1. REMOVE: The Zombie Service Import
// import { userService } from '../../users'; 

// 2. ADD: The Engine Hook & Shared Data
// (Adjust path '../../engine/...' if needed based on your folder structure)
import { useCrudLocalStorage } from '../../../engine/runtime/useCrudLocalStorage';
import { SEED_USERS, type User } from '../../../data/mockData';

// Mock Data for Chart
const revenueData = [
  { name: 'Mon', revenue: 4000, cost: 2400 },
  { name: 'Tue', revenue: 3000, cost: 1398 },
  { name: 'Wed', revenue: 2000, cost: 9800 },
  { name: 'Thu', revenue: 2780, cost: 3908 },
  { name: 'Fri', revenue: 1890, cost: 4800 },
  { name: 'Sat', revenue: 2390, cost: 3800 },
  { name: 'Sun', revenue: 3490, cost: 4300 },
];

// Recreating the StatCard locally (since the old one was custom)
const StatCard = ({ title, value, trend, icon, onClick, className }: any) => (
  <Card 
    className={`p-6 flex items-center justify-between space-x-4 transition-all hover:border-primary/50 ${className || ''}`}
    onClick={onClick}
  >
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
      <div className={`flex items-center text-xs mt-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
        <Icon name={trend > 0 ? 'trending-up' : 'trending-down'} className="h-3 w-3 mr-1" />
        {Math.abs(trend)}% from last month
      </div>
    </div>
    <div className="p-3 bg-muted/50 rounded-full">
      <Icon name={icon} className="h-5 w-5 text-primary" />
    </div>
  </Card>
);

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();

  // 3. REPLACE: Manual fetching with the Reactive Engine
  // This automatically connects to 'ramme_db_users' and keeps the count live
  const { data: users } = useCrudLocalStorage<User>('ramme_db_users', SEED_USERS);
  
  // Calculate count directly from the hook data
  const userCount = users.length;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeader 
             title="Dashboard" 
             description="Overview of your application performance."
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" iconLeft="download">Export</Button>
          <Button iconLeft="plus">New Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Users" 
          value={userCount} // ✅ Uses live data from Data Lake
          trend={+12.5} 
          icon="users" 
          className="cursor-pointer bg-primary/5 border-primary/20"
          onClick={() => navigate('/dashboard/users')}
        />
        <StatCard title="Total Revenue" value="$45,231" trend={+20.1} icon="dollar-sign" />
        <StatCard title="Sales" value="+12,234" trend={+19} icon="credit-card" />
        <StatCard title="Active Now" value="+573" trend={-4} icon="activity" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        <Card className="lg:col-span-4 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Revenue Overview</h3>
            <Badge variant="outline">Weekly</Badge>
          </div>
          <div className="h-[350px] w-full">
            <BarChart 
              data={revenueData} 
              dataKeyX="name" 
              barKeys={['revenue', 'cost']} 
            />
          </div>
        </Card>

        <Card className="lg:col-span-3 p-6 flex flex-col">
          <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
          <div className="space-y-6 overflow-y-auto pr-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <span className="relative flex h-2 w-2 mt-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">System Alert</p>
                  <p className="text-xs text-muted-foreground">Database backup completed.</p>
                  <p className="text-xs text-muted-foreground pt-1">Just now</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};