/**
 * Google Apps Script for Lead Management Automation
 * Trigger: Time-based, 9 AM daily
 */

function setupTrigger() {
    // Create a trigger that runs every day at 9 AM
    ScriptApp.newTrigger('checkLeadsAndSendReminders')
        .timeBased()
        .atHour(9)
        .everyDays(1)
        .create();
}

function checkLeadsAndSendReminders() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Sheet1');
    if (!sheet) return;

    const data = sheet.getDataRange().getValues();
    const adminEmail = 'admin@yourdomain.com'; // Change to actual admin email
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    // Columns: A:Name, B:Email, C:Phone, D:Course, E:College, F:Year, G:Status, H:CreatedAt, I:ReminderSent
    for (let i = 1; i < data.length; i++) {
        const name = data[i][0];
        const email = data[i][1];
        const status = data[i][6];
        const createdAt = new Date(data[i][7]);
        const reminderSent = data[i][8];

        if (status === 'new' && createdAt < twentyFourHoursAgo && !reminderSent) {
            try {
                sendReminderEmail(email, name, adminEmail);

                // Mark as Reminder Sent in Column I (9th column)
                sheet.getRange(i + 1, 9).setValue('Sent');
                console.log('Reminder sent to: ' + email);
            } catch (e) {
                console.error('Error sending reminder to ' + email + ': ' + e.message);
            }
        }
    }
}

function sendReminderEmail(to, name, cc) {
    const subject = 'Reminder: Your Enrollment at Lead Management System';
    const body = `Hi ${name},\n\nWe noticed you haven't been contacted regarding your enrollment for the course. Our team will get in touch soon.\n\nBest regards,\nTeam Lead Management`;

    GmailApp.sendEmail(to, subject, body, {
        cc: cc,
        name: 'Lead Management System'
    });
}
