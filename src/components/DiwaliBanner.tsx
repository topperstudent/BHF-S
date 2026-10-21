import React, { useState } from 'react';
import { Sparkles, Gift, X, Flame } from 'lucide-react';

export const DiwaliBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="bg-gradient-to-r from-[#5C0F1B] via-[#800A1D] to-[#5C0F1B] text-[#F3E5AB] py-2 px-3 text-center text-xs sm:text-sm font-medium border-b border-[#D4AF37]/40 flex items-center justify-between gap-2 shadow-sm"
      data-testid="diwali-offer-banner"
    >
      <div className="flex-1 flex items-center justify-center gap-2 truncate">
        <Flame className="h-4 w-4 text-[#D4AF37] shrink-0 animate-pulse" />
        <span className="font-bold text-[#F3E5AB]">Shubh Harvest Offers:</span>
        <span className="truncate">
          100% Pure Stone-Ground Aata · Cold-Pressed Oils · Free Delivery on orders above ₹499!
        </span>
        <Gift className="h-4 w-4 text-[#D4AF37] shrink-0 hidden sm:inline" />
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-[#F3E5AB]/70 hover:text-white p-1 rounded-full transition-colors"
        title="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
