# Training Planner - Quick Start Guide

## Welcome!

Your full-stack Volleyball Training Planner application is now complete and running! 🏐

## What You Have

A complete training planner application with:
- **Backend**: Fastify + TypeScript API (Port 3000)
- **Frontend**: SvelteKit + TypeScript + Tailwind CSS (Port 5173)
- **Database**: Mock data (Supabase ready when you want to connect)

## Currently Running

✅ Backend: http://localhost:3000
✅ Frontend: http://localhost:5173

## Quick Test Flow

### 1. Create an Account
1. Go to: http://localhost:5173/register
2. Enter your name, email, and password
3. Click "Create Account"

### 2. Create a Training Plan
1. After login, click "Create New Plan" or navigate to http://localhost:5173/create
2. Fill in:
   - Plan Name: "My Summer Training"
   - Description: "Get ready for the season"
   - Phase: Select "Off-Season" (or any phase)
   - Dates will be pre-filled (you can change them)
3. Click "Create Training Plan"

### 3. View Your Calendar
1. Click "Calendar" in the navigation
2. You'll see a monthly calendar with auto-generated workout sessions
3. Click on any workout to:
   - View details
   - Mark as Complete
   - Skip

### 4. Check Your Dashboard
1. Click "Dashboard" in the navigation
2. See:
   - Weekly compliance percentage
   - Active plan info
   - Upcoming sessions
   - Quick actions

## Features Available Now

### Authentication
- ✅ User registration
- ✅ User login
- ✅ Persistent sessions
- ✅ Auto-redirect to login for protected pages

### Training Plans
- ✅ Create custom training plans
- ✅ Choose phase type (Off-Season, Pre-Season, Competition, Recovery)
- ✅ Set date ranges
- ✅ Auto-generate 4-week schedules
- ✅ View all plans
- ✅ Activate/deactivate plans

### Calendar
- ✅ Monthly view
- ✅ Navigate between months
- ✅ View scheduled workouts
- ✅ Color-coded status (blue=scheduled, green=completed, red=skipped)
- ✅ Click to view workout details
- ✅ Mark workouts as complete or skipped

### Dashboard
- ✅ Weekly compliance tracking
- ✅ Active plan overview
- ✅ Upcoming sessions list
- ✅ Quick navigation

## File Structure

```
training-planner/
├── backend/               # API Server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── types/        # TypeScript types
│   │   ├── services/     # Business logic
│   │   └── index.ts      # Server entry
│   └── package.json
│
├── frontend/             # SvelteKit App
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/  # Reusable UI
│   │   │   ├── stores/      # State management
│   │   │   ├── types/       # TypeScript types
│   │   │   └── utils/       # API client
│   │   ├── routes/          # Pages
│   │   └── app.css          # Styles
│   └── package.json
│
├── docs/                 # Documentation
└── package.json          # Root scripts
```

## Development Commands

### Start Both Servers
```bash
npm run dev:backend    # Start backend only (port 3000)
npm run dev:frontend   # Start frontend only (port 5173)
```

### Build for Production
```bash
npm run build
```

### Install All Dependencies
```bash
npm run install:all
```

## API Endpoints (for reference)

### Auth
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Training Plans
- `GET /api/v1/training-plans` - List plans
- `POST /api/v1/training-plans` - Create plan
- `POST /api/v1/training-plans/:id/activate` - Activate plan

### Workout Sessions
- `GET /api/v1/workout-sessions?athlete_id=X` - List sessions
- `PUT /api/v1/workout-sessions/:id` - Update session

## Current Mode: MOCK DATA

The app is currently running with mock data (no database connection). This means:
- ✅ Everything works and can be tested
- ⚠️ Data resets when you restart the server
- 💡 To persist data, connect Supabase (see backend/.env.example)

## Connecting to Supabase (Optional)

To persist data:
1. Sign up at https://supabase.com
2. Create a new project
3. Copy your project URL and anon key
4. Update `backend/.env`:
   ```
   SUPABASE_URL=your-project-url
   SUPABASE_ANON_KEY=your-anon-key
   ```
5. Run the database schema from `DATABASE_SCHEMA.sql`
6. Restart the backend server

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT (jsonwebtoken + bcrypt)

### Frontend
- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Svelte Stores
- **Build**: Vite

## Design Philosophy

- **Clean & Energetic**: Volleyball-themed with vibrant colors
- **Mobile-First**: Responsive on all devices
- **Type-Safe**: Full TypeScript coverage
- **Fast**: Optimized builds and hot reload
- **Simple**: Intuitive navigation and workflow

## Need Help?

- Backend docs: `/backend/README.md`
- Frontend docs: `/frontend/README.md`
- Setup instructions: `/docs/setup-instructions.md`
- Detailed frontend info: `/FRONTEND_README.md`

## What's Next?

The core application is complete! You can now:
1. Test all features
2. Customize the styling
3. Add more workout types
4. Connect to Supabase for data persistence
5. Deploy to production (Vercel recommended)

## Deployment Ready

Both frontend and backend are production-ready:
- Frontend: Deploy to Vercel (automatic SvelteKit support)
- Backend: Deploy to any Node.js host (Vercel, Railway, Fly.io)

---

**Enjoy building your volleyball training plans!** 🏐💪
