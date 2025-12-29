import React, { useState, useMemo } from 'react';
import {
  PageHeader,
  DataTable,
  Button,
  useToast,
  Badge,
  Input,
  type ColDef,
  type ICellRendererParams,
} from '@ramme-io/ui';

// 1. REMOVE: userService and old User types
// import { userService } from '../api/user.service';
// import type { User } from '../api/user.types';

// 2. ADD: The Engine Hook & Shared Data
import { useCrudLocalStorage } from '../../../engine/runtime/useCrudLocalStorage';
import { SEED_USERS, type User } from '../../../data/mockData';

import UserDrawer from '../components/UserDrawer';

const UsersPage: React.FC = () => {
  const { addToast } = useToast();
  
  // 3. REPLACE: Manual state fetching with the Reactive Engine
  // This automatically loads 'ramme_db_users' and keeps it in sync.
  const { 
    data: users, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useCrudLocalStorage<User>('ramme_db_users', SEED_USERS);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // (Removed refreshData & useEffect - the hook handles this automatically)

  const handleOpenDrawer = (user: User | null = null) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  const handleDelete = (user: User) => {
    if (confirm(`Delete ${user.name}?`)) {
      deleteItem(user.id);
      addToast('User deleted', 'success');
    }
  };

  const handleSave = (_id: string, data: Partial<User>) => {
    try {
      if (editingUser) {
        // Update existing user
        updateItem({ ...editingUser, ...data } as User);
        addToast('User updated', 'success');
      } else {
        // Create new user (Engine handles ID generation)
        createItem({
          ...data,
          role: data.role || 'viewer', // Ensure defaults
          status: data.status || 'active',
          joinedAt: new Date().toISOString()
        } as User);
        addToast('User created', 'success');
      }
      // Close drawer
      setIsDrawerOpen(false);
    } catch (error) {
      addToast('Error saving user', 'error');
    }
  };

  const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'name', headerName: 'Name', flex: 1, filter: true },
    { field: 'email', headerName: 'Email', flex: 1, filter: true },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      cellRenderer: (params: any) => (
        <Badge variant={params.value === 'admin' ? 'primary' : 'secondary'}>
          {params.value}
        </Badge>
      )
    },
    { 
      field: 'status', 
      width: 120,
      cellRenderer: (params: any) => (
        <Badge variant={params.value === 'active' ? 'success' : 'danger'}>
          {params.value}
        </Badge>
      )
    },
    {
      headerName: 'Actions',
      width: 120,
      pinned: 'right',
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" iconLeft="edit" onClick={() => handleOpenDrawer(params.data)} />
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" iconLeft="trash-2" onClick={() => handleDelete(params.data)} />
        </div>
      ),
    },
  ], [deleteItem]); // Added dependency

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <PageHeader
        title="User Management"
        description="Manage system access and permissions."
        actions={
          <Button variant="primary" iconLeft="plus" onClick={() => handleOpenDrawer()}>
            Add User
          </Button>
        }
      />
      
      <div className="w-full max-w-sm">
         <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>
      
      <DataTable
        rowData={users}
        columnDefs={columnDefs}
        height="100%"
        quickFilterText={searchTerm} 
        pagination
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
      />

      <UserDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={editingUser}
        onSave={handleSave}
      />
    </div>
  );
};

export default UsersPage;