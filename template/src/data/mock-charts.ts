// src/data/mock-charts.ts
import type { ChartData } from 'chart.js';

// The centralized registry of "Heavy Data"
export const MOCK_CHART_DATA: Record<string, ChartData<any>> = {
  
  // ID: energy_history
  energy_history: {
    labels: ["12am", "4am", "8am", "12pm", "4pm", "8pm"],
    datasets: [
      {
        label: "Energy (kWh)",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.4
      }
    ]
  },

  // ID: server_load
  server_load: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "CPU Load %",
        data: [45, 52, 38, 70, 65, 30, 40],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.5)"
      }
    ]
  }
};

export const getChartData = (id: string) => {
  return MOCK_CHART_DATA[id] || null;
};