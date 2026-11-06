"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Check, Bed, Users, Maximize, Wind, Calendar, ShieldCheck, Sparkles } from "lucide-react";

interface RoomDetailModalProps {
  room: {
    id: string;
    slug: string;
    name: string;
    category: string;
    isAc: boolean;
    basePrice: number;
    capacity: number;
    bedType: string;
    sizeSqFt: number;
    description: string;
    images: string[];
    amenities: string[];
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (slug: string) => void;
}

export function RoomDetailModal({ room, isOpen, onClose, onBookNow }: RoomDetailModalProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-[#0e1626] border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column: Image Showcase */}
          <div className="bg-black/40 p-4 flex flex-col justify-between">
            <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-800">
              <Image
                src={room.images[activeImageIdx] || room.images[0]}
                alt={room.name}
                fill
                className="object-cover transition-all duration-300"
                priority
              />
              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-gold-400 text-xs px-3 py-1 rounded-full font-semibold border border-gold-500/30">
                {room.category} Class
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {room.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {room.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                      activeImageIdx === idx ? "border-gold-400 scale-105" : "border-gray-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Room Details */}
          <div className="p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                  room.isAc ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "bg-gray-800 text-gray-300"
                }`}>
                  {room.isAc ? "Air Conditioned" : "Non-AC (Ventilated)"}
                </span>
                <span className="text-xs text-gold-400 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> High-Demand Room
                </span>
              </div>

              <h2 className="text-2xl font-serif font-bold text-white mb-2">
                {room.name}
              </h2>

              <p className="text-sm text-gray-300 leading-relaxed mb-4">
                {room.description}
              </p>

              {/* Specs Pills */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-800 text-xs text-gray-300">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-gold-400" />
                  <span>Max {room.capacity} Guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-gold-400" />
                  <span>{room.bedType}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize className="w-4 h-4 text-gold-400" />
                  <span>{room.sizeSqFt} sq. ft.</span>
                </div>
              </div>

              {/* Amenities Grid */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Complimentary Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {room.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Booking Trigger */}
            <div className="bg-[#0b1220] p-4 rounded-xl border border-gray-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 block">Nightly Rate</span>
                <div className="text-xl font-bold text-gold-400">
                  ৳{room.basePrice.toLocaleString()}
                  <span className="text-xs text-gray-400 font-normal"> / night</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(room.slug);
                }}
                className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-gold-500/20 transition transform hover:-translate-y-0.5"
              >
                Book This Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
