import { useMemo } from 'react';

/**
 * @file useDataQuery.ts
 * @description The "In-Memory Database Engine".
 *
 * ARCHITECTURAL ROLE:
 * Since this application runs without a real backend, this hook acts as the
 * SQL Query Engine. It takes raw arrays from the Data Lake and performs
 * real-time filtering, sorting, and pagination before passing the result
 * to the UI.
 *
 * CAPABILITIES:
 * 1. WHERE: Supports complex filtering (equals, contains, gt, lt).
 * 2. ORDER BY: Handles ascending/descending sorts on any field.
 * 3. LIMIT/OFFSET: Calculates pagination slices automatically.
 */

export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  field: string;
  direction: SortDirection;
}

export interface FilterOption {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'neq';
  value: any;
}

export interface QueryOptions {
  filters?: FilterOption[];
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface QueryResult<T> {
  data: T[];
  total: number;
  pageCount: number;
}

// --- 2. Update the Hook Signature (Fixes ts(2345)) ---

export function useDataQuery<T>(
  rawData: T[], // <--- Now accepts an Array, NOT a string ID
  options: QueryOptions = {}
): QueryResult<T> {
  const { filters, sort, page = 1, pageSize = 10 } = options;

  // A. Filtering Logic
  const filteredData = useMemo(() => {
    if (!filters || filters.length === 0) return rawData;

    return rawData.filter((item: any) => {
      return filters.every((filter) => {
        const itemValue = item[filter.field];
        
        switch (filter.operator) {
          case 'equals': return itemValue == filter.value;
          case 'neq': return itemValue != filter.value;
          case 'contains': 
            return String(itemValue).toLowerCase().includes(String(filter.value).toLowerCase());
          case 'gt': return itemValue > filter.value;
          case 'lt': return itemValue < filter.value;
          default: return true;
        }
      });
    });
  }, [rawData, filters]);

  // B. Sorting Logic
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sort]);

  // C. Pagination Logic
  const paginatedResult = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, page, pageSize]);

  return {
    data: paginatedResult,
    total: filteredData.length,
    pageCount: Math.ceil(filteredData.length / pageSize),
  };
}