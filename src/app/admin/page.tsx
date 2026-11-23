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
  EyeOff,
  Check,
  X,
  Lock,
  MessageSquare,
  ImageIcon,
  UploadCloud,
  User,
  Key,
  Shield,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Sliders,
  CheckCircle,
  LogOut,
  UserPlus,
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

interface SafeAdminUser {
  id: string;
  username: string;
  name: string;
  role: "SUPER_ADMIN" | "ADMIN" | "STAFF";
  createdAt: string;
  updatedAt?: string;
}

interface HeroSlideData {
  id: string;
  image: string;
  tag: string;
  title: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminDashboardPage() {
  // Staff Auth Gate (Username & Password)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<SafeAdminUser | null>(null);

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<
    "BOOKINGS" | "ROOMS" | "HERO_SLIDES" | "INQUIRIES" | "ADMIN_USERS"
  >("BOOKINGS");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

  // New Booking & Reservation Management State
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [newBookingSubmitting, setNewBookingSubmitting] = useState(false);
  const [newBookingError, setNewBookingError] = useState("");
  const [editAllottedRoom, setEditAllottedRoom] = useState("");
  const [updatingAllottedRoom, setUpdatingAllottedRoom] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);
  const [newBookingForm, setNewBookingForm] = useState({
    roomTypeId: "",
    guestName: "",
    guestPhone: "",
    guestEmail: "",
    guestNidPassport: "",
    permanentAddress: "",
    occupation: "",
    nationality: "Bangladeshi",
    fatherOrHusbandName: "",
    purposeOfTravel: "",
    allottedRoom: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    extraBed: false,
    breakfast: false,
    paymentMethod: "PAY_AT_HOTEL",
    paymentStatus: "PENDING",
    status: "CONFIRMED",
    specialRequests: "",
    customTotalAmount: "",
  });

