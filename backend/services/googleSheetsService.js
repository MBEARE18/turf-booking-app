const axios = require('axios');

class GoogleSheetsService {
    constructor() {
        // This is the URL from your "New Deployment" in Apps Script
        this.scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    }

    async addUserRegistration(user) {
        if (!this.scriptUrl) {
            console.log('⚠️ GOOGLE_SCRIPT_URL not set, skipping Google Sheets sync');
            return;
        }

        try {
            await axios.post(this.scriptUrl, {
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                userId: user._id
            });
            console.log('✅ User synced to Google Sheets (Zero Cost)');
        } catch (error) {
            console.error('❌ Google Sheets sync failed:', error.message);
        }
    }

    async getAllUsers() {
        if (!this.scriptUrl) return [];

        try {
            const { data } = await axios.get(this.scriptUrl);
            return data; // Returns the parsed JSON from Apps Script
        } catch (error) {
            console.error('❌ Error fetching from Google Sheets:', error.message);
            return [];
        }
    }
}

module.exports = new GoogleSheetsService();
