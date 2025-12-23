import React, { useState, useMemo } from 'react';
import { DataTable, Button, Icon, Card, useToast, type ColDef } from '@ramme-io/ui';
import { getResourceMeta, getMockData } from '../data/mockData';
import { AutoForm } from '../components/AutoForm';
// ✅ Import types that now definitely exist
import { useDataQuery, type FilterOption, type SortOption } from '../hooks/useDataQuery';
import { useCrudLocalStorage } from '../hooks/useCrudLocalStorage';

interface SmartTableProps {
  dataId: string;
  title?: string;
  initialFilter?: Record<string, any>; 
  initialSort?: SortOption;
}

export const SmartTable: React.FC<SmartTableProps> = ({ 
  dataId, 
  title,
  initialFilter, 
  initialSort 
}) => {
  const { addToast } = useToast();
  
  // 1. STATE
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // Kept as state in case we add a selector later
  
  // 2. METADATA
  const meta = getResourceMeta(dataId);

  // 3. STORAGE LAYER
  // Seed data if local storage is empty
  const seedData = useMemo(() => getMockData(dataId) || [], [dataId]);
  
  const { 
    data: rawData, 
    createItem, 
    updateItem 
  } = useCrudLocalStorage<any>(`ramme_db_${dataId}`, seedData);

  // 4. LOGIC LAYER
  const activeFilters = useMemo<FilterOption[]>(() => {
    if (!initialFilter) return [];
    return Object.entries(initialFilter).map(([key, value]) => ({
      field: key,
      operator: 'equals',
      value
    }));
  }, [initialFilter]);

  const { data: processedRows, total, pageCount } = useDataQuery(rawData, {
    filters: activeFilters,
    sort: initialSort, // Using the prop directly for now (Fixes 'setSort' unused)
    page,
    pageSize
  });

  // 5. UI STATE
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  // 6. COLUMNS
  const columns = useMemo(() => {
    if (meta?.fields) {
      const cols: ColDef[] = meta.fields.map((f: any) => {
        const colDef: ColDef = {
          field: f.key,
          headerName: f.label,
          filter: true,
          sortable: true,
          flex: 1,
        };

        if (f.key.endsWith('Id')) {
           const collectionName = f.key.replace('Id', 's'); 
           const relatedData = getMockData(collectionName);
           if (relatedData) {
             colDef.valueFormatter = (params) => {
               const match = relatedData.find((item: any) => item.id === params.value);
               return match ? (match.name || match.title || params.value) : params.value;
             };
           }
        }

        if (f.type === 'currency') colDef.valueFormatter = (p: any) => p.value ? `$${p.value}` : '';
        if (f.type === 'date') colDef.valueFormatter = (p: any) => p.value ? new Date(p.value).toLocaleDateString() : '';
        
        if (f.type === 'status') {
          colDef.cellRenderer = (p: any) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium border
              ${['active', 'paid'].includes(p.value?.toLowerCase()) ? 'bg-green-100 text-green-800 border-green-200' : 
                ['pending'].includes(p.value?.toLowerCase()) ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
              {p.value}
            </span>
          );
        }
        return colDef;
      });

      cols.push({
        headerName: "Actions",
        field: "id",
        width: 100,
        pinned: 'right',
        cellRenderer: (params: any) => (
          <Button variant="ghost" size="sm" onClick={() => { setCurrentRecord(params.data); setIsEditOpen(true); }}>
            <Icon name="edit-2" className="w-4 h-4 text-slate-500" />
          </Button>
        )
      });
      return cols;
    }
    
    if (processedRows.length > 0) {
      return Object.keys(processedRows[0]).map(k => ({ field: k, headerName: k.toUpperCase(), flex: 1 }));
    }
    return [];
  }, [meta, processedRows]);

  const handleSave = (record: any) => {
    if (record.id && currentRecord?.id) {
        updateItem(record);
        addToast('Record updated successfully', 'success');
    } else {
        const { id, ...newItem } = record;
        createItem(newItem);
        addToast('New record created', 'success');
    }
    setIsEditOpen(false);
  };

  return (
    <Card className="p-0 overflow-hidden border border-border flex flex-col h-full min-h-[500px]"> 
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            {title || meta?.name || dataId}
          </h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {total} records
          </span>
        </div>
        <Button size="sm" variant="outline" onClick={() => { setCurrentRecord({}); setIsEditOpen(true); }}>
          <Icon name="plus" className="mr-2 w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="flex-1 w-full bg-card relative">
        <DataTable 
          rowData={processedRows} 
          columnDefs={columns} 
          pagination={false} // We handle pagination logic manually below
        />
        
        {/* Pagination Controls */}
        <div className="p-2 border-t border-border flex justify-between items-center text-sm">
           <span className="text-muted-foreground">
             Page {page} of {pageCount || 1}
           </span>
           <div className="flex gap-2">
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={page === 1} 
               onClick={() => setPage(p => Math.max(1, p - 1))}
             >
               Prev
             </Button>
             <Button 
               variant="ghost" 
               size="sm" 
               disabled={page >= pageCount} 
               onClick={() => setPage(p => p + 1)}
             >
               Next
             </Button>
           </div>
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