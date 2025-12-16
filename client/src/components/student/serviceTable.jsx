'use client';

import StatusBadge from '@/components/shared/StatusBadge';
import { formatCurrency } from '@/utils/formatters';

export default function StudentServiceTable({ services }) {
  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No services available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pricing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {services.map((service) => (
            <tr key={service._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {service.name}
                </div>
                {service.description && (
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {service.description}
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{service.category}</div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                  {service.type}
                </span>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {service.priceType === 'fixed' ? (
                    <span>{formatCurrency(service.basePrice)}</span>
                  ) : (
                    <span>
                      {formatCurrency(service.pricePerUnit)}/{service.unitLabel}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    service.status === 'available'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {service.status === 'available'
                    ? 'Available'
                    : 'Under Maintenance'}
                </span>

                {/* If you prefer using your shared badge component instead, swap above for:
                    <StatusBadge status={service.status} />
                */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
