import React from 'react';
import {
  BarChart,
  LineChart,
  Card,
  PageHeader,
  StatCard,
  DataTable,
  useDataFetch,
  DeviceCard, // <-- NEW: Import DeviceCard
  type ColDef,
  type ValueFormatterParams,
} from '@ramme-io/ui';
import { useSignal } from '../hooks/useSignal'; // <-- NEW: Import the Engine
import { mockTableData, mockChartData } from '../data/mockData';

const Dashboard: React.FC = () => {
  // 1. Existing Logic (SaaS Data)
  const { data: fetchedTableData } = useDataFetch(null, mockTableData);

  // 2. New Logic (IoT Engine)
  const temp = useSignal('living_room_ac', { initialValue: 72, min: 68, max: 76, unit: '°F' });
  const hum = useSignal('living_room_hum', { initialValue: 45, min: 40, max: 60, unit: '%' });
  const cpu = useSignal('server_01', { initialValue: 42, min: 10, max: 95, unit: '%' });

  // 3. Table Config
  const columnDefs: ColDef[] = [
    { field: 'make', headerName: 'Make', sortable: true, filter: true },
    { field: 'model', headerName: 'Model', sortable: true, filter: true },
    {
      field: 'price',
      headerName: 'Price',
      valueFormatter: (p: ValueFormatterParams) => '$' + p.value.toLocaleString(),
    },
    {
      field: 'electric',
      headerName: 'Electric',
      cellRenderer: (params: any) => (params.value ? '⚡' : '⛽'),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Command Center"
        description="Real-time device monitoring and business analytics."
      />

      {/* --- SECTION 1: LIVE IOT STATUS (The New Stuff) --- */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Live Device Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DeviceCard
            title="Living Room AC"
            description="Zone A • Floor 1"
            icon="thermometer"
            status="online"
            value={`${temp.value}${temp.unit}`}
            trend="Cooling to 70°"
          />
          <DeviceCard
            title="Air Quality"
            description="Sensor ID: #8842"
            icon="droplets"
            status="active"
            value={`${hum.value}${hum.unit}`}
            trend="Stable"
          />
          <DeviceCard
            title="Main Server"
            description="192.168.1.42"
            icon="server"
            status={cpu.value > 90 ? 'error' : 'online'}
            value={`${cpu.value}${cpu.unit}`}
            trend="CPU Load"
          />
        </div>
      </div>

      {/* --- SECTION 2: BUSINESS METRICS (The Old Stuff) --- */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Business Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value="1,234"
            icon="users"
            changeText="+10% from last month"
            changeDirection="positive"
          />
          <StatCard
            title="Sales Today"
            value="$5,678"
            icon="dollar-sign"
            changeText="+5% from yesterday"
            changeDirection="positive"
          />
          <StatCard
            title="New Orders"
            value="89"
            icon="shopping-cart"
            changeText="-2 since last hour"
            changeDirection="negative"
          />
          <StatCard
            title="Active Projects"
            value="12"
            icon="briefcase"
            footerText="3 nearing completion"
          />
        </div>
      </div>

      {/* --- SECTION 3: ANALYTICS CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Monthly Revenue</h3>
          <div className="h-[350px] w-full">
            <BarChart
              data={mockChartData}
              dataKeyX="name"
              barKeys={['pv', 'uv']}
            />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">User Growth</h3>
          <div className="h-[350px] w-full">
            <LineChart
              data={mockChartData}
              dataKeyX="name"
              lineKeys={['uv', 'pv']}
            />
          </div>
        </Card>
      </div>

      {/* --- SECTION 4: DATA TABLE --- */}
      <Card className="p-6">
        <h3 className="text-2xl font-semibold mb-4 text-foreground">Recent Vehicle Data</h3>
        {fetchedTableData && (
          <DataTable
            rowData={fetchedTableData}
            columnDefs={columnDefs}
            height="400px"
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;