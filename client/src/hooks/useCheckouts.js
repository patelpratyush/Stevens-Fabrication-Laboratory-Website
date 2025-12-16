import { useState, useEffect } from 'react';
import { checkoutsAPI } from '@/lib/api';

export function useCheckouts(filterStatus = null) {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchCheckouts() {
    try {
      setLoading(true);
      setError(null);
      const data = await checkoutsAPI.getAll(filterStatus);
      setCheckouts(data.checkouts || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching checkouts:', err);
    } finally {
      setLoading(false);
    }
  }

  async function requestCheckout(checkoutData) {
    try {
      const data = await checkoutsAPI.request(checkoutData);
      await fetchCheckouts();
      return data.checkout;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function approveCheckout(id) {
    try {
      const data = await checkoutsAPI.approve(id);
      await fetchCheckouts();
      return data.checkout;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function denyCheckout(id, reason) {
    try {
      const data = await checkoutsAPI.deny(id, reason);
      await fetchCheckouts();
      return data.checkout;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function returnCheckout(id) {
    try {
      const data = await checkoutsAPI.return(id);
      await fetchCheckouts();
      return data.checkout;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  useEffect(() => {
    fetchCheckouts();
  }, [filterStatus]);

  return {
    checkouts,
    loading,
    error,
    refetch: fetchCheckouts,
    requestCheckout,
    approveCheckout,
    denyCheckout,
    returnCheckout,
  };
}

export function useMyCheckouts() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchMyCheckouts() {
    try {
      setLoading(true);
      setError(null);
      const data = await checkoutsAPI.getMy();
      setCheckouts(data.checkouts || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching my checkouts:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyCheckouts();
  }, []);

  return {
    checkouts,
    loading,
    error,
    refetch: fetchMyCheckouts,
  };
}