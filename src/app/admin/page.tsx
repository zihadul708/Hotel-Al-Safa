"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Bed,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  Edit2,
  Trash2,
  AlertCircle,
  Eye,
  Check,
  X,
  Download,
  Lock,
  Unlock,
  MessageSquare,
  Send,
  ShieldAlert,
} from "lucide-react";

interface AdminBooking {
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
  promoCode?: string | null;
  discountAmount?: number;
  roomType: {
    id: string;
    name: string;
    category: string;
    isAc: boolean;
    basePrice: number;
  };
  createdAt: string;
}

interface RoomItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  isAc: boolean;
  basePrice: number;
  capacity: number;
  availableUnits: number;
}

interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  // Staff Auth Gate (Session based)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<"BOOKINGS" | "ROOMS" | "INQUIRIES">("BOOKINGS");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  // Quick Room Price Edit state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [updatingPrice, setUpdatingPrice] = useState(false);

  // Walk-in Guest Modal
  const [walkInModalOpen, setWalkInModalOpen] = useState(false);
  const [walkInName, setWalkInName] = useState("");
  const [walkInPhone, setWalkInPhone] = useState("");
  const [walkInEmail, setWalkInEmail] = useState("");
  const [walkInRoomId, setWalkInRoomId] = useState("");
  const [walkInCheckIn, setWalkInCheckIn] = useState("");
  const [walkInCheckOut, setWalkInCheckOut] = useState("");
  const [walkInPaymentMethod, setWalkInPaymentMethod] = useState("PAY_AT_HOTEL");
  const [walkInPaymentStatus, setWalkInPaymentStatus] = useState("PAID");
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);
  const [walkInError, setWalkInError] = useState("");

  // Check auth on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem("alsafa_staff_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 or 2026
    if (pinInput === "1234" || pinInput === "2026") {
      sessionStorage.setItem("alsafa_staff_auth", "true");
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid Staff PIN code. (Default PIN: 1234)");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("alsafa_staff_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resBookings, resRooms, resInquiries] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/rooms"),
        fetch("/api/inquiries"),
      ]);

      const dataBookings = resBookings.ok ? await resBookings.json() : [];
      const dataRooms = resRooms.ok ? await resRooms.json() : [];
      const dataInquiries = resInquiries.ok ? await resInquiries.json() : [];

      setBookings(Array.isArray(dataBookings) ? dataBookings : []);
      setRooms(Array.isArray(dataRooms) ? dataRooms : []);
      setInquiries(Array.isArray(dataInquiries) ? dataInquiries : []);

      if (Array.isArray(dataRooms) && dataRooms.length > 0 && !walkInRoomId) {
        setWalkInRoomId(dataRooms[0].id);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setWalkInCheckIn(today.toISOString().split("T")[0]);
      setWalkInCheckOut(tomorrow.toISOString().split("T")[0]);
    }
  }, [isAuthenticated]);

  // Update Booking Status
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  // Update Booking Payment Status
  const handleUpdatePaymentStatus = async (id: string, newPayStatus: string) => {
    try {
      const b = bookings.find((item) => item.id === id);
      const paidAmount = newPayStatus === "PAID" ? (b ? b.totalAmount : 0) : 0;

      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newPayStatus, paidAmount }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, paymentStatus: newPayStatus, paidAmount } : item
          )
        );
      }
    } catch (err) {
      console.error("Payment status update error:", err);
    }
  };

  // Save Room Price Edit
  const handleSavePrice = async (roomId: string) => {
    setUpdatingPrice(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: roomId, basePrice: newPrice }),
      });
      if (res.ok) {
        setRooms((prev) =>
          prev.map((r) => (r.id === roomId ? { ...r, basePrice: newPrice } : r))
        );
        setEditingRoomId(null);
      }
    } catch (err) {
      console.error("Room price save error:", err);
    } finally {
      setUpdatingPrice(false);
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
        );
      }
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm("Are you sure you want to delete this guest inquiry?")) return;
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInquiries((prev) => prev.filter((inq) => inq.id !== inquiryId));
      }
    } catch (err) {
      console.error("Failed to delete inquiry:", err);
    }
  };

  // Walk-in Booking Submission
  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInError("");

    if (!walkInName.trim() || !walkInPhone.trim() || !walkInRoomId) {
      setWalkInError("Name, phone number, and room type are required.");
      return;
    }

    const diffDays = Math.max(
      1,
      Math.ceil(
        (new Date(walkInCheckOut).getTime() - new Date(walkInCheckIn).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    );

    const targetRoom = rooms.find((r) => r.id === walkInRoomId);
    const roomCost = targetRoom ? targetRoom.basePrice * diffDays : 3500;
    const tax = Math.round(roomCost * 0.05);
    const totalAmount = roomCost + tax;

    setWalkInSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTypeId: walkInRoomId,
          guestName: walkInName.trim(),
          guestPhone: walkInPhone.trim(),
          guestEmail: walkInEmail.trim() || "walkin@hotelalsafabd.com",
          checkIn: new Date(walkInCheckIn).toISOString(),
          checkOut: new Date(walkInCheckOut).toISOString(),
          nights: diffDays,
          adults: targetRoom?.capacity || 2,
          children: 0,
          totalAmount,
          paidAmount: walkInPaymentStatus === "PAID" ? totalAmount : 0,
          paymentStatus: walkInPaymentStatus,
          paymentMethod: walkInPaymentMethod,
          status: "CHECKED_IN",
          specialRequests: "Front-desk registered walk-in guest.",
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to create reservation.");
      }

      setWalkInModalOpen(false);
      setWalkInName("");
      setWalkInPhone("");
      setWalkInEmail("");
      fetchDashboardData();
    } catch (err: any) {
      setWalkInError(err.message || "Failed to create walk-in reservation.");
    } finally {
      setWalkInSubmitting(false);
    }
  };

  // CSV Export Function
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      alert("No reservation records available to export.");
      return;
    }

    const headers = [
      "Booking Reference",
      "Guest Name",
      "Phone",
      "Email",
      "Room Category",
      "Check-In",
      "Check-Out",
      "Nights",
      "Total Amount (BDT)",
      "Paid Amount (BDT)",
      "Payment Status",
      "Payment Gateway",
      "Reservation Status",
      "Shuttle",
      "Special Requests",
      "Created At",
    ];

    const rows = bookings.map((b) => [
      b.bookingCode,
      `"${b.guestName.replace(/"/g, '""')}"`,
      `"${b.guestPhone}"`,
      `"${b.guestEmail}"`,
      `"${b.roomType?.name || "Suite"}"`,
      new Date(b.checkIn).toLocaleDateString(),
      new Date(b.checkOut).toLocaleDateString(),
      b.nights,
      b.totalAmount,
      b.paidAmount,
      b.paymentStatus,
      b.paymentMethod,
      b.status,
      b.airportTransfer ? "Yes" : "No",
      `"${(b.specialRequests || "").replace(/"/g, '""')}"`,
      new Date(b.createdAt).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `hotel-al-safa-reservations-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPIs
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "PAID")
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const activeCheckIns = bookings.filter((b) => b.status === "CHECKED_IN").length;
  const confirmedReservations = bookings.filter((b) => b.status === "CONFIRMED").length;

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "ALL" ? true : b.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      b.bookingCode.toLowerCase().includes(query) ||
      b.guestName.toLowerCase().includes(query) ||
      b.guestPhone.toLowerCase().includes(query) ||
      b.roomType?.name.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070c17] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-[#0e1627] border border-gold-500/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center">
          <div className="relative h-14 w-20 mx-auto">
            <Image
              src="/logo.png"
              alt="Hotel Al Safa"
              fill
              className="object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              HOTEL AL SAFA
            </h1>
            <p className="text-xs text-gold-400 uppercase tracking-widest font-semibold mt-1">
              Front Desk Staff Security Access
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                <span>Enter Staff PIN Code</span>
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Enter PIN (Default: 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest text-white focus:outline-none focus:border-gold-500 font-mono"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-lg border border-red-800 text-center">
                {pinError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold py-3 rounded-xl transition text-sm shadow-md"
            >
              Unlock Staff Portal
            </button>
          </form>

          <div className="pt-2 border-t border-gray-800 text-center">
            <Link href="/" className="text-xs text-gray-500 hover:text-gold-400 transition">
              ← Return to Guest Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070c17] text-gray-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#0b1220] border-b border-gray-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-14">
              <Image
                src="/logo.png"
                alt="Hotel Al Safa"
                fill
                className="object-contain drop-shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
              />
            </div>
            <div>
              <span className="font-serif font-bold text-white text-lg tracking-wide block">
                HOTEL AL SAFA
              </span>
              <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-widest">
                Front Desk & Management Portal
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setWalkInModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold text-xs px-4 py-2 rounded-lg shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Walk-in Booking</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#141f36] hover:bg-[#1a2948] text-gray-300 text-xs px-3.5 py-2 rounded-lg border border-gray-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-gold-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 bg-[#141f36] hover:bg-[#1a2948] text-gray-300 text-xs px-3.5 py-2 rounded-lg border border-gray-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-gold-400" : ""}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs px-3.5 py-2 rounded-lg border border-gold-500/30 transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            title="Lock Portal"
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI OVERVIEW METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-[#0d1627] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Collected Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
                ৳
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              ৳{totalRevenue.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>Direct bKash, Nagad & verified bookings</span>
            </p>
          </div>

          {/* Card 2: Active Stays */}
          <div className="bg-[#0d1627] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Currently In-House</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{activeCheckIns} Rooms</div>
            <p className="text-[11px] text-gray-400 mt-1">Checked-in transit guests</p>
          </div>

          {/* Card 3: Upcoming Check-ins */}
          <div className="bg-[#0d1627] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Confirmed Arrivals</span>
              <div className="w-8 h-8 rounded-lg bg-gold-400/15 text-gold-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{confirmedReservations} Bookings</div>
            <p className="text-[11px] text-gold-400/90 mt-1">Awaiting arrival & check-in</p>
          </div>

          {/* Card 4: Guest Inquiries */}
          <div className="bg-[#0d1627] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Guest Inquiries</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{inquiries.length} Messages</div>
            <p className="text-[11px] text-gray-400 mt-1">Shuttle & stay inquiries</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          <button
            onClick={() => setActiveTab("BOOKINGS")}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "BOOKINGS"
                ? "bg-gold-500 text-black shadow-md"
                : "bg-[#111a2c] text-gray-400 hover:text-white"
            }`}
          >
            Reservation Records ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab("ROOMS")}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "ROOMS"
                ? "bg-gold-500 text-black shadow-md"
                : "bg-[#111a2c] text-gray-400 hover:text-white"
            }`}
          >
            Room Rates & Pricing Manager ({rooms.length})
          </button>
          <button
            onClick={() => setActiveTab("INQUIRIES")}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "INQUIRIES"
                ? "bg-gold-500 text-black shadow-md"
                : "bg-[#111a2c] text-gray-400 hover:text-white"
            }`}
          >
            Guest Messages & Inquiries ({inquiries.length})
          </button>
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === "BOOKINGS" && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-[#0b1220] p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search code, guest name, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131d33] border border-gray-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {["ALL", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition ${
                      statusFilter === st
                        ? "bg-gold-400 text-black font-bold"
                        : "bg-[#141f36] text-gray-400 hover:text-white"
                    }`}
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#0b1220] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080d17] text-gray-400 uppercase tracking-wider text-[10px] border-b border-gray-800">
                    <tr>
                      <th className="px-5 py-3.5">Booking Code</th>
                      <th className="px-5 py-3.5">Guest Info</th>
                      <th className="px-5 py-3.5">Room Category</th>
                      <th className="px-5 py-3.5">Dates / Nights</th>
                      <th className="px-5 py-3.5">Amount / Method</th>
                      <th className="px-5 py-3.5">Payment</th>
                      <th className="px-5 py-3.5">Status Action</th>
                      <th className="px-5 py-3.5 text-right">Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-500">
                          No reservation records found.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#111a2d]/60 transition">
                          <td className="px-5 py-4 font-mono font-bold text-gold-400 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="hover:underline text-left"
                            >
                              {b.bookingCode}
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{b.guestName}</div>
                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-gold-400" />
                              <span>{b.guestPhone}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-white font-medium">{b.roomType?.name}</span>
                            <span className="block text-[11px] text-gray-400">
                              {b.roomType?.isAc ? "AC" : "Non-AC"} • {b.roomType?.category}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div>
                              {new Date(b.checkIn).toLocaleDateString()} ➔{" "}
                              {new Date(b.checkOut).toLocaleDateString()}
                            </div>
                            <span className="text-[11px] text-gold-400/90 font-medium">
                              {b.nights} Night{b.nights > 1 ? "s" : ""}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-bold text-white">৳{b.totalAmount.toLocaleString()}</div>
                            <span className="text-[10px] text-gray-400 uppercase font-mono">
                              {b.paymentMethod}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={b.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(b.id, e.target.value)}
                              className={`text-[11px] font-bold rounded-lg px-2.5 py-1 border focus:outline-none ${
                                b.paymentStatus === "PAID"
                                  ? "bg-emerald-950/70 border-emerald-600 text-emerald-300"
                                  : "bg-amber-950/70 border-amber-600 text-amber-300"
                              }`}
                            >
                              <option value="PAID">PAID</option>
                              <option value="PENDING">PENDING</option>
                              <option value="REFUNDED">REFUNDED</option>
                            </select>
                          </td>

                          <td className="px-5 py-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                              className="bg-[#141f36] border border-gray-700 text-xs rounded-lg px-2.5 py-1 text-white focus:outline-none focus:border-gold-500"
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CHECKED_IN">CHECKED_IN</option>
                              <option value="CHECKED_OUT">CHECKED_OUT</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>

                          <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="p-1.5 rounded-lg bg-[#141f36] hover:bg-[#1f2f50] text-gray-300 hover:text-white transition"
                              title="Quick Inspect"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <Link
                              href={`/booking/${b.bookingCode}`}
                              target="_blank"
                              className="inline-block p-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 transition"
                              title="Open Printable Voucher"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ROOM RATES & INVENTORY */}
        {activeTab === "ROOMS" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const isEditing = editingRoomId === room.id;
              return (
                <div
                  key={room.id}
                  className="bg-[#0b1220] border border-gray-800 rounded-2xl p-5 space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-400 font-bold block">
                        {room.category} Suite
                      </span>
                      <h4 className="font-serif font-bold text-white text-base mt-0.5">
                        {room.name}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {room.isAc ? "Split AC" : "Non-AC"} • Capacity: {room.capacity} Guests
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#101a2d] p-4 rounded-xl border border-gray-800 space-y-2">
                    <span className="text-[11px] text-gray-400 block uppercase tracking-wider">
                      Live Base Nightly Rate (BDT)
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newPrice}
                          onChange={(e) => setNewPrice(Number(e.target.value))}
                          className="w-full bg-[#16223b] border border-gold-500 rounded-lg px-3 py-1.5 text-base font-bold text-gold-400 focus:outline-none"
                        />
                        <button
                          disabled={updatingPrice}
                          onClick={() => handleSavePrice(room.id)}
                          className="bg-gold-500 text-black px-3 py-1.5 rounded-lg font-bold text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRoomId(null)}
                          className="text-gray-400 hover:text-white text-xs px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gold-400">
                          ৳{room.basePrice.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            setEditingRoomId(room.id);
                            setNewPrice(room.basePrice);
                          }}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gold-400 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Update</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 flex justify-between items-center pt-1">
                    <span>Available Inventory:</span>
                    <span className="font-bold text-white">{room.availableUnits || 5} units</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: GUEST INQUIRIES */}
        {activeTab === "INQUIRIES" && (
          <div className="space-y-4">
            <div className="bg-[#0b1220] p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-white">Guest Messages & Inquiries</h3>
                <p className="text-xs text-gray-400">Submitted through the public Contact page</p>
              </div>
              <span className="text-xs text-gold-400 font-mono">
                {inquiries.length} Inquiries Logged
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-12 text-center text-gray-500">
                No guest inquiries received yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#0b1220] border border-gray-800 rounded-2xl p-5 space-y-3 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">{inq.name}</h4>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                          <span>📞 {inq.phone}</span>
                          <span>•</span>
                          <span>✉️ {inq.email}</span>
                        </div>
                      </div>

                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                        className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 border focus:outline-none ${
                          inq.status === "NEW"
                            ? "bg-amber-950 text-amber-300 border-amber-600"
                            : inq.status === "RESPONDED"
                            ? "bg-emerald-950 text-emerald-300 border-emerald-600"
                            : "bg-blue-950 text-blue-300 border-blue-600"
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="READ">READ</option>
                        <option value="RESPONDED">RESPONDED</option>
                      </select>
                    </div>

                    <div className="bg-[#121c31] p-3 rounded-xl border border-gray-800/80 space-y-1">
                      <span className="text-[11px] font-semibold text-gold-400 block">
                        Subject: {inq.subject || "General Inquiry"}
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed">&ldquo;{inq.message}&rdquo;</p>
                      <span className="text-[10px] text-gray-500 block pt-1">
                        Received: {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20Hotel%20Al%20Safa%20Front%20Desk.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#20ba59] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                          WhatsApp Reply
                        </a>
                        <a
                          href={`tel:${inq.phone}`}
                          className="bg-[#141f36] hover:bg-[#1c2b4a] text-gray-300 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-gray-700 transition"
                        >
                          Call Phone
                        </a>
                      </div>

                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-gray-500 hover:text-red-400 p-1 rounded transition"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: VIEW BOOKING DETAILS */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1627] border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest block">
                    Guest Reservation Detail
                  </span>
                  <h3 className="text-xl font-mono font-bold text-gold-400">
                    {selectedBooking.bookingCode}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-[#121c31] p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="font-bold text-sm text-white">{selectedBooking.guestName}</div>
                  <div className="text-gray-300">📞 Phone: {selectedBooking.guestPhone}</div>
                  <div className="text-gray-300">✉️ Email: {selectedBooking.guestEmail}</div>
                  {selectedBooking.guestNidPassport && (
                    <div className="text-gray-300">
                      🪪 NID/Passport: {selectedBooking.guestNidPassport}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#121c31] p-3 rounded-xl border border-gray-800">
                  <div>
                    <span className="text-gray-500 block">Room</span>
                    <span className="font-medium text-white">{selectedBooking.roomType?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Guests</span>
                    <span className="font-medium text-white">
                      {selectedBooking.adults} Adults, {selectedBooking.children} Children
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Check-in</span>
                    <span className="font-medium text-white">
                      {new Date(selectedBooking.checkIn).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Check-out</span>
                    <span className="font-medium text-white">
                      {new Date(selectedBooking.checkOut).toLocaleDateString()} ({selectedBooking.nights} Nights)
                    </span>
                  </div>
                </div>

                <div className="bg-[#121c31] p-3 rounded-xl border border-gray-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Extra Bed Setup:</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.extraBed ? "Yes (+৳500/night)" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Breakfast Included:</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.breakfast ? "Yes (+৳450/person)" : "No"}
                    </span>
                  </div>
                  <div className="border-t border-gray-800 pt-1.5 flex justify-between font-bold text-sm text-gold-400">
                    <span>Grand Total:</span>
                    <span>৳{selectedBooking.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {selectedBooking.specialRequests && (
                  <div className="bg-[#121c31] p-3 rounded-xl border border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-1">
                      Guest Notes & Requests:
                    </span>
                    <p className="text-gray-200">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <Link
                  href={`/booking/${selectedBooking.bookingCode}`}
                  target="_blank"
                  className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Web Voucher</span>
                </Link>
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${selectedBooking.guestPhone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold px-5 py-2 rounded-xl transition"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADD WALK-IN RESERVATION */}
        {walkInModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1627] border border-gold-500/40 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-gold-400" />
                  <h3 className="text-lg font-serif font-bold text-white">
                    Register Walk-in Guest
                  </h3>
                </div>
                <button
                  onClick={() => setWalkInModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {walkInError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-lg">
                  {walkInError}
                </div>
              )}

              <form onSubmit={handleCreateWalkIn} className="space-y-3 text-xs">
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">
                    Guest Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mizanur Rahman"
                    value={walkInName}
                    onChange={(e) => setWalkInName(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={walkInPhone}
                      onChange={(e) => setWalkInPhone(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="guest@mail.com"
                      value={walkInEmail}
                      onChange={(e) => setWalkInEmail(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1">
                    Select Room Category *
                  </label>
                  <select
                    value={walkInRoomId}
                    onChange={(e) => setWalkInRoomId(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                  >
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — ৳{r.basePrice.toLocaleString()} / night
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">
                      Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      value={walkInCheckIn}
                      onChange={(e) => setWalkInCheckIn(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">
                      Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      value={walkInCheckOut}
                      onChange={(e) => setWalkInCheckOut(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">
                      Payment Method
                    </label>
                    <select
                      value={walkInPaymentMethod}
                      onChange={(e) => setWalkInPaymentMethod(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="PAY_AT_HOTEL">Cash on Counter</option>
                      <option value="BKASH">bKash Merchant</option>
                      <option value="NAGAD">Nagad</option>
                      <option value="CARD">POS Card Terminal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1">
                      Payment Status
                    </label>
                    <select
                      value={walkInPaymentStatus}
                      onChange={(e) => setWalkInPaymentStatus(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="PAID">PAID (Full)</option>
                      <option value="PENDING">PENDING (At Check-out)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setWalkInModalOpen(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={walkInSubmitting}
                    className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-6 py-2 rounded-xl transition disabled:opacity-50"
                  >
                    {walkInSubmitting ? "Creating..." : "Confirm & Check In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
