import Table from '@/app/components/Table' 

type DataObject = {
    id: number;
    name: string;
    category: string;
}

export default function PlayersSection() {
    const data = [
        { id: 1, name: 'Item 1', category: 'A' },
        { id: 2, name: 'Item 2', category: 'B' },
        { id: 3, name: 'Item 3', category: 'A' },
        { id: 4, name: 'Item 4', category: 'C' },
    ];

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

            <Table<DataObject> data={data} />
        </div>
    )
}
