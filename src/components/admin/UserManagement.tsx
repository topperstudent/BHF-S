import React, { useState, useEffect } from 'react';
import { adminAPI, type User, type VisitorStats } from '../../lib/api';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  MessageCircle,
  Activity,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
    // Poll visitor stats every 15 seconds for live feel
    const interval = setInterval(loadVisitorStatsOnly, 15000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, v] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getVisitorStats(),
      ]);
      setUsers(u);
      setFilteredUsers(u);
      setVisitorStats(v);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load user and visitor data');
    } finally {
      setLoading(false);
    }
  };

  const loadVisitorStatsOnly = async () => {
    try {
      const v = await adminAPI.getVisitorStats();
      setVisitorStats(v);
    } catch (e) {}
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
    } else {
      const q = search.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.phone.includes(q) ||
            (u.email && u.email.toLowerCase().includes(q)) ||
            (u.address && u.address.toLowerCase().includes(q))
        )
      );
    }
  }, [search, users]);

  return (
    <div className="space-y-6" data-testid="user-management">
      {/* Live Visitor Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Now */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Active Visitors
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE</span>
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600">
            {visitorStats?.activeNow ?? 1}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Users actively browsing site now</p>
        </div>

        {/* Today's Visits */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Today's Visits</span>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-stone-900">
            {visitorStats?.todayVisits ?? 0}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Store visitors in last 24h</p>
        </div>

        {/* Registered Users */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Customer Accounts</span>
            <Users className="h-4 w-4 text-[#1F7A4C]" />
          </div>
          <div className="text-3xl font-black text-[#1F7A4C]">
            {users.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Registered mobile accounts</p>
        </div>

        {/* Total Page Views */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Traffic</span>
            <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div className="text-3xl font-black text-stone-900">
            {visitorStats?.totalVisits ?? 0}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">All-time website impressions</p>
        </div>
      </div>

      {/* User Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
            Registered Users & Customers ({users.length})
          </h2>
          <p className="text-xs text-stone-500">
            View registered phone numbers, doorstep addresses, and order history
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search by phone, name, or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs h-9"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin h-10 w-10 border-4 border-[#1F7A4C] border-t-transparent rounded-full" />
          <p className="mt-2 text-xs text-stone-500">Loading user accounts...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <Users className="h-12 w-12 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">No users found</p>
          <p className="text-xs text-stone-500 mt-1">Customers who register on the site will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((u) => (
            <motion.div
              key={u.uid}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-full flex items-center justify-center font-bold text-base ${
                      u.isAdmin
                        ? 'bg-[#2B090F] text-[#F3E5AB] border border-[#D4AF37]/40'
                        : 'bg-[#1F7A4C]/10 text-[#1F7A4C]'
                    }`}
                  >
                    {u.name ? u.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-stone-900">{u.name}</h3>
                      {u.isAdmin && (
                        <span className="bg-[#2B090F] text-[#F3E5AB] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/40">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-stone-700">{u.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-400">Total Spent</div>
                  <div className="text-base font-black text-[#1F7A4C]">
                    ₹{(u.totalSpent || 0).toFixed(0)}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-[#FAF6F0] p-2.5 rounded-xl border border-stone-100 text-xs text-stone-600 flex items-start gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-[#1F7A4C] shrink-0 mt-0.5" />
                <span className="line-clamp-2">
                  {u.address || 'No address saved yet'}
                </span>
              </div>

              {/* Details & Actions */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                <div className="text-stone-400 text-[11px] flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${u.phone}`}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors"
                    title="Call customer"
                  >
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/91${u.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${u.name}, this is Sanjay from BHFS - Big Heart Farmers!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-[#25D366] text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:brightness-105"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
