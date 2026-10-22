import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProductManagement } from '../components/admin/ProductManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { DatabaseSettings } from '../components/admin/DatabaseSettings';
import { ordersAPI, productsAPI, adminAPI, type Order, type Product, type VisitorStats } from '../lib/api';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  Globe,
  ShieldCheck,
  Users,
  Database,
  Activity,
  Plus,
} from 'lucide-react';
import { Button } from '../components/ui/button';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface AdminProps {
  onOpenDomainGuide?: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onOpenDomainGuide }) => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    if (!authLoading) {
      const isStrictAdmin = Boolean(
        isAdmin &&
        user &&
        (user.phone || '').replace(/[^0-9]/g, '').endsWith('8888092855')
      );
      if (!isStrictAdmin) {
        toast.error('Access Denied: Admin panel is restricted to authorized BHFS administration.');
        navigate('/');
      }
    }
  }, [authLoading, isAdmin, user, navigate]);

  useEffect(() => {
    loadStats();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const [o, p, v] = await Promise.all([
        ordersAPI.getAll(),
        productsAPI.getAll(),
        adminAPI.getVisitorStats(),
      ]);
      setOrders(o);
      setProducts(p);
      setVisitorStats(v);
    } catch (e) {
      // ignore
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-6 sm:py-10 px-3 sm:px-6 lg:px-8" data-testid="admin-page">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/90 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1F7A4C] uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>BHFS Admin Operations</span>
            </div>
            <h1
              className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight"
              style={{ fontFamily: 'Playfair Display' }}
            >
              Store Management Console
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Admin Phone: <strong className="text-stone-800">8888092855</strong> · Domain: <strong className="text-[#1F7A4C]">bhfs.in</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDomainGuide && (
              <button
                onClick={onOpenDomainGuide}
                className="inline-flex items-center gap-2 bg-[#2B090F] hover:bg-[#3d0d16] text-[#F3E5AB] px-3.5 py-2.5 rounded-2xl text-xs font-bold border border-[#D4AF37]/50 shadow transition-all hover:scale-102 cursor-pointer"
              >
                <Globe className="h-4 w-4 text-[#D4AF37]" />
                <span className="hidden sm:inline">Connect bhfs.in Domain</span>
                <span className="sm:hidden">Domain</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Live Visitors</span>
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                ONLINE
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {visitorStats?.activeNow ?? 1}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {visitorStats?.todayVisits ?? 0} visits today
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Orders</span>
              <ShoppingBag className="h-4 w-4 text-[#1F7A4C]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900">
              {orders.length}
            </div>
            <div className="text-[11px] text-amber-600 font-bold mt-1">
              {pendingOrders.length} pending dispatch
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Catalog Items</span>
              <Package className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-stone-900">
              {products.length}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              {products.length === 0 ? 'Empty (Add your items)' : 'Active products'}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-1.5">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider">Total Sales</span>
              <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#1F7A4C]">
              ₹{totalRevenue.toFixed(0)}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">All customer lifetime total</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full mb-6 bg-stone-200/80 p-1 rounded-2xl h-auto gap-1">
            <TabsTrigger
              value="orders"
              className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#1F7A4C] data-[state=active]:shadow-sm cursor-pointer"
              data-testid="orders-tab"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Orders ({orders.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#1F7A4C] data-[state=active]:shadow-sm cursor-pointer"
              data-testid="products-tab"
            >
              <Package className="h-4 w-4" />
              <span>Products ({products.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#1F7A4C] data-[state=active]:shadow-sm cursor-pointer"
              data-testid="users-tab"
            >
              <Users className="h-4 w-4" />
              <span>Users & Traffic</span>
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold py-2.5 data-[state=active]:bg-white data-[state=active]:text-[#1F7A4C] data-[state=active]:shadow-sm cursor-pointer"
              data-testid="database-tab"
            >
              <Database className="h-4 w-4" />
              <span>Storage & Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
