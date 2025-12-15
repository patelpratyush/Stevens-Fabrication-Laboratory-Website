'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import OrderManagementCard from '@/components/staff/OrderManagementCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { StaffOnly } from '@/components/shared/ProtectedRoute';
import { formatCurrency } from '@/utils/formatters';

export default function StaffOrdersPage() {
  return (
    <StaffOnly>
      <OrdersContent />
    </StaffOnly>
  );
}

function OrdersContent() {
  const [activeTab, setActiveTab] = useState('submitted'); // submitted, in-progress, completed, all
  
  const { orders, loading, error, refetch, updateOrder } = useOrders();

  // Filter orders by status
  const submittedOrders = orders.filter(o => o.status === 'submitted');
  const inProgressOrders = orders.filter(o => o.status === 'in-progress');
  const completedOrders = orders.filter(o => o.status === 'completed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  async function handleUpdateStatus(orderId, updates) {
    await updateOrder(orderId, updates);
  }

  // Get current tab's orders
  function getCurrentOrders() {
    switch (activeTab) {
      case 'submitted':
        return submittedOrders;
      case 'in-progress':
        return inProgressOrders;
      case 'completed':
        return completedOrders;
      case 'all':
        return orders;
      default:
        return [];
    }
  }

  const currentOrders = getCurrentOrders();

  // Calculate total revenue
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Order Management
      </h1>
      <p className="text-gray-700 mb-8">
        Review and manage student orders. Update order status as work progresses.
      </p>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('submitted')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'submitted'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            New Orders
            {submittedOrders.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">
                {submittedOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('in-progress')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'in-progress'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            In Progress
            {inProgressOrders.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                {inProgressOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'completed'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'all'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Orders
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading orders..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <>
          {/* Tab Content */}
          <div className="mb-6">
            {currentOrders.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">
                  {activeTab === 'submitted' && 'No new orders'}
                  {activeTab === 'in-progress' && 'No orders in progress'}
                  {activeTab === 'completed' && 'No completed orders'}
                  {activeTab === 'all' && 'No orders yet'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Orders will appear here when students submit them
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentOrders.map((order) => (
                  <OrderManagementCard
                    key={order._id}
                    order={order}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {submittedOrders.length}
          </div>
          <div className="text-sm text-gray-600">New Orders</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {inProgressOrders.length}
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {completedOrders.length}
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {orders.length}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-stevens-maroon">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
      </div>
    </section>
  );
}