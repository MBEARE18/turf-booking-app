const mongoose = require('mongoose');

const slotSchema = mongoose.Schema({
    date: {
        type: String, // format: YYYY-MM-DD
        required: [true, 'Please add a date']
    },
    startTime: {
        type: String, // format: HH:mm
        required: [true, 'Please add a start time']
    },
    endTime: {
        type: String, // format: HH:mm
        required: [true, 'Please add an end time']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'LOCKED', 'PENDING_CONFIRMATION', 'BOOKED', 'BLOCKED'],
        default: 'AVAILABLE'
    },
    lockedAt: {
        type: Date
    },
    bookedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index to prevent duplicate slots for the same time on the same date
slotSchema.index({ date: 1, startTime: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);
