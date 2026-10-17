# 💈 The Noble Blade Barbershop Booking & Management System (MVP)

A demo-ready barbershop booking engine and owner dashboard designed for immediate sales demos to barbershop owners in Nairobi and Kenya.

---

## 🚀 Quick Start (Running the Demo)

The system is already running locally at:
👉 **[http://localhost:3000](http://localhost:3000)**

If you ever restart your terminal:
```bash
npm start
# or
node server.js
```

You can also open [index.html](file:///c:/Users/Admin/Desktop/Barbershop/index.html) directly in any browser for client-side evaluation.

---

## 🌟 Demo Highlights to Pitch to the Barbershop Owner

### 1. Customer Experience (Closes the Booking & Stops No-Shows)
- **High-Impact Brand Experience**: Dark luxury aesthetic crafted specifically for executive barbershops.
- **Dynamic Slot Availability**: Select any service and see real open slots. If a cut takes 45 minutes, only slots with a 45-minute open window before closing time are displayed.
- **"Any Available Barber" or Specific Stylist**: Customers can pick their favourite barber (e.g. Marcus, Sammy) or choose "Any Available" for instant booking.
- **Real-Time Safaricom M-Pesa STK Push Simulation**:
  - Prompts customer for phone number (`07...`).
  - Simulates an authentic Safaricom M-Pesa prompt with PIN entry.
  - Generates real M-Pesa transaction codes (e.g., `SH92LK810`) and locks in the KES 300 deposit.
- **Instant WhatsApp & SMS Notifications**:
  - One-click **"Open WhatsApp Confirmation"** pre-fills a professional booking receipt with appointment time, barber name, location, and M-Pesa reference.
  - Africa's Talking SMS preview showing automated SMS dispatch.
  - One-click **"Add to Google Calendar / iCal"** (.ics).

### 2. Owner & Staff Dashboard (Toggled via "Staff / Owner Dashboard" Button)
- **Live Today's Timeline**:
  - Chronological schedule of each chair.
  - Instant action buttons: `[Arrived]` (seated in chair), `[Mark Done]`, `[No-Show]` (adds strike to client profile), and one-click WhatsApp client button.
- **Walk-In Queue Manager**:
  - Quickly log walk-ins walking off the street.
  - Automatically calculates estimated queue wait time based on active cuts.
  - One-click seat in chair.
- **Client Retention & No-Show Tracker**:
  - Client directory showing visit history and no-show flags.
- **Service Menu & Price Manager**:
  - Update haircut prices, durations, and active status in real time.
- **Shop & M-Pesa Settings**:
  - Adjust deposit amount (e.g., KES 300 / KES 500), opening/closing hours, and cancellation policy.

---

## 🗄️ Database & Stack Architecture

- **Backend**: Node.js & Express REST API (`server.js`)
- **Data Storage**: JSON persistent document store (`data/db.json`) + Production SQL Schema (`schema.sql`)
- **Payment Gateway**: Daraja API STK Push simulation & webhook handlers
- **Messaging**: WhatsApp deep link generator & Africa's Talking SMS dispatcher
- **Frontend**: Modern semantic HTML5, Vanilla CSS3 (Dark luxury glassmorphism), Native `<dialog>` UI, Responsive Mobile First

