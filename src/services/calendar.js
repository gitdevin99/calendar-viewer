const { google } = require('googleapis');

async function listEvents(auth, startDate, endDate) {
    const calendar = google.calendar({ version: 'v3', auth });
    console.log('Fetching events from', startDate, 'to', endDate);
    
    try {
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: startDate || new Date().toISOString(),
            timeMax: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            singleEvents: true,
            orderBy: 'startTime'
        });

        console.log('Found', response.data.items.length, 'events');
        return response.data.items.map(event => ({
            id: event.id,
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            description: event.description,
            location: event.location
        }));
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

module.exports = {
    listEvents
};
