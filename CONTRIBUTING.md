# Contributing to Athlete Training Planner

Thank you for your interest in contributing! This guide will help you get started.

## Quick Links

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and professional
- Focus on what's best for the athletes using this tool
- Help others learn and grow
- Give constructive feedback

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or pnpm
- Git
- A code editor (VS Code recommended)
- (Optional) Supabase account for database features

### First Time Setup

1. **Fork and clone:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/training-planner.git
   cd training-planner
   ```

2. **Install dependencies:**
   ```bash
   npm run install:all
   ```

3. **Start development:**
   ```bash
   npm run dev
   ```

4. **Verify it works:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000/health (should return `{"status":"ok"}`)

### Understanding the Codebase

**Read these first:**
1. [README.md](README.md) - Project overview
2. [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Architecture and patterns
3. [CHANGELOG.md](CHANGELOG.md) - What's been built

**Key directories:**
- `frontend/src/routes/` - Pages and UI components
- `backend/src/routes/` - API endpoints
- `frontend/src/lib/` - Shared frontend code
- `backend/src/services/` - Business logic

## Development Workflow

### 1. Pick or Create an Issue

**Before coding:**
- Check existing issues for something to work on
- Create a new issue if your idea isn't listed
- Discuss major changes before implementing

**Good first issues:**
- Look for "good first issue" label
- Documentation improvements
- UI polish
- Bug fixes

### 2. Create a Branch

```bash
git checkout -b feature/my-feature
# or
git checkout -b fix/bug-description
```

**Branch naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code improvements

### 3. Make Changes

**Development cycle:**
```bash
# Edit files
# Save (hot reload applies automatically)
# Test in browser
# Repeat
```

**Check your work:**
- [ ] Code runs without errors
- [ ] Works in mock mode (without database)
- [ ] Works with database (if applicable)
- [ ] No console errors or warnings
- [ ] Responsive on mobile
- [ ] TypeScript compiles cleanly

### 4. Commit Your Changes

**Write good commit messages:**
```bash
# Good
git commit -m "Add workout filtering by type"
git commit -m "Fix RPE slider not updating state"
git commit -m "Update README with installation steps"

# Bad
git commit -m "stuff"
git commit -m "fixed it"
git commit -m "WIP"
```

**Commit message format:**
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting, no code change
- `refactor:` Code change that neither fixes nor adds
- `test:` Adding tests
- `chore:` Maintenance

**Examples:**
```bash
feat: Add workout filtering by type

Users can now filter workouts by type (Strength, Agility, etc.)
from the dropdown menu on the workouts page.

Closes #45
```

```bash
fix: Handle empty workout list gracefully

Previously showed error when no workouts existed.
Now shows friendly empty state message instead.
```

### 5. Test Thoroughly

**Manual testing checklist:**
- [ ] Feature works as intended
- [ ] No regressions in existing features
- [ ] Error states handled gracefully
- [ ] Loading states show correctly
- [ ] Works on mobile (Chrome DevTools responsive mode)
- [ ] Works without database (mock mode)
- [ ] Works with database (if applicable)

**Browser testing:**
- Chrome (primary)
- Firefox
- Safari (if on Mac)
- Edge

### 6. Update Documentation

**If you:**
- Add a feature → Update README
- Change API → Update relevant docs
- Fix a bug → Consider adding to troubleshooting
- Make breaking changes → Update CHANGELOG

**Files to potentially update:**
- `README.md` - User-facing changes
- `DEVELOPMENT_GUIDE.md` - New patterns or decisions
- `CHANGELOG.md` - All changes
- Code comments - Complex logic

### 7. Submit Pull Request

**Before submitting:**
```bash
# Make sure everything works
npm run dev

# Check for TypeScript errors
cd frontend && npm run check
cd backend && tsc --noEmit
```

**PR template:**
```markdown
## What does this PR do?

Brief description of changes.

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How did you test this?

- [ ] Manual testing in browser
- [ ] Works in mock mode
- [ ] Works with database
- [ ] Mobile responsive

## Screenshots (if UI change)

[Add screenshots here]

## Related Issues

Closes #123
```

## Coding Standards

### TypeScript

**Use strict typing:**
```typescript
// ✅ Good
interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
}

