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
  const [activeTab, setActiveTab] = useState('pending');
  
  // Fetch checkouts with ALL functions
  const hookResult = useCheckouts();
  
  console.log(' Hook result:', {
    hasCheckouts: Array.isArray(hookResult.checkouts),
    checkoutsCount: hookResult.checkouts?.length,
    hasApprove: typeof hookResult.approveCheckout === 'function',
    hasDeny: typeof hookResult.denyCheckout === 'function',
    hasReturn: typeof hookResult.returnCheckout === 'function',
  });
  
  const { 
    checkouts: allCheckouts = [],
    loading, 
    error, 
    refetch,
    approveCheckout,
    denyCheckout,
    returnCheckout
  } = hookResult;

  // Filter checkouts by tab
  const pendingCheckouts = allCheckouts
    .filter(c => c.status === 'pending')
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
  const activeCheckouts = allCheckouts
    .filter(c => c.status === 'approved')
    .sort((a, b) => new Date(b.checkoutDate || b.createdAt) - new Date(a.checkoutDate || a.createdAt));
    
  const historyCheckouts = allCheckouts
    .filter(c => ['returned', 'denied'].includes(c.status))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  // Handler functions
  async function handleApprove(checkoutId) {
    console.log(' handleApprove called with:', checkoutId);
    if (!approveCheckout) {
      console.error(' approveCheckout is not defined!');
      alert('Error: approveCheckout function is missing');
      return;
    }
    try {
      await approveCheckout(checkoutId);
      console.log(' Approve succeeded');
    } catch (error) {
      console.error(' Approve failed:', error);
      alert('Failed to approve: ' + error.message);
    }
  }

  async function handleDeny(checkoutId, reason) {
    console.log(' handleDeny called with:', checkoutId, reason);
    if (!denyCheckout) {
      console.error(' denyCheckout is not defined!');
      alert('Error: denyCheckout function is missing');
      return;
    }
    try {
      await denyCheckout(checkoutId, reason);
      console.log(' Deny succeeded');
    } catch (error) {
      console.error(' Deny failed:', error);
      alert('Failed to deny: ' + error.message);
    }
  }

  async function handleReturn(checkoutId) {
    console.log(' handleReturn called with:', checkoutId);
    console.log(' returnCheckout exists?', !!returnCheckout);
    console.log(' returnCheckout type:', typeof returnCheckout);
    
    if (!returnCheckout) {
      console.error(' returnCheckout is not defined!');
      console.error(' Hook result:', hookResult);
      alert('Error: returnCheckout function is missing from useCheckouts hook');
      return;
    }
    
    try {
      console.log('📞 Calling returnCheckout...');
      await returnCheckout(checkoutId);
      console.log(' Return succeeded');
    } catch (error) {
      console.error('Return failed:', error);
      alert('Failed to mark as returned: ' + error.message);
    }
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
              <span className="ml-2 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">
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
          <div className="mb-6">
            {currentCheckouts.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <p className="text-gray-500">
                  {activeTab === 'pending' && 'No pending requests'}
                  {activeTab === 'active' && 'No active checkouts'}
                  {activeTab === 'history' && 'No checkout history'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCheckouts.map((checkout) => (
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
        </>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingCheckouts.length}
          </div>
          <div className="text-sm text-gray-600">Pending Requests</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {activeCheckouts.length}
          </div>
          <div className="text-sm text-gray-600">Active Checkouts</div>
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