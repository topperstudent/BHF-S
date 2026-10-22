import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import {
  storage,
  ADMIN_EMAIL,
  ADMIN_PHONE,
  ADMIN_PHONES,
  type DBUser,
} from './src/server/storage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'bhfs-ultra-secure-jwt-secret-2024';

const app = express();
app.use(express.json());

// Security & CORS Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'SAMEORIGIN');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware to count visitors
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.includes('.')) {
    storage.recordVisitor(req.headers['user-agent']);
  }
  next();
});

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: DBUser;
  isAdmin?: boolean;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ detail: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    const user = storage.findUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({ detail: 'User not found' });
    }
    req.user = user;
    const phoneClean = user.phone.replace(/[^0-9]/g, '');
    req.isAdmin =
      user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      ADMIN_PHONES.some((p) => phoneClean.endsWith(p.replace(/[^0-9]/g, '')));
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired session token' });
  }
};

const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, () => {
    if (!req.isAdmin) {
      return res.status(403).json({ detail: 'Admin privileges required' });
    }
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Support login via Phone Number OR Email
app.post('/api/auth/login', (req, res) => {
  const { identifier, phone, email, password } = req.body;
  const loginTarget = identifier || phone || email;

  if (!loginTarget || !password) {
    return res.status(400).json({ detail: 'Phone number and password are required' });
  }

  const user = storage.findUserByIdentifier(String(loginTarget).trim());

  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ detail: 'Incorrect phone number/email or password' });
  }

  // Update last login
  storage.updateUser(user.uid, {});

  const token = jwt.sign({ sub: user.uid }, JWT_SECRET, { expiresIn: '14d' });

  const phoneClean = user.phone.replace(/[^0-9]/g, '');
  const isAdmin =
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
    ADMIN_PHONES.some((p) => phoneClean.endsWith(p.replace(/[^0-9]/g, '')));

  return res.json({
    access_token: token,
    token_type: 'bearer',
    isAdmin,
    user: {
      uid: user.uid,
      name: user.name,
      phone: user.phone,
      email: user.email,
      address: user.address,
    },
  });
});

// Signup for new customers
app.post('/api/auth/signup', (req, res) => {
  const { phone, password, name = '', address = '', email = '' } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ detail: 'Mobile number and password are required' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    return res.status(400).json({ detail: 'Please provide a valid 10-digit mobile number' });
  }

  // Check if phone or email already registered
  const existing = storage.findUserByIdentifier(phone);
  if (existing) {
    return res.status(400).json({ detail: 'This phone number is already registered. Please sign in.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  const uid = crypto.randomUUID();

  const newUser: DBUser = {
    uid,
    phone: phone.trim(),
    email: email.trim() || `${cleanPhone}@bhfs.customer`,
    passwordHash,
    name: name.trim() || 'Valued Customer',
    address: address.trim(),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  storage.createUser(newUser);

  const token = jwt.sign({ sub: uid }, JWT_SECRET, { expiresIn: '14d' });

  return res.json({
    access_token: token,
    token_type: 'bearer',
    isAdmin: false,
    user: {
      uid: newUser.uid,
      name: newUser.name,
      phone: newUser.phone,
      email: newUser.email,
      address: newUser.address,
    },
  });
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  return res.json({
    uid: user.uid,
    name: user.name,
    phone: user.phone,
    email: user.email,
    address: user.address,
  });
});

app.get('/api/auth/is-admin', authenticateToken, (req: AuthenticatedRequest, res) => {
  return res.json({ isAdmin: Boolean(req.isAdmin) });
});

// ==================== PROFILE ====================
app.put('/api/profile', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { name, phone, address, email } = req.body;
  const updated = storage.updateUser(req.user!.uid, { name, phone, address, email });
  if (!updated) {
    return res.status(404).json({ detail: 'User not found' });
  }
  return res.json({
    uid: updated.uid,
    name: updated.name,
    phone: updated.phone,
    email: updated.email,
    address: updated.address,
  });
});

// ==================== PRODUCTS ====================
app.get('/api/products', (req, res) => {
  const products = storage.getProducts();
  return res.json(products);
});

app.post('/api/products', requireAdmin, (req, res) => {
  const { name, price, description = '', imageUrl = '', category = 'Aata & Flours', unit = '1 unit' } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ detail: 'Product name and price are required' });
  }

  const newProduct = {
    id: crypto.randomUUID(),
    name: name.trim(),
    price: Number(price),
    description: description.trim(),
    imageUrl:
      imageUrl.trim() ||
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    category: category.trim(),
    unit: unit.trim(),
    inStock: true,
    createdAt: new Date().toISOString(),
  };

  storage.createProduct(newProduct);
  return res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, price, description, imageUrl, category, unit, inStock } = req.body;
  const updated = storage.updateProduct(id, {
    ...(name !== undefined && { name: name.trim() }),
    ...(price !== undefined && { price: Number(price) }),
    ...(description !== undefined && { description: description.trim() }),
    ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
    ...(category !== undefined && { category: category.trim() }),
    ...(unit !== undefined && { unit: unit.trim() }),
    ...(inStock !== undefined && { inStock: Boolean(inStock) }),
  });

  if (!updated) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  return res.json(updated);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const success = storage.deleteProduct(id);
  if (!success) {
    return res.status(404).json({ detail: 'Product not found' });
  }
  return res.json({ message: 'Product deleted successfully' });
});

