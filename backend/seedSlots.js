const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Slot = require('./models/Slot');
const connectDB = require('./config/db');

dotenv.config();

const generateSlots = async () => {
    await connectDB();

    const today = new Date();
    const numberOfDays = 7;
    const startHour = 5; // 5 AM
    const endHour = 24;  // 12 AM (Midnight)
    const morningPrice = 300;
    const eveningPrice = 400;

    console.log('Generating slots...');

    for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        // Format date as YYYY-MM-DD to match Schema
        const dateStr = currentDate.toISOString().split('T')[0];

        const slots = [];
        for (let h = startHour; h < endHour; h++) {
            const startTime = `${String(h).padStart(2, '0')}:00`;
            const endTime = `${String((h + 1) % 24).padStart(2, '0')}:00`;

            slots.push({
                date: dateStr,
                startTime,
                endTime,
                price: h < 17 ? morningPrice : eveningPrice,
                status: 'AVAILABLE'
            });
        }

        try {
            await Slot.insertMany(slots, { ordered: false });
            console.log(`✅ Slots generated for ${dateStr}`);
        } catch (error) {
            // Ignore duplicate errors if slots already exist
            if (error.code !== 11000) {
                console.error(`❌ Error for ${dateStr}:`, error.message);
            } else {
                console.log(`⚠️  Updating existing slots for ${dateStr} with new prices...`);
                // Update prices for existing slots if they already exist
                for (const slotData of slots) {
                    await Slot.findOneAndUpdate(
                        { date: dateStr, startTime: slotData.startTime },
                        { price: slotData.price, endTime: slotData.endTime }
                    );
                }
            }
        }
    }

    console.log('Done!');
    process.exit();
};

generateSlots();
