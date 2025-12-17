'use client';

import { useState, useEffect } from 'react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, formatRelativeTime, formatDaysUntil } from '@/utils/formatters';

export default function CheckoutApprovalCard({ checkout, onApprove, onDeny, onReturn }) {
  const [showDenyModal, setShowDenyModal] = useState(false);
  const [denialReason, setDenialReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // DEBUG: Check if onReturn exists
  useEffect(() => {
    console.log('CheckoutApprovalCard props:', {
      hasOnApprove: typeof onApprove === 'function',
      hasOnDeny: typeof onDeny === 'function',
      hasOnReturn: typeof onReturn === 'function',
      checkoutId: checkout._id,
      status: checkout.status
    });
  }, [onApprove, onDeny, onReturn, checkout]);

  async function handleApprove() {
    try {
      setProcessing(true);
      await onApprove(checkout._id);
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve checkout: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  async function handleDeny() {
    if (!denialReason.trim()) {
      alert('Please provide a reason for denial');
      return;
    }

    try {
      setProcessing(true);
      await onDeny(checkout._id, denialReason);
      setShowDenyModal(false);
      setDenialReason('');
    } catch (error) {
      console.error('Denial error:', error);
      alert('Failed to deny checkout: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  async function handleReturn() {
    console.log('handleReturn called');
    console.log('onReturn type:', typeof onReturn);
    console.log('onReturn value:', onReturn);
    
    if (!onReturn) {
      alert('ERROR: onReturn function is not defined! Please check the parent component.');
      return;
    }

    if (!confirm('Mark this equipment as returned?')) return;

    try {
      setProcessing(true);
      console.log('Calling onReturn with checkout ID:', checkout._id);
      await onReturn(checkout._id);
      console.log('onReturn succeeded');
    } catch (error) {
      console.error('Return error:', error);
      alert('Failed to mark as returned: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  const isPending = checkout.status === 'pending';
  const isApproved = checkout.status === 'approved';
  const isOverdue = isApproved && new Date(checkout.dueDate) < new Date();

  return (
    <>
      <div className={`border rounded-lg p-4 bg-white ${isOverdue ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900">
                {checkout.equipmentName || `Equipment ID: ${checkout.equipmentId?.toString().slice(-8) || 'Unknown'}`}
              </h3>
              <StatusBadge type="checkout" status={checkout.status} />
            </div>
            <p className="text-sm text-gray-600">
              Student: {checkout.studentName || checkout.studentEmail || checkout.firebaseUid}
            </p>
            {checkout.equipmentCategory && (
              <p className="text-xs text-gray-500">
                Category: {checkout.equipmentCategory}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>
            <span className="font-medium">Requested:</span>{' '}
            {formatRelativeTime(checkout.requestDate || checkout.createdAt)}
          </p>
          {checkout.checkoutDate && (
            <p>
              <span className="font-medium">Checked Out:</span>{' '}
              {formatDate(checkout.checkoutDate)}
            </p>
          )}
          <p>
            <span className="font-medium">Due Date:</span>{' '}
            {formatDate(checkout.dueDate)}
            {isApproved && (
              <span className={`ml-2 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                ({formatDaysUntil(checkout.dueDate)})
              </span>
            )}
          </p>
          {checkout.notes && (
            <p className="mt-2">
              <span className="font-medium">Notes:</span> {checkout.notes}
            </p>
          )}
          {checkout.denialReason && (
            <p className="mt-2 text-red-600">
              <span className="font-medium">Denial Reason:</span> {checkout.denialReason}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t">
          {isPending && (
            <>
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 px-3 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Approve'}
              </button>
              <button
                onClick={() => setShowDenyModal(true)}
                disabled={processing}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Deny
              </button>
            </>
          )}

          {isApproved && (
            <button
              onClick={handleReturn}
              disabled={processing}
              className="flex-1 px-3 py-2 bg-stevens-maroon text-white rounded text-sm font-medium hover:bg-stevens-maroon-dark disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Mark as Returned'}
            </button>
          )}

          {!isPending && !isApproved && (
            <div className="flex-1 text-center text-sm text-gray-500 py-2">
              No actions available
            </div>
          )}
        </div>
      </div>

      {/* Deny Modal */}
      {showDenyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Deny Checkout Request
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Denial *
              </label>
              <textarea
                value={denialReason}
                onChange={(e) => setDenialReason(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                placeholder="e.g., Equipment reserved for class, Training required first, etc."
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDenyModal(false);
                  setDenialReason('');
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeny}
                disabled={processing || !denialReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? 'Denying...' : 'Confirm Denial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}