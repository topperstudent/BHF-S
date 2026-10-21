import React, { useState, useEffect } from 'react';
import { ordersAPI, type Order } from '../../lib/api';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import {
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Trash2,
  Eye,
  ShoppingBag,
  Send,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState<string | null>(null);

  const [trackingData, setTrackingData] = useState({
    estimatedDeliveryTime: '',
    currentLocation: '',
    trackingNotes: '',
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      await loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setTrackingData({
      estimatedDeliveryTime: order.estimatedDeliveryTime || '',
      currentLocation: order.currentLocation || '',
      trackingNotes: order.trackingNotes || '',
    });
    setDetailOpen(true);
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder) return;
    try {
      await ordersAPI.updateTracking(selectedOrder.id, trackingData);
      toast.success('Live tracking info updated');
      await loadOrders();
      setSelectedOrder((prev) => (prev ? { ...prev, ...trackingData } : null));
    } catch (err) {
      toast.error('Failed to update tracking');
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteOrderId) return;
    try {
      await ordersAPI.delete(deleteOrderId);
      toast.success('Order deleted');
      setDetailOpen(false);
      await loadOrders();
    } catch (err) {
      toast.error('Failed to delete order');
    } finally {
      setDeleteOrderId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <Truck className="h-3 w-3" /> Confirmed / Out
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="h-3 w-3" /> Delivered
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" data-testid="order-management">
      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
            Customer Orders ({orders.length})
          </h2>
          <p className="text-xs text-stone-500">
            Track customer deliveries, update ETA, and coordinate doorstep delivery
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-stone-100 p-1 rounded-xl">
          {['all', 'pending', 'confirmed', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                statusFilter === st
                  ? 'bg-white text-[#1F7A4C] shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {st === 'all' ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1F7A4C] border-t-transparent" />
          <p className="mt-2 text-xs text-stone-500">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
          <ShoppingBag className="h-14 w-14 text-stone-300 mx-auto mb-3" />
          <p className="text-base font-bold text-stone-700">No orders in this status</p>
          <p className="text-xs text-stone-500 mt-1">New customer orders will appear here in real-time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow space-y-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-500">
                      #{order.id.slice(0, 8)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <h3 className="font-bold text-base text-stone-900 mt-1">
                    {order.name}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-[#1F7A4C]">
                    ₹{order.totalPrice.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-[#FAF6F0] rounded-xl p-3 text-xs space-y-1.5 border border-stone-100">
                <div className="flex items-center gap-2 text-stone-700">
                  <Phone className="h-3.5 w-3.5 text-[#1F7A4C] shrink-0" />
                  <a href={`tel:${order.phone}`} className="hover:underline font-semibold">
                    {order.phone}
                  </a>
                  <a
                    href={`https://wa.me/91${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste ${order.name}, this is Sanjay from BHFS. Your order #${order.id.slice(0, 6)} is confirmed!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-[#25D366] font-bold hover:underline"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
                <div className="flex items-start gap-2 text-stone-600">
                  <MapPin className="h-3.5 w-3.5 text-[#1F7A4C] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{order.address}</span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {order.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center text-xs bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800"
                    >
                      <strong className="mr-1">{item.name}</strong> × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Tracking Status Preview */}
              {order.estimatedDeliveryTime && (
                <div className="text-[11px] bg-emerald-50 text-emerald-800 p-2 rounded-lg flex items-center justify-between border border-emerald-100">
                  <span>⏱ ETA: <strong>{order.estimatedDeliveryTime}</strong></span>
                  <span className="truncate max-w-[180px] text-emerald-700">{order.currentLocation}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                <Button
                  onClick={() => openOrderDetail(order)}
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs h-8 border-stone-200 hover:bg-stone-50 font-bold"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Details & Tracking
                </Button>

                {/* Quick Status Changers */}
                {order.status === 'pending' && (
                  <Button
                    onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs h-8 px-3 font-bold"
                  >
                    Confirm & Dispatch
                  </Button>
                )}
                {order.status === 'confirmed' && (
                  <Button
                    onClick={() => handleStatusUpdate(order.id, 'completed')}
                    size="sm"
                    className="bg-[#1F7A4C] hover:bg-[#175C39] text-white rounded-xl text-xs h-8 px-3 font-bold"
                  >
                    Mark Delivered
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Playfair Display' }}>
              Order #{selectedOrder?.id.slice(0, 8)}
            </DialogTitle>
            <DialogDescription>
              {selectedOrder &&
                `Placed on ${new Date(selectedOrder.createdAt).toLocaleString('en-IN')}`}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 text-xs">
              {/* Status Selector */}
              <div>
                <Label className="text-xs font-bold text-stone-700">Update Order Status</Label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {(['pending', 'confirmed', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusUpdate(selectedOrder.id, st)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs capitalize transition-all border ${
                        selectedOrder.status === st
                          ? 'bg-[#1F7A4C] text-white border-[#1F7A4C]'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-stone-50 rounded-xl p-3 space-y-1.5 border border-stone-200">
                <div className="font-bold text-stone-900 text-sm">{selectedOrder.name}</div>
                <div className="text-stone-600">Phone: <strong>{selectedOrder.phone}</strong></div>
                <div className="text-stone-600">Address: <strong>{selectedOrder.address}</strong></div>
              </div>

              {/* Items List */}
              <div className="border border-stone-200 rounded-xl p-3 space-y-2">
                <div className="font-bold text-stone-800 text-xs uppercase tracking-wider">
                  Items in Basket
                </div>
                <div className="divide-y divide-stone-100">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-stone-900">{it.name}</span>
                        <span className="text-stone-500 ml-2">× {it.quantity}</span>
                      </div>
                      <span className="font-bold text-stone-900">
                        ₹{(it.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-[#1F7A4C]">
                  <span>Total Amount</span>
                  <span>₹{selectedOrder.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Live Tracking Fields */}
              <div className="bg-[#F0F7F2] p-3.5 rounded-xl border border-[#1F7A4C]/20 space-y-2.5">
                <div className="font-bold text-[#1F7A4C] text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  Live Delivery & Tracking Settings
                </div>

                <div>
                  <Label htmlFor="eta">Estimated Delivery Time (ETA)</Label>
                  <Input
                    id="eta"
                    placeholder="e.g. 45 minutes, Today by 6 PM"
                    value={trackingData.estimatedDeliveryTime}
                    onChange={(e) =>
                      setTrackingData({ ...trackingData, estimatedDeliveryTime: e.target.value })
                    }
                    className="mt-1 h-8 text-xs bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="loc">Current Status / Location</Label>
                  <Input
                    id="loc"
                    placeholder="e.g. Out for delivery with driver Ramesh"
                    value={trackingData.currentLocation}
                    onChange={(e) =>
                      setTrackingData({ ...trackingData, currentLocation: e.target.value })
                    }
                    className="mt-1 h-8 text-xs bg-white"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Delivery Notes</Label>
                  <Textarea
                    id="notes"
                    rows={2}
                    placeholder="e.g. Driver will call before arriving at the gate"
                    value={trackingData.trackingNotes}
                    onChange={(e) =>
                      setTrackingData({ ...trackingData, trackingNotes: e.target.value })
                    }
                    className="mt-1 text-xs bg-white"
                  />
                </div>

                <Button
                  onClick={handleUpdateTracking}
                  className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl text-xs h-8.5"
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Save Tracking Updates
                </Button>
              </div>

              {/* Delete Button */}
              {selectedOrder.status === 'completed' && (
                <div className="pt-2">
                  <Button
                    onClick={() => setDeleteOrderId(selectedOrder.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full text-xs rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Archive / Delete Delivered Order
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={Boolean(deleteOrderId)} onOpenChange={(open) => !open && setDeleteOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              This order will be permanently deleted from database records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700 text-white">
              Delete Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
