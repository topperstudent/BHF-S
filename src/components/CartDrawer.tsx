import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Truck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    totalPrice,
    totalItems,
    formatWhatsAppOrderMessage,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    if (!user) {
      navigate('/auth?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  const freeDeliveryThreshold = 499;
  const progressPercent = Math.min(100, Math.round((totalPrice / freeDeliveryThreshold) * 100));
  const diffToFree = Math.max(0, freeDeliveryThreshold - totalPrice);

  const handleWhatsAppOrder = () => {
    const message = formatWhatsAppOrderMessage({
      name: user?.name,
      phone: user?.phone,
      address: user?.address,
    });
    // Contact number: 918888092855
    const url = `https://wa.me/918888092855?text=${message}`;
    window.location.href = url;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            data-testid="cart-overlay"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#FAF6F0] z-50 shadow-2xl flex flex-col border-l border-stone-200"
            data-testid="cart-drawer"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#1F7A4C]" />
                <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
                  Your Basket ({totalItems})
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"
                data-testid="close-cart-button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Delivery Bar */}
            <div className="px-5 py-3 bg-[#F0F7F2] border-b border-[#1F7A4C]/15">
              <div className="flex items-center justify-between text-xs font-semibold text-[#1F7A4C] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" />
                  {diffToFree === 0 ? (
                    <span className="font-bold text-[#1F7A4C]">🎉 Free Delivery unlocked!</span>
                  ) : (
                    <span>Add ₹{diffToFree.toFixed(0)} more for Free Delivery!</span>
                  )}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#1F7A4C] to-[#2D5016] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12" data-testid="empty-cart">
                  <div className="h-20 w-20 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-stone-400" />
                  </div>
                  <p className="text-lg font-bold text-stone-800" style={{ fontFamily: 'Playfair Display' }}>
                    Your basket is empty
                  </p>
                  <p className="text-xs text-stone-500 max-w-xs mt-1">
                    Discover our stone-ground Sharbati Gehu Aata, cold-pressed oils, and farm dals.
                  </p>
                  <Button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                    className="mt-6 bg-[#1F7A4C] hover:bg-[#175C39] text-white rounded-full text-xs font-bold px-6 py-2.5"
                  >
                    Browse Fresh Products
                  </Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-white rounded-2xl border border-stone-200 shadow-sm"
                    data-testid={`cart-item-${item.id}`}
                  >
                    <img
                      src={item.imageUrl || '/logo.png'}
                      alt={item.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-stone-100 bg-stone-50 shrink-0"
                    />
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <h3 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs font-black text-[#1F7A4C] mt-0.5">
                          ₹{item.price}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded transition-colors text-stone-600"
                            data-testid={`decrease-${item.id}`}
                            title="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span
                            className="w-6 text-center text-xs font-bold text-stone-800"
                            data-testid={`quantity-${item.id}`}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded transition-colors text-stone-600"
                            data-testid={`increase-${item.id}`}
                            title="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] font-semibold text-red-500 hover:text-red-700 transition-colors"
                          data-testid={`remove-${item.id}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-stone-200 space-y-3">
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-stone-900">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-bold text-[#1F7A4C]">
                      {totalPrice >= freeDeliveryThreshold ? 'FREE' : '₹40.00'}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Grand Total:</span>
                    <span className="text-xl font-black text-[#1F7A4C]" data-testid="cart-total">
                      ₹{(totalPrice + (totalPrice >= freeDeliveryThreshold ? 0 : 40)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl py-3 text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-98"
                    data-testid="checkout-button"
                  >
                    <span>{user ? 'Proceed to Checkout' : 'Sign In & Checkout'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={handleWhatsAppOrder}
                    variant="outline"
                    className="w-full border-[#25D366] text-[#128C7E] hover:bg-[#25D366]/10 rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>Order Directly via WhatsApp</span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
