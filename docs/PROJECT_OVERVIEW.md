# Project Overview

## What is This?

**Athlete Training Planner** is a web application designed to help volleyball athletes create, schedule, and track their training programs. Think of it as a digital training coach that helps athletes stay organized and accountable.

## Who Is It For?

**Primary Users:**

- Amateur to intermediate volleyball players
- Club, high school, and competitive recreational athletes
- Athletes who want structure and accountability in their training

**What They Need:**

- Personalized workout plans tailored to their position
- Visual calendar to see their training schedule
- Reminders to stay on track
- Progress tracking to see improvements

## Core Philosophy

> **Simplicity and focus on the athlete's daily execution**

This isn't a complex training management system. It's focused on:

- Quick workout creation
- Easy scheduling
- Simple tracking
- Daily actionability

## Current Status

### ✅ What's Working

**Workout Builder:**

- Create custom workouts with volleyball-specific types
- Define duration, sets, reps, intensity (RPE)
- Add notes and descriptions
- View all workouts in a grid
- Delete unwanted workouts

**Training Templates:**

- Browse pre-configured training programs
- View detailed exercise breakdowns
- See full program structure (phases, days, exercises)
- Three templates included (4-week performance, 6-week beginner, 8-week setter)

**Development Experience:**

- Works without database (mock mode)
- Hot reload for instant feedback
- TypeScript for type safety
- Beautiful, energetic UI

### 🚧 What's Planned

**Near Term:**

- Edit existing workouts
- Filter/search workouts
- Athlete profiles
- Start from template (convert template to custom workouts)

**Mid Term:**

- Calendar view for scheduling
- Drag-and-drop workout scheduling
- Recurring workout patterns
- Mark workouts as complete
- Post-workout logging (actual duration, RPE, notes)

**Long Term:**

- Email/SMS notifications (1 hour before workout)
- Progress tracking and analytics
- Weekly compliance reports
- iCal integration (Google/Apple Calendar)
- Export/share training plans
- Mobile app

## Technology Choices

### Why Svelte 5?

**Pros:**

- Modern, simple reactivity with runes
- Excellent performance (smaller bundles)
- Great developer experience
- TypeScript support

**Trade-offs:**

- Requires Node.js 20+
- Smaller ecosystem than React
- Newer, less Stack Overflow answers

### Why Fastify?

**Pros:**

- Fast (as the name suggests)
- Excellent TypeScript support
- Modern async/await patterns
- Plugin ecosystem

**Trade-offs:**

- Less mature than Express
- Fewer tutorials available
- Different patterns than Express

### Why Supabase?

**Pros:**

- Managed PostgreSQL (no server management)
- Real-time capabilities (for future features)
- Built-in authentication (ready when needed)
- Free tier for development

**Trade-offs:**

- Vendor lock-in
- Requires internet for database
- Free tier has limits

**Mitigation:**

- Mock mode allows development offline
- Standard PostgreSQL, easy to migrate

## Architecture

### High-Level Flow

```
User Browser
    ↓
Frontend (SvelteKit)
    ↓ HTTP/JSON
Backend API (Fastify)
    ↓ SQL
Database (Supabase/PostgreSQL)
```

### Key Design Decisions

**1. Monorepo with Separate Packages**

- Frontend and backend in same repo
- Separate package.json for each
- Unified development command
- Benefits: Easy development, shared types, single deploy

**2. Mock Mode for Development**

- Backend works without database
- In-memory storage for workouts
- Graceful fallback if Supabase not configured
- Benefits: Fast setup, no dependencies, easy testing

**3. TypeScript Everywhere**

- Both frontend and backend use TypeScript
- Shared type definitions
- Compile-time error catching
- Benefits: Fewer runtime errors, better DX

**4. API-First Design**

- Backend exposes REST API
- Frontend consumes API
- Clear separation of concerns
- Benefits: Future mobile app possible, testable

## Code Organization

### Frontend Structure

