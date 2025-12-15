'use client';

import { useOrders } from '@/hooks/useOrders';
import { useCheckouts } from '@/hooks/useCheckouts';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/shared/StatusBadge';
import { StaffOnly } from '@/components/shared/ProtectedRoute';
import { formatDate, formatCurrency, formatRelativeTime } from '@/utils/formatters';
import Link from 'next/link';

export default function StaffDashboardPage() {
  return (
    <StaffOnly>
      <DashboardContent />
    </StaffOnly>
  );
}

function DashboardContent() {
  const { orders, loading: ordersLoading } = useOrders();
  const { checkouts: pendingCheckouts, loading: checkoutsLoading } = useCheckouts('pending');
  const { checkouts: approvedCheckouts } = useCheckouts('approved');

  // Filter for incoming (submitted) orders
  const incomingOrders = orders.filter(order => order.status === 'submitted');

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Staff Dashboard
      </h1>
      <p className="text-gray-700 mb-8">
        View and manage incoming orders, active equipment checkouts, and lab activity.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Incoming Orders Section */}
        <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-stevens-maroon">
              Incoming Orders ({incomingOrders.length})
            </h2>
            <Link
              href="/staff/orders"
              className="text-sm text-stevens-maroon hover:underline"
            >
              View All →
            </Link>
          </div>

          {ordersLoading ? (
            <LoadingSpinner text="Loading orders..." />
          ) : incomingOrders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No incoming orders
            </p>
          ) : (
            <div className="space-y-3">
              {incomingOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                    <StatusBadge type="order" status={order.status} />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {formatRelativeTime(order.createdAt)}
                    </span>
                    <span className="font-semibold text-stevens-maroon">
                      {formatCurrency(order.totalPrice || 0)}
                    </span>
                  </div>
                  {order.notes && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      Note: {order.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Checkout Requests Section */}
        <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-stevens-maroon">
              Pending Checkout Requests ({pendingCheckouts.length})
            </h2>
            <Link
              href="/staff/checkouts"
              className="text-sm text-stevens-maroon hover:underline"
            >
              View All →
            </Link>
          </div>

          {checkoutsLoading ? (
            <LoadingSpinner text="Loading requests..." />
          ) : pendingCheckouts.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No pending requests
            </p>
          ) : (
            <div className="space-y-3">
              {pendingCheckouts.slice(0, 5).map((checkout) => (
                <div
                  key={checkout._id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        Equipment ID: {checkout.equipmentId.toString().slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        User: {checkout.firebaseUid?.slice(0, 10)}...
                      </p>
                    </div>
                    <StatusBadge type="checkout" status={checkout.status} />
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Due: {formatDate(checkout.dueDate)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Requested {formatRelativeTime(checkout.createdAt)}
                    </p>
                  </div>
                  {checkout.notes && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      Note: {checkout.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Activity Stats */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-xl font-semibold mb-4">Today&apos;s Activity</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">
              {incomingOrders.length}
            </p>
            <p className="text-sm text-gray-600">Pending Orders</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-600">
              {pendingCheckouts.length}
            </p>
            <p className="text-sm text-gray-600">Pending Checkouts</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {approvedCheckouts.length}
            </p>
            <p className="text-sm text-gray-600">Active Checkouts</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-600">
              {orders.filter(o => 
                o.status === 'completed' && 
                new Date(o.updatedAt).toDateString() === new Date().toDateString()
              ).length}
            </p>
            <p className="text-sm text-gray-600">Completed Today</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/staff/catalog"
          className="border-2 border-stevens-maroon rounded-lg p-6 bg-white hover:bg-stevens-maroon hover:text-white transition-colors text-center"
        >
          <div className="text-2xl mb-2"></div>
          <h3 className="font-semibold mb-1">Manage Catalog</h3>
          <p className="text-sm opacity-80">
            Update services and materials
          </p>
        </Link>

        <Link
          href="/staff/equipment"
          className="border-2 border-stevens-maroon rounded-lg p-6 bg-white hover:bg-stevens-maroon hover:text-white transition-colors text-center"
        >
          <div className="text-2xl mb-2">🔧</div>
          <h3 className="font-semibold mb-1">Manage Equipment</h3>
          <p className="text-sm opacity-80">
            Update equipment status
          </p>
        </Link>

        <Link
          href="/staff/checkouts"
          className="border-2 border-stevens-maroon rounded-lg p-6 bg-white hover:bg-stevens-maroon hover:text-white transition-colors text-center"
        >
          <div className="text-2xl mb-2"></div>
          <h3 className="font-semibold mb-1">Review Checkouts</h3>
          <p className="text-sm opacity-80">
            Approve pending requests
          </p>
        </Link>
      </div>
    </section>
  );
}