  // Admin Users State
  const [adminUsers, setAdminUsers] = useState<SafeAdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"CREATE" | "PASSWORD">("CREATE");
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<SafeAdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    role: "ADMIN" as "SUPER_ADMIN" | "ADMIN" | "STAFF",
  });
  const [userFormError, setUserFormError] = useState("");
  const [userSubmitting, setUserSubmitting] = useState(false);

  // Quick Self Password Change Modal State
  const [selfPasswordModalOpen, setSelfPasswordModalOpen] = useState(false);
  const [selfNewPassword, setSelfNewPassword] = useState("");
  const [selfConfirmPassword, setSelfConfirmPassword] = useState("");
  const [selfPasswordError, setSelfPasswordError] = useState("");
  const [selfPasswordSuccess, setSelfPasswordSuccess] = useState("");
  const [selfPasswordSubmitting, setSelfPasswordSubmitting] = useState(false);

  // Hero Slides State
  const [heroSlidesList, setHeroSlidesList] = useState<HeroSlideData[]>([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [slideModalOpen, setSlideModalOpen] = useState(false);
  const [slideModalMode, setSlideModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [slideForm, setSlideForm] = useState<Partial<HeroSlideData>>({
    image: "",
    tag: "",
    title: "",
    isActive: true,
  });
  const [slideFormError, setSlideFormError] = useState("");
  const [slideSubmitting, setSlideSubmitting] = useState(false);
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);
  const [uploadSlideError, setUploadSlideError] = useState("");

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
    const storedUser = sessionStorage.getItem("alsafa_admin_user");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {}
      }
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      sessionStorage.setItem("alsafa_staff_auth", "true");
      sessionStorage.setItem("alsafa_admin_user", JSON.stringify(data.user));
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setAuthError("");
      setPasswordInput("");
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("alsafa_staff_auth");
    sessionStorage.removeItem("alsafa_admin_user");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUsernameInput("");
    setPasswordInput("");
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [resBookings, resRooms, resInquiries, resSlides, resUsers] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/rooms"),
        fetch("/api/inquiries"),
        fetch("/api/hero-slides?all=true"),
        fetch("/api/admin/users"),
      ]);

      const dataBookings = resBookings.ok ? await resBookings.json() : [];
      const dataRooms = resRooms.ok ? await resRooms.json() : [];
      const dataInquiries = resInquiries.ok ? await resInquiries.json() : [];
      const dataSlides = resSlides.ok ? await resSlides.json() : [];
      const dataUsers = resUsers.ok ? await resUsers.json() : [];

      setBookings(Array.isArray(dataBookings) ? dataBookings : []);
      setRooms(Array.isArray(dataRooms) ? dataRooms : []);
      setInquiries(Array.isArray(dataInquiries) ? dataInquiries : []);
      setHeroSlidesList(Array.isArray(dataSlides) ? dataSlides : []);
      setAdminUsers(Array.isArray(dataUsers) ? dataUsers : []);
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
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking({ ...selectedBooking, paymentStatus: newPayStatus, paidAmount });
        }
      }
    } catch (err) {
      console.error("Payment status update error:", err);
    }
  };

  // Open Booking Details Modal
  const handleOpenBookingDetails = (b: AdminBooking) => {
    setSelectedBooking(b);
    setEditAllottedRoom(b.allottedRoom || "");
  };

  // Save Allotted Room for a Booking
  const handleSaveAllottedRoom = async (id: string, roomNum: string) => {
    setUpdatingAllottedRoom(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allottedRoom: roomNum.trim() || null }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, allottedRoom: roomNum.trim() || null } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, allottedRoom: roomNum.trim() || null } : null));
        }
      }
    } catch (err) {
      console.error("Save allotted room error:", err);
    } finally {
      setUpdatingAllottedRoom(false);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: string, code: string, guestName: string) => {
    if (!confirm(`Are you sure you want to permanently delete reservation ${code} (${guestName})? This cannot be undone.`)) {
      return;
    }
    setDeletingBookingId(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking(null);
        }
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete reservation.");
      }
    } catch (err) {
      console.error("Delete booking error:", err);
      alert("Failed to delete reservation.");
    } finally {
      setDeletingBookingId(null);
    }
  };

  // Open New Reservation Modal
  const handleOpenNewBookingModal = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const checkInStr = today.toISOString().split("T")[0];
    const checkOutStr = tomorrow.toISOString().split("T")[0];

    setNewBookingForm({
      roomTypeId: rooms[0]?.id || "",
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      guestNidPassport: "",
      permanentAddress: "",
      occupation: "",
      nationality: "Bangladeshi",
      fatherOrHusbandName: "",
      purposeOfTravel: "",
      allottedRoom: "",
      checkIn: checkInStr,
      checkOut: checkOutStr,
      adults: 2,
      children: 0,
      extraBed: false,
      breakfast: false,
      paymentMethod: "PAY_AT_HOTEL",
      paymentStatus: "PENDING",
      status: "CONFIRMED",
      specialRequests: "",
      customTotalAmount: "",
    });
    setNewBookingError("");
    setNewBookingModalOpen(true);
  };

  // Submit New Reservation
  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingForm.roomTypeId) {
      setNewBookingError("Please select a room category.");
      return;
    }
    if (!newBookingForm.guestName.trim()) {
      setNewBookingError("Please enter the guest full name.");
      return;
    }
    if (!newBookingForm.guestPhone.trim()) {
      setNewBookingError("Please enter the guest phone number.");
      return;
    }
    if (!newBookingForm.checkIn || !newBookingForm.checkOut) {
      setNewBookingError("Please specify both check-in and check-out dates.");
      return;
    }

    const cIn = new Date(newBookingForm.checkIn);
    const cOut = new Date(newBookingForm.checkOut);
    if (cOut <= cIn) {
      setNewBookingError("Check-out date must be after check-in date.");
      return;
    }

    setNewBookingSubmitting(true);
    setNewBookingError("");

    try {
      const diffTime = Math.max(0, cOut.getTime() - cIn.getTime());
      const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const selectedRoom = rooms.find((r) => r.id === newBookingForm.roomTypeId);
      const basePrice = selectedRoom ? selectedRoom.basePrice : 0;
      const extraBedCharge = newBookingForm.extraBed ? 500 * nights : 0;
      const breakfastCharge = newBookingForm.breakfast
        ? 450 * (Number(newBookingForm.adults) + Number(newBookingForm.children)) * nights
        : 0;
      const calculatedTotal = (basePrice * nights) + extraBedCharge + breakfastCharge;

      const finalTotal = newBookingForm.customTotalAmount !== ""
        ? Number(newBookingForm.customTotalAmount)
        : calculatedTotal;
      const finalPaid = newBookingForm.paymentStatus === "PAID" ? finalTotal : 0;

      const payload = {
        roomTypeId: newBookingForm.roomTypeId,
        guestName: newBookingForm.guestName.trim(),
        guestPhone: newBookingForm.guestPhone.trim(),
        guestEmail: newBookingForm.guestEmail.trim() || undefined,
        guestNidPassport: newBookingForm.guestNidPassport.trim() || undefined,
        permanentAddress: newBookingForm.permanentAddress.trim() || undefined,
        occupation: newBookingForm.occupation.trim() || undefined,
        nationality: newBookingForm.nationality.trim() || "Bangladeshi",
        fatherOrHusbandName: newBookingForm.fatherOrHusbandName.trim() || undefined,
        purposeOfTravel: newBookingForm.purposeOfTravel.trim() || undefined,
        allottedRoom: newBookingForm.allottedRoom.trim() || undefined,
        checkIn: newBookingForm.checkIn,
        checkOut: newBookingForm.checkOut,
        nights,
        adults: Number(newBookingForm.adults),
        children: Number(newBookingForm.children),
        extraBed: Boolean(newBookingForm.extraBed),
        breakfast: Boolean(newBookingForm.breakfast),
        totalAmount: finalTotal,
        paidAmount: finalPaid,
        paymentMethod: newBookingForm.paymentMethod,
        paymentStatus: newBookingForm.paymentStatus,
        status: newBookingForm.status,
        specialRequests: newBookingForm.specialRequests.trim() || undefined,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create reservation.");
      }

      setBookings((prev) => [data, ...prev]);
      setNewBookingModalOpen(false);
    } catch (err: any) {
      setNewBookingError(err.message || "Failed to create reservation.");
    } finally {
      setNewBookingSubmitting(false);
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

  // Admin Users Handlers
  const openCreateUserModal = () => {
    setUserModalMode("CREATE");
    setSelectedUserForPassword(null);
    setUserForm({
      username: "",
      name: "",
      password: "",
      confirmPassword: "",
      role: "ADMIN",
    });
    setUserFormError("");
    setUserModalOpen(true);
  };

  const openChangePasswordModal = (user: SafeAdminUser) => {
    setUserModalMode("PASSWORD");
    setSelectedUserForPassword(user);
    setUserForm({
      username: user.username,
      name: user.name,
      password: "",
      confirmPassword: "",
      role: user.role,
    });
    setUserFormError("");
    setUserModalOpen(true);
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError("");

    if (!userForm.password || userForm.password.length < 6) {
      setUserFormError("Password must be at least 6 characters.");
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setUserFormError("Passwords do not match.");
      return;
    }

    setUserSubmitting(true);
    try {
      if (userModalMode === "CREATE") {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: userForm.username.trim(),
            name: userForm.name.trim(),
            password: userForm.password,
            role: userForm.role,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user.");
      } else if (selectedUserForPassword) {
        const res = await fetch(`/api/admin/users/${selectedUserForPassword.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: userForm.password,
            name: userForm.name.trim(),
            role: userForm.role,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update password.");
      }

      setUserModalOpen(false);
      await fetchDashboardData();
    } catch (err: any) {
      setUserFormError(err.message || "Operation failed.");
    } finally {
      setUserSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: SafeAdminUser) => {
    if (currentUser?.id === user.id) {
      alert("You cannot delete your own currently active account.");
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user "${user.username}" (${user.name})?`)) {
      return;
    }

    try {
      const res = await fetch(
        `/api/admin/users/${user.id}?requesterId=${encodeURIComponent(currentUser?.id || "")}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user.");
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    }
  };

  const handleSelfPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSelfPasswordError("");
    setSelfPasswordSuccess("");

    if (!selfNewPassword || selfNewPassword.length < 6) {
      setSelfPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (selfNewPassword !== selfConfirmPassword) {
      setSelfPasswordError("Passwords do not match.");
      return;
    }

    if (!currentUser) return;

    setSelfPasswordSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: selfNewPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password.");

      setSelfPasswordSuccess("Password updated successfully!");
      setSelfNewPassword("");
      setSelfConfirmPassword("");
      setTimeout(() => {
        setSelfPasswordModalOpen(false);
        setSelfPasswordSuccess("");
      }, 1200);
    } catch (err: any) {
      setSelfPasswordError(err.message || "Failed to update password.");
    } finally {
      setSelfPasswordSubmitting(false);
    }
  };

  // Hero Slides Handlers
  const openCreateSlideModal = () => {
    setSlideModalMode("CREATE");
    setSlideForm({
      image: "",
      tag: "Airport Transit Hotel & Luxury Facade",
      title: "",
      isActive: true,
    });
    setSlideFormError("");
    setSlideModalOpen(true);
  };

  const openEditSlideModal = (slide: HeroSlideData) => {
    setSlideModalMode("EDIT");
    setSlideForm({ ...slide });
    setSlideFormError("");
    setSlideModalOpen(true);
  };

  const handleSlideImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSlideImage(true);
    setUploadSlideError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Image upload failed.");
      }

      if (data.url) {
        setSlideForm((prev) => ({ ...prev, image: data.url }));
      }
    } catch (err: any) {
      setUploadSlideError(err.message || "Failed to upload image to Cloudinary.");
    } finally {
      setUploadingSlideImage(false);
      e.target.value = "";
    }
  };

  const handleSlideFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlideFormError("");

    if (!slideForm.image?.trim()) {
      setSlideFormError("Slide image is required. Upload an image or enter a URL.");
      return;
    }
    if (!slideForm.title?.trim()) {
      setSlideFormError("Slide headline title is required.");
      return;
    }

    setSlideSubmitting(true);
    try {
      if (slideModalMode === "CREATE") {
        const res = await fetch("/api/hero-slides", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: slideForm.image.trim(),
            tag: slideForm.tag?.trim() || "Hotel Al Safa International",
            title: slideForm.title.trim(),
            isActive: slideForm.isActive ?? true,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create slide.");
      } else if (slideForm.id) {
        const res = await fetch("/api/hero-slides", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: slideForm.id,
            updates: {
              image: slideForm.image.trim(),
              tag: slideForm.tag?.trim() || "Hotel Al Safa International",
              title: slideForm.title.trim(),
              isActive: slideForm.isActive ?? true,
            },
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update slide.");
      }

      setSlideModalOpen(false);
      await fetchDashboardData();
    } catch (err: any) {
      setSlideFormError(err.message || "Failed to save slide.");
    } finally {
      setSlideSubmitting(false);
    }
  };

  const handleDeleteSlide = async (slide: HeroSlideData) => {
    if (!confirm(`Are you sure you want to delete this slide: "${slide.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/hero-slides?id=${encodeURIComponent(slide.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete slide.");
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete slide.");
    }
  };

  const handleMoveSlide = async (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlidesList.length) return;

    const reordered = [...heroSlidesList];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    setHeroSlidesList(reordered);

    try {
      await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", slides: reordered }),
      });
    } catch (err) {
      console.warn("Failed to persist slide reorder:", err);
      await fetchDashboardData();
    }
  };

  const handleResetSlides = async () => {
    if (!confirm("Are you sure you want to restore the default 5 curated hero slides?")) {
      return;
    }

    try {
      const res = await fetch("/api/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.slides) {
        setHeroSlidesList(data.slides);
      }
      await fetchDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to reset slides.");
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

  // Admin Authentication Screen
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
              HOTEL AL SAFA INTERNATIONAL
            </h1>
            <p className="text-xs text-gold-400 uppercase tracking-widest font-semibold mt-1">
              Admin & Staff Security Access
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>Username</span>
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Enter username (e.g. admin)"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Password</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gold-400 text-[11px] flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-gold-500 pr-10 font-mono"
                />
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-950/60 p-3 rounded-xl border border-red-800 text-center">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold py-3 rounded-xl transition text-sm shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>

            {/* Quick Helper Credentials Note */}
            <div className="p-3 bg-[#111c33] rounded-xl border border-gold-500/20 text-[11px] text-gray-400 text-center space-y-0.5">
              <span className="text-gold-300 font-semibold block">Default System Credentials</span>
              <span>Username: <strong className="text-white font-mono">admin</strong> &bull; Password: <strong className="text-white font-mono">admin123</strong></span>
            </div>
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
          {currentUser && (
            <div className="flex items-center gap-2 bg-[#141f36] border border-gray-700/80 px-3 py-1.5 rounded-xl text-xs shadow-sm">
              <div className="w-6 h-6 rounded-lg bg-gold-400/20 text-gold-400 flex items-center justify-center font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="font-bold text-white block leading-none">
                  {currentUser.name || currentUser.username}
                </span>
                <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider">
                  {currentUser.role === "SUPER_ADMIN"
                    ? "Super Admin"
                    : currentUser.role === "ADMIN"
                    ? "Admin"
                    : "Staff"}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelfNewPassword("");
                  setSelfConfirmPassword("");
                  setSelfPasswordError("");
                  setSelfPasswordSuccess("");
                  setSelfPasswordModalOpen(true);
                }}
                title="Change My Password"
                className="ml-1 p-1 text-gray-400 hover:text-gold-400 hover:bg-gray-800 rounded transition"
              >
                <Key className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 bg-[#141f36] hover:bg-[#1a2948] text-gray-300 text-xs px-3 py-2 rounded-xl border border-gray-700 transition"
            title="Refresh dashboard records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-gold-400" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 text-xs px-3 py-2 rounded-xl border border-gold-500/30 transition"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/30 border border-transparent hover:border-red-800/40 rounded-xl transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
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

        {/* Navigation Tabs Bar */}
        <div className="bg-[#0b1220] border border-gray-800 p-2 rounded-2xl shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "BOOKINGS" as const, label: "Reservations", count: bookings.length, icon: Calendar },
              { id: "ROOMS" as const, label: "Rooms & Pricing", count: rooms.length, icon: Bed },
              { id: "HERO_SLIDES" as const, label: "Hero Sliding Images", count: heroSlidesList.length, icon: Sparkles },
              { id: "ADMIN_USERS" as const, label: "Admin Users", count: adminUsers.length, icon: Shield },
              { id: "INQUIRIES" as const, label: "Inquiries", count: inquiries.length, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                    isActive
                      ? "bg-gradient-to-r from-gold-500 to-gold-400 text-black border-gold-300 shadow-[0_2px_12px_rgba(212,175,55,0.25)] scale-[1.02]"
                      : "bg-[#111a2d]/80 hover:bg-[#16233b] text-gray-300 hover:text-white border-gray-800/80 hover:border-gray-700"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-black" : "text-gold-400"}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold transition ${
                      isActive
                        ? "bg-black text-gold-400 border border-black/30"
                        : "bg-[#192640] text-gold-400/90 border border-gray-700/60"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
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

              <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 w-full md:w-auto">
                <div className="flex flex-wrap items-center gap-1.5">
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

                <button
                  type="button"
                  onClick={handleOpenNewBookingModal}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold text-xs shadow-md transition whitespace-nowrap ml-auto md:ml-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Reservation</span>
                </button>
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
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/80">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-14 text-center text-gray-400">
                          <div className="max-w-sm mx-auto space-y-3">
                            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto">
                              <Calendar className="w-6 h-6" />
                            </div>
                            <div className="font-semibold text-white text-sm">No Reservations Found</div>
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {searchQuery || statusFilter !== "ALL"
                                ? "No bookings match your filter criteria. Try adjusting the search term or status."
                                : "There are currently no active bookings. Create a new reservation for walk-in or phone guests."}
                            </p>
                            <div>
                              <button
                                type="button"
                                onClick={handleOpenNewBookingModal}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs shadow transition mt-1"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Create New Reservation</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#111a2d]/60 transition">
                          <td className="px-5 py-4 font-mono font-bold text-gold-400 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenBookingDetails(b)}
                              className="hover:underline text-left inline-flex items-center gap-1.5"
                            >
                              <span>{b.bookingCode}</span>
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
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{b.roomType?.name}</span>
                              {b.allottedRoom && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 font-semibold">
                                  #{b.allottedRoom}
                                </span>
                              )}
                            </div>
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
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => handleOpenBookingDetails(b)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141f36] hover:bg-gold-500/20 text-gray-300 hover:text-gold-300 border border-gray-700/80 transition text-xs font-semibold"
                                title="View Guest Details"
                              >
                                <Eye className="w-3.5 h-3.5 text-gold-400" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id, b.bookingCode, b.guestName)}
                                disabled={deletingBookingId === b.id}
                                className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/40 transition disabled:opacity-50"
                                title="Delete Reservation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
                <span>Add New Room Category</span>
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

        {/* TAB 4: HERO SLIDES MANAGER */}
        {activeTab === "HERO_SLIDES" && (
          <div className="space-y-4">
            <div className="bg-[#0b1220] p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-gold-400" />
                  <span>Homepage Hero Sliding Images</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage the rotating background slideshow on the website homepage. Upload custom photos via Cloudinary or enter image URLs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleResetSlides}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#141f36] hover:bg-[#1a2948] text-gray-300 border border-gray-700 transition"
                  title="Restore original 5 curated slides"
                >
                  Reset Defaults
                </button>
                <button
                  onClick={openCreateSlideModal}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold text-xs px-4 py-2 rounded-xl shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Slide</span>
                </button>
              </div>
            </div>

            {loadingSlides ? (
              <div className="py-16 text-center text-gray-500">Loading hero slides...</div>
            ) : heroSlidesList.length === 0 ? (
              <div className="bg-[#0b1220] p-12 text-center rounded-2xl border border-gray-800 space-y-3">
                <ImageIcon className="w-10 h-10 text-gray-600 mx-auto" />
                <h4 className="font-bold text-white text-base">No Hero Slides Added Yet</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  Click "+ Add New Slide" or "Reset Defaults" to populate the homepage slideshow.
                </p>
                <button
                  onClick={handleResetSlides}
                  className="bg-gold-500 text-black text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Load Default Slides
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {heroSlidesList.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="bg-[#0d1627] rounded-2xl border border-gray-800 overflow-hidden flex flex-col justify-between shadow-md hover:border-gold-500/40 transition group"
                  >
                    <div>
                      {/* Image Preview with Overlay */}
                      <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                        {/* Order & Active badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="bg-black/80 backdrop-blur-md text-gold-400 font-mono text-xs px-2.5 py-1 rounded-lg border border-gold-400/40 font-bold">
                            #{index + 1}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              slide.isActive
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60"
                                : "bg-gray-900/80 text-gray-400 border border-gray-700"
                            }`}
                          >
                            {slide.isActive ? "Active" : "Hidden"}
                          </span>
                        </div>

                        {/* Slide Caption inside preview */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider block truncate">
                            {slide.tag}
                          </span>
                          <h4 className="text-xs sm:text-sm font-serif font-bold text-white line-clamp-2 leading-snug mt-0.5">
                            {slide.title}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Card Controls */}
                    <div className="p-3.5 bg-[#0b1220] border-t border-gray-800/80 flex items-center justify-between gap-2">
                      {/* Order Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSlide(index, "UP")}
                          disabled={index === 0}
                          title="Move Slide Up"
                          className="p-1.5 rounded-lg bg-[#141f36] hover:bg-[#1a2948] text-gray-300 disabled:opacity-30 disabled:hover:bg-[#141f36] transition"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSlide(index, "DOWN")}
                          disabled={index === heroSlidesList.length - 1}
                          title="Move Slide Down"
                          className="p-1.5 rounded-lg bg-[#141f36] hover:bg-[#1a2948] text-gray-300 disabled:opacity-30 disabled:hover:bg-[#141f36] transition"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Edit & Delete */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditSlideModal(slide)}
                          className="flex items-center gap-1 bg-[#141f36] hover:bg-gold-500 hover:text-black text-gray-300 text-xs px-2.5 py-1.5 rounded-lg border border-gray-700 transition"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition"
                          title="Delete slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: ADMIN USERS MANAGER */}
        {activeTab === "ADMIN_USERS" && (
          <div className="space-y-4">
            <div className="bg-[#0b1220] p-4 rounded-2xl border border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gold-400" />
                  <span>Admin & Staff Account Security</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage login usernames, secure passwords, and access privileges for hotel managers and reception staff.
                </p>
              </div>

              <button
                onClick={openCreateUserModal}
                className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold text-xs px-4 py-2 rounded-xl shadow transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add New Admin User</span>
              </button>
            </div>

            {loadingUsers ? (
              <div className="py-16 text-center text-gray-500">Loading admin accounts...</div>
            ) : adminUsers.length === 0 ? (
              <div className="bg-[#0b1220] p-12 text-center rounded-2xl border border-gray-800 space-y-3">
                <Users className="w-10 h-10 text-gray-600 mx-auto" />
                <h4 className="font-bold text-white text-base">No Users Found</h4>
              </div>
            ) : (
              <div className="bg-[#0b1220] rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0d1627] text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
                      <tr>
                        <th className="py-3 px-4">Username</th>
                        <th className="py-3 px-4">Full Name</th>
                        <th className="py-3 px-4">Role</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/80">
                      {adminUsers.map((user) => {
                        const isSelf = currentUser?.id === user.id;
                        return (
                          <tr key={user.id} className="hover:bg-[#121c31] transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-gold-400 flex items-center gap-2">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span>{user.username}</span>
                              {isSelf && (
                                <span className="bg-gold-500/20 text-gold-300 font-sans text-[10px] px-2 py-0.5 rounded-full border border-gold-500/30">
                                  You
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-white font-medium">{user.name}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  user.role === "SUPER_ADMIN"
                                    ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                                    : user.role === "ADMIN"
                                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                    : "bg-gray-800 text-gray-300 border border-gray-700"
                                }`}
                              >
                                {user.role === "SUPER_ADMIN"
                                  ? "Super Admin"
                                  : user.role === "ADMIN"
                                  ? "Administrator"
                                  : "Front Desk Staff"}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-gray-400">
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openChangePasswordModal(user)}
                                  className="flex items-center gap-1 bg-[#141f36] hover:bg-gold-500 hover:text-black text-gray-300 text-xs px-2.5 py-1.5 rounded-lg border border-gray-700 transition"
                                  title="Change password"
                                >
                                  <Key className="w-3 h-3" />
                                  <span>Change Password</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user)}
                                  disabled={isSelf || adminUsers.length <= 1}
                                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                  title={
                                    isSelf
                                      ? "Cannot delete your own active account"
                                      : adminUsers.length <= 1
                                      ? "Cannot delete last remaining admin"
                                      : "Delete user"
                                  }
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
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
                {/* Guest Profile Card */}
                <div className="bg-[#121c31] p-3.5 rounded-xl border border-gray-800 space-y-1.5">
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
                </div>

                {/* Allotted Room Assignment */}
                <div className="bg-[#121c31] p-3.5 rounded-xl border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-semibold flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5 text-gold-400" />
                      <span>Room Number Allotment:</span>
                    </span>
                    {selectedBooking.allottedRoom && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 font-bold">
                        Room #{selectedBooking.allottedRoom}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Enter room number (e.g. 204, 305)"
                      value={editAllottedRoom}
                      onChange={(e) => setEditAllottedRoom(e.target.value)}
                      className="flex-1 bg-[#18243e] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gold-500 font-mono"
                    />
                    <button
                      type="button"
                      disabled={updatingAllottedRoom}
                      onClick={() => handleSaveAllottedRoom(selectedBooking.id, editAllottedRoom)}
                      className="px-3.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                    >
                      {updatingAllottedRoom ? "Saving..." : "Save Room"}
                    </button>
                  </div>
                </div>

                {/* Quick Status Adjustments */}
                <div className="grid grid-cols-2 gap-3 bg-[#121c31] p-3.5 rounded-xl border border-gray-800">
                  <div>
                    <label className="text-gray-400 text-[11px] block mb-1">Reservation Status</label>
                    <select
                      value={selectedBooking.status}
                      onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value)}
                      className="w-full bg-[#18243e] border border-gray-700 text-xs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CHECKED_IN">CHECKED_IN</option>
                      <option value="CHECKED_OUT">CHECKED_OUT</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-[11px] block mb-1">Payment Status</label>
                    <select
                      value={selectedBooking.paymentStatus}
                      onChange={(e) => handleUpdatePaymentStatus(selectedBooking.id, e.target.value)}
                      className={`w-full text-xs font-bold rounded-lg px-2.5 py-1.5 border focus:outline-none ${
                        selectedBooking.paymentStatus === "PAID"
                          ? "bg-emerald-950/70 border-emerald-600 text-emerald-300"
                          : "bg-amber-950/70 border-amber-600 text-amber-300"
                      }`}
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>

                {/* Dates & Room Info */}
                <div className="grid grid-cols-2 gap-3 bg-[#121c31] p-3.5 rounded-xl border border-gray-800">
                  <div>
                    <span className="text-gray-500 block">Room Category</span>
                    <span className="font-medium text-white">{selectedBooking.roomType?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Occupancy</span>
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

                {/* Billing Summary */}
                <div className="bg-[#121c31] p-3.5 rounded-xl border border-gray-800 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="font-mono font-semibold text-white uppercase">{selectedBooking.paymentMethod}</span>
                  </div>
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
                  <div className="bg-[#121c31] p-3.5 rounded-xl border border-gray-800">
                    <span className="text-gray-400 font-semibold block mb-1">
                      Guest Notes & Requests:
                    </span>
                    <p className="text-gray-200">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => handleDeleteBooking(selectedBooking.id, selectedBooking.bookingCode, selectedBooking.guestName)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-800/60 transition text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
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

        {/* MODAL: CREATE NEW RESERVATION */}
        {newBookingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-hidden">
            <div className="bg-[#0e1627] border border-gold-500/40 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 shrink-0 bg-[#0b1220]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-snug">
                      New Reservation / Walk-In
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Create guest booking, assign room number, and record payment
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNewBookingModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleCreateBookingSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  {newBookingError && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{newBookingError}</span>
                    </div>
                  )}

                  {/* Section 1: Guest Information */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Guest Contact & Identity</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-300 block mb-1 font-semibold">
                          Guest Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Tanvir Ahmed"
                          value={newBookingForm.guestName}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, guestName: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 block mb-1 font-semibold">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +880 1711-000000"
                          value={newBookingForm.guestPhone}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, guestPhone: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="guest@example.com"
                          value={newBookingForm.guestEmail}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, guestEmail: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">NID or Passport #</label>
                        <input
                          type="text"
                          placeholder="e.g. 198547281923"
                          value={newBookingForm.guestNidPassport}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, guestNidPassport: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-gray-400 block mb-1">Permanent Address</label>
                        <input
                          type="text"
                          placeholder="House/Road, Thana, District"
                          value={newBookingForm.permanentAddress}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, permanentAddress: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Room & Dates */}
                  <div className="space-y-3 pt-3 border-t border-gray-800">
                    <h4 className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Bed className="w-3.5 h-3.5" />
                      <span>Room Selection & Dates</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-300 block mb-1 font-semibold">
                          Room Category <span className="text-red-400">*</span>
                        </label>
                        <select
                          required
                          value={newBookingForm.roomTypeId}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, roomTypeId: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        >
                          <option value="" disabled>Select room category...</option>
                          {rooms.map((rm) => (
                            <option key={rm.id} value={rm.id}>
                              {rm.name} ({rm.isAc ? "AC" : "Non-AC"}) — ৳{rm.basePrice.toLocaleString()}/night
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1 font-semibold">
                          Allotted Room Number (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 204, 301, Suite-A"
                          value={newBookingForm.allottedRoom}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, allottedRoom: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 block mb-1 font-semibold">
                          Check-In Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newBookingForm.checkIn}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, checkIn: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-300 block mb-1 font-semibold">
                          Check-Out Date <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={newBookingForm.checkOut}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, checkOut: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Adults</label>
                        <input
                          type="number"
                          min={1}
                          max={10}
                          value={newBookingForm.adults}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, adults: Number(e.target.value) })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Children</label>
                        <input
                          type="number"
                          min={0}
                          max={10}
                          value={newBookingForm.children}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, children: Number(e.target.value) })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Add-ons & Charges */}
                  <div className="space-y-3 pt-3 border-t border-gray-800">
                    <h4 className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Add-ons & Options</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="flex items-center gap-2 p-3 bg-[#131d33] border border-gray-700 rounded-xl cursor-pointer hover:border-gold-500/50 transition">
                        <input
                          type="checkbox"
                          checked={newBookingForm.extraBed}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, extraBed: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 bg-gray-900 border-gray-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">Extra Bed Setup</span>
                          <span className="text-[10px] text-gray-400">+৳500 per night</span>
                        </div>
                      </label>
                      <label className="flex items-center gap-2 p-3 bg-[#131d33] border border-gray-700 rounded-xl cursor-pointer hover:border-gold-500/50 transition">
                        <input
                          type="checkbox"
                          checked={newBookingForm.breakfast}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, breakfast: e.target.checked })
                          }
                          className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 bg-gray-900 border-gray-700"
                        />
                        <div>
                          <span className="font-semibold text-white block">Buffet / Plated Breakfast</span>
                          <span className="text-[10px] text-gray-400">+৳450 per guest / night</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Section 4: Payment & Status */}
                  <div className="space-y-3 pt-3 border-t border-gray-800">
                    <h4 className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Payment & Operational Status</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Payment Method</label>
                        <select
                          value={newBookingForm.paymentMethod}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, paymentMethod: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 uppercase font-mono text-[11px]"
                        >
                          <option value="PAY_AT_HOTEL">Pay At Hotel</option>
                          <option value="BKASH">bKash</option>
                          <option value="NAGAD">Nagad</option>
                          <option value="CARD">Credit/Debit Card</option>
                          <option value="BANK_TRANSFER">Bank Transfer</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Payment Status</label>
                        <select
                          value={newBookingForm.paymentStatus}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, paymentStatus: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 font-bold text-[11px]"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="REFUNDED">REFUNDED</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Reservation Status</label>
                        <select
                          value={newBookingForm.status}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, status: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 font-semibold text-[11px]"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="CHECKED_IN">CHECKED_IN</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Special Notes & Pricing Summary */}
                  <div className="space-y-3 pt-3 border-t border-gray-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 block mb-1">Special Requests or Staff Notes</label>
                        <textarea
                          rows={2}
                          placeholder="e.g. Airport shuttle request, high floor, extra pillow"
                          value={newBookingForm.specialRequests}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, specialRequests: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-gold-500 resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 block mb-1">Custom Total Amount (BDT)</label>
                        <input
                          type="number"
                          placeholder="Auto-calculated if empty"
                          value={newBookingForm.customTotalAmount}
                          onChange={(e) =>
                            setNewBookingForm({ ...newBookingForm, customTotalAmount: e.target.value })
                          }
                          className="w-full bg-[#131d33] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-gold-500 font-mono"
                        />
                        <span className="text-[10px] text-gray-500 mt-1 block">
                          Leave empty to use automatic calculation.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 px-6 bg-[#0b1220] border-t border-gray-800 flex items-center justify-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setNewBookingModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={newBookingSubmitting}
                    className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-5 py-2.5 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    {newBookingSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Creating Reservation...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
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
        {/* MODAL: CREATE / EDIT HERO SLIDE */}
        {slideModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-hidden">
            <div className="bg-[#0e1627] border border-gold-500/40 rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0b1220]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-white leading-snug">
                      {slideModalMode === "CREATE" ? "Add Hero Slide" : "Edit Hero Slide"}
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Slides are displayed in Ken Burns animation on the public homepage.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSlideModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSlideFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                {slideFormError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{slideFormError}</span>
                  </div>
                )}

                {/* Image Upload Area */}
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    Hero Slide Image *
                  </label>

                  {/* Image Preview if available */}
                  {slideForm.image && (
                    <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3 border border-gray-700 bg-gray-900">
                      <Image
                        src={slideForm.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 text-white text-xs truncate">
                        <span className="text-[10px] text-gold-400 font-semibold uppercase block">
                          Current Preview
                        </span>
                        <span className="font-bold">{slideForm.title || "No Title Yet"}</span>
                      </div>
                    </div>
                  )}

                  {/* Cloudinary Drag & Drop Uploader */}
                  <label className="border-2 border-dashed border-gray-700 hover:border-gold-500/80 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-[#141f36]/50 group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlideImageUpload}
                      disabled={uploadingSlideImage}
                      className="hidden"
                    />
                    <UploadCloud className="w-7 h-7 text-gold-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-white text-xs">
                      {uploadingSlideImage ? "Uploading to Cloudinary..." : "Click or drag to upload slide photo"}
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      JPG, PNG, WebP up to 10MB (Stored on Cloudinary CDN)
                    </span>
                  </label>

                  {uploadSlideError && (
                    <p className="text-red-400 text-[11px] mt-1">{uploadSlideError}</p>
                  )}

                  {/* Or Manual URL Input */}
                  <div className="mt-2.5">
                    <label className="block text-gray-500 text-[10px] uppercase font-bold mb-1">
                      Or direct Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={slideForm.image || ""}
                      onChange={(e) => setSlideForm((prev) => ({ ...prev, image: e.target.value }))}
                      className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                {/* Tag Badge */}
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    Top Sub-heading / Tag *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Airport Transit Hotel & Luxury Facade"
                    value={slideForm.tag || ""}
                    onChange={(e) => setSlideForm((prev) => ({ ...prev, tag: e.target.value }))}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Headline Title */}
                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    Main Headline Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Your Peaceful Haven Just 5 Minutes from Dhaka Airport"
                    value={slideForm.title || ""}
                    onChange={(e) => setSlideForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="slide-active"
                    checked={slideForm.isActive ?? true}
                    onChange={(e) => setSlideForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded text-gold-500 focus:ring-0 bg-gray-900 border-gray-700"
                  />
                  <label htmlFor="slide-active" className="text-gray-300 font-medium cursor-pointer">
                    Display this slide in the active homepage slider
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSlideModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={slideSubmitting || uploadingSlideImage}
                    className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-5 py-2 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{slideSubmitting ? "Saving..." : "Save Slide"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: CREATE / CHANGE PASSWORD ADMIN USER */}
        {userModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-[#0e1627] border border-gold-500/40 rounded-2xl max-w-md w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0b1220]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                    {userModalMode === "CREATE" ? <UserPlus className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-white leading-snug">
                      {userModalMode === "CREATE" ? "Add New Admin User" : `Change Password: ${userForm.username}`}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUserFormSubmit} className="p-6 space-y-4 text-xs">
                {userFormError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{userFormError}</span>
                  </div>
                )}

                {userModalMode === "CREATE" && (
                  <>
                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Username * (login name)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. manager_rahim"
                        value={userForm.username}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            username: e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""),
                          }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Staff / Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Md. Rahim Khan"
                        value={userForm.name}
                        onChange={(e) => setUserForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                        Role Privileges *
                      </label>
                      <select
                        value={userForm.role}
                        onChange={(e) =>
                          setUserForm((prev) => ({
                            ...prev,
                            role: e.target.value as "SUPER_ADMIN" | "ADMIN" | "STAFF",
                          }))
                        }
                        className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500"
                      >
                        <option value="ADMIN">Administrator (Standard Manager)</option>
                        <option value="STAFF">Front Desk Staff</option>
                        <option value="SUPER_ADMIN">Super Administrator (Full Privileges)</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    {userModalMode === "CREATE" ? "Account Password *" : "New Password *"} (min. 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={userForm.password}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-gray-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setUserModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={userSubmitting}
                    className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-5 py-2 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>
                      {userSubmitting
                        ? "Saving..."
                        : userModalMode === "CREATE"
                        ? "Create User"
                        : "Update Password"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: SELF PASSWORD CHANGE (HEADER TRIGGER) */}
        {selfPasswordModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            <div className="bg-[#0e1627] border border-gold-500/40 rounded-2xl max-w-md w-full text-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800 bg-[#0b1220]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-white leading-snug">
                      Change My Password
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Logged in as: <strong>{currentUser?.username}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelfPasswordModalOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSelfPasswordSubmit} className="p-6 space-y-4 text-xs">
                {selfPasswordError && (
                  <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{selfPasswordError}</span>
                  </div>
                )}
                {selfPasswordSuccess && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{selfPasswordSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    New Password * (min. 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={selfNewPassword}
                    onChange={(e) => setSelfNewPassword(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 uppercase font-bold mb-1.5 text-[11px]">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={selfConfirmPassword}
                    onChange={(e) => setSelfConfirmPassword(e.target.value)}
                    className="w-full bg-[#141f36] border border-gray-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-gold-500 font-mono"
                  />
                </div>

                <div className="pt-3 border-t border-gray-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelfPasswordModalOpen(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={selfPasswordSubmitting}
                    className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-black font-bold px-5 py-2 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{selfPasswordSubmitting ? "Updating..." : "Update Password"}</span>
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
