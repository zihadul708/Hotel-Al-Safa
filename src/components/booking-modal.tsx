"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  X,
  Calendar,
  User,
  CreditCard,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Plane,
  Coffee,
  Bed,
  Sparkles,
  ChevronRight,
  Printer,
  Download,
  AlertCircle,
  Tag,
  Check,
  ExternalLink,
} from "lucide-react";

export interface RoomOption {
  id: string;
  slug: string;
  name: string;
  isAc: boolean;
  basePrice: number;
  capacity: number;
  bedType: string;
  images: string[];
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomSlug?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  selectedRoomSlug,
  initialCheckIn,
  initialCheckOut,
}: BookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [rooms, setRooms] = useState<RoomOption[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  // Dates
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Add-ons
  const [airportTransfer, setAirportTransfer] = useState(false);
  const [extraBed, setExtraBed] = useState(false);
  const [breakfast, setBreakfast] = useState(false);

  // Guest Details
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNid, setGuestNid] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"BKASH" | "NAGAD" | "CARD" | "PAY_AT_HOTEL">("BKASH");
  const [bkashNumber, setBkashNumber] = useState("");
  const [bkashPin, setBkashPin] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    discountAmount: number;
    message: string;
  } | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");

  // Load rooms and default dates
  useEffect(() => {
    fetch("/api/rooms")
      .then((res) => res.json())
      .then((data: RoomOption[]) => {
        setRooms(data);
        if (selectedRoomSlug) {
          const match = data.find((r) => r.slug === selectedRoomSlug);
          if (match) setSelectedRoomId(match.id);
        } else if (data.length > 0 && !selectedRoomId) {
          setSelectedRoomId(data[0].id);
        }
      })
      .catch((err) => console.error("Error loading rooms:", err));

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    setCheckIn(initialCheckIn || formatDate(today));
    setCheckOut(initialCheckOut || formatDate(tomorrow));
  }, [selectedRoomSlug, initialCheckIn, initialCheckOut]);

  // Sync selected room when prop changes
  useEffect(() => {
    if (selectedRoomSlug && rooms.length > 0) {
      const match = rooms.find((r) => r.slug === selectedRoomSlug);
      if (match) setSelectedRoomId(match.id);
    }
  }, [selectedRoomSlug, rooms]);

  if (!isOpen) return null;

  // Nights calculation
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1;
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const currentRoom = rooms.find((r) => r.id === selectedRoomId);
  const baseRate = currentRoom ? currentRoom.basePrice : 3500;
  const roomCost = baseRate * nights;

  // Add-ons prices (BDT)
  const airportCost = airportTransfer ? 1200 : 0;
  const extraBedCost = extraBed ? 500 * nights : 0;
  const breakfastCost = breakfast ? 450 * (adults + children) * nights : 0;
  const addOnsTotal = airportCost + extraBedCost + breakfastCost;

  // 5% Service Tax & Surcharge
  const subtotal = roomCost + addOnsTotal;
  const discountAmount = appliedPromo ? appliedPromo.discountAmount : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05);
  const grandTotal = taxableAmount + taxAmount;

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: promoCodeInput.trim(),
          nights,
          baseAmount: subtotal,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setPromoError(data.message || "Invalid coupon code.");
        setAppliedPromo(null);
      } else {
        setAppliedPromo({
          code: data.code,
          discountAmount: data.discountAmount,
          message: data.message,
        });
      }
    } catch {
      setPromoError("Failed to validate promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoError("");
  };

  const handleNextStep1 = () => {
    setErrorMsg("");
    if (!selectedRoomId) {
      setErrorMsg("Please select a room type.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg("Check-out date must be after Check-in date.");
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = () => {
    setErrorMsg("");
    if (!guestName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!guestPhone.trim()) {
      setErrorMsg("Please enter your valid phone number.");
      return;
    }
    setStep(3);
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const payload = {
        roomTypeId: selectedRoomId,
        guestName,
        guestEmail: guestEmail || "guest@hotelalsafabd.com",
        guestPhone,
        guestNidPassport: guestNid || null,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        nights,
        adults,
        children,
        totalAmount: grandTotal,
        paidAmount: paymentMethod === "PAY_AT_HOTEL" ? 0 : grandTotal,
        paymentStatus: paymentMethod === "PAY_AT_HOTEL" ? "PENDING" : "PAID",
        paymentMethod,
        specialRequests,
        airportTransfer,
        extraBed,
        breakfast,
        promoCode: appliedPromo?.code || null,
        discountAmount,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to complete reservation. Please try again.");
      }

      const booking = await res.json();
      setConfirmedBooking(booking);
      setStep(4);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-[#0e1626] border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden text-white my-8">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#070c17] via-[#111a2d] to-[#070c17] px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-14">
              <Image
                src="/logo.png"
                alt="Hotel Al Safa"
                fill
                className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
                HOTEL AL SAFA DIRECT RESERVATION
              </h2>
              <p className="text-[11px] text-gold-400">
                Guaranteed Best Rate • Instant Confirmation • 24/7 Concierge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Indicator */}
        {step < 4 && (
          <div className="bg-[#090e1a] px-6 py-3 border-b border-gray-800 flex justify-between items-center text-xs">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-gold-400 font-semibold" : "text-gray-500"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? "bg-gold-500 text-black font-bold" : "bg-gray-800 text-gray-400"}`}>
                1
              </span>
              <span>Select Room & Dates</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-gold-400 font-semibold" : "text-gray-500"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? "bg-gold-500 text-black font-bold" : "bg-gray-800 text-gray-400"}`}>
                2
              </span>
              <span>Guest Information</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <div className={`flex items-center gap-2 ${step >= 3 ? "text-gold-400 font-semibold" : "text-gray-500"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? "bg-gold-500 text-black font-bold" : "bg-gray-800 text-gray-400"}`}>
                3
              </span>
              <span>Payment & Confirm</span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Room & Dates */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Date selection grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Check-in Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Check-out Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Counts */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Adults (Ages 12+)
                  </label>
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Adult{num > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Children (Under 12)
                  </label>
                  <select
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} Children
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Selection Carousel / List */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Select Room Category
                </label>
                <div className="space-y-3">
                  {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                          isSelected
                            ? "border-gold-500 bg-gold-500/10 shadow-lg shadow-gold-500/10"
                            : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-gold-400 bg-gold-400 text-black" : "border-gray-600"
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white text-sm sm:text-base">{room.name}</h4>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                room.isAc ? "bg-cyan-950 text-cyan-300 border border-cyan-800" : "bg-gray-800 text-gray-300"
                              }`}>
                                {room.isAc ? "AC" : "Non-AC"}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {room.bedType} • Max {room.capacity} Guests
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 border-gray-800 pt-2 sm:pt-0">
                          <span className="text-gold-400 font-bold text-lg">৳{room.basePrice.toLocaleString()}</span>
                          <span className="text-xs text-gray-400"> / night</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons Checklist */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Enhance Your Stay (Optional Add-ons)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between text-xs transition ${
                      airportTransfer
                        ? "border-gold-500 bg-gold-500/10 text-white"
                        : "border-gray-800 bg-[#121c31] text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Plane className={`w-4 h-4 ${airportTransfer ? "text-gold-400" : "text-gray-500"}`} />
                      <input
                        type="checkbox"
                        checked={airportTransfer}
                        onChange={(e) => setAirportTransfer(e.target.checked)}
                        className="rounded accent-gold-500"
                      />
                    </div>
                    <span className="font-semibold text-white">Airport Shuttle</span>
                    <span className="text-[11px] text-gold-400 font-medium">+৳1,200 (One-way)</span>
                  </label>

                  <label
                    className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between text-xs transition ${
                      extraBed
                        ? "border-gold-500 bg-gold-500/10 text-white"
                        : "border-gray-800 bg-[#121c31] text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Bed className={`w-4 h-4 ${extraBed ? "text-gold-400" : "text-gray-500"}`} />
                      <input
                        type="checkbox"
                        checked={extraBed}
                        onChange={(e) => setExtraBed(e.target.checked)}
                        className="rounded accent-gold-500"
                      />
                    </div>
                    <span className="font-semibold text-white">Extra Floor Bed</span>
                    <span className="text-[11px] text-gold-400 font-medium">+৳500 / night</span>
                  </label>

                  <label
                    className={`cursor-pointer p-3 rounded-xl border flex flex-col justify-between text-xs transition ${
                      breakfast
                        ? "border-gold-500 bg-gold-500/10 text-white"
                        : "border-gray-800 bg-[#121c31] text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Coffee className={`w-4 h-4 ${breakfast ? "text-gold-400" : "text-gray-500"}`} />
                      <input
                        type="checkbox"
                        checked={breakfast}
                        onChange={(e) => setBreakfast(e.target.checked)}
                        className="rounded accent-gold-500"
                      />
                    </div>
                    <span className="font-semibold text-white">Buffet Breakfast</span>
                    <span className="text-[11px] text-gold-400 font-medium">+৳450 / person</span>
                  </label>
                </div>
              </div>

              {/* Price Summary Bar */}
              <div className="bg-[#0b1222] p-4 rounded-xl border border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm">
                  <span className="text-gray-400">{nights} Night{nights > 1 ? "s" : ""} Stay • Total Estimated:</span>
                  <div className="text-xl font-bold text-gold-400">
                    ৳{grandTotal.toLocaleString()}{" "}
                    <span className="text-xs text-gray-400 font-normal">(Incl. taxes & service charge)</span>
                  </div>
                </div>
                <button
                  onClick={handleNextStep1}
                  className="w-full sm:w-auto bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-500 text-black font-bold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <span>Continue to Guest Info</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Guest Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammad Tanvir"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Phone / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+880 1711-XXXXXX"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                    NID or Passport Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="For expedited check-in"
                    value={guestNid}
                    onChange={(e) => setGuestNid(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                  Flight Details / Special Requests
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Arriving on Biman Bangladesh Flight BG-042 at 7:00 PM. Please arrange airport pickup."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#141f36] border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <div className="bg-[#0b1222] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2"
                >
                  ← Back to Selection
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2"
                >
                  <span>Select Payment Method</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options & Simulation */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                Choose Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* bKash */}
                <div
                  onClick={() => setPaymentMethod("BKASH")}
                  className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between ${
                    paymentMethod === "BKASH"
                      ? "border-[#E2136E] bg-[#E2136E]/15 shadow-md"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                      bK
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">bKash Payment</div>
                      <div className="text-xs text-gray-400">Direct mobile wallet checkout</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "BKASH"}
                    onChange={() => setPaymentMethod("BKASH")}
                    className="accent-[#E2136E]"
                  />
                </div>

                {/* Nagad */}
                <div
                  onClick={() => setPaymentMethod("NAGAD")}
                  className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between ${
                    paymentMethod === "NAGAD"
                      ? "border-[#F7941D] bg-[#F7941D]/15 shadow-md"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-[#F7941D] text-white flex items-center justify-center font-bold text-xs">
                      Ng
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm">Nagad Payment</div>
                      <div className="text-xs text-gray-400">Postal digital wallet PGW</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "NAGAD"}
                    onChange={() => setPaymentMethod("NAGAD")}
                    className="accent-[#F7941D]"
                  />
                </div>

                {/* Visa / Master / SSLCommerz */}
                <div
                  onClick={() => setPaymentMethod("CARD")}
                  className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between ${
                    paymentMethod === "CARD"
                      ? "border-blue-500 bg-blue-500/15 shadow-md"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Cards (Visa / Master)</div>
                      <div className="text-xs text-gray-400">SSLCommerz / Stripe gateway</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "CARD"}
                    onChange={() => setPaymentMethod("CARD")}
                    className="accent-blue-500"
                  />
                </div>

                {/* Pay at Hotel */}
                <div
                  onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                  className={`cursor-pointer p-4 rounded-xl border transition flex items-center justify-between ${
                    paymentMethod === "PAY_AT_HOTEL"
                      ? "border-emerald-500 bg-emerald-500/15 shadow-md"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      ৳
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Pay on Arrival (Cash)</div>
                      <div className="text-xs text-gray-400">Pay cash/card during check-in</div>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "PAY_AT_HOTEL"}
                    onChange={() => setPaymentMethod("PAY_AT_HOTEL")}
                    className="accent-emerald-500"
                  />
                </div>
              </div>

              {/* bKash Simulated Prompt */}
              {paymentMethod === "BKASH" && (
                <div className="p-4 bg-[#E2136E]/10 border border-[#E2136E]/40 rounded-xl space-y-3">
                  <div className="flex items-center gap-2 text-[#E2136E] font-bold text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>bKash Instant Gateway Simulation</span>
                  </div>
                  <p className="text-xs text-gray-300">
                    Enter your bKash personal wallet number to simulate instant tokenized checkout verification:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                    <input
                      type="password"
                      placeholder="PIN (Simulated e.g. 12345)"
                      value={bkashPin}
                      onChange={(e) => setBkashPin(e.target.value)}
                      className="bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Promo Code Box */}
              <div className="bg-[#0b1222] p-3.5 rounded-xl border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
                    <Tag className="w-3.5 h-3.5 text-gold-400" />
                    <span>Have a Promo / Voucher Code?</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Try: <span className="text-gold-400 font-mono">ALSAFA10</span> (10% off) or{" "}
                    <span className="text-gold-400 font-mono">TRANSIT500</span>
                  </span>
                </div>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-950/40 border border-emerald-600/50 rounded-lg px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>{appliedPromo.message}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-gray-400 hover:text-red-400 text-[11px] underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code (e.g. ALSAFA10)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#141f36] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-gold-500"
                    />
                    <button
                      type="button"
                      disabled={promoLoading || !promoCodeInput.trim()}
                      onClick={handleApplyPromo}
                      className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-black text-xs font-bold px-4 py-1.5 rounded-lg transition"
                    >
                      {promoLoading ? "Applying..." : "Apply"}
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[11px] text-red-400 mt-1.5">{promoError}</p>
                )}
              </div>

              {/* Order breakdown */}
              <div className="bg-[#0b1222] p-4 rounded-xl border border-gray-800 space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>{currentRoom?.name} ({nights} Night{nights > 1 ? "s" : ""})</span>
                  <span>৳{roomCost.toLocaleString()}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Selected Add-ons (Shuttle, Bed, Breakfast)</span>
                    <span>৳{addOnsTotal.toLocaleString()}</span>
                  </div>
                )}
                {appliedPromo && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span>Promo Discount ({appliedPromo.code})</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400">
                  <span>Govt. VAT & Hotel Service Surcharge (5%)</span>
                  <span>৳{taxAmount.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-base text-gold-400">
                  <span>Grand Total to Pay</span>
                  <span>৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-gray-400 hover:text-white text-sm font-medium px-4 py-2"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-8 py-3 rounded-xl transition flex items-center gap-2 shadow-lg shadow-gold-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Processing Reservation...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>
                        {paymentMethod === "PAY_AT_HOTEL"
                          ? "Confirm Reservation (Pay at Hotel)"
                          : `Pay ৳${grandTotal.toLocaleString()} & Confirm`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Celebratory Confirmation */}
          {step === 4 && confirmedBooking && (
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-white">
                  Reservation Confirmed!
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Thank you, <span className="text-white font-semibold">{confirmedBooking.guestName}</span>. Your room at Hotel Al Safa is secured.
                </p>
              </div>

              {/* Voucher Box */}
              <div className="bg-[#0b1220] border border-gold-500/40 rounded-2xl p-6 text-left max-w-lg mx-auto shadow-xl space-y-4">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest block">
                      Booking Reference Code
                    </span>
                    <span className="text-xl font-mono font-bold text-gold-400">
                      {confirmedBooking.bookingCode}
                    </span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold">
                    {confirmedBooking.paymentStatus === "PAID" ? "PAID & GUARANTEED" : "CONFIRMED (PAY ON ARRIVAL)"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500 block">Room Category</span>
                    <span className="text-white font-medium">{confirmedBooking.roomType?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Duration</span>
                    <span className="text-white font-medium">
                      {nights} Night{nights > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Check-in</span>
                    <span className="text-white font-medium">
                      {new Date(confirmedBooking.checkIn).toLocaleDateString()} (From 12:00 PM)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Check-out</span>
                    <span className="text-white font-medium">
                      {new Date(confirmedBooking.checkOut).toLocaleDateString()} (By 11:30 AM)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Total Amount</span>
                    <span className="text-gold-400 font-bold text-sm">
                      ৳{confirmedBooking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Payment Method</span>
                    <span className="text-white font-medium">{confirmedBooking.paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-gray-800/80 pt-3 text-[11px] text-gray-400 space-y-1">
                  <p>📍 Location: Haji Komoruddin Tower, Ashkona, Airport Road, Dhaka-1230</p>
                  <p>📞 24/7 Front Desk: +880 1894-782070</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/booking/${confirmedBooking.bookingCode}`}
                  target="_blank"
                  className="flex items-center gap-2 bg-[#1a263d] hover:bg-[#223252] text-gold-300 text-xs px-5 py-2.5 rounded-xl border border-gold-500/40 font-semibold transition"
                >
                  <ExternalLink className="w-4 h-4 text-gold-400" />
                  <span>View Official Web Voucher</span>
                </Link>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white text-xs px-5 py-2.5 rounded-xl border border-gray-700 transition"
                >
                  <Printer className="w-4 h-4 text-gold-400" />
                  <span>Print Voucher</span>
                </button>
                <a
                  href={`https://wa.me/8801894782070?text=Hello%20Hotel%20Al%20Safa,%20I%20have%20confirmed%20booking%20${confirmedBooking.bookingCode}%20for%20${confirmedBooking.guestName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  <span>Notify via WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold px-6 py-2.5 rounded-xl transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
