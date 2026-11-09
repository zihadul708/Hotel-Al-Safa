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
} from "lucide-react";

export function Footer() {
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
              <p className="text-xs text-gray-400">Complimentary shuttle available</p>
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
        {/* Col 1: About & Logo */}
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
          <div className="pt-2 text-xs text-gold-400/90 font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Government & Tourism Approved</span>
          </div>
        </div>

        {/* Col 2: Accommodations */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide border-b border-gray-800 pb-2">
            Rooms & Suites
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/rooms/couple-ac-deluxe" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Couple AC Deluxe Room (৳3,500)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms/couple-non-ac-economy" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Couple Economy Non-AC (৳1,400)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms/super-deluxe-twin" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Super Deluxe Twin Bed AC (৳4,800)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms/executive-family-suite" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>Executive Royal Family Suite (৳6,500)</span>
              </Link>
            </li>
            <li>
              <Link href="/rooms/presidential-al-safa-suite" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gold-400" />
                <span>The Al Safa Presidential Suite (৳9,500)</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Key Features & Services */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide border-b border-gray-800 pb-2">
            Hotel Services
          </h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Airport Pickup & Drop Arrangement</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>24-Hour Hot & Cold Water (Geyser)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>On-Site Halal Restaurant & Cafe</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Continuous Generator Power Backup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>Secure Luggage Cloakroom</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              <span>CCTV Security & Fire Safety Compliant</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Contact & Location */}
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-white font-bold tracking-wide border-b border-gray-800 pb-2">
            Reach Us
          </h3>
          <div className="space-y-2.5 text-sm text-gray-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
              <span>Haji Komoruddin Tower, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href="tel:+8801894782070" className="hover:text-gold-400">
                +880 1894-782070
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <a href="mailto:info@hotelalsafabd.com" className="hover:text-gold-400">
                info@hotelalsafabd.com
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Hotel Al Safa Dhaka. All Rights Reserved.</p>
          <p className="text-gray-400">
            Engineered & Designed by{" "}
            <a
              href="https://www.crafix.tech/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:underline font-semibold"
            >
              Crafix Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
