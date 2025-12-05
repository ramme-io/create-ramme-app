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
  { id: 34982, name: 'Entity Name 1', sector: 'Technology' },
  { id: 34983, name: 'Entity Name 2', sector: 'Finance' },
  { id: 34984, name: 'Entity Name 3', sector: 'Healthcare' },
  { id: 34985, name: 'Global Corp', sector: 'Finance' },
  { id: 34986, name: 'Innovate LLC', sector: 'Technology' },
];

interface AddEntitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEntitiesModal: React.FC<AddEntitiesModalProps> = ({
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
      headerName: 'Sector',
      field: 'sector',
    },
  ], []);

  const modalFooter = (
    <div className="flex items-center justify-between w-full">
      <div className="font-bold">{`(${selectedCount}) Selected`}</div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary">Add to Workflow</Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Entities"
      footer={modalFooter}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select Entity(s)</h3>
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