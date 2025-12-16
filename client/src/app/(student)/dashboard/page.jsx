'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useMyOrders } from '@/hooks/useOrders';
import { useMyCheckouts } from '@/hooks/useCheckouts';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, formatCurrency, formatRelativeTime } from '@/utils/formatters';
import { RequireAuth } from '@/components/shared/ProtectedRoute';

export default function DashboardPage() {

  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
function DashboardContent() {

  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && userProfile) {
      // Redirect staff to staff dashboard
      if (userProfile.role === 'staff') {
        router.push('/staff/dashboard');
      }
    }
  }, [userProfile, authLoading, router]);

  if (authLoading) {
    return <LoadingSpinner size="lg" text="Loading your dashboard..." />;
  }

  // If staff, show nothing (they're being redirected)
  if (userProfile?.role === 'staff') {
    return <LoadingSpinner size="lg" text="Redirecting to staff dashboard..." />;
  }

  // Student dashboard
  return <StudentDashboard userProfile={userProfile} />;
}

function StudentDashboard({ userProfile }) {
  const { orders, loading: ordersLoading } = useMyOrders();
  const { checkouts, loading: checkoutsLoading } = useMyCheckouts();

  // Filter active orders and checkouts
  const activeOrders = orders.filter(o => ['submitted', 'in_progress'].includes(o.status));
  const activeCheckouts = checkouts.filter(c => ['pending', 'approved'].includes(c.status));

  // Calculate stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>
      <p className="text-gray-700 mb-8">
        Welcome back, {userProfile?.name || 'Student'}! Track your orders, equipment checkouts, and account activity.
      </p>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link href="/orders" className="text-sm text-stevens-maroon hover:underline">
              View All →
            </Link>
          </div>

          {ordersLoading ? (
            <LoadingSpinner text="Loading orders..." />
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No orders yet</p>
              <Link
                href="/orders"
                className="inline-block px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-red-800 text-sm"
              >
                Create Your First Order
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order._id}
                  className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-600">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                    <StatusBadge type="order" status={order.status} />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">
                      {formatRelativeTime(order.createdAt)}
                    </span>
                    <span className="font-semibold text-stevens-maroon">
                      {formatCurrency(order.totalPrice || 0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equipment Checkouts */}
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Equipment Checkouts</h2>
            <Link href="/equipment" className="text-sm text-stevens-maroon hover:underline">
              Browse Equipment →
            </Link>
          </div>

          {checkoutsLoading ? (
            <LoadingSpinner text="Loading checkouts..." />
          ) : checkouts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No checkouts yet</p>
              <Link
                href="/equipment"
                className="inline-block px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-red-800 text-sm"
              >
                Browse Equipment
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {checkouts.slice(0, 3).map((checkout) => (
                <div
                  key={checkout._id}
                  className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">
                        Equipment ID: {checkout.equipmentId.toString().slice(-6)}
                      </p>
                      {checkout.dueDate && (
                        <p className="text-xs text-gray-600">
                          Due: {formatDate(checkout.dueDate)}
                        </p>
                      )}
                    </div>
                    <StatusBadge type="checkout" status={checkout.status} />
                  </div>
                  {checkout.status === 'denied' && checkout.denialReason && (
                    <p className="text-xs text-red-600 mt-1">
                      Reason: {checkout.denialReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Account Summary */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-stevens-maroon">
              {totalOrders}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Orders</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-stevens-maroon">
              {formatCurrency(totalSpent)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Spent</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-stevens-maroon">
              {activeOrders.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active Orders</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-stevens-maroon">
              {activeCheckouts.length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active Checkouts</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/orders"
          className="block border-2 border-stevens-maroon rounded-lg p-6 text-center hover:bg-red-50 transition group"
        >
          <div className="text-4xl mb-2">📦</div>
          <h3 className="font-semibold text-stevens-maroon group-hover:underline">
            Create New Order
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Submit a new fabrication request
          </p>
        </Link>

        <Link
          href="/equipment"
          className="block border-2 border-stevens-maroon rounded-lg p-6 text-center hover:bg-red-50 transition group"
        >
          <div className="text-4xl mb-2">🔧</div>
          <h3 className="font-semibold text-stevens-maroon group-hover:underline">
            Checkout Equipment
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Request lab equipment
          </p>
        </Link>

        <Link
          href="/services"
          className="block border-2 border-stevens-maroon rounded-lg p-6 text-center hover:bg-red-50 transition group"
        >
          <div className="text-4xl mb-2">ℹ️</div>
          <h3 className="font-semibold text-stevens-maroon group-hover:underline">
            View Services
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Browse available services
          </p>
        </Link>
      </div>
    </section>
  );
}
