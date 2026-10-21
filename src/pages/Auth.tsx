import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  User,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login form state (Phone or Email + Password)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    phone: '',
    address: '',
    password: '',
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      toast.error('Please enter your mobile number and password');
      return;
    }

    setLoading(true);
    try {
      const res = await signIn(loginIdentifier.trim(), loginPassword);
      if (res.isAdmin) {
        toast.success('Welcome back, Admin! Redirecting to Store Console...');
        navigate('/admin');
      } else {
        toast.success(`Welcome back, ${res.user.name || 'Customer'}!`);
        navigate(redirect);
      }
    } catch (error: any) {
      toast.error(error.message || 'Incorrect mobile number or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = signupData.phone.replace(/[^0-9]/g, '');

    if (!signupData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (signupData.password.length < 4) {
      toast.error('Please choose a password with at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(cleanPhone, signupData.password, {
        name: signupData.name.trim(),
        address: signupData.address.trim(),
      });
      toast.success('Account created successfully! Welcome to BHFS.');
      navigate(redirect);
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setIsLogin(true);
    setLoginIdentifier('8888092855');
    setLoginPassword('deepadhumal');
    toast.info('Filled Admin details: 8888092855 / deepadhumal');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#FAF6F0] px-4 py-8 sm:py-14" data-testid="auth-page">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <img
              src="/logo.png"
              alt="BHFS Logo"
              className="h-12 w-12 object-contain rounded-full border border-[#D4AF37]/50 shadow-sm transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-3xl font-black text-[#2B090F]" style={{ fontFamily: 'Playfair Display' }}>
              BHFS
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
            {isLogin ? 'Sign In with Mobile' : 'Create New Customer Account'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isLogin
              ? 'Enter your mobile number and password to access your basket & orders'
              : 'Sign up for fast doorstep delivery of stone-ground Aata and farm produce'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isLogin
                  ? 'bg-white text-[#1F7A4C] shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-white text-[#1F7A4C] shadow-sm'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* SIGN IN FORM */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <Label htmlFor="login-phone" className="text-xs">
                  Mobile Number or Email
                </Label>
                <div className="relative mt-1">
                  <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="login-phone"
                    required
                    type="text"
                    placeholder="e.g. 8888092855 or user@example.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="pl-9 text-xs h-11"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-pass" className="text-xs">Password</Label>
                <div className="relative mt-1">
                  <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-9 pr-9 text-xs h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl py-3 text-sm mt-2 shadow-md transition-transform active:scale-98"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <Label htmlFor="signup-name" className="text-xs">Full Name *</Label>
                <div className="relative mt-1">
                  <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="signup-name"
                    required
                    placeholder="e.g. Rahul Patil"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className="pl-9 text-xs h-10"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-phone" className="text-xs">
                  Mobile Number (10 Digits) *
                </Label>
                <div className="relative mt-1">
                  <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    className="pl-9 text-xs h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-address" className="text-xs">
                  Delivery Address (Flat / House / Area, Pune)
                </Label>
                <div className="relative mt-1">
                  <MapPin className="h-4 w-4 absolute left-3 top-2.5 text-stone-400" />
                  <Textarea
                    id="signup-address"
                    rows={2}
                    placeholder="Enter your doorstep delivery location"
                    value={signupData.address}
                    onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                    className="pl-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-pass" className="text-xs">Set a Password *</Label>
                <div className="relative mt-1">
                  <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <Input
                    id="signup-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className="pl-9 pr-9 text-xs h-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl py-3 text-sm mt-3 shadow-md transition-transform active:scale-98"
              >
                {loading ? 'Creating Account...' : 'Register & Start Shopping'}
              </Button>
            </form>
          )}

          {/* Quick Admin Demo Fast-Fill */}
          <div className="mt-6 pt-5 border-t border-stone-200">
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-[#D4AF37]/50 bg-[#FDFBF7] text-[#2B090F] hover:bg-[#F3E5AB]/20 text-xs font-bold transition-all hover:scale-101 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4 text-[#B8860B]" />
              <span>Admin Fast-Fill (8888092855 / deepadhumal)</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
