# Turf Booking App - System Design

## 1. User Flow

### Player Flow
1. **Landing Page:** View turf details.
2. **Select Date:** Picker to choose the booking day.
3. **View Slots:** See available, booked, and locked slots.
4. **Book Slot:** Select an available hourly slot.
5. **Payment:** Redirect to payment gateway (Razorpay).
6. **Confirmation:** Receive booking ID and success message.

### Admin Flow
1. **Login:** Secure access to the dashboard.
2. **Setup Slots:** Generate hourly slots for future dates.
3. **Manage Slots:** Update prices or block specific slots.
4. **Dashboard:** Overview of daily/weekly bookings and revenue.

---

## 2. Database Design (MongoDB Collections)

### User
- `id`: ObjectId
- `name`: String
- `email`: String (Unique)
- `password`: String (Hashed)
- `role`: String (ENUM: 'USER', 'ADMIN')
- `phone`: String

### Turf (Single Entry for MVP)
- `id`: ObjectId
- `name`: String
- `location`: String
- `description`: String
- `images`: Array<String>

### Slot
- `id`: ObjectId
- `date`: Date (YYYY-MM-DD)
- `startTime`: String (e.g., "06:00")
- `endTime`: String (e.g., "07:00")
- `price`: Number
- `status`: String (ENUM: 'AVAILABLE', 'LOCKED', 'BOOKED')
- `lockedAt`: Timestamp (for 5-min timer)

### Booking
- `id`: ObjectId
- `userId`: Reference (User)
- `slotId`: Reference (Slot)
- `totalAmount`: Number
- `status`: String (ENUM: 'PENDING', 'CONFIRMED', 'CANCELLED')
- `createdAt`: Timestamp

### Payment
- `id`: ObjectId
- `bookingId`: Reference (Booking)
- `razorpayOrderId`: String
- `razorpayPaymentId`: String
- `status`: String (ENUM: 'SUCCESS', 'FAILED')

---

## 3. Configuration Decisions
- **Slot Duration:** Fixed 1-hour intervals.
- **Price:** Default price set by admin, can be overridden per slot.
- **Booking Status:**
  - `AVAILABLE`: Ready for booking.
  - `LOCKED`: Someone is currently in the payment process (5-minute expiry).
  - `BOOKED`: Confirmed and paid.
