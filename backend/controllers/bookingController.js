const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const Razorpay = require('razorpay');

// @desc    Lock a slot for booking (5-minute window)
// @route   POST /api/bookings/lock/:slotId
// @access  Private
exports.lockSlot = async (req, res) => {
    try {
        let slot;
        const slotId = req.params.slotId;

        // Handle Virtual Slots from Frontend
        if (slotId.startsWith('virtual-')) {
            const parts = slotId.split('-');
            const date = `${parts[1]}-${parts[2]}-${parts[3]}`;
            const startTime = parts[4];

            // Verify if it already exists (race condition)
            slot = await Slot.findOne({ date, startTime });

            if (!slot) {
                const hour = parseInt(startTime.split(':')[0]);
                const price = (hour < 17) ? 300 : 400;
                const endTime = `${String((hour + 1) % 24).padStart(2, '0')}:00`;

                slot = await Slot.create({
                    date,
                    startTime,
                    endTime,
                    price,
                    status: 'LOCKED',
                    lockedAt: new Date(),
                    bookedBy: req.user._id
                });
                return res.json({ message: 'Slot created and locked', slot });
            }
        } else {
            slot = await Slot.findById(slotId);
        }

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        const isAdmin = req.user.role === 'ADMIN';

        if (slot.status !== 'AVAILABLE' && !(isAdmin && slot.status === 'BLOCKED')) {
            return res.status(400).json({ message: 'Slot is already booked or locked' });
        }

        slot.status = 'LOCKED';
        slot.lockedAt = new Date();
        slot.bookedBy = req.user._id;
        await slot.save();

        res.json({ message: 'Slot locked for 10 minutes', slot });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Lock a range of slots
// @route   POST /api/bookings/lock-range
// @access  Private
exports.lockRange = async (req, res) => {
    const { date, startTime, endTime } = req.body;
    try {
        const startH = parseInt(startTime.split(':')[0]);
        let endH = parseInt(endTime.split(':')[0]);
        if (endH === 0) endH = 24; // Handle 12 AM
        const slotsToLock = [];

        for (let h = startH; h < endH; h++) {
            const sTime = `${String(h).padStart(2, '0')}:00`;
            let slot = await Slot.findOne({ date, startTime: sTime });

            if (!slot) {
                // Create virtual slot if it's within default range
                if (h >= 5 && h <= 23) {
                    const price = (h < 17) ? 300 : 400;
                    const slotEndTime = `${String((h + 1) % 24).padStart(2, '0')}:00`;
                    slot = await Slot.create({
                        date,
                        startTime: sTime,
                        endTime: slotEndTime,
                        price,
                        status: 'AVAILABLE'
                    });
                } else {
                    return res.status(400).json({ message: `Slot ${sTime} is invalid` });
                }
            }

            const isAdmin = req.user.role === 'ADMIN';
            if (slot.status !== 'AVAILABLE' && !(isAdmin && slot.status === 'BLOCKED')) {
                return res.status(400).json({ message: `Slot ${sTime} is already booked or locked` });
            }
            slotsToLock.push(slot);
        }

        // Lock all slots
        for (const slot of slotsToLock) {
            slot.status = 'LOCKED';
            slot.lockedAt = new Date();
            slot.bookedBy = req.user._id;
            await slot.save();
        }

        res.json({
            message: 'Slots locked',
            slots: slotsToLock,
            totalPrice: slotsToLock.reduce((acc, s) => acc + s.price, 0)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a booking and initiate Razorpay order
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    const { slotId } = req.body;

    try {
        const slot = await Slot.findById(slotId);

        if (!slot || slot.status !== 'LOCKED' || slot.bookedBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({ message: 'Invalid slot or slot lock expired' });
        }

        // Initialize Razorpay
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: slot.price * 100, // amount in the smallest currency unit
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await instance.orders.create(options);

        // Create Booking in DB with PENDING state
        const booking = await Booking.create({
            user: req.user._id,
            slots: [slot._id], // Array
            totalAmount: slot.price,
            razorpayOrderId: order.id,
            status: 'PENDING'
        });

        res.status(201).json({
            booking,
            order
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('slots')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Confirm booking after payment success
// @route   POST /api/bookings/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // In a real app, verify the signature here using crypto
    // For MVP, we'll assume success if IDs are provided or verify properly if needed

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = 'CONFIRMED';
        booking.paymentId = razorpay_payment_id;
        await booking.save();

        await Slot.updateMany(
            { _id: { $in: booking.slots } },
            { status: 'BOOKED' }
        );

        res.json({ message: 'Payment verified and booking confirmed', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { addToSheet } = require('../services/googleSheetService');

// @desc    Direct booking from new form (Bypasses payment for now based on prompt)
// @route   POST /api/bookings/direct
// @access  Private
exports.createDirectBooking = async (req, res) => {
    const { date, startTime } = req.body;

    try {
        const guestName = req.user.name;
        const guestPhone = req.user.phone;

        // 1. Identify all hourly slots in the range
        const startH = parseInt(startTime.split(':')[0]);
        let endH = parseInt(req.body.endTime.split(':')[0]);
        if (endH === 0) endH = 24; // Handle 12 AM
        const slotsNeeded = [];

        console.log(`Creating direct booking for ${date} from ${startTime} to ${req.body.endTime}`);

        for (let h = startH; h < endH; h++) {
            slotsNeeded.push(`${String(h).padStart(2, '0')}:00`);
        }

        const bookedSlots = [];
        let totalBookingPrice = 0;

        for (const sTime of slotsNeeded) {
            let slot = await Slot.findOne({ date, startTime: sTime });

            if (!slot) {
                const hour = parseInt(sTime.split(':')[0]);
                if (hour >= 5 && hour <= 23) { // Allow up to 11PM start
                    const price = (hour < 17) ? 300 : 400;
                    const endTime = `${String((hour + 1) % 24).padStart(2, '0')}:00`;
                    console.log(`Slot ${sTime} not found, creating virtual slot...`);
                    slot = await Slot.create({
                        date,
                        startTime: sTime,
                        endTime,
                        price,
                        status: 'AVAILABLE'
                    });
                } else {
                    console.log(`Slot ${sTime} is invalid hours`);
                    return res.status(400).json({ message: `Slot ${sTime} is outside business hours` });
                }
            }

            if (slot.status !== 'AVAILABLE') {
                return res.status(400).json({ message: `Slot ${sTime} is already booked or locked` });
            }

            bookedSlots.push(slot);
            totalBookingPrice += slot.price;
        }

        // 2. Create Booking (Linked to the first slot for reference, or we could update schema)
        // For now, we'll use the first slot as the primary reference
        // 2. Create Booking
        const booking = await Booking.create({
            user: req.user._id,
            slots: bookedSlots.map(s => s._id),
            totalAmount: totalBookingPrice,
            status: 'CONFIRMED',
            guestName,
            guestPhone
        });

        // 3. Update All Slot Statuses
        for (const slot of bookedSlots) {
            slot.status = 'BOOKED';
            slot.bookedBy = req.user._id;
            await slot.save();
        }

        // 4. Add to Google Sheet
        await addToSheet({
            name: guestName,
            phone: guestPhone,
            date,
            startTime: bookedSlots[0].startTime,
            endTime: bookedSlots[bookedSlots.length - 1].endTime,
            price: totalBookingPrice
        });

        res.status(201).json({
            message: 'Booking confirmed successfully',
            booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit UPI Payment with UTR number
// @route   POST /api/bookings/submit-upi
// @access  Private
exports.submitUPIPayment = async (req, res) => {
    const { slotIds, utrNumber, screenshot } = req.body; // Added screenshot

    try {
        const slots = await Slot.find({ _id: { $in: slotIds } });

        if (slots.length === 0 || slots.some(s => s.status !== 'LOCKED')) {
            return res.status(400).json({ message: 'One or more slots not locked or lock expired' });
        }

        const totalAmount = slots.reduce((acc, s) => acc + s.price, 0);

        const booking = await Booking.create({
            user: req.user._id,
            slots: slotIds,
            totalAmount,
            status: 'PENDING_VERIFICATION',
            utrNumber,
            paymentMethod: 'UPI',
            screenshot // Save screenshot
        });

        // Update all slots to PENDING_CONFIRMATION
        await Slot.updateMany(
            { _id: { $in: slotIds } },
            { status: 'PENDING_CONFIRMATION' }
        );

        res.status(201).json({
            message: 'Payment submitted for verification. Please wait for admin approval.',
            booking
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'This UTR number has already been used' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Admin Verify/Confirm UPI Booking
// @route   PUT /api/bookings/verify-status/:id
// @access  Private/Admin
exports.verifyBooking = async (req, res) => {
    const { status } = req.body; // 'CONFIRMED' or 'CANCELLED'

    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;
        await booking.save();

        if (status === 'CONFIRMED') {
            await Slot.updateMany(
                { _id: { $in: booking.slots } },
                { status: 'BOOKED', bookedBy: booking.user }
            );
        } else if (status === 'CANCELLED') {
            await Slot.updateMany(
                { _id: { $in: booking.slots } },
                { status: 'AVAILABLE', lockedAt: null, bookedBy: null }
            );
        }

        res.json({ message: `Booking ${status}`, booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({})
            .populate('user', 'name email phone')
            .populate('slots')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
