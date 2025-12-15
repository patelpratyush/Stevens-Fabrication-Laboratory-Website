'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export function StaffOnly({ children }) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!userProfile || userProfile.role !== 'staff')) {
      router.push('/dashboard');
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Checking permissions..." />;
  }

  if (!userProfile || userProfile.role !== 'staff') {
    return null; // Will redirect
  }

  return <>{children}</>;
}

export function StudentOnly({ children }) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userProfile?.role === 'staff') {
      router.push('/staff/dashboard');
    }
  }, [userProfile, loading, router]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading..." />;
  }

  return <>{children}</>;
}

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading..." />;
  }

  if (!user) {
    return null; // Will redirect
  }

  return <>{children}</>;
}