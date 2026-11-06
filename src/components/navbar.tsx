"useclient";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, MessageCircle, Menu, X, Calendar, ShieldCheck } from "lucide-react";

export function TopBar() {
  return (
    <div className="bg-[#070b14] text-gray-300 text-xs border-b border-[#20293a] py-2 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[13px]">
          <a
            href="tel:+8801894782070"
            className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-gold-400" />
            <span>+880 1894-782070 / +880 1711-000000</span>
          </a>
          <span className="hidden md:inline text-gray-600">|</span>
          <a
            href="mailto:info@hotelalsafabd.com"
            className="hidden sm:flex items-center gap-1.5 hover:text-gold-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            <span>info@hotelalsafabd.com</span>
          </a>
          <span className="hidden md:inline text-gray-600">|</span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Ashkona, Hajj Camp Road, Airport, Dhaka-1230</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1.5 text-gold-400/90 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>24/7 Front Desk & Airport Shuttle</span>
          </div>
          <a
            href="https://wa.me/8801894782070?text=Hello%20Hotel%20Al%20Safa,%20I%20would%20like%20to%20inquire%20about%20room%20availability"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </a>
          <Link
            href="/admin"
            className="text-gray-400 hover:text-gold-400 text-xs px-2 py-0.5 rounded border border-gray-700 hover:border-gold-500 transition-colors"
          >
            Staff Portal
          </Link>
        </div>
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
    { label: "Rooms & Suites", href: "/#rooms" },
    { label: "Amenities", href: "/#amenities" },
    { label: "Dining", href: "/#dining" },
    { label: "Location", href: "/#location" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-nav shadow-xl border-b border-gold-500/20 py-2"
          : "bg-[#0b111e] py-3.5 border-b border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="relative h-12 w-16 md:h-14 md:w-20 flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
            <Image
              src="/logo.png"
              alt="Hotel Al Safa Logo"
              fill
              className="object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.35)]"
              priority
            />
          </div>
          <div>
            <span className="text-xl md:text-2xl font-serif font-bold text-white tracking-wide block leading-none group-hover:text-gold-300 transition-colors">
              HOTEL AL SAFA
            </span>
            <span className="text-[10px] md:text-[11px] text-gold-400 tracking-[0.22em] uppercase font-semibold block mt-1">
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

        {/* Right Action Trigger */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-500 text-black font-semibold px-5 py-2.5 rounded-full text-sm shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Online</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
