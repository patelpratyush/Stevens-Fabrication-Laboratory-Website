'use client';

export default function StaffEquipmentPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Equipment Management</h1>
      <p className="text-gray-600 mb-8">
        Manage equipment inventory and checkouts
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Equipment List</h2>
          <p className="text-gray-500">
            Add, edit, and manage equipment...
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Active Checkouts</h2>
          <p className="text-gray-500">
            View and manage equipment checkouts...
          </p>
        </div>
      </div>
    </section>
  );
}
