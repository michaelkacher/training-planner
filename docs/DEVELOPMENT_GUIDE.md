# Development Guide

This guide captures the development journey and design decisions made while building the Athlete Training Planner application.

## Table of Contents

1. [Architecture Decisions](#architecture-decisions)
2. [Getting Started](#getting-started)
3. [Feature Development Process](#feature-development-process)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [Best Practices](#best-practices)

## Architecture Decisions

### Tech Stack Rationale

**Frontend: SvelteKit 2 + Svelte 5**

- **Why Svelte 5?** Modern reactivity with runes (`$state`, `$derived`, `$effect`)
- **Why SvelteKit?** Built-in routing, SSR, and excellent DX
- **Trade-offs:** Requires Node.js 20+, smaller ecosystem than React

**Backend: Fastify 5 + TypeScript**

- **Why Fastify?** High performance, excellent TypeScript support
- **Why not Express?** Fastify is faster and has better async/await support
- **Mock Mode:** Backend works without database for easy local development

**Database: PostgreSQL via Supabase**

- **Why Supabase?** Managed PostgreSQL, real-time capabilities, easy auth integration
- **Why PostgreSQL?** ACID compliance, excellent for relational data
- **Optional:** App works in mock mode without Supabase for development

### Project Structure

```
├── backend/               # Fastify API
│   ├── src/
│   │   ├── config/        # Configuration (Supabase, etc.)
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── .env                   # Environment variables
├── DATABASE_SCHEMA.sql    # Database setup
└── package.json           # Root scripts
```

## Getting Started

### Prerequisites

- **Node.js 20+** (required for Svelte 5 and Fastify 5)
- npm or pnpm
- (Optional) Supabase account

### Quick Start

1. **Install dependencies:**

   ```bash
   npm run install:all
   ```

2. **Configure environment (optional):**

   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials (optional for local dev)
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

### Mock Mode vs Database Mode

**Mock Mode (Default):**

- Works immediately without setup
- Data stored in memory (lost on restart)
- Perfect for development and testing

**Database Mode:**

1. Create Supabase project
2. Run [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql)
3. Update `.env` with credentials
4. Restart servers
5. Data persists permanently

## Feature Development Process

### Adding a New Feature

**Example: We added the Workout Builder feature**

1. **Design Database Schema**

   - Created tables in `DATABASE_SCHEMA.sql`
   - Planned relationships and indexes

2. **Define TypeScript Types**

   - Backend: `backend/src/types/index.ts`
   - Frontend: `frontend/src/lib/types/index.ts`
   - Keep them in sync!

3. **Build Backend API**

   - Create route file: `backend/src/routes/workouts.ts`
   - Implement CRUD operations
   - Add mock mode fallback
   - Register routes in `backend/src/routes/index.ts`

4. **Add Navigation**

   - Update landing page
   - Add links between related pages

5. **Test Both Modes**
   - Test without database (mock mode)
   - Test with database (if configured)

### Adding Training Templates

**Example: We added pre-configured training plans**

1. **Create Data Structure**

   - Defined TypeScript interfaces
   - Created `frontend/src/lib/data/training-templates.ts`

2. **Build UI Component**

   - Template cards with hover effects
   - Modal for detailed view
   - Responsive design

3. **Add Navigation**
   - Updated landing page with prominent buttons
   - Added cross-links between pages

## Common Issues & Solutions

### Issue: "Unexpected end of JSON input"

**Cause:** Backend crashed or returned empty response

**Solutions:**

1. Check if backend is running: `curl http://localhost:3000/health`
2. Check backend console for errors
3. Verify Supabase credentials (or use mock mode)
4. **Fix applied:** Backend now has graceful fallback to mock mode

### Issue: "address already in use 0.0.0.0:3000"

**Cause:** Previous dev server still running

**Solutions:**

1. **Quick:** Run `kill-ports.bat` (Windows)
2. **Manual:** Find and kill process:
   ```bash
   netstat -ano | findstr :3000
   taskkill //F //PID <PID>
   ```
3. **Alternative:** Change port in `.env`

### Issue: CORS errors in browser

**Cause:** Frontend on different port than expected

**Fix applied:** Backend now allows all `localhost:*` ports in development

### Issue: Svelte 5 syntax errors

**Common mistakes:**

- ❌ `let count = 0;` (not reactive in Svelte 5)
- ✅ `let count = $state(0);` (reactive)

- ❌ `<slot />` (Svelte 4)
- ✅ `{@render children?.()}` (Svelte 5)

### Issue: Node.js version incompatibility

**Symptoms:** "Unsupported engine" errors during install

**Solution:** Upgrade Node.js:

```bash
nvm install 22
nvm use 22
```

## Best Practices

### Backend Development

**1. Always Handle Mock Mode**

```typescript
// ❌ Don't assume database exists
const { data } = await supabase.from("workouts").select();

// ✅ Check if database is configured
if (!isDbConnected || !supabase) {
  return reply.send(mockData);
}
const { data } = await supabase.from("workouts").select();
```

**2. Use TypeScript Strictly**

```typescript
// ✅ Define request/response types
interface CreateWorkoutRequest {
  Body: CreateWorkoutDTO;
}

fastify.post<CreateWorkoutRequest>("/workouts", async (request, reply) => {
  const workoutData = request.body; // Fully typed!
});
```

**3. Return Proper HTTP Status Codes**

- 200: Success
- 201: Created
- 204: No Content (delete)
- 400: Bad Request
- 404: Not Found
- 500: Server Error

### Frontend Development

**1. Use Svelte 5 Runes**

```typescript
// ✅ Reactive state
let workouts = $state<Workout[]>([]);

// ✅ Derived values
let workoutCount = $derived(workouts.length);

// ✅ Side effects
$effect(() => {
  console.log(`${workoutCount} workouts`);
});
```

**3. Make Fetch Calls Resilient**

```typescript
try {
  const response = await fetch("http://localhost:3000/api/v1/workouts");
  if (response.ok) {
    workouts = await response.json();
  } else {
    error = "Failed to load workouts";
  }
} catch (err) {
  console.error(err);
  error = "Network error";
}
```

### TypeScript Best Practices

**1. Share Types Between Frontend/Backend**

- Define once in backend
- Copy to frontend `lib/types`
- Keep them synchronized

**2. Use Strict Mode**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**3. Avoid `any`**

```typescript
// ❌ Loses type safety
const data: any = await fetch(...);

// ✅ Explicit types
const data: Workout[] = await fetch(...);
```

### Database Best Practices

**1. Use Migrations**

- Keep `DATABASE_SCHEMA.sql` updated
- Version control your schema
- Document breaking changes

**2. Add Indexes**

```sql
CREATE INDEX idx_workouts_athlete_id ON workouts(athlete_id);
```

**3. Use Timestamps**

```sql
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

### Git Best Practices

**1. Don't Commit:**

- `.env` (use `.env.example`)
- `node_modules/`
- `dist/` or `build/`

**2. Do Commit:**

- `.env.example` with placeholder values
- `package-lock.json` for reproducible builds
- Documentation updates with code changes

**3. Commit Messages:**

- Use present tense: "Add workout builder" not "Added"
- Reference issues: "Fix #123: Handle empty workout list"
- Keep first line under 50 chars

## Development Workflow

### Daily Development

1. **Start servers:**

   ```bash
   npm run dev
   ```

2. **Make changes:**

   - Edit files
   - Hot reload applies automatically
   - Check browser console for errors

3. **Test changes:**

   - Frontend: Visual inspection
   - Backend: `curl` or Postman
   - Both: Browser DevTools Network tab

4. **Commit often:**
   ```bash
   git add .
   git commit -m "Add feature X"
   ```

### Adding a New Route

**Backend:**

```bash
touch backend/src/routes/my-route.ts
# Register in backend/src/routes/index.ts
```

### Debugging

**Backend Logs:**

- Fastify uses Pino logger
- Logs appear in backend console
- Pretty-printed in development

**Frontend Debugging:**

- Use browser DevTools
- Add `console.log()` statements
- Check Network tab for API calls

**Common Debug Points:**

```typescript
// Backend
fastify.log.info("Received request:", request.body);

// Frontend
$effect(() => {
  console.log("Workouts changed:", workouts);
});
```

## Testing Checklist

Before committing a feature:

- [ ] Works in mock mode (without database)
- [ ] Works with database (if applicable)
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Loading states handled
- [ ] Error states handled
- [ ] TypeScript compiles without errors
- [ ] Hot reload works
- [ ] Navigation links work
- [ ] Data persists (if using database)

## Performance Tips

**Frontend:**

- Use `$derived` for computed values (not recreating on every render)
- Avoid unnecessary re-renders
- Lazy load heavy components

**Backend:**

- Use database indexes
- Paginate large result sets
- Cache frequently accessed data

**Both:**

- Minimize bundle size
- Optimize images
- Use compression in production

## Security Considerations

**Current State (Development):**

- No authentication implemented
- Using "demo" athlete_id
- CORS allows all localhost ports

**Production Todos:**

- Add authentication (Supabase Auth recommended)
- Implement Row Level Security (RLS)
- Restrict CORS to specific domains
- Validate all inputs
- Sanitize user data
- Use HTTPS

## Deployment

**Frontend (Vercel):**

```bash
cd frontend
vercel
```

**Backend:**

- Can deploy to Vercel as serverless functions
- Or use dedicated Node.js hosting
- Set environment variables in dashboard

**Database:**

- Supabase is already hosted
- Just update `.env` with production credentials

## Resources

**Official Docs:**

- [Fastify Docs](https://fastify.dev/)
- [Supabase Docs](https://supabase.com/docs)

**Project Docs:**

- [README.md](README.md) - Overview and setup
- [QUICKSTART.md](QUICKSTART.md) - Quick reference
- [WORKOUT_FEATURE.md](WORKOUT_FEATURE.md) - Workout builder details
- [SVELTE5-UPGRADE.md](SVELTE5-UPGRADE.md) - Svelte 5 migration notes
- [DATABASE_SCHEMA.sql](DATABASE_SCHEMA.sql) - Database structure

## Contributing

When adding features:

1. Update this guide with new patterns
2. Document breaking changes
3. Add examples to help future developers
4. Update README if user-facing changes

## Questions?

Common questions are answered in:

- [README.md](README.md#troubleshooting) - Troubleshooting
- [WORKOUT_FEATURE.md](WORKOUT_FEATURE.md) - Feature details
- This guide - Development process

For new issues, check existing documentation first, then create an issue with:

- What you tried
- What happened
- What you expected
- Relevant logs/screenshots
