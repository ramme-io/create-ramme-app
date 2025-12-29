import React, { useEffect, useState } from 'react';
import { Drawer, Button, Input, Select, type SelectOption } from '@ramme-io/ui';
import type { User } from '../../../data/mockData';

interface UserDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (id: string, data: Partial<User>) => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active',
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active',
      });
    }
  }, [user, isOpen]);

  // Options Configurations
  const roleOptions: SelectOption[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'editor', label: 'Editor' },
    { value: 'viewer', label: 'Viewer' },
  ];

  const statusOptions: SelectOption[] = [
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'banned', label: 'Banned' },
  ];

  // ✅ HELPER: Find the full object based on the string value
  // This satisfies the TypeScript requirement: value={SelectOption}
  const getOption = (options: SelectOption[], value: string | undefined) => {
    return options.find((opt) => opt.value === value) || null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ HELPER: Handle change for both Native Events and Custom Selects
  const handleSelectChange = (name: keyof User, newValue: any) => {
    // If the component returns a SelectOption object (Custom Select)
    if (newValue && typeof newValue === 'object' && 'value' in newValue) {
        setFormData({ ...formData, [name]: newValue.value });
    } 
    // If the component returns a standard Event (Native Select)
    else if (newValue?.target) {
        setFormData({ ...formData, [name]: newValue.target.value });
    }
    // Fallback
    else {
        setFormData({ ...formData, [name]: newValue });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idToSave = user?.id || '';
    onSave(idToSave, formData);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={user ? 'Edit User' : 'Add New User'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="flex-1 space-y-6 p-1">
          <Input
            label="Full Name"
            name="name"
            placeholder="Jane Doe"
            value={formData.name || ''}
            onChange={handleChange}
            required
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={formData.email || ''}
            onChange={handleChange}
            required
          />

          <Select
            label="Role"
            options={roleOptions}
            // ✅ FIX: Pass the object, not the string
            value={getOption(roleOptions, formData.role)}
            // ✅ FIX: Handle the update safely
            onChange={(val) => handleSelectChange('role', val)}
          />

          <Select
            label="Status"
            options={statusOptions}
            // ✅ FIX: Pass the object, not the string
            value={getOption(statusOptions, formData.status)}
            // ✅ FIX: Handle the update safely
            onChange={(val) => handleSelectChange('status', val)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {user ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default UserDrawer;