'use client';

import { useState } from 'react';
import StatusBadge from '@/components/shared/StatusBadge';

export default function EquipmentTable({ equipment, onEdit, onUpdateStatus }) {
  const [processingId, setProcessingId] = useState(null);

  async function handleStatusChange(item, newStatus) {
    try {
      setProcessingId(item._id);
      await onUpdateStatus(item._id, { status: newStatus });
    } catch (error) {
      console.error('Error updating equipment status:', error);
      alert('Failed to update equipment status');
    } finally {
      setProcessingId(null);
    }
  }

  if (equipment.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No equipment available. Click "Add Equipment" to create one.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Equipment Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Training Required
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {equipment.map((item) => (
            <tr key={item._id} className={!item.active ? 'bg-gray-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {item.name}
                </div>
                {item.notes && (
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {item.notes}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.location || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge type="equipment" status={item.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.requiresTraining
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {item.requiresTraining ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-stevens-maroon hover:text-stevens-maroon-dark text-left"
                  >
                    Edit Details
                  </button>
                  
                  {/* Quick Status Change Buttons */}
                  {item.status !== 'available' && (
                    <button
                      onClick={() => handleStatusChange(item, 'available')}
                      disabled={processingId === item._id}
                      className="text-green-600 hover:text-green-900 disabled:opacity-50 text-left"
                    >
                      {processingId === item._id ? 'Updating...' : 'Mark Available'}
                    </button>
                  )}
                  
                  {item.status !== 'maintenance' && (
                    <button
                      onClick={() => handleStatusChange(item, 'maintenance')}
                      disabled={processingId === item._id}
                      className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 text-left"
                    >
                      {processingId === item._id ? 'Updating...' : 'Mark Maintenance'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}