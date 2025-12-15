'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  async function fetchUserProfile(firebaseUser) {
    try {
      const token = await firebaseUser.getIdToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          role: 'student' // Default role
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        // Store role in localStorage for quick access
        if (data.user?.role) {
          localStorage.setItem('userRole', data.user.role);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // Sign up
  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create profile in backend (backend determines role)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: userCredential.user.uid,
        email: email,
        name: name
      })
    });

    return userCredential;
  }

  // Login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout
  function logout() {
    setUserProfile(null);
    localStorage.removeItem('userRole');
    return signOut(auth);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        await fetchUserProfile(firebaseUser);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Get Firebase ID token
  async function getIdToken() {
    if (!user) {
      throw new Error('No user logged in');
    }
    return await user.getIdToken();
  }

  const value = {
    user,
    userProfile,
    role: userProfile?.role,
    loading,
    signup,
    login,
    logout,
    getIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
