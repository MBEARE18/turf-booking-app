# Premium Turf Booking Web App

A full-stack Turf Booking application built with Node.js, Express, MongoDB, and React.

## Features
- **User Authentication:** JWT based login/register with role-based access (USER/ADMIN).
- **Slot Management:** Admin can generate hourly slots, set prices, and block slots.
- **Booking Flow:** 
  - Date-based slot availability.
  - 5-minute temporary slot locking to prevent double booking.
  - Online payment integration via Razorpay.
- **Booking History:** Users can track their previous and upcoming bookings.
- **Premium UI:** Modern, dark-themed responsive interface using CSS variables and glassmorphism.

## Tech Stack
- **Frontend:** React, Vite, Axios, React Router, Lucide Icons.
- **Backend:** Node.js, Express, Mongoose, JWT, Razorpay SDK.
- **Database:** MongoDB.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Razorpay account (for API keys)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file from the following template:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
4. `npm start` (or `node server.js`)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## API Endpoints

### Auth
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get user profile

### Slots
- `GET /api/slots/:date` - Get slots for a date (YYYY-MM-DD)
- `POST /api/slots/generate` - (Admin) Bulk generate slots
- `PUT /api/slots/id/:id` - (Admin) Update slot status/price

### Bookings
- `POST /api/bookings/lock/:slotId` - Temporarily lock a slot
- `POST /api/bookings` - Create Razorpay order
- `POST /api/bookings/verify` - Verify payment and confirm booking
- `GET /api/bookings/mybookings` - View user bookings

## Future Enhancements
- Email/SMS notifications on successful booking.
- Dynamic slot durations (30m, 90m, 120m).
- Membership/Wallet system.
- Multi-turf support.
