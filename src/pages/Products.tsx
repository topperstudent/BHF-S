import React, { useState, useEffect } from 'react';
import { productsAPI, type Product } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
} from '../components/ui/dialog';
import {
  Search,
  ShoppingCart,
  Zap,
  Package,
  X,
  Wheat,
  Info,
  CheckCircle2,
  Sparkles,
  Plus,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'All Products',
  'Aata & Flours',
  'Cold-Pressed Oils & Ghee',
  'Dals & Pulses',
  'Rice & Grains',
  'Daily Essentials',
];

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadProducts();
    const query = searchParams.get('q');
    if (query) setSearch(query);
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All Products') {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          (selectedCategory === 'Aata & Flours' &&
            p.name.toLowerCase().includes('aata'))
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, selectedCategory, products]);

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    if (!user) {
      navigate('/auth?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-6 sm:py-12" data-testid="products-page">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F7A4C]/10 text-[#1F7A4C] text-[11px] sm:text-xs font-bold mb-2.5">
            <Wheat className="h-3.5 w-3.5 text-[#1F7A4C]" />
            <span>Farm Direct · Big Heart Farmers</span>
          </div>
          <h1
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Stone-Ground Flours & Pure Harvest
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 px-2">
            Milled slowly to protect taste, natural bran fiber, and pure aroma. Delivered straight to your doorstep.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mt-5 px-1">
            <Search className="h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input
              type="text"
              placeholder="Search Sharbati Aata, Khapli, Oils, Ghee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-9 h-11 bg-white rounded-full shadow-sm border-stone-200 text-xs sm:text-sm focus-visible:ring-[#1F7A4C]"
              data-testid="search-input"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                data-testid="clear-search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Phone friendly horizontal scroll) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-3 gap-1.5 sm:gap-2 no-scrollbar mb-6 px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1F7A4C] text-white shadow-sm'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid or Premium Empty State */}
        {loading ? (
          <div className="text-center py-20" data-testid="loading-spinner">
            <div className="inline-block animate-spin h-10 w-10 border-4 border-[#1F7A4C] border-t-transparent rounded-full" />
            <p className="mt-3 text-xs text-stone-500">Checking farm harvest catalog...</p>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty Catalog - Perfect for when user's staff is ready to add items */
          <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 text-center shadow-sm space-y-4 my-8">
            <div className="h-18 w-18 rounded-full bg-[#1F7A4C]/10 text-[#1F7A4C] flex items-center justify-center mx-auto">
              <Wheat className="h-10 w-10" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
              Fresh Batch Under Preparation!
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              Our staff is preparing the product catalog with fresh stone-ground Chakki Aata, cold-pressed oils, and farm groceries.
            </p>

            {isAdmin ? (
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => navigate('/admin')}
                  className="bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold rounded-xl text-xs py-2.5 px-6 shadow-md"
                >
                  <Plus className="h-4 w-4 mr-1.5" />
                  Add Products via Admin Console
                </Button>
              </div>
            ) : (
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://wa.me/918888092855?text=Namaste%20BHFS%2C%20what%20fresh%20aata%20and%20produce%20is%20available%20today%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs py-2.5 px-5 shadow-sm transition-transform active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  Inquire on WhatsApp (8888092855)
                </a>

                <Link to="/auth">
                  <Button variant="outline" className="rounded-xl text-xs font-semibold border-stone-200">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                    Admin Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {filtered.map((prod, index) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
                data-testid={`product-card-${prod.id}`}
              >
                <div>
                  {/* Image container */}
                  <div
                    className="relative aspect-square overflow-hidden bg-stone-100 cursor-pointer"
                    onClick={() => setDetailProduct(prod)}
                  >
                    <img
                      src={prod.imageUrl || '/logo.png'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-[#2B090F]/90 text-[#F3E5AB] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full border border-[#D4AF37]/40 shadow-sm">
                      {prod.category || 'Farm Fresh'}
                    </div>
                    {prod.unit && (
                      <div className="absolute bottom-2 right-2 bg-white/95 text-stone-800 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-stone-100">
                        {prod.unit}
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-3 sm:p-4">
                    <h3
                      onClick={() => setDetailProduct(prod)}
                      className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-[#1F7A4C] transition-colors cursor-pointer line-clamp-1"
                      style={{ fontFamily: 'Playfair Display' }}
                    >
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed hidden sm:block">
                      {prod.description}
                    </p>

                    <div className="flex items-baseline justify-between mt-2.5 pt-1.5 border-t border-stone-100">
                      <div>
                        <span className="text-base sm:text-lg font-black text-[#1F7A4C]" data-testid={`product-price-${prod.id}`}>
                          ₹{prod.price}
                        </span>
                      </div>
                      <button
                        onClick={() => setDetailProduct(prod)}
                        className="text-[10px] font-semibold text-stone-400 hover:text-[#1F7A4C] flex items-center gap-0.5"
                      >
                        <Info className="h-3 w-3" />
                        <span className="hidden sm:inline">Info</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buttons (Touch Friendly) */}
                <div className="p-3 sm:p-4 pt-0 grid grid-cols-2 gap-1.5 sm:gap-2">
                  <Button
                    onClick={() => addToCart(prod)}
                    variant="outline"
                    size="sm"
                    className="w-full rounded-xl border-[#1F7A4C] text-[#1F7A4C] hover:bg-[#1F7A4C] hover:text-white text-[11px] sm:text-xs font-bold h-8 sm:h-9"
                    data-testid={`add-to-cart-${prod.id}`}
                  >
                    <ShoppingCart className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Add</span>
                  </Button>
                  <Button
                    onClick={() => handleBuyNow(prod)}
                    size="sm"
                    className="w-full bg-[#1F7A4C] hover:bg-[#175C39] text-white rounded-xl text-[11px] sm:text-xs font-bold h-8 sm:h-9 shadow-sm"
                    data-testid={`order-now-${prod.id}`}
                  >
                    <Zap className="h-3 w-3 sm:mr-1 text-[#F3E5AB]" />
                    <span>Buy</span>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Product Details Modal */}
        <Dialog open={Boolean(detailProduct)} onOpenChange={(open) => !open && setDetailProduct(null)}>
          <DialogContent className="max-w-md">
            {detailProduct && (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src={detailProduct.imageUrl || '/logo.png'}
                    alt={detailProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#2B090F]/90 text-[#F3E5AB] text-xs font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/40">
                    {detailProduct.category || 'Farm Fresh'}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
                    {detailProduct.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-2xl font-black text-[#1F7A4C]">
                      ₹{detailProduct.price}
                    </span>
                    {detailProduct.unit && (
                      <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-semibold">
                        {detailProduct.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-stone-200/80 space-y-2 text-xs text-stone-700">
                  <div className="font-bold text-stone-900">About this product:</div>
                  <p className="leading-relaxed">{detailProduct.description}</p>
                  <div className="pt-2 flex items-center gap-2 text-[#1F7A4C] font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Stone-ground · Zero chemicals · 100% farm pure</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    onClick={() => {
                      addToCart(detailProduct);
                      setDetailProduct(null);
                    }}
                    variant="outline"
                    className="rounded-xl border-[#1F7A4C] text-[#1F7A4C] hover:bg-[#1F7A4C] hover:text-white font-bold text-xs py-2.5"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1.5" />
                    Add to Basket
                  </Button>
                  <Button
                    onClick={() => {
                      handleBuyNow(detailProduct);
                      setDetailProduct(null);
                    }}
                    className="rounded-xl bg-[#1F7A4C] hover:bg-[#175C39] text-white font-bold text-xs py-2.5"
                  >
                    Buy Instantly
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
