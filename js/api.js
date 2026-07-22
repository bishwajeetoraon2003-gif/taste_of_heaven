/* ==========================================================================
   TASTE OF HEAVEN - FRONTEND BACKEND API CONNECTOR
   ========================================================================== */

const isLocalEnv = typeof window !== 'undefined' && (
  !window.location.hostname ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.protocol === 'file:'
);

const API_BASE_URL = isLocalEnv
  ? 'http://localhost:5000/api/v1'
  : `${window.location.origin}/api/v1`;

window.TasteAPI = {
  // Check backend health
  async checkHealth() {
    try {
      const healthUrl = isLocalEnv
        ? 'http://localhost:5000/health'
        : `${window.location.origin}/health`;
      const res = await fetch(healthUrl);
      return await res.json();
    } catch (e) {
      console.warn('Backend API offline. Operating in client fallback mode.');
      return null;
    }
  },

  // Fetch Menu from Express/Supabase Backend
  async getMenu(category = 'all', search = '') {
    try {
      let url = `${API_BASE_URL}/menu?category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API Menu response error');
      const data = await res.json();
      return data.data.menuItems;
    } catch (e) {
      console.warn('Using offline static menu fallback.');
      return null;
    }
  },

  // Submit Reservation to Backend API
  async createReservation(reservationData) {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline. Saved locally.');
      return null;
    }
  },

  // Submit Order to Backend API
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline. Processed locally.');
      return null;
    }
  },

  // Submit Contact Inquiry
  async submitContact(contactData) {
    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Admin Login
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  // Get Admin Reservations
  async getAdminReservations(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/reservations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return data.data ? data.data.reservations : null;
    } catch (e) {
      return null;
    }
  },

  // Get Admin Orders
  async getAdminOrders(token) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      return data.data ? data.data.orders : null;
    } catch (e) {
      return null;
    }
  }
};
