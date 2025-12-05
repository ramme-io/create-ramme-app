import React, { useMemo } from 'react';
import {
  Modal,
  Button,
  SearchInput,
  DataTable,
  Checkbox,
  type ColDef
} from '@ramme-io/ui';

// Mock data is fine as is
const mockData = [
  { id: 34561, name: 'Item Name 1', color: 'Blue' },
  { id: 76552, name: 'Item Name 2', color: 'Red' },
  { id: 54364, name: 'Item Name 3', color: 'Yellow' },
  { id: 87655, name: 'Item Name 3', color: 'Red' },
  { id: 98676, name: 'Item Name 3', color: 'Yellow' },
];

interface AddItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemsModal: React.FC<AddItemsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedCount, setSelectedCount] = React.useState(0);

  // --- FIX: Use AG Grid's column definition format ---
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Name',
      field: 'name', // Use 'field' instead of 'accessor'
      // AG Grid uses cellRenderer for custom components
      cellRenderer: (params: any) => (
        <div className="flex items-center">
          {params.value}
        </div>
      ),
      // Add a custom header component for the "select all" checkbox
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: 'ID', // Use 'headerName' instead of 'Header'
      field: 'id',
    },
    {
      headerName: 'Color',
      field: 'color',
    },
  ], []);

  const modalFooter = (
    <div className="flex items-center justify-between w-full">
      <div className="font-bold">{`(${selectedCount}) Selected`}</div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary">Add Items</Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Items"
      footer={modalFooter}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Item(s)</h3>
        <SearchInput placeholder="Search by name" />
        <DataTable
          // --- FIX: Use the correct prop names ---
          columnDefs={columnDefs}
          rowData={mockData}
          rowSelection="multiple" // Enable row selection
          onSelectionChanged={(event) => {
            setSelectedCount(event.api.getSelectedRows().length);
          }}
        />
      </div>
    </Modal>
  );
};