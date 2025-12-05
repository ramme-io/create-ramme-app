export interface User {
  id: number;
  name: string;
  email: string;
  username: string; // <-- Add this
  password?: string; // <-- Add this (optional for security)
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending' | 'Banned';
  createdAt: string; 
}

// NOTE: In a real app, passwords would be hashed. This is for simulation only.
export const mockUsers: User[] = [
  { id: 1, name: 'Jane Cooper', email: 'jane.cooper@example.com', username: 'jane', password: 'password', role: 'Admin', status: 'Active', createdAt: '2023-01-15T10:00:00Z' },
  { id: 2, name: 'Cody Fisher', email: 'cody.fisher@example.com', username: 'cody', password: 'password', role: 'Editor', status: 'Active', createdAt: '2023-02-20T11:30:00Z' },
  { id: 3, name: 'Esther Howard', email: 'esther.howard@example.com', username: 'esther', password: 'password', role: 'Viewer', status: 'Pending', createdAt: '2023-03-05T09:15:00Z' },
  // ... other users
];