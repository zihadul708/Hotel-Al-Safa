"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Printer,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Plane,
  ArrowLeft,
  Share2,
  AlertCircle,
} from "lucide-react";

interface BookingVoucher {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestNidPassport: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  status: string;
  specialRequests: string | null;
  airportTransfer: boolean;
  extraBed: boolean;
  breakfast: boolean;
  promoCode: string | null;
  discountAmount: number;
  roomType: {
    name: string;
    category: string;
    bedType: string;
    isAc: boolean;
    sizeSqFt: number;
  };
  createdAt: string;
}

export default function BookingVoucherPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [booking, setBooking] = useState<BookingVoucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!code) return;
    fetch(`/api/bookings/code/${code}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Booking voucher not found or expired.");
        }
        return res.json();
      })
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load voucher.");
        setLoading(false);
      });
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white p-4">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-400 text-sm">Retrieving Official Booking Voucher...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-[#0e1626] border border-red-500/40 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold font-serif">Voucher Not Found</h2>
          <p className="text-sm text-gray-400">
            No active reservation exists for reference code <span className="font-mono text-gold-400">{code}</span>.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] py-8 px-4 sm:px-6 lg:px-8 text-white print:bg-white print:text-black print:p-0">
      {/* Top action bar - Hidden when printing */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Hotel Al Safa</span>
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold px-5 py-2.5 rounded-xl text-sm shadow-md transition hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Voucher</span>
          </button>
          <a
            href={`https://wa.me/8801916944212?text=Hello%20Hotel%20Al%20Safa,%20I%20am%20inquirying%20about%20my%20voucher%20${booking.bookingCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-sm px-4 py-2.5 rounded-xl font-semibold transition"
          >
            <span>WhatsApp Reception</span>
          </a>
        </div>
      </div>

      {/* Main Voucher Sheet */}
      <div className="max-w-3xl mx-auto bg-[#0b1220] border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Letterhead Header */}
        <div className="bg-gradient-to-r from-[#070c17] via-[#10192b] to-[#070c17] p-6 sm:p-8 border-b border-gray-800 print:bg-none print:border-b-2 print:border-black print:text-black">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-20 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Hotel Al Safa"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-white tracking-wide print:text-black">
                  HOTEL AL SAFA
                </h1>
                <p className="text-xs text-gold-400 tracking-wider uppercase font-semibold print:text-gray-700">
                  Luxury Transit & Suites • Ashkona, Dhaka
                </p>
                <p className="text-[11px] text-gray-400 print:text-gray-600 mt-0.5">
                  Opposite Ashkona Hajj Camp, 5 Mins to Dhaka Int&apos;l Airport
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 block print:text-gray-600">
                Official Booking Reference
              </span>
              <span className="text-2xl font-mono font-bold text-gold-400 print:text-black">
                {booking.bookingCode}
              </span>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    booking.paymentStatus === "PAID"
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-600 print:border-black print:text-black"
                      : "bg-amber-950 text-amber-300 border border-amber-600 print:border-black print:text-black"
                  }`}
                >
                  {booking.paymentStatus === "PAID"
                    ? "✓ PAID & CONFIRMED"
                    : "CONFIRMED • PAY AT HOTEL"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Guest & Reservation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-gray-800 print:border-gray-300">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 print:text-gray-800">
                Guest Information
              </h3>
              <p className="text-base font-bold text-white print:text-black">
                {booking.guestName}
              </p>
              <p className="text-xs text-gray-400 print:text-gray-700 mt-1">
                📞 {booking.guestPhone}
              </p>
              <p className="text-xs text-gray-400 print:text-gray-700">
                ✉️ {booking.guestEmail}
              </p>
              {booking.guestNidPassport && (
                <p className="text-xs text-gray-400 print:text-gray-700">
                  🪪 ID / Passport: {booking.guestNidPassport}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 print:text-gray-800">
                Stay Schedule
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-500 block print:text-gray-600">Check-in</span>
                  <span className="font-semibold text-white print:text-black">
                    {new Date(booking.checkIn).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[11px] text-gold-400 block print:text-gray-700">From 12:00 PM</span>
                </div>
                <div>
                  <span className="text-gray-500 block print:text-gray-600">Check-out</span>
                  <span className="font-semibold text-white print:text-black">
                    {new Date(booking.checkOut).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-[11px] text-gold-400 block print:text-gray-700">By 11:30 AM</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 print:text-gray-700 mt-2">
                Stay Duration: <span className="font-bold text-white print:text-black">{booking.nights} Night{booking.nights > 1 ? "s" : ""}</span> ({booking.adults} Adults{booking.children > 0 ? `, ${booking.children} Children` : ""})
              </p>
            </div>
          </div>

          {/* Reserved Accommodation Specs */}
          <div className="bg-[#0e1627] p-5 rounded-2xl border border-gray-800 print:bg-gray-100 print:border-gray-400">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2 print:text-gray-800">
              Accommodation Reserved
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h4 className="text-lg font-bold text-white print:text-black">
                  {booking.roomType?.name || "Hotel Room Reservation"}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 print:text-gray-700 mt-1">
                  <span>{booking.roomType?.bedType || "Standard Bed"}</span>
                  <span>•</span>
                  <span>{booking.roomType?.sizeSqFt || 240} sq. ft.</span>
                  <span>•</span>
                  <span>{booking.roomType?.isAc ? "Air Conditioned" : "Non-AC"}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block print:text-gray-600">Reservation Status</span>
                <span className="font-bold text-emerald-400 text-sm print:text-black">
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Charges & Invoicing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400 print:text-gray-800">
              Itemized Financial Summary
            </h3>
            <div className="bg-[#0e1627] p-4 rounded-xl border border-gray-800 space-y-2 text-xs print:bg-white print:border-gray-300">
              <div className="flex justify-between text-gray-300 print:text-black">
                <span>Room Charges ({booking.nights} night{booking.nights > 1 ? "s" : ""})</span>
                <span className="font-mono">৳{booking.totalAmount.toLocaleString()}</span>
              </div>
              {booking.extraBed && (
                <div className="flex justify-between text-gray-300 print:text-black">
                  <span>Extra Bed Setup</span>
                  <span className="font-mono">Included / ৳{(500 * booking.nights).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-gray-800 pt-2 flex justify-between text-base font-bold text-gold-400 print:text-black print:border-black">
                <span>Total Amount {booking.paymentStatus === "PAID" ? "Paid" : "Due at Check-in"}</span>
                <span>৳{booking.totalAmount.toLocaleString()} BDT</span>
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 print:text-gray-600">
                <span>Payment Method</span>
                <span className="font-semibold text-white print:text-black">{booking.paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Special Requests / Arrival Note */}
          {booking.specialRequests && (
            <div className="bg-[#0e1627] p-4 rounded-xl border border-gray-800 text-xs print:bg-gray-50 print:border-gray-300">
              <span className="font-bold text-gold-400 block mb-1 print:text-gray-800">
                Guest Arrival Notes:
              </span>
              <p className="text-gray-300 print:text-black italic">
                &ldquo;{booking.specialRequests}&rdquo;
              </p>
            </div>
          )}

          {/* Important Arrival Policies */}
          <div className="border-t border-gray-800 pt-4 text-xs text-gray-400 space-y-2 print:border-gray-300 print:text-gray-700">
            <h4 className="font-bold text-white print:text-black">Important Guest Guidelines:</h4>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li>Please present a valid National ID card or Passport upon check-in.</li>
              <li>Standard check-in time begins at 12:00 PM. Early check-in is subject to room availability.</li>
              <li>24/7 Front Desk is always available to assist with luggage and guest check-in.</li>
              <li>Reception & Reservations assistance: Please call +880 1916-944212 or WhatsApp 01916944212.</li>
            </ul>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gray-800/80 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-2 print:border-gray-400">
            <span>Hotel Al Safa • Mili Super Tower-2, Ashkona, Dhaka-1230</span>
            <span>Issued: {new Date(booking.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
