import React from 'react';
import {
  BarChart,
  LineChart,
  Card,
  PageHeader,
  StatCard,
  DataTable,
  useDataFetch,
  type ColDef,
  type ValueFormatterParams,
} from '@ramme-io/ui';
import { mockTableData, mockChartData } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { data: fetchedTableData } = useDataFetch(null, mockTableData);

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
        title="Dashboard Overview"
        description="A summary of key metrics and recent activity."
      />

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-foreground">Monthly Revenue</h3>
          <div className="h-[350px] w-full">
            <BarChart
              data={mockChartData}
              dataKeyX="name"
              barKeys={['pv', 'uv']}
            />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-text-foreground">User Growth</h3>
          <div className="h-[350px] w-full">
            <LineChart
              data={mockChartData}
              dataKeyX="name"
              lineKeys={['uv', 'pv']}
            />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-2xl font-semibold mb-4 text-text">Recent Vehicle Data</h3>
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