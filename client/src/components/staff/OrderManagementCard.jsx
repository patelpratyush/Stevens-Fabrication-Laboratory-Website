'use client';

import { useState } from 'react';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, formatCurrency, formatRelativeTime } from '@/utils/formatters';

export default function OrderManagementCard({ order, onUpdateStatus }) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [processing, setProcessing] = useState(false);

  async function handleUpdateStatus() {
    try {
      setProcessing(true);
      await onUpdateStatus(order._id, { status: selectedStatus });
      setShowStatusModal(false);
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status: ' + error.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <div className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {order.orderNumber}
            </h3>
            <p className="text-sm text-gray-600">
              Student: {order.studentName || order.studentEmail || order.firebaseUid}
            </p>
          </div>
          <StatusBadge type="order" status={order.status} />
        </div>

        <div className="space-y-2 text-sm mb-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Items:</span>
            <span className="font-medium">{order.items?.length || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold text-stevens-maroon">
              {formatCurrency(order.totalPrice || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Submitted:</span>
            <span>{formatRelativeTime(order.createdAt)}</span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="border-t pt-3 mb-3">
            <p className="text-xs font-medium text-gray-700 mb-2">Items:</p>
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-xs text-gray-600 flex justify-between">
                  <span>• {item.serviceName || 'Service'}</span>
                  <span>
                    {item.quantity}x @ {formatCurrency(item.unitPrice || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order.notes && (
          <div className="border-t pt-3 mb-3">
            <p className="text-xs font-medium text-gray-700">Notes:</p>
            <p className="text-xs text-gray-600 mt-1">{order.notes}</p>
          </div>
        )}

        {order.files && order.files.length > 0 && (
          <div className="border-t pt-3 mb-3">
            <p className="text-xs font-medium text-gray-700">Files:</p>
            <div className="mt-1 space-y-1">
              {order.files.map((file, idx) => (
                <a
                  key={idx}
                  href={file.url || file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline block"
                >
                  📎 {typeof file === 'string' ? file : file.name || `File ${idx + 1}`}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-3 border-t">
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex-1 px-3 py-2 bg-stevens-maroon text-white rounded text-sm font-medium hover:bg-stevens-maroon-dark"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Update Order Status
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order: {order.orderNumber}
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
              >
                <option value="submitted">Submitted</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedStatus(order.status);
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={processing || selectedStatus === order.status}
                className="flex-1 px-4 py-2 bg-stevens-maroon text-white rounded font-medium hover:bg-stevens-maroon-dark disabled:opacity-50"
              >
                {processing ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}