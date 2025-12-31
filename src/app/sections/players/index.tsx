import Table, { BaseColumn, TableColumn } from '@/app/components/Table';
import { ReactNode } from 'react';

type DataObject = {
    id: number;
    name: string;
    category: string;
}

type DataColumn = BaseColumn & {
    id: number;
    label: string;
}

export default function PlayersSection() {
    const data: DataObject[] = [
        { id: 1, name: 'Item 1', category: 'A' },
        { id: 2, name: 'Item 2', category: 'B' },
        { id: 3, name: 'Item 3', category: 'A' },
        { id: 4, name: 'Item 4', category: 'C' },
    ];

    const columns: TableColumn<DataColumn>[] = [
        { id: 1, label: 'Id', onRender: renderRowHeader },
        { id: 2, label: 'Name', onRender: renderRowHeader },
        { id: 3, label: 'Actions', onRender: renderRowHeader },
    ];

    function renderRowData(row: DataObject): ReactNode {
        return (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{row.id}</td>
              <td className="border border-gray-300 px-4 py-2">{row.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                <button className="text-blue-500 hover:underline">Edit</button>
              </td>
            </tr>
        )
    }

    function renderRowHeader(column: DataColumn): ReactNode {
        return (
            <th key={column.id as string | number | bigint} className="border border-gray-300 px-4 py-2 text-left">
              {column.label}
            </th>
        )
    }

    return (
        <div className="w-full h-full flex flex-col gap-4 p-6">
            <div className="flex gap-4 items-end">
                <input
                    type="text"
                    placeholder="Search..."
                    className="px-4 py-2 border rounded-lg"
                />
                <select className="px-4 py-2 border rounded-lg">
                    <option>All Categories</option>
                </select>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    Filter
                </button>
            </div>

            <Table<DataObject, DataColumn> data={data} columns={columns} onRenderRow={renderRowData} />
        </div>
    )
}
