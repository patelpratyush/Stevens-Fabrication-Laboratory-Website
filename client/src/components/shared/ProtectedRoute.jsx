'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// Staff-only routes - redirect students to student dashboard
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

// Student-only routes - redirect staff to staff equivalent
export function StudentOnly({ children, staffRedirect = '/staff/dashboard' }) {
  const { userProfile, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If staff, redirect to staff version
      if (userProfile?.role === 'staff') {
        router.push(staffRedirect);
      }
      // If not logged in, redirect to login
      else if (!user) {
        router.push('/login');
      }
    }
  }, [userProfile, loading, user, router, staffRedirect]);

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading..." />;
  }

  // Redirect if staff or not logged in
  if (userProfile?.role === 'staff' || !user) {
    return null;
  }

  return <>{children}</>;
}

// Require authentication (any role)
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

// Public route - accessible to everyone (logged in or not)
export function PublicRoute({ children }) {
  return <>{children}</>;
}