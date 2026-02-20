const Slot = require('../models/Slot');

// @desc    Create new slots (Admin only)
// @route   POST /api/slots
// @access  Private/Admin
exports.createSlots = async (req, res) => {
    const { slots } = req.body; // Array of slots

    try {
        const createdSlots = await Slot.insertMany(slots);
        res.status(201).json(createdSlots);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get slots by date
// @route   GET /api/slots/:date
// @access  Public
exports.getSlotsByDate = async (req, res) => {
    const { date } = req.params; // Format: YYYY-MM-DD

    try {
        // Automatically unlock expired locked slots (10 min limit for payment submission)
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        await Slot.updateMany(
            { status: 'LOCKED', lockedAt: { $lt: tenMinutesAgo } },
            { status: 'AVAILABLE', lockedAt: null, bookedBy: null }
        );

        // Fetch existing slots from DB
        const dbSlots = await Slot.find({ date });
        const dbSlotsMap = {};
        dbSlots.forEach(s => {
            dbSlotsMap[s.startTime] = s;
        });

        // Current time for expiry check
        const now = new Date();
        const IST_OFFSET = 5.5 * 60 * 60 * 1000;
        const istNow = new Date(now.getTime() + IST_OFFSET); // Adjust to IST if server is UTC
        // But since user is in IST (based on metadata), let's use a simpler check
        // We'll compare dates and hours.

        // Simple path: Use local time of server/system
        // If server is UTC, IST is +5:30
        const nowInIST = new Date(new Date().getTime() + (5.5 * 60 * 60 * 1000));
        const todayStr = nowInIST.toISOString().split('T')[0];
        const currentHour = nowInIST.getUTCHours(); // getUTCHours on the adjusted date gives IST hour
        const currentMinute = nowInIST.getUTCMinutes();

        const allSlots = [];

        // Default range: 05:00 to 00:00 (midnight) - 19 slots
        for (let i = 5; i <= 23; i++) {
            const startTime = `${String(i).padStart(2, '0')}:00`;
            const nextHour = (i + 1) % 24;
            const endTime = `${String(nextHour).padStart(2, '0')}:00`;

            let slotData;
            if (dbSlotsMap[startTime]) {
                slotData = dbSlotsMap[startTime].toObject();
            } else {
                // Virtual default slot
                const price = (i >= 5 && i < 17) ? 300 : 400; // Peak hours 5PM onwards
                slotData = {
                    _id: `virtual-${date}-${startTime}`,
                    date,
                    startTime,
                    endTime,
                    price,
                    status: 'AVAILABLE',
                    isVirtual: true
                };
            }

            // Expiry Check: If date is today and time has passed
            if (date < todayStr) {
                slotData.status = 'BLOCKED'; // Past date
            } else if (date === todayStr) {
                const hour = parseInt(startTime.split(':')[0]);
                if (hour <= currentHour) {
                    slotData.status = 'BLOCKED'; // Already started or past
                }
            }

            allSlots.push(slotData);
        }

        // Add extra slots from DB that are outside 5-23 range (Admin manual additions)
        dbSlots.forEach(s => {
            const hour = parseInt(s.startTime.split(':')[0]);
            if (hour < 5) {
                const slotData = s.toObject();
                if (date < todayStr) {
                    slotData.status = 'BLOCKED';
                } else if (date === todayStr && hour < currentHour) {
                    slotData.status = 'BLOCKED';
                }
                allSlots.push(slotData);
            }
        });

        res.json(allSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update slot status (Admin only - e.g. Manual Block)
// @route   PUT /api/slots/:id
// @access  Private/Admin
exports.updateSlotStatus = async (req, res) => {
    const { status, price } = req.body;

    try {
        const slot = await Slot.findById(req.params.id);

        if (slot) {
            slot.status = status || slot.status;
            slot.price = price || slot.price;
            const updatedSlot = await slot.save();
            res.json(updatedSlot);
        } else {
            res.status(404).json({ message: 'Slot not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk create hourly slots for a date (Admin Helper)
// @route   POST /api/slots/generate
// @access  Private/Admin
exports.generateSlotsForDate = async (req, res) => {
    const { date, startHour, endHour, price } = req.body;

    const slots = [];
    for (let i = startHour; i < endHour; i++) {
        const startTime = `${String(i).padStart(2, '0')}:00`;
        const endTime = `${String(i + 1).padStart(2, '0')}:00`;
        slots.push({ date, startTime, endTime, price });
    }

    try {
        await Slot.insertMany(slots, { ordered: false }); // ordered: false ignores duplicates
        res.status(201).json({ message: `Slots generated for ${date}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
