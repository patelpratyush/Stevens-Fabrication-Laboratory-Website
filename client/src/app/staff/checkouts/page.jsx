'use client';

import { useState } from 'react';
import { useCheckouts } from '@/hooks/useCheckouts';
import CheckoutApprovalCard from '@/components/staff/CheckoutApprovalCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { StaffOnly } from '@/components/shared/ProtectedRoute';

export default function StaffCheckoutsPage() {
  return (
    <StaffOnly>
      <CheckoutsContent />
    </StaffOnly>
  );
}

function CheckoutsContent() {
  const [activeTab, setActiveTab] = useState('pending'); // pending, active, history
  
  // Fetch different checkout types
  const { 
    checkouts: allCheckouts, 
    loading, 
    error, 
    refetch,
    approveCheckout,
    denyCheckout,
    returnCheckout
  } = useCheckouts();

  // Filter checkouts by tab and sort by date (oldest first)
  const pendingCheckouts = allCheckouts
    .filter(c => c.status === 'pending')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // Oldest first
    
  const activeCheckouts = allCheckouts
    .filter(c => c.status === 'approved')
    .sort((a, b) => new Date(b.checkoutDate || b.createdAt) - new Date(a.checkoutDate || a.createdAt)); // Newest first
    
  const historyCheckouts = allCheckouts
    .filter(c => ['returned', 'denied'].includes(c.status))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Newest first

  async function handleApprove(checkoutId) {
    await approveCheckout(checkoutId);
  }

  async function handleDeny(checkoutId, reason) {
    await denyCheckout(checkoutId, reason);
  }

  async function handleReturn(checkoutId) {
    await returnCheckout(checkoutId);
  }

  // Get current tab's checkouts
  function getCurrentCheckouts() {
    switch (activeTab) {
      case 'pending':
        return pendingCheckouts;
      case 'active':
        return activeCheckouts;
      case 'history':
        return historyCheckouts;
      default:
        return [];
    }
  }

  const currentCheckouts = getCurrentCheckouts();

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Checkout Management
      </h1>
      <p className="text-gray-700 mb-8">
        Review and manage equipment checkout requests and active checkouts.
      </p>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'pending'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Requests
            {pendingCheckouts.length > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                {pendingCheckouts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'active'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active Checkouts
            {activeCheckouts.length > 0 && (
              <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                {activeCheckouts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'history'
                ? 'border-stevens-maroon text-stevens-maroon'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
          </button>
        </nav>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner text="Loading checkouts..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : (
        <>
          {/* Tab Content */}
          {activeTab === 'pending' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Pending Requests ({pendingCheckouts.length})
                </h2>
              </div>

              {pendingCheckouts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No pending checkout requests</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Requests will appear here when students submit them
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingCheckouts.map((checkout) => (
                    <CheckoutApprovalCard
                      key={checkout._id}
                      checkout={checkout}
                      onApprove={handleApprove}
                      onDeny={handleDeny}
                      onReturn={handleReturn}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'active' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Active Checkouts ({activeCheckouts.length})
                </h2>
              </div>

              {activeCheckouts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No active checkouts</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Approved checkouts will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCheckouts.map((checkout) => (
                    <CheckoutApprovalCard
                      key={checkout._id}
                      checkout={checkout}
                      onApprove={handleApprove}
                      onDeny={handleDeny}
                      onReturn={handleReturn}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Checkout History ({historyCheckouts.length})
                </h2>
              </div>

              {historyCheckouts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No checkout history</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Returned and denied checkouts will appear here
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {historyCheckouts.map((checkout) => (
                    <CheckoutApprovalCard
                      key={checkout._id}
                      checkout={checkout}
                      onApprove={handleApprove}
                      onDeny={handleDeny}
                      onReturn={handleReturn}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingCheckouts.length}
          </div>
          <div className="text-sm text-gray-600">Pending Requests</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {activeCheckouts.length}
          </div>
          <div className="text-sm text-gray-600">Active Checkouts</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">
            {activeCheckouts.filter(c => new Date(c.dueDate) < new Date()).length}
          </div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {allCheckouts.length}
          </div>
          <div className="text-sm text-gray-600">Total Checkouts</div>
        </div>
      </div>
    </section>
  );
}