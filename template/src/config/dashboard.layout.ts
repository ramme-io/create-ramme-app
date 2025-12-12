/**
 * @file dashboard.layout.ts
 * Defines the schema and data for the dynamic dashboard.
 */

// 1. Define the Shape of our "Brain"
export interface DashboardItem {
  id: string;
  component: string;
  props: Record<string, any>;
  signalId?: string; // <-- Mark as Optional (?)
}

export interface DashboardSection {
  id: string;
  title: string;
  type: string;
  columns: number;
  items: DashboardItem[]; // <-- Enforce the type here
}

// 2. The Data (Typed)
export const dashboardLayout: DashboardSection[] = [
  {
    id: "section_iot",
    title: "Live Device Status",
    type: "grid", 
    columns: 3,
    items: [
      {
        id: "dev_1",
        component: "DeviceCard",
        props: {
          title: "Living Room AC",
          description: "Zone A • Floor 1",
          icon: "thermometer",
          status: "online",
          trend: "Cooling to 70°"
        },
        signalId: "living_room_ac" 
      },
      {
        id: "dev_2",
        component: "DeviceCard",
        props: {
          title: "Air Quality",
          description: "Sensor ID: #8842",
          icon: "droplets",
          status: "active",
          trend: "Stable"
        },
        signalId: "living_room_hum"
      },
      {
        id: "dev_3",
        component: "DeviceCard",
        props: {
          title: "Main Server",
          description: "192.168.1.42",
          icon: "server",
          status: "online",
          trend: "CPU Load"
        },
        signalId: "server_01"
      }
    ]
  },
  {
    id: "section_metrics",
    title: "Business Overview",
    type: "grid",
    columns: 4,
    items: [
      {
        id: "stat_1",
        component: "StatCard",
        props: {
          title: "Total Users",
          value: "1,234",
          icon: "users",
          changeText: "+10% from last month",
          changeDirection: "positive"
        }
      },
      {
        id: "stat_2",
        component: "StatCard",
        props: {
          title: "Sales Today",
          value: "$5,678",
          icon: "dollar-sign",
          changeText: "+5% from yesterday",
          changeDirection: "positive"
        }
      }
    ]
  }
];