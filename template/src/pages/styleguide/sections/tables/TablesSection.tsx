// src/pages/styleguide/sections/tables/TablesSection.tsx
import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Table,
  Pagination,
  DataTable,
  Badge,
  SectionHeader,
  useDataFetch,
  type ColDef,
  type ICellRendererParams,
  type IRowNode,
} from '@ramme-io/ui';

// --- Local Mock Data ---
const mockLargeTableData = Array.from({ length: 23 }, (_, i) => ({
  id: `USR-00${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  status: ['Active', 'Inactive', 'Pending'][i % 3],
}));

const mockTableData = [
    { make: 'Tesla', model: 'Model Y', price: 65990, electric: true },
    { make: 'Ford', model: 'F-150', price: 33850, electric: false },
    { make: 'Toyota', model: 'Corolla', price: 29600, electric: false },
    { make: 'Rivian', model: 'R1T', price: 79500, electric: true },
    { make: 'Honda', model: 'CR-V', price: 32450, electric: false },
];

// --- Custom Cell Renderers ---
const ElectricCarRenderer: React.FC<ICellRendererParams> = (props) => {
  return <span>{props.value ? '⚡ Electric' : '⛽ Gasoline'}</span>;
};

const StatusCell: React.FC<{ value: string }> = ({ value }) => {
  const variant = {
    Active: 'success' as const,
    Inactive: 'danger' as const,
    Pending: 'warning' as const,
  }[value] || 'secondary';
  return <Badge variant={variant}>{value}</Badge>;
};

const EmailCell: React.FC<{ value: string }> = ({ value }) => {
  return <a href={`mailto:${value}`} className="text-primary hover:underline">{value}</a>;
};

const TablesSection: React.FC = () => {
  const [simpleTablePage, setSimpleTablePage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const simpleTableHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (value: string) => <EmailCell value={value} /> },
    { key: 'status', label: 'Status', render: (value: string) => <StatusCell value={value} /> },
  ];
  const paginatedData = useMemo(() => {
    const start = (simpleTablePage - 1) * ITEMS_PER_PAGE;
    return mockLargeTableData.slice(start, start + ITEMS_PER_PAGE);
  }, [simpleTablePage]);
  const totalSimplePages = Math.ceil(mockLargeTableData.length / ITEMS_PER_PAGE);

  const { data: fetchedTableData } = useDataFetch(null, mockTableData);
  const [filterText, setFilterText] = useState<string>('');
  const [gridApi, setGridApi] = useState<any>(null);

  const onGridReady = useCallback((params: any) => setGridApi(params.api), []);

  const onFilterTextBoxChanged = useCallback(() => {
    gridApi?.setQuickFilter(filterText);
  }, [filterText, gridApi]);

  const columnDefs: ColDef[] = useMemo(() => [
    { field: 'make', headerName: 'Manufacturer', sortable: true, filter: true, floatingFilter: true, checkboxSelection: true, headerCheckboxSelection: true, minWidth: 150 },
    { field: 'model', headerName: 'Model Name', sortable: true, filter: true, floatingFilter: true, minWidth: 150 },
    { field: 'price', headerName: 'Price ($)', sortable: true, filter: 'agNumberColumnFilter', floatingFilter: true, valueFormatter: p => '$' + p.value.toLocaleString(), minWidth: 120 },
    { field: 'electric', headerName: 'Type', cellRenderer: ElectricCarRenderer, minWidth: 120 },
  ], []);

  const getSelectedRows = useCallback(() => {
    const selectedNodes: IRowNode[] = gridApi?.getSelectedNodes() || [];
    const selectedData = selectedNodes.map(node => node.data);
    alert(`Selected Rows: \n${JSON.stringify(selectedData, null, 2)}`);
  }, [gridApi]);

  return (
    <div className="space-y-8">
      <SectionHeader title="Tables & Data Grids" />
      <p className="text-muted-foreground -mt-6">Components for displaying tabular data, from simple tables to advanced data grids.</p>
      
      <Card id="tables-simple" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">Simple Paginated Table</h3>
        <p className="text-muted-foreground mb-4">
          A basic HTML table with client-side pagination and custom cell renderers.
        </p>
        <Table headers={simpleTableHeaders} data={paginatedData} />
        <div className="mt-4 flex justify-center">
          <Pagination currentPage={simpleTablePage} totalPages={totalSimplePages} onPageChange={setSimpleTablePage} />
        </div>
      </Card>

      <Card id="tables-aggrid" className="p-6 scroll-mt-20">
        <h3 className="text-2xl font-semibold mb-4 text-text">AG Grid Data Table (Advanced)</h3>
        <p className="text-muted-foreground mb-4">
          A powerful grid with sorting, filtering, and row selection, powered by AG Grid.
        </p>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <Input
            type="text"
            placeholder="Quick Filter (searches all columns)..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onKeyUp={onFilterTextBoxChanged}
            className="flex-1"
          />
          <Button onClick={getSelectedRows} variant="primary">
            Get Selected Rows
          </Button>
        </div>

        {fetchedTableData && (
          <DataTable
            rowData={fetchedTableData}
            columnDefs={columnDefs}
            height="500px"
            onGridReady={onGridReady}
            rowSelection="multiple"
          />
        )}
      </Card>
    </div>
  );
};

export default TablesSection;