import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ShieldCheck, Heart, Sparkles, Globe } from 'lucide-react';

interface FooterProps {
  onOpenDomainGuide?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDomainGuide }) => {
  return (
    <footer className="bg-[#2B090F] text-[#FAF6F0] pt-14 pb-8 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="BHFS Logo"
                className="h-10 w-10 object-contain rounded-full border border-[#D4AF37]/50"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-2xl font-black text-[#F3E5AB]" style={{ fontFamily: 'Playfair Display' }}>
                BHFS
              </span>
            </div>
            <p className="text-xs text-[#FAF6F0]/75 leading-relaxed">
              Big Heart Farmers is your trusted farm-to-table partner. We bring freshly stone-milled Sharbati Aata, traditional Bilona Cow Ghee, cold-pressed oils, and farm dals directly to your kitchen.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Pure · Chemical-Free · FSSAI Grade</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Our Produce
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/80">
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Chakki Fresh Sharbati Aata (10kg & 5kg)
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Ancient Khapli / Emmer Wheat Flour
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Multigrain Superfood Flour
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Lakdi Ghani Wood-Pressed Oils
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Pure Vedic Desi Cow Bilona Ghee
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-[#D4AF37] transition-colors">
                  Unpolished Toor & Moong Dals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care & Hosting */}
          <div>
            <h4 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Customer Portal
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF6F0]/80">
              <li>
                <Link to="/my-orders" className="hover:text-[#D4AF37] transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-[#D4AF37] transition-colors">
                  Delivery Address & Profile
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#D4AF37] transition-colors">
                  Admin Dashboard Login
                </Link>
              </li>
              {onOpenDomainGuide && (
                <li>
                  <button
                    onClick={onOpenDomainGuide}
                    className="flex items-center gap-1.5 text-[#D4AF37] hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Custom Domain (bhfs.in) Setup Guide
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-[#F3E5AB] uppercase tracking-wider mb-4" style={{ fontFamily: 'Playfair Display' }}>
              Farm Contact
            </h4>
            <div className="space-y-3 text-xs text-[#FAF6F0]/80">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Lonikand Pushp Nagari, Konark Residency, Pune, Maharashtra 412216</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>+91 8888092855 / 7020835560</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>contact@bhfs.in / admin@bhfs.com</span>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/918888092855"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-full font-bold text-[11px] shadow hover:brightness-105"
                >
                  <Sparkles className="h-3 w-3" />
                  WhatsApp Direct Help
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF6F0]/60 gap-4">
          <p>© {new Date().getFullYear()} BHFS - Big Heart Farmers (bhfs.in). All rights reserved.</p>
          <div className="flex items-center gap-1 text-[#D4AF37]">
            <span>Grown with</span>
            <Heart className="h-3.5 w-3.5 fill-current text-red-400" />
            <span>by farming families in Maharashtra</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
