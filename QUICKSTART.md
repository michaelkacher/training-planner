# Quick Start Guide

## What's Been Set Up

Your Athlete Training Planner application is now fully configured with:

- **Frontend**: SvelteKit 2 + Svelte 5 with TypeScript (runs on http://localhost:5173)
- **Backend**: Fastify 5 API with TypeScript (runs on http://localhost:3000)
- **Database**: Supabase client configured (requires your credentials)
- **Notifications**: Twilio service with mock mode for development
- **Hot Reloading**: Automatic reload for both frontend and backend changes
- **Modern Stack**: Uses Svelte 5 runes, Fastify 5, and Node.js 22

## Start Developing Now

### 1. Start the Application

```bash
npm run dev
```

This single command starts both the frontend and backend with hot reloading enabled.

### 2. Open in Browser

- Frontend: http://localhost:5173 (or http://localhost:5174 if 5173 is busy)
- Backend Health Check: http://localhost:3000/health

### 3. Configure Supabase (Optional for now)

Edit `.env` file and add your Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

You can create a free Supabase account at https://supabase.com

## Project Structure Overview

```
training-planner/
├── frontend/src/
│   ├── routes/
│   │   └── +page.svelte          # Landing page (already styled!)
│   └── lib/                       # Add shared components here
│
├── backend/src/
│   ├── index.ts                   # Main server file
│   ├── routes/index.ts            # API routes
│   ├── services/
│   │   └── notifications.ts       # Email/SMS service
│   ├── config/
│   │   └── supabase.ts           # Database client
│   └── types/index.ts            # TypeScript types
│
└── .env                          # Environment variables
```

## Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build both for production
- `npm run install:all` - Install all dependencies

## Testing the Backend API

The backend has placeholder endpoints ready for you to implement:

```bash
# Health check
curl http://localhost:3000/health

# Sample API endpoints (currently return placeholder messages)
curl http://localhost:3000/api/v1/athletes
curl http://localhost:3000/api/v1/workouts
curl http://localhost:3000/api/v1/schedules
```

## Next Steps

1. **Set up Supabase database tables** (athletes, workouts, schedules, etc.)
2. **Implement API endpoints** in `backend/src/routes/`
3. **Create frontend pages** in `frontend/src/routes/`
4. **Build shared components** in `frontend/src/lib/`
5. **Connect frontend to backend API**

## Features Ready to Implement

All the boilerplate is done! You can now start implementing:

- Athlete profiles and goals
- Workout builder
- Calendar scheduling
- Notification system (already has mock mode working!)
- Progress tracking

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Review [setup-instructions.md](setup-instructions.md) for feature requirements
- TypeScript types are defined in `backend/src/types/index.ts`

Happy coding!
