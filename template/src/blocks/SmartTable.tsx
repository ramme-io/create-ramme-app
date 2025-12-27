import React, { useState, useMemo, useCallback } from 'react';
import { 
  DataTable, 
  Button, 
  Icon, 
  Card, 
  useToast, 
  SearchInput,
  type ColDef,
  type GridApi 
} from '@ramme-io/ui';
import { getResourceMeta, getMockData } from '../data/mockData';
import { AutoForm } from '../components/AutoForm';
import { useCrudLocalStorage } from '../hooks/useCrudLocalStorage';

interface SmartTableProps {
  dataId: string;
  title?: string;
  initialFilter?: Record<string, any>; 
}

export const SmartTable: React.FC<SmartTableProps> = ({ 
  dataId, 
  title,
  initialFilter
}) => {
  const { addToast } = useToast();
  
  // 1. DATA KERNEL
  const meta = getResourceMeta(dataId);
  const seedData = useMemo(() => getMockData(dataId) || [], [dataId]);
  
  // We use the CRUD hook to persist changes to localStorage
  const { 
    data: rowData, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useCrudLocalStorage<any>(`ramme_db_${dataId}`, seedData);

  // 2. UI STATE
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [quickFilterText, setQuickFilterText] = useState('');

  // 3. COLUMN DEFINITIONS
  const columns = useMemo<ColDef[]>(() => {
    if (!meta?.fields) return [];

    const generatedCols: ColDef[] = meta.fields.map((f: any) => {
      const col: ColDef = {
        field: f.key,
        headerName: f.label,
        filter: true,
        sortable: true,
        resizable: true,
        flex: 1,
      };

      // Smart Formatting based on type
      if (f.type === 'currency') {
        col.valueFormatter = (p: any) => p.value ? `$${Number(p.value).toLocaleString()}` : '';
      }
      if (f.type === 'date') {
        col.valueFormatter = (p: any) => p.value ? new Date(p.value).toLocaleDateString() : '';
      }
      if (f.type === 'status') {
        col.cellRenderer = (p: any) => {
          const statusColors: any = {
            active: 'bg-green-100 text-green-800',
            paid: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            inactive: 'bg-slate-100 text-slate-600',
            overdue: 'bg-red-100 text-red-800'
          };
          const colorClass = statusColors[String(p.value).toLowerCase()] || 'bg-slate-100 text-slate-800';
          return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
              {p.value}
            </span>
          );
        };
      }
      return col;
    });

    // Add Checkbox Selection to the first column
    if (generatedCols.length > 0) {
      generatedCols[0].headerCheckboxSelection = true;
      generatedCols[0].checkboxSelection = true;
      generatedCols[0].minWidth = 180;
    }

    // Add Actions Column
    generatedCols.push({
      headerName: "Actions",
      field: "id",
      width: 100,
      pinned: 'right',
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setCurrentRecord(params.data); setIsEditOpen(true); }}>
            <Icon name="edit-2" size={14} className="text-slate-500" />
          </Button>
        </div>
      )
    });

    return generatedCols;
  }, [meta]);

  // 4. HANDLERS
  const onGridReady = useCallback((params: any) => {
    setGridApi(params.api);
  }, []);

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      setSelectedRows(gridApi.getSelectedRows());
    }
  }, [gridApi]);

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedRows.length} items?`)) {
      selectedRows.forEach(row => deleteItem(row.id));
      setSelectedRows([]);
      addToast(`${selectedRows.length} items deleted`, 'success');
    }
  };

  const handleSave = (record: any) => {
    if (record.id && currentRecord?.id) {
      updateItem(record);
      addToast('Item updated', 'success');
    } else {
      const { id, ...newItem } = record;
      createItem(newItem);
      addToast('Item created', 'success');
    }
    setIsEditOpen(false);
  };

  // --- RENDER ---
  return (
    <Card className="flex flex-col h-[600px] border border-border shadow-sm overflow-hidden bg-card">
      
      {/* HEADER TOOLBAR */}
      <div className="p-4 border-b border-border flex justify-between items-center gap-4 bg-muted/5">
        
        {/* Left: Title or Bulk Actions */}
        {selectedRows.length > 0 ? (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
              {selectedRows.length} Selected
            </span>
            <Button size="sm" variant="danger" onClick={handleBulkDelete} iconLeft="trash-2">
              Delete Selected
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-md text-primary">
              <Icon name="table" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground leading-tight">
                {title || meta?.name || dataId}
              </h3>
              <p className="text-xs text-muted-foreground">
                {rowData.length} records found
              </p>
            </div>
          </div>
        )}

        {/* Right: Actions & Filter */}
        <div className="flex items-center gap-2">
          <div className="w-64">
            <SearchInput 
              placeholder="Quick search..." 
              value={quickFilterText}
              onChange={(e) => {
                setQuickFilterText(e.target.value);
                gridApi?.setQuickFilter(e.target.value);
              }}
            />
          </div>
          <div className="h-6 w-px bg-border mx-1" />
          <Button size="sm" variant="primary" iconLeft="plus" onClick={() => { setCurrentRecord({}); setIsEditOpen(true); }}>
            Add New
          </Button>
        </div>
      </div>

      {/* AG GRID */}
      <div className="flex-1 w-full bg-card relative">
        <DataTable 
          rowData={rowData} 
          columnDefs={columns} 
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          rowSelection="multiple"
          pagination={true}
          paginationPageSize={10}
          headerHeight={48}
          rowHeight={48}
          enableCellTextSelection={true}
        />
      </div>

      {/* EDIT DRAWER */}
      <AutoForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSave}
        title={meta?.name || 'Item'}
        fields={meta?.fields || []}
        initialData={currentRecord}
      />
    </Card>
  );
};