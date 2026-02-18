const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createLead, getLeads, updateLeadStatus } = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');

const validateLead = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('course').notEmpty().withMessage('Course is required'),
    body('college').notEmpty().withMessage('College is required'),
    body('year').notEmpty().withMessage('Year is required'),
];

router.post('/', validateLead, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, createLead);

router.get('/', authMiddleware, getLeads);
router.patch('/:id/status', authMiddleware, updateLeadStatus);

module.exports = router;
