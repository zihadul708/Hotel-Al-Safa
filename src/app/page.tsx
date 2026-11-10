"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Bed,
  MapPin,
  Plane,
  Phone,
  MessageCircle,
  ShieldCheck,
  CheckCircle,
  Wifi,
  Tv,
  Coffee,
  Sparkles,
  ChevronRight,
  Clock,
  UtensilsCrossed,
  ArrowRight,
  Star,
  Compass,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";
import { RoomDetailModal } from "@/components/room-detail-modal";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/animations";

export interface RoomTypeData {
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
  featured: boolean;
}

export default function HomePage() {
  const [rooms, setRooms] = useState<RoomTypeData[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | undefined>();
  const [quickCheckIn, setQuickCheckIn] = useState<string>("");
  const [quickCheckOut, setQuickCheckOut] = useState<string>("");

  // Room Detail Modal State
  const [selectedDetailRoom, setSelectedDetailRoom] = useState<RoomTypeData | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setRooms(Array.isArray(data) ? data : []);
        setLoadingRooms(false);
      })
      .catch((err) => {
        console.error("Failed to load rooms:", err);
        setRooms([]);
        setLoadingRooms(false);
      });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setQuickCheckIn(today.toISOString().split("T")[0]);
    setQuickCheckOut(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleOpenBooking = (slug?: string) => {
    setSelectedRoomSlug(slug);
    setIsBookingOpen(true);
  };

  const handleOpenDetails = (room: RoomTypeData) => {
    setSelectedDetailRoom(room);
  };

  const safeRooms = Array.isArray(rooms) ? rooms : [];
  const filteredRooms =
    activeCategory === "ALL"
      ? safeRooms
      : safeRooms.filter((r) => r.category && r.category.toUpperCase() === activeCategory.toUpperCase());

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900 flex flex-col font-sans selection:bg-gold-400 selection:text-black">
      {/* Top Contact Bar */}
      <TopBar />

      {/* Main Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION WITH ENHANCED INTRO ANIMATIONS               */}
        {/* ========================================================= */}
        <section className="relative min-h-[660px] lg:min-h-[740px] flex items-center justify-center bg-[#070d18] text-white overflow-hidden py-16 px-4">
          {/* Background Image with dark luxury overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85"
              alt="Hotel Al Safa Luxury Facade"
              fill
              className="object-cover opacity-35 transform scale-105 transition-transform duration-1000"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-[#070d18]/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-5">
            {/* Royal Crest Logo in Hero */}
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-48 sm:w-64 h-20 sm:h-24 mx-auto drop-shadow-[0_4px_24px_rgba(212,175,55,0.45)]"
            >
              <Image
                src="/logo-full.png"
                alt="Hotel Al Safa Royal Emblem"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Top Star Rating Pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-medium tracking-wider uppercase"
            >
              <span className="flex text-gold-400">★★★★★</span>
              <span>Premier Airport Transit & Pilgrim Suites • Dhaka</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight max-w-4xl mx-auto"
            >
              Your Peaceful Haven Just{" "}
              <span className="gold-text-gradient underline decoration-gold-400/30">
                5 Minutes
              </span>{" "}
              From Dhaka Airport
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Designed for international transit travelers, Hajj & Umrah pilgrims, and visiting
              executives. Experience soundproof AC suites, 24/7 free airport shuttle, and authentic
              hospitality.
            </motion.p>

            {/* ========================================== */}
            {/* QUICK BOOKING BAR (Similar to D'Palace BD) */}
            {/* ========================================== */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pt-4 max-w-4xl mx-auto"
            >
              <div className="bg-[#0b1220]/95 backdrop-blur-xl border border-gold-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  {/* Check-In */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>Check-In Date</span>
                    </label>
                    <input
                      type="date"
                      value={quickCheckIn}
                      onChange={(e) => setQuickCheckIn(e.target.value)}
                      className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {/* Check-Out */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-400" />
                      <span>Check-Out Date</span>
                    </label>
                    <input
                      type="date"
                      value={quickCheckOut}
                      onChange={(e) => setQuickCheckOut(e.target.value)}
                      className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold-400" />
                      <span>Guests & Room</span>
                    </label>
                    <select
                      className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== "any") setSelectedRoomSlug(val);
                      }}
                    >
                      <option value="any">2 Guests (Couple / Deluxe)</option>
                      <option value="couple-ac-deluxe">Couple AC Deluxe (৳3,500)</option>
                      <option value="couple-non-ac-economy">Couple Economy Non-AC (৳1,400)</option>
                      <option value="super-deluxe-twin">Super Deluxe Twin (৳4,800)</option>
                      <option value="executive-family-suite">Royal Family Suite (৳6,500)</option>
                      <option value="presidential-al-safa-suite">Presidential Suite (৳9,500)</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      onClick={() => handleOpenBooking(selectedRoomSlug)}
                      className="w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-black font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-gold-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Check Rates & Book</span>
                    </button>
                  </div>
                </div>

                {/* Quick Trust Highlights */}
                <div className="mt-4 pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Free Airport Pickup</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant bKash / Nagad Confirmation</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Pay at Hotel Option</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hajj Camp 3 Mins Walk</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* VALUE PILLARS & FEATURES (SCROLL ANIMATED)               */}
        {/* ========================================================= */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaggerItem>
                <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-4">
                    <Plane className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
                    5 Mins to Airport
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Located at Ashkona, opposite Dhaka International Airport and next to the Hajj Camp. Never miss a flight.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
                    24/7 Front Desk & Shuttle
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Midnight or early morning arrivals are warmly received anytime. 24-hour room service and security.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-4">
                    <UtensilsCrossed className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
                    Halal Dining & Cafe
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    On-site kitchen preparing fresh local dishes, Desi breakfast, Chinese, and continental menu options.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-4">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
                    Hajj & Umrah Friendly
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Spacious family suites, luggage storage, and special care for pilgrims embarking on holy journeys.
                  </p>
                </div>
              </StaggerItem>
            </StaggerGroup>
          </div>
        </section>

        {/* ========================================================= */}
        {/* ROOMS & SUITES SECTION (SCROLL ANIMATED)                  */}
        {/* ========================================================= */}
        <section id="rooms" className="py-20 bg-[#f8f5ee]">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <FadeIn direction="up">
              <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
                  Luxury Accommodations
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                  Explore Our Rooms & Suites
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  From budget-friendly non-AC transit rooms to lavish presidential suites, every room is
                  furnished with premium bedding, hot geysers, and sound insulation.
                </p>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  {[
                    { label: "All Rooms", value: "ALL" },
                    { label: "Couple Rooms", value: "COUPLE" },
                    { label: "Deluxe & Twin", value: "DELUXE" },
                    { label: "Family Suites", value: "FAMILY" },
                    { label: "Presidential", value: "SUITE" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveCategory(tab.value)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                        activeCategory === tab.value
                          ? "bg-[#0b111e] text-gold-400 shadow-md"
                          : "bg-white text-gray-600 hover:text-black border border-gray-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Room Cards Grid */}
            {loadingRooms ? (
              <div className="py-20 text-center text-gray-500 font-medium">
                Loading rooms & suites...
              </div>
            ) : (
              <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRooms.map((room) => {
                  const mainImage = (Array.isArray(room.images) && room.images[0]) || "https://images.unsplash.com/photo-1590490360182-c33d57733427";

                  return (
                    <StaggerItem key={room.id}>
                      <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1.5">
                        {/* Image Preview Container */}
                        <div className="relative h-60 w-full overflow-hidden bg-gray-900">
                          <Image
                            src={mainImage}
                            alt={room.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* AC Badge */}
                          <div className="absolute top-3 left-3">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow ${
                                room.isAc
                                  ? "bg-cyan-900/90 text-cyan-200 border border-cyan-700"
                                  : "bg-gray-900/90 text-gray-300 border border-gray-700"
                              }`}
                            >
                              {room.isAc ? "Air Conditioned" : "Non-AC Economy"}
                            </span>
                          </div>

                          {/* Price Badge */}
                          <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl border border-gold-500/40">
                            <span className="text-base font-bold text-gold-400">
                              ৳{room.basePrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-300"> / night</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                              <span className="font-semibold text-gold-600 uppercase tracking-wider">
                                {room.category} Class
                              </span>
                              <span>{room.sizeSqFt} sq. ft.</span>
                            </div>

                            <h3 className="font-serif font-bold text-xl text-gray-900 mb-2 group-hover:text-gold-600 transition-colors">
                              {room.name}
                            </h3>

                            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                              {room.description}
                            </p>

                            {/* Quick Spec Pills */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 bg-[#faf8f4] p-3 rounded-xl border border-gray-100 mb-4">
                              <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                                <span className="truncate">Max {room.capacity} Guests</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Bed className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                                <span className="truncate">{room.bedType}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Wifi className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                                <span>Free Wi-Fi</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Tv className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                                <span>LED TV & Cable</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => handleOpenDetails(room)}
                              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2.5 rounded-xl transition text-center"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => handleOpenBooking(room.slug)}
                              className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black text-xs font-bold py-2.5 rounded-xl transition shadow shadow-gold-500/20 text-center"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* AMENITIES & FACILITIES (SCROLL ANIMATED)                  */}
        {/* ========================================================= */}
        <section id="amenities" className="py-20 bg-white border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
                  Comfort & Hospitality
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                  Hotel Facilities & Amenities
                </h2>
                <p className="text-gray-600 text-sm">
                  Every service at Hotel Al Safa is engineered to provide transit ease and restful hospitality.
                </p>
              </div>
            </FadeIn>

            <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { title: "Airport Pickup", desc: "Private van & car shuttle", icon: Plane },
                { title: "24/7 Hot Water", desc: "Geyser in all en-suites", icon: Clock },
                { title: "High-Speed Wi-Fi", desc: "Dedicated high-bandwidth", icon: Wifi },
                { title: "Halal Restaurant", desc: "Desi, Chinese & Continental", icon: Coffee },
                { title: "Power Generator", desc: "100% continuous backup", icon: Sparkles },
                { title: "Luggage Cloak", desc: "Safe keeping for pilgrims", icon: ShieldCheck },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="p-5 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 text-center hover:border-gold-400/50 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1 h-full">
                      <div className="w-12 h-12 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold-500 group-hover:text-black transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-[11px] text-gray-500">{item.desc}</p>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
          </div>
        </section>

        {/* ========================================================= */}
        {/* DINING & CULINARY SHOWCASE (SCROLL ANIMATED)              */}
        {/* ========================================================= */}
        <section id="dining" className="py-20 bg-[#0d1525] text-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Images Collage */}
              <FadeIn direction="right">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative h-64 rounded-2xl overflow-hidden border border-gold-500/30 shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
                      alt="Delicious Dining"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden border border-gold-500/30 mt-6 shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
                      alt="Al Safa Dining Area"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </FadeIn>

              {/* Right Content */}
              <FadeIn direction="left">
                <div className="space-y-6">
                  <div className="inline-block text-xs uppercase tracking-widest text-gold-400 font-bold">
                    Gourmet & Room Service
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
                    Savor Fresh, 100% Halal Culinary Delights
                  </h2>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                    Our in-house chef prepares wholesome, hot meals around the clock. Whether you crave
                    a fragrant Dhaka Kacchi Biryani, light soup, fresh breakfast parathas with eggs and tea,
                    or international transit snacks, our kitchen serves direct to your room.
                  </p>

                  <div className="space-y-3 pt-2 text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                      <span>Complimentary Morning Breakfast Buffets for Executive Guests</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                      <span>24-Hour Hot Tea, Coffee & Mineral Water Room Delivery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-gold-400 flex-shrink-0" />
                      <span>Hygienic, Dietary & Pilgrim Friendly Meal Plans</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <button
                      onClick={() => handleOpenBooking()}
                      className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
                    >
                      Book Stay with Dining
                    </button>
                    <a
                      href="tel:+8801894782070"
                      className="flex items-center gap-2 border border-gray-700 hover:border-gold-400 text-gray-300 hover:text-white px-5 py-3 rounded-xl transition text-sm"
                    >
                      <Phone className="w-4 h-4 text-gold-400" />
                      <span>Call Room Service</span>
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* LOCATION & NEARBY PROXIMITY GUIDE (SCROLL ANIMATED)       */}
        {/* ========================================================= */}
        <section id="location" className="py-20 bg-[#f8f5ee] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
                  Strategic Location
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                  Connected to Dhaka's Major Gateways
                </h2>
                <p className="text-gray-600 text-sm">
                  Situated in Ashkona (Mili Super Tower-2), right next to the airport terminal and Hajj camp.
                </p>
              </div>
            </FadeIn>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Proximity Distance Cards */}
              <StaggerGroup className="space-y-4">
                <StaggerItem>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                        <Plane className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Dhaka Int'l Airport (DAC)</h4>
                        <p className="text-xs text-gray-500">Terminals 1, 2 & Domestic</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                      5 Mins
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Ashkona Hajj Camp</h4>
                        <p className="text-xs text-gray-500">Direct walking proximity</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                      3 Mins Walk
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Airport Railway Station</h4>
                        <p className="text-xs text-gray-500">Direct intercity trains</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                      8 Mins
                    </span>
                  </div>
                </StaggerItem>

                <StaggerItem>
                  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">Uttara Commercial Sector 3</h4>
                        <p className="text-xs text-gray-500">Shopping malls, banks & dining</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2.5 py-1 rounded-full">
                      10 Mins
                    </span>
                  </div>
                </StaggerItem>
              </StaggerGroup>

              {/* Map & Direction View */}
              <FadeIn direction="left" className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-gray-900">
                        Hotel Al Safa Location Map
                      </h3>
                      <p className="text-xs text-gray-500">
                        Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230
                      </p>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Ashkona+Hajj+Camp+Dhaka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
                    >
                      <span>Open in Google Maps</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Google Map iframe simulation */}
                  <div className="w-full h-72 rounded-xl overflow-hidden border border-gray-200 relative bg-gray-100">
                    <iframe
                      title="Hotel Al Safa Location Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.825225139039!2d90.40740924999999!3d23.85288285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c6600c6d7fa5%3A0x6b63c4c9540c74cf!2sAshkona%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* GUEST REVIEWS & TESTIMONIALS (SCROLL ANIMATED)            */}
        {/* ========================================================= */}
        <section className="py-20 bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <FadeIn direction="up">
              <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
                  Guest Experience
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                  What Our Guests Say
                </h2>
                <p className="text-gray-600 text-sm">
                  Trusted by thousands of international transit passengers, holiday travelers, and pilgrims.
                </p>
              </div>
            </FadeIn>

            <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Capt. Farhan Chowdhury",
                  loc: "Dhaka Transit Traveler",
                  quote:
                    "Super convenient location right by the airport! The pickup driver was waiting at the arrival exit, room was impeccably clean with crisp AC, and hot breakfast was ready early morning. Best transit stay in Dhaka.",
                  room: "Couple AC Deluxe",
                },
                {
                  name: "Haji Mohammad Yunus",
                  loc: "Chittagong (Umrah Pilgrim)",
                  quote:
                    "We stayed with our entire family before our Umrah flight. The staff treated us like family. Very close to Ashkona Hajj Camp, extremely quiet soundproofing, and safe parking.",
                  room: "Executive Royal Family Suite",
                },
                {
                  name: "Sabrina Mostafa",
                  loc: "Sylhet",
                  quote:
                    "Seamless direct online booking with bKash. No hidden charges. The room looked exactly like the photos on the website. Fast Wi-Fi, modern shower, and wonderful staff.",
                  room: "Super Deluxe Twin Bed",
                },
              ].map((rev, idx) => (
                <StaggerItem key={idx}>
                  <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1">
                    <div>
                      <div className="flex text-amber-500 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic mb-4">
                        "{rev.quote}"
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <h4 className="font-bold text-gray-900 text-sm">{rev.name}</h4>
                      <p className="text-xs text-gold-600">{rev.loc} • {rev.room}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ========================================================= */}
        {/* DIRECT BOOKING CTA BANNER (SCROLL ANIMATED)               */}
        {/* ========================================================= */}
        <section id="contact" className="py-16 bg-gradient-to-r from-[#0b1220] via-[#111c33] to-[#0b1220] text-white overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <FadeIn direction="up" className="space-y-6">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                Reserve Directly & Save
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white max-w-3xl mx-auto">
                Ready for a Seamless, Comfortable Stay at Hotel Al Safa?
              </h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto">
                Book online instantly without any agency commissions. Instant verification via bKash,
                Nagad, or Cards, plus Pay on Arrival option.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <button
                  onClick={() => handleOpenBooking()}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-8 py-3.5 rounded-full shadow-xl transition transform hover:scale-105"
                >
                  Book Your Room Now
                </button>
                <a
                  href="https://wa.me/8801894782070?text=Hello%20Hotel%20Al%20Safa,%20I%20want%20to%20book%20a%20room"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold px-7 py-3.5 rounded-full transition shadow-lg transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Instant Inquiry</span>
                </a>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <FloatingActions onOpenBooking={() => handleOpenBooking()} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedRoomSlug={selectedRoomSlug}
        initialCheckIn={quickCheckIn}
        initialCheckOut={quickCheckOut}
      />

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedDetailRoom}
        isOpen={!!selectedDetailRoom}
        onClose={() => setSelectedDetailRoom(null)}
        onBookNow={(slug) => {
          setSelectedDetailRoom(null);
          handleOpenBooking(slug);
        }}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
