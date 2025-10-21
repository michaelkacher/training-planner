# Volleyball Training Planner - Development Instructions

## Project Overview

A full-stack volleyball training application built with SvelteKit (frontend) and Fastify (backend). Users can create custom workouts, manage training plans, track progress, and sync with external calendars.

## 📐 Architecture Guidelines

**IMPORTANT**: Before making any architecture changes, read [sveltekit-architectural-best-practices.md](./sveltekit-architectural-best-practices.md) for:

- Routing and Layouts
- State Management
- Component Architecture
- Performance & Optimization

## Design Guidelines

**IMPORTANT**: Before making any architecture changes, read [clean-website-design.md](./clean-website-design.md) for:

- Core Design Principles
- Layout and Structure
- Typography (Readability Focus)
- Color, Contrast, and Aesthetics
- Accessibility (A11y)

## Tech Stack

- **Frontend**: SvelteKit 5 (with Svelte 5 runes), TypeScript, Tailwind CSS
- **Backend**: Fastify, TypeScript, In-memory data store
- **Styling**: Tailwind CSS with custom component classes
- **State**: Svelte 5 runes ($state, $derived, $effect)

## Project Structure

```
training-planner/
├── frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/     # Reusable components
│   │   │   ├── stores/         # Global state stores
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   ├── utils/          # Utility functions
│   │   │   └── config.ts       # Centralized configuration
│   │   └── routes/             # SvelteKit file-based routing
│   ├── static/                 # Static assets
│   └── tailwind.config.js      # Tailwind configuration
├── backend/
│   ├── src/
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Backend utilities
│   │   └── index.ts            # Server entry point
│   └── .env                    # Environment variables
└── .claude/
    └── instructions.md         # This file
```

## Key Design Principles

### 1. **Clean, Professional Design**

