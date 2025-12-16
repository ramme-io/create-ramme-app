import type { AppSpecification } from '../types/schema';

export const appManifest: AppSpecification = {
  meta: {
    name: "Acme Corp Admin",
    version: "2.0.0",
    description: "Executive overview of KPI metrics.",
    author: "Ramme Builder"
  },
  config: {
    theme: 'corporate', // <--- Switches the visual theme automatically
    mockMode: false     // <--- Critical: Tells the Adapter Factory to use REAL code (HTTP/MQTT)
  },
  domain: {
    signals: [
      {
        id: "mrr_stripe",
        label: "Monthly Revenue",
        kind: "metric",
        source: "http", // <--- This triggers your new generateHttpImplementation()
        endpoint: "/api_mock.json",
        unit: "USD",
        defaultValue: 0,
        refreshRate: 0
      },
      {
        id: "active_users",
        label: "Active Users",
        kind: "metric",
        source: "http",
        endpoint: "/api_mock.json",
        unit: "",
        defaultValue: 0,
        refreshRate: 0
      }
    ],
    entities: [
      {
        id: "widget_mrr",
        name: "Current MRR",
        type: "kpi",
        signals: ["mrr_stripe"],
        ui: { dashboardComponent: "StatCard", icon: "dollar-sign" },
        category: ''
      },
      {
        id: "widget_users",
        name: "Total Users",
        type: "kpi",
        signals: ["active_users"],
        ui: { dashboardComponent: "StatCard", icon: "users" },
        category: ''
      }
    ]
  }
};