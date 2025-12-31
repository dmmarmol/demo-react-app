import { ReactNode } from "react";

export type BaseColumn = { id: string | number, [key: string]: unknown };
export type BaseRow = unknown;
type OnRender<T> = (data: T, index: number, array: T[]) => ReactNode;

export type TableColumn<T extends BaseColumn> = T & {
  onRender: OnRender<T>;
};

type TableProps<Row extends BaseRow, Column extends BaseColumn = BaseColumn> = {
  data: Row[];
  columns: TableColumn<Column>[];
  onRenderRow: OnRender<Row>;
};

export default function Table<Row extends BaseRow, Column extends BaseColumn = BaseColumn>({ data, columns, onRenderRow }: TableProps<Row, Column>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column, index, array) => column.onRender(column, index, array))}
          </tr>
        </thead>
        <tbody>
          {data.map(onRenderRow)}
        </tbody>
      </table>
    </div>
  );
}
