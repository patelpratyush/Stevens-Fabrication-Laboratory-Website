'use client';

import { useState } from 'react';
import { useServices } from '@/hooks/useServices';
import ServiceTable from '@/components/staff/ServiceTable';
import ServiceForm from '@/components/staff/ServiceForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { StaffOnly } from '@/components/shared/ProtectedRoute';

export default function StaffServicesPage() {
  return (
    <StaffOnly>
      <ServicesContent />
    </StaffOnly>
  );
}

function ServicesContent() {
  const { services, loading, error, refetch, createService, updateService, deleteService } = useServices();
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);

  function handleAddService() {
    setEditingService(null);
    setShowServiceForm(true);
  }

  function handleEditService(service) {
    setEditingService(service);
    setShowServiceForm(true);
  }

  async function handleSubmitService(formData) {
    try {
      if (editingService) {
        await updateService(editingService._id, formData);
      } else {
        await createService(formData);
      }
      setShowServiceForm(false);
      setEditingService(null);
    } catch (error) {
      throw error; // Let ServiceForm handle the error display
    }
  }

  async function handleDeleteService(serviceId) {
    try {
      await deleteService(serviceId);
      setShowServiceForm(false);
      setEditingService(null);
    } catch (error) {
      throw error; // Let ServiceForm handle the error display
    }
  }

  function handleCancelForm() {
    setShowServiceForm(false);
    setEditingService(null);
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Services Management
      </h1>
      <p className="text-gray-700 mb-8">
        Manage services, materials, and pricing. Add new offerings or update existing ones. All services (available, under maintenance, or hidden) are shown below.
      </p>

      {/* Services Section */}
      <div className="mb-8 border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-stevens-maroon">Services & Materials</h2>
          <button
            onClick={handleAddService}
            className="px-4 py-2 bg-stevens-maroon text-white rounded hover:bg-stevens-maroon-dark text-sm font-medium"
          >
            + Add Service
          </button>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading services..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          <ServiceTable
            services={services}
            onEdit={handleEditService}
          />
        )}
      </div>

      {/* Service Form Modal */}
      {showServiceForm && (
        <ServiceForm
          service={editingService}
          onSubmit={handleSubmitService}
          onCancel={handleCancelForm}
          onDelete={handleDeleteService}
        />
      )}
    </section>
  );
}