- Use Tailwind utility classes for all styling
- Follow the established color scheme:
  - Primary: Purple (#8B5CF6)
  - Accent: Pink (#EC4899)
  - Background: Gray-50 (#F9FAFB)
  - Cards: White with subtle shadows
- Maintain consistent component styling using pre-defined classes in `app.css`
- Keep designs simple, clean, and easy to use

### 2. **Consistent Components**

Always use these component classes from `app.css`:

- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- **Cards**: `.card`, `.card-interactive`, `.feature-card`, `.workout-card`
- **Navigation**: `.nav-bar`, `.nav-link`, `.nav-link.active`
- **Inputs**: `.input-field`
- **Badges**: `.badge-completed`, `.badge-scheduled`, `.badge-partial`, `.badge-skipped`
- **Headers**: `.page-header`, `.section-header`
- **Containers**: `.page-container`

### 3. **Svelte 5 Runes Usage**

Always use Svelte 5 runes syntax:

```typescript
// State
let count = $state(0);
let items = $state<Item[]>([]);

// Props
let { title, onSave }: { title: string; onSave: () => void } = $props();

// Derived
const doubled = $derived(count * 2);

// Effects
$effect(() => {
  console.log(`Count changed to ${count}`);
});
```

### 4. **API Communication**

- Use the centralized `apiRequest` function from `$lib/utils/api.ts`
- Never hardcode API URLs - use `config.apiUrl` from `$lib/config.ts`
- Always handle errors with try-catch and display user-friendly messages
- Use `LoadingSpinner` and `ErrorMessage` components

Example:

```typescript
import { apiRequest, APIError } from "$lib/utils/api";
import { config } from "$lib/config";
import LoadingSpinner from "$lib/components/LoadingSpinner.svelte";
import ErrorMessage from "$lib/components/ErrorMessage.svelte";

let isLoading = $state(true);
let error = $state<string | null>(null);
let data = $state<Data[]>([]);

async function fetchData() {
  isLoading = true;
  error = null;

  try {
    data = await apiRequest<Data[]>(
      `/api/v1/endpoint?athlete_id=${config.athleteId}`
    );
  } catch (err) {
    error = err instanceof APIError ? err.message : "An error occurred";
  } finally {
    isLoading = false;
  }
}
```

### 5. **Accessibility**

- Add `role` and `aria-*` attributes to interactive elements
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`)
- Include `aria-label` on buttons without text
- Ensure keyboard navigation works
- Add `alt` text to images (even emojis if decorative, use `aria-hidden="true"`)

### 6. **Error Handling**

- Always wrap API calls in try-catch blocks
- Display user-friendly error messages using `ErrorMessage` component
- Log errors to console for debugging
- Provide fallback UI for error states
- Never let the app crash silently

### 7. **Loading States**

- Show `LoadingSpinner` component during async operations
- Disable buttons/forms during submission
- Use `isLoading` state variable consistently
- Provide visual feedback for all async actions

### 8. **Type Safety**

- Import types from `$lib/types`
- Define proper TypeScript interfaces for all data structures
- Use type annotations for function parameters and return values
- Avoid `any` type - use `unknown` if type is truly unknown

### 9. **Code Organization**

- Extract repeated logic into utility functions
- Create reusable components in `$lib/components`
- Keep components focused and single-purpose
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### 10. **Environment Variables**

- Never commit `.env` files
- Use `.env.example` files to document required variables
- Access frontend env vars with `import.meta.env.VITE_*`
- Access backend env vars with `process.env.*`
- Centralize configuration in `$lib/config.ts`

## Common Patterns

### Page Structure

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { config } from '$lib/config';
  import { apiRequest } from '$lib/utils/api';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';

  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let data = $state<DataType[]>([]);

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    isLoading = true;
    error = null;
    try {
      data = await apiRequest<DataType[]>('/api/v1/endpoint');
    } catch (err) {
      error = 'Failed to load data. Please try again.';
      console.error(err);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="page-container">
  <h1 class="page-header">Page Title</h1>

  {#if error}
    <ErrorMessage message={error} onDismiss={() => error = null} />
  {/if}

  {#if isLoading}
    <LoadingSpinner />
  {:else}
    <!-- Content here -->
  {/if}
</div>
```

### Form Handling

```svelte
<script lang="ts">
  let formData = $state({ name: '', email: '' });
  let isSubmitting = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    isSubmitting = true;
    error = null;

    try {
      await apiRequest('/api/v1/submit', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      // Handle success
    } catch (err) {
      error = 'Submission failed. Please try again.';
    } finally {
      isSubmitting = false;
    }
  }
</script>

<form onsubmit={handleSubmit}>
  <input
    type="text"
    class="input-field"
    bind:value={formData.name}
    disabled={isSubmitting}
    required
  />
  <button type="submit" class="btn-primary" disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </button>
</form>
```

## API Endpoints

### Training Plans

- `GET /api/v1/training-plans?athlete_id={id}&is_active={boolean}` - Get plans
- `POST /api/v1/training-plans` - Create plan
- `POST /api/v1/training-plans/{id}/activate` - Activate plan

### Workout Sessions

- `GET /api/v1/workout-sessions?athlete_id={id}&training_plan_id={id}&start_date={date}&end_date={date}` - Get sessions
- `PATCH /api/v1/workout-sessions/{id}` - Update session

### Athletes

- `GET /api/v1/athletes` - Get all athletes
- `POST /api/v1/athletes` - Create athlete

### Auth

- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user

## Important Notes

### Date Handling

- Always use `formatDateForAPI(date)` for API requests (YYYY-MM-DD)
- Use `formatDisplayDate(dateString)` for user-facing dates
- Set hours to 0,0,0,0 when working with date-only values

### Athlete ID

- Development uses `default-athlete-123` from config
- Always get athlete ID from `config.athleteId`
- Never hardcode athlete IDs in components

### Navigation

- Use SvelteKit's `<a href="...">` for internal navigation
- Add `active` class to current page link
- Get current path from `$page.url.pathname`

### Testing

- Test all user flows manually
- Verify mobile responsiveness
- Check keyboard navigation
- Test error states
- Verify loading states display correctly

## When Making Changes

1. **Maintain Consistency**: Use existing patterns and components
2. **Test Thoroughly**: Verify changes work on desktop and mobile
3. **Handle Errors**: Add proper error handling for new features
4. **Add Loading States**: Show spinners for async operations
5. **Update Types**: Keep TypeScript definitions up-to-date
6. **Follow Design System**: Use Tailwind classes and predefined components
7. **Document Complex Logic**: Add comments for non-obvious code
8. **Keep It Simple**: Favor simple, readable code over clever solutions

## Common Tasks

### Adding a New Page

1. Create file in `frontend/src/routes/[page-name]/+page.svelte`
2. Import `page-container` and page structure
3. Add navigation link in `+layout.svelte`
4. Use consistent styling with existing pages

### Adding a New API Endpoint

1. Create route handler in `backend/src/routes/`
2. Register route in `backend/src/routes/index.ts`
3. Add TypeScript interface in `frontend/src/lib/types/`
4. Use `apiRequest` helper in frontend

### Adding a New Component

1. Create in `frontend/src/lib/components/`
2. Use Svelte 5 props syntax
3. Apply Tailwind classes for styling
4. Export for reuse

### Styling Changes

1. Prefer Tailwind utilities over custom CSS
2. Add reusable patterns to `app.css` `@layer components`
3. Keep designs consistent with existing pages
4. Test on mobile viewport

## Troubleshooting

### API Not Connecting

- Check backend is running on port 3000
- Verify CORS configuration
- Check `config.apiUrl` is correct

### Styles Not Applying

- Ensure Tailwind classes are in safelist or used directly
- Check `app.css` is imported in `+layout.svelte`
- Rebuild Tailwind if needed

### State Not Updating

- Verify using Svelte 5 runes (`$state`)
- Check reactivity with `$effect` for debugging
- Ensure not mutating arrays/objects directly (use reassignment)

## Resources

- [SvelteKit Docs](https://kit.svelte.dev/)
- [Svelte 5 Runes](https://svelte-5-preview.vercel.app/docs/runes)
- [Tailwind CSS](https://tailwindcss.com/)
- [Fastify Docs](https://fastify.dev/)
