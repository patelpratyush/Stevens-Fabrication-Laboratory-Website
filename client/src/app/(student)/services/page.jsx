'use client';

import { useServices } from '@/hooks/useServices';
import ServiceTable from '@/components/student/serviceTable';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import { StudentOnly } from '@/components/shared/ProtectedRoute';

export default function StudentServicesPage() {
  return (
    <StudentOnly>
      <StudentServicesContent />
    </StudentOnly>
  );
}

function StudentServicesContent() {
  const { services, loading, error, refetch } = useServices();

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4 text-stevens-maroon">
        Services
      </h1>
      <p className="text-gray-700 mb-8">
        View available services, materials, and pricing.
      </p>

      <div className="mb-8 border-2 border-stevens-maroon rounded-lg p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-stevens-maroon">Services & Materials</h2>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading services..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          <ServiceTable
            services={services}
            // no edit handlers for students
          />
        )}
      </div>
    </section>
  );
}
