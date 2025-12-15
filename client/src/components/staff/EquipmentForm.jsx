'use client';

import { useState, useEffect } from 'react';
import { SERVICE_CATEGORIES, EQUIPMENT_STATUSES } from '@/utils/constants';

export default function EquipmentForm({ equipment, onSubmit, onCancel }) {
  const isEditing = !!equipment;

  const [formData, setFormData] = useState({
    name: '',
    category: '3D Printing',
    location: '',
    status: 'available',
    requiresTraining: false,
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Populate form if editing
  useEffect(() => {
    if (equipment) {
      setFormData({
        name: equipment.name || '',
        category: equipment.category || '3D Printing',
        location: equipment.location || '',
        status: equipment.status || 'available',
        requiresTraining: equipment.requiresTraining || false,
        notes: equipment.notes || '',
      });
    }
  }, [equipment]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Equipment name is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save equipment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-stevens-maroon">
              {isEditing ? 'Edit Equipment' : 'Add New Equipment'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                placeholder="e.g., Prusa i3 MK3S+ 3D Printer"
                required
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                  required
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                  placeholder="e.g., Fab Lab - Station 1"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                required
              >
                <option value="available">Available</option>
                <option value="checked_out">Checked Out</option>
                <option value="maintenance">Maintenance</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            {/* Requires Training */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="requiresTraining"
                checked={formData.requiresTraining}
                onChange={handleChange}
                className="h-4 w-4 text-stevens-maroon focus:ring-stevens-maroon border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Requires training before checkout
              </label>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
                placeholder="Additional information, specifications, or instructions"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-stevens-maroon rounded-md hover:bg-stevens-maroon-dark disabled:opacity-50"
              >
                {loading ? 'Saving...' : isEditing ? 'Update Equipment' : 'Create Equipment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}