// ❌ Avoid
const workout: any = {...};
```

**Avoid non-null assertions:**
```typescript
// ❌ Risky
const name = workout!.name;

// ✅ Safe
const name = workout?.name ?? 'Unknown';
```

### Svelte 5

**Use runes for reactivity:**
```typescript
// ✅ Reactive
let count = $state(0);
let doubled = $derived(count * 2);

// ❌ Not reactive in Svelte 5
let count = 0;
$: doubled = count * 2;
```

**Handle all states:**
```svelte
{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if items.length === 0}
  <p>No items found</p>
{:else}
  <!-- Content -->
{/if}
```

### Backend

**Always handle mock mode:**
```typescript
// ✅ Handles both modes
if (!isDbConnected || !supabase) {
  return reply.send(mockData);
}
const { data } = await supabase.from('table').select();
```

**Use proper HTTP status codes:**
```typescript
reply.status(201).send(data);  // Created
reply.status(204).send();       // No Content
reply.status(400).send({error: 'Bad request'});
reply.status(404).send({error: 'Not found'});
reply.status(500).send({error: 'Server error'});
```

**Log important events:**
```typescript
fastify.log.info('User created workout', { workoutId });
fastify.log.error('Failed to save', { error });
```

### CSS/Styling

**Use component-scoped styles:**
```svelte
<style>
  .my-component {
    /* Scoped to this component */
  }
</style>
```

**Follow existing patterns:**
- Purple gradient: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Border radius: `8px` for buttons, `12px` for cards
- Spacing: Multiples of `0.5rem` (8px)

**Mobile-first:**
```css
/* Mobile first */
.card {
  width: 100%;
}

/* Desktop */
@media (min-width: 768px) {
  .card {
    width: 50%;
  }
}
```

### File Organization

**Frontend routes:**
```
routes/
├── +page.svelte           # Landing page
├── +layout.svelte         # Shared layout
├── workouts/
│   └── +page.svelte      # /workouts page
└── templates/
    └── +page.svelte      # /templates page
```

**Backend routes:**
```
routes/
├── index.ts              # Route registration
├── workouts.ts           # Workout endpoints
└── athletes.ts           # Athlete endpoints (future)
```

## Project-Specific Guidelines

### Volleyball Focus

This app is specifically for volleyball athletes:
- Use volleyball terminology
- Include position-specific features
- Focus on relevant metrics (jump height, hit power, etc.)

### Simplicity First

From requirements: "Core principle is simplicity"
- Don't over-engineer
- Keep UI clean and intuitive
- Prioritize daily execution over complex features

### Mock Mode Support

All features must work without database:
- Use in-memory fallbacks
- Show helpful console messages
- Guide users to database setup

## Common Tasks

### Adding a New API Endpoint

1. **Define types:**
   ```typescript
   // backend/src/types/index.ts
   export interface MyEntity {
     id: string;
     name: string;
   }
   ```

2. **Create route file:**
   ```typescript
   // backend/src/routes/my-route.ts
   export function registerMyRoutes(fastify: FastifyInstance) {
     fastify.get('/my-route', async (request, reply) => {
       // Implementation
     });
   }
   ```

3. **Register routes:**
   ```typescript
   // backend/src/routes/index.ts
   import { registerMyRoutes } from './my-route.js';
   registerMyRoutes(app);
   ```

### Adding a New Page

1. **Create route:**
   ```bash
   mkdir frontend/src/routes/my-page
   touch frontend/src/routes/my-page/+page.svelte
   ```

2. **Add content:**
   ```svelte
   <script lang="ts">
     let data = $state('Hello');
   </script>

   <h1>{data}</h1>
   ```

3. **Add navigation:**
   ```svelte
   <a href="/my-page">My Page</a>
   ```

### Updating Database Schema

1. **Modify `DATABASE_SCHEMA.sql`**
2. **Update TypeScript types**
3. **Update mock data structures**
4. **Test both modes**
5. **Document migration if needed**

## Need Help?

- **Questions?** Create an issue with the "question" label
- **Bug?** Create an issue with steps to reproduce
- **Feature idea?** Create an issue for discussion first
- **Stuck?** Check [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Appreciated for their work! 🎉

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (to be determined).

---

Thank you for contributing to help volleyball athletes train better! 🏐
