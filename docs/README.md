# Athlete Training Planner

A comprehensive web application for volleyball athletes to create personalized training plans, manage schedules via an interactive calendar, receive timely reminders, and track performance data.

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in minutes
- **[Development Guide](DEVELOPMENT_GUIDE.md)** - Architecture, patterns, and best practices
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Changelog](CHANGELOG.md)** - Project history and version notes
- **[Workout Feature Docs](WORKOUT_FEATURE.md)** - Workout builder details
- **[Svelte 5 Upgrade Notes](SVELTE5-UPGRADE.md)** - Migration from Svelte 4

## Tech Stack

- **Frontend**: SvelteKit 2 + Svelte 5 with TypeScript
- **Backend**: Node.js + Fastify 5 with TypeScript
- **Database**: PostgreSQL via Supabase
- **Deployment**: Vercel
- **Notifications**: Twilio (SMS) + Email
- **Calendar Integration**: iCal format for Google/Apple Calendar

## Features

### Plan Creation & Management
- Athlete profile with position and goals
- Custom workout builder with volleyball-specific types
- Training phase templates
- "Build My Plan" wizard

### Scheduling & Calendar
- Interactive calendar (Monthly/Weekly/Daily views)
- Drag-and-drop rescheduling
- Recurring workouts
- Notification system (in-app, email, SMS)
- Training load visualization

### Tracking & Review
- Mark workouts as complete
- Post-workout logging (duration, RPE, notes)
- Weekly compliance reports
- Progress graphs and trends

## Project Structure

```
training-planner/
├── frontend/              # SvelteKit frontend application
│   ├── src/
│   │   ├── lib/          # Shared components and utilities
│   │   ├── routes/       # SvelteKit routes and pages
│   │   └── app.html      # HTML template
│   └── package.json
│
├── backend/              # Fastify backend API
│   ├── src/
│   │   ├── config/       # Configuration files (Supabase, etc.)
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic (notifications, etc.)
│   │   ├── types/        # TypeScript type definitions
│   │   └── index.ts      # Main server file
│   └── package.json
│
├── .env                  # Environment variables (DO NOT COMMIT)
├── .env.example          # Example environment variables
└── package.json          # Root package.json for unified commands
```

## Getting Started

### Prerequisites

- **Node.js 20+ and npm** (required for Svelte 5 and Fastify 5)
- A Supabase account (for database)
- (Optional) Twilio account for SMS notifications

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd training-planner
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   This will install dependencies for the root, frontend, and backend projects.

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure your credentials:
   ```env
   # Supabase (Required)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key

   # Twilio (Optional - for SMS)
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # For local development, set MOCK_NOTIFICATIONS=true
   MOCK_NOTIFICATIONS=true
   ```

### Running the Application

**Development Mode (with hot reloading)**
```bash
npm run dev
```

This single command starts both the frontend and backend servers:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

The development environment includes:
- Hot module reloading for frontend changes
- Auto-restart for backend changes (via tsx watch)
- Colored console output for easy debugging

### Building for Production

```bash
npm run build
```

This builds both the frontend and backend applications.

## Development

### Running Frontend Only
```bash
npm run dev:frontend
```

### Running Backend Only
```bash
npm run dev:backend
```

### API Endpoints

The backend exposes the following API endpoints:

- `GET /health` - Health check endpoint
- `GET /api/v1/athletes` - Get athletes
- `GET /api/v1/workouts` - Get workouts
- `GET /api/v1/schedules` - Get scheduled workouts

(More endpoints will be added as features are implemented)

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key to the `.env` file
3. Run database migrations (coming soon)

### Notification Configuration

**Development Mode:**
Set `MOCK_NOTIFICATIONS=true` in your `.env` file to log notifications to the console instead of sending actual emails/SMS.

**Production Mode:**
1. Configure Twilio credentials in `.env`
2. Set `MOCK_NOTIFICATIONS=false`
3. Notifications will be sent 1 hour before scheduled workouts

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Configure environment variables in Vercel dashboard

## Contributing

(Add contribution guidelines here)

## License

(Add license information here)

## Troubleshooting

### Port Already in Use Error

If you see "address already in use" for port 3000 or 5173:

**Quick Fix (Windows) - Option 1: PowerShell (Recommended):**
```powershell
# Right-click kill-ports.ps1 → Run with PowerShell
# OR from PowerShell terminal:
.\kill-ports.ps1
```

**Quick Fix (Windows) - Option 2: Batch File:**
```bash
# Double-click kill-ports.bat
# OR from command prompt:
kill-ports.bat
```

**Manual Fix:**
```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process (replace 1234 with the PID from above)
taskkill //F //PID 1234
```

**Or change the port in `.env`:**
```env
PORT=3001
```

### Backend Not Starting

Make sure you're using Node.js 20 or higher:
```bash
node --version
# Should show v20.x.x or v22.x.x
```

If you need to upgrade Node.js, use [nvm-windows](https://github.com/coreybutler/nvm-windows):
```bash
nvm install 22
nvm use 22
```

### Frontend Shows "Disconnected" Status

1. Make sure backend is running on port 3000
2. Check backend console for errors
3. Test: `curl http://localhost:3000/health`

## Support

For issues and questions, please create an issue in the repository.
