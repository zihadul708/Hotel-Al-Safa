import nodemailer from "nodemailer";
import { getRawAdminUsers } from "./admin-auth";
import { HOTEL_CONFIG } from "./hotel-config";

export interface BookingEmailDetails {
  bookingCode: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string | null;
  guestNidPassport?: string | null;
  permanentAddress?: string | null;
  roomName?: string | null;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  specialRequests?: string | null;
}

/**
 * Collects all unique admin recipient email addresses from:
 * 1. Admin users with an `email` field in admin-auth
 * 2. `ADMIN_NOTIFICATION_EMAILS` env var (comma-separated)
 * 3. `HOTEL_CONFIG.email` fallback
 */
export async function getAdminNotificationEmails(): Promise<string[]> {
  const emailSet = new Set<string>();

  try {
    const adminUsers = await getRawAdminUsers();
    for (const user of adminUsers) {
      if (user.email && user.email.includes("@")) {
        emailSet.add(user.email.trim().toLowerCase());
      }
    }
  } catch (err) {
    console.warn("Could not read admin users for email list:", err);
  }

  const envEmails = process.env.ADMIN_NOTIFICATION_EMAILS;
  if (envEmails) {
    for (const raw of envEmails.split(",")) {
      const cleaned = raw.trim().toLowerCase();
      if (cleaned && cleaned.includes("@")) {
        emailSet.add(cleaned);
      }
    }
  }

  if (HOTEL_CONFIG.email && HOTEL_CONFIG.email.includes("@")) {
    emailSet.add(HOTEL_CONFIG.email.trim().toLowerCase());
  }

  return Array.from(emailSet);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends an email notification to all admins via Nodemailer whenever a guest attempts/submits a booking.
 * Gracefully no-ops if SMTP credentials are not configured.
 */
export async function sendAdminBookingNotification(booking: BookingEmailDetails): Promise<void> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpUser || !smtpPass) {
    console.warn(
      "[Mailer] SMTP_USER / SMTP_PASS not configured in environment; skipping admin booking email notification."
    );
    return;
  }

  const recipients = await getAdminNotificationEmails();
  if (recipients.length === 0) {
    console.warn("[Mailer] No admin recipient emails found; skipping notification.");
    return;
  }

  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const checkInDate = new Date(booking.checkIn).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const checkOutDate = new Date(booking.checkOut).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const roomLabel = booking.roomName || "Selected Room";
  const subject = `New Booking Alert: ${booking.bookingCode} — ${booking.guestName} (${roomLabel})`;

  const textBody = [
    `Hotel Al Safa International — New Booking Notification`,
    ``,
    `${booking.guestName} has submitted a booking request.`,
    ``,
    `Booking Code: ${booking.bookingCode}`,
    `Guest Name: ${booking.guestName}`,
    `Phone: ${booking.guestPhone}`,
    `Email: ${booking.guestEmail || "N/A"}`,
    `NID / Passport: ${booking.guestNidPassport || "N/A"}`,
    `Address: ${booking.permanentAddress || "N/A"}`,
    `Room: ${roomLabel}`,
    `Check-in: ${checkInDate}`,
    `Check-out: ${checkOutDate} (${booking.nights} Night${booking.nights > 1 ? "s" : ""})`,
    `Guests: ${booking.adults} Adults, ${booking.children} Children`,
    `Total Amount: BDT ${booking.totalAmount.toLocaleString()}`,
    `Payment Method: ${booking.paymentMethod} (${booking.paymentStatus})`,
    booking.specialRequests ? `Notes: ${booking.specialRequests}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #ffffff;">
      <div style="background: #0b1220; color: #ffffff; padding: 20px 24px; border-bottom: 3px solid #d4af37;">
        <h2 style="margin: 0; font-size: 18px; letter-spacing: 0.5px;">HOTEL AL SAFA INTERNATIONAL</h2>
        <p style="margin: 4px 0 0; font-size: 12px; color: #facc15;">New Guest Booking Alert</p>
      </div>
      <div style="padding: 24px; color: #111827; font-size: 14px; line-height: 1.6;">
        <p style="margin-top: 0;"><strong>${escapeHtml(booking.guestName)}</strong> has tried to book a room on the website.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Booking Code</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #b45309;">${escapeHtml(booking.bookingCode)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Guest Name</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${escapeHtml(booking.guestName)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${escapeHtml(booking.guestPhone)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Email</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(booking.guestEmail || "N/A")}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">NID / Passport</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(booking.guestNidPassport || "N/A")}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Room Category</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-weight: bold;">${escapeHtml(roomLabel)}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Check-in / Check-out</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(checkInDate)} → ${escapeHtml(checkOutDate)} (${booking.nights} Night${booking.nights > 1 ? "s" : ""})</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Guests</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${booking.adults} Adults, ${booking.children} Children</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Total Amount</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-weight: bold; color: #b45309;">BDT ${booking.totalAmount.toLocaleString()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Payment</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(booking.paymentMethod)} (${escapeHtml(booking.paymentStatus)})</td></tr>
          ${booking.specialRequests ? `<tr><td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #6b7280;">Notes</td><td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${escapeHtml(booking.specialRequests)}</td></tr>` : ""}
        </table>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 0;">Please review and manage this reservation in the Hotel Al Safa International Admin Portal.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Hotel Al Safa International" <${smtpUser}>`,
    to: recipients.join(", "),
    subject,
    text: textBody,
    html: htmlBody,
  });
}
