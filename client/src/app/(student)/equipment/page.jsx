'use client';

import { useState } from 'react';
import { useEquipment } from '@/hooks/useEquipment';
import { useMyCheckouts } from '@/hooks/useCheckouts';
import { checkoutsAPI } from '@/lib/api';
import EquipmentCard from '@/components/student/EquipmentCard';
import CheckoutRequestModal from '@/components/student/CheckoutRequestModal';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import StatusBadge from '@/components/shared/StatusBadge';
import { formatDate, formatDaysUntil } from '@/utils/formatters';

export default function EquipmentPage() {
  const { equipment, loading: equipmentLoading, error: equipmentError, refetch: refetchEquipment } = useEquipment();
  const { checkouts, loading: checkoutsLoading, refetch: refetchCheckouts } = useMyCheckouts();
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  function handleRequestCheckout(equipmentItem) {
    setSelectedEquipment(equipmentItem);
    setShowRequestModal(true);
    setSubmitError('');
    setSubmitSuccess('');
  }

  async function handleSubmitRequest(requestData) {
    try {
      await checkoutsAPI.request(requestData);
      setShowRequestModal(false);
      setSubmitSuccess('Checkout request submitted! Staff will review your request.');
      await refetchCheckouts();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitSuccess(''), 5000);
    } catch (error) {
      throw new Error(error.message || 'Failed to submit checkout request');
    }
  }

  function handleCancelRequest() {
    setShowRequestModal(false);
    setSelectedEquipment(null);
  }

  // Filter available equipment
  const availableEquipment = equipment.filter(e => e.status === 'available');

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">Equipment</h1>
      <p className="text-gray-600 mb-8">
        Browse and request checkout of available lab equipment
      </p>

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">{submitSuccess}</p>
        </div>
      )}

      {/* My Checkouts Section */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Checkouts</h2>
        
        {checkoutsLoading ? (
          <LoadingSpinner text="Loading your checkouts..." />
        ) : checkouts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            You have no checkout requests or active checkouts
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Equipment
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Requested
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {checkouts.map((checkout) => (
                  <tr key={checkout._id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      Equipment ID: {checkout.equipmentId.toString().slice(-6)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge type="checkout" status={checkout.status} />
                      {checkout.status === 'denied' && checkout.denialReason && (
                        <p className="text-xs text-red-600 mt-1">
                          {checkout.denialReason}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(checkout.requestDate || checkout.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-gray-900">
                        {formatDate(checkout.dueDate)}
                      </div>
                      {checkout.status === 'approved' && (
                        <div className={`text-xs ${
                          new Date(checkout.dueDate) < new Date() 
                            ? 'text-red-600' 
                            : 'text-gray-500'
                        }`}>
                          {formatDaysUntil(checkout.dueDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {checkout.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Available Equipment Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Available Equipment</h2>
        
        {equipmentLoading ? (
          <LoadingSpinner text="Loading equipment..." />
        ) : equipmentError ? (
          <ErrorMessage message={equipmentError} onRetry={refetchEquipment} />
        ) : availableEquipment.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No equipment currently available</p>
            <p className="text-sm text-gray-400">Check back later or contact lab staff</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableEquipment.map((item) => (
              <EquipmentCard
                key={item._id}
                equipment={item}
                onRequestCheckout={handleRequestCheckout}
              />
            ))}
          </div>
        )}
      </div>

      {/* All Equipment Summary */}
      {equipment.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {availableEquipment.length}
            </div>
            <div className="text-sm text-gray-600">Available Now</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {equipment.filter(e => e.status === 'checked_out').length}
            </div>
            <div className="text-sm text-gray-600">Checked Out</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {equipment.filter(e => e.status === 'maintenance').length}
            </div>
            <div className="text-sm text-gray-600">In Maintenance</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {equipment.length}
            </div>
            <div className="text-sm text-gray-600">Total Equipment</div>
          </div>
        </div>
      )}

      {/* Checkout Request Modal */}
      {showRequestModal && selectedEquipment && (
        <CheckoutRequestModal
          equipment={selectedEquipment}
          onSubmit={handleSubmitRequest}
          onCancel={handleCancelRequest}
        />
      )}
    </section>
  );
}