const express = require('express');
const router = express.Router();
const { checkAuth } = require('../services/auth');
const calendarService = require('../services/calendar');

// Get calendar events
router.get('/events', checkAuth, async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        const events = await calendarService.listEvents(
            req.oauth2Client,
            start_date,
            end_date
        );
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
