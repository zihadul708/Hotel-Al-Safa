"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Bed,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Wifi,
  Tv,
  Coffee,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Maximize2,
  Share2,
  AlertCircle,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";
import { RoomTypeData } from "@/app/page";

export default function RoomDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [room, setRoom] = useState<RoomTypeData | null>(null);
  const [allRooms, setAllRooms] = useState<RoomTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => (res.ok ? res.json() : []))
      .then((rooms: RoomTypeData[]) => {
        const safeRooms = Array.isArray(rooms) ? rooms : [];
        setAllRooms(safeRooms);
        const match = safeRooms.find((r) => r.slug === slug);
        if (match) {
          setRoom(match);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load room details:", err);
        setAllRooms([]);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <TopBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 text-sm">Loading suite presentation...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col">
        <TopBar />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-serif font-bold text-gray-900">Room Not Found</h1>
          <p className="text-gray-600 text-sm max-w-md">
            The requested accommodation category does not exist or has been updated.
          </p>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse All Suites</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const otherRooms = allRooms.filter((r) => r.slug !== slug).slice(0, 3);
  const currentImages = Array.isArray(room.images) && room.images.length > 0 ? room.images : ["https://images.unsplash.com/photo-1590490360182-c33d57733427"];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <TopBar />
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Breadcrumb & Navigation Header */}
        <div className="bg-[#0b1220] text-gray-400 py-3 px-4 border-b border-gray-800 text-xs">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <Link href="/" className="hover:text-gold-400 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <Link href="/rooms" className="hover:text-gold-400 transition">
              Rooms & Suites
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-gold-400 font-medium">{room.name}</span>
          </div>
        </div>

        {/* Room Header Banner */}
        <section className="bg-[#0e1627] text-white py-8 px-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    room.isAc
                      ? "bg-cyan-950 text-cyan-300 border border-cyan-700"
                      : "bg-gray-800 text-gray-300 border border-gray-700"
                  }`}
                >
                  {room.isAc ? "Air Conditioned" : "Economy Non-AC"}
                </span>
                <span className="text-xs text-gold-400 font-semibold uppercase tracking-wider">
                  {room.category} Category
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                {room.name}
              </h1>
            </div>

            <div className="text-left md:text-right bg-[#141e33] p-4 rounded-2xl border border-gray-700/80">
              <span className="text-xs text-gray-400 block uppercase tracking-wider">Nightly Base Rate</span>
              <div className="text-2xl sm:text-3xl font-bold text-gold-400">
                ৳{room.basePrice.toLocaleString()}{" "}
                <span className="text-xs text-gray-400 font-normal">/ night (BDT)</span>
              </div>
              <span className="text-[11px] text-gray-400">Taxes calculated at checkout</span>
            </div>
          </div>
        </section>

        {/* Main Content & Gallery */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 Columns: Gallery, Overview, Specifications, Amenities */}
            <div className="lg:col-span-2 space-y-8">
              {/* Photo Gallery Lightbox / Carousel */}
              <div className="space-y-3">
                {/* Main Selected Image */}
                <div className="relative h-72 sm:h-96 md:h-[450px] w-full rounded-2xl overflow-hidden bg-gray-900 shadow-xl border border-gray-200">
                  <Image
                    src={currentImages[activeImageIndex] || currentImages[0]}
                    alt={room.name}
                    fill
                    className="object-cover transition-all duration-500"
                    priority
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20">
                    Photo {activeImageIndex + 1} of {currentImages.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {currentImages.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {currentImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative h-20 w-28 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                          activeImageIndex === idx
                            ? "border-gold-500 ring-2 ring-gold-500/50 scale-105"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={img} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Specs Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="border-r last:border-r-0 border-gray-100">
                  <Users className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 uppercase block">Max Occupancy</span>
                  <span className="text-sm font-bold text-gray-900">{room.capacity} Guests</span>
                </div>
                <div className="border-r last:border-r-0 border-gray-100">
                  <Bed className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 uppercase block">Bed Setup</span>
                  <span className="text-sm font-bold text-gray-900">{room.bedType}</span>
                </div>
                <div className="border-r last:border-r-0 border-gray-100">
                  <Maximize2 className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 uppercase block">Room Space</span>
                  <span className="text-sm font-bold text-gray-900">{room.sizeSqFt} sq. ft.</span>
                </div>
                <div>
                  <ShieldCheck className="w-5 h-5 text-gold-600 mx-auto mb-1.5" />
                  <span className="text-[11px] text-gray-500 uppercase block">Climate</span>
                  <span className="text-sm font-bold text-gray-900">
                    {room.isAc ? "Split AC" : "Natural Airflow"}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-100 pb-3">
                  About This Accommodation
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {room.description}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Located within minutes of Hazrat Shahjalal International Airport and Ashkona Hajj Camp,
                  this suite offers rapid check-in, peaceful sound isolation, 24-hour room service, and
                  reliable backup electricity.
                </p>
              </div>

              {/* Complimentary Amenities Matrix */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Included Amenities & In-Room Facilities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {room.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-200/50 text-xs sm:text-sm text-gray-800"
                    >
                      <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hotel Policies & Airport Convenience */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                <h2 className="text-xl font-serif font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Check-in Guidelines & Hotel Policies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 block">Check-in Schedule</span>
                    <p>Check-in starts from 12:00 PM. 24-hour reception accommodates midnight and flight delays.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 block">Check-out Schedule</span>
                    <p>Standard check-out is by 11:30 AM. Late check-out subject to room availability.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 block">24/7 Front Desk</span>
                    <p>Reception is open 24 hours to assist with check-in, queries, and luggage assistance.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-gray-900 block">Payment Options</span>
                    <p>Accepts bKash, Nagad, Visa, Mastercard, and Cash on Arrival at the front desk.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Booking Reservation Card */}
            <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
              <div className="bg-[#0b1220] text-white p-6 rounded-3xl border border-gold-500/40 shadow-2xl space-y-5">
                <div>
                  <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold block">
                    Direct Best Rate Guarantee
                  </span>
                  <div className="text-3xl font-bold text-white mt-1">
                    ৳{room.basePrice.toLocaleString()}{" "}
                    <span className="text-xs text-gray-400 font-normal">/ night</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-4 space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Free high-speed fiber Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>24/7 Hot water geyser & generator backup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>No hidden cancellation fees</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-gold-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve This Room Online</span>
                </button>

                <a
                  href={`https://wa.me/8801916944212?text=Hello%20Hotel%20Al%20Safa,%20I%20am%20interested%20in%20reserving%20the%20${encodeURIComponent(room.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold py-2.5 rounded-xl text-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire on WhatsApp (01916944212)</span>
                </a>

                <div className="border-t border-gray-800/80 pt-3 text-center text-[11px] text-gray-400">
                  <span>Front Desk Direct: </span>
                  <a href="tel:+8801916944212" className="text-gold-400 font-medium hover:underline">
                    +880 1916-944212
                  </a>
                </div>
              </div>

              {/* Location Card */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-gray-900">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <span>Prime Transit Proximity</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Mili Super Tower-2, Ashkona, Airport Road, Dhaka-1230.
                </p>
                <div className="pt-1 flex gap-2">
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                    ✈️ 5 Mins to Airport
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                    🕋 3 Mins to Hajj Camp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Suites Recommendations */}
        {otherRooms.length > 0 && (
          <section className="bg-[#f2ede4] py-14 px-4 border-t border-gray-200">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">
                    Alternative Accommodations
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">
                    Explore Other Suites
                  </h3>
                </div>
                <Link
                  href="/rooms"
                  className="text-xs font-bold text-gold-700 hover:text-gold-800 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherRooms.map((alt) => (
                  <div
                    key={alt.id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full bg-gray-900">
                      <Image
                        src={(Array.isArray(alt.images) && alt.images[0]) || "https://images.unsplash.com/photo-1590490360182-c33d57733427"}
                        alt={alt.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-gold-400 font-bold text-xs px-2.5 py-1 rounded-lg">
                        ৳{alt.basePrice.toLocaleString()} / night
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-base text-gray-900">{alt.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{alt.description}</p>
                      <Link
                        href={`/rooms/${alt.slug}`}
                        className="inline-block pt-1 text-xs font-bold text-gold-600 hover:text-gold-700"
                      >
                        View Suite Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingActions onOpenBooking={() => setBookingModalOpen(true)} />

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedRoomSlug={room.slug}
      />
    </div>
  );
}
