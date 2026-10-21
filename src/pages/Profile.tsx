import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Mail, ShieldCheck, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || '',
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await profileAPI.update(formData);
      await refreshUser();
      toast.success('Delivery details updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-12 px-4" data-testid="profile-page">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="mb-6">
          <h1
            className="text-3xl font-black text-stone-900 tracking-tight"
            style={{ fontFamily: 'Playfair Display' }}
          >
            My Account & Delivery Address
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Keep your delivery location updated for faster doorstep deliveries
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          {/* User info banner */}
          <div className="flex items-center gap-4 p-4 bg-[#FAF6F0] rounded-2xl border border-stone-200">
            <div className="h-14 w-14 rounded-full bg-[#1F7A4C] text-white flex items-center justify-center text-xl font-bold">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="font-bold text-base text-stone-900">{user?.name}</div>
              <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3" />
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="prof-name" className="text-xs">Full Name</Label>
              <div className="relative mt-1">
                <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  id="prof-name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-9 text-xs h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="prof-phone" className="text-xs">Primary Phone (for delivery)</Label>
              <div className="relative mt-1">
                <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  id="prof-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-9 text-xs h-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="prof-addr" className="text-xs">Default Doorstep Delivery Address</Label>
              <div className="relative mt-1">
                <MapPin className="h-4 w-4 absolute left-3 top-3 text-stone-400" />
                <Textarea
                  id="prof-addr"
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-9 text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl text-xs py-2.5 px-6 shadow-sm"
              >
                {loading ? 'Saving Changes...' : 'Save Delivery Address'}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
