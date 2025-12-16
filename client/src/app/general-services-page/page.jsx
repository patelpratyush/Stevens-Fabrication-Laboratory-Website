'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { formatCurrency } from '@/utils/formatters';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function GeneralServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services WITHOUT authentication (public endpoint)
  async function fetchServices() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_URL}/api/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // NO Authorization header - this is public
      });

      if (!response.ok) {
        throw new Error('Failed to load services');
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {});

  return (
    <section>
      <h1 className="text-4xl font-bold mb-4 text-stevens-maroon">
        Our Services
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        Browse our available fabrication services and materials. Login to place an order.
      </p>

      {/* Login CTA */}
      <div className="bg-stevens-maroon/10 border-2 border-stevens-maroon rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-stevens-maroon mb-2">
          Ready to Order?
        </h2>
        <p className="text-gray-700 mb-4">
          Login to your account to place orders and track your projects.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-3 bg-stevens-maroon text-white rounded-lg font-semibold hover:bg-red-800 transition"
        >
          Login to Order
        </a>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Available Services & Materials</h2>

        {loading ? (
          <LoadingSpinner text="Loading services..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchServices} />
        ) : services.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No services available at this time</p>
        ) : (
          <div className="space-y-8">
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                <h3 className="text-xl font-semibold text-stevens-maroon mb-4 pb-2 border-b-2 border-stevens-maroon">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryServices.map((service) => (
                    <div
                      key={service._id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-stevens-maroon/50 transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{service.name}</h4>
                          <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                            {service.type}
                          </span>
                        </div>
                      </div>

                      {service.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {service.description}
                        </p>
                      )}

                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Price:</span>
                          <div className="text-right">
                            <p className="font-bold text-stevens-maroon text-lg">
                              {service.priceType === 'fixed' 
                                ? formatCurrency(service.basePrice || 0)
                                : formatCurrency(service.pricePerUnit || 0)
                              }
                            </p>
                            {service.priceType !== 'fixed' && (
                              <p className="text-xs text-gray-500">per {service.unitLabel}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          service.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status === 'available' ? '✓ Available' : '⚠ Under Maintenance'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="mt-12 text-center bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          Have Questions?
        </h3>
        <p className="text-gray-600 mb-6">
          Contact our lab staff for more information about services, materials, and pricing.
        </p>
        <a
          href="mailto:fablab@stevens.edu"
          className="inline-block px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          Email fablab@stevens.edu
        </a>
      </div>
    </section>
  );
}