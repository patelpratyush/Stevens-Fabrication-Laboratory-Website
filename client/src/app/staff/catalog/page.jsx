'use client';

import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import { useEquipment } from '@/hooks/useEquipment';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { formatCurrency } from '@/utils/formatters';

export default function CatalogManagementPage() {
  const { services, loading: servicesLoading, error: servicesError, refetch: refetchServices, createService, updateService } = useServices();
  const { equipment, loading: equipmentLoading, error: equipmentError, refetch: refetchEquipment } = useEquipment();

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    category: '',
    type: 'material',
    description: '',
    priceType: 'per_unit',
    basePrice: 0,
    pricePerUnit: 0,
    unitLabel: '',
  });

  // Separate services and materials
  const servicesList = services.filter(s => s.type === 'service');
  const materialsList = services.filter(s => s.type === 'material');

  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({
        name: service.name,
        category: service.category,
        type: service.type,
        description: service.description || '',
        priceType: service.priceType,
        basePrice: service.basePrice || 0,
        pricePerUnit: service.pricePerUnit || 0,
        unitLabel: service.unitLabel,
      });
    } else {
      setEditingService(null);
      setServiceFormData({
        name: '',
        category: '',
        type: 'material',
        description: '',
        priceType: 'per_unit',
        basePrice: 0,
        pricePerUnit: 0,
        unitLabel: '',
      });
    }
    setShowServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService(editingService._id, serviceFormData);
      } else {
        await createService(serviceFormData);
      }
      handleCloseServiceModal();
      await refetchServices();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Catalog Management
      </h1>
      <p className="text-gray-700 mb-8">
        Manage services, materials, equipment pricing, and availability. Update
        catalog items and pricing tiers.
      </p>

      {/* Services Section */}
      <div className="mb-8 border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-stevens-maroon">
            Services
          </h2>
          <button
            onClick={() => {
              setServiceFormData({ ...serviceFormData, type: 'service' });
              handleOpenServiceModal();
            }}
            className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-red-800 text-sm"
          >
            + Add Service
          </button>
        </div>

        {servicesLoading ? (
          <LoadingSpinner text="Loading services..." />
        ) : servicesError ? (
          <ErrorMessage message={servicesError} onRetry={refetchServices} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Service Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {servicesList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-sm text-gray-500 text-center">
                      No services available
                    </td>
                  </tr>
                ) : (
                  servicesList.map((service) => (
                    <tr key={service._id}>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          {service.description && (
                            <p className="text-xs text-gray-500">{service.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {service.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {service.priceType === 'fixed' ? (
                          formatCurrency(service.basePrice)
                        ) : (
                          `${formatCurrency(service.pricePerUnit)}/${service.unitLabel}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {service.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleOpenServiceModal(service)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Materials Section */}
      <div className="mb-8 border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-stevens-maroon">
            Materials
          </h2>
          <button
            onClick={() => {
              setServiceFormData({ ...serviceFormData, type: 'material' });
              handleOpenServiceModal();
            }}
            className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-red-800 text-sm"
          >
            + Add Material
          </button>
        </div>

        {servicesLoading ? (
          <LoadingSpinner text="Loading materials..." />
        ) : servicesError ? (
          <ErrorMessage message={servicesError} onRetry={refetchServices} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Material Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Price/Unit
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {materialsList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-sm text-gray-500 text-center">
                      No materials available
                    </td>
                  </tr>
                ) : (
                  materialsList.map((material) => (
                    <tr key={material._id}>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{material.name}</p>
                          {material.description && (
                            <p className="text-xs text-gray-500">{material.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {material.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatCurrency(material.pricePerUnit)}/{material.unitLabel}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {material.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleOpenServiceModal(material)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Equipment Section */}
      <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-stevens-maroon">
            Equipment
          </h2>
          <button className="px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed text-sm" disabled>
            + Add Equipment (Coming Soon)
          </button>
        </div>

        {equipmentLoading ? (
          <LoadingSpinner text="Loading equipment..." />
        ) : equipmentError ? (
          <ErrorMessage message={equipmentError} onRetry={refetchEquipment} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Equipment Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Location
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {equipment.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-sm text-gray-500 text-center">
                      No equipment available
                    </td>
                  </tr>
                ) : (
                  equipment.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          {item.notes && (
                            <p className="text-xs text-gray-500">{item.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.location}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' :
                          item.status === 'checked_out' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-gray-400 cursor-not-allowed">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Service/Material Modal */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4 text-stevens-maroon">
                {editingService ? 'Edit' : 'Add'} {serviceFormData.type === 'service' ? 'Service' : 'Material'}
              </h3>

              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                    placeholder="e.g., 3D Printing, Laser Cutting, Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={serviceFormData.description}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Type *
                  </label>
                  <select
                    value={serviceFormData.priceType}
                    onChange={(e) => setServiceFormData({ ...serviceFormData, priceType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                  >
                    <option value="per_unit">Per Unit</option>
                    <option value="fixed">Fixed Price</option>
                  </select>
                </div>

                {serviceFormData.priceType === 'per_unit' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Per Unit * ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={serviceFormData.pricePerUnit}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, pricePerUnit: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Unit Label * (e.g., gram, inch, piece)
                      </label>
                      <input
                        type="text"
                        required
                        value={serviceFormData.unitLabel}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, unitLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base Price ($) - Optional
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={serviceFormData.basePrice}
                        onChange={(e) => setServiceFormData({ ...serviceFormData, basePrice: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        A flat fee added to all orders (e.g., setup fee)
                      </p>
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fixed Price * ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={serviceFormData.basePrice}
                      onChange={(e) => setServiceFormData({ ...serviceFormData, basePrice: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseServiceModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stevens-maroon text-white rounded-md hover:bg-red-800"
                  >
                    {editingService ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
