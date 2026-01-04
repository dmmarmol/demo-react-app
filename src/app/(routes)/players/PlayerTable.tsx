// PlayerTable.tsx
"use client";

import Table, { BaseColumn, TableColumn } from '@/app/components/Table/Table';
import { Player } from '@/lib/api-handlers/players/players-types';
import { ReactNode } from 'react';

type DataColumn = BaseColumn & {
    label: string;
}

type PlayerTableProps = {
    data: Player[];
};

export default function PlayerTable({ data }: PlayerTableProps) {
    const columns: TableColumn<DataColumn, Player>[] = [
        { id: 1, label: 'N#', sortKey: 'shirtNumber', onRender: (col) => col.label },
        { id: 2, label: 'Name', sortKey: 'name', onRender: (col) => col.label },
        { id: 3, label: 'Age', sortKey: 'age', onRender: (col) => col.label },
        { id: 4, label: 'Position', sortKey: 'position', onRender: (col) => col.label },
        { id: 5, label: 'Team', sortKey: 'team', onRender: (col) => col.label },
    ];

    function renderRowData(row: Player): ReactNode {
        return (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{row.shirtNumber}</td>
              <td className="border border-gray-300 px-4 py-2">{row.name}</td>
              <td className="border border-gray-300 px-4 py-2">{row.age}</td>
              <td className="border border-gray-300 px-4 py-2">{row.position}</td>
              <td className="border border-gray-300 px-4 py-2">{row.team}</td>
            </tr>
        );
    }

    return <Table<Player, DataColumn> data={data} columns={columns} onRenderRow={renderRowData} />;
}