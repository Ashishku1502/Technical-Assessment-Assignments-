# Lead Management System

A full-stack application for capturing leads, managing them in an admin dashboard, and synchronizing with Google Sheets with automated reminders.

## Tech Stack
- **Frontend**: React (Vite), Lucide Icons, Axios, React Router
- **Backend**: Node.js, Express, PostgreSQL (node-pg), JWT, Bcrypt
- **Storage**: PostgreSQL + Google Sheets API
- **Automation**: Google Apps Script

## Prerequisites
- Node.js installed
- PostgreSQL database
- Google Cloud Project with Sheets API enabled and Service Account credentials

## Setup Instructions

### 1. Database Setup
1. Create a PostgreSQL database named `lead_mgmt`.
2. Execute the queries in `backend/db.sql`.

### 2. Backend Setup
1. Navigate to `backend/`.
2. Create a `.env` file based on `.env.example`.
3. Provide your PostgreSQL `DATABASE_URL`.
4. Provide Google Service Account credentials (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`) and `GOOGLE_SHEETS_ID`.
5. Run `npm install`.
6. Seed the admin user:
   ```bash
   npm run seed
   ```
7. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to `frontend/`.
2. Run `npm install`.
3. Start the dev server:
   ```bash
   npm run dev
   ```

### 4. Google Sheets & Apps Script
1. Open your Google Sheet.
2. In the menu, go to **Extensions > Apps Script**.
3. Copy the content of `google-apps-script.js` into the script editor.
4. Replace `admin@yourdomain.com` with your actual email.
5. Save the project and run the `setupTrigger` function once to initialize the daily reminder.
6. Share your Google Sheet with the Service Account email address with 'Editor' permissions.

## Security Features
- **JWT Auth**: Protected admin routes with token expiration handling.
- **Passwords**: Hashed using Bcrypt.
- **SQL Injection**: Prevented using parameterized queries with `pg`.
- **Rate Limiting**: Basic protection against brute force and spam.
- **Validation**: Server-side validation using `express-validator`.
- **Duplicates**: Emails are checked in DB before insertion.

## UI/UX
- Premium Glassmorphism design system.
- Responsive layout.
- Real-time search and filtering.
- Toast notifications for user feedback.
- Centralized API handling with Axios interceptors.
# Technical-Assessment-Assignments-
