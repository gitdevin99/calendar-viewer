const express = require('express');
const router = express.Router();
const { oauth2Client } = require('../services/auth');

// Generate Google OAuth URL
router.get('/google', (req, res) => {
    const scopes = [
        'https://www.googleapis.com/auth/calendar.readonly'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        prompt: 'consent'
    });

    res.redirect(url);
});

// Handle Google OAuth callback
router.get('/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        
        // Store tokens in session
        req.session.token = tokens;
        
        res.redirect('/');
    } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).send('Authentication failed');
    }
});

// Check authentication status
router.get('/status', (req, res) => {
    res.json({
        authenticated: !!req.session?.token
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
