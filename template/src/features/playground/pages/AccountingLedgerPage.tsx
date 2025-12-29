import React, { useMemo, useState } from 'react';
import {
  PageHeader,
  DataTable,
  Badge,
  type ColDef,
  type ICellRendererParams,
  // 1. Import the specific event type for cell value changes
  type CellValueChangedEvent,
} from '@ramme-io/ui';
import { mockLedgerData, type LedgerEntry } from '../../../data/mockLedger';

// --- Custom Renderer for Variance ---
// 2. Correctly type the component and ensure it returns a ReactNode (JSX or null)
const VarianceRenderer: React.FC<ICellRendererParams> = ({ value }) => {
  if (value === null || value === undefined) return null;
  const isPositive = value >= 0;
  const variant = isPositive ? 'success' : 'danger';
  const formattedValue = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  return <Badge variant={variant}>{formattedValue}</Badge>;
};

// --- Custom Renderer for Account Status ---
// 2. Correctly type the component and ensure it returns a ReactNode (JSX or null)
const StatusRenderer: React.FC<ICellRendererParams<LedgerEntry>> = ({ data }) => {
    if (!data) return null;
    const variance = data.actual - data.budget;
    if (variance > 1000) return <Badge variant="success">On Target</Badge>;
    if (variance < -1000) return <Badge variant="danger">Over Budget</Badge>;
    return <Badge variant="warning">Watch</Badge>;
}

const AccountingLedgerPage: React.FC = () => {
  const [rowData, setRowData] = useState<LedgerEntry[]>(mockLedgerData);

  const columnDefs = useMemo<ColDef<LedgerEntry>[]>(() => [
    { field: 'category', rowGroup: true, hide: true },
    { field: 'account', headerName: 'Account', flex: 2 },
    {
      field: 'actual',
      headerName: 'Actual',
      type: 'numericColumn',
      valueFormatter: params => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value),
      aggFunc: 'sum',
    },
    {
      field: 'budget',
      headerName: 'Budget',
      type: 'numericColumn',
      editable: true,
      valueFormatter: params => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(params.value),
      aggFunc: 'sum',
      // 3. Apply the specific event type to the params object
      onCellValueChanged: (params: CellValueChangedEvent<LedgerEntry>) => {
          if (params.newValue !== params.oldValue) {
              const updatedData = rowData.map(row => 
                  row.account === params.data.account ? { ...row, budget: Number(params.newValue) } : row
              );
              setRowData(updatedData);
          }
      },
    },
    {
      headerName: 'Variance',
      type: 'numericColumn',
      valueGetter: params => params.data ? params.data.actual - params.data.budget : 0,
      cellRenderer: VarianceRenderer,
      aggFunc: 'sum',
    },
    {
      headerName: 'Status',
      cellRenderer: StatusRenderer,
      flex: 1,
    }
  ], [rowData]);

  const autoGroupColumnDef: ColDef = useMemo(() => ({
    headerName: 'Category',
    minWidth: 250,
    flex: 2,
    cellRendererParams: {
      footerValueGetter: (params: any) => {
        const isRootLevel = params.node.level === -1;
        if (isRootLevel) return 'Grand Total (Net Profit)';
        return `Total ${params.node.key}`;
      },
    },
  }), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Ledger"
        description="Showcase of advanced data analysis: grouping, aggregation, in-cell editing, and custom renderers."
      />
      <DataTable
        rowData={rowData}
        columnDefs={columnDefs}
        height="calc(100vh - 280px)"
        autoGroupColumnDef={autoGroupColumnDef}
        groupDefaultExpanded={-1}
        groupIncludeFooter={true}
        groupIncludeTotalFooter={true}
      />
    </div>
  );
};

export default AccountingLedgerPage;