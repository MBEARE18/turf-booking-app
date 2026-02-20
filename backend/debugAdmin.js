const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Booking = require('./models/Booking');
const Slot = require('./models/Slot');
const User = require('./models/User');

dotenv.config({ path: __dirname + '/.env' });

const debugBookings = async () => {
    try {
        console.log('Using MONGO_URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        console.log('Fetching all bookings...');
        const bookings = await Booking.find({})
            .populate('user', 'name email phone')
            .populate('slots')
            .sort({ createdAt: -1 });

        console.log(`Found ${bookings.length} bookings.`);

        if (bookings.length > 0) {
            console.log('Sample booking:', JSON.stringify(bookings[0], null, 2));
        } else {
            console.log('No bookings found in the database.');
        }

        process.exit();
    } catch (error) {
        console.error('Error fetching bookings:', error);
        process.exit(1);
    }
};

debugBookings();
