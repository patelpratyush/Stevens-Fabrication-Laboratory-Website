import { useState, useEffect } from 'react';
import { equipmentAPI } from '@/lib/api';

export function useEquipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchEquipment() {
    try {
      setLoading(true);
      setError(null);
      const data = await equipmentAPI.getAll();
      setEquipment(data.equipment || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching equipment:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createEquipment(equipmentData) {
    try {
      const data = await equipmentAPI.create(equipmentData);
      await fetchEquipment(); // Refresh list
      return data.equipment;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateEquipment(id, updates) {
    try {
      const data = await equipmentAPI.update(id, updates);
      await fetchEquipment(); // Refresh list
      return data.equipment;
    } catch (err) {
      throw new Error(err.message);
    }
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