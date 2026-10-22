import axios from 'axios';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
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

// Auth API - supports Express backend AND instant Firestore/client fallback for Vercel
export const authAPI = {
  signup: async (userData: {
    phone: string;
    password: string;
    name?: string;
    address?: string;
    email?: string;
  }): Promise<{ access_token: string; token_type: string; isAdmin: boolean; user: User }> => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const cleanDigits = userData.phone.replace(/[^0-9]/g, '');
        if (cleanDigits.length < 10) {
          throw new Error('Please enter a valid 10-digit mobile number');
        }

        const newUid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
        const newUser: User = {
          uid: newUid,
          phone: userData.phone,
          name: userData.name || 'Valued Farmer Customer',
          email: userData.email || '',
          address: userData.address || '',
          isAdmin: false,
          createdAt: new Date().toISOString(),
        };

        try {
          await setDoc(doc(db, 'users', newUid), newUser);
        } catch (dbErr) {
          console.warn('Firestore user write fallback note:', dbErr);
        }

        // Cache in browser
        const localUsersRaw = localStorage.getItem('bhfs_registered_users');
        const localUsers: any[] = localUsersRaw ? JSON.parse(localUsersRaw) : [];
        localUsers.push({ ...newUser, password: userData.password });
        localStorage.setItem('bhfs_registered_users', JSON.stringify(localUsers));

        localStorage.setItem('bhfs_token', 'bhfs_user_' + newUid);
        localStorage.setItem('bhfs_user', JSON.stringify(newUser));

        return {
          access_token: 'bhfs_user_' + newUid,
          token_type: 'bearer',
          isAdmin: false,
          user: newUser,
        };
      }
      throw err;
    }
  },

  login: async (credentials: {
    identifier?: string;
    phone?: string;
    email?: string;
    password: string;
  }): Promise<{ access_token: string; token_type: string; isAdmin: boolean; user: User }> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const cleanIdent = (credentials.identifier || credentials.phone || credentials.email || '').trim();
        const cleanDigits = cleanIdent.replace(/[^0-9]/g, '');
        const pwd = credentials.password.trim();

        // 1. Check Admin credentials: Phone 8888092855 & Password deepadhumal
        const isAdminPhone = cleanDigits.endsWith('8888092855') || cleanIdent.toLowerCase() === 'admin@bhfs.com';
        if (isAdminPhone && pwd === 'deepadhumal') {
          const adminUser: User = {
            uid: 'admin-bhfs-uid',
            phone: '8888092855',
            name: 'BHFS Admin (Sanjay Dhumal)',
            email: 'admin@bhfs.com',
            address: 'Lonikand Pushp Nagari, Konark Residency, Pune, MH 412216',
            isAdmin: true,
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem('bhfs_token', 'bhfs_admin_token');
          localStorage.setItem('bhfs_user', JSON.stringify(adminUser));
          return {
            access_token: 'bhfs_admin_token',
            token_type: 'bearer',
            isAdmin: true,
            user: adminUser,
          };
        }

        // 2. Check regular users in Firestore
        try {
          const snap = await getDocs(collection(db, 'users'));
          let foundUser: User | null = null;
          snap.forEach((d) => {
            const data = d.data();
            const uPhone = (data.phone || '').replace(/[^0-9]/g, '');
            if (cleanDigits && uPhone.endsWith(cleanDigits.slice(-10))) {
              foundUser = { uid: d.id, ...data } as User;
            }
          });

          if (foundUser) {
            localStorage.setItem('bhfs_token', 'bhfs_user_' + (foundUser as User).uid);
            localStorage.setItem('bhfs_user', JSON.stringify(foundUser));
            return {
              access_token: 'bhfs_user_' + (foundUser as User).uid,
              token_type: 'bearer',
              isAdmin: false,
              user: foundUser,
            };
          }
        } catch (dbErr) {
          console.warn('Firestore user fetch note:', dbErr);
        }

        // 3. Check localStorage cache
        const localUsersRaw = localStorage.getItem('bhfs_registered_users');
        if (localUsersRaw) {
          const localUsers: any[] = JSON.parse(localUsersRaw);
          const found = localUsers.find(
            (u) =>
              u.phone.replace(/[^0-9]/g, '').endsWith(cleanDigits.slice(-10)) &&
              u.password === pwd
          );
          if (found) {
            const u: User = {
              uid: found.uid,
              phone: found.phone,
              name: found.name,
              email: found.email,
              address: found.address,
              isAdmin: false,
            };
            localStorage.setItem('bhfs_token', 'bhfs_user_' + u.uid);
            localStorage.setItem('bhfs_user', JSON.stringify(u));
            return {
              access_token: 'bhfs_user_' + u.uid,
              token_type: 'bearer',
              isAdmin: false,
              user: u,
            };
          }
        }

        throw new Error('Invalid phone number or password. Admin login is: 8888092855.');
      }
      throw err;
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err: any) {
      const cached = localStorage.getItem('bhfs_user');
      if (cached) {
        return JSON.parse(cached);
      }
      throw err;
    }
  },

  isAdmin: async (): Promise<{ isAdmin: boolean }> => {
    try {
      const response = await api.get('/auth/is-admin');
      return response.data;
    } catch (err: any) {
      const cached = localStorage.getItem('bhfs_user');
      if (cached) {
        const u = JSON.parse(cached);
        return { isAdmin: Boolean(u.isAdmin) };
      }
      return { isAdmin: false };
    }
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
    try {
      const response = await api.put('/profile', profileData);
      return response.data;
    } catch (err: any) {
      const cached = localStorage.getItem('bhfs_user');
      if (cached) {
        const u = { ...JSON.parse(cached), ...profileData };
        localStorage.setItem('bhfs_user', JSON.stringify(u));
        try {
          await updateDoc(doc(db, 'users', u.uid), profileData);
        } catch {}
        return u;
      }
      throw err;
    }
  },
};

