import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const handleOpen = () => {
    const defaultText = encodeURIComponent(
      'Namaste BHFS / Big Heart Farmers! I would like to inquire about fresh Chakki Aata and organic grocery items.'
    );
    window.location.href = `https://wa.me/918888092855?text=${defaultText}`;
  };

  return (
    <button
      onClick={handleOpen}
      className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-30 bg-[#25D366] hover:bg-[#20ba59] text-white p-3 sm:p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group cursor-pointer border-2 border-white"
      title="Chat with BHFS on WhatsApp (8888092855)"
      aria-label="WhatsApp Support"
    >
      <MessageCircle className="h-5 w-5 fill-current text-white" />
      <span className="hidden sm:inline-block font-bold text-xs pr-1">
        Order on WhatsApp
      </span>
    </button>
  );
};
