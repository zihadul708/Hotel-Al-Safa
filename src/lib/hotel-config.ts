// Hotel Al Safa - Central Contact & Communication Configuration
// When you have the official WhatsApp and phone numbers for Hotel Al Safa, update them here.

export const HOTEL_CONFIG = {
  name: "Hotel Al Safa",
  tagline: "Luxury Transit & Suites • Dhaka",
  address: "Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230",

  // Set official WhatsApp number without '+' or spaces (e.g. "8801712345678").
  // Set to null while pending official number to prevent accidental redirects to other hotels.
  whatsappNumber: null as string | null,

  // Primary Phone Numbers
  phonePrimary: "+880 1894-782070", // Update with Hotel Al Safa primary number
  phoneSecondary: "+880 1711-000000",

  // Email
  email: "info@hotelalsafabd.com",
};

/**
 * Returns the formatted WhatsApp URL if configured, or null if disabled.
 */
export function getWhatsAppUrl(message?: string): string | null {
  if (!HOTEL_CONFIG.whatsappNumber) return null;
  const cleanNumber = HOTEL_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  if (!cleanNumber) return null;
  const textQuery = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanNumber}${textQuery}`;
}
