'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  async function fetchOrders() {
    try {
      setLoading(true);
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrder(orderId, updates) {
    const token = await getIdToken();

    const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Failed to update order');
    }

    const data = await res.json();

    // update local UI immediately
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, ...(data.order ?? updates) } : o
      )
    );

    return data.order;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, loading, error, refetch: fetchOrders, updateOrder };
}

export function useMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  async function fetchMyOrders() {
    try {
      setLoading(true);
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/orders/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch your orders');

      const data = await response.json();
      setOrders(data.orders || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return { orders, loading, error, refetch: fetchMyOrders };
}
