# Changelog

All notable changes and development milestones for the Athlete Training Planner project.

## [Unreleased]

### Planned Features
- Athlete authentication and profiles
- Calendar view for scheduling workouts
- Progress tracking and analytics
- Recurring workout scheduling
- Email/SMS notifications
- iCal integration for Google/Apple Calendar
- Export training plans
- Mobile app

## [0.2.0] - 2025-10-19

### Added - Training Plan Templates

**New Features:**
- Training plan template library with 3 pre-configured programs
- Template browsing page with beautiful card layout
- Detailed template view modal with all exercises
- Navigation between templates and custom workouts
- Hero section with prominent call-to-action buttons

**Templates Included:**
- 4-Week Volleyball Performance Program (Intermediate)
- Beginner Volleyball Fundamentals (6 weeks)
- Setter Development Program (8 weeks)

**Files Created:**
- `frontend/src/lib/data/training-templates.ts` - Template data structure
- `frontend/src/routes/templates/+page.svelte` - Templates UI

**Files Modified:**
- `frontend/src/routes/+page.svelte` - Added hero buttons
- `frontend/src/routes/workouts/+page.svelte` - Added template link

## [0.1.0] - 2025-10-19

### Added - Core Application Setup

**Project Initialization:**
- SvelteKit 2 + Svelte 5 frontend with TypeScript
- Fastify 5 backend with TypeScript
- Supabase integration (PostgreSQL)
- Unified development environment (`npm run dev`)
- Hot module reloading for both frontend and backend
- Mock mode for development without database

**Infrastructure:**
- Complete database schema for all features
- Environment variable configuration
- CORS setup for all localhost ports
- Twilio notification service with mock mode
- Error handling and graceful fallbacks

**Files Created:**
- `DATABASE_SCHEMA.sql` - Complete database structure
- `backend/src/config/supabase.ts` - Database client with mock mode
- `backend/src/services/notifications.ts` - Email/SMS service
- `backend/src/types/index.ts` - TypeScript type definitions
- `frontend/src/lib/types/index.ts` - Frontend types
- `.env.example` - Environment variable template
- `kill-ports.bat` - Utility for killing dev servers
- `kill-ports.ps1` - PowerShell port management

### Added - Workout Builder Feature

**Features:**
- Create custom volleyball-specific workouts
- View all workouts in grid layout
- Delete workouts
- 7 workout types with emoji icons
- RPE slider (1-10 intensity scale)
- Form validation and error handling

**Workout Types:**
- Court Practice/Skills 🏐
- Plyometrics 💪
- Agility ⚡
- Strength 🏋️
- Conditioning 🏃
- Rest 😴
- Other 📋

**Backend API:**
- `GET /api/v1/workouts` - List workouts
- `GET /api/v1/workouts/:id` - Get single workout
- `POST /api/v1/workouts` - Create workout
- `PUT /api/v1/workouts/:id` - Update workout
- `DELETE /api/v1/workouts/:id` - Delete workout

**Files Created:**
- `backend/src/routes/workouts.ts` - Workout API endpoints
- `frontend/src/routes/workouts/+page.svelte` - Workout builder UI

**Files Modified:**
- `backend/src/routes/index.ts` - Registered workout routes
- `frontend/src/routes/+page.svelte` - Added navigation to workouts

### Added - Landing Page

**Features:**
- Energetic volleyball brand design
- Feature cards with hover effects
- Backend status indicator
- Responsive mobile layout
- Gradient backgrounds and animations

**Design:**
- Purple gradient color scheme (#667eea to #764ba2)
- Modern card-based layout
- Smooth transitions and hover effects
- Mobile-first responsive design

## [0.0.1] - 2025-10-19

### Initial Setup

**Project Structure:**
- Root package.json for unified scripts
- Frontend and backend as separate packages
- Concurrent development server setup
- Git configuration with proper .gitignore

**Documentation:**
- README.md with comprehensive setup instructions
- QUICKSTART.md for fast reference
- Environment variable examples
- Troubleshooting section

**Development Tools:**
- Port management scripts (Windows)
- Environment variable templates
- Automated dependency installation

---

## Development Notes

### Key Decisions

**Svelte 5 Upgrade (2025-10-19):**
- Upgraded from Svelte 4 to Svelte 5 for modern reactivity
- Required Node.js 20+ (upgraded from Node 18)
- Updated to use runes: `$state()`, `$derived()`, `$effect()`
- Changed from `<slot />` to `{@render children?.()}`

**Mock Mode Implementation (2025-10-19):**
- Added fallback to in-memory storage when database not configured
- Allows development without Supabase setup
- Graceful error handling for missing credentials
- Console warnings guide users to database setup

**CORS Configuration (2025-10-19):**
- Changed from single port to allow all localhost ports
- Fixes issues when Vite auto-selects different ports
- Maintains security in production mode

### Issues Resolved

**"Unexpected end of JSON input" (2025-10-19):**
- Cause: Backend crashed when Supabase credentials invalid
- Fix: Added mock mode with in-memory storage
- Benefit: App works immediately without setup

**Port conflicts (2025-10-19):**
- Created `kill-ports.bat` and `kill-ports.ps1`
- Automated process killing for common ports
- Documented manual resolution steps

**Svelte 5 compatibility (2025-10-19):**
- Fixed layout file to use Svelte 5 syntax
- Updated components to use runes
- Documented Svelte 4 vs 5 differences

### Migration Path

From Svelte 4 to Svelte 5:
```typescript
// Before
let count = 0;
$: doubled = count * 2;

// After
let count = $state(0);
let doubled = $derived(count * 2);
```

From `<slot />` to snippets:
```svelte
<!-- Before -->
<slot />

<!-- After -->
<script>
  let { children } = $props();
</script>
{@render children?.()}
```

### Performance Improvements

- Svelte 5: ~40% smaller bundle sizes
- Fastify 5: Better async performance
- Mock mode: No database latency in development
- Hot reload: Instant feedback during development

### Security Considerations

**Current (Development):**
- Mock mode active by default
- No authentication required
- CORS allows all localhost
- Demo athlete_id used

**Production TODO:**
- Enable Supabase Row Level Security
- Add authentication (Supabase Auth)
- Restrict CORS to production domain
- Implement proper user sessions

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

## Contributing

When contributing:
1. Update this CHANGELOG with your changes
2. Follow the format above
3. Include rationale for major decisions
4. Document breaking changes clearly
5. Link to relevant documentation

## Links

- [README](README.md) - Project overview
- [DEVELOPMENT_GUIDE](DEVELOPMENT_GUIDE.md) - Development patterns
- [QUICKSTART](QUICKSTART.md) - Quick reference
- [DATABASE_SCHEMA](DATABASE_SCHEMA.sql) - Database structure
