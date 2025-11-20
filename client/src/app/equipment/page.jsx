export default function EquipmentPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Equipment</h1>
      <p className="text-gray-700 mb-8">
        Browse our available equipment and check real-time availability status.
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Equipment
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td colSpan="3" className="px-6 py-8 text-sm text-gray-500 text-center">
                No equipment available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
