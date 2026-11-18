"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  Clock,
  CreditCard,
  UserCheck,
  AlertCircle,
  HelpCircle,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";
import { HOTEL_CONFIG, getWhatsAppUrl } from "@/lib/hotel-config";

export default function TermsPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const waUrl = getWhatsAppUrl("Hello Hotel Al Safa, I have an inquiry regarding hotel terms and booking policies.");

  const sections = [
    {
      id: "general",
      title: "1. Acceptance of Terms",
      icon: FileText,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Welcome to <strong>Hotel Al Safa</strong> (operated at Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230). By booking a room, checking in at our property, or utilizing our website and online reservation services, you agree to comply with and be bound by these Terms and Conditions, alongside Bangladesh applicable laws and hotel hospitality guidelines.
          </p>
          <p>
            If you do not agree with any portion of these terms, please contact our 24/7 front desk team before making a reservation or completing your check-in.
          </p>
        </div>
      ),
    },
    {
      id: "id-requirement",
      title: "2. DMP Section-27 & Guest Identification Requirements",
      icon: UserCheck,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            In strict compliance with <strong>Dhaka Metropolitan Police (DMP) Section-27</strong> guest registration regulations and Bangladesh government security mandates, all guests staying at Hotel Al Safa must provide authentic official identification at the time of check-in:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li>
              <strong>Bangladeshi Citizens:</strong> Original National Identity Card (Smart NID or laminated NID), or a valid Bangladeshi Passport, or Birth Registration Certificate (for minors under 18 accompanied by parents/legal guardians).
            </li>
            <li>
              <strong>International Guests & Transit Passengers:</strong> Original Passport along with a valid Bangladesh visa or arrival stamp.
            </li>
            <li>
              <strong>Digital Registration:</strong> Room keys and check-in clearance will only be issued upon completion of the mandatory police guest registration form and identity verification at the front desk.
            </li>
          </ul>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              Failure to present government-authorized photo identification will result in denial of check-in with no liability on Hotel Al Safa.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "checkin-checkout",
      title: "3. Check-In & Check-Out Timings",
      icon: Clock,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase tracking-wider text-gold-600 font-bold block mb-1">
                Standard Check-In
              </span>
              <p className="text-lg font-serif font-bold text-gray-900">12:00 PM (Noon)</p>
              <p className="text-xs text-gray-500 mt-1">24/7 Front desk available for late arrivals & flight delays</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs uppercase tracking-wider text-gold-600 font-bold block mb-1">
                Standard Check-Out
              </span>
              <p className="text-lg font-serif font-bold text-gray-900">11:00 AM</p>
              <p className="text-xs text-gray-500 mt-1">Express check-out and luggage storage available</p>
            </div>
          </div>
          <p>
            <strong>Early Check-in & Late Check-out:</strong> Subject to room availability. Complimentary luggage cloakroom is available for transit passengers awaiting outbound flights or departures. Late check-out beyond 2:00 PM may incur a half-day or full-day room charge depending on occupancy.
          </p>
        </div>
      ),
    },
    {
      id: "pricing-payment",
      title: "4. Pricing, Currency & Official Payment Accounts",
      icon: CreditCard,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            All room rates are quoted in <strong>Bangladeshi Taka (BDT / ৳)</strong> and are transparent with no hidden booking fees.
          </p>
          <p>
            Payments may be settled via our official verified channels:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-pink-50/60 border border-pink-200 rounded-lg text-xs">
              <strong className="text-pink-700 block">bKash Official Accounts:</strong>
              <span>Merchant Payment: 01615383839</span><br />
              <span>Personal Send Money: 01965900482</span>
            </div>
            <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-lg text-xs">
              <strong className="text-orange-700 block">Nagad Official Account:</strong>
              <span>Personal Send Money: 01615383839</span>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs sm:col-span-2">
              <strong className="text-emerald-800 block">Dutch-Bangla Bank Limited (DBBL):</strong>
              <span>Account Name: HOTEL-AL-SAFA (INT.) ABASIK</span><br />
              <span>Account No: 2021100017423 • Routing: 090260205</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Cash on Arrival ("Pay at Hotel") is also accepted at the front desk upon arrival. Always verify account numbers matching the official details published on our website before sending payment.
          </p>
        </div>
      ),
    },
    {
      id: "cancellation",
      title: "5. Cancellation & Modification Policy",
      icon: AlertCircle,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li>
              <strong>Free Cancellation:</strong> Bookings canceled at least 24 hours prior to the scheduled check-in date are eligible for full refund or free date rescheduling.
            </li>
            <li>
              <strong>Late Cancellation & No-Show:</strong> Cancellations made within 24 hours of scheduled arrival or failure to arrive ("No Show") may be subject to a one-night room charge.
            </li>
            <li>
              <strong>Flight Delays & Transit Changes:</strong> In cases of airline delays or rescheduled international flights, please notify our front desk via phone or WhatsApp immediately; we gladly adjust your check-in timings without penalty.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "house-rules",
      title: "6. Guest Conduct & Hotel House Rules",
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Hotel Al Safa is dedicated to maintaining a peaceful, respectful, family and pilgrim-friendly environment for all international transit guests and travelers.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
            <li>
              <strong>Couples & Families:</strong> Couples checking in together must provide legal proof of marriage or valid identification in accordance with prevailing local laws and regulations.
            </li>
            <li>
              <strong>100% Drug & Alcohol-Free Property:</strong> Possession or consumption of alcohol, illegal narcotics, or hazardous substances is strictly forbidden on the entire premises. Violations will be reported immediately to law enforcement.
            </li>
            <li>
              <strong>Smoking Policy:</strong> Smoking is strictly prohibited inside non-smoking guest rooms and indoor common corridors to maintain fresh air and prevent fire hazards.
            </li>
            <li>
              <strong>Quiet Hours:</strong> Between 11:00 PM and 7:00 AM, guests are requested to keep noise to a minimum in guest corridors to respect resting transit passengers and pilgrims.
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: "liability",
      title: "7. Luggage, Valuables & Liability",
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Hotel Al Safa provides secure premises with 24/7 CCTV surveillance in common areas. However, guests are responsible for safeguarding their money, jewelry, electronics, and valuable items inside guest rooms. The hotel management cannot be held liable for loss or damage of personal belongings left unattended.
          </p>
          <p>
            Any deliberate damage caused to hotel furniture, fixtures, linen, or electronic equipment will be charged to the registered guest upon check-out.
          </p>
        </div>
      ),
    },
    {
      id: "contact",
      title: "8. Inquiries & Legal Contact",
      icon: HelpCircle,
      content: (
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            If you have questions regarding our terms, group booking arrangements, or need special assistance, please reach out to our management team:
          </p>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-600" />
              <span><strong>Hotel Al Safa</strong> — Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold-600" />
              <span>Direct Phone: <a href="tel:+8801916944212" className="text-blue-600 font-semibold">+880 1916-944212</a></span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-gold-600" />
              <span>WhatsApp: <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold">+880 1916-944212</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold-600" />
              <span>Email: <a href="mailto:hotelalsafainternational1@gmail.com" className="text-blue-600 font-semibold">hotelalsafainternational1@gmail.com</a></span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] text-gray-900 font-sans selection:bg-gold-400 selection:text-black">
      <TopBar />
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 bg-[#070d18] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80"
              alt="Hotel Al Safa Background"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070d18] via-[#070d18]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-400/15 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Official Guest Policies & Guidelines</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
              Terms & Conditions
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Transparent, professional, and compliant with Bangladesh hotel hospitality standards and Dhaka Metropolitan Police regulations.
            </p>
            <div className="pt-2 text-xs text-gray-400 flex items-center justify-center gap-2">
              <Link href="/" className="hover:text-gold-400">Home</Link>
              <span>/</span>
              <span className="text-gold-400">Terms & Conditions</span>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4">
          {/* Quick Notice Banner */}
          <div className="mb-10 p-5 rounded-2xl bg-white border border-gold-400/40 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-600 flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-gray-900 text-sm">
                  Direct & Secure Booking Guarantee
                </h4>
                <p className="text-xs text-gray-500">
                  Last updated: November 2026 • Effective for all guests at Hotel Al Safa Dhaka
                </p>
              </div>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-2 rounded-xl font-semibold shadow-sm transition flex-shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask Front Desk</span>
            </a>
          </div>

          {/* Policy Blocks */}
          <div className="space-y-6">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.id}
                  id={sec.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200/90 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 pb-3 mb-4 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-xl bg-gold-400/15 text-gold-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-gray-900">
                      {sec.title}
                    </h2>
                  </div>
                  <div>{sec.content}</div>
                </div>
              );
            })}
          </div>

          {/* Need Assistance Bottom Box */}
          <div className="mt-12 bg-gradient-to-br from-[#0b1220] to-[#142038] text-white rounded-2xl p-6 sm:p-8 border border-gold-500/30 shadow-xl text-center space-y-4">
            <h3 className="text-xl sm:text-2xl font-serif font-bold">
              Have Questions About Your Stay?
            </h3>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Our front desk is available 24 hours a day to assist transit guests, pilgrims, and flight passengers.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${HOTEL_CONFIG.phonePrimary}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md hover:from-gold-400 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call {HOTEL_CONFIG.phoneDisplay}</span>
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <button
                onClick={() => setBookingModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition"
              >
                <span>Check Rates & Book Room</span>
                <ChevronRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <FloatingActions onOpenBooking={() => setBookingModalOpen(true)} />

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
