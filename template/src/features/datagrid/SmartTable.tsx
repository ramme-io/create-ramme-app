import React, { useState, useMemo, useCallback } from 'react';
import { 
  DataTable, 
  Button, 
  Icon, 
  Card, 
  Badge, 
  useToast, 
  SearchInput,
  type ColDef,
  type GridApi 
} from '@ramme-io/ui';
import { useJustInTimeSeeder } from '../../engine/runtime/useJustInTimeSeeder';
import { getResourceMeta } from '../../data/mockData';
import { AutoForm } from '../../components/AutoForm';
import { useCrudLocalStorage } from '../../engine/runtime/useCrudLocalStorage';
import { useManifest } from '../../engine/runtime/ManifestContext';
// ✅ IMPORT FieldDefinition specifically
import type { ResourceDefinition, FieldDefinition } from '../../engine/validation/schema';

interface SmartTableProps {
  dataId: string;
  title?: string;
  initialFilter?: Record<string, any>; 
}

export const SmartTable: React.FC<SmartTableProps> = ({ 
  dataId, 
  title
}) => {
  const { addToast } = useToast();
  const manifest = useManifest();

  // --- 1. METADATA RESOLUTION ---
  const meta = useMemo<ResourceDefinition | null>(() => {
    const dynamicResource = manifest.resources?.find((r: ResourceDefinition) => r.id === dataId);
    if (dynamicResource) return dynamicResource;

    const staticMeta = getResourceMeta(dataId);
    if (staticMeta) {
      return {
        ...staticMeta,
        id: dataId,
      } as unknown as ResourceDefinition; 
    }
    return null;
  }, [manifest, dataId]);

  // --- 2. DATA HYDRATION ---
  const seedData = useJustInTimeSeeder(dataId, meta);
  
  const { 
    data: rowData, 
    createItem, 
    updateItem, 
    deleteItem 
  } = useCrudLocalStorage<any>(`ramme_db_${dataId}`, seedData);

  // --- 3. UI STATE ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [quickFilterText, setQuickFilterText] = useState('');

  // --- 4. COLUMN DEFINITIONS (Desktop) ---
  const columns = useMemo<ColDef[]>(() => {
    if (!meta?.fields) return [];

    const generatedCols: ColDef[] = meta.fields.map((f: FieldDefinition) => {
      const col: ColDef = {
        field: f.key,
        headerName: f.label,
        filter: true,
        sortable: true,
        resizable: true,
        flex: 1,
      };

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

    if (generatedCols.length > 0) {
      generatedCols[0].headerCheckboxSelection = true;
      generatedCols[0].checkboxSelection = true;
      generatedCols[0].minWidth = 180;
    }

    generatedCols.push({
      headerName: "Actions",
      field: "id",
      width: 100,
      pinned: 'right',
      cellRenderer: (params: any) => (
        <div className="flex items-center gap-1">
          {/* ✅ FIXED: Explicit React.MouseEvent type */}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setCurrentRecord(params.data); setIsEditOpen(true); }}>
            <Icon name="edit-2" size={14} className="text-slate-500" />
          </Button>
        </div>
      )
    });

    return generatedCols;
  }, [meta]);

  // --- 5. FIELD HELPERS (Mobile) ---
  // ✅ FIXED: Explicit FieldDefinition type for 'f'
  const titleField = useMemo(() => meta?.fields.find((f: FieldDefinition) => f.type === 'text' && f.key !== 'id') || meta?.fields[0], [meta]);
  const statusField = useMemo(() => meta?.fields.find((f: FieldDefinition) => f.type === 'status'), [meta]);

  // --- 6. HANDLERS ---
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

  return (
    <Card className="flex flex-col h-[600px] border border-border shadow-sm overflow-hidden bg-card">
      
      {/* --- HEADER --- */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/5">
        {selectedRows.length > 0 ? (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-200">
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
              {selectedRows.length} Selected
            </span>
            <Button size="sm" variant="danger" onClick={handleBulkDelete} iconLeft="trash-2">
              Delete
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

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput 
              placeholder="Quick search..." 
              value={quickFilterText}
              // ✅ FIXED: Explicit ChangeEvent type
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuickFilterText(e.target.value);
                gridApi?.updateGridOptions({ quickFilterText: e.target.value });
              }}
            />
          </div>
          <div className="h-6 w-px bg-border mx-1 hidden sm:block" />
          <Button size="sm" variant="primary" iconLeft="plus" onClick={() => { setCurrentRecord({}); setIsEditOpen(true); }}>
            Add
          </Button>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 w-full bg-card relative overflow-hidden">
        
        {/* 🖥️ DESKTOP VIEW: The Power Grid */}
        <div className="hidden md:block h-full">
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

        {/* 📱 MOBILE VIEW: The Card List */}
        <div className="block md:hidden h-full overflow-y-auto p-4 space-y-3 bg-muted/5">
          {rowData.map((row) => (
            <div key={row.id} className="bg-background border border-border rounded-lg p-4 shadow-sm relative group">
              
              {/* Header: Title + Status */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-foreground">
                    {titleField ? row[titleField.key] : row.id}
                  </h4>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 opacity-70">{row.id}</p>
                </div>
                {statusField && (
                  <Badge variant={
                    ['active', 'paid'].includes(String(row[statusField.key]).toLowerCase()) ? 'success' : 
                    ['pending'].includes(String(row[statusField.key]).toLowerCase()) ? 'warning' : 'secondary'
                  }>
                    {row[statusField.key]}
                  </Badge>
                )}
              </div>

              {/* Body: Detailed Fields */}
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                 {meta?.fields
                   // ✅ FIXED: Explicit FieldDefinition type for 'f'
                   .filter((f: FieldDefinition) => f.key !== titleField?.key && f.key !== statusField?.key && f.key !== 'id')
                   .slice(0, 3)
                   .map((f: FieldDefinition) => (
                     <div key={f.key} className="flex justify-between border-b border-dashed border-border/50 pb-1 last:border-0">
                       <span className="opacity-70">{f.label}:</span>
                       <span className="font-medium text-foreground">
                         {f.type === 'currency' ? `$${Number(row[f.key]).toLocaleString()}` : 
                          f.type === 'date' ? new Date(row[f.key]).toLocaleDateString() : row[f.key]}
                       </span>
                     </div>
                   ))}
              </div>

              {/* Footer: Actions */}
              <div className="flex gap-2 pt-2 border-t border-border/50">
                 <Button 
                   size="sm" 
                   variant="outline" 
                   className="flex-1 h-8 text-xs" 
                   onClick={() => { setCurrentRecord(row); setIsEditOpen(true); }}
                 >
                   <Icon name="edit-2" size={12} className="mr-2"/> Edit
                 </Button>
                 <Button 
                   size="sm" 
                   variant="ghost" 
                   className="text-destructive hover:bg-destructive/10 px-3 h-8"
                   onClick={() => { if(confirm('Delete?')) deleteItem(row.id); }}
                 >
                   <Icon name="trash-2" size={14} />
                 </Button>
              </div>

            </div>
          ))}
          
          {rowData.length === 0 && (
             <div className="text-center p-8 text-muted-foreground">No records found.</div>
          )}
        </div>

      </div>

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