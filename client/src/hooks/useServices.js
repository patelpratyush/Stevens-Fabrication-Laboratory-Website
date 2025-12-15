'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  async function fetchServices() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/services`);

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data.services || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }

  async function createService(serviceData) {
    const token = await getIdToken();
    const response = await fetch(`${API_URL}/api/services`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create service');
    }

    await fetchServices();
    return response.json();
  }

  async function updateService(id, serviceData) {
    const token = await getIdToken();
    const response = await fetch(`${API_URL}/api/services/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update service');
    }

    await fetchServices();
    return response.json();
  }

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
  };
}
