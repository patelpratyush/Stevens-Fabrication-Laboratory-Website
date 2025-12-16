import { useState, useEffect } from 'react';
import { ordersAPI } from '@/lib/api';

// Staff hook - gets ALL orders
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
      await fetchOrders();
      return data.order;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function updateOrder(id, updates) {
    try {
      const data = await ordersAPI.update(id, updates);
      await fetchOrders();
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

// Student hook - gets only MY orders
export function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchMyOrders() {
    try {
      setLoading(true);
      setError(null);
      const data = await ordersAPI.getMy();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching my orders:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchMyOrders,
  };
}