import React, { Component, type ErrorInfo, useMemo } from 'react';
import { PageHeader, Alert, Badge } from '@ramme-io/ui';
import { useManifest, useBridgeStatus } from '../runtime/ManifestContext';
import { getComponent } from '../../config/component-registry';
import { getMockData } from '../../data/mockData'; // Keep as fallback
import { Wifi, WifiOff, AlertTriangle, Loader2, Database, Wand2 } from 'lucide-react';

// --- 🛠️ JIT DATA GENERATOR ---
// This ensures the preview ALWAYS has data, even for new resources not yet in the DB.
const generateJitData = (resourceDef: any, count = 10) => {
  if (!resourceDef) return [];
  
  return Array.from({ length: count }).map((_, i) => {
    const row: any = { id: i + 1 };
    resourceDef.fields.forEach((f: any) => {
      // Intelligent Mocking based on field type
      if (f.type === 'status') {
        row[f.key] = ['Active', 'Pending', 'Closed', 'Archived'][Math.floor(Math.random() * 4)];
      } else if (f.type === 'boolean') {
        row[f.key] = Math.random() > 0.3; // 70% true
      } else if (f.type === 'number' || f.type === 'currency') {
        row[f.key] = Math.floor(Math.random() * 1000) + 100;
      } else if (f.type === 'date') {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        row[f.key] = d.toISOString().split('T')[0];
      } else {
        row[f.key] = `${f.label} ${i + 1}`;
      }
    });
    return row;
  });
};

// --- ERROR BOUNDARY ---
class BlockErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean, error: string }> {
  constructor(props: any) { super(props); this.state = { hasError: false, error: '' }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error: error.message }; }
  render() {
    if (this.state.hasError) return (
        <div className="h-full min-h-[100px] p-4 border-2 border-dashed border-red-300 bg-red-50/50 rounded-lg flex flex-col items-center justify-center text-red-600 text-xs">
          <AlertTriangle size={16} className="mb-2 opacity-80" />
          <span className="font-bold">Render Error</span>
          <span className="opacity-75 text-center truncate max-w-[200px]">{this.state.error}</span>
        </div>
    );
    return this.props.children;
  }
}

// --- MAIN RENDERER ---
export const DynamicPage = ({ pageId }: { pageId: string }) => {
  const manifest = useManifest();
  const status = useBridgeStatus();
  const isLive = status === 'live';

  const page = useMemo(() => manifest.pages?.find((p: any) => p.id === pageId), [manifest, pageId]);

  if (!page) {
    return (
      <div className="p-8 space-y-4">
         <Alert variant="info" title="Connecting..."><Loader2 className="animate-spin mr-2" size={16} /> Loading Page...</Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{page.title}</h1>
          {page.description && <p className="text-muted-foreground text-lg">{page.description}</p>}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${isLive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500'}`}>
          {isLive ? <Wifi size={14} className="text-green-600 animate-pulse"/> : <WifiOff size={14} />}
          {isLive ? 'LIVE PREVIEW' : 'STATIC MODE'}
        </div>
      </div>
      
      {/* Grid Layout */}
      <div className="grid gap-8">
        {page.sections?.map((section: any) => (
          <section key={section.id} className="space-y-4">
            {section.title && (
              <div className="flex items-center gap-2 pb-2 border-b border-dashed border-gray-200">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{section.title}</h3>
              </div>
            )}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${section.layout?.columns || 1}, minmax(0, 1fr))` }}>
              {section.blocks.map((block: any) => {
                const Component = getComponent(block.type);
                const safeDataId = block.props.dataId?.toLowerCase();
                
                // --- 🛡️ HYBRID DATA STRATEGY ---
                let resolvedData: any[] = [];
                let isGenerated = false;
                let autoColumns = undefined;

                if (safeDataId) {
                  // 1. Try Local Storage first
                  resolvedData = getMockData(safeDataId); 
                  
                  // 2. If empty, Generate JIT Data from Manifest
                  if (!resolvedData || resolvedData.length === 0) {
                     const resourceDef = manifest.resources?.find((r: any) => r.id.toLowerCase() === safeDataId);
                     if (resourceDef) {
                        resolvedData = generateJitData(resourceDef);
                        isGenerated = true; // Flag for debug overlay
                     }
                  }

                  // 3. Auto-Generate Table Columns
                  const resourceDef = manifest.resources?.find((r: any) => r.id.toLowerCase() === safeDataId);
                  if (resourceDef && !block.props.columnDefs) {
                    autoColumns = resourceDef.fields.map((f: any) => ({
                      field: f.key, headerName: f.label, filter: true, flex: 1,
                      cellRenderer: f.type === 'status' ? (p: any) => <Badge variant="secondary">{p.value}</Badge> : undefined
                    }));
                  }
                }

                return (
                  <div key={block.id} style={{ gridColumn: `span ${block.layout?.colSpan || 1}`, gridRow: `span ${block.layout?.rowSpan || 1}` }} className="relative group">
                     <BlockErrorBoundary>
                        {/* Debug Overlay */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex gap-1 pointer-events-none">
                           <div className={`text-white text-[10px] px-2 py-1 rounded backdrop-blur-md flex items-center gap-1 ${isGenerated ? 'bg-amber-600/90' : 'bg-black/80'}`}>
                              {block.type}
                              {safeDataId && <> <span className="opacity-50">|</span> {isGenerated ? <Wand2 size={10}/> : <Database size={10}/>} {safeDataId} ({resolvedData.length})</>}
                           </div>
                        </div>
                        
                        <Component 
                           {...block.props} 
                           rowData={resolvedData} 
                           columnDefs={block.props.columnDefs || autoColumns}
                           className="w-full h-full shadow-sm bg-card rounded-xl border border-border" 
                        />
                     </BlockErrorBoundary>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};