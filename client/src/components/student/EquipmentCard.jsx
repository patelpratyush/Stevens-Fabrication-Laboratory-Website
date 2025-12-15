'use client';

import StatusBadge from '@/components/shared/StatusBadge';

export default function EquipmentCard({ equipment, onRequestCheckout }) {
  const isAvailable = equipment.status === 'available';

  function getStatusMessage() {
    switch (equipment.status) {
      case 'available':
        return 'Available for checkout';
      case 'checked_out':
        return 'Currently checked out';
      case 'maintenance':
        return 'Under maintenance';
      case 'retired':
        return 'No longer available';
      default:
        return 'Status unknown';
    }
  }

  return (
    <div className={`border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow ${
      !isAvailable ? 'opacity-60' : ''
    }`}>
      {/* Equipment Name */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {equipment.name}
        </h3>
        <p className="text-sm text-gray-500">{equipment.category}</p>
      </div>

      {/* Status */}
      <div className="mb-3">
        <StatusBadge type="equipment" status={equipment.status} />
        <p className="text-sm text-gray-600 mt-1">{getStatusMessage()}</p>
      </div>

      {/* Location */}
      {equipment.location && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Location:</span> {equipment.location}
          </p>
        </div>
      )}

      {/* Training Required Badge */}
      {equipment.requiresTraining && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
             Training Required
          </span>
        </div>
      )}

      {/* Notes */}
      {equipment.notes && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            {equipment.notes}
          </p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => onRequestCheckout(equipment)}
        disabled={!isAvailable}
        className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          isAvailable
            ? 'bg-stevens-maroon text-white hover:bg-stevens-maroon-dark'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAvailable ? 'Request Checkout' : 'Unavailable'}
      </button>
    </div>
  );
}