# Calendar Viewer

A simple web application that allows users to view their Google Calendar events in a beautiful calendar interface.

## Features

- Google Calendar Integration
- Beautiful Calendar UI using FullCalendar
- Secure Authentication with Google OAuth 2.0
- Session Management with Redis
- Responsive Design

## Prerequisites

- Node.js >= 18.0.0
- Redis Server
- Google Cloud Console Project with Calendar API enabled

## Setup

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd calendar-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/auth/google/callback`

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values with your credentials:
     ```
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
     SESSION_SECRET=your-secret-key
     REDIS_URL=your-redis-url
     ```

5. Start Redis Server:
   ```bash
   redis-server
   ```

6. Start the application:
   ```bash
   npm start
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click "Sign in with Google Calendar" to authenticate
2. View your calendar events in the calendar interface
3. Click on events to view details
4. Use the calendar navigation to view different time periods
5. Click "Sign Out" to logout

## Development

- The application uses Express.js for the backend
- Frontend is built with vanilla JavaScript and FullCalendar
- Redis is used for session storage
- Google Calendar API is used to fetch events

## License

ISC
