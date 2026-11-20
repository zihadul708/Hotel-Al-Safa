"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Users,
  Bed,
  Search,
  TrendingUp,
  ExternalLink,
  Plus,
  RefreshCw,
  Phone,
  Edit2,
  Trash2,
  AlertCircle,
  Eye,
  Check,
  X,
  Lock,
  MessageSquare,
  ImageIcon,
  UploadCloud,
} from "lucide-react";

interface AdminBooking {
  id: string;
  bookingCode: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestNidPassport: string | null;
  permanentAddress?: string | null;
  occupation?: string | null;
  nationality?: string | null;
  fatherOrHusbandName?: string | null;
  purposeOfTravel?: string | null;
  allottedRoom?: string | null;
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
  bedType?: string;
  sizeSqFt?: number;
  description?: string;
  images?: string[];
  amenities?: string[];
  featured?: boolean;
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

  // Room Editor / Creator Modal State
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomModalMode, setRoomModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingRoom, setEditingRoom] = useState<Partial<RoomItem>>({});
  const [newImageUrl, setNewImageUrl] = useState("");
  const [amenitiesInput, setAmenitiesInput] = useState("");
  const [roomSubmitting, setRoomSubmitting] = useState(false);
  const [roomModalError, setRoomModalError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");

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
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
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

  // Room Creation & Editing Handlers
  const openCreateRoomModal = () => {
    setRoomModalMode("CREATE");
    setEditingRoom({
      name: "",
      category: "Couple",
      slug: "",
      isAc: true,
      basePrice: 2500,
      capacity: 2,
      bedType: "1 King Bed",
      sizeSqFt: 280,
      description: "Comfortable air-conditioned suite with high-speed Wi-Fi, 24/7 hot water geyser, and airport shuttle assistance.",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80"
      ],
      amenities: ["Split AC", "King Size Bed", "Ensuite Bathroom", "24/7 Hot Water", "High-Speed Wi-Fi"],
      featured: false,
      availableUnits: 5,
    });
    setAmenitiesInput("Split AC, King Size Bed, Ensuite Bathroom, 24/7 Hot Water, High-Speed Wi-Fi");
    setNewImageUrl("");
    setRoomModalError("");
    setUploadError("");
    setRoomModalOpen(true);
  };

  const openEditRoomModal = (room: RoomItem) => {
    setRoomModalMode("EDIT");
    setEditingRoom({
      ...room,
      images: Array.isArray(room.images) ? [...room.images] : [],
      amenities: Array.isArray(room.amenities) ? [...room.amenities] : [],
    });
    setAmenitiesInput(Array.isArray(room.amenities) ? room.amenities.join(", ") : "");
    setNewImageUrl("");
    setRoomModalError("");
    setUploadError("");
    setRoomModalOpen(true);
  };

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const currentImages = Array.isArray(editingRoom.images) ? [...editingRoom.images] : [];
    currentImages.push(newImageUrl.trim());
    setEditingRoom((prev) => ({ ...prev, images: currentImages }));
    setNewImageUrl("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setUploadError("");

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Upload failed for ${file.name}`);
        }
        if (data.url) {
          newUrls.push(data.url);
        }
      }

      setEditingRoom((prev) => ({
        ...prev,
        images: [...(Array.isArray(prev.images) ? prev.images : []), ...newUrls],
      }));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image to Cloudinary.");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = Array.isArray(editingRoom.images) ? [...editingRoom.images] : [];
    currentImages.splice(indexToRemove, 1);
    setEditingRoom((prev) => ({ ...prev, images: currentImages }));
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom.name?.trim()) {
      setRoomModalError("Room name is required.");
      return;
    }

    setRoomSubmitting(true);
    setRoomModalError("");

    const parsedAmenities = amenitiesInput
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    const payload = {
      ...editingRoom,
      name: editingRoom.name.trim(),
      amenities: parsedAmenities,
      basePrice: Number(editingRoom.basePrice) || 2500,
      capacity: Number(editingRoom.capacity) || 2,
      sizeSqFt: Number(editingRoom.sizeSqFt) || 280,
      availableUnits: Number(editingRoom.availableUnits) || 5,
    };

    try {
      const isCreate = roomModalMode === "CREATE";
      const res = await fetch("/api/rooms", {
        method: isCreate ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save room details.");
      }

      setRoomModalOpen(false);
      await fetchDashboardData();
    } catch (err: any) {
      setRoomModalError(err.message || "Failed to save room.");
    } finally {
      setRoomSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/rooms?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete room.");
      }

      setRoomModalOpen(false);
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete room.");
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
            onClick={openCreateRoomModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold text-xs px-4 py-2 rounded-lg shadow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add New Room</span>
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
                      <th className="px-5 py-3.5 text-right">Details</th>
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

                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141f36] hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-gray-700/80 transition text-xs font-semibold"
                              title="View Guest Details"
                            >
                              <Eye className="w-3.5 h-3.5 text-gold-400" />
                              <span>View</span>
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

        {/* TAB 2: ROOM MANAGEMENT & INVENTORY */}
        {activeTab === "ROOMS" && (
          <div className="space-y-6">
            <div className="bg-[#0b1220] p-4 sm:p-5 rounded-2xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Bed className="w-5 h-5 text-gold-400" />
                  <span>Room Categories & Live Inventory ({rooms.length})</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage room names, photography galleries, nightly BDT pricing, amenities, and available units.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateRoomModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold text-xs shadow-md transition self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Room Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const isEditing = editingRoomId === room.id;
                const firstImage = Array.isArray(room.images) && room.images.length > 0 ? room.images[0] : null;

                return (
                  <div
                    key={room.id}
                    className="bg-[#0b1220] border border-gray-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-gold-500/40 transition"
                  >
                    <div>
                      {/* Image Thumbnail Header */}
                      <div className="relative h-44 w-full bg-[#121c31] overflow-hidden">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <ImageIcon className="w-8 h-8 mb-1" />
                            <span className="text-xs">No Photo Added</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-black/40" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 backdrop-blur-md text-gold-300 border border-gold-400/30">
                            {room.category} Suite
                          </span>
                          <div className="flex items-center gap-1.5">
                            {room.featured && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500 text-black">
                                Featured
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                room.isAc
                                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                                  : "bg-gray-700/60 text-gray-300"
                              }`}
                            >
                              {room.isAc ? "Split AC" : "Non-AC"}
                            </span>
                          </div>
                        </div>

                        {/* Photos Count Badge */}
                        {Array.isArray(room.images) && room.images.length > 0 && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] text-gray-300 flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-gold-400" />
                            <span>{room.images.length} Photos</span>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h4 className="font-serif font-bold text-white text-base leading-snug">
                            {room.name}
                          </h4>
                          {room.description && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                              {room.description}
                            </p>
                          )}
                        </div>

                        {/* Specs Pills */}
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-300 pt-1">
                          <span className="px-2 py-0.5 rounded-md bg-[#131e33] border border-gray-700">
                            👥 {room.capacity} Guests
                          </span>
                          {room.bedType && (
                            <span className="px-2 py-0.5 rounded-md bg-[#131e33] border border-gray-700">
                              🛏️ {room.bedType}
                            </span>
                          )}
                          {room.sizeSqFt && (
                            <span className="px-2 py-0.5 rounded-md bg-[#131e33] border border-gray-700">
                              📐 {room.sizeSqFt} sq.ft
                            </span>
                          )}
                        </div>

                        {/* Nightly Base Rate */}
                        <div className="bg-[#101a2d] p-3.5 rounded-xl border border-gray-800 space-y-2 mt-2">
                          <div className="flex justify-between items-center text-[11px] text-gray-400 uppercase tracking-wider">
                            <span>Base Nightly Rate:</span>
                            <span className="text-white font-bold">{room.availableUnits || 5} units left</span>
                          </div>
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
                              <span className="text-xl font-bold text-gold-400">
                                ৳{room.basePrice.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ night</span>
                              </span>
                              <button
                                onClick={() => {
                                  setEditingRoomId(room.id);
                                  setNewPrice(room.basePrice);
                                }}
                                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gold-400 transition"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Quick Price</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 pb-5 pt-1 flex items-center justify-between border-t border-gray-800/80 mt-2">
                      <button
                        type="button"
                        onClick={() => openEditRoomModal(room)}
                        className="flex-1 mr-2 py-2 px-3 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 border border-gold-500/30 text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit Room Details</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoom(room.id, room.name)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/30 border border-gray-800 transition"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Room Card Trigger */}
              <button
                type="button"
                onClick={openCreateRoomModal}
                className="bg-[#0b1220]/60 border-2 border-dashed border-gray-800 hover:border-gold-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 transition group min-h-[300px]"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 group-hover:bg-gold-500/20 text-gold-400 flex items-center justify-center transition">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-white text-base group-hover:text-gold-300 transition">
                    + Add New Room Category
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                    Create a new suite with pricing, photos, and specs.
                  </p>
                </div>
              </button>
            </div>
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
                <div className="bg-[#121c31] p-3 rounded-xl border border-gray-800 space-y-1.5">
                  <div className="font-bold text-sm text-white">{selectedBooking.guestName}</div>
                  <div className="text-gray-300">📞 Phone: <span className="font-semibold text-white">{selectedBooking.guestPhone}</span></div>
                  {selectedBooking.guestEmail && (
                    <div className="text-gray-300">✉️ Email: {selectedBooking.guestEmail}</div>
                  )}
                  {selectedBooking.guestNidPassport && (
                    <div className="text-gold-400 font-mono">
                      🪪 NID/Passport: <span className="font-bold">{selectedBooking.guestNidPassport}</span>
                    </div>
                  )}
                  {selectedBooking.permanentAddress && (
                    <div className="text-gray-300">
                      🏠 Address: {selectedBooking.permanentAddress}
                    </div>
                  )}
                  {(selectedBooking.occupation || selectedBooking.nationality) && (
                    <div className="text-gray-300">
                      💼 {selectedBooking.occupation || "N/A"} • 🇧🇩 {selectedBooking.nationality || "Bangladeshi"}
                    </div>
                  )}
                  {selectedBooking.fatherOrHusbandName && (
                    <div className="text-gray-300">
                      👨‍👦 Father/Husband: {selectedBooking.fatherOrHusbandName}
                    </div>
                  )}
                  {selectedBooking.purposeOfTravel && (
                    <div className="text-gray-300">
                      ✈️ Purpose: {selectedBooking.purposeOfTravel}
                    </div>
                  )}
                  {selectedBooking.allottedRoom && (
                    <div className="text-emerald-400 font-semibold font-mono">
                      🚪 Allotted Room: {selectedBooking.allottedRoom}
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

              <div className="flex justify-end items-center pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold px-6 py-2.5 rounded-xl transition shadow"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / EDIT ROOM */}
        {roomModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
            <div className="bg-[#0e1627] border border-gold-500/40 rounded-2xl sm:rounded-3xl max-w-3xl lg:max-w-4xl w-full max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Sticky Modal Header */}
              <div className="flex justify-between items-center px-5 sm:px-7 py-4 border-b border-gray-800 shrink-0 bg-[#0b1220]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold shrink-0">
                    <Bed className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                      {roomModalMode === "CREATE"
                        ? "Add New Room Category"
                        : `Edit Room: ${editingRoom.name || "Suite"}`}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Changes will synchronize across website catalog and database backend.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRoomModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
                  title="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <form onSubmit={handleSaveRoom} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-5 text-xs">
                  {roomModalError && (
                    <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{roomModalError}</span>
                    </div>
                  )}

                  {/* 1. Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Room Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Deluxe Couple Room (AC)"
                        value={editingRoom.name || ""}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Category *
                      </label>
                      <select
                        value={editingRoom.category || "Couple"}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      >
                        <option value="Couple">Couple</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Twin">Twin</option>
                        <option value="Family">Family</option>
                        <option value="Single">Single / Transit</option>
                        <option value="Suite">Presidential Suite</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. Price, Inventory, Climate */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Base Rate (BDT ৳) *
                      </label>
                      <input
                        type="number"
                        required
                        min={500}
                        value={editingRoom.basePrice ?? 2500}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, basePrice: Number(e.target.value) }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-gold-400 font-bold text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Available Units *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={50}
                        value={editingRoom.availableUnits ?? 5}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({
                            ...prev,
                            availableUnits: Number(e.target.value),
                          }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Climate Control *
                      </label>
                      <select
                        value={editingRoom.isAc ? "ac" : "non-ac"}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, isAc: e.target.value === "ac" }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      >
                        <option value="ac">Split AC (Air Conditioned)</option>
                        <option value="non-ac">Non-AC (Ceiling Fan)</option>
                      </select>
                    </div>
                  </div>

                  {/* 3. Specs: Capacity, Bed Type, Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Guest Capacity
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={editingRoom.capacity ?? 2}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, capacity: Number(e.target.value) }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Bed Configuration
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1 King Bed"
                        value={editingRoom.bedType || ""}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, bedType: e.target.value }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Room Size (Sq Ft)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 280"
                        value={editingRoom.sizeSqFt ?? 280}
                        onChange={(e) =>
                          setEditingRoom((prev) => ({ ...prev, sizeSqFt: Number(e.target.value) }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                  </div>

                  {/* 4. Description */}
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                      Room Overview / Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe comfort, soundproofing, bathroom, layover conveniences..."
                      value={editingRoom.description || ""}
                      onChange={(e) =>
                        setEditingRoom((prev) => ({ ...prev, description: e.target.value }))
                      }
                      className="w-full bg-[#141f36] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-gold-500 resize-y min-h-[75px] transition"
                    />
                  </div>

                  {/* 5. Images Manager with Cloudinary */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-gray-400 uppercase font-bold text-[11px] flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-gold-400" />
                        <span>Room Photography & Cloudinary Storage</span>
                      </label>
                      <span className="text-[11px] text-gray-400 font-medium">
                        {Array.isArray(editingRoom.images) ? editingRoom.images.length : 0} photo(s)
                      </span>
                    </div>

                    {/* Cloudinary Upload Dropzone */}
                    <div className="relative border-2 border-dashed border-gray-700 hover:border-gold-500/60 rounded-2xl p-4 sm:p-5 bg-[#111a2d] transition text-center group cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingImage}
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 disabled:cursor-not-allowed"
                        id="room-photos-upload"
                      />
                      <div className="flex flex-col items-center justify-center py-2 space-y-2 pointer-events-none">
                        <div className="w-11 h-11 rounded-xl bg-gold-500/10 group-hover:bg-gold-500/20 text-gold-400 flex items-center justify-center transition">
                          {uploadingImage ? (
                            <RefreshCw className="w-5 h-5 animate-spin text-gold-400" />
                          ) : (
                            <UploadCloud className="w-6 h-6 group-hover:scale-110 transition" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition block">
                            {uploadingImage
                              ? "Uploading to Cloudinary..."
                              : "Click or drag & drop room photos to upload to Cloudinary"}
                          </span>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Stores images on Cloudinary CDN (JPG, PNG, WebP up to 10MB each)
                          </p>
                        </div>
                      </div>
                    </div>

                    {uploadError && (
                      <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                        <div>
                          <p className="font-semibold">{uploadError}</p>
                          {uploadError.includes("CLOUDINARY") && (
                            <p className="text-[11px] text-red-300 mt-1">
                              Add <code className="bg-black/40 px-1 py-0.5 rounded text-gold-300 font-mono">CLOUDINARY_CLOUD_NAME</code>, <code className="bg-black/40 px-1 py-0.5 rounded text-gold-300 font-mono">CLOUDINARY_API_KEY</code>, and <code className="bg-black/40 px-1 py-0.5 rounded text-gold-300 font-mono">CLOUDINARY_API_SECRET</code> to <code className="bg-black/40 px-1 py-0.5 rounded text-gold-300 font-mono">.env.local</code>.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Or paste external image URL */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                      <input
                        type="url"
                        placeholder="Or paste direct image URL (optional)"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        className="flex-1 bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 transition"
                      />
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="sm:w-auto w-full px-4 py-2.5 bg-[#172542] hover:bg-[#1d3055] text-gray-200 border border-gray-700 rounded-xl font-bold text-xs transition shrink-0"
                      >
                        + Add URL
                      </button>
                    </div>

                    {/* Thumbnail gallery */}
                    {Array.isArray(editingRoom.images) && editingRoom.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
                        {editingRoom.images.map((img, idx) => (
                          <div
                            key={idx}
                            className="relative group rounded-xl overflow-hidden border border-gray-700 aspect-video bg-black shadow-sm"
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {idx === 0 && (
                              <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-gold-500 text-black text-[9px] font-bold rounded">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition shadow"
                              title="Remove photo"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 6. Amenities */}
                  <div>
                    <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                      Amenities (comma-separated list)
                    </label>
                    <input
                      type="text"
                      placeholder="Split AC, King Size Bed, Ensuite Bathroom, 24/7 Hot Water, High-Speed Wi-Fi, LED TV"
                      value={amenitiesInput}
                      onChange={(e) => setAmenitiesInput(e.target.value)}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-gold-500 transition"
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Separate amenities with commas.</p>
                  </div>

                  {/* 7. Featured Toggle */}
                  <div className="flex items-center gap-3 pt-1 bg-[#121c31] p-3 rounded-xl border border-gray-800">
                    <input
                      type="checkbox"
                      id="featuredRoomToggle"
                      checked={Boolean(editingRoom.featured)}
                      onChange={(e) =>
                        setEditingRoom((prev) => ({ ...prev, featured: e.target.checked }))
                      }
                      className="w-4 h-4 rounded text-gold-500 bg-[#141f36] border-gray-700 focus:ring-gold-500 cursor-pointer"
                    />
                    <label
                      htmlFor="featuredRoomToggle"
                      className="text-gray-300 font-medium cursor-pointer text-xs"
                    >
                      Mark as Featured Suite on Homepage Showcase
                    </label>
                  </div>
                </div>

                {/* Sticky Modal Footer */}
                <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 px-5 sm:px-7 py-4 border-t border-gray-800 shrink-0 bg-[#0b1220]">
                  {roomModalMode === "EDIT" && editingRoom.id ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteRoom(editingRoom.id!, editingRoom.name || "Suite")
                      }
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/40 border border-red-800/60 transition flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Suite</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setRoomModalOpen(false)}
                      className="px-5 py-2.5 text-xs text-gray-400 hover:text-white transition font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={roomSubmitting}
                      className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-6 py-2.5 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {roomSubmitting
                          ? "Saving..."
                          : roomModalMode === "CREATE"
                          ? "Create Room"
                          : "Save Changes"}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
