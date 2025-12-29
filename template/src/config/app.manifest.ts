import type { AppSpecification } from '../engine/validation/schema';



export const appManifest: AppSpecification = {
  meta: {
    name: "Ramme System Check",
    version: "1.0.0",
    description: "Verifying the Smart Runtime.",
    author: "Ramme Builder",
  },
  config: {
    theme: 'system',
    mockMode: false,
    brokerUrl: 'wss://test.mosquitto.org:8081',
  },
  domain: { signals: [], entities: [] },
  pages: [
    {
      id: "dashboard",
      slug: "dashboard",
      title: "System Status",
      description: "Verifying Week 1 Logic Engine",
      sections: [
        {
          id: "sect-users",
          title: "User Management (CRUD Test)",
          layout: { columns: 1 },
          blocks: [
            {
              id: "table_users",
              type: "SmartTable",
              props: {
                title: "Active Users",
                dataId: "users" // ✅ Points to SEED_USERS
              }
            }
          ]
        },
        {
          id: "sect-invoices",
          title: "Invoices (Relational Test)",
          layout: { columns: 1 },
          blocks: [
            {
              id: "table_invoices",
              type: "SmartTable",
              props: {
                title: "Recent Invoices",
                dataId: "invoices" // ✅ Points to SEED_INVOICES
              }
            }
          ]
        }
      ]
    }
  ]
};