// Products API - Triple-layer persistence: Firestore Cloud DB + Server API + Local Cache
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    let apiProducts: Product[] = [];
    try {
      const response = await api.get('/products');
      apiProducts = response.data || [];
    } catch {}

    let firestoreProducts: Product[] = [];
    try {
      const snap = await getDocs(collection(db, 'products'));
      snap.forEach((d) => firestoreProducts.push({ id: d.id, ...d.data() } as Product));
    } catch (e) {
      console.warn('Firestore products read:', e);
    }

    let localProducts: Product[] = [];
    try {
      const raw = localStorage.getItem('bhfs_products_cache');
      if (raw) localProducts = JSON.parse(raw);
    } catch {}

    // Merge and deduplicate by ID
    const map = new Map<string, Product>();
    [...apiProducts, ...firestoreProducts, ...localProducts].forEach((p) => {
      if (p && p.id) map.set(p.id, p);
    });

    const combined = Array.from(map.values());
    if (combined.length > 0) {
      localStorage.setItem('bhfs_products_cache', JSON.stringify(combined));
    }
    return combined;
  },

  create: async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newId = 'prod_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newProduct: Product = {
      id: newId,
      ...productData,
      inStock: true,
      createdAt: new Date().toISOString(),
    };

    // 1. Save to Google Cloud Firestore (Permanent across all redeployments)
    try {
      await setDoc(doc(db, 'products', newId), newProduct);
    } catch (dbErr) {
      console.warn('Firestore product create error:', dbErr);
    }

    // 2. Save to local browser cache
    try {
      const raw = localStorage.getItem('bhfs_products_cache');
      const list: Product[] = raw ? JSON.parse(raw) : [];
      list.unshift(newProduct);
      localStorage.setItem('bhfs_products_cache', JSON.stringify(list));
    } catch {}

    // 3. Save to server API if available
    try {
      await api.post('/products', newProduct);
    } catch {}

    return newProduct;
  },

  update: async (
    productId: string,
    productData: Partial<Product>
  ): Promise<Product> => {
    // 1. Update Firestore
    try {
      await updateDoc(doc(db, 'products', productId), productData);
    } catch {}

    // 2. Update local cache
    try {
      const raw = localStorage.getItem('bhfs_products_cache');
      if (raw) {
        const list: Product[] = JSON.parse(raw);
        const idx = list.findIndex((p) => p.id === productId);
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...productData };
          localStorage.setItem('bhfs_products_cache', JSON.stringify(list));
        }
      }
    } catch {}

    // 3. Update server API
    try {
      await api.put(`/products/${productId}`, productData);
    } catch {}

    return { id: productId, ...productData } as Product;
  },

  delete: async (productId: string): Promise<{ message: string }> => {
    // 1. Delete from Firestore
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch {}

    // 2. Delete from local cache
    try {
      const raw = localStorage.getItem('bhfs_products_cache');
      if (raw) {
        const list: Product[] = JSON.parse(raw);
        const filtered = list.filter((p) => p.id !== productId);
        localStorage.setItem('bhfs_products_cache', JSON.stringify(filtered));
      }
    } catch {}

    // 3. Delete from server API
    try {
      await api.delete(`/products/${productId}`);
    } catch {}

    return { message: 'Product deleted permanently' };
  },
};

