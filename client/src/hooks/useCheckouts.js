'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function useCheckouts(status) {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  async function fetchCheckouts() {
    try {
      setLoading(true);
      const token = await getIdToken();
      const url = status
        ? `${API_URL}/api/checkouts?status=${status}`
        : `${API_URL}/api/checkouts`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch checkouts');
      }

      const data = await response.json();
      setCheckouts(data.checkouts || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCheckouts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCheckouts();
  }, [status]);

  return { checkouts, loading, error, refetch: fetchCheckouts };
}

export function useMyCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getIdToken } = useAuth();

  async function fetchMyCheckouts() {
    try {
      setLoading(true);
      const token = await getIdToken();
      const response = await fetch(`${API_URL}/api/checkouts/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch your checkouts');
      }

      const data = await response.json();
      setCheckouts(data.checkouts || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCheckouts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyCheckouts();
  }, []);

  return { checkouts, loading, error, refetch: fetchMyCheckouts };
}
