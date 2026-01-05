import Table, { BaseColumn, TableColumn } from '@/app/components/Table/Table';
import { getPlayersRepository } from '@/repository/players/get-players-repository';
import { Player } from '@/lib/api-handlers/players/players-types';
import { ReactNode } from 'react';
import PlayerTable from './PlayerTable';

type DataColumn = BaseColumn & {
    label: string;
}

export default async function PlayersSection() {
    const result = await getPlayersRepository();
    const data: Player[] = result.results;

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

            <h1 className="text-2xl font-bold text-gray-800">Season {result.season}</h1>

            <PlayerTable data={result.results} />
        </div>
    )
}
