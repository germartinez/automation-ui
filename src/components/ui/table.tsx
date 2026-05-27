'use client';

import { cn } from '@/utils';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';
export type Sort = { key: string; direction: SortDirection };

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'bigint' && typeof b === 'bigint') return a < b ? -1 : a > b ? 1 : 0;
  if (typeof a === 'boolean' && typeof b === 'boolean') return a === b ? 0 : a ? -1 : 1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a ?? '').localeCompare(String(b ?? ''));
}

export type Column<T = unknown> = {
  label: string;
  key?: string;
  getValue?: (item: T) => unknown;
};

export function useSorted<T>(data: T[] | undefined, columns: Column<T>[], initial?: Sort) {
  const [sort, setSort] = useState<Sort | undefined>(initial);

  const sorted = useMemo(() => {
    if (!data || !sort) return data;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.key) return data;
    const accessor = col.getValue ?? ((item: T) => (item as Record<string, unknown>)[col.key!]);
    const mul = sort.direction === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const va = accessor(a);
      const vb = accessor(b);
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      return mul * compare(va, vb);
    });
  }, [data, columns, sort]);

  return { sorted, sort, setSort };
}

type TableHeaderProps<T> = {
  columns: Column<T>[];
  gridCols: string;
  sort?: Sort;
  onSortChange?: (sort: Sort) => void;
};

export function TableHeader<T>({ columns, gridCols, sort, onSortChange }: TableHeaderProps<T>) {
  const handleClick = (key: string) => {
    if (!onSortChange) return;
    const direction: SortDirection = sort?.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ key, direction });
  };

  return (
    <div
      className={cn(
        'grid items-center gap-4 p-4 text-xs uppercase font-semibold text-(--text-ter) border-b border-(--border)',
        gridCols,
      )}
    >
      {columns.map((col, i) => {
        const sortable = !!col.key && !!onSortChange;
        const active = sortable && sort?.key === col.key;

        if (!sortable) {
          return (
            <span key={i} className="truncate">
              {col.label}
            </span>
          );
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(col.key!)}
            className={cn(
              'flex items-center gap-1 truncate text-left cursor-pointer',
              'text-xs uppercase font-semibold text-(--text-ter)',
              'hover:text-(--text) transition-colors duration-100',
              active && 'text-(--text)',
            )}
          >
            <span className="truncate">{col.label}</span>
            {active && sort?.direction === 'asc' && <ChevronUpIcon size={12} />}
            {active && sort?.direction === 'desc' && <ChevronDownIcon size={12} />}
          </button>
        );
      })}
    </div>
  );
}

type TableProps = {
  children: React.ReactNode;
  className?: string;
};

function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        'bg-(--surface) border border-(--border) rounded-xl overflow-hidden h-fit divide-y divide-(--border-light)',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Table;
