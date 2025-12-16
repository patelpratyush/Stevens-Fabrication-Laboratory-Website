'use client';

import { useState } from 'react';
import { useEquipment } from '@/hooks/useEquipment';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';

export default function GeneralEquipmentPage() {
  const { equipment, loading, error, refetch } = useEquipment();

  // Group equipment by category if you have categories
  const equipmentByStatus = {
    available: equipment.filter(e => e.status === 'available'),
    unavailable: equipment.filter(e => e.status !== 'available'),
  };

  return (
    <section>
      <h1 className="text-4xl font-bold mb-4 text-stevens-maroon">
        Equipment Checkout
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Browse our available equipment for checkout. Login to request equipment.
      </p>

      {/* Login CTA */}
      <div className="bg-stevens-maroon/10 border-2 border-stevens-maroon rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-stevens-maroon mb-2">
          Ready to Checkout Equipment?
        </h2>
        <p className="text-gray-700 mb-4">
          Login to your account to request equipment checkouts and view your checkout history.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-stevens-maroon text-white rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Login to Request Checkout
        </a>
      </div>

      {/* Equipment List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Available Equipment</h2>

        {loading ? (
          <LoadingSpinner text="Loading equipment..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : equipment.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No equipment available at this time</p>
        ) : (
          <div className="space-y-8">
            {/* Available Equipment */}
            {equipmentByStatus.available.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-green-700 mb-4 pb-2 border-b-2 border-green-700">
                  Currently Available
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipmentByStatus.available.map((item) => (
                    <div
                      key={item._id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-500/50 transition"
                    >
                      {/* Equipment Image */}
                      {item.imageUrl ? (
                        <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="mb-3 rounded-lg bg-gray-100 h-40 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                        {item.category && (
                          <span className="inline-block mb-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {item.specifications && (
                        <div className="text-xs text-gray-500 mb-3">
                          <strong>Specs:</strong> {item.specifications}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          ✓ Available
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-xs text-gray-600">
                            Qty: {item.quantity}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unavailable Equipment */}
            {equipmentByStatus.unavailable.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-600 mb-4 pb-2 border-b-2 border-gray-300">
                  Currently Unavailable
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipmentByStatus.unavailable.map((item) => (
                    <div
                      key={item._id}
                      className="border-2 border-gray-200 rounded-lg p-4 opacity-60"
                    >
                      {/* Equipment Image */}
                      {item.imageUrl ? (
                        <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 h-40 flex items-center justify-center">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="max-h-full max-w-full object-contain grayscale"
                          />
                        </div>
                      ) : (
                        <div className="mb-3 rounded-lg bg-gray-100 h-40 flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>
                        {item.category && (
                          <span className="inline-block mb-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {item.category}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="pt-3 border-t">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          item.status === 'maintenance' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : item.status === 'checked_out'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status === 'maintenance' && '⚠ Under Maintenance'}
                          {item.status === 'checked_out' && '🔒 Checked Out'}
                          {item.status === 'retired' && '❌ Retired'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Checkout Policy */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Checkout Policy
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>• Maximum checkout period: 4 days (including weekends)</p>
          <p>• Extensions must be requested in person or via email</p>
          <p>• Late fees: $5 per day per item</p>
          <p>• All items must be returned with all included accessories</p>
          <p>• Equipment cannot be loaned to other individuals</p>
        </div>
        <div className="mt-6">
          <a
            href="mailto:fablab@stevens.edu"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Questions? Email fablab@stevens.edu
          </a>
        </div>
      </div>
    </section>
  );
}