const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        // Set strictQuery to suppress warning
        mongoose.set('strictQuery', false);

        console.log('🔌 Attempting to connect to MongoDB...');

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        if (error.message.includes('timeout')) {
            console.log('👉 ACTION REQUIRED: Your IP might not be whitelisted on MongoDB Atlas.');
            console.log('1. Go to MongoDB Atlas -> Network Access');
            console.log('2. Click "Add IP Address" -> "Allow Access From Anywhere" (0.0.0.0/0)');
            console.log('3. Wait 1 minute and try again.');
        }
        throw error;
    }
};

module.exports = connectDB;
