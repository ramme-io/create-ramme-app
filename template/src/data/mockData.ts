// src/data/mockData.ts

// --- 1. Your Existing Examples ---
export const mockChartData = [
  { name: 'Jan', uv: 400, pv: 240 },
  { name: 'Feb', uv: 300, pv: 139 },
  { name: 'Mar', uv: 200, pv: 980 },
  { name: 'Apr', uv: 278, pv: 390 },
  { name: 'May', uv: 189, pv: 480 },
  { name: 'Jun', uv: 239, pv: 380 },
  { name: 'Jul', uv: 349, pv: 430 },
];

export const mockTableData = [
  { make: 'Tesla', model: 'Model Y', price: 64950, electric: true },
  { make: 'Ford', model: 'F-Series', price: 33850, electric: false },
  { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
  { make: 'Mercedes', model: 'EQS', price: 102310, electric: true },
  { make: 'BMW', model: 'i4', price: 51400, electric: true },
];

// 2. FIXED: Energy Data (Recharts Format)
// Recharts expects an Array of Objects, NOT { labels, datasets }
export const energyHistoryData = [
  { time: "12am", value: 12 },
  { time: "4am", value: 19 },
  { time: "8am", value: 3 },
  { time: "12pm", value: 5 },
  { time: "4pm", value: 2 },
  { time: "8pm", value: 3 }
];

// --- 3. The Lookup Registry ---
// This allows the Manifest to refer to data by string ID.
export const MOCK_DATA_REGISTRY: Record<string, any> = {
  'energy_history': energyHistoryData,
  'demo_chart': mockChartData,
  'demo_cars': mockTableData
};

export const getMockData = (id: string) => {
  return MOCK_DATA_REGISTRY[id] || null;
};