"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  Bed,
  CheckCircle,
  Wifi,
  Tv,
  Coffee,
  Sparkles,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Calendar,
  SlidersHorizontal,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";
import { RoomDetailModal } from "@/components/room-detail-modal";
import { FadeIn, StaggerGroup, StaggerItem } from "@/components/animations";
import { RoomTypeData } from "@/app/page";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [acFilter, setAcFilter] = useState<"ALL" | "AC" | "NON_AC">("ALL");
  const [sortBy, setSortBy] = useState<"DEFAULT" | "PRICE_ASC" | "PRICE_DESC">("DEFAULT");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomSlug, setSelectedRoomSlug] = useState<string | undefined>(undefined);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailRoom, setDetailRoom] = useState<RoomTypeData | null>(null);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RoomTypeData[]) => {
        setRooms(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch rooms:", err);
        setRooms([]);
        setLoading(false);
      });
  }, []);

  const filteredRooms = useMemo(() => {
    const safeRooms = Array.isArray(rooms) ? rooms : [];
    return safeRooms
      .filter((r) => {
        if (selectedCategory !== "ALL") {
          const name = r.name?.toUpperCase() || "";
          const target = selectedCategory.toUpperCase();
          if (target === "DELUXE" && !r.isAc) return false;
          if (target === "ECONOMY" && r.isAc) return false;
          if (target === "COUPLE" && !name.includes("COUPLE")) return false;
          if (target === "TWIN" && !name.includes("TWIN")) return false;
          if (target === "FAMILY" && !name.includes("FAMILY")) return false;
          if (target === "SINGLE" && !name.includes("SINGLE")) return false;
        }
        if (acFilter === "AC" && !r.isAc) return false;
        if (acFilter === "NON_AC" && r.isAc) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = r.name?.toLowerCase().includes(q);
          const matchesDesc = r.description?.toLowerCase().includes(q);
          const matchesBed = r.bedType?.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesBed) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "PRICE_ASC") return a.basePrice - b.basePrice;
        if (sortBy === "PRICE_DESC") return b.basePrice - a.basePrice;
        return 0;
      });
  }, [rooms, selectedCategory, acFilter, sortBy, searchQuery]);

  const handleOpenBooking = (roomSlug?: string) => {
    setSelectedRoomSlug(roomSlug);
    setBookingModalOpen(true);
  };

  const handleOpenDetail = (room: RoomTypeData) => {
    setDetailRoom(room);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <TopBar />
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="relative py-16 sm:py-24 bg-[#090f1d] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=2000&q=80"
              alt="Rooms at Hotel Al Safa"
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-[#090f1d]/70 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <span>Dhaka Airport Transit & Pilgrim Suites</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              Our Luxury Rooms & Suites
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Discover soundproof transit suites designed for deep rest. Featuring split air-conditioning,
              high-speed fiber Wi-Fi, 24/7 hot water geysers, and authentic hospitality.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="bg-white border-b border-gray-200 sticky top-[73px] z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {[
                  { label: "All Rooms", value: "ALL" },
                  { label: "Deluxe (AC)", value: "DELUXE" },
                  { label: "Economy (Non-AC)", value: "ECONOMY" },
                  { label: "Couple", value: "COUPLE" },
                  { label: "Twin", value: "TWIN" },
                  { label: "Family", value: "FAMILY" },
                  { label: "Single", value: "SINGLE" },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition ${
                      selectedCategory === cat.value
                        ? "bg-[#0b111e] text-gold-400 shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Right Filter Controls: AC Filter, Search, Sort */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search suites, bed types..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-56 pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* AC Toggle */}
                <select
                  value={acFilter}
                  onChange={(e) => setAcFilter(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 font-medium focus:outline-none focus:border-gold-500"
                >
                  <option value="ALL">All Climate</option>
                  <option value="AC">AC Only</option>
                  <option value="NON_AC">Non-AC Economy</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 font-medium focus:outline-none focus:border-gold-500"
                >
                  <option value="DEFAULT">Recommended</option>
                  <option value="PRICE_ASC">Price: Low to High</option>
                  <option value="PRICE_DESC">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Room Catalog Grid */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          {loading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading Hotel Al Safa suites...</p>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 p-8 max-w-md mx-auto space-y-3">
              <SlidersHorizontal className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900">No rooms match your criteria</h3>
              <p className="text-xs text-gray-500">
                Try resetting your filters or clearing your search keywords.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("ALL");
                  setAcFilter("ALL");
                  setSearchQuery("");
                }}
                className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => {
                const mainImage = (Array.isArray(room.images) && room.images[0]) || "https://images.unsplash.com/photo-1590490360182-c33d57733427";

                return (
                  <div
                    key={room.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Preview Container */}
                      <div className="relative h-64 w-full overflow-hidden bg-gray-900">
                        <Image
                          src={mainImage}
                          alt={room.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Climate Badge */}
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
                        <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-xl border border-gold-500/40">
                          <span className="text-base font-bold text-gold-400">
                            ৳{room.basePrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-300"> / night</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-gold-600 transition-colors">
                            {room.name}
                          </h3>
                        </div>

                        {/* Key Specs */}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 py-1 border-y border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-gold-600" />
                            <span>Up to {room.capacity} Guests</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-gold-600" />
                            <span>{room.bedType}</span>
                          </div>
                          <span>•</span>
                          <span>{room.sizeSqFt} sq. ft.</span>
                        </div>

                        {/* Short Description */}
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {room.description}
                        </p>

                        {/* Amenity Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-medium border border-amber-200/60"
                            >
                              ✓ {amenity}
                            </span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="text-[11px] text-gray-400 py-0.5">
                              +{room.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      <Link
                        href={`/rooms/${room.slug}`}
                        className="w-full text-center py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-black transition"
                      >
                        Full Details
                      </Link>
                      <button
                        onClick={() => handleOpenBooking(room.slug)}
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-black font-bold text-xs py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Online</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
      <FloatingActions onOpenBooking={() => handleOpenBooking()} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoomSlug={selectedRoomSlug}
      />

      {/* Room Detail Lightbox */}
      <RoomDetailModal
        room={detailRoom}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        onBookNow={(slug) => {
          setDetailModalOpen(false);
          handleOpenBooking(slug);
        }}
      />
    </div>
  );
}
