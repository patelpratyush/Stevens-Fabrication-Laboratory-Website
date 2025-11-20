export default function StaffDashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Staff Dashboard
      </h1>
      <p className="text-gray-700 mb-8">
        View and manage incoming orders, active equipment checkouts, and lab
        activity.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Incoming Orders Section */}
        <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-stevens-maroon">
            Incoming Orders
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">
              No incoming orders
            </p>
          </div>
        </div>

        {/* Active Checkouts Section */}
        <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4 text-stevens-maroon">
            Active Checkouts
          </h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">
              No active checkouts
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Active Checkouts</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Completed Today</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Equipment Issues</p>
          </div>
        </div>
      </div>
    </section>
  );
}
