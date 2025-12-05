// src/pages/styleguide/sections/charts/ChartsSection.tsx
import React from 'react';
import {
  BarChart,
  LineChart,
  PieChart,
  ChartWithTable,
  SectionHeader
} from '@ramme-io/ui';

// Mock data included locally for the style guide
const mockChartData = [
  { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Jun', uv: 2390, pv: 3800, amt: 2500 },
];

const mockPieChartData = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];


const ChartsSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Charts & Data Visualization" />
      <p className="text-muted-foreground -mt-6">
        These components are theme-aware wrappers around the Recharts library. For convenience, the `ChartWithTable` component automatically provides a menu to view the underlying data in a table.
      </p>

      {/* Bar Chart with Table View */}
      <div id="charts-bar" className="scroll-mt-20">
        <ChartWithTable
          title="Monthly Revenue"
          data={mockChartData}
          tableHeaders={[
            { key: 'name', label: 'Month' },
            { key: 'pv', label: 'Page Views' },
            { key: 'uv', label: 'Unique Visitors' },
          ]}
        >
          <BarChart
            data={mockChartData}
            dataKeyX="name"
            // FIX: Pass only the keys as an array of strings
            barKeys={['pv', 'uv']}
          />
        </ChartWithTable>
      </div>

      {/* Line Chart with Table View */}
      <div id="charts-line" className="scroll-mt-20">
        <ChartWithTable
          title="User Growth"
          data={mockChartData}
          tableHeaders={[
            { key: 'name', label: 'Month' },
            { key: 'uv', label: 'UV' },
            { key: 'pv', label: 'PV' },
          ]}
        >
          <LineChart
            data={mockChartData}
            dataKeyX="name"
            // FIX: Pass only the keys as an array of strings
            lineKeys={['uv', 'pv']}
          />
        </ChartWithTable>
      </div>

      {/* Pie Chart with Table View */}
      <div id="charts-pie" className="scroll-mt-20">
      <ChartWithTable
        title="Data Distribution"
        data={mockPieChartData}
        tableHeaders={[
          { key: 'name', label: 'Group' },
          { key: 'value', label: 'Value' },
        ]}
      >
        <PieChart data={mockPieChartData} dataKey="value" nameKey="name" />
      </ChartWithTable>
      </div>
    </div>
  );
};

export default ChartsSection;