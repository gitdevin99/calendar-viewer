let calendar;

async function checkAuthStatus() {
    try {
        const response = await fetch('/auth/status');
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}

async function fetchEvents(info, successCallback, failureCallback) {
    try {
        const response = await fetch(`/api/events?start_date=${info.startStr}&end_date=${info.endStr}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        successCallback(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        failureCallback(error);
    }
}

async function initializeApp() {
    const authContainer = document.querySelector('.auth-container');
    const calendarEl = document.getElementById('calendar');
    
    try {
        const isAuthenticated = await checkAuthStatus();
        
        if (isAuthenticated) {
            authContainer.innerHTML = `
                <p class="success-message">✓ Connected to Google Calendar</p>
                <a href="/auth/logout" class="logout-btn">Sign Out</a>
            `;
            
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: fetchEvents,
                eventClick: function(info) {
                    const event = info.event;
                    alert(`
                        Event: ${event.title}
                        Start: ${event.start.toLocaleString()}
                        End: ${event.end ? event.end.toLocaleString() : 'N/A'}
                        ${event.extendedProps.description ? '\nDescription: ' + event.extendedProps.description : ''}
                        ${event.extendedProps.location ? '\nLocation: ' + event.extendedProps.location : ''}
                    `);
                }
            });
            
            calendar.render();
        } else {
            authContainer.innerHTML = `
                <a href="/auth/google" class="google-signin-btn">Sign in with Google Calendar</a>
            `;
        }
    } catch (error) {
        console.error('Error initializing app:', error);
        authContainer.innerHTML = `
            <p class="error-message">Error: ${error.message}</p>
            <a href="/auth/google" class="google-signin-btn">Try signing in again</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
