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
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Navigation,
  Plane,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";

export default function ContactPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Airport Shuttle Inquiry");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg("Please fill in your name, phone number, and inquiry message.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || "guest@hotelalsafabd.com",
          subject,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to deliver your message. Please try calling directly.");
      }

      setSuccess(true);
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How far is Hotel Al Safa from Hazrat Shahjalal International Airport (DAC)?",
      a: "We are located just 5 minutes (approx. 2.1 km) from Dhaka Airport Terminal 1 & 2 via Airport-Ashkona Road, allowing quick arrivals without entering congested central Dhaka traffic.",
    },
    {
      q: "Do you offer airport pick-up for midnight or delayed flights?",
      a: "Yes! Our 24/7 dedicated airport shuttle operates around the clock. When making your direct reservation, tick the 'Airport Shuttle' add-on and mention your flight number. Our driver will track your flight and meet you right at the arrival terminal.",
    },
    {
      q: "What payment methods are supported for reservations?",
      a: "We accept bKash, Nagad, Visa, Mastercard, SSLCommerz, and Pay at Hotel (Cash on Arrival at reception).",
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
                href="tel:+8801894782070"
                className="text-base font-bold text-gray-900 hover:text-gold-600 transition block"
              >
                +880 1894-782070
              </a>
              <p className="text-xs text-gray-500">Also reachable: +880 1711-000000</p>
            </div>

            {/* WhatsApp */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 border border-[#25D366]/40 flex items-center justify-center text-[#25D366] mb-3">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold block">
                Instant Chat
              </span>
              <a
                href="https://wa.me/8801894782070?text=Hello%20Hotel%20Al%20Safa,%20I%20have%20an%20inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-gray-900 hover:text-[#25D366] transition block"
              >
                WhatsApp Direct
              </a>
              <p className="text-xs text-gray-500">Live replies for flight & room queries</p>
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
                href="mailto:info@hotelalsafabd.com"
                className="text-sm font-bold text-gray-900 hover:text-gold-600 transition block break-all"
              >
                info@hotelalsafabd.com
              </a>
              <p className="text-xs text-gray-500">Corporate & group booking proposals</p>
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
                Haji Komoruddin Tower, Ashkona, Airport Road, Dhaka-1230
              </p>
              <p className="text-xs text-gold-600 font-medium">Opposite Ashkona Hajj Camp</p>
            </div>
          </div>
        </section>

        {/* Form & Map Section */}
        <section className="py-8 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Interactive Inquiry Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
                  Send a Message
                </span>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                  Guest Inquiries & Assistance
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  We reply within 15–30 minutes during transit hours.
                </p>
              </div>

              {success ? (
                <div className="p-6 bg-emerald-50 border border-emerald-300 rounded-2xl text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 font-serif">Message Delivered!</h3>
                  <p className="text-xs text-emerald-700">
                    Thank you. Our front desk concierge has received your inquiry and will contact your phone or WhatsApp shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2 rounded-xl transition"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Farhan Chowdhury"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-gold-500"
                      >
                        <option value="Airport Shuttle Inquiry">Airport Shuttle Pick-up</option>
                        <option value="Room Availability & Rates">Room Rates & Availability</option>
                        <option value="Hajj / Umrah Group Stay">Hajj / Umrah Group Stay</option>
                        <option value="Corporate / Long Transit">Corporate / Long Transit</option>
                        <option value="Other Assistance">Other Assistance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Your Message / Flight Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Please include your expected arrival date, flight number if applicable, or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3.5 text-xs text-gray-900 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-black font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Submitting Inquiry..." : "Submit Message to Front Desk"}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Map & Transit Route Guide */}
            <div className="space-y-6">
              {/* Google Map Embed */}
              <div className="bg-white p-3 rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden">
                  <iframe
                    title="Hotel Al Safa Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.529759367341!2d90.40794411135246!3d23.853099984687642!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c69cc8eb1107%3A0xb3a82dfdfae002d2!2sAshkona%20Hajj%20Camp!5e0!3m2!1sen!2sbd!4v1714500000000!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
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
                      Exit Airport Roundabout towards Ashkona Hajj Camp Road. Our hotel is located at Haji Komoruddin Tower on the main road.
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
                      Take a direct rickshaw or taxi via Kawlar-Ashkona connecting link directly to Haji Komoruddin Tower.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                Quick answers regarding bookings, airport shuttle, and policies.
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
