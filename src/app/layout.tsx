import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hotel Al Safa | Premier Airport Transit & Suites Dhaka",
  description:
    "Experience refined comfort and luxury at Hotel Al Safa, Dhaka. Located just 5 minutes from Hazrat Shahjalal International Airport & Ashkona Hajj Camp. Instant direct online booking with bKash, Nagad, and Cards.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Hotel Al Safa | Luxury Transit Hotel & Suites Dhaka",
    description: "5 Minutes from Dhaka Airport & Hajj Camp. Direct online reservations.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}>
      <body className="antialiased bg-[#fdfbf7] text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