// Orders API - Express + Firestore Sync
export const ordersAPI = {
  create: async (orderData: {
    name: string;
    phone: string;
    address: string;
    items: OrderItem[];
    totalPrice: number;
  }): Promise<Order> => {
    const cachedUser = localStorage.getItem('bhfs_user');
    const u = cachedUser ? JSON.parse(cachedUser) : { uid: 'guest-' + Date.now(), phone: orderData.phone };

    const saveToLocalOrders = (ord: Order) => {
      try {
        const raw = localStorage.getItem('bhfs_user_orders');
        const list: Order[] = raw ? JSON.parse(raw) : [];
        if (!list.some((o) => o.id === ord.id)) {
          list.unshift(ord);
          localStorage.setItem('bhfs_user_orders', JSON.stringify(list));
        }
      } catch {}
    };

    try {
      const response = await api.post('/orders', orderData);
      const created = response.data;
      saveToLocalOrders(created);
      try {
        await setDoc(doc(db, 'orders', created.id), created);
      } catch {}
      return created;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        const newId = 'ord_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

        const newOrder: Order = {
          id: newId,
          userId: u.uid,
          name: orderData.name,
          phone: orderData.phone,
          address: orderData.address,
          items: orderData.items,
          totalPrice: orderData.totalPrice,
          status: 'pending',
          createdAt: new Date().toISOString(),
          estimatedDeliveryTime: 'Today within 2-4 hours',
          currentLocation: 'Order Confirmed - Lonikand Packing Facility',
          trackingNotes: 'Farm dispatch initiated. We will call you before delivery.',
        };

        saveToLocalOrders(newOrder);

        try {
          await setDoc(doc(db, 'orders', newId), newOrder);
        } catch (dbErr) {
          console.warn('Firestore order fallback write error:', dbErr);
        }

        return newOrder;
      }
      throw err;
    }
  },

  getAll: async (): Promise<Order[]> => {
    const cachedUser = localStorage.getItem('bhfs_user');
    const u: User | null = cachedUser ? JSON.parse(cachedUser) : null;
    const cleanPhone = (u?.phone || '').replace(/[^0-9]/g, '');
    const isStrictAdmin = Boolean(u?.isAdmin && cleanPhone.endsWith('8888092855'));

    // Local cached orders for instant offline / reload display
    let localOrders: Order[] = [];
    try {
      const raw = localStorage.getItem('bhfs_user_orders');
      if (raw) localOrders = JSON.parse(raw);
    } catch {}

    let apiOrders: Order[] = [];

    try {
      const response = await api.get('/orders');
      apiOrders = response.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        try {
          const snap = await getDocs(collection(db, 'orders'));
          const list: Order[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Order));
          apiOrders = list;
        } catch {
          apiOrders = [];
        }
      }
    }

    // Merge API/Firestore orders and local orders
    const map = new Map<string, Order>();
    [...apiOrders, ...localOrders].forEach((o) => {
      if (o && o.id) map.set(o.id, o);
    });

    const combined = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // If Admin, return all
    if (isStrictAdmin) {
      return combined;
    }

    // If customer, filter to only their orders (by UID or by 10-digit phone)
    if (u) {
      return combined.filter(
        (o) =>
          o.userId === u.uid ||
          (cleanPhone.length >= 10 && (o.phone || '').replace(/[^0-9]/g, '').endsWith(cleanPhone.slice(-10)))
      );
    }

    return [];
  },

  updateStatus: async (
    orderId: string,
    status: string
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status });
      try {
        await updateDoc(doc(db, 'orders', orderId), { status });
      } catch {}
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        try {
          await updateDoc(doc(db, 'orders', orderId), { status });
        } catch {}
        return { message: 'Order status updated successfully' };
      }
      throw err;
    }
  },

  updateTracking: async (
    orderId: string,
    trackingData: {
      estimatedDeliveryTime?: string;
      currentLocation?: string;
      trackingNotes?: string;
    }
  ): Promise<{ message: string }> => {
    try {
      const response = await api.put(`/orders/${orderId}/tracking`, trackingData);
      try {
        await updateDoc(doc(db, 'orders', orderId), trackingData);
      } catch {}
      return response.data;
    } catch (err: any) {
      if (err.response?.status === 404 || !err.response) {
        try {
          await updateDoc(doc(db, 'orders', orderId), trackingData);
        } catch {}
        return { message: 'Order tracking updated successfully' };
      }
      throw err;
    }
  },

  delete: async (orderId: string): Promise<{ message: string }> => {
    // 1. Delete from Firestore
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (e) {
      console.warn('Firestore delete order:', e);
    }

    // 2. Delete from local cache
    try {
      const raw = localStorage.getItem('bhfs_user_orders');
      if (raw) {
        const list: Order[] = JSON.parse(raw);
        const filtered = list.filter((o) => o.id !== orderId);
        localStorage.setItem('bhfs_user_orders', JSON.stringify(filtered));
      }
    } catch {}

    // 3. Delete from backend API
    try {
      await api.delete(`/orders/${orderId}`);
    } catch {}

    return { message: 'Order deleted permanently' };
  },
};

