import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Package, ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItems, setIsOpen } = useCart();
  const { user, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 py-1.5 px-3 shadow-lg flex items-center justify-around safe-bottom">
      <Link
        to="/"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          isActive('/') ? 'text-[#1F7A4C] font-bold' : 'text-stone-500'
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-[10px] mt-0.5">Home</span>
      </Link>

      <Link
        to="/products"
        className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
          isActive('/products') ? 'text-[#1F7A4C] font-bold' : 'text-stone-500'
        }`}
      >
        <Package className="h-5 w-5" />
        <span className="text-[10px] mt-0.5">Shop</span>
      </Link>

      <button
        onClick={() => setIsOpen(true)}
        className="flex flex-col items-center py-1 px-2.5 rounded-xl text-stone-500 relative cursor-pointer"
        aria-label="View basket"
      >
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-[#1F7A4C] text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
              {totalItems}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5">Basket</span>
      </button>

      {user ? (
        <Link
          to="/my-orders"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
            isActive('/my-orders') ? 'text-[#1F7A4C] font-bold' : 'text-stone-500'
          }`}
        >
          <div className="relative">
            <span className="block h-2 w-2 rounded-full bg-emerald-500 absolute -top-0.5 -right-0.5" />
            <Package className="h-5 w-5" />
          </div>
          <span className="text-[10px] mt-0.5">Orders</span>
        </Link>
      ) : null}

      {isAdmin ? (
        <Link
          to="/admin"
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
            isActive('/admin') ? 'text-[#1F7A4C] font-bold' : 'text-stone-500'
          }`}
        >
          <ShieldCheck className="h-5 w-5 text-[#B8860B]" />
          <span className="text-[10px] mt-0.5 text-[#B8860B] font-bold">Admin</span>
        </Link>
      ) : (
        <Link
          to={user ? '/profile' : '/auth'}
          className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-colors ${
            isActive('/profile') || isActive('/auth')
              ? 'text-[#1F7A4C] font-bold'
              : 'text-stone-500'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">{user ? 'Profile' : 'Sign In'}</span>
        </Link>
      )}
    </div>
  );
};
