import { PrismaClient } from "@prisma/client";
import { INITIAL_ROOMS } from "../src/lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Hotel Al Safa database with 10 official room categories...");

  // Clear existing records
  await prisma.inquiry.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.roomType.deleteMany();

  for (const r of INITIAL_ROOMS) {
    const created = await prisma.roomType.create({
      data: {
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category,
        isAc: r.isAc,
        basePrice: r.basePrice,
        capacity: r.capacity,
        bedType: r.bedType,
        sizeSqFt: r.sizeSqFt,
        description: r.description,
        images: JSON.stringify(r.images),
        amenities: JSON.stringify(r.amenities),
        featured: r.featured,
        availableUnits: r.availableUnits,
      },
    });
    console.log(`Created room: ${created.name} (৳${created.basePrice})`);
  }

  // Fetch created rooms to link sample bookings
  const coupleRoom = await prisma.roomType.findUnique({
    where: { slug: "deluxe-couple" },
  });
  const familySuite = await prisma.roomType.findUnique({
    where: { slug: "deluxe-family" },
  });
  const twinRoom = await prisma.roomType.findUnique({
    where: { slug: "economy-twin" },
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
          totalAmount: 2500,
          paidAmount: 2500,
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
          totalAmount: 8000,
          paidAmount: 8000,
          paymentStatus: "PAID",
          paymentMethod: "BANK_TRANSFER",
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
          totalAmount: 2500,
          paidAmount: 2500,
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
          "Super convenient location right by the airport at Mili Super Tower-2! Punctual airport assistance, room was clean with split AC, and the stay was very smooth.",
        roomName: "Deluxe Couple Room (AC)",
        date: "October 2026",
      },
      {
        name: "Haji Mohammad Yunus",
        location: "Chittagong",
        rating: 5,
        comment:
          "We stayed with family before our Umrah journey. Close to Ashkona Hajj Camp and the family rooms are large and clean.",
        roomName: "Deluxe Family Suite (AC)",
        date: "September 2026",
      },
      {
        name: "Sabrina Mostafa",
        location: "Sylhet",
        rating: 5,
        comment:
          "Very smooth booking directly through the website with bKash. Hot shower, high-speed Wi-Fi, and 24h desk support.",
        roomName: "Deluxe Twin Bed Room (AC)",
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
        subject: "Deluxe Family Suite booking for 4 nights",
        message: "Can you arrange early check-in around 9:00 AM on Friday for the Deluxe Family Suite?",
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
