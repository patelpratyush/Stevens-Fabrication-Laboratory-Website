'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      
      // Login with Firebase
      await login(email, password);

      // Give AuthContext time to fetch user profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // After login, redirect to appropriate dashboard
      // The ProtectedRoute will handle the actual role-based redirect
      router.push('/dashboard');
      
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <section className="max-w-md mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-stevens-maroon">
        Stevens Fab Lab Login
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Log in to access your dashboard. Students and staff use the same login.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
            placeholder="you@stevens.edu"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stevens-maroon"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-stevens-maroon px-4 py-2 text-sm font-medium text-white hover:bg-stevens-maroon-dark transition disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-stevens-maroon hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}