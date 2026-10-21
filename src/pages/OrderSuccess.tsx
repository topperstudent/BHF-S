import React, { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Package, Truck, MessageCircle, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1F7A4C', '#D4AF37', '#F3E5AB', '#5C0F1B'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="min-h-[85vh] bg-[#FAF6F0] flex items-center justify-center px-4 py-12" data-testid="order-success-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg bg-white p-8 sm:p-12 rounded-3xl border border-stone-200/90 shadow-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', damping: 12 }}
          className="h-20 w-20 rounded-full bg-emerald-50 text-[#1F7A4C] flex items-center justify-center mx-auto mb-6 border border-emerald-200"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#1F7A4C] bg-[#1F7A4C]/10 px-3 py-1 rounded-full">
          Order Received · Big Heart Farmers
        </span>

        <h1
          className="text-2xl sm:text-3xl font-black text-stone-900 mt-4 mb-3 tracking-tight"
          style={{ fontFamily: 'Playfair Display' }}
        >
          Order Placed Successfully!
        </h1>

        {orderId && (
          <p className="text-xs font-mono font-bold text-stone-400 mb-3">
            Reference ID: #{orderId.slice(0, 8)}
          </p>
        )}

        <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto mb-6 leading-relaxed">
          Thank you for choosing farm-fresh staples! Your Chakki Aata & groceries are being prepared at our Lonikand farm hub.
        </p>

        {/* Status card */}
        <div className="bg-[#FAF6F0] rounded-2xl p-4 text-left border border-stone-200 text-xs space-y-2 mb-8">
          <div className="flex items-center gap-2 text-[#1F7A4C] font-bold">
            <Clock className="h-4 w-4" />
            <span>Estimated Delivery: Today within 2-4 hours</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <Truck className="h-4 w-4 text-stone-400" />
            <span>Payment: Cash / UPI on Delivery</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate('/my-orders')}
            className="flex-1 bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl py-3 text-xs"
          >
            <Package className="h-4 w-4 mr-1.5" />
            Track My Order
          </Button>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1 rounded-xl text-xs font-bold border-stone-200 hover:bg-stone-50"
            data-testid="return-home-button"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Back to Home
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100">
          <a
            href="https://wa.me/917020835560?text=Namaste%20BHFS%2C%20I%20just%20placed%20an%20order%20on%20bhfs.in!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#25D366] font-bold hover:underline"
          >
            <MessageCircle className="h-4 w-4" />
            Need assistance? Message Sanjay on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
};
