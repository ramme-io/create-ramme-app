import React, { useState, useMemo } from 'react';
import {
  DataTable,
  Button,
  useToast,
  Badge,
  Input,
  type ColDef,
  type ICellRendererParams,
} from '@ramme-io/ui';
import { useCrudLocalStorage } from '../../../engine/runtime/useCrudLocalStorage';
import { SEED_USERS, type User } from '../../../data/mockData';
import UserDrawer from '../components/UserDrawer';
// ✅ Import Core Layout
import { StandardPageLayout } from '../../../components/layout/StandardPageLayout';

const UsersPage: React.FC = () => {
  const { addToast } = useToast();
  
  const { 
    data: users, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useCrudLocalStorage<User>('ramme_db_users', SEED_USERS);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        updateItem({ ...editingUser, ...data } as User);
        addToast('User updated', 'success');
      } else {
        createItem({
          ...data,
          role: data.role || 'viewer',
          status: data.status || 'active',
          joinedAt: new Date().toISOString()
        } as User);
        addToast('User created', 'success');
      }
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
  ], [deleteItem]);

  return (
    <StandardPageLayout
      title="User Management"
      description="Manage system access and permissions."
      actions={
        <Button variant="primary" iconLeft="plus" onClick={() => handleOpenDrawer()}>
          Add User
        </Button>
      }
    >
      <div className="space-y-6 h-full flex flex-col">
        <div className="w-full max-w-sm">
           <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        
        <div className="flex-1 min-h-[500px]">
          <DataTable
            rowData={users}
            columnDefs={columnDefs}
            height="100%"
            quickFilterText={searchTerm} 
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>

        <UserDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          user={editingUser}
          onSave={handleSave}
        />
      </div>
    </StandardPageLayout>
  );
};

export default UsersPage;