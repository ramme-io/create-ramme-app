import React, { useState, useMemo } from 'react';
import {
  PageHeader, // <-- Add PageHeader back
  DataTable,
  Button,
  Icon,
  Drawer,
  FormTemplate,
  useToast,
  Badge,
  type ColDef,
  type FormField,
  type ICellRendererParams,
} from '@ramme-io/ui';
import { useCrudLocalStorage } from '../hooks/useCrudLocalStorage';
import { mockUsers, type User } from '../data/mockUsers';

// --- Custom Cell Renderers (No changes needed here) ---
const ActionsRenderer: React.FC<ICellRendererParams & { onEdit: (data: User) => void; onDelete: (data: User) => void; }> = ({ data, onEdit, onDelete }) => (
  <div className="flex items-center justify-center gap-2 h-full">
    <Button size="sm" variant="outline" onClick={() => onEdit(data)} aria-label="Edit">
      <Icon name="edit" className="h-4 w-4" />
    </Button>
    <Button size="sm" variant="danger" onClick={() => onDelete(data)} aria-label="Delete">
      <Icon name="trash-2" className="h-4 w-4" />
    </Button>
  </div>
);
interface StatusRendererProps extends ICellRendererParams {
  value: User['status'];
}
const StatusRenderer: React.FC<StatusRendererProps> = ({ value }) => {
    const variantMap: Record<User['status'], 'success' | 'warning' | 'danger'> = {
        Active: 'success',
        Pending: 'warning',
        Banned: 'danger',
    };
    const variant = variantMap[value] || 'secondary';
    return <Badge variant={variant}>{value}</Badge>;
};


const DataGridPage: React.FC = () => {
  const { addToast } = useToast();
  const { data: users, createItem, updateItem, deleteItem } = useCrudLocalStorage<User>('users', mockUsers);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleOpenDrawer = (user: User | null = null) => {
    setEditingUser(user);
    setIsDrawerOpen(true);
  };

  // ... (handleDelete and handleFormSubmit functions remain the same)
  const handleDelete = (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteItem(user.id);
      addToast('User deleted successfully', 'success');
    }
  };

  const handleFormSubmit = (formData: Record<string, any>) => {
    if (editingUser) {
      updateItem({ ...editingUser, ...formData });
      addToast('User updated successfully', 'success');
    } else {
      const newUser: Omit<User, 'id' | 'createdAt'> = {
        ...formData,
      } as Omit<User, 'id' | 'createdAt'>;
      createItem({ ...newUser, createdAt: new Date().toISOString() });
      addToast('User created successfully', 'success');
    }
    setIsDrawerOpen(false);
    setEditingUser(null);
  };

  // ... (columnDefs and formFields definitions remain the same)
    const columnDefs = useMemo<ColDef[]>(() => [
    { field: 'id', headerName: 'ID', width: 80, sortable: true },
    { field: 'name', headerName: 'Name', flex: 2, sortable: true, filter: 'agTextColumnFilter' },
    { field: 'email', headerName: 'Email', flex: 3, sortable: true, filter: 'agTextColumnFilter' },
    { field: 'role', headerName: 'Role', flex: 1, filter: 'agTextColumnFilter' },
    { 
        field: 'status', 
        headerName: 'Status', 
        flex: 1,
        cellRenderer: StatusRenderer,
        filter: 'agTextColumnFilter'
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      flex: 2,
      sortable: true,
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
          if (cellValue == null) return -1;
          const cellDate = new Date(cellValue);
          cellDate.setHours(0,0,0,0);
          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) return 0;
          return cellDate < filterLocalDateAtMidnight ? -1 : 1;
        },
      },
      valueFormatter: params => new Date(params.value).toLocaleDateString(),
    },
    {
      headerName: 'Actions',
      width: 120,
      pinned: 'right',
      cellRenderer: (props: ICellRendererParams) => (
        <ActionsRenderer {...props} onEdit={handleOpenDrawer} onDelete={handleDelete} />
      ),
    },
  ], [handleDelete]);

  const formFields: FormField[] = useMemo(() => [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe', required: true, value: editingUser?.name },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'jane.doe@example.com', required: true, value: editingUser?.email },
    { name: 'username', label: 'Username', type: 'text', placeholder: 'jane.doe', required: true, value: editingUser?.username },
    { 
        name: 'role', 
        label: 'Role', 
        type: 'select', 
        options: [{value: 'Admin', label: 'Admin'}, {value: 'Editor', label: 'Editor'}, {value: 'Viewer', label: 'Viewer'}],
        value: editingUser?.role 
    },
    { 
        name: 'status', 
        label: 'Status', 
        type: 'select', 
        options: [{value: 'Active', label: 'Active'}, {value: 'Pending', label: 'Pending'}, {value: 'Banned', label: 'Banned'}],
        value: editingUser?.status 
    },
  ], [editingUser]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="A complete CRUD example with persisted data and an edit-in-drawer pattern."
        actions={
          <Button
            variant="primary"
            // FIX: Changed from iconBefore to iconLeft and passed the icon name string
            iconLeft="plus"
            onClick={() => handleOpenDrawer()}
          >
            Create User
          </Button>
        }
      />
      
      <DataTable
        rowData={users}
        columnDefs={columnDefs}
        height="calc(100vh - 280px)"
        enableQuickSearch
        rowSelection="multiple"
        pagination
        paginationPageSize={10}
        // FIX: Add the page size selector to resolve the AG Grid warning
        paginationPageSizeSelector={[10, 25, 50]}
      />

      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={editingUser ? 'Edit User' : 'Create New User'} size="lg">
        <div className="p-6">
            <FormTemplate
              fields={formFields}
              onSubmit={handleFormSubmit}
            >
              <div className="flex justify-end gap-2 mt-8">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                <Button type="submit">{editingUser ? 'Update User' : 'Create User'}</Button>
              </div>
            </FormTemplate>
        </div>
      </Drawer>
    </div>
  );
};

export default DataGridPage;