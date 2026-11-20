"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ChevronDown,
  Navigation,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";

export default function ContactPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Guest Inquiry Form State
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquirySubject, setInquirySubject] = useState("Airport Shuttle & Transit Stay");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setInquiryError("");
    setInquirySuccess(false);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inquiryName,
          email: inquiryEmail,
          phone: inquiryPhone,
          subject: inquirySubject,
          message: inquiryMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setInquirySuccess(true);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
      setInquiryMessage("");
    } catch (err: any) {
      setInquiryError(err.message || "Failed to submit message.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How far is Hotel Al Safa from Hazrat Shahjalal International Airport (DAC)?",
      a: "We are located just 5 minutes (approx. 2.1 km) from Dhaka Airport Terminal 1 & 2 via Airport-Ashkona Road, allowing quick arrivals without entering congested central Dhaka traffic.",
    },
    {
      q: "Is the front desk open 24/7 for late-night arrivals?",
      a: "Yes! Our reception is staffed 24 hours a day, 7 days a week. Midnight arrivals and delayed flights are welcomed warmly at any hour.",
    },
    {
      q: "What payment methods are supported for reservations?",
      a: "We accept bKash (Payment: 01615383839, Personal: 01965900482), Nagad (Personal: 01615383839), Dutch-Bangla Bank Limited (DBBL Account: 2021100017423), Cards (Visa / Mastercard), and Pay at Hotel (Cash on Arrival at front desk).",
    },
    {
      q: "What are your standard check-in and check-out timings?",
      a: "Standard check-in begins at 12:00 PM and check-out is by 11:30 AM. Because we specialize in transit passengers, our 24-hour front desk is always open to welcome late-night arrivals.",
    },
    {
      q: "How close is the hotel to Ashkona Hajj Camp?",
      a: "Hotel Al Safa is situated directly opposite Ashkona Hajj Camp, less than a 3-minute walking distance, making it the top choice for pilgrims and Umrah groups.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <TopBar />
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="relative py-20 bg-[#090f1d] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
              alt="Hotel Al Safa Location"
              fill
              className="object-cover opacity-25"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-[#090f1d]/75 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <span>24/7 Concierge & Front Desk Assistance</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              Contact Us & Location Guide
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Have questions about your upcoming flight transit, room availability, or group pilgrim booking?
              Our reception desk is open 24 hours a day.
            </p>
          </div>
        </section>

        {/* Contact Information Cards Strip */}
        <section className="py-12 px-4 max-w-7xl mx-auto -mt-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Phone */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-3">
                <Phone className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block">
                24/7 Calling Desk
              </span>
              <a
                href="tel:+8801916944212"
                className="text-base font-bold text-gray-900 hover:text-gold-600 transition block"
              >
                +880 1916-944212
              </a>
              <p className="text-xs text-gray-500">Direct Front Desk & Flight Updates</p>
            </div>

            {/* Official WhatsApp */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mb-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block">
                Instant Chat
              </span>
              <a
                href="https://wa.me/8801916944212?text=Hello%20Hotel%20Al%20Safa,%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-gray-900 hover:text-[#25D366] transition block"
              >
                01916944212
              </a>
              <p className="text-xs text-gray-500">Official Hotel Al Safa WhatsApp</p>
            </div>

            {/* Email */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-3">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block">
                Official Inquiries
              </span>
              <a
                href="mailto:hotelalsafainternational1@gmail.com"
                className="text-xs font-bold text-gray-900 hover:text-gold-600 transition block break-all"
              >
                hotelalsafainternational1@gmail.com
              </a>
              <p className="text-xs text-gray-500">Direct hotel reservations & proposals</p>
            </div>

            {/* Address */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/40 flex items-center justify-center text-gold-600 mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block">
                Physical Location
              </span>
              <p className="text-xs font-bold text-gray-900 leading-snug">
                Mili Super Tower-2, Ashkona, Airport Road, Dhaka-1230
              </p>
              <p className="text-xs text-gold-600 font-medium">Opposite Ashkona Hajj Camp</p>
            </div>
          </div>
        </section>

        {/* Direct Contact & Map Section */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Direct Front Desk & Reservation Hub */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
                  24/7 Front Desk Services
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                  Connect Directly With Us
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                  For immediate room reservations, rate inquiries, or assistance, reach our 24/7 front desk team directly via phone, WhatsApp, or email.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href="https://wa.me/8801916944212?text=Hello%20Hotel%20Al%20Safa,%20I%20would%20like%20to%20inquire%20about%20room%20availability"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold p-4 rounded-2xl flex items-center justify-between shadow-md transition transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">Instant Chat</div>
                      <div className="text-sm font-bold">WhatsApp: 01916944212</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">Chat Now →</span>
                </a>

                <a
                  href="tel:+8801916944212"
                  className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold p-4 rounded-2xl flex items-center justify-between shadow-md transition transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div className="text-left">
                      <div className="text-xs uppercase tracking-wider text-black/70 font-semibold">24-Hour Hotline</div>
                      <div className="text-sm font-bold">+880 1916-944212</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold bg-black/10 px-3 py-1 rounded-full">Call Desk →</span>
                </a>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full bg-[#0b1220] hover:bg-[#121c31] text-gold-400 border border-gold-500/40 font-bold p-4 rounded-2xl flex items-center justify-between shadow-md transition transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gold-400" />
                    <div className="text-left">
                      <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Instant Reservation</div>
                      <div className="text-sm font-bold text-white">Book a Room Online</div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-gold-500 text-black px-3 py-1 rounded-full">Book Now →</span>
                </button>
              </div>

              {/* Front Desk Information Highlights */}
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                  Hotel Policies & Services:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <span className="font-bold text-gray-900 block">Check-in / Check-out</span>
                    <p>Check-in: 12:00 PM onwards</p>
                    <p>Check-out: By 11:30 AM</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
                    <span className="font-bold text-gray-900 block">Accepted Payments</span>
                    <p>bKash, Nagad, DBBL Bank,</p>
                    <p>Cards & Cash at Reception</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Map & Transit Route Guide */}
            <div className="space-y-6">
              {/* Google Map Embed */}
              <div className="bg-white p-3 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden">
                  <iframe
                    title="Hotel Al Safa International Location Map"
                    src="https://maps.google.com/maps?q=23.8516087,90.4145012+(Hotel+Al+Safa+International)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <a
                    href="https://maps.app.goo.gl/4MH89QCucKXE5hHv5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-3 left-3 bg-[#070d18]/90 hover:bg-[#070d18] transition-all backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-gold-400/40 text-xs shadow-lg flex items-center gap-2 cursor-pointer hover:border-gold-400"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-semibold text-gold-300">Open in Google Maps</span>
                  </a>
                </div>
              </div>

              {/* Transit Directions Guide */}
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-gold-600" />
                  <span>How to Reach Hotel Al Safa</span>
                </h3>

                <div className="space-y-3 text-xs text-gray-600">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block">✈️ From Hazrat Shahjalal Airport (5 Mins)</span>
                    <p className="mt-0.5">
                      Exit Airport Roundabout towards Ashkona Hajj Camp Road. Our hotel is located at Mili Super Tower-2 on the main road.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block">🕋 From Ashkona Hajj Camp (3 Mins Walk)</span>
                    <p className="mt-0.5">
                      Cross the road directly opposite the main Hajj Camp gates. We are visible on the second commercial block.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-900 block">🚆 From Airport Railway Station (8 Mins)</span>
                    <p className="mt-0.5">
                      Take a direct rickshaw or taxi via Kawlar-Ashkona connecting link directly to Mili Super Tower-2.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Guest Inquiry & Flight Message Section */}
        <section className="py-12 px-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
                Online Front Desk Messaging
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
                Send an Inquiry or Flight Detail
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                Provide your flight number, late arrival schedule, or room requirements. Our front desk saves your message directly to our system and will respond promptly.
              </p>
            </div>

            {inquirySuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-emerald-900 text-lg">Inquiry Received Successfully!</h3>
                <p className="text-xs sm:text-sm text-emerald-700 max-w-md mx-auto">
                  Thank you! Your message has been saved to our reservations desk. Our 24/7 staff will connect with you via WhatsApp or phone shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setInquirySuccess(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {inquiryError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{inquiryError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1711-XXXXXX"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="guest@example.com"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                      Inquiry Subject
                    </label>
                    <select
                      value={inquirySubject}
                      onChange={(e) => setInquirySubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 bg-white"
                    >
                      <option value="Airport Shuttle & Transit Stay">Airport Shuttle & Transit Stay</option>
                      <option value="Late Night / Early Morning Check-In">Late Night / Early Morning Check-In</option>
                      <option value="Family / Hajj Pilgrim Group Booking">Family / Hajj Pilgrim Group Booking</option>
                      <option value="Room Rates & Special Discount">Room Rates & Special Discount</option>
                      <option value="Other Assistance">Other Assistance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Your Message / Flight Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Enter flight number, arrival time, room requirements or any questions..."
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500/50 resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-black font-bold text-sm shadow-md transition disabled:opacity-50"
                  >
                    {inquirySubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message to Front Desk</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-[#f2ede4] border-t border-gray-200 px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-700 font-bold">
                Got Questions?
              </span>
              <h2 className="text-3xl font-serif font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Quick answers regarding bookings, check-in, and payment policies.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 hover:text-gold-600 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        openFaq === idx ? "rotate-180 text-gold-600" : ""
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
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
