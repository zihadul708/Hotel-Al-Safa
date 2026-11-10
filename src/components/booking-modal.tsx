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
  Copy,
  Landmark,
  MessageCircle,
} from "lucide-react";
import { HOTEL_CONFIG } from "@/lib/hotel-config";

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
  const [paymentMethod, setPaymentMethod] = useState<"BKASH" | "NAGAD" | "BANK_TRANSFER" | "PAY_AT_HOTEL" | "CARD">("BKASH");
  const [senderAccount, setSenderAccount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };
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
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RoomOption[]) => {
        const safeData = Array.isArray(data) ? data : [];
        setRooms(safeData);
        if (selectedRoomSlug) {
          const match = safeData.find((r) => r.slug === selectedRoomSlug);
          if (match) setSelectedRoomId(match.id);
        } else if (safeData.length > 0 && !selectedRoomId) {
          setSelectedRoomId(safeData[0].id);
        }
      })
      .catch((err) => {
        console.error("Error loading rooms:", err);
        setRooms([]);
      });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (d: Date) => d.toISOString().split("T")[0];
    setCheckIn(initialCheckIn || formatDate(today));
    setCheckOut(initialCheckOut || formatDate(tomorrow));
  }, [selectedRoomSlug, initialCheckIn, initialCheckOut]);

  // Sync selected room when prop changes
  useEffect(() => {
    if (selectedRoomSlug && Array.isArray(rooms) && rooms.length > 0) {
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
  const currentRoom = Array.isArray(rooms) ? rooms.find((r) => r.id === selectedRoomId) : undefined;
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
      const paymentNoteParts: string[] = [];
      if (senderAccount.trim()) paymentNoteParts.push(`Sender: ${senderAccount.trim()}`);
      if (transactionId.trim()) paymentNoteParts.push(`TrxID/Ref: ${transactionId.trim()}`);
      if (specialRequests.trim()) paymentNoteParts.push(`Note: ${specialRequests.trim()}`);
      const combinedNotes = paymentNoteParts.length > 0 ? paymentNoteParts.join(" | ") : (specialRequests || null);

      const isPrepaid = paymentMethod !== "PAY_AT_HOTEL";

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
        paidAmount: isPrepaid ? grandTotal : 0,
        paymentStatus: isPrepaid ? "PAID" : "PENDING",
        paymentMethod,
        specialRequests: combinedNotes,
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
                  {Array.isArray(rooms) && rooms.map((room) => {
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

          {/* STEP 3: Payment Options & Method */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                  Choose Payment Method
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select your preferred method to complete or guarantee your reservation:
                </p>
              </div>

              {/* 5 Payment Methods */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* bKash */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("BKASH")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === "BKASH"
                      ? "border-[#E2136E] bg-[#E2136E]/15 shadow-md shadow-[#E2136E]/10"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                      bK
                    </span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "BKASH" ? "border-[#E2136E] bg-[#E2136E]" : "border-gray-600"
                    }`}>
                      {paymentMethod === "BKASH" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">bKash</div>
                    <div className="text-[11px] text-gray-400">Payment & Personal</div>
                  </div>
                </button>

                {/* Nagad */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("NAGAD")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === "NAGAD"
                      ? "border-[#F7941D] bg-[#F7941D]/15 shadow-md shadow-[#F7941D]/10"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-7 h-7 rounded-lg bg-[#F7941D] text-white flex items-center justify-center font-bold text-xs">
                      Ng
                    </span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "NAGAD" ? "border-[#F7941D] bg-[#F7941D]" : "border-gray-600"
                    }`}>
                      {paymentMethod === "NAGAD" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">Nagad</div>
                    <div className="text-[11px] text-gray-400">Personal (01615383839)</div>
                  </div>
                </button>

                {/* Bank Transfer (DBBL) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("BANK_TRANSFER")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === "BANK_TRANSFER"
                      ? "border-emerald-500 bg-emerald-500/15 shadow-md shadow-emerald-500/10"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      <Landmark className="w-4 h-4" />
                    </span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "BANK_TRANSFER" ? "border-emerald-500 bg-emerald-500" : "border-gray-600"
                    }`}>
                      {paymentMethod === "BANK_TRANSFER" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">DBBL Bank</div>
                    <div className="text-[11px] text-gray-400">Transfer / Deposit</div>
                  </div>
                </button>

                {/* Pay at Hotel */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === "PAY_AT_HOTEL"
                      ? "border-gold-500 bg-gold-500/15 shadow-md shadow-gold-500/10"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-7 h-7 rounded-lg bg-gold-600 text-black flex items-center justify-center font-bold text-xs">
                      ৳
                    </span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "PAY_AT_HOTEL" ? "border-gold-500 bg-gold-500" : "border-gray-600"
                    }`}>
                      {paymentMethod === "PAY_AT_HOTEL" && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">Pay on Arrival</div>
                    <div className="text-[11px] text-gray-400">Cash / Card at Desk</div>
                  </div>
                </button>

                {/* Cards (Visa/Master) */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CARD")}
                  className={`col-span-2 sm:col-span-1 p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                    paymentMethod === "CARD"
                      ? "border-blue-500 bg-blue-500/15 shadow-md shadow-blue-500/10"
                      : "border-gray-800 bg-[#121c31] hover:border-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <span className="w-7 h-7 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                      <CreditCard className="w-4 h-4" />
                    </span>
                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      paymentMethod === "CARD" ? "border-blue-500 bg-blue-500" : "border-gray-600"
                    }`}>
                      {paymentMethod === "CARD" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs sm:text-sm">Credit / Debit Card</div>
                    <div className="text-[11px] text-gray-400">Visa / Master / POS</div>
                  </div>
                </button>
              </div>

              {/* bKash Payment Details */}
              {paymentMethod === "BKASH" && (
                <div className="p-4 bg-[#E2136E]/10 border border-[#E2136E]/40 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#E2136E] font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Official bKash Payment Numbers</span>
                    </div>
                    <span className="text-[11px] text-gray-400">Instant verification</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: bKash Payment (Merchant) */}
                    <div className="bg-[#141f36] border border-gray-700/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#E2136E]/20 text-[#E2136E] border border-[#E2136E]/40">
                          bKash (Payment)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(HOTEL_CONFIG.payments.bkashMerchant.number, "bkash-merchant")}
                          className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 font-medium"
                        >
                          {copiedKey === "bkash-merchant" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-lg font-mono font-bold text-white tracking-wider">
                        {HOTEL_CONFIG.payments.bkashMerchant.number}
                      </div>
                      <div className="text-[11px] text-gray-300 space-y-0.5 border-t border-gray-700/60 pt-2">
                        <p>1. Open bKash App ➔ <strong className="text-white">Make Payment</strong></p>
                        <p>2. Enter Number: <strong className="text-gold-400 font-mono">01615383839</strong></p>
                        <p>3. Enter Amount: <strong className="text-gold-400">৳{grandTotal.toLocaleString()}</strong></p>
                        <p>4. Reference: <strong className="text-white">Al Safa</strong></p>
                      </div>
                    </div>

                    {/* Option 2: bKash (Personal) */}
                    <div className="bg-[#141f36] border border-gray-700/80 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                          bKash (Personal)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(HOTEL_CONFIG.payments.bkashPersonal.number, "bkash-personal")}
                          className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 font-medium"
                        >
                          {copiedKey === "bkash-personal" ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-lg font-mono font-bold text-white tracking-wider">
                        {HOTEL_CONFIG.payments.bkashPersonal.number}
                      </div>
                      <div className="text-[11px] text-gray-300 space-y-0.5 border-t border-gray-700/60 pt-2">
                        <p>1. Open bKash App ➔ <strong className="text-white">Send Money</strong></p>
                        <p>2. Enter Number: <strong className="text-gold-400 font-mono">01965900482</strong></p>
                        <p>3. Enter Amount: <strong className="text-gold-400">৳{grandTotal.toLocaleString()}</strong></p>
                        <p>4. Enter your PIN to confirm</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification fields */}
                  <div className="border-t border-[#E2136E]/30 pt-3">
                    <label className="block text-xs font-semibold text-gray-200 mb-1.5">
                      Payment Verification Details:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="tel"
                          placeholder="Your Sender bKash Number (e.g. 017XXXXXXXX)"
                          value={senderAccount}
                          onChange={(e) => setSenderAccount(e.target.value)}
                          className="w-full bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E2136E]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Transaction ID / TrxID (e.g. 9K48FA2B)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          className="w-full bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder:text-gray-500 focus:outline-none focus:border-[#E2136E]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Provide your sender bKash number and TrxID for swift voucher validation by our front desk.
                    </p>
                  </div>
                </div>
              )}

              {/* Nagad Payment Details */}
              {paymentMethod === "NAGAD" && (
                <div className="p-4 bg-[#F7941D]/10 border border-[#F7941D]/40 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#F7941D] font-bold text-sm">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Official Nagad Account</span>
                    </div>
                    <span className="text-[11px] text-gray-400">Postal digital wallet</span>
                  </div>

                  <div className="bg-[#141f36] border border-gray-700/80 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F7941D]/20 text-[#F7941D] border border-[#F7941D]/40">
                        Nagad (Personal)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(HOTEL_CONFIG.payments.nagadPersonal.number, "nagad")}
                        className="flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-300 font-medium"
                      >
                        {copiedKey === "nagad" ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-xl font-mono font-bold text-white tracking-wider">
                      {HOTEL_CONFIG.payments.nagadPersonal.number}
                    </div>
                    <div className="text-[11px] text-gray-300 space-y-0.5 border-t border-gray-700/60 pt-2">
                      <p>1. Open Nagad App or dial <strong className="text-gold-400 font-mono">*167#</strong></p>
                      <p>2. Select <strong className="text-white">Send Money</strong></p>
                      <p>3. Enter Number: <strong className="text-gold-400 font-mono">01615383839</strong></p>
                      <p>4. Enter Amount: <strong className="text-gold-400">৳{grandTotal.toLocaleString()}</strong></p>
                      <p>5. Reference: <strong className="text-white">Al Safa</strong></p>
                    </div>
                  </div>

                  {/* Verification fields */}
                  <div className="border-t border-[#F7941D]/30 pt-3">
                    <label className="block text-xs font-semibold text-gray-200 mb-1.5">
                      Payment Verification Details:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="tel"
                          placeholder="Your Sender Nagad Number (e.g. 01XXXXXXXXX)"
                          value={senderAccount}
                          onChange={(e) => setSenderAccount(e.target.value)}
                          className="w-full bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F7941D]"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Nagad Transaction ID / TrxID (e.g. 7H29BV3M)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          className="w-full bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder:text-gray-500 focus:outline-none focus:border-[#F7941D]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      Provide your sender Nagad number and TrxID for instant booking confirmation.
                    </p>
                  </div>
                </div>
              )}

              {/* Bank Transfer (Dutch-Bangla Bank Limited) */}
              {paymentMethod === "BANK_TRANSFER" && (
                <div className="p-4 bg-emerald-950/20 border border-emerald-500/40 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Landmark className="w-4 h-4" />
                      <span>Official DBBL Bank Account Details</span>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                      Payable at any Branch
                    </span>
                  </div>

                  {/* Official Cheque Leaf / Bank Box */}
                  <div className="bg-[#141f36] border border-emerald-500/30 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-700/60 pb-2">
                      <div className="text-xs text-gray-400">
                        Bank Name: <strong className="text-white">{HOTEL_CONFIG.payments.bank.bankName}</strong>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-medium">NPSB / BEFTN / NexusPay</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-400 block text-[11px]">Account Title / Name:</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-bold text-white font-mono tracking-wide">{HOTEL_CONFIG.payments.bank.accountName}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(HOTEL_CONFIG.payments.bank.accountName, "bank-name")}
                            className="text-gold-400 hover:text-gold-300 ml-2"
                          >
                            {copiedKey === "bank-name" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[11px]">Account Number:</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-bold text-gold-400 font-mono text-base tracking-wider">{HOTEL_CONFIG.payments.bank.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(HOTEL_CONFIG.payments.bank.accountNumber, "bank-acc")}
                            className="text-gold-400 hover:text-gold-300 ml-2"
                          >
                            {copiedKey === "bank-acc" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[11px]">Routing / Branch Code:</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className="font-bold text-white font-mono">{HOTEL_CONFIG.payments.bank.routingCode}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(HOTEL_CONFIG.payments.bank.routingCode, "bank-routing")}
                            className="text-gold-400 hover:text-gold-300 ml-2"
                          >
                            {copiedKey === "bank-routing" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-400 block text-[11px]">Branch:</span>
                        <span className="font-semibold text-white mt-0.5 block">{HOTEL_CONFIG.payments.bank.branch}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-700/60 pt-2 text-[11px] text-gray-300">
                      💡 <strong className="text-white">How to Transfer:</strong> Use your banking app (City Touch, EBL Skybeauty, NexusPay, etc.) via <strong className="text-gold-400">NPSB Instant Transfer</strong> or deposit cash at any DBBL branch counters nationwide.
                    </div>
                  </div>

                  {/* Verification fields */}
                  <div className="border-t border-emerald-500/30 pt-3">
                    <label className="block text-xs font-semibold text-gray-200 mb-1.5">
                      Deposit / Transfer Proof Details:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Depositor Name & Bank (e.g. Tanvir - City Touch)"
                          value={senderAccount}
                          onChange={(e) => setSenderAccount(e.target.value)}
                          className="w-full bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Deposit Slip / Transaction Ref / TrxID"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-[#141f36] border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">
                      You may also send a snapshot of your deposit slip to our official WhatsApp: <strong className="text-gold-400 font-mono">01916944212</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Pay at Hotel Reception */}
              {paymentMethod === "PAY_AT_HOTEL" && (
                <div className="p-4 bg-gold-950/20 border border-gold-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-gold-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-gold-400" />
                    <span>Pay at Hotel Al Safa Reception</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    No advance payment is required right now. You can settle the full amount (<strong>৳{grandTotal.toLocaleString()} BDT</strong>) in Cash or by Card during check-in at our front desk located at <strong>Mili Super Tower-2, Ashkona, Dhaka</strong>.
                  </p>
                  <div className="bg-[#141f36] p-3 rounded-xl border border-gray-700 text-[11px] text-gray-300 space-y-1">
                    <p>• Accepted currencies: BDT (Bangladeshi Taka), USD, SAR, AED, EUR, GBP, MYR.</p>
                    <p>• Credit/Debit card POS terminal is operational 24/7 at the reception.</p>
                    <p>• Free cancellation up to 24 hours prior to check-in.</p>
                  </div>
                </div>
              )}

              {/* Cards (Visa / Mastercard) */}
              {paymentMethod === "CARD" && (
                <div className="p-4 bg-blue-950/20 border border-blue-500/40 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>Card Payment (POS / Secure Checkout)</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    We accept all major local and international cards: <strong>Visa, MasterCard, American Express, UnionPay, and DBBL Nexus</strong>.
                  </p>
                  <div className="bg-[#141f36] p-3 rounded-xl border border-gray-700 text-[11px] text-gray-300 space-y-1">
                    <p>• You can tap/swipe your card at our front desk POS terminal on arrival.</p>
                    <p>• To pay online now via payment gateway link, click confirm and our desk will text you a secure payment link on WhatsApp (01916944212).</p>
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
                    <span className="text-white font-medium">
                      {confirmedBooking.paymentMethod === "BKASH"
                        ? "bKash (Mobile Wallet)"
                        : confirmedBooking.paymentMethod === "NAGAD"
                        ? "Nagad (Digital Wallet)"
                        : confirmedBooking.paymentMethod === "BANK_TRANSFER"
                        ? "DBBL Bank Transfer"
                        : confirmedBooking.paymentMethod === "CARD"
                        ? "Credit / Debit Card"
                        : "Pay on Arrival (Cash/POS)"}
                    </span>
                  </div>
                  {senderAccount && (
                    <div>
                      <span className="text-gray-500 block">Sender Account/No</span>
                      <span className="text-white font-medium font-mono">{senderAccount}</span>
                    </div>
                  )}
                  {transactionId && (
                    <div>
                      <span className="text-gray-500 block">TrxID / Reference</span>
                      <span className="text-gold-400 font-medium font-mono">{transactionId}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-800/80 pt-3 text-[11px] text-gray-400 space-y-1">
                  <p>📍 Location: Mili Super Tower-2, Ashkona, Airport Road, Dhaka-1230</p>
                  <p>📞 24/7 Front Desk: +880 1916-944212</p>
                  <p>✉️ Email: {HOTEL_CONFIG.email}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/8801916944212?text=${encodeURIComponent(
                    `Hello Hotel Al Safa, I have made a reservation!\n\nBooking Code: ${confirmedBooking.bookingCode}\nGuest Name: ${confirmedBooking.guestName}\nRoom: ${confirmedBooking.roomType?.name || ""}\nCheck-in: ${new Date(confirmedBooking.checkIn).toLocaleDateString()}\nTotal Amount: ৳${confirmedBooking.totalAmount}\nPayment Method: ${confirmedBooking.paymentMethod}${senderAccount ? `\nSender: ${senderAccount}` : ""}${transactionId ? `\nTrxID/Ref: ${transactionId}` : ""}\n\nPlease verify and confirm.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs px-5 py-2.5 rounded-xl font-bold shadow-md transition hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Voucher to WhatsApp</span>
                </a>
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
