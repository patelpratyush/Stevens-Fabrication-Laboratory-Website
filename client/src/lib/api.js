import { auth } from './firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Make authenticated API calls
 * @param {string} endpoint - API endpoint (e.g., '/api/services')
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiCall(endpoint, options = {}) {
  try {
    const user = auth.currentUser;
    
    // DEBUG: Log auth state
    console.log('🔍 API Call Debug:', {
      endpoint,
      hasUser: !!user,
      userEmail: user?.email,
      uid: user?.uid
    });
    
    // Get fresh token
    const token = user ? await user.getIdToken() : null;
    
    console.log('🔑 Token:', token ? 'Token exists' : 'NO TOKEN');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    return response;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

/**
 * GET request helper
 */
export async function get(endpoint) {
  const response = await apiCall(endpoint, { method: 'GET' });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

/**
 * POST request helper
 */
export async function post(endpoint, data) {
  const response = await apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

/**
 * PATCH request helper
 */
export async function patch(endpoint, data) {
  const response = await apiCall(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

/**
 * DELETE request helper
 */
export async function del(endpoint) {
  const response = await apiCall(endpoint, { method: 'DELETE' });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

// Specific API calls for common operations

// Services
export const servicesAPI = {
  getAll: () => get('/api/services'),
  create: (data) => post('/api/services', data),
  update: (id, data) => patch(`/api/services/${id}`, data),
  delete: (id) => del(`/api/services/${id}`),
};

// Equipment
export const equipmentAPI = {
  getAll: () => get('/api/equipment'),
  create: (data) => post('/api/equipment', data),
  update: (id, data) => patch(`/api/equipment/${id}`, data),
};

// Orders
export const ordersAPI = {
  getAll: () => get('/api/orders'),
  getMy: () => get('/api/orders'),
  create: (data) => post('/api/orders', data),
  update: (id, data) => patch(`/api/orders/${id}`, data),
};

// Checkouts
export const checkoutsAPI = {
  getAll: (status) => get(`/api/checkouts${status ? `?status=${status}` : ''}`),
  getMy: () => get('/api/checkouts/me'),
  request: (data) => post('/api/checkouts/request', data),
  approve: (id) => post(`/api/checkouts/${id}/approve`, {}),
  deny: (id, reason) => post(`/api/checkouts/${id}/deny`, { reason }),
  return: (id) => post(`/api/checkouts/${id}/return`, {}),
  update: (id, data) => patch(`/api/checkouts/${id}`, data),
};