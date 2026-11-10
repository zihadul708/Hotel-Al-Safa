"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UtensilsCrossed,
  Clock,
  Coffee,
  CheckCircle2,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { TopBar, Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingActions } from "@/components/whatsapp-button";
import { BookingModal } from "@/components/booking-modal";

export default function DiningPage() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<"BREAKFAST" | "DHAKA" | "CHINESE" | "BEVERAGES">("DHAKA");

  const menuItems = {
    BREAKFAST: [
      {
        name: "Royal Desi Breakfast Platter",
        price: "৳350",
        description: "2 Crispy ghee parathas, aromatic mixed vegetable bhaji, egg omelette/poach, and hot ginger milk tea.",
        badge: "Most Popular",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Continental Morning Tray",
        price: "৳450",
        description: "Toasted sliced bread, French butter, strawberry preserve, scrambled eggs, chicken sausage, and brewed coffee.",
        badge: "Transit Favorite",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Old Dhaka Shahi Nehari & Naan",
        price: "৳550",
        description: "Slow-simmered rich bone marrow stew infused with traditional herbs, served with fluffy tandoori naan (Fri & Sat special).",
        badge: "Weekend Special",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    DHAKA: [
      {
        name: "Old Dhaka Mutton Kacchi Biryani",
        price: "৳680",
        description: "Fragrant Chinigura rice layered with tender marinated mutton cuts, golden potatoes, boiled egg, and tangy Borhani sauce.",
        badge: "Chef Signature",
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Traditional Shahi Morog Polao",
        price: "৳520",
        description: "Aromatic Basmati rice pilaf cooked with tender farm chicken leg, caramelized onions (beresta), and boiled egg.",
        badge: "Guest Choice",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Dhaka Mustard Ilish / Rui Fish Curry",
        price: "৳600",
        description: "Fresh Padma river fish simmered in pungent mustard and green chili gravy, served with piping hot steamed rice.",
        badge: "Local Authentic",
        image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Slow-Cooked Handi Beef Bhuna",
        price: "৳480",
        description: "Tender beef cubes braised in dark roasted spices, ginger paste, and whole garlic pods. Perfect with rumali roti.",
        badge: "Spicy & Rich",
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80",
      },
    ],
    CHINESE: [
      {
        name: "Bangla-Chinese Chicken Fried Rice & Chili Chicken",
        price: "৳580",
        description: "Wok-tossed egg fried rice paired with spicy saucy Indo-Chinese chicken gravy and fresh cucumber salad.",
        badge: "Quick Transit Meal",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Sizzling Garlic Beef Chowmein",
        price: "৳450",
        description: "Stir-fried egg noodles with tender beef strips, crunchy bell peppers, cabbage, and roasted garlic soya sauce.",
        badge: "Fast & Tasty",
        image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Triple-Layer Club Sandwich with Fries",
        price: "৳380",
        description: "Grilled chicken, fried egg, cheese slices, and crisp lettuce between toasted white bread, served with crinkle-cut fries.",
        badge: "24/7 Room Service",
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
      },
    ],
    BEVERAGES: [
      {
        name: "Dhaka Shahi Malai Dudh Cha (Milk Tea)",
        price: "৳80",
        description: "Rich, creamy tea simmered with cardamom, cloves, and fresh thick milk cream.",
        badge: "All-Day Comfort",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Fresh Seasonal Mango / Green Papaya Juice",
        price: "৳180",
        description: "Cold-pressed fresh fruit juice without artificial colors or preservatives.",
        badge: "Fresh & Chilled",
        image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Creamy Sweet Lassi / Shahi Borhani",
        price: "৳160",
        description: "Traditional yogurt digestive beverage blended with mint, cumin, black salt, and coriander.",
        badge: "Traditional Digestion",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <TopBar />
      <Navbar onOpenBooking={() => setBookingModalOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-28 bg-[#090f1d] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2000&q=80"
              alt="Dining at Hotel Al Safa"
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090f1d] via-[#090f1d]/75 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-400/20 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Halal Certified Kitchen & 24/7 Room Service</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              Gourmet Dining & Culinary Excellence
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Savor authentic Bangladeshi delicacies, hearty breakfast buffets, and international transit
              meals freshly prepared around the clock by our dedicated culinary team.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold px-6 py-3 rounded-full text-xs sm:text-sm shadow-lg hover:scale-105 transition"
              >
                Book Stay With Breakfast
              </button>
            </div>
          </div>
        </section>

        {/* 4 Dining Pillars */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-2">
                <UtensilsCrossed className="w-6 h-6 text-gold-600" />
                <h3 className="font-serif font-bold text-gray-900">100% Halal Guaranteed</h3>
                <p className="text-xs text-gray-600">
                  Strictly halal ingredients and separate preparation standards suitable for all Muslim guests and pilgrims.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-2">
                <Clock className="w-6 h-6 text-gold-600" />
                <h3 className="font-serif font-bold text-gray-900">24/7 In-Room Dining</h3>
                <p className="text-xs text-gray-600">
                  Late-night flight arrivals can enjoy hot soups, biryani, and sandwiches delivered right to their suite anytime.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-2">
                <Coffee className="w-6 h-6 text-gold-600" />
                <h3 className="font-serif font-bold text-gray-900">Transit Breakfast Buffet</h3>
                <p className="text-xs text-gray-600">
                  Early breakfast served starting from 6:00 AM for guests catching morning flights at Hazrat Shahjalal Airport.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/50 space-y-2">
                <Sparkles className="w-6 h-6 text-gold-600" />
                <h3 className="font-serif font-bold text-gray-900">Group Catering & Hajj Meals</h3>
                <p className="text-xs text-gray-600">
                  Special customized dining packages available for Umrah and Hajj groups traveling through Ashkona Hajj Camp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Showcase Tabs */}
        <section className="py-16 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold-600 font-bold">
              Culinary Selections
            </span>
            <h2 className="text-3xl font-serif font-bold text-gray-900">
              Explore Our Signature Dishes
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Prepared fresh to order using premium ghee, basmati rice, farm poultry, and fresh seasonal spices.
            </p>

            {/* Menu Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {[
                { label: "Dhaka Specialties & Biryani", value: "DHAKA" },
                { label: "Breakfast & Morning Platters", value: "BREAKFAST" },
                { label: "Chinese & Fast Bites", value: "CHINESE" },
                { label: "Beverages & Tea", value: "BEVERAGES" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveMenuTab(tab.value as any)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition ${
                    activeMenuTab === tab.value
                      ? "bg-[#0b111e] text-gold-400 shadow-md"
                      : "bg-white text-gray-600 hover:text-black border border-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems[activeMenuTab].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-gray-900">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <div className="absolute top-3 left-3 bg-[#0b1220]/90 text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-gold-500/40">
                      {item.badge}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/85 text-white font-bold text-sm px-3 py-1 rounded-lg border border-gold-500/30">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-base text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <div className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 py-2 rounded-xl">
                    <span>Dial #0 for 24h Room Service</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timings & Room Service Strip */}
        <section className="bg-[#0b1220] text-white py-12 px-4 border-t border-gray-800">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
            <div>
              <span className="text-xs text-gold-400 uppercase tracking-widest font-semibold block">
                24/7 Culinary Service
              </span>
              <h3 className="text-2xl font-serif font-bold mt-1">
                Room Service Is Just a Call Away
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-lg">
                Dial extension <span className="text-white font-bold">#0</span> from your in-room intercom or reach our front kitchen desk directly at +880 1894-782070.
              </p>
            </div>
            <a
              href="tel:+8801894782070"
              className="bg-gold-500 hover:bg-gold-400 text-black font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 flex-shrink-0"
            >
              <Phone className="w-4 h-4" />
              <span>Call Room Service</span>
            </a>
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
