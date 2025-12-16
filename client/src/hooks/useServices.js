import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useServices() {
  const { user, loading: authLoading } = useAuth(); // Get user AND loading state
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to make authenticated API calls
  async function apiCall(endpoint, options = {}) {
    console.log('🔍 useServices apiCall:', { 
      endpoint, 
      hasUser: !!user,
      userEmail: user?.email 
    });
    
    const token = user ? await user.getIdToken() : null;
    
    console.log('🔑 Token status:', token ? 'Token generated' : 'NO TOKEN - user is null');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Authorization header added');
    } else {
      console.log('❌ No authorization header - user is null');
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return response.json();
  }

  async function fetchServices() {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall('/api/services');
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
      const data = await apiCall('/api/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      });
      await fetchServices(); // Refresh list
      return data.service;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateService(id, updates) {
    try {
      const data = await apiCall(`/api/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      await fetchServices(); // Refresh list
      return data.service;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function deleteService(id) {
    try {
      await apiCall(`/api/services/${id}`, {
        method: 'DELETE',
      });
      await fetchServices(); // Refresh list
    } catch (err) {
      throw new Error(err.message);
    }
  }

  useEffect(() => {
    console.log('📊 useServices effect triggered:', { 
      authLoading, 
      hasUser: !!user,
      userEmail: user?.email 
    });
    
    // Wait for auth to finish loading AND ensure user exists
    if (!authLoading && user) {
      console.log('✅ Auth ready, fetching services...');
      fetchServices();
    } else if (!authLoading && !user) {
      console.log('❌ Auth ready but no user - not fetching');
      setLoading(false);
    } else {
      console.log('⏳ Still waiting for auth to load...');
    }
  }, [authLoading, user]);

  return {
    services,
    loading: loading || authLoading, // Show loading while auth OR services are loading
    error,
    refetch: fetchServices,
    createService,
    updateService,
    deleteService,
  };
}