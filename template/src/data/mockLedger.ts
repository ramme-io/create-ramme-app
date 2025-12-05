export interface LedgerEntry {
  category: 'Revenue' | 'Cost of Goods Sold' | 'Operating Expenses';
  account: string;
  actual: number;
  budget: number;
}

export const mockLedgerData: LedgerEntry[] = [
  // --- Raw Data Only ---
  { category: 'Revenue', account: 'Product Sales', actual: 125000, budget: 120000 },
  { category: 'Revenue', account: 'Service Fees', actual: 32000, budget: 35000 },
  { category: 'Cost of Goods Sold', account: 'Raw Materials', actual: -45000, budget: -42000 },
  { category: 'Cost of Goods Sold', account: 'Direct Labor', actual: -28000, budget: -30000 },
  { category: 'Operating Expenses', account: 'Marketing', actual: -12000, budget: -10000 },
  { category: 'Operating Expenses', account: 'Salaries & Wages', actual: -55000, budget: -55000 },
  { category: 'Operating Expenses', account: 'Rent & Utilities', actual: -8500, budget: -8000 },
];