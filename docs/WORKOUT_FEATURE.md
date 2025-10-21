# Custom Workout Builder - Feature Implementation

## Overview

The **Custom Training Plans** feature has been implemented! Athletes can now create, view, and manage custom workouts tailored to volleyball training.

## What's Been Implemented

### 1. Database Schema

Created comprehensive database schema in [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql):

- **`workouts`** table - stores custom workout definitions
- **`training_plans`** table - organizes workouts into plans
- **`scheduled_workouts`** table - calendar scheduling (ready for future implementation)
- **`athletes`** table - user profiles
- **`notification_preferences`** table - alert settings

**To set up the database:**

1. Log into your Supabase dashboard
2. Go to SQL Editor
3. Copy and paste the contents of [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql)
4. Run the script

### 2. Backend API Endpoints

**File:** [backend/src/routes/workouts.ts](backend/src/routes/workouts.ts)

Implemented REST API for workout management:

| Method | Endpoint               | Description                             |
| ------ | ---------------------- | --------------------------------------- |
| GET    | `/api/v1/workouts`     | Get all workouts (filter by athlete_id) |
| GET    | `/api/v1/workouts/:id` | Get single workout by ID                |
| POST   | `/api/v1/workouts`     | Create new workout                      |
| PUT    | `/api/v1/workouts/:id` | Update workout                          |
| DELETE | `/api/v1/workouts/:id` | Delete workout                          |

**Example API Usage:**

```bash
# Get all workouts
curl http://localhost:3000/api/v1/workouts

# Create a workout
curl -X POST http://localhost:3000/api/v1/workouts \
  -H "Content-Type: application/json" \
  -d '{
    "athlete_id": "demo",
    "name": "Morning Jump Training",
    "type": "Plyometrics",
    "duration_minutes": 45,
    "sets": 3,
    "reps": 10,
    "intensity_rpe": 7,
    "description": "Box jumps and vertical leap drills"
  }'
```

### 3. TypeScript Types

**Backend:** [backend/src/types/index.ts](backend/src/types/index.ts)
**Frontend:** [frontend/src/lib/types/index.ts](frontend/src/lib/types/index.ts)

Shared type definitions for:

- `Workout` - Workout entity
- `WorkoutType` - 7 volleyball-specific workout types
- `CreateWorkoutDTO` - API request format
- `TrainingPlan` - Training plan entity

**Supported Workout Types:**

1. 🏐 Court Practice/Skills
2. 💪 Plyometrics
3. ⚡ Agility
4. 🏋️ Strength
5. 🏃 Conditioning
6. 😴 Rest
7. 📋 Other

### 4. Workout Builder UI

A beautiful, energetic UI for managing workouts:

**Features:**

- ✅ **View all workouts** - Grid layout with workout cards
- ✅ **Create workouts** - Inline form with all workout fields
- ✅ **Delete workouts** - One-click removal with confirmation
- ✅ **RPE slider** - Visual intensity selection (1-10 scale)
- ✅ **Workout type icons** - Visual categorization with emojis
- ✅ **Responsive design** - Works on mobile and desktop

**Form Fields:**

- Name (required)
- Type (required) - dropdown with all 7 types
- Duration (minutes)
- Sets & Reps
- Intensity (RPE 1-10)
- Description

### 5. Navigation

The landing page now features:

- Clickable "Custom Training Plans" card → navigates to `/workouts`
- "Get Started →" call-to-action
- "Coming Soon" labels for calendar and progress tracking

## How to Use

### Access the Workout Builder

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Open your browser:**

   - Landing page: http://localhost:5173
   - Workouts page: http://localhost:5173/workouts

3. **Click "Custom Training Plans"** on the landing page

### Create Your First Workout

1. Click **"+ Create Workout"** button
2. Fill in the form:
   - **Name:** e.g., "Morning Jump Training"
   - **Type:** Choose from dropdown (e.g., "Plyometrics")
   - **Duration:** e.g., 45 minutes
   - **Sets/Reps:** e.g., 3 sets x 10 reps
   - **Intensity:** Slide to RPE 7
   - **Description:** Add any notes
3. Click **"Create Workout"**
4. Your workout appears as a card!

### Manage Workouts

- **View details:** All workouts displayed as cards with icons
- **Delete:** Click the 🗑️ icon on any workout card
- **Empty state:** Friendly message when no workouts exist

## Technical Details

### Frontend Architecture

- **Svelte 5 Runes:**

  - `$state()` for reactive form fields
  - Automatic re-rendering on data changes

- **API Integration:**

  - Fetch API for HTTP requests
  - Async/await for clean code
  - Error handling with user feedback

- **Styling:**
  - Component-scoped CSS
  - Gradient backgrounds matching brand
  - Hover effects and transitions
  - Fully responsive grid layout

### Backend Architecture

- **Fastify 5:**

  - Type-safe route handlers
  - Automatic JSON serialization
  - Request validation

- **Supabase Integration:**
  - PostgreSQL database
  - Real-time capabilities (ready for future)
  - Row-level security (commented out, ready for auth)

### Data Flow

```
User clicks "Create Workout"
  ↓
Frontend form collects data
  ↓
POST /api/v1/workouts
  ↓
Fastify validates request
  ↓
Supabase inserts into DB
  ↓
Returns created workout
  ↓
Frontend refreshes list
  ↓
New workout card appears
```

## Next Steps

The workout builder is complete! Here's what you can add next:

### Short Term

1. **Edit workouts** - Add update functionality
2. **Search/filter** - Find workouts by type or name
3. **Athlete profiles** - Replace "demo" with real auth

### Medium Term

4. **Training plans** - Group workouts into plans
5. **Calendar view** - Schedule workouts on dates
6. **Recurring workouts** - Weekly patterns

### Long Term

7. **Templates** - Pre-built workout templates
8. **Sharing** - Share workouts with teammates
9. **Analytics** - Track workout trends

## Testing

**Without Supabase (Demo Mode):**
The app works but won't persist data. You'll see empty state messages.

**With Supabase:**

1. Set up database using [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql)
2. Add credentials to [.env](.env):
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```
3. Restart the server
4. Workouts will persist!

## Screenshots

### Landing Page

- Updated with clickable "Custom Training Plans" card
- Backend status indicator shows "Connected" in green

### Workouts Page

- Clean header with "Create Workout" button
- Grid of workout cards with hover effects
- Each card shows: emoji, name, type, duration, sets/reps, RPE
- Empty state for first-time users

### Create Form

- Inline form with all fields
- Dropdown for workout types with emojis
- RPE slider with live value display
- Cancel/Submit buttons

## Files Created/Modified

**Created:**

- `DATABASE_SCHEMA.sql` - Database schema
- `backend/src/routes/workouts.ts` - Workout API endpoints
- `frontend/src/lib/types/index.ts` - Frontend types

**Modified:**

- `backend/src/routes/index.ts` - Register workout routes
- `backend/src/types/index.ts` - Add TrainingPlan type and DTOs

Enjoy building your volleyball training plans! 🏐