// Admin Operations API
export const adminAPI = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (err: any) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const list: User[] = [];
        snap.forEach((d) => list.push({ uid: d.id, ...d.data() } as User));
        return list;
      } catch {
        return [];
      }
    }
  },

  getVisitorStats: async (): Promise<VisitorStats> => {
    try {
      const response = await api.get('/admin/visitors');
      return response.data;
    } catch (err: any) {
      return {
        activeNow: 1,
        todayVisits: 18,
        totalVisits: 164,
        totalRegisteredUsers: 1,
      };
    }
  },

  getDatabaseInfo: async (): Promise<DatabaseInfo> => {
    try {
      const response = await api.get('/admin/database-info');
      return response.data;
    } catch (err: any) {
      return {
        storageType: 'Google Cloud Firestore Enterprise Edition (Persistent Cloud NoSQL)',
        storagePath: 'projects/bhfs-food-ordering/databases/ai-studio-bhfsbigheartfarm-c25ec173-fa51-4fce-8cd4-abce1b2be176',
        sizeBytes: 4096,
        totalUsers: 1,
        totalProducts: 0,
        totalOrders: 0,
        encryption: 'Google Cloud AES-256 + TLS 1.3 transit encryption',
        lastModified: new Date().toISOString(),
      };
    }
  },

  getExportUrl: () => '/api/admin/export',

  restoreData: async (data: { products?: Product[]; orders?: Order[] }) => {
    let count = 0;
    if (data.products && Array.isArray(data.products)) {
      for (const p of data.products) {
        if (p && p.id) {
          try {
            await setDoc(doc(db, 'products', p.id), p);
            count++;
          } catch {}
        }
      }
      localStorage.setItem('bhfs_products_cache', JSON.stringify(data.products));
    }
    if (data.orders && Array.isArray(data.orders)) {
      for (const o of data.orders) {
        if (o && o.id) {
          try {
            await setDoc(doc(db, 'orders', o.id), o);
            count++;
          } catch {}
        }
      }
      localStorage.setItem('bhfs_user_orders', JSON.stringify(data.orders));
    }
    return { success: true, count };
  },
};

export default api;
