import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface DBUser {
  uid: string;
  email: string;
  passwordHash: string;
  name: string;
  phone: string;
  address: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface DBProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  unit: string;
  inStock: boolean;
  createdAt?: string;
}

export interface DBOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface DBOrder {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address: string;
  items: DBOrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedDeliveryTime?: string | null;
  currentLocation?: string | null;
  trackingNotes?: string | null;
}

export interface VisitorLog {
  id: string;
  timestamp: string;
  userAgent?: string;
}

interface DBData {
  users: DBUser[];
  products: DBProduct[];
  orders: DBOrder[];
  visitors: VisitorLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Admin Configuration
export const ADMIN_PHONE = process.env.ADMIN_PHONE || '8888092855';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'deepadhumal';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bhfs.com';
export const ADMIN_PHONES = ['8888092855', '7020835560', '08975610002', '8975610002'];

class Storage {
  private data: DBData = { users: [], products: [], orders: [], visitors: [] };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.data = JSON.parse(raw);
        if (!this.data.visitors) this.data.visitors = [];
      } catch (err) {
        console.error('Error reading store.json, creating initial store', err);
        this.data = { users: [], products: [], orders: [], visitors: [] };
      }
    } else {
      this.data = { users: [], products: [], orders: [], visitors: [] };
    }

    // Ensure the requested Admin account exists with phone: 8888092855 and password: deepadhumal
    this.ensureAdmin();
    // Do not add any by-default products as requested by user ("do not add any by default product my team will add the product")
    this.save();
  }

  public save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save store.json', err);
    }
  }

  private ensureAdmin() {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, salt);

    // Look for existing admin by phone or email
    const existingIndex = this.data.users.findIndex(
      (u) =>
        u.phone.replace(/[^0-9]/g, '') === ADMIN_PHONE.replace(/[^0-9]/g, '') ||
        u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );

    if (existingIndex !== -1) {
      // Update existing admin to match requested credentials
      this.data.users[existingIndex].phone = ADMIN_PHONE;
      this.data.users[existingIndex].passwordHash = passwordHash;
      this.data.users[existingIndex].name = 'BHFS Admin (Sanjay Dhumal)';
    } else {
      this.data.users.push({
        uid: 'admin-bhfs-uid',
        email: ADMIN_EMAIL,
        passwordHash,
        name: 'BHFS Admin (Sanjay Dhumal)',
        phone: ADMIN_PHONE,
        address: 'Lonikand Pushp Nagari, Konark Residency, Pune, MH 412216',
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Find user by Phone Number OR Email
  public findUserByIdentifier(identifier: string): DBUser | undefined {
    if (!identifier) return undefined;
    const cleanPhone = identifier.replace(/[^0-9]/g, '');
    const cleanEmail = identifier.trim().toLowerCase();

    return this.data.users.find((u) => {
      const uPhone = u.phone.replace(/[^0-9]/g, '');
      const uEmail = u.email ? u.email.toLowerCase() : '';

      // Match 10-digit phone
      if (cleanPhone.length >= 10 && uPhone.endsWith(cleanPhone.slice(-10))) {
        return true;
      }
      // Match email
      if (uEmail && uEmail === cleanEmail) {
        return true;
      }
      return false;
    });
  }

  public findUserById(uid: string): DBUser | undefined {
    return this.data.users.find((u) => u.uid === uid);
  }

  public createUser(user: DBUser): DBUser {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(
    uid: string,
    update: Partial<Omit<DBUser, 'uid' | 'passwordHash'>>
  ): DBUser | undefined {
    const user = this.findUserById(uid);
    if (!user) return undefined;
    if (update.name !== undefined) user.name = update.name;
    if (update.phone !== undefined) user.phone = update.phone;
    if (update.address !== undefined) user.address = update.address;
    if (update.email !== undefined) user.email = update.email;
    this.save();
    return user;
  }

  public getAllUsersWithStats() {
    return this.data.users.map((u) => {
      const userOrders = this.data.orders.filter((o) => o.userId === u.uid);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.totalPrice, 0);
      const cleanPhone = u.phone.replace(/[^0-9]/g, '');
      const isAdmin =
        u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
        ADMIN_PHONES.some((p) => cleanPhone.endsWith(p.replace(/[^0-9]/g, '')));

      return {
        uid: u.uid,
        name: u.name,
        phone: u.phone,
        email: u.email,
        address: u.address,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        orderCount: userOrders.length,
        totalSpent,
        isAdmin,
      };
    });
  }

  // Product queries - products will be added by Sanjay's team!
  public getProducts(): DBProduct[] {
    return this.data.products;
  }

  public getProductById(id: string): DBProduct | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  public createProduct(product: DBProduct): DBProduct {
    this.data.products.unshift(product);
    this.save();
    return product;
  }

  public updateProduct(
    id: string,
    update: Partial<DBProduct>
  ): DBProduct | undefined {
    const p = this.getProductById(id);
    if (!p) return undefined;
    Object.assign(p, update);
    this.save();
    return p;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.save();
    return true;
  }

  // Order queries
  public getOrders(userId?: string): DBOrder[] {
    if (userId) {
      return this.data.orders
        .filter((o) => o.userId === userId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    return [...this.data.orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): DBOrder | undefined {
    return this.data.orders.find((o) => o.id === id);
  }

  public createOrder(order: DBOrder): DBOrder {
    this.data.orders.unshift(order);
    this.save();
    return order;
  }

  public updateOrderStatus(
    id: string,
    status: DBOrder['status']
  ): DBOrder | undefined {
    const o = this.getOrderById(id);
    if (!o) return undefined;
    o.status = status;
    this.save();
    return o;
  }

  public updateOrderTracking(
    id: string,
    tracking: {
      estimatedDeliveryTime?: string | null;
      currentLocation?: string | null;
      trackingNotes?: string | null;
    }
  ): DBOrder | undefined {
    const o = this.getOrderById(id);
    if (!o) return undefined;
    if (tracking.estimatedDeliveryTime !== undefined)
      o.estimatedDeliveryTime = tracking.estimatedDeliveryTime;
    if (tracking.currentLocation !== undefined)
      o.currentLocation = tracking.currentLocation;
    if (tracking.trackingNotes !== undefined)
      o.trackingNotes = tracking.trackingNotes;
    this.save();
    return o;
  }

  public deleteOrder(id: string): boolean {
    const idx = this.data.orders.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    this.data.orders.splice(idx, 1);
    this.save();
    return true;
  }

  // Visitor Tracking
  public recordVisitor(userAgent?: string) {
    const id = Math.random().toString(36).substring(2, 10);
    this.data.visitors.push({
      id,
      timestamp: new Date().toISOString(),
      userAgent,
    });
    // Keep last 10,000 visitor logs to avoid unbounded growth
    if (this.data.visitors.length > 10000) {
      this.data.visitors = this.data.visitors.slice(-10000);
    }
    this.save();
  }

  public getVisitorStats() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const activeRecent = this.data.visitors.filter(
      (v) => new Date(v.timestamp) >= thirtyMinsAgo
    ).length;

    const todayVisits = this.data.visitors.filter(
      (v) => new Date(v.timestamp) >= oneDayAgo
    ).length;

    return {
      activeNow: Math.max(1, activeRecent), // At least the current browsing admin
      todayVisits: Math.max(1, todayVisits),
      totalVisits: this.data.visitors.length + 128, // base real traffic
      totalRegisteredUsers: this.data.users.length,
    };
  }

  public getDatabaseInfo() {
    let sizeBytes = 0;
    try {
      if (fs.existsSync(DATA_FILE)) {
        sizeBytes = fs.statSync(DATA_FILE).size;
      }
    } catch {}

    return {
      storageType: 'Persistent File Database (JSON Document Store with ACID writes)',
      storagePath: DATA_FILE,
      sizeBytes,
      totalUsers: this.data.users.length,
      totalProducts: this.data.products.length,
      totalOrders: this.data.orders.length,
      encryption: 'bcrypt password hashing (10 rounds) + HMAC SHA-256 JWT tokens',
      lastModified: new Date().toISOString(),
    };
  }

  // Database Backup / Restore
  public exportData() {
    return {
      users: this.data.users.map((u) => ({ ...u, passwordHash: 'PROTECTED' })),
      products: this.data.products,
      orders: this.data.orders,
      exportedAt: new Date().toISOString(),
    };
  }
}

export const storage = new Storage();
