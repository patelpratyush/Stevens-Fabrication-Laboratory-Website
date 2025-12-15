import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchOrders() {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createOrder(orderData) {
    try {
      const data = await ordersAPI.create(orderData);
      await fetchOrders(); // Refresh list
      return data.order;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOrder(id, updates) {
    try {
      const data = await ordersAPI.update(id, updates);
      await fetchOrders(); // Refresh list
      return data.order;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
  };
}