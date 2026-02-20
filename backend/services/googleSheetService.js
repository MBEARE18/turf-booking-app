const { GoogleSpreadsheet } = require('google-spreadsheet');

const addToSheet = async (bookingData) => {
    try {
        if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            console.log('Skipping Google Sheet upload: Missing credentials in .env');
            return;
        }

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

        // v3 Auth
        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });

        await doc.loadInfo(); // loads document properties and worksheets

        const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

        await sheet.addRow({
            Name: bookingData.name,
            Phone: bookingData.phone,
            Date: bookingData.date,
            StartTime: bookingData.startTime,
            EndTime: bookingData.endTime,
            Price: bookingData.price,
            BookedAt: new Date().toISOString()
        });

        console.log('Successfully added booking to Google Sheet');

    } catch (error) {
        console.error('Error adding to Google Sheet:', error.message);
        // We don't want to fail the request if sheet upload fails, just log it
    }
};

module.exports = { addToSheet };
