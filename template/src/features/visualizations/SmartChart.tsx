import React, { useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Card } from '@ramme-io/ui';
import { BarChart3, Bug } from 'lucide-react';

interface SmartChartProps {
  rowData?: any[];
  chartType?: 'bar' | 'line' | 'area' | 'pie';
  xAxis?: string;        
  yAxis?: string;        
  aggregation?: string;
  title?: string;
  className?: string;
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444', '#8b5cf6'];

export const SmartChart: React.FC<SmartChartProps> = ({ 
  rowData = [], chartType = 'bar', xAxis, yAxis, aggregation = 'none', title, className 
}) => {
  
  // 1. DATA PROCESSING ENGINE
  const processedData = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];

    // Fallback: If no xAxis provided, try to find a string key, else use 'id'
    const activeX = xAxis || Object.keys(rowData[0]).find(k => typeof rowData[0][k] === 'string') || 'id';
    
    // Normalize mode
    const mode = aggregation?.toLowerCase() || 'none';

    // SCENARIO A: COUNT
    if (mode === 'count') {
      const counts: Record<string, number> = {};
      rowData.forEach(row => {
        const rawVal = row[activeX];
        // Handle Booleans (true/false) explicitly
        const key = String(rawVal !== undefined && rawVal !== null ? rawVal : 'Unknown');
        counts[key] = (counts[key] || 0) + 1;
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    // SCENARIO B: SUM
    if (mode === 'sum' && yAxis) {
      const sums: Record<string, number> = {};
      rowData.forEach(row => {
        const key = String(row[activeX] ?? 'Unknown');
        const val = Number(row[yAxis]) || 0;
        sums[key] = (sums[key] || 0) + val;
      });
      return Object.entries(sums).map(([name, value]) => ({ name, value }));
    }

    // SCENARIO C: RAW
    return rowData.map(row => ({
      name: String(row[activeX] ?? ''),
      value: yAxis ? Number(row[yAxis]) : 0
    }));

  }, [rowData, xAxis, yAxis, aggregation]);

  // 2. RENDERERS
  const renderChart = () => {
    // If no data to render, show placeholder
    if (processedData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                <BarChart3 size={32} />
                <span className="text-xs mt-2">No Data Available</span>
            </div>
        );
    }

    const type = chartType?.toLowerCase() || 'bar';
    switch (type) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={processedData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {processedData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        );
      case 'line':
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{r:4}} />
          </LineChart>
        );
      case 'area':
        return (
           <AreaChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
          </AreaChart>
        );
      case 'bar': default:
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: '#f1f5f9' }} />
            <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <Card className={`p-4 flex flex-col h-full bg-white border border-border shadow-sm ${className}`}>
      {/* Title Header */}
      <div className="flex items-center justify-between mb-4">
         <div className="flex flex-col">
            {title && <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>}
            {/* Subtitle with Aggregation info */}
            {aggregation && aggregation !== 'none' && (
                <span className="text-[10px] text-muted-foreground font-mono">
                    BY {aggregation.toUpperCase()} ({xAxis})
                </span>
            )}
         </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer>
      </div>

      {/* ✅ DEBUG CONSOLE (Collapsible) */}
      <div className="mt-4 border-t border-border pt-2">
         <details className="text-[10px] text-muted-foreground group">
            <summary className="cursor-pointer hover:text-primary flex items-center gap-2 select-none font-mono">
               <Bug size={12} />
               <span>Debug Configuration</span>
               <span className="ml-auto opacity-50">{rowData?.length || 0} Rows</span>
            </summary>
            <div className="mt-2 p-3 bg-slate-950 text-green-400 rounded-md font-mono overflow-x-auto text-[10px] leading-relaxed shadow-inner">
               <div className="mb-2 pb-2 border-b border-white/10">
                  <span className="text-white font-bold block mb-1">INCOMING PROPS:</span>
                  <div>chartType: <span className="text-yellow-300">"{chartType}"</span></div>
                  <div>aggregation: <span className="text-yellow-300">"{aggregation}"</span></div>
                  <div>xAxis (Key): <span className="text-yellow-300">"{xAxis}"</span></div>
                  <div>yAxis (Val): <span className="text-yellow-300">"{yAxis}"</span></div>
               </div>
               
               <div className="mb-2 pb-2 border-b border-white/10">
                  <span className="text-white font-bold block mb-1">DATA SNAPSHOT (Row 0):</span>
                  {rowData && rowData.length > 0 ? (
                      <pre>{JSON.stringify(rowData[0], null, 2)}</pre>
                  ) : (
                      <span className="text-red-400">No Data Rows Received</span>
                  )}
               </div>

               <div>
                  <span className="text-white font-bold block mb-1">PROCESSED OUTPUT (Top 3):</span>
                  <pre>{JSON.stringify(processedData.slice(0, 3), null, 2)}</pre>
               </div>
            </div>
         </details>
      </div>
    </Card>
  );
};