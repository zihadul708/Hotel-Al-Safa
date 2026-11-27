"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  ChevronLeft,
  Clock,
  UtensilsCrossed,
  ArrowRight,
  Star,
  Compass,
  HeartHandshake,
  BookOpen,
  Award,
  ExternalLink,
  Car,
  Lock,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";
import { RoomDetailModal } from "@/components/room-detail-modal";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/animations";
import { HOTEL_CONFIG, getWhatsAppUrl } from "@/lib/hotel-config";
import { optimizeImageUrl } from "@/lib/image-utils";
import { INITIAL_HERO_SLIDES, HeroSlide } from "@/lib/hero-slides-types";

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
  const [showAllRooms, setShowAllRooms] = useState(false);

  // Dynamic Hero Moving Slides State
  const [slides, setSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Load latest custom hero slides from API
  useEffect(() => {
    fetch("/api/hero-slides")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch((err) => {
        console.warn("Hero slides fetch fallback to initial:", err);
      });
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | undefined>();
  const [quickCheckIn, setQuickCheckIn] = useState<string>("");
  const [quickCheckOut, setQuickCheckOut] = useState<string>("");

  // Room Detail Modal State
  const [selectedDetailRoom, setSelectedDetailRoom] = useState<RoomTypeData | null>(null);

  useEffect(() => {
    fetch("/api/rooms", { cache: "no-store" })
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
      : safeRooms.filter((r) => {
          const cat = r.category?.toUpperCase() || "";
          const name = r.name?.toUpperCase() || "";
          const target = activeCategory.toUpperCase();
          if (target === "DELUXE") return r.isAc;
          if (target === "ECONOMY") return !r.isAc;
          if (target === "COUPLE") return name.includes("COUPLE") || cat.includes("COUPLE");
          if (target === "FAMILY") return name.includes("FAMILY") || cat.includes("FAMILY");
          if (target === "SINGLE") return name.includes("SINGLE") || cat.includes("SINGLE");
          return cat === target;
        });

  const displayedRooms = showAllRooms ? filteredRooms : filteredRooms.slice(0, 6);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-900 flex flex-col font-sans selection:bg-gold-400 selection:text-black">
      {/* Top Contact Marquee */}
      <TopBar />

      {/* Main Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION WITH MOVING BACKGROUND IMAGES SLIDER        */}
        {/* ========================================================= */}
        <section className="relative min-h-[660px] lg:min-h-[740px] flex items-center justify-center bg-[#070d18] text-white overflow-hidden py-10 sm:py-14 lg:py-16 px-3 sm:px-4">
          {/* Moving Background Image Slides with Ken Burns Smooth Transition */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <div
                  key={slide.id || index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    isActive
                      ? "opacity-95 lg:opacity-100 scale-105 z-10"
                      : "opacity-0 scale-100 z-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={optimizeImageUrl(slide.image, 1920)}
                    alt={slide.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
              );
            })}
            {/* Elegant atmospheric overlays - keeping carousel images crystal clear while optimizing text readability */}
            <div className="absolute inset-0 z-10 bg-black/25 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-36 z-10 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-56 z-10 bg-gradient-to-t from-[#070d18] via-[#070d18]/75 to-transparent pointer-events-none" />
          </div>

          {/* Left / Right Carousel Arrow Controls */}
          <div className="absolute inset-y-0 left-2 sm:left-4 right-2 sm:right-4 z-30 flex items-center justify-between pointer-events-none">
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Slide"
              className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-gold-500 text-white hover:text-black backdrop-blur-md border border-white/25 hover:border-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl group"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Slide"
              className="pointer-events-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/50 hover:bg-gold-500 text-white hover:text-black backdrop-blur-md border border-white/25 hover:border-gold-400 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl group"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Top-Right Floating Slide Badge */}
          <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-gold-400/30 text-gold-300 text-xs shadow-lg">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="font-mono text-gold-200">
              {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-200 font-medium truncate max-w-[220px]">
              {slides[currentSlide]?.tag || "Featured Suite"}
            </span>
          </div>

          <div className="relative z-20 max-w-5xl mx-auto text-center space-y-3 sm:space-y-4">
            {/* Minimal & Elegant Hero Text: streamlined to give maximum visibility to moving banner images */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2.5 max-w-3xl mx-auto"
            >
              {/* Hotel Brand Pill & Live Slide Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/55 border border-gold-400/40 text-gold-300 text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md shadow-lg shadow-black/40">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span>{slides[currentSlide]?.tag || "Luxury Airport Transit • Dhaka"}</span>
              </div>

              {/* Main Headline with Luxury Gold & Platinum Ivory Typography */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
                <span className="text-stone-100">
                  Your Peaceful Haven Just{" "}
                </span>
                <span className="bg-gradient-to-r from-amber-200 via-gold-400 to-yellow-200 bg-clip-text text-transparent underline decoration-gold-400/50 decoration-wavy underline-offset-8 drop-shadow-[0_2px_14px_rgba(212,175,55,0.4)]">
                  5 Minutes
                </span>
                <span className="text-stone-100">
                  {" "}From Dhaka Airport
                </span>
              </h1>

              {/* Short, Punchy 1-line Tagline */}
              <p className="text-xs sm:text-sm text-amber-100/90 font-medium tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Soundproof AC Comfort • 24/7 Front Desk • Hajj Camp 3 Mins Walk
              </p>
            </motion.div>

            {/* ========================================== */}
            {/* QUICK BOOKING BAR                          */}
            {/* ========================================== */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pt-1 max-w-4xl mx-auto"
            >
              <div className="bg-[#0b1220]/80 backdrop-blur-xl border border-gold-500/30 rounded-2xl p-3.5 sm:p-4 shadow-2xl text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
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
                      <option value="any">Select Room Category</option>
                      <option value="deluxe-single-ac">Deluxe (Single) AC - ৳2,000</option>
                      <option value="deluxe-couple-ac">Deluxe (Couple) AC - ৳2,500</option>
                      <option value="deluxe-twin-ac">Deluxe (Twin) AC - ৳3,000</option>
                      <option value="deluxe-double-ac">Deluxe (Double) AC - ৳3,500</option>
                      <option value="deluxe-family-ac">Deluxe (Family) AC - ৳4,000</option>
                      <option value="economy-single-non-ac">Economy (Single) Non-AC - ৳1,500</option>
                      <option value="economy-couple-non-ac">Economy (Couple) Non-AC - ৳2,000</option>
                      <option value="economy-twin-non-ac">Economy (Twin) Non-AC - ৳2,500</option>
                      <option value="economy-double-non-ac">Economy (Double) Non-AC - ৳2,500</option>
                      <option value="economy-family-non-ac">Economy (Family) Non-AC - ৳3,000</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      onClick={() => handleOpenBooking(selectedRoomSlug)}
                      className="group w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-[length:200%_auto] hover:bg-right text-black font-bold py-2.5 px-4 rounded-xl shadow-lg shadow-gold-500/25 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out text-sm flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform duration-300" />
                      <span>Check Rates & Book</span>
                      <ArrowRight className="w-4 h-4 text-black/80 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Slide Navigation Dots & Counter */}
            <div className="pt-3 flex items-center justify-center gap-2">
              {slides.map((slide, idx) => (
                <button
                  key={slide.id || idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to hero slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full h-2.5 ${
                    idx === currentSlide
                      ? "w-9 bg-gold-400 shadow-md shadow-gold-400/50"
                      : "w-2.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
              <span className="text-[11px] text-gold-300/80 ml-2 font-mono">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </div>
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
                    { label: "Deluxe (AC)", value: "DELUXE" },
                    { label: "Economy (Non-AC)", value: "ECONOMY" },
                    { label: "Couple", value: "COUPLE" },
                    { label: "Family", value: "FAMILY" },
                    { label: "Single", value: "SINGLE" },
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => {
                        setActiveCategory(tab.value);
                        setShowAllRooms(false);
                      }}
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
                {displayedRooms.map((room) => {
                  const mainImage = (Array.isArray(room.images) && room.images[0]) || "https://images.unsplash.com/photo-1590490360182-c33d57733427";

                  return (
                    <StaggerItem key={room.id}>
                      <div
                        onClick={() => handleOpenDetails(room)}
                        className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full transform hover:-translate-y-1.5 cursor-pointer"
                      >
                        {/* Image Preview Container */}
                        <div className="relative h-60 w-full overflow-hidden bg-gray-900">
                          <Image
                            src={optimizeImageUrl(mainImage, 800)}
                            alt={room.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails(room);
                              }}
                              className="w-full bg-gray-50 hover:bg-gold-50/80 text-gray-700 hover:text-gray-900 border border-gray-200/90 hover:border-gold-400/60 text-xs font-semibold py-2.5 rounded-xl transition-all duration-300 ease-out text-center hover:shadow-sm"
                            >
                              View Details
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenBooking(room.slug);
                              }}
                              className="group/book w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-[length:200%_auto] hover:bg-right text-black text-xs font-bold py-2.5 rounded-xl shadow-md shadow-gold-500/20 hover:shadow-lg hover:shadow-gold-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out flex items-center justify-center gap-1.5"
                            >
                              <span>Book Now</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/book:translate-x-1 transition-transform duration-300" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerGroup>
            )}

            {/* View More / Directory Buttons when more than 6 rooms exist */}
            {filteredRooms.length > 6 && (
              <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setShowAllRooms(!showAllRooms)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#0b111e] text-gray-800 hover:text-gold-400 border border-gray-300 hover:border-gold-500/50 font-semibold text-xs sm:text-sm tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>{showAllRooms ? "Show Fewer (6 Rooms)" : `View More Rooms (${filteredRooms.length})`}</span>
                </button>
                <Link
                  href="/rooms"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0b111e] hover:bg-gold-500 text-gold-400 hover:text-black border border-gold-500/40 font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                  <span>Browse Full Directory & Filter</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
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
                    24/7 Front Desk & Reception
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Midnight or early morning arrivals are warmly received anytime. 24-hour concierge assistance and secure premises.
                  </p>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-4">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">
                    High-Speed Wi-Fi & Power
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Continuous generator power backup and high-speed fiber Wi-Fi throughout all rooms and guest corridors.
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
        {/* OUR STORY & HOSPITALITY HERITAGE (SCROLL ANIMATED)        */}
        {/* ========================================================= */}
        <section id="story" className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-white via-[#faf7f2] to-[#f4efe4] border-b border-gray-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">
              {/* Left Column: Visual Collage */}
              <FadeIn direction="right" className="lg:col-span-5 relative mb-4 sm:mb-6 lg:mb-0">
                <div className="relative">
                  {/* Main Primary Image */}
                  <div className="relative h-[280px] xs:h-[340px] sm:h-[420px] lg:h-[460px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white">
                    <Image
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85"
                      alt="Hotel Al Safa Warm Hospitality & Reception"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white">
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gold-300 font-semibold block mb-1">
                        Ashkona, Hajj Camp Road, Dhaka
                      </span>
                      <h4 className="font-serif font-bold text-base sm:text-xl leading-snug">
                        A Tranquil Haven for Transit Travelers & Pilgrims
                      </h4>
                    </div>
                  </div>

                  {/* Overlapping Floating Secondary Image Card (Tablet & Desktop) */}
                  <div className="hidden sm:block absolute -bottom-5 sm:-bottom-6 -right-2 sm:-right-4 lg:-right-6 w-48 sm:w-52 lg:w-56 h-36 sm:h-44 lg:h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900 z-10">
                    <Image
                      src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=85"
                      alt="Soundproof Suite Interior"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs">
                      <span className="font-bold text-gold-400 block text-xs">100% Soundproof</span>
                      <p className="text-[10px] text-gray-300">Quiet rest away from city noise</p>
                    </div>
                  </div>

                  {/* Floating Trust Badge */}
                  <div className="absolute top-3 left-3 sm:-top-3 sm:-left-3 lg:-top-4 lg:-left-4 z-10 bg-[#070d18]/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-gold-500/40 shadow-xl max-w-[190px] sm:max-w-[210px]">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <HeartHandshake className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 flex-shrink-0" />
                      <span className="text-[11px] sm:text-xs font-bold text-gold-300 uppercase tracking-wider">Our Heritage</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-gray-300 leading-snug">
                      Devoted to pilgrim comfort & stress-free flight transit.
                    </p>
                  </div>
                </div>
              </FadeIn>

              {/* Right Column: Story Narrative */}
              <FadeIn direction="left" className="lg:col-span-7 space-y-5 sm:space-y-6">
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-700 text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-gold-600" />
                    <span>Our Story & Mission</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight">
                    Crafted for Peaceful Rest at <span className="gold-text-gradient">Dhaka’s Gateway</span>
                  </h2>
                </div>

                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-gray-600 leading-relaxed">
                  <p>
                    Gracefully positioned in Ashkona (Mili Super Tower-2), directly opposite the historic <strong>Ashkona Hajj Camp</strong> and merely <strong>5 minutes from Hazrat Shahjalal International Airport</strong>, <strong>Hotel Al Safa International</strong> was established with a singular devotion: to provide an authentic sanctuary of peace, dignity, and sincere Bangladeshi hospitality for international travelers and pilgrims.
                  </p>
                  <p>
                    We understand that flight layovers, long-haul journeys, and sacred pilgrimages demand quietude and seamless convenience. Located outside congested central Dhaka traffic, Hotel Al Safa is engineered for restful silence—featuring soundproof AC rooms, 24-hour hot geysers, high-speed fiber Wi-Fi, and 100% round-the-clock power generator backup.
                  </p>
                  <p>
                    Whether embarking on an Umrah or Hajj journey, resting between flight connections, or visiting Dhaka for business, our 24/7 reception desk welcomes you warmly at any hour of the day or night.
                  </p>
                </div>

                {/* Key Story Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1 sm:pt-2">
                  <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-gold-300/60 transition-all flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-700 flex-shrink-0 mt-0.5">
                      <Compass className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">Pilgrim Sanctuary</h4>
                      <p className="text-xs text-gray-500 mt-0.5">3-minute walk to Ashkona Hajj Camp for easy pilgrimage transit.</p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-gold-300/60 transition-all flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-700 flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">24/7 Warm Welcome</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Immediate check-in for delayed midnight or early dawn arrivals.</p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-gold-300/60 transition-all flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-700 flex-shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">100% Halal & Secure</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Compliant with DMP Sec-27, CCTV security, and safe family stay.</p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl bg-white border border-gray-200/90 shadow-sm hover:shadow-md hover:border-gold-300/60 transition-all flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-700 flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">Transparent Pricing</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Honest rates in BDT, zero hidden surcharges, direct instant booking.</p>
                    </div>
                  </div>
                </div>

                {/* Trust Quote / Signature */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="italic text-xs sm:text-sm text-gray-600 border-l-2 border-gold-500 pl-3">
                    "We do not merely offer rooms—we offer peace of mind when you need it most."
                    <span className="block font-semibold text-gray-800 not-italic text-xs mt-0.5">
                      — Hotel Al Safa International Team
                    </span>
                  </div>

                  <div className="flex items-center sm:flex-shrink-0">
                    <a
                      href="#rooms"
                      className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-gray-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <span>Explore Rooms</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </div>
              </FadeIn>
            </div>
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

            <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { title: "24/7 Hot Water", desc: "", icon: Clock },
                { title: "High-Speed Wi-Fi", desc: "Dedicated high-bandwidth", icon: Wifi },
                { title: "Power Generator", desc: "100% continuous backup", icon: Sparkles },
                { title: "Soundproof Rooms", desc: "Quiet & restful comfort", icon: ShieldCheck },
                { title: "Luggage Cloak", desc: "Safe keeping for guests", icon: ShieldCheck },
                { title: "24/7 Front Desk", desc: "Attentive reception desk", icon: Clock },
                { title: "Secure Car Parking", desc: "Dedicated guest parking", icon: Car },
                { title: "24-Hour Room Service", desc: "Round-the-clock assistance", icon: UtensilsCrossed },
                { title: "Safety Locker", desc: "Secure valuables storage", icon: Lock },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <StaggerItem key={idx}>
                    <div className="p-5 rounded-2xl bg-[#fdfbf7] border border-gray-200/80 text-center hover:border-gold-400/50 hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1 h-full">
                      <div className="w-12 h-12 rounded-full bg-gold-400/15 border border-gold-400/30 text-gold-600 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold-500 group-hover:text-black transition">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-sm text-gray-900 mb-1">{item.title}</h4>
                      {item.desc && <p className="text-[11px] text-gray-500">{item.desc}</p>}
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerGroup>
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
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gold-400/50 shadow-md space-y-4">
                  {/* Exact Location Header Badge */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/15 border border-gold-500/40 text-gold-700 font-bold text-xs uppercase tracking-wider mb-2">
                        <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                        <span>Exact Pinpoint Location</span>
                      </div>
                      <h3 className="font-serif font-bold text-xl text-gray-900 flex items-center gap-2">
                        <span>Hotel Al Safa International</span>
                        <span className="text-xs font-sans font-normal text-gold-700 bg-gold-50 px-2 py-0.5 rounded border border-gold-200">
                          Mili Super Tower-2
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 flex items-start gap-1.5">
                        <MapPin className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
                        <span>Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <a
                        href="https://maps.app.goo.gl/4MH89QCucKXE5hHv5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-[length:200%_auto] hover:bg-right text-black text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out"
                      >
                        <Compass className="w-4 h-4 text-black group-hover:rotate-45 transition-transform duration-500 ease-out" />
                        <span>Open in Google Maps</span>
                        <ArrowRight className="w-3.5 h-3.5 text-black/80 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>

                      <a
                        href={`tel:${HOTEL_CONFIG.phonePrimary}`}
                        className="inline-flex items-center gap-2 bg-white hover:bg-gold-50 text-gray-800 hover:text-black text-xs font-bold px-4 py-2.5 rounded-xl border border-gray-300 hover:border-gold-400 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out"
                      >
                        <Phone className="w-3.5 h-3.5 text-gold-600" />
                        <span>Call Front Desk</span>
                      </a>
                    </div>
                  </div>

                  {/* Interactive Embedded Map Pinning Exact Hotel Location */}
                  <div className="w-full h-80 rounded-xl overflow-hidden border-2 border-gold-400/30 relative bg-gray-100 shadow-inner">
                    <iframe
                      title="Hotel Al Safa International Exact Location Map"
                      src="https://maps.google.com/maps?q=23.8516087,90.4145012+(Hotel+Al+Safa+International)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    {/* Floating Exact Location Pill over Map linking to Google Maps */}
                    <a
                      href="https://maps.app.goo.gl/4MH89QCucKXE5hHv5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group absolute top-3 left-3 bg-[#070d18]/90 hover:bg-[#070d18] transition-all backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-gold-400/40 text-xs shadow-lg flex items-center gap-2 cursor-pointer hover:border-gold-400"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-semibold text-gold-300">Exact Spot:</span>
                      <span className="font-medium text-gray-200">Hotel Al Safa International</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gold-400 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>

                  {/* Landmark Navigation Guidance Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-[#fdfbf7] rounded-xl border border-gray-200 text-xs">
                      <span className="font-bold text-gray-900 block mb-0.5">🏢 Building Landmark</span>
                      <p className="text-gray-600">Mili Super Tower-2, prominently situated on Hajj Camp Road.</p>
                    </div>
                    <div className="p-3 bg-[#fdfbf7] rounded-xl border border-gray-200 text-xs">
                      <span className="font-bold text-gray-900 block mb-0.5">🕋 Ashkona Hajj Camp</span>
                      <p className="text-gray-600">Directly opposite the Hajj Camp entrance (3 mins walk).</p>
                    </div>
                    <div className="p-3 bg-[#fdfbf7] rounded-xl border border-gray-200 text-xs">
                      <span className="font-bold text-gray-900 block mb-0.5">✈️ Airport Proximity</span>
                      <p className="text-gray-600">Only 5 minutes drive from Dhaka Airport (DAC) Terminals 1 & 2.</p>
                    </div>
                  </div>

                  {/* Need Directions Callout */}
                  <div className="bg-gradient-to-r from-gold-50 to-amber-50/50 rounded-xl p-3 border border-gold-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-800">
                      <Phone className="w-4 h-4 text-gold-600 flex-shrink-0" />
                      <span>Need directions on the way? Call Front Desk: <a href="tel:+8801916944212" className="font-bold text-gray-900 hover:text-gold-600 underline">+880 1916-944212</a></span>
                    </div>
                    <a
                      href={getWhatsAppUrl("Hello Hotel Al Safa, I am on the way to Mili Super Tower-2. Please send road directions.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-50 px-3 py-1.5 rounded-lg font-bold transition flex-shrink-0"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      <span>WhatsApp Directions</span>
                    </a>
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
                    "Super convenient location right by the airport! The reception team welcomed us promptly even at our late night arrival, room was impeccably clean with crisp AC, and hot breakfast was ready early morning. Best transit stay in Dhaka.",
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
                  className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 bg-[length:200%_auto] hover:bg-right text-black font-bold px-8 py-3.5 rounded-full shadow-xl shadow-gold-500/20 hover:shadow-2xl hover:shadow-gold-500/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out text-sm sm:text-base"
                >
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-black group-hover:scale-110 transition-transform duration-300" />
                  <span>Book Your Room Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-black/80 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2.5 bg-[#141e33] hover:bg-[#1a2948] text-white font-semibold px-7 py-3.5 rounded-full border border-gray-700/80 hover:border-gold-400/60 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 ease-out text-sm sm:text-base"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Contact Front Desk</span>
                </Link>
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
