import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  Leaf,
  Heart,
  ArrowRight,
  Gift,
  Truck,
  BadgePercent,
  Wheat,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
  MessageCircle,
} from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FAF6F0]" data-testid="home-page">
      {/* Hero Section */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center px-4 overflow-hidden"
        data-testid="hero-section"
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.08, 1], x: [0, -15, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            backgroundImage: 'url(/diwali-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 50%',
          }}
          data-testid="diwali-hero-background"
        />

        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B090F]/85 via-[#2B090F]/70 to-[#2B090F]/90" />

        {/* Animated Floating Sparkles */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-16 left-8 sm:left-20 opacity-30 text-[#F3E5AB] pointer-events-none"
        >
          <Sparkles className="h-16 w-16" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-24 right-8 sm:right-24 opacity-30 text-[#D4AF37] pointer-events-none"
        >
          <Gift className="h-18 w-18" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-5xl mx-auto py-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <div className="bg-gradient-to-r from-[#D4AF37]/30 via-[#D4AF37]/40 to-[#D4AF37]/30 border border-[#D4AF37]/60 rounded-full px-4 sm:px-6 py-1.5 backdrop-blur-md shadow-lg flex items-center gap-2">
              <Wheat className="h-4 w-4 text-[#F3E5AB]" />
              <span className="text-xs sm:text-sm font-black text-[#F3E5AB] tracking-wide uppercase">
                100% Traditional Stone-Ground Aata & Farm Fresh
              </span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 text-[#FAF6F0]"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Purity You Can Taste,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#F3E5AB]">
              Direct from Our Farm
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-base sm:text-xl text-[#FAF6F0]/85 max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Premium Sharbati Gehu Aata, wholesome multigrain flour, pure Bilona Desi Cow Ghee, and cold-pressed Lakdi Ghani oils delivered fresh to your doorstep in Pune.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate('/products')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#2B090F] font-black rounded-full px-8 sm:px-10 py-6 text-base sm:text-lg shadow-2xl hover:brightness-105 transition-all hover:scale-105 active:scale-95 border border-[#B8860B]"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              <span>Explore Farm Selection</span>
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <a
              href="https://wa.me/918888092855?text=Namaste%20BHFS%2C%20I%20want%20to%20order%20fresh%20aata%20and%20produce!"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-full px-7 py-4 text-base shadow-xl transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-5 w-5" />
              <span>Order on WhatsApp</span>
            </a>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-16 max-w-4xl mx-auto pt-8 border-t border-[#D4AF37]/25 text-left"
          >
            {[
              { label: 'Chakki Fresh', sub: 'Slow stone-ground', icon: Wheat },
              { label: 'Zero Chemicals', sub: '100% natural goodness', icon: Leaf },
              { label: 'Free Delivery', sub: 'On orders above ₹499', icon: Truck },
              { label: 'Farm Authorised', sub: 'Direct from Maharashtra', icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F3E5AB]">
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#F3E5AB]">{stat.label}</div>
                  <div className="text-[11px] text-[#FAF6F0]/65">{stat.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1F7A4C] bg-[#1F7A4C]/10 px-3 py-1 rounded-full">
              Purity Guaranteed
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 mt-3" style={{ fontFamily: 'Playfair Display' }}>
              Handcrafted Farm Essentials
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Every grain is harvested with care and processed traditionally to preserve nutrition and authentic taste.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Aata & Stone-Ground Flours',
                desc: 'MP Sharbati Gehu Aata, ancient Khapli wheat, and multi-grain flour for softest rotis.',
                image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
                badge: 'Best Seller',
              },
              {
                title: 'Wood-Pressed Oils',
                desc: 'Lakdi Ghani cold-pressed mustard, groundnut, and sesame oils under 40°C.',
                image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
                badge: '100% Cold-Pressed',
              },
              {
                title: 'Vedic Bilona Cow Ghee',
                desc: 'Aromatic, golden danedar ghee made from cultured curd of indigenous cows.',
                image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=600&q=80',
                badge: 'Traditional A2',
              },
              {
                title: 'Farm Pulses & Rice',
                desc: 'Unpolished protein-rich Toor and Moong Dal, fragrant Indrayani rice.',
                image: 'https://images.unsplash.com/photo-1585994192701-f1a505c817ea?auto=format&fit=crop&w=600&q=80',
                badge: 'Unpolished',
              },
            ].map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                onClick={() => navigate('/products')}
                className="group cursor-pointer bg-[#FAF6F0] rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1F7A4C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                    {cat.badge}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#1F7A4C] transition-colors" style={{ fontFamily: 'Playfair Display' }}>
                    {cat.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="mt-4 flex items-center text-xs font-bold text-[#1F7A4C]">
                    <span>View items</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Festive Special Section */}
      <section className="py-20 bg-gradient-to-b from-[#2B090F] to-[#3B0C15] text-[#FAF6F0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Special Festive Harvest
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#F3E5AB]" style={{ fontFamily: 'Playfair Display' }}>
              Fresh Festive Deals for Your Family
            </h2>
            <p className="text-sm sm:text-base text-[#FAF6F0]/80 mt-3">
              Celebrate with wholesome, unadulterated ingredients. Perfect for festive sweets, puris, and everyday family nourishment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BadgePercent,
                title: 'Festive Harvest Pricing',
                description: 'Special wholesale farm prices on 10kg Sharbati Aata, Bilona Cow Ghee, and cold-pressed oils.',
              },
              {
                icon: Truck,
                title: 'Free Doorstep Delivery',
                description: 'Enjoy free doorstep delivery on all orders above ₹499 across Pune, Lonikand, and nearby regions.',
              },
              {
                icon: Gift,
                title: 'Shubh Harvest Baskets',
                description: 'Hand-picked organic flour, jaggery, pulses and dry ration packages ideal for home and gifting.',
              },
            ].map((offer, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -6 }}
                className="bg-gradient-to-b from-[#4A0D18] to-[#2B090F] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/30 shadow-[0_10px_30px_rgba(212,175,55,0.1)] hover:border-[#D4AF37] transition-all"
              >
                <div className="inline-block p-3.5 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8860B] mb-5 shadow-lg">
                  <offer.icon className="h-6 w-6 text-[#2B090F]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#F3E5AB] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  {offer.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF6F0]/75 leading-relaxed">
                  {offer.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#2B090F] font-black rounded-full px-10 py-6 text-base shadow-xl hover:brightness-105 transition-transform hover:scale-105 active:scale-95 border border-[#B8860B]"
            >
              Shop Festive Deals Now
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose BHFS */}
      <section className="py-24 bg-[#FAF6F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-block p-3 rounded-full bg-[#1F7A4C]/10 text-[#1F7A4C] mb-3">
              <Heart className="h-6 w-6 fill-current" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900" style={{ fontFamily: 'Playfair Display' }}>
              Why Families Trust BHFS
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              We are not middlemen or repackagers. We are Big Heart Farmers committed to clean, chemical-free nutrition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: '100% Traditional Chakki Grinding',
                desc: 'Our flours are stone-milled at low speeds so heat does not destroy the wheat germ, natural bran fiber, and essential vitamins.',
              },
              {
                icon: ShieldCheck,
                title: 'Zero Preservatives or Chemicals',
                desc: 'No bleaching agents, no adulteration, no chemical shelf-life extenders. Pure, raw agricultural goodness just like village farms.',
              },
              {
                icon: Clock,
                title: 'Milled Fresh on Every Order',
                desc: 'We grind and pack fresh batches so you never receive stale packets sitting in third-party warehouses for months.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-2xl bg-[#1F7A4C]/10 text-[#1F7A4C] flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Testimonial Quote */}
          <div className="mt-16 bg-white p-8 rounded-3xl border border-[#D4AF37]/30 shadow-md max-w-3xl mx-auto text-center">
            <div className="flex justify-center gap-1 text-[#D4AF37] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-sm sm:text-base italic text-stone-800 leading-relaxed font-serif">
              "The Sharbati Gehu Aata from BHFS makes the softest rotis that remain tender even when packed in school tiffins. And the Bilona ghee has that authentic village aroma we haven't smelled in years!"
            </p>
            <div className="mt-4 font-bold text-xs text-stone-900">
              — Priya Deshmukh, Pune
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