```
frontend/src/
├── lib/
│   ├── data/               # Static data (templates)
│   │   └── training-templates.ts
│   └── types/              # TypeScript types
│       └── index.ts
```

**Key Patterns:**

- `$lib/` is aliased, can import as `$lib/types`
- Use Svelte 5 runes: `$state()`, `$derived()`

### Backend Structure

```
backend/src/
├── config/
│   └── supabase.ts         # Database client
├── routes/
│   ├── index.ts            # Route registration
│   └── workouts.ts         # Workout endpoints
├── services/
│   └── notifications.ts    # Email/SMS service
├── types/
│   └── index.ts            # TypeScript types
└── index.ts                # Server entry point
```

**Key Patterns:**

- One file per resource (workouts.ts, athletes.ts, etc.)
- Export route registration function
- Register all routes in `routes/index.ts`
- Services are business logic, routes are thin

## Data Model

### Core Entities

**Athlete:**

- Profile (name, email, position)
- Goals (what they want to improve)
- Notification preferences

**Workout:**

- Name (e.g., "Morning Jump Training")
- Type (Court Practice, Plyometrics, etc.)
- Duration, sets, reps
- Intensity (RPE 1-10)
- Description/notes

**Training Plan:**

- Name (e.g., "4-Week Performance Program")
- Phase type (Off-Season, Pre-Season, etc.)
- Start/end dates
- Associated workouts

**Scheduled Workout:**

- Links workout to calendar date/time
- Tracks completion
- Logs actual performance vs. planned
- Supports recurring patterns

### Relationships

```
Athlete
  ├── has many Workouts
  ├── has many Training Plans
  └── has many Scheduled Workouts

Training Plan
  └── contains many Workouts

Scheduled Workout
  ├── belongs to Athlete
  ├── references Workout
  └── belongs to Training Plan (optional)
```

## User Flows

### Creating a Custom Workout

1. User clicks "Create Custom Workouts" on landing page
2. Lands on workouts page
3. Clicks "+ Create Workout"
4. Form appears inline
5. Fills in: name, type, duration, sets/reps, RPE, notes
6. Clicks "Create Workout"
7. Workout saves (to database or memory)
8. Form closes, workout appears in grid
9. User can create more or navigate away

### Browsing Templates

1. User clicks "Browse Training Templates" on landing page
2. Lands on templates page
3. Sees grid of 3 template cards
4. Each card shows: title, duration, level, goals
5. Clicks card to view details
6. Modal opens with full program breakdown
7. Sees all phases, workout days, exercises
8. Can click "Start This Program" (future feature)
9. Or closes modal to browse more

### (Future) Scheduling a Workout

1. User goes to calendar view
2. Clicks a date
3. Modal shows: "Schedule a Workout"
4. Selects from existing workouts or creates new
5. Sets time, recurring pattern (optional)
6. Saves
7. Workout appears on calendar
8. Optional: Set reminder (email/SMS)

## Development Workflow

### Typical Day

1. **Start servers:** `npm run dev`
2. **Make changes** to files
3. **See results** instantly (hot reload)
4. **Test** in browser
5. **Commit** when feature works
6. **Repeat**

### Adding a Feature

1. **Plan:** What problem does it solve?
2. **Design:** How will it work?
3. **Database:** Update schema if needed
4. **Backend:** Create API endpoints
5. **Frontend:** Build UI
6. **Test:** Both mock and database modes
7. **Document:** Update relevant docs
8. **Commit:** With clear message

### Common Tasks

**Add API endpoint:**

- Edit `backend/src/routes/[resource].ts`
- Define TypeScript types
- Handle both mock and database modes
- Register in `routes/index.ts`

**Update styling:**

- Edit component's `<style>` block
- Follow existing color scheme
- Test mobile responsiveness

## Testing Strategy

### Current (Manual)

- Visual inspection in browser
- Test both mock and database modes
- Check browser console for errors
- Try on mobile (DevTools responsive mode)

### Future (Automated)

**Unit Tests:**

