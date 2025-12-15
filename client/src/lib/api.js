const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Checkout API helpers
export const checkoutsAPI = {
  // Request checkout
  async request(data) {
    const token = localStorage.getItem('firebaseToken'); // You'll need to store this
    const response = await fetch(`${API_URL}/api/checkouts/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to request checkout');
    }

    return response.json();
  },

  // Get my checkouts
  async getMy() {
    const token = localStorage.getItem('firebaseToken');
    const response = await fetch(`${API_URL}/api/checkouts/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch checkouts');
    }

    return response.json();
  },
};

// Orders API helpers
export const ordersAPI = {
  // Create order
  async create(orderData) {
    const token = localStorage.getItem('firebaseToken');
    const response = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create order');
    }

    return response.json();
  },

  // Get my orders
  async getMy() {
    const token = localStorage.getItem('firebaseToken');
    const response = await fetch(`${API_URL}/api/orders/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return response.json();
  },
};

// Services API helpers
export const servicesAPI = {
  // Get all services
  async getAll() {
    const response = await fetch(`${API_URL}/api/services`);

    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }

    return response.json();
  },
};

// Equipment API helpers
export const equipmentAPI = {
  // Get all equipment
  async getAll() {
    const response = await fetch(`${API_URL}/api/equipment`);

    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }

    return response.json();
  },
};
