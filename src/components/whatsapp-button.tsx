"use client";

import React from "react";
import { MessageCircle, Phone } from "lucide-react";

export function FloatingActions({ onOpenBooking }: { onOpenBooking?: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* WhatsApp Action Pill */}
      <a
        href="https://wa.me/8801894782070?text=Hello%20Hotel%20Al%20Safa,%20I%20would%20like%20to%20book%20a%20room."
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-3 rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="font-semibold text-sm hidden sm:inline-block pr-1">
          Chat on WhatsApp
        </span>
      </a>

      {/* Floating Quick Book Trigger for Mobile */}
      <button
        onClick={onOpenBooking}
        className="sm:hidden flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold px-4 py-3 rounded-full shadow-2xl active:scale-95 text-sm"
      >
        <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
        <span>Book Online ৳</span>
      </button>
    </div>
  );
}
