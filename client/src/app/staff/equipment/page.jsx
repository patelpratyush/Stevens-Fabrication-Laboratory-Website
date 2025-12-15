'use client';

import { useState } from 'react';
import { useEquipment } from '@/hooks/useEquipment';
import EquipmentTable from '@/components/staff/EquipmentTable';
import EquipmentForm from '@/components/staff/EquipmentForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { StaffOnly } from '@/components/shared/ProtectedRoute';

function StaffEquipmentPage() {
  return (
    <StaffOnly>
      <EquipmentContent />
    </StaffOnly>
  );
}

export default StaffEquipmentPage;

function EquipmentContent() {
  const { equipment, loading, error, refetch, createEquipment, updateEquipment } = useEquipment();
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);

  function handleAddEquipment() {
    setEditingEquipment(null);
    setShowEquipmentForm(true);
  }

  function handleEditEquipment(equipment) {
    setEditingEquipment(equipment);
    setShowEquipmentForm(true);
  }

  async function handleSubmitEquipment(formData) {
    try {
      if (editingEquipment) {
        await updateEquipment(editingEquipment._id, formData);
      } else {
        await createEquipment(formData);
      }
      setShowEquipmentForm(false);
      setEditingEquipment(null);
    } catch (error) {
      throw error; // Let EquipmentForm handle the error display
    }
  }

  async function handleUpdateStatus(id, updates) {
    await updateEquipment(id, updates);
  }

  function handleCancelForm() {
    setShowEquipmentForm(false);
    setEditingEquipment(null);
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Equipment Management
      </h1>
      <p className="text-gray-700 mb-8">
        Manage equipment inventory, status, and availability. Track checkouts and maintenance.
      </p>

      {/* Equipment Inventory Section */}
      <div className="border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-stevens-maroon">Equipment Inventory</h2>
          <button
            onClick={handleAddEquipment}
            className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-stevens-maroon-dark text-sm font-medium"
          >
            + Add Equipment
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading equipment..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          <EquipmentTable
            equipment={equipment}
            onEdit={handleEditEquipment}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {equipment.filter(e => e.status === 'available').length}
          </div>
          <div className="text-sm text-gray-600">Available</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {equipment.filter(e => e.status === 'checked_out').length}
          </div>
          <div className="text-sm text-gray-600">Checked Out</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {equipment.filter(e => e.status === 'maintenance').length}
          </div>
          <div className="text-sm text-gray-600">In Maintenance</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {equipment.length}
          </div>
          <div className="text-sm text-gray-600">Total Equipment</div>
        </div>
      </div>

      {/* Equipment Form Modal */}
      {showEquipmentForm && (
        <EquipmentForm
          equipment={editingEquipment}
          onSubmit={handleSubmitEquipment}
          onCancel={handleCancelForm}
        />
      )}
    </section>
  );
}