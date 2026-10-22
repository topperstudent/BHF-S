import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, ShieldCheck, Menu, X, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onOpenDomainGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenDomainGuide }) => {
  const { user, isAdmin, signOut } = useAuth();
  const { totalItems, setIsOpen } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isStrictAdmin = Boolean(
    isAdmin &&
    user &&
    (user.phone || '').replace(/[^0-9]/g, '').endsWith('8888092855')
  );

  const navItems = [
    { to: '/', label: 'Home', show: true },
    { to: '/products', label: 'All Products', show: true },
    { to: '/my-orders', label: 'My Orders', show: Boolean(user) },
    { to: '/profile', label: 'Profile', show: Boolean(user) },
    { to: '/admin', label: 'Admin Panel', show: isStrictAdmin },
  ];

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-xl bg-[#2B090F]/95 border-b border-[#D4AF37]/30 shadow-md text-[#FAF6F0]"
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" data-testid="logo-link">
            <div className="relative">
              <img
                src="/logo.png"
                alt="BHFS - Big Heart Farmers"
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain rounded-full border border-[#D4AF37]/40 shadow-sm transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#F3E5AB]" style={{ fontFamily: 'Playfair Display' }}>
                  BHFS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded border border-[#D4AF37]/30">
                  Organic
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#FAF6F0]/70 font-medium tracking-wide hidden sm:block">
                Big Heart Farmers · bhfs.in
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map(
              (item) =>
                item.show && (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-xs lg:text-sm font-semibold tracking-wider uppercase text-[#FAF6F0]/90 hover:text-[#D4AF37] transition-colors relative py-1"
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {item.label}
                  </Link>
                )
            )}
            {onOpenDomainGuide && (
              <button
                onClick={onOpenDomainGuide}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#D4AF37] hover:text-[#F3E5AB] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2.5 py-1 rounded-full transition-all hover:bg-[#D4AF37]/25"
                title="Connect bhfs.in custom domain"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>bhfs.in setup</span>
              </button>
            )}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart Trigger */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-full bg-white/10 hover:bg-white/15 text-[#FAF6F0] transition-colors cursor-pointer"
              data-testid="cart-button"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2B090F] text-[11px] rounded-full h-5 w-5 flex items-center justify-center font-black shadow-md animate-bounce"
                  data-testid="cart-count"
                >
                  {totalItems}
                </span>
              )}
            </button>

            {/* Desktop Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#FAF6F0] hover:text-[#D4AF37] hover:bg-white/10 rounded-full text-xs font-semibold flex items-center gap-1.5"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Button>
                </Link>
                {isStrictAdmin && (
                  <Link to="/admin">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#D4AF37]/50 text-[#F3E5AB] hover:bg-[#D4AF37]/20 rounded-full text-xs font-bold"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 mr-1 text-[#D4AF37]" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="icon"
                  className="text-[#FAF6F0]/80 hover:text-red-300 hover:bg-white/10 rounded-full h-8 w-8"
                  data-testid="signout-button"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="hidden md:block" data-testid="signin-link">
                <Button className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#2B090F] hover:brightness-105 font-black rounded-full px-5 py-2 text-xs uppercase tracking-wider shadow-md border border-[#F3E5AB]/40 transition-transform active:scale-95">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#FAF6F0] hover:bg-white/10 transition-colors"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-[#24060C] border-t border-[#D4AF37]/20 px-4 py-4 space-y-2 text-[#FAF6F0]"
          >
            {navItems.map(
              (item) =>
                item.show && (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 hover:text-[#D4AF37] transition-colors"
                  >
                    {item.label}
                  </Link>
                )
            )}
            {onOpenDomainGuide && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDomainGuide();
                }}
                className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#D4AF37] hover:bg-white/10"
              >
                <Globe className="h-4 w-4" />
                How to Connect bhfs.in Domain
              </button>
            )}
            <div className="pt-3 border-t border-[#D4AF37]/20 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-1 text-xs text-[#FAF6F0]/70">
                    Signed in as <span className="font-bold text-[#F3E5AB]">{user.name}</span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-white/10"
                  >
                    <User className="h-4 w-4 text-[#D4AF37]" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 hover:bg-white/10 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#2B090F] font-bold rounded-xl py-2.5">
                    Sign In / Register
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
