const { google } = require('googleapis');
require('dotenv').config();

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
const privateKey = process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : null;

if (!spreadsheetId || !privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
    console.warn('Google Sheets configuration is incomplete. Sheets sync will fail.');
}

const auth = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    privateKey,
    SCOPES
);

const sheets = google.sheets({ version: 'v4', auth });

const appendLead = async (lead) => {
    if (!spreadsheetId || !privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.warn('Skipping Google Sheets sync: Configuration incomplete.');
        return null;
    }
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:H',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[
                    lead.name,
                    lead.email,
                    lead.phone,
                    lead.course,
                    lead.college,
                    lead.year,
                    lead.status,
                    lead.created_at
                ]],
            },
        });

        // Extract row number if possible, or just return success
        // The range returned is usually something like 'Sheet1!A10:H10'
        const updatedRange = response.data.updates.updatedRange;
        const rowId = updatedRange.split('!')[1].match(/\d+/)[0];
        return rowId;
    } catch (error) {
        console.error('Google Sheets Append Error:', error);
        return null;
    }
};

const updateLeadStatusInSheet = async (rowId, status) => {
    if (!spreadsheetId || !privateKey || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        console.warn('Skipping Google Sheets status update: Configuration incomplete.');
        return false;
    }
    try {
        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!G${rowId}`, // Assuming Status is in column G
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[status]],
            },
        });
        return true;
    } catch (error) {
        console.error('Google Sheets Update Error:', error);
        return false;
    }
};

module.exports = { appendLead, updateLeadStatusInSheet };
