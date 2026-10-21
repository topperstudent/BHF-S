import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI, type Order } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Calendar,
  Phone,
  MapPin,
  RefreshCw,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const { addToCart, setIsOpen } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/my-orders');
      return;
    }
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        description: '',
        imageUrl: item.imageUrl || '',
      });
    });
    toast.success('Items added to basket!');
    setIsOpen(true);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 2;
      case 'completed':
        return 3;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 px-4" data-testid="my-orders-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight"
              style={{ fontFamily: 'Playfair Display' }}
            >
              My Farm Orders
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Live status and delivery tracking for your fresh groceries
            </p>
          </div>

          <Button
            onClick={loadOrders}
            variant="outline"
            size="sm"
            className="self-start sm:self-auto rounded-xl text-xs border-stone-200 bg-white hover:bg-stone-50 font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Status
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin h-10 w-10 border-4 border-[#1F7A4C] border-t-transparent rounded-full" />
            <p className="mt-3 text-xs text-stone-500">Checking delivery records...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center shadow-sm">
            <Package className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: 'Playfair Display' }}>
              No orders found yet
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-6 max-w-sm mx-auto">
              You haven't placed an order yet. Treat yourself to our stone-ground Sharbati Aata and farm goods!
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-full text-xs px-6 py-2.5"
            >
              Browse Fresh Products
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.status);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden"
                >
                  {/* Top Bar */}
                  <div className="p-5 sm:p-6 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-stone-400 font-medium">Order ID: </span>
                      <span className="font-mono font-bold text-stone-800">#{order.id.slice(0, 8)}</span>
                      <span className="mx-2 text-stone-300">·</span>
                      <span className="text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-500">Total:</span>
                      <span className="text-base font-black text-[#1F7A4C]">
                        ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 space-y-6">
                    {/* Visual Progress Steps */}
                    <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-stone-200/70">
                      <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                        <span>Live Delivery Timeline</span>
                        <span className="text-[#1F7A4C] font-bold">
                          {order.status === 'completed'
                            ? 'Delivered'
                            : order.status === 'confirmed'
                            ? 'Out for Delivery'
                            : 'Order Confirmed'}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center relative">
                        {[
                          { step: 1, label: 'Order Received', desc: 'At Farmhub' },
                          { step: 2, label: 'Out for Delivery', desc: 'With Courier' },
                          { step: 3, label: 'Delivered', desc: 'Doorstep' },
                        ].map((s) => {
                          const isActive = currentStep >= s.step;
                          const isCurrent = currentStep === s.step;

                          return (
                            <div key={s.step} className="flex flex-col items-center relative z-10">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                                  isActive
                                    ? 'bg-[#1F7A4C] text-white shadow-sm'
                                    : 'bg-stone-200 text-stone-500'
                                } ${isCurrent ? 'ring-4 ring-[#1F7A4C]/20' : ''}`}
                              >
                                {isActive ? <CheckCircle className="h-4 w-4" /> : s.step}
                              </div>
                              <div className="text-xs font-bold text-stone-800 mt-2">
                                {s.label}
                              </div>
                              <div className="text-[10px] text-stone-500 hidden sm:block">
                                {s.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Live Tracking Information Badge */}
                      {(order.estimatedDeliveryTime || order.currentLocation) && (
                        <div className="mt-4 pt-3 border-t border-stone-200/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#1F7A4C]" />
                            <span>
                              <strong>Status:</strong> {order.currentLocation || 'In Transit'}
                            </span>
                          </div>
                          {order.estimatedDeliveryTime && (
                            <div className="font-semibold text-emerald-800">
                              ⏱ ETA: {order.estimatedDeliveryTime}
                            </div>
                          )}
                        </div>
                      )}

                      {order.trackingNotes && (
                        <p className="mt-2 text-[11px] text-stone-500 italic pl-1">
                          Note from driver: "{order.trackingNotes}"
                        </p>
                      )}
                    </div>

                    {/* Items List */}
                    <div>
                      <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Items Purchased ({order.items.length})
                      </div>
                      <div className="divide-y divide-stone-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3 min-w-0">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="h-10 w-10 object-cover rounded-lg border border-stone-100 shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-stone-900 truncate block">
                                  {item.name}
                                </span>
                                <span className="text-[11px] text-stone-500">
                                  ₹{item.price} each
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-stone-600 mr-2">Qty: {item.quantity}</span>
                              <span className="font-black text-[#1F7A4C]">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address & Actions */}
                    <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="text-xs text-stone-600 flex items-start gap-1.5 max-w-md">
                        <MapPin className="h-3.5 w-3.5 text-[#1F7A4C] shrink-0 mt-0.5" />
                        <span>{order.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleReorder(order)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs border-stone-200 hover:bg-stone-50 font-bold"
                        >
                          <ShoppingBag className="h-3.5 w-3.5 mr-1 text-[#1F7A4C]" />
                          Reorder Items
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
