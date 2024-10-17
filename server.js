const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Configure Google Sheets API
const sheets = google.sheets('v4');
const auth = new google.auth.GoogleAuth({
    keyFile: 'attendance-check-in-438918-b1d6442eba1c.json', // Change this to your JSON key file path
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

app.post('/add-attendee', async (req, res) => {
    const { name, uniqueId, qrCode } = req.body;
    const authClient = await auth.getClient();
    const spreadsheetId = '19Vd3Kqx0qojtGt17br-g6J-LgVBYCt3memQvPsmmMI4'; // Replace with your Spreadsheet ID

    try {
        await sheets.spreadsheets.values.append({
            auth: authClient,
            spreadsheetId,
            range: 'Sheet1!A:C', // Change this if your sheet name is different
            valueInputOption: 'RAW',
            resource: {
                values: [[name, uniqueId, qrCode, 'Checked In']]
            }
        });
        res.status(200).send('Attendee added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding attendee');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
