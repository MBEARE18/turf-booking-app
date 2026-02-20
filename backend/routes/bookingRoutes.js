const express = require('express');
const router = express.Router();
const {
    lockSlot,
    lockRange,
    createBooking,
    getMyBookings,
    verifyPayment,
    createDirectBooking,
    getAllBookings,
    submitUPIPayment,
    verifyBooking
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/lock/:slotId', protect, lockSlot);
router.post('/lock-range', protect, lockRange);
router.route('/')
    .get(protect, admin, getAllBookings)
    .post(protect, createBooking);
router.post('/submit-upi', protect, submitUPIPayment);
router.put('/verify-status/:id', protect, admin, verifyBooking);
router.post('/direct', protect, createDirectBooking);
router.get('/mybookings', protect, getMyBookings);
router.post('/verify', protect, verifyPayment);

module.exports = router;
