/**
 * @file src/data/mockData.ts
 * @description The "Golden Copy" of seed data. 
 * These records are injected into localStorage when the app first launches.
 */

// ✅ 1. Interface for the Metadata (Schema)
export interface ResourceMeta {
  name: string;
  fields: {
    key: string;
    label: string;
    type: string;
    required?: boolean;
    defaultValue?: any;
    description?: string;
  }[];
}

// --- DATA INTERFACES ---

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'banned';
  avatar?: string;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface Invoice {
  id: string;
  userId: string; // Foreign Key -> User
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
}

export interface Review {
  id: string;
  productId: string; // Foreign Key -> Product
  rating: number;
  comment: string;
  author: string;
  date: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  user: string;
}

// --- SEED DATA ---

export const SEED_USERS: User[] = [
  { id: 'usr_1', name: 'Alex Carter', email: 'alex@example.com', role: 'admin', status: 'active', joinedAt: '2023-01-15' },
  { id: 'usr_2', name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'editor', status: 'active', joinedAt: '2023-03-22' },
  { id: 'usr_3', name: 'Mike Ross', email: 'mike@example.com', role: 'viewer', status: 'pending', joinedAt: '2023-05-10' },
  { id: 'usr_4', name: 'Emily Blunt', email: 'emily@example.com', role: 'editor', status: 'banned', joinedAt: '2023-06-01' },
];

export const SEED_PRODUCTS: Product[] = [
  { id: 'prod_1', name: 'ErgoChair Pro', category: 'Furniture', price: 450, stock: 12, status: 'in_stock' },
  { id: 'prod_2', name: 'Standing Desk', category: 'Furniture', price: 600, stock: 3, status: 'low_stock' },
  { id: 'prod_3', name: 'Monitor Arm', category: 'Accessories', price: 120, stock: 0, status: 'out_of_stock' },
  { id: 'prod_4', name: 'Mechanical Keyboard', category: 'Electronics', price: 180, stock: 25, status: 'in_stock' },
];

export const SEED_INVOICES: Invoice[] = [
  { id: 'inv_001', userId: 'usr_2', amount: 450.00, status: 'paid', date: '2023-10-01' },
  { id: 'inv_002', userId: 'usr_1', amount: 1200.50, status: 'pending', date: '2023-10-05' },
  { id: 'inv_003', userId: 'usr_3', amount: 180.00, status: 'overdue', date: '2023-09-15' },
  { id: 'inv_004', userId: 'usr_2', amount: 600.00, status: 'paid', date: '2023-10-10' },
];

export const SEED_REVIEWS: Review[] = [
  { id: 'rev_1', productId: 'prod_1', rating: 5, comment: 'Life changing comfort!', author: 'Alex Carter', date: '2023-09-01' },
  { id: 'rev_2', productId: 'prod_4', rating: 4, comment: 'Clicky but loud.', author: 'Mike Ross', date: '2023-09-10' },
  { id: 'rev_3', productId: 'prod_2', rating: 2, comment: 'Wobbles at max height.', author: 'Sarah Jenkins', date: '2023-09-12' },
];

export const SEED_LOGS: ActivityLog[] = [
  { id: 'log_1', action: 'User Created', entity: 'User', user: 'System', timestamp: '2023-10-01T10:00:00Z' },
  { id: 'log_2', action: 'Invoice Paid', entity: 'Invoice', user: 'Alex Carter', timestamp: '2023-10-02T14:30:00Z' },
  { id: 'log_3', action: 'Stock Updated', entity: 'Product', user: 'Sarah Jenkins', timestamp: '2023-10-03T09:15:00Z' },
];

// --- REGISTRIES ---

// 1. Data Registry (The Records)
export const DATA_REGISTRY: Record<string, any[]> = {
  users: SEED_USERS,
  products: SEED_PRODUCTS,
  invoices: SEED_INVOICES,
  reviews: SEED_REVIEWS,
  logs: SEED_LOGS,
};

// 2. Metadata Registry (The Schema/Definitions)
export const RESOURCE_METADATA: Record<string, ResourceMeta> = {
  users: {
    name: 'Users',
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'email', required: true },
      { key: 'role', label: 'Role', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'joinedAt', label: 'Joined', type: 'date' },
    ]
  },
  products: {
    name: 'Products',
    fields: [
      { key: 'name', label: 'Product Name', type: 'text', required: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'price', label: 'Price', type: 'currency' },
      { key: 'stock', label: 'Stock', type: 'number' },
      { key: 'status', label: 'Availability', type: 'status' },
    ]
  },
  invoices: {
    name: 'Invoices',
    fields: [
      // ✅ FIX: Changed label from 'User ID' to 'User'
      { key: 'userId', label: 'User', type: 'text', required: true },
      { key: 'amount', label: 'Amount', type: 'currency' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'date', label: 'Date', type: 'date' },
    ]
  },
  reviews: {
    name: 'Reviews',
    fields: [
      // ✅ FIX: Changed label from 'Product ID' to 'Product'
      { key: 'productId', label: 'Product', type: 'text' },
      { key: 'rating', label: 'Rating', type: 'number' },
      { key: 'comment', label: 'Comment', type: 'text' },
      { key: 'author', label: 'Author', type: 'text' },
    ]
  },
  logs: {
    name: 'Activity Logs',
    fields: [
      { key: 'action', label: 'Action', type: 'text' },
      { key: 'entity', label: 'Entity', type: 'text' },
      { key: 'user', label: 'User', type: 'text' },
      { key: 'timestamp', label: 'Time', type: 'date' },
    ]
  }
};

// --- HELPERS ---

export const getMockData = (id: string) => DATA_REGISTRY[id] || [];

// ✅ Updated to return ResourceMeta or null (instead of never/null)
export const getResourceMeta = (id: string): ResourceMeta | null => {
  return RESOURCE_METADATA[id] || null;
};