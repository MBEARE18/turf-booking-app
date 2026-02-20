const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    slots: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Slot'
    }],
    guestName: {
        type: String,
        required: false
    },
    guestPhone: {
        type: String,
        required: false
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'PENDING_VERIFICATION', 'CONFIRMED', 'CANCELLED', 'FAILED'], // Added 'FAILED' based on common payment flows
        default: 'PENDING'
    },
    utrNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    paymentMethod: {
        type: String,
        default: 'UPI'
    },
    razorpayOrderId: {
        type: String
    },
    paymentId: {
        type: String
    },
    screenshot: {
        type: String // Store base64 or file path
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
