/**
 * @file mock-charts.ts
 * @description The "Chart Data Lake".
 *
 * ARCHITECTURAL ROLE:
 * This file stores the structured data required by Recharts components.
 * Separating this from the tabular `mockData.ts` prevents bloat and allows
 * for specific optimization of visualization data.
 */

// 1. Define a generic shape for Recharts data
// Recharts expects an array of objects: [{ name: 'A', value: 10 }, ...]
export type RechartsData = Record<string, any>[];

export const MOCK_CHART_DATA: Record<string, RechartsData> = {
  
  // ID: energy_history
  energy_history: [
    { time: "12am", value: 12 },
    { time: "4am", value: 19 },
    { time: "8am", value: 3 },
    { time: "12pm", value: 5 },
    { time: "4pm", value: 2 },
    { time: "8pm", value: 3 }
  ],

  // ID: server_load
  server_load: [
    { day: "Mon", load: 45 },
    { day: "Tue", load: 52 },
    { day: "Wed", load: 38 },
    { day: "Thu", load: 70 },
    { day: "Fri", load: 65 },
    { day: "Sat", load: 30 },
    { day: "Sun", load: 40 }
  ]
};

export const getChartData = (id: string) => {
  return MOCK_CHART_DATA[id] || [];
};