import { render, screen, fireEvent } from '@testing-library/react';
import Table, { TableColumn, BaseColumn } from './Table';
import { ReactNode } from 'react';

describe('Table Component', () => {
    type MockRow = {
        id: number;
        name: string;
        age: number;
        role: string;
    };

    type MockColumn = BaseColumn & {
        label: string;
    };

    const mockData: MockRow[] = [
        { id: 1, name: 'Alice', age: 30, role: 'Developer' },
        { id: 2, name: 'Bob', age: 25, role: 'Designer' },
        { id: 3, name: 'Charlie', age: 35, role: 'Manager' },
        { id: 4, name: 'Diana', age: 28, role: 'Developer' },
    ];

    const mockColumns: TableColumn<MockColumn, MockRow>[] = [
        { id: 1, label: 'Name', sortKey: 'name', onRender: (col) => col.label },
        { id: 2, label: 'Age', sortKey: 'age', onRender: (col) => col.label },
        { id: 3, label: 'Role', sortKey: 'role', onRender: (col) => col.label },
        { id: 4, label: 'Actions', onRender: (col) => col.label }, // Non-sortable column
    ];

    const mockRenderRow = (row: MockRow): ReactNode => (
        <tr key={row.id} data-testid={`row-${row.id}`}>
            <td>{row.name}</td>
            <td>{row.age}</td>
            <td>{row.role}</td>
            <td>
                <button>Edit</button>
            </td>
        </tr>
    );

    it('should render the Table component', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render the correct number of columns', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        const headers = screen.getAllByRole('columnheader');
        expect(headers).toHaveLength(mockColumns.length);
        expect(headers[0]).toHaveTextContent('Name');
        expect(headers[1]).toHaveTextContent('Age');
        expect(headers[2]).toHaveTextContent('Role');
        expect(headers[3]).toHaveTextContent('Actions');
    });

    it('should render the correct number of rows', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        expect(screen.getByTestId('row-1')).toBeInTheDocument();
        expect(screen.getByTestId('row-2')).toBeInTheDocument();
        expect(screen.getByTestId('row-3')).toBeInTheDocument();
        expect(screen.getByTestId('row-4')).toBeInTheDocument();
    });

    it('should render all data in rows', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Charlie')).toBeInTheDocument();
        expect(screen.getByText('Diana')).toBeInTheDocument();
        expect(screen.getByText('30')).toBeInTheDocument();
        expect(screen.getByText('25')).toBeInTheDocument();
    });

    it('should show cursor pointer for sortable columns', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        const headers = screen.getAllByRole('columnheader');
        expect(headers[0]).toHaveClass('cursor-pointer');
        expect(headers[1]).toHaveClass('cursor-pointer');
        expect(headers[2]).toHaveClass('cursor-pointer');
        expect(headers[3]).not.toHaveClass('cursor-pointer'); // Actions column is not sortable
    });

    it('should sort data in ascending order when clicking a column header', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);

        // After sorting by name ascending, the order should be: Alice, Bob, Charlie, Diana
        const rows = screen.getAllByRole('row');
        // rows[0] is the header row, data rows start from rows[1]
        expect(rows[1]).toHaveTextContent('Alice');
        expect(rows[2]).toHaveTextContent('Bob');
        expect(rows[3]).toHaveTextContent('Charlie');
        expect(rows[4]).toHaveTextContent('Diana');

        // Check for ascending chevron
        expect(nameHeader.parentElement).toHaveTextContent('↑');
    });

    it('should sort data in descending order when clicking the same column header twice', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        const nameHeader = screen.getByText('Name');

        // First click - ascending
        fireEvent.click(nameHeader);
        expect(nameHeader.parentElement).toHaveTextContent('↑');

        // Second click - descending
        fireEvent.click(nameHeader);

        // After sorting by name descending, the order should be: Diana, Charlie, Bob, Alice
        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Diana');
        expect(rows[2]).toHaveTextContent('Charlie');
        expect(rows[3]).toHaveTextContent('Bob');
        expect(rows[4]).toHaveTextContent('Alice');

        // Check for descending chevron
        expect(nameHeader.parentElement).toHaveTextContent('↓');
    });

    it('should sort numeric data correctly', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        const ageHeader = screen.getByText('Age');

        // Click to sort by age ascending
        fireEvent.click(ageHeader);

        const rows = screen.getAllByRole('row');
        // Ages in ascending order: 25 (Bob), 28 (Diana), 30 (Alice), 35 (Charlie)
        expect(rows[1]).toHaveTextContent('Bob');
        expect(rows[1]).toHaveTextContent('25');
        expect(rows[2]).toHaveTextContent('Diana');
        expect(rows[2]).toHaveTextContent('28');
        expect(rows[3]).toHaveTextContent('Alice');
        expect(rows[3]).toHaveTextContent('30');
        expect(rows[4]).toHaveTextContent('Charlie');
        expect(rows[4]).toHaveTextContent('35');
    });

    it('should switch sorting between different columns', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        // Sort by name first
        const nameHeader = screen.getByText('Name');
        fireEvent.click(nameHeader);
        expect(nameHeader).toHaveTextContent('↑');

        // Then sort by age
        const ageHeader = screen.getByText('Age');
        fireEvent.click(ageHeader);

        // Age header should show ascending chevron
        expect(ageHeader).toHaveTextContent('↑');

        screen.debug();
        // Name header should no longer show chevron
        expect(nameHeader?.textContent).toBe('Name');

        // Data should be sorted by age
        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('25');
    });

    it('should not sort when clicking a non-sortable column', () => {
        render(
            <Table<MockRow, MockColumn>
                data={mockData}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        const actionsHeader = screen.getByText('Actions');
        fireEvent.click(actionsHeader);

        // No chevron should appear
        expect(actionsHeader?.textContent).toBe('Actions');

        // Data should remain in original order
        const rows = screen.getAllByRole('row');
        expect(rows[1]).toHaveTextContent('Alice');
        expect(rows[2]).toHaveTextContent('Bob');
        expect(rows[3]).toHaveTextContent('Charlie');
        expect(rows[4]).toHaveTextContent('Diana');
    });

    it('should handle empty data array', () => {
        render(
            <Table<MockRow, MockColumn>
                data={[]}
                columns={mockColumns}
                onRenderRow={mockRenderRow}
            />,
        );

        expect(screen.getByRole('table')).toBeInTheDocument();
        const headers = screen.getAllByRole('columnheader');
        expect(headers).toHaveLength(mockColumns.length);

        // Only header row should exist
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(1); // Only the header row
    });
});
