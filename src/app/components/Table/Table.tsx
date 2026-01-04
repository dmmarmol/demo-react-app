"use client";

import { ReactNode, useState, useMemo } from "react";

export type BaseColumn = { id: string | number, [key: string]: unknown };
export type BaseRow = unknown;
type OnRender<T> = (data: T, index: number, array: T[]) => ReactNode;

export type TableColumn<T extends BaseColumn, Row = Record<string, unknown>> = T & {
  onRender: OnRender<T>;
  sortKey?: Extract<keyof Row, string>;
};

type TableProps<Row extends BaseRow, Column extends BaseColumn = BaseColumn> = {
  data: Row[];
  columns: TableColumn<Column, Row>[];
  onRenderRow: OnRender<Row>;
};

type SortState = {
  column: string;
  direction: 'asc' | 'desc';
};

export default function Table<Row extends BaseRow, Column extends BaseColumn = BaseColumn>({ data, columns, onRenderRow }: TableProps<Row, Column>) {
  const [sort, setSort] = useState<SortState>({ column: "", direction: 'asc' });

  const sortedData = useMemo(() => {
    if (!sort.column) return data;

    return [...data].sort((a, b) => {
      const rowA = a as Record<string, string>;
      const rowB = b as Record<string, string>;
      const aVal = rowA[sort.column];
      const bVal = rowB[sort.column];

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sort]);

  const handleSort = (column: TableColumn<Column>) => {
    if (!column.sortKey) return;
    
    setSort((prev) => ({
      column: column.sortKey as string,
      direction: prev.column === column.sortKey && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderHeaderWithSort = (column: TableColumn<Column>, index: number) => {
    const isSorted = sort.column === column.sortKey;
    const chevron = isSorted ? (sort.direction === 'asc' ? ' ↑' : ' ↓') : '';

    return (
      <th
        key={`${index}-${column.id}`}
        onClick={() => column.sortKey && handleSort(column)}
        className={`border border-gray-300 px-4 py-2 text-left ${column.sortKey ? 'cursor-pointer hover:bg-gray-200' : ''}`}
      >
        {column.onRender(column, index, columns)}
        {column.sortKey && chevron}
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index) => renderHeaderWithSort(column, index))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map(onRenderRow)}
        </tbody>
      </table>
    </div>
  );
}
