const API_URL = '/api';

const api = {
  getToken() {
    return localStorage.getItem('nostraToken');
  },

  setToken(token) {
    localStorage.setItem('nostraToken', token);
  },

  removeToken() {
    localStorage.removeItem('nostraToken');
  },

  getUser() {
    const user = localStorage.getItem('nostraUser');
    return user ? JSON.parse(user) : null;
  },

  setUser(user) {
    localStorage.setItem('nostraUser', JSON.stringify(user));
  },

  removeUser() {
    localStorage.removeItem('nostraUser');
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  auth: {
    register(name, email, password) {
      return api.request('/auth/register', {
        method: 'POST',
        body: { name, email, password },
      });
    },

    login(email, password) {
      return api.request('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
    },

    getProfile() {
      return api.request('/auth/profile');
    },

    updateProfile(data) {
      return api.request('/auth/profile', {
        method: 'PUT',
        body: data,
      });
    },

    updatePassword(currentPassword, newPassword) {
      return api.request('/auth/password', {
        method: 'PUT',
        body: { currentPassword, newPassword },
      });
    },
  },

  products: {
    getAll(params = {}) {
      const queryString = new URLSearchParams(params).toString();
      return api.request(`/products?${queryString}`);
    },

    getById(id) {
      return api.request(`/products/${id}`);
    },

    getCategories() {
      return api.request('/products/categories');
    },

    getNewArrivals() {
      return api.request('/products?newArrivals=true&limit=4');
    },

    getMostWanted() {
      return api.request('/products?mostWanted=true&limit=4');
    },
  },

  cart: {
    get() {
      return api.request('/cart');
    },

    add(productId, quantity = 1, size = null, color = null) {
      return api.request('/cart/add', {
        method: 'POST',
        body: { productId, quantity, size, color },
      });
    },

    update(productId, quantity, size = null, color = null) {
      return api.request(`/cart/${productId}`, {
        method: 'PUT',
        body: { quantity, size, color },
      });
    },

    remove(productId, size = null, color = null) {
      const params = new URLSearchParams();
      if (size) params.append('size', size);
      if (color) params.append('color', color);
      return api.request(`/cart/${productId}?${params}`, { method: 'DELETE' });
    },

    clear() {
      return api.request('/cart', { method: 'DELETE' });
    },
  },

  orders: {
    create(shippingAddress, paymentMethod = 'card') {
      return api.request('/orders', {
        method: 'POST',
        body: { shippingAddress, paymentMethod },
      });
    },

    getMyOrders() {
      return api.request('/orders/my-orders');
    },

    getById(id) {
      return api.request(`/orders/${id}`);
    },
  },

  wishlist: {
    get() {
      return api.request('/wishlist');
    },

    add(productId) {
      return api.request('/wishlist/add', {
        method: 'POST',
        body: { productId },
      });
    },

    remove(productId) {
      return api.request(`/wishlist/${productId}`, { method: 'DELETE' });
    },
  },

  contact: {
    submit(data) {
      return api.request('/contact', {
        method: 'POST',
        body: data,
      });
    },
  },

  newsletter: {
    subscribe(email) {
      return api.request('/newsletter/subscribe', {
        method: 'POST',
        body: { email },
      });
    },
  },

  admin: {
    getStats() {
      return api.request('/admin/stats');
    },

    getUsers() {
      return api.request('/admin/users');
    },

    updateUserRole(userId, role) {
      return api.request(`/admin/users/${userId}`, {
        method: 'PUT',
        body: { role },
      });
    },

    getAllOrders() {
      return api.request('/orders');
    },

    updateOrderStatus(orderId, status) {
      return api.request(`/orders/${orderId}/status`, {
        method: 'PUT',
        body: { status },
      });
    },

    getContacts() {
      return api.request('/contact');
    },

    updateContactStatus(contactId, status) {
      return api.request(`/contact/${contactId}`, {
        method: 'PUT',
        body: { status },
      });
    },

    createProduct(data) {
      return api.request('/products', {
        method: 'POST',
        body: data,
      });
    },

    updateProduct(productId, data) {
      return api.request(`/products/${productId}`, {
        method: 'PUT',
        body: data,
      });
    },

    deleteProduct(productId) {
      return api.request(`/products/${productId}`, {
        method: 'DELETE',
      });
    },

    getReviews() {
      return api.request('/admin/reviews');
    },

    deleteReview(reviewId) {
      return api.request(`/admin/reviews/${reviewId}`, {
        method: 'DELETE',
      });
    },
  },
};

export default api;
