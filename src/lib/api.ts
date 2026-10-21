import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bhfs_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  uid: string;
  phone: string;
  name: string;
  email?: string;
  address?: string;
  createdAt?: string;
  lastLoginAt?: string;
  orderCount?: number;
  totalSpent?: number;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: string;
  unit?: string;
  inStock?: boolean;
  createdAt?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime?: string | null;
  currentLocation?: string | null;
  trackingNotes?: string | null;
}

export interface VisitorStats {
  activeNow: number;
  todayVisits: number;
  totalVisits: number;
  totalRegisteredUsers: number;
}

export interface DatabaseInfo {
  storageType: string;
  storagePath: string;
  sizeBytes: number;
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  encryption: string;
  lastModified: string;
}

// Auth API - supports phone number or email login
export const authAPI = {
  signup: async (userData: {
    phone: string;
    password: string;
    name?: string;
    address?: string;
    email?: string;
  }): Promise<{ access_token: string; token_type: string; isAdmin: boolean; user: User }> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  login: async (credentials: {
    identifier?: string;
    phone?: string;
    email?: string;
    password: string;
  }): Promise<{ access_token: string; token_type: string; isAdmin: boolean; user: User }> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  isAdmin: async (): Promise<{ isAdmin: boolean }> => {
    const response = await api.get('/auth/is-admin');
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  update: async (profileData: {
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
  }): Promise<User> => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
  },

  create: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  update: async (
    productId: string,
    productData: Partial<Product>
  ): Promise<Product> => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  delete: async (productId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: {
    name: string;
    phone: string;
    address: string;
    items: OrderItem[];
    totalPrice: number;
  }): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  updateStatus: async (
    orderId: string,
    status: string
  ): Promise<{ message: string }> => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  updateTracking: async (
    orderId: string,
    trackingData: {
      estimatedDeliveryTime?: string;
      currentLocation?: string;
      trackingNotes?: string;
    }
  ): Promise<{ message: string }> => {
    const response = await api.put(`/orders/${orderId}/tracking`, trackingData);
    return response.data;
  },

  delete: async (orderId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  },
};

// Admin Operations API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getVisitorStats: async (): Promise<VisitorStats> => {
    const response = await api.get('/admin/visitors');
    return response.data;
  },

  getDatabaseInfo: async (): Promise<DatabaseInfo> => {
    const response = await api.get('/admin/database-info');
    return response.data;
  },

  getExportUrl: () => '/api/admin/export',
};

export default api;
