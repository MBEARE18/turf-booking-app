const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        const adminEmail = 'admin@rcbturf.com'; // You can change this
        const adminPassword = 'adminpassword123'; // Change this after first login!

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            userExists.role = 'ADMIN';
            userExists.password = adminPassword; // This will be hashed by the pre-save hook
            await userExists.save();
            console.log(`✅ User ${adminEmail} promoted to ADMIN and password updated.`);
        } else {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: adminPassword,
                phone: '0000000000',
                role: 'ADMIN'
            });
            console.log(`✅ Admin account created:`);
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
        }

        process.exit();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createAdmin();
