import { useState, useEffect } from 'react';
import { servicesAPI } from '@/lib/api';

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchServices() {
    try {
      setLoading(true);
      setError(null);
      const data = await servicesAPI.getAll();
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createService(serviceData) {
    try {
      const data = await servicesAPI.create(serviceData);
      await fetchServices(); // Refresh list
      return data.service;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateService(id, updates) {
    try {
      const data = await servicesAPI.update(id, updates);
      await fetchServices(); // Refresh list
      return data.service;
    } catch (err) {
      throw new Error(err.message);
    }
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