- Backend route handlers
- Frontend utility functions
- Service layer logic

**Integration Tests:**

- API endpoint flows
- Database operations
- Mock mode fallbacks

**E2E Tests:**

- Complete user flows
- Multi-page journeys
- Form submissions

## Deployment

### Current Setup

**Development:**

- Everything runs locally
- `npm run dev` starts both servers
- No deployment needed

### Future Production

**Frontend (Vercel):**

- Deploy SvelteKit app to Vercel
- Auto-deploy from main branch
- Environment variables in dashboard

**Backend:**

- Deploy to Vercel as serverless
- Or dedicated Node.js hosting
- Environment variables configured

**Database:**

- Supabase is already hosted
- Just update production credentials
- Run migrations as needed

## Security Considerations

### Current (Development Mode)

⚠️ **Not production-ready:**

- No authentication
- All users share "demo" athlete
- CORS allows all localhost
- No input validation
- No rate limiting

### Future (Production)

**Must implement:**

- [ ] Supabase Auth integration
- [ ] Row Level Security (RLS) policies
- [ ] Input validation and sanitization
- [ ] CORS restricted to production domain
- [ ] Rate limiting on API
- [ ] HTTPS enforced
- [ ] Environment variables secured
- [ ] SQL injection prevention (Supabase handles)
- [ ] XSS prevention (Svelte escapes by default)

## Performance Targets

### Current

- Development: ~2s for hot reload
- Backend API: <100ms response time
- Frontend load: <3s on 3G

### Future Goals

- Backend API: <50ms response time
- Frontend load: <1s on 4G
- Lighthouse score: 90+ all metrics
- Bundle size: <200KB gzipped

## Accessibility

### Current

- Semantic HTML
- Keyboard navigation (basic)
- Color contrast (passes WCAG AA)

### Future

- [ ] ARIA labels
- [ ] Screen reader testing
- [ ] Keyboard shortcuts
- [ ] Focus indicators
- [ ] Skip links
- [ ] Form error announcements

## Browser Support

### Target

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

### Known Issues

- None currently

## Mobile Support

### Current

- Responsive design
- Works on mobile browsers
- Touch-friendly buttons

### Future

- [ ] Native mobile app (React Native?)
- [ ] PWA (offline mode)
- [ ] Push notifications
- [ ] Haptic feedback

## Questions for New Contributors

**"Where do I start?"**
→ Read [CONTRIBUTING.md](CONTRIBUTING.md), pick a "good first issue"

**"How do I run this?"**
→ See [QUICKSTART.md](QUICKSTART.md)

**"Why did you make X decision?"**
→ Check [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) or [CHANGELOG.md](CHANGELOG.md)

**"Can I add feature Y?"**
→ Create an issue first to discuss, then go for it!

**"How do I deploy this?"**
→ Not production-ready yet, stay tuned

**"Is this production-ready?"**
→ No, it's in active development

## Project Goals

### Short Term (Next 2 Weeks)

- [ ] Edit workouts
- [ ] Filter/search workouts
- [ ] Athlete profiles
- [ ] Start from template

### Medium Term (Next Month)

- [ ] Calendar view
- [ ] Schedule workouts
- [ ] Mark complete
- [ ] Basic tracking

### Long Term (Next 3 Months)

- [ ] Notifications
- [ ] Progress analytics
- [ ] Mobile app
- [ ] Authentication

## Success Metrics

When production-ready, we'll track:

- Active athletes using the app
- Workouts created per athlete
- Training plans completed
- Workout compliance rate (completed vs. scheduled)
- User retention (7-day, 30-day)

## Contributing

We'd love your help! See [CONTRIBUTING.md](CONTRIBUTING.md).

**Areas needing help:**

- Frontend UI/UX improvements
- Backend API features
- Documentation
- Testing
- Mobile app development
- Design assets

## License

To be determined.

## Contact

For questions or suggestions, create an issue on GitHub.

---

Welcome to the project! Let's help volleyball athletes train better! 🏐
