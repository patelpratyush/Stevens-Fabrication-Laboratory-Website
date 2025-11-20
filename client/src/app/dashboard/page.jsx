export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>
      <p className="text-gray-700 mb-8">
        Track your orders, equipment checkouts, and account activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">
              No orders yet
            </p>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h2 className="text-xl font-semibold mb-4">Equipment Checkouts</h2>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center py-8">
              No active checkouts
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Hours Logged</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-300">-</p>
            <p className="text-sm text-gray-600">Certifications</p>
          </div>
        </div>
      </div>
    </section>
  );
}
