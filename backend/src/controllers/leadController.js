const db = require('../db');
const { appendLead, updateLeadStatusInSheet } = require('../services/googleSheetsService');

const createLead = async (req, res) => {
    const { name, email, phone, course, college, year } = req.body;

    try {
        // Check if duplicate email exists in DB
        const duplicate = await db.query('SELECT * FROM leads WHERE email = $1', [email]);
        if (duplicate.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Insert into DB
        const result = await db.query(
            'INSERT INTO leads (name, email, phone, course, college, year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, phone, course, college, year]
        );

        const newLead = result.rows[0];

        // Append to Google Sheets
        const sheetRowId = await appendLead(newLead);

        if (sheetRowId) {
            await db.query('UPDATE leads SET sheet_row_id = $1 WHERE id = $2', [sheetRowId, newLead.id]);
        }

        res.status(201).json({ message: 'Lead created successfully', lead: newLead });
    } catch (error) {
        console.error('Create Lead Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const getLeads = async (req, res) => {
    const { search, course, status } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (search) {
        params.push(`%${search}%`);
        query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }

    if (course) {
        params.push(course);
        query += ` AND course = $${params.length}`;
    }

    if (status) {
        params.push(status);
        query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    try {
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get Leads Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const updateLeadStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const result = await db.query(
            'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        const updatedLead = result.rows[0];

        // Update Google Sheets
        if (updatedLead.sheet_row_id) {
            await updateLeadStatusInSheet(updatedLead.sheet_row_id, status);
        }

        res.json(updatedLead);
    } catch (error) {
        console.error('Update Status Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    createLead,
    getLeads,
    updateLeadStatus,
};
