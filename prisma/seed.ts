import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Hotel Al Safa database...");

  // Clear existing records
  await prisma.inquiry.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomType.deleteMany();

  const rooms = [
    {
      slug: "couple-ac-deluxe",
      name: "Couple AC Deluxe Room",
      category: "Couple",
      isAc: true,
      basePrice: 3500,
      capacity: 2,
      bedType: "1 Queen Size Bed",
      sizeSqFt: 240,
      description:
        "Designed for couples and transit travelers seeking comfort and peace. Features modern split-air conditioning, high-speed Wi-Fi, en-suite bathroom with 24/7 hot geyser, and cozy ambient lighting.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Split Air Conditioner",
        "Free High-Speed Wi-Fi",
        "En-suite Bathroom & Hot Water Geyser",
        "32\" LED Smart TV",
        "Complimentary Toiletries & Towels",
        "Room Service & Intercom",
        "Electric Kettle & Tea Setup",
        "Work Desk & Chair",
      ]),
      featured: true,
      availableUnits: 8,
    },
    {
      slug: "couple-non-ac-economy",
      name: "Couple Economy Room (Non-AC)",
      category: "Economy",
      isAc: false,
      basePrice: 1400,
      capacity: 2,
      bedType: "1 Double Bed",
      sizeSqFt: 200,
      description:
        "Affordable, clean, and ventilated accommodation tailored for budget-conscious transit passengers, short-stay travelers, and Hajj/Umrah pilgrims. Complete with fresh linens and attached bathroom.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "High-Speed Ceiling Fan & Natural Air Flow",
        "Free Wi-Fi",
        "Attached Bathroom with Shower",
        "Complimentary Bath Towels",
        "Daily Housekeeping",
        "Intercom Calling",
        "Luggage Storage",
      ]),
      featured: false,
      availableUnits: 6,
    },
    {
      slug: "super-deluxe-twin",
      name: "Super Deluxe Twin Bed AC",
      category: "Deluxe",
      isAc: true,
      basePrice: 4800,
      capacity: 3,
      bedType: "2 Twin Large Beds",
      sizeSqFt: 310,
      description:
        "Spacious luxury room ideal for friends, colleagues, or small families. Furnished with two premium semi-double beds, large soundproof double-glazed windows, mini-fridge, and plush seating corner.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1507038772120-7ffe76f79d01?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Split Air Conditioner",
        "High-Speed Fiber Wi-Fi",
        "43\" 4K Android TV with Streaming",
        "Mini Refrigerator",
        "Hot Water Rain Shower",
        "Complimentary Buffet Breakfast",
        "Hair Dryer & Shaving Kit",
        "Airport Shuttle Assistance",
      ]),
      featured: true,
      availableUnits: 7,
    },
    {
      slug: "executive-family-suite",
      name: "Executive Royal Family Suite",
      category: "Family",
      isAc: true,
      basePrice: 6500,
      capacity: 5,
      bedType: "1 King Bed + 1 Queen Bed",
      sizeSqFt: 460,
      description:
        "Our signature family accommodation featuring dual master beds, private sitting lounge, panoramic city views, dining table, and spacious luggage wardrobes for extended holiday or pilgrim stays.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Dual Inverter ACs",
        "Ultra-Fast Dedicated Wi-Fi",
        "50\" Smart 4K TV",
        "Living Lounge & Sofa Suite",
        "Tea/Coffee Maker Bar",
        "Complimentary Breakfast for 4",
        "Luxury Toiletries & Bathrobes",
        "Free Airport Pickup / Drop-off",
      ]),
      featured: true,
      availableUnits: 4,
    },
    {
      slug: "presidential-al-safa-suite",
      name: "The Al Safa Presidential Suite",
      category: "Suite",
      isAc: true,
      basePrice: 9500,
      capacity: 4,
      bedType: "1 Grand California King Bed",
      sizeSqFt: 580,
      description:
        "The pinnacle of luxury at Hotel Al Safa. An expansive suite with handcrafted gold-accented furnishings, master bedroom, VIP lounge with leather recliners, jacuzzi bathroom, and 24-hour private butler service.",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      ]),
      amenities: JSON.stringify([
        "Jacuzzi Bathtub & Rain Shower",
        "VIP 24/7 Butler Service",
        "Complimentary Airport Limousine Transfer",
        "Full Continental & Desi Breakfast Buffet",
        "55\" OLED Cinema Display",
        "Espresso Machine & Minibar",
        "Private Balcony Terrace",
        "Complimentary Laundry Service",
      ]),
      featured: true,
      availableUnits: 2,
    },
  ];

  for (const r of rooms) {
    const created = await prisma.roomType.create({ data: r });
    console.log(`Created room: ${created.name}`);
  }

  // Fetch created rooms to link sample bookings
  const coupleRoom = await prisma.roomType.findUnique({
    where: { slug: "couple-ac-deluxe" },
  });
  const familySuite = await prisma.roomType.findUnique({
    where: { slug: "executive-family-suite" },
  });
  const twinRoom = await prisma.roomType.findUnique({
    where: { slug: "super-deluxe-twin" },
  });

  if (coupleRoom && familySuite && twinRoom) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    await prisma.booking.createMany({
      data: [
        {
          bookingCode: "ALSAFA-84291",
          guestName: "Tanvir Ahmed",
          guestEmail: "tanvir.ahmed@example.com",
          guestPhone: "+880 1711-234567",
          guestNidPassport: "1994827162910",
          checkIn: today,
          checkOut: tomorrow,
          nights: 1,
          adults: 2,
          children: 0,
          totalAmount: 3850,
          paidAmount: 3850,
          paymentStatus: "PAID",
          paymentMethod: "BKASH",
          status: "CHECKED_IN",
          airportTransfer: true,
          breakfast: true,
          specialRequests: "Arriving on flight BG-042 at 6:30 PM. Needs airport pickup.",
          roomTypeId: coupleRoom.id,
        },
        {
          bookingCode: "ALSAFA-91024",
          guestName: "Dr. Rafiqul Islam",
          guestEmail: "rafiqul.islam@hospital.edu.bd",
          guestPhone: "+880 1819-876543",
          checkIn: today,
          checkOut: dayAfter,
          nights: 2,
          adults: 4,
          children: 1,
          totalAmount: 14300,
          paidAmount: 5000,
          paymentStatus: "PENDING",
          paymentMethod: "PAY_AT_HOTEL",
          status: "CONFIRMED",
          airportTransfer: false,
          breakfast: true,
          extraBed: true,
          specialRequests: "Quiet floor preferred for family pilgrim group.",
          roomTypeId: familySuite.id,
        },
        {
          bookingCode: "ALSAFA-63821",
          guestName: "Mahbubur Rahman",
          guestEmail: "mahbub.corp@dhakatech.com",
          guestPhone: "+880 1912-349812",
          checkIn: tomorrow,
          checkOut: dayAfter,
          nights: 1,
          adults: 2,
          children: 0,
          totalAmount: 5280,
          paidAmount: 5280,
          paymentStatus: "PAID",
          paymentMethod: "NAGAD",
          status: "CONFIRMED",
          airportTransfer: false,
          breakfast: true,
          roomTypeId: twinRoom.id,
        },
      ],
    });
  }

  // Sample guest reviews
  await prisma.review.createMany({
    data: [
      {
        name: "Capt. Farhan Chowdhury",
        location: "Dhaka Airport Transit",
        rating: 5,
        comment:
          "Super convenient location right by the airport! The pickup driver was punctual, room was impeccably clean with crisp AC, and the breakfast was hot and delicious. Best transit stay in Dhaka.",
        roomName: "Couple AC Deluxe",
        date: "October 2026",
      },
      {
        name: "Haji Mohammad Yunus",
        location: "Chittagong",
        rating: 5,
        comment:
          "We stayed with family before our Umrah journey. The staff was extremely respectful and helpful. Close to Ashkona Hajj Camp and the rooms are very large and comfortable.",
        roomName: "Executive Royal Family Suite",
        date: "September 2026",
      },
      {
        name: "Sabrina Mostafa",
        location: "Sylhet",
        rating: 5,
        comment:
          "Very smooth booking directly through the website with bKash. The photos matched the actual room 100%. Hot shower, high-speed Wi-Fi, and 24h room service.",
        roomName: "Super Deluxe Twin Bed",
        date: "November 2026",
      },
    ],
  });

  // Seed Promo Codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: "ALSAFA10",
        discountPct: 10,
        discountAmt: null,
        minNights: 1,
        isActive: true,
      },
      {
        code: "TRANSIT500",
        discountPct: null,
        discountAmt: 500,
        minNights: 1,
        isActive: true,
      },
      {
        code: "WELCOME",
        discountPct: null,
        discountAmt: 300,
        minNights: 1,
        isActive: true,
      },
    ],
  });

  // Seed sample guest inquiries
  await prisma.inquiry.createMany({
    data: [
      {
        name: "Kamal Hossain",
        email: "kamal.hossain@gmail.com",
        phone: "+880 1715-998877",
        subject: "Late Night Airport Shuttle (2:30 AM arrival)",
        message: "We are arriving on flight EK-584 at 2:30 AM with 3 large suitcases. Do you offer shuttle pickup at that time?",
        status: "NEW",
      },
      {
        name: "Farhana Yasmin",
        email: "farhana.y@corporate.bd",
        phone: "+880 1819-445566",
        subject: "Executive Suite booking for 4 nights",
        message: "Can you arrange early check-in around 9:00 AM on Friday for the Executive Family Suite?",
        status: "READ",
      },
    ],
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
