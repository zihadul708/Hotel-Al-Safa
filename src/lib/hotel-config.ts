// Hotel Al Safa - Central Contact & Payment Configuration

export const HOTEL_CONFIG = {
  name: "Hotel Al Safa",
  tagline: "Luxury Transit & Suites • Dhaka",
  address: "Mili Super Tower-2, Ashkona, Hajj Camp Road, Dakshinkhan, Dhaka-1230",

  // Official WhatsApp & Phone
  whatsappNumber: "8801916944212",
  phonePrimary: "+880 1916-944212",
  phoneDisplay: "+880 1916-944212",
  email: "hotelalsafainternational1@gmail.com",

  // Official Payment Accounts
  payments: {
    bkashMerchant: {
      number: "01615383839",
      type: "Payment / Merchant",
      instructions: "bKash App ➔ Make Payment ➔ 01615383839",
    },
    bkashPersonal: {
      number: "01965900482",
      type: "Personal",
      instructions: "bKash App ➔ Send Money ➔ 01965900482",
    },
    nagadPersonal: {
      number: "01615383839",
      type: "Personal",
      instructions: "Nagad App ➔ Send Money ➔ 01615383839",
    },
    bank: {
      bankName: "Dutch-Bangla Bank Limited (DBBL)",
      accountName: "HOTEL-AL-SAFA (INT.) ABASIK",
      accountNumber: "2021100017423",
      routingCode: "090260205",
      branch: "Payable at any Branch",
      instructions: "Transfer via DBBL NexusPay, NPSB, BEFTN, or Branch Deposit",
    },
  },
};

/**
 * Returns the formatted WhatsApp URL with pre-filled message
 */
export function getWhatsAppUrl(message?: string): string {
  const cleanNumber = HOTEL_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
  const textQuery = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${cleanNumber}${textQuery}`;
}
