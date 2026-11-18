import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  ChevronRight,
  Plane,
  HeartHandshake,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { HOTEL_CONFIG, getWhatsAppUrl } from "@/lib/hotel-config";

// Official brand SVG icons for social media
function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export function Footer() {
  const waUrl = getWhatsAppUrl("Hello Hotel Al Safa, I would like to inquire about hotel reservations.");

  const socialLinks = [
    {
      name: "Facebook",
      href: HOTEL_CONFIG.socialLinks?.facebook || "https://www.facebook.com/hotelalsafadhaka",
      icon: FacebookIcon,
      hoverClass: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      name: "Instagram",
      href: HOTEL_CONFIG.socialLinks?.instagram || "https://www.instagram.com/hotelalsafadhaka",
      icon: InstagramIcon,
      hoverClass: "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-pink-500",
    },
    {
      name: "YouTube",
      href: HOTEL_CONFIG.socialLinks?.youtube || "https://www.youtube.com/@hotelalsafadhaka",
      icon: YouTubeIcon,
      hoverClass: "hover:bg-[#FF0000] hover:text-white hover:border-[#FF0000]",
    },
    {
      name: "WhatsApp",
      href: waUrl,
      icon: WhatsAppIcon,
      hoverClass: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
  ];

  return (
    <footer className="bg-[#060a12] text-gray-300 border-t border-gray-800 relative z-10">
      {/* Top Value Banner */}
      <div className="bg-[#0b1220] border-b border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center flex-shrink-0 text-gold-400">
              <Plane className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">5 Mins from Airport</h4>
              <p className="text-xs text-gray-400">Mili Super Tower-2, Ashkona</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center flex-shrink-0 text-gold-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 Check-in & Service</h4>
              <p className="text-xs text-gray-400">Late night arrivals welcome</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center flex-shrink-0 text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Direct Booking Guarantee</h4>
              <p className="text-xs text-gray-400">Best rate & instant verification</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center flex-shrink-0 text-gold-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Pilgrim & Transit Specialist</h4>
              <p className="text-xs text-gray-400">Hajj Camp & Umrah travel care</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Col 1: About, Logo & Social Media */}
        <div className="space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-12 w-16 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Hotel Al Safa Logo"
                fill
                className="object-contain drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]"
              />
            </div>
            <div>
              <span className="text-xl font-serif font-bold text-white tracking-wide block">HOTEL AL SAFA</span>
              <p className="text-[10px] text-gold-400 uppercase tracking-widest font-semibold mt-0.5">
                Transit Hotel & Suites
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A sanctuary of refined hospitality and comfort in Ashkona, Dhaka. Tailored for
            international transit passengers, business executives, tourists, and Hajj & Umrah
            pilgrims seeking top-tier comfort next to Hazrat Shahjalal International Airport.
          </p>
          <div className="pt-1 text-xs text-gold-400/90 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Government & Tourism Approved</span>
          </div>

          {/* Social Media Section */}
          <div className="pt-3 border-t border-gray-800/80">
            <h5 className="text-xs text-gray-400 uppercase tracking-wider mb-2.5 font-semibold flex items-center gap-1.5">
              <span>Connect With Us</span>
            </h5>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-full bg-[#111928] border border-gray-700/80 flex items-center justify-center text-gray-400 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm ${item.hoverClass}`}
                    aria-label={`Follow Hotel Al Safa on ${item.name}`}
                    title={`Follow Hotel Al Safa on ${item.name}`}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Col 2: Accommodations */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide border-b border-gray-800 pb-2">
            Rooms & Suites
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/rooms" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Deluxe (Single) AC (৳2,000)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Deluxe (Couple) AC (৳2,500)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Deluxe (Double) AC (৳3,500)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Deluxe (Family) AC (৳4,000)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Economy (Single) Non-AC (৳1,500)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>View All 10 Room Types</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Key Features & Legal Options */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide border-b border-gray-800 pb-2">
            Hotel Options & Services
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>24/7 Front Desk & Concierge</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>24-Hour Hot & Cold Water (Geyser)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>High-Speed Fiber Wi-Fi Throughout</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Continuous Generator Power Backup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Secure Luggage Storage & Cloakroom</span>
            </li>
            <li className="pt-2 border-t border-gray-800/80">
              <Link
                href="/terms"
                className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold transition-colors"
              >
                <FileText className="w-4 h-4 text-gold-400" />
                <span>Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gold-400 transition-colors flex items-center gap-1.5"
              >
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Location Guide & Help</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Reach Us & Payment Gateways */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide border-b border-gray-800 pb-2">
            Reach Us
          </h3>
          <div className="space-y-2.5 text-sm text-gray-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
              <span>Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href="tel:+8801916944212" className="hover:text-gold-400">
                +880 1916-944212
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href="mailto:hotelalsafainternational1@gmail.com" className="hover:text-gold-400 truncate">
                hotelalsafainternational1@gmail.com
              </a>
            </div>
          </div>

          <div className="pt-2">
            <h5 className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
              Accepted Payment Gateways
            </h5>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="bg-[#E2136E] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                bKash
              </span>
              <span className="bg-[#F7941D] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                Nagad
              </span>
              <span className="bg-[#006633] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                DBBL Bank
              </span>
              <span className="bg-[#1A1F71] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                VISA
              </span>
              <span className="bg-[#EB001B] text-white text-[11px] font-bold px-2.5 py-1 rounded">
                Mastercard
              </span>
              <span className="bg-emerald-800 text-white text-[11px] font-medium px-2 py-1 rounded">
                Pay on Arrival
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#04070d] py-5 px-4 border-t border-gray-900 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hotel Al Safa Dhaka. All Rights Reserved.</p>
          
          {/* Footer Option Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400">
            <Link href="/#story" className="hover:text-gold-400 transition-colors">
              Our Story
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/terms" className="hover:text-gold-400 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/contact" className="hover:text-gold-400 transition-colors">
              Contact & Location
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/rooms" className="hover:text-gold-400 transition-colors">
              Rooms & Rates
            </Link>
            <span className="text-gray-700">•</span>
            <a
              href="https://maps.google.com/?q=Hotel+Al+Safa+Mili+Super+Tower-2+Ashkona+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold-400 transition-colors"
            >
              Google Map
            </a>
          </div>

          {/* Social Icons Mini Row for Bottom Bar */}
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gold-400 transition-colors"
                  aria-label={item.name}
                  title={item.name}
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
