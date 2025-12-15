'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  async function fetchEquipment() {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/equipment`);

      if (!response.ok) {
        throw new Error('Failed to fetch equipment');
      }

      const data = await response.json();
      setEquipment(data.equipment || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  }

  async function createEquipment(equipmentData) {
    const token = await getIdToken();
    const response = await fetch(`${API_URL}/api/equipment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(equipmentData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to create equipment');
    }

    await fetchEquipment();
    return response.json();
  }

  async function updateEquipment(id, equipmentData) {
    const token = await getIdToken();
    const response = await fetch(`${API_URL}/api/equipment/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(equipmentData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to update equipment');
    }

    await fetchEquipment();
    return response.json();
  }

  useEffect(() => {
    fetchEquipment();
  }, []);

  return {
    equipment,
    loading,
    error,
    refetch: fetchEquipment,
    createEquipment,
    updateEquipment,
  };
}
