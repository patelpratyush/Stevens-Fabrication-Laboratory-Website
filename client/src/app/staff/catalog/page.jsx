export default function CatalogManagementPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Catalog Management
      </h1>
      <p className="text-gray-700 mb-8">
        Manage services, materials, equipment pricing, and availability. Update
        catalog items and pricing tiers.
      </p>

      {/* Services Section */}
      <div className="mb-8 border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-stevens-maroon">
            Services
          </h2>
          <button className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-stevens-maroon-dark text-sm">
            + Add Service
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Service Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Base Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-4 py-8 text-sm text-gray-500 text-center">
                  No services available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Materials Section */}
      <div className="mb-8 border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-stevens-maroon">
            Materials
          </h2>
          <button className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-stevens-maroon-dark text-sm">
            + Add Material
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Material Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Price/Unit
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-4 py-8 text-sm text-gray-500 text-center">
                  No materials available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-stevens-maroon">
            Equipment
          </h2>
          <button className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-stevens-maroon-dark text-sm">
            + Add Equipment
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Equipment Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Hourly Rate
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-4 py-8 text-sm text-gray-500 text-center">
                  No equipment available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
