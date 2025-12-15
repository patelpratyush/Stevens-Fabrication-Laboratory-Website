// Reusable table component
export default function Table({ columns, data, onRowClick }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""}
            >
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* Usage example:
const columns = [
  { header: "Name", key: "name" },
  { header: "Status", key: "status", render: (row) => <StatusBadge status={row.status} /> },
  { header: "Price", key: "price", render: (row) => `$${row.price}` }
];

<Table columns={columns} data={items} onRowClick={(item) => handleClick(item)} />
*/
