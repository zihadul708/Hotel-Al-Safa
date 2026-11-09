"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plane,
  Clock,
  Wifi,
  ShieldCheck,
  Zap,
  Flame,
  Luggage,
  Sparkles,
  Phone,
  Calendar,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";

export default function AmenitiesPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const facilities = [
    {
      title: "24/7 Airport Shuttle Service",
      subtitle: "5 Minutes to Dhaka International Airport",
      description:
        "We offer dedicated, punctual airport transfer vehicles covering Hazrat Shahjalal International Airport (Terminals 1, 2, and Domestic). Whether arriving at 3:00 AM or departing at dawn, our driver ensures timely transport.",
      icon: Plane,
      badge: "Transit Advantage",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "24-Hour Hot Water Geyser",
      subtitle: "Instant Rejuvenating Rain Showers",
      description:
        "Every guest room and executive suite features an en-suite bathroom with an independent high-recovery water geyser, ensuring soothing hot showers after exhausting long-haul international flights.",
      icon: Flame,
      badge: "All Rooms",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "100% Generator Power Backup",
      subtitle: "Zero-Downtime Uninterruptible Electricity",
      description:
        "Equipped with an automatic heavy-duty standby generator that switches on within seconds, ensuring your air conditioning, lighting, elevators, and gadget chargers never shut down during stay.",
      icon: Zap,
      badge: "Guaranteed Comfort",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "High-Speed Fiber Wi-Fi",
      subtitle: "High Bandwidth In Every Suite & Lounge",
      description:
        "Complimentary high-speed optical fiber internet designed for business executives to attend Zoom calls, check flight updates, stream movies, and stay connected with family back home.",
      icon: Wifi,
      badge: "Free Ultra-Speed",
      image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Secure Luggage Storage",
      subtitle: "Safe Holding for Layovers & Sightseeing",
      description:
        "Transit passengers with long flight connections can safely store their heavy luggage with our 24/7 security concierge while exploring Uttara, Airport shopping malls, or visiting central Dhaka.",
      icon: Luggage,
      badge: "Transit Convenience",
      image: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Pilgrim & Umrah Services",
      subtitle: "3 Mins Walk to Ashkona Hajj Camp",
      description:
        "Ideally situated directly opposite the Ashkona Hajj Camp. We provide spacious family accommodations, early morning wake-up calls, quiet prayer spaces, and special luggage handling for holy journeys.",
      icon: ShieldCheck,
      badge: "Pilgrim Friendly",
      image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <TopBar />
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 bg-[#090f1d] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=80"
              alt="Facilities at Hotel Al Safa"
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-[#090f1d]/75 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <span>Modern Comfort & Transit Convenience</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              Hotel Amenities & Guest Facilities
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Every detail at Hotel Al Safa is engineered for restful layovers, peace of mind, and effortless
              transit connections in Dhaka.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-lg hover:scale-105 transition"
              >
                Check Availability & Book
              </button>
            </div>
          </div>
        </section>

        {/* Facilities Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
              Guest Services
            </span>
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Designed For Your Ultimate Peace of Mind
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              From our punctual 24/7 airport pickup to soundproof suites and instant hot showers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-48 w-full bg-gray-900">
                      <Image src={f.image} alt={f.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 bg-[#0b1220]/90 text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold-500/40">
                        {f.badge}
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-lg text-gray-900">{f.title}</h3>
                        <span className="text-xs text-gold-600 font-semibold block">{f.subtitle}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Strategic Proximity Banner */}
        <section className="bg-[#0b1220] text-white py-14 px-4 border-t border-gray-800">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
              Strategic Gateway
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold">
              Unmatched Transit Proximity in Dhaka
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
              <div className="p-5 rounded-2xl bg-[#131d33] border border-gray-800 space-y-1">
                <span className="text-gold-400 text-2xl font-bold font-mono">5 Mins</span>
                <h4 className="text-white font-bold text-sm">Hazrat Shahjalal Int&apos;l Airport</h4>
                <p className="text-xs text-gray-400">Direct road connection without major city traffic delays.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#131d33] border border-gray-800 space-y-1">
                <span className="text-gold-400 text-2xl font-bold font-mono">3 Mins</span>
                <h4 className="text-white font-bold text-sm">Ashkona Hajj Camp</h4>
                <p className="text-xs text-gray-400">Walking distance for pilgrims completing registration & flights.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#131d33] border border-gray-800 space-y-1">
                <span className="text-gold-400 text-2xl font-bold font-mono">8 Mins</span>
                <h4 className="text-white font-bold text-sm">Dhaka Airport Railway Station</h4>
                <p className="text-xs text-gray-400">Direct train connections across Bangladesh (Chittagong, Sylhet).</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions onOpenBooking={() => setBookingModalOpen(true)} />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </div>
  );
}
