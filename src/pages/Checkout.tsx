import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Truck,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  CreditCard,
  Banknote,
} from 'lucide-react';

export const Checkout: React.FC = () => {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart, formatWhatsAppOrderMessage } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'whatsapp'>('cod');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const deliveryFee = totalPrice >= 499 ? 0 : 40;
  const grandTotal = totalPrice + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error('Please fill in your name, delivery phone number, and full address');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        items: cart,
        totalPrice: grandTotal,
      };

      const createdOrder = await ordersAPI.create(orderPayload);
      clearCart();

      if (paymentMethod === 'whatsapp') {
        const msg = formatWhatsAppOrderMessage({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        });
        window.location.href = `https://wa.me/918888092855?text=${msg}`;
      } else {
        toast.success('Order placed successfully!');
        navigate(`/order-success?orderId=${createdOrder.id}`);
      }
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#FAF6F0] flex items-center justify-center px-4" data-testid="empty-checkout">
        <div className="text-center bg-white p-8 sm:p-12 rounded-3xl border border-stone-200 shadow-md max-w-md">
          <ShoppingBag className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Playfair Display' }}>
            Your basket is empty
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Add freshly stone-milled Aata, organic dals, or cold-pressed oils before checkout.
          </p>
          <Button
            onClick={() => navigate('/products')}
            className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-full px-8 py-3 text-xs"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-10 px-4" data-testid="checkout-page">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-8">
          <h1
            className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Confirm Your Doorstep Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            BHFS · Big Heart Farmers Delivery directly to your home
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Delivery form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
              1. Delivery Information
            </h2>

            <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4" data-testid="checkout-form">
              <div>
                <Label htmlFor="checkout-name" className="text-xs">Full Name *</Label>
                <div className="relative mt-1">
                  <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="checkout-name"
                    required
                    placeholder="e.g. Sanjay Dhumal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-9 text-xs h-10"
                    data-testid="checkout-name-input"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="checkout-phone" className="text-xs">
                  Active Phone Number (Delivery agent will call you) *
                </Label>
                <div className="relative mt-1">
                  <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="checkout-phone"
                    type="tel"
                    required
                    placeholder="e.g. 7020835560 or 08975610002"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-9 text-xs h-10"
                    data-testid="checkout-phone-input"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="checkout-address" className="text-xs">
                  Complete Delivery Address (Flat/House, Landmark, Pune) *
                </Label>
                <div className="relative mt-1">
                  <MapPin className="h-4 w-4 absolute left-3 top-3 text-stone-400" />
                  <Textarea
                    id="checkout-address"
                    rows={3}
                    required
                    placeholder="e.g. Lonikand pushp nagery Konark residency, Pune, MH"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-9 text-xs"
                    data-testid="checkout-address-input"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-sm font-bold text-stone-900 mb-3" style={{ fontFamily: 'Playfair Display' }}>
                  2. Select Payment Option
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#1F7A4C] bg-[#F0F7F2]'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <Banknote className="h-5 w-5 text-[#1F7A4C] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Cash / UPI on Delivery</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">Pay via cash or scan QR when your groceries arrive</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp'
                        ? 'border-[#25D366] bg-[#25D366]/10'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5 text-[#25D366] shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Confirm on WhatsApp</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">Direct message to Sanjay for customized delivery times</div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-2xl py-4 text-sm shadow-md transition-transform active:scale-98"
                  data-testid="place-order-button"
                >
                  {loading
                    ? 'Confirming Order...'
                    : paymentMethod === 'whatsapp'
                    ? 'Place Order & Send on WhatsApp'
                    : `Place Order · ₹${grandTotal.toFixed(2)}`}
                </Button>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4" style={{ fontFamily: 'Playfair Display' }}>
                Order Summary ({cart.length} items)
              </h2>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3" data-testid={`checkout-item-${item.id}`}>
                    <img
                      src={item.imageUrl || '/logo.png'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl border border-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-xs text-stone-900 truncate">{item.name}</h3>
                      <p className="text-[11px] text-stone-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xs text-[#1F7A4C]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs mt-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Doorstep Delivery</span>
                  <span className="font-bold text-[#1F7A4C]">
                    {deliveryFee === 0 ? 'FREE (Offer Applied)' : '₹40.00'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-900 text-base font-black pt-3 border-t border-stone-200">
                  <span>Total Payable:</span>
                  <span className="text-2xl text-[#1F7A4C]" data-testid="checkout-total">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantees */}
            <div className="mt-6 pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2 text-[#1F7A4C]">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>100% Genuine stone-ground Chakki Aata guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 shrink-0 text-stone-400" />
                <span>Direct delivery from Lonikand farm warehouse</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
