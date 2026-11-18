"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Sparkles, Menu, X, Calendar } from "lucide-react";
import { HOTEL_CONFIG } from "@/lib/hotel-config";

export function TopBar() {
  return (
    <div className="bg-[#070b14] text-gray-300 text-xs border-b border-[#1a2333] py-2 overflow-hidden">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center flex-shrink-0">
            <span className="flex items-center gap-1.5 px-6 whitespace-nowrap font-semibold text-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Welcome To Hotel Al Safa International
            </span>
            <span className="text-gray-600 px-2">|</span>
            <a
              href={`tel:${HOTEL_CONFIG.phonePrimary}`}
              className="flex items-center gap-1.5 px-6 whitespace-nowrap hover:text-gold-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              {HOTEL_CONFIG.phoneDisplay}
            </a>
            <span className="text-gray-600 px-2">|</span>
            <a
              href={`mailto:${HOTEL_CONFIG.email}`}
              className="flex items-center gap-1.5 px-6 whitespace-nowrap hover:text-gold-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-gold-400" />
              {HOTEL_CONFIG.email}
            </a>
            <span className="text-gray-600 px-2">|</span>
            <span className="flex items-center gap-1.5 px-6 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              Mili Super Tower-2, Ashkona, Dhaka-1230
            </span>
            <span className="text-gray-600 px-2">|</span>
            <span className="flex items-center gap-1.5 px-6 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              24/7 Front Desk & Concierge
            </span>
            <span className="text-gray-600 px-2">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Navbar({ onOpenBooking }: { onOpenBooking?: () => void }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/#story" },
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Location", href: "/#location" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav shadow-xl border-b border-gold-500/20 py-2"
          : "bg-[#0b111e] py-2.5 sm:py-3.5 border-b border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
          <div className="relative h-10 w-12 sm:h-12 sm:w-16 md:h-14 md:w-20 flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
            <Image
              src="/logo.png"
              alt="Hotel Al Safa Logo"
              fill
              className="object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]"
              priority
            />
          </div>
          <div>
            <span className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-white tracking-wide block leading-tight group-hover:text-gold-300 transition-colors">
              HOTEL AL SAFA
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] text-gold-400 tracking-[0.16em] sm:tracking-[0.22em] uppercase font-semibold block mt-0.5">
              Luxury Transit & Suites • Dhaka
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-200 hover:text-gold-400 transition-colors uppercase tracking-wider relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Right Actions: Desktop & Mobile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-black font-bold px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-md shadow-gold-500/20 active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Book Online</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1d] border-b border-gray-800 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-200 hover:text-gold-400 font-medium text-base py-2 border-b border-gray-800/60 uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBooking) onOpenBooking();
              }}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-400 text-black font-bold py-3 rounded-xl shadow-md text-base"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Online (Instant Confirmation)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