// ==================== ORDERS ====================
app.get('/api/orders', authenticateToken, (req: AuthenticatedRequest, res) => {
  if (req.isAdmin) {
    const orders = storage.getOrders();
    return res.json(orders);
  }
  const orders = storage.getOrders(req.user!.uid);
  return res.json(orders);
});

app.post('/api/orders', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { name, phone, address, items, totalPrice } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ detail: 'Order must contain items' });
  }

  const newOrder = {
    id: crypto.randomUUID(),
    userId: req.user!.uid,
    name: name || req.user!.name,
    phone: phone || req.user!.phone,
    address: address || req.user!.address,
    items,
    totalPrice: Number(totalPrice),
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: 'Today within 2-4 hours',
    currentLocation: 'Order Confirmed - Lonikand Packing Facility',
    trackingNotes: 'Farm dispatch initiated. We will call you before delivery.',
  };

  storage.createOrder(newOrder);
  return res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = storage.updateOrderStatus(id, status);
  if (!updated) {
    return res.status(404).json({ detail: 'Order not found' });
  }
  return res.json({ message: 'Order status updated successfully', order: updated });
});

app.put('/api/orders/:id/tracking', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { estimatedDeliveryTime, currentLocation, trackingNotes } = req.body;
  const updated = storage.updateOrderTracking(id, {
    estimatedDeliveryTime,
    currentLocation,
    trackingNotes,
  });
  if (!updated) {
    return res.status(404).json({ detail: 'Order not found' });
  }
  return res.json({ message: 'Order tracking updated successfully', order: updated });
});

app.delete('/api/orders/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const success = storage.deleteOrder(id);
  if (!success) {
    return res.status(404).json({ detail: 'Order not found' });
  }
  return res.json({ message: 'Order deleted successfully' });
});

// ==================== ADMIN: USERS, STATS & DATABASE ====================
app.get('/api/admin/users', requireAdmin, (req, res) => {
  const users = storage.getAllUsersWithStats();
  return res.json(users);
});

app.get('/api/admin/visitors', requireAdmin, (req, res) => {
  const stats = storage.getVisitorStats();
  return res.json(stats);
});

app.get('/api/admin/database-info', requireAdmin, (req, res) => {
  const info = storage.getDatabaseInfo();
  return res.json(info);
});

app.get('/api/admin/export', requireAdmin, (req, res) => {
  const backup = storage.exportData();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=bhfs_backup_${Date.now()}.json`);
  return res.json(backup);
});

app.post('/api/track/visit', (req, res) => {
  storage.recordVisitor(req.headers['user-agent']);
  return res.json({ ok: true });
});

// ==================== HEALTH ====================
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', app: 'BHFS - Big Heart Farmers', version: '2.1.0' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// ==================== SERVER / VITE INTEGRATION ====================
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 BHFS - Big Heart Farmers Server running on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

export { app };
export default app;

