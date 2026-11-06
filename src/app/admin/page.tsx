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

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"BOOKINGS" | "ROOMS">("BOOKINGS");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  // Quick Room Price Edit state
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [updatingPrice, setUpdatingPrice] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resBookings, resRooms] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/rooms"),
      ]);

      const dataBookings = await resBookings.json();
      const dataRooms = await resRooms.json();

      setBookings(Array.isArray(dataBookings) ? dataBookings : []);
      setRooms(Array.isArray(dataRooms) ? dataRooms : []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  return (
    <div className="min-h-screen bg-[#070c17] text-gray-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-[#0b1220] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
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

        <div className="flex items-center gap-4">
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
            <span>Live Guest Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* ========================================================= */}
        {/* KPI OVERVIEW METRICS                                      */}
        {/* ========================================================= */}
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

          {/* Card 4: Room Categories */}
          <div className="bg-[#0d1627] border border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Active Inventory</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <Bed className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{rooms.length} Room Types</div>
            <p className="text-[11px] text-gray-400 mt-1">Managed rates & availability</p>
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
        </div>

        {/* ========================================================= */}
        {/* TAB 1: BOOKINGS LIST                                      */}
        {/* ========================================================= */}
        {activeTab === "BOOKINGS" && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-[#0b1220] p-4 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search */}
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

              {/* Status Pills */}
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
                      <th className="px-5 py-3.5 text-right">View</th>
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
                          {/* Booking Code */}
                          <td className="px-5 py-4 font-mono font-bold text-gold-400 whitespace-nowrap">
                            {b.bookingCode}
                          </td>

                          {/* Guest */}
                          <td className="px-5 py-4">
                            <div className="font-semibold text-white">{b.guestName}</div>
                            <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Phone className="w-3 h-3 text-gold-400" />
                              <span>{b.guestPhone}</span>
                            </div>
                          </td>

                          {/* Room */}
                          <td className="px-5 py-4">
                            <div className="font-medium text-gray-200">{b.roomType?.name}</div>
                            <div className="text-[10px] text-gray-400">
                              {b.adults} Adults {b.children > 0 ? `• ${b.children} Kids` : ""}
                            </div>
                          </td>

                          {/* Dates */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-gray-300 font-medium">
                              {new Date(b.checkIn).toLocaleDateString()}
                            </div>
                            <div className="text-[10px] text-gold-400/90 font-semibold">
                              {b.nights} Night{b.nights > 1 ? "s" : ""}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="font-bold text-white">৳{b.totalAmount.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-400 uppercase font-semibold">
                              {b.paymentMethod}
                            </div>
                          </td>

                          {/* Payment Status Dropdown */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <select
                              value={b.paymentStatus}
                              onChange={(e) => handleUpdatePaymentStatus(b.id, e.target.value)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border bg-transparent cursor-pointer ${
                                b.paymentStatus === "PAID"
                                  ? "border-emerald-500 text-emerald-400 bg-emerald-950/40"
                                  : "border-amber-500 text-amber-400 bg-amber-950/40"
                              }`}
                            >
                              <option value="PAID" className="bg-[#0b1220] text-emerald-400">
                                PAID
                              </option>
                              <option value="PENDING" className="bg-[#0b1220] text-amber-400">
                                PENDING
                              </option>
                              <option value="REFUNDED" className="bg-[#0b1220] text-red-400">
                                REFUNDED
                              </option>
                            </select>
                          </td>

                          {/* Status Action Dropdown */}
                          <td className="px-5 py-4 whitespace-nowrap">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border bg-transparent cursor-pointer ${
                                b.status === "CHECKED_IN"
                                  ? "border-blue-500 text-blue-300 bg-blue-950/40"
                                  : b.status === "CONFIRMED"
                                  ? "border-gold-500 text-gold-300 bg-gold-950/40"
                                  : b.status === "CHECKED_OUT"
                                  ? "border-gray-600 text-gray-400 bg-gray-900/40"
                                  : "border-red-600 text-red-400 bg-red-950/40"
                              }`}
                            >
                              <option value="CONFIRMED" className="bg-[#0b1220] text-gold-300">
                                CONFIRMED
                              </option>
                              <option value="CHECKED_IN" className="bg-[#0b1220] text-blue-300">
                                CHECKED IN
                              </option>
                              <option value="CHECKED_OUT" className="bg-[#0b1220] text-gray-300">
                                CHECKED OUT
                              </option>
                              <option value="CANCELLED" className="bg-[#0b1220] text-red-300">
                                CANCELLED
                              </option>
                            </select>
                          </td>

                          {/* Details Button */}
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="p-1.5 rounded-lg bg-[#141f36] text-gray-300 hover:text-gold-400 hover:bg-[#1d2d4f] transition"
                              title="View Guest Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
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

        {/* ========================================================= */}
        {/* TAB 2: ROOM RATES & INVENTORY                             */}
        {/* ========================================================= */}
        {activeTab === "ROOMS" && (
          <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="font-serif font-bold text-xl text-white">
                Room Inventory & Dynamic Nightly Rates
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Update base rates per night instantly. Changes take effect on the guest booking page immediately.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const isEditing = editingRoomId === room.id;

                return (
                  <div
                    key={room.id}
                    className="p-5 rounded-2xl bg-[#0e1627] border border-gray-800 space-y-4 hover:border-gold-500/40 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
                          {room.category}
                        </span>
                        <h4 className="font-bold text-white text-base mt-0.5">{room.name}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          room.isAc
                            ? "bg-cyan-950 text-cyan-300 border border-cyan-800"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {room.isAc ? "AC" : "Non-AC"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Capacity: Max {room.capacity} Guests</div>
                      <div>Available Inventory Units: {room.availableUnits} Rooms</div>
                    </div>

                    {/* Price Editor */}
                    <div className="pt-3 border-t border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Nightly Rate</span>
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-gold-400 font-bold">৳</span>
                            <input
                              type="number"
                              value={newPrice}
                              onChange={(e) => setNewPrice(Number(e.target.value))}
                              className="w-24 bg-[#141f36] border border-gold-500 rounded px-2 py-1 text-sm text-white focus:outline-none"
                            />
                            <button
                              disabled={updatingPrice}
                              onClick={() => handleSavePrice(room.id)}
                              className="p-1 rounded bg-gold-500 text-black font-bold hover:bg-gold-400 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingRoomId(null)}
                              className="p-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-gold-400">
                            ৳{room.basePrice.toLocaleString()}{" "}
                            <span className="text-xs text-gray-500 font-normal">/ night</span>
                          </div>
                        )}
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => {
                            setEditingRoomId(room.id);
                            setNewPrice(room.basePrice);
                          }}
                          className="flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-semibold px-3 py-1.5 rounded-lg bg-gold-400/10 border border-gold-400/30 transition"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Change Price</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* MODAL: VIEW BOOKING DETAILS                               */}
        {/* ========================================================= */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0e1627] border border-gold-500/30 rounded-2xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl">
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
                    <span className="text-gray-400">Airport Shuttle Service:</span>
                    <span className="font-semibold text-white">
                      {selectedBooking.airportTransfer ? "Requested (Yes)" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Extra Bed:</span>
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
                <a
                  href={`https://wa.me/${selectedBooking.guestPhone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold px-4 py-2 rounded-xl transition"
                >
                  WhatsApp Guest
                </a>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold px-6 py-2 rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
