# Claude Sub-Agents Setup

Complete setup for using Claude sub-agents with your Next.js + Fastify project.

## Recommended Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Node.js + Fastify 5 + TypeScript
- **Database**: PostgreSQL via Supabase
- **Deployment**: Vercel
- **Testing**: Vitest + Playwright

## Directory Structure

```
.claude/
├── commands/           # Reusable commands
│   ├── new-component.md
│   ├── new-api-route.md
│   ├── add-page.md
│   ├── setup-feature.md
│   ├── fix-bug.md
│   ├── refactor.md
│   └── deploy.md
├── frontend/
│   └── CLAUDE.md      # Frontend agent instructions
├── backend/
│   └── CLAUDE.md      # Backend agent instructions
├── styles/
│   └── CLAUDE.md      # Styles agent instructions
└── tests/
    └── CLAUDE.md      # Tests agent instructions
```

## Installation

1. Copy the `.claude` directory to your project root
2. Copy `CLAUDE.md` to your project root
3. Start using the commands!

## Usage

### Talk to Specific Agents

"@frontend Create a user profile component"
"@backend Add a users API endpoint"
"@styles Update the button component styling"
"@tests Add e2e tests for login flow"

### Use Commands

"Create a new Button component that supports primary and secondary variants"
"Add a new page for user settings at /settings"
"Set up authentication feature with login and signup"
"Fix bug: users not loading on dashboard"
"Deploy to production"

## Project Setup

### Initialize Project

```bash
# Create monorepo structure
npm init -y
mkdir -p apps/web apps/api packages/types packages/config

# Install dependencies
npm install -D typescript turbo
```

### Frontend Setup (Next.js)

```bash
cd apps/web
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install react-hook-form zod @hookform/resolvers/zod @radix-ui/react-icons
npx shadcn@latest init
```

### Backend Setup (Fastify)

```bash
cd apps/api
npm init -y
npm install fastify @fastify/cors dotenv
npm install -D typescript tsx @types/node
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

### Testing Setup

```bash
# Frontend tests
cd apps/web
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @playwright/test msw

# Backend tests
cd apps/api
npm install -D vitest @vitest/coverage-v8
```

## Development

```bash
# Start everything
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

## Package Scripts

Add to root `package.json`:

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "test:e2e": "cd apps/web && playwright test"
  }
}
```

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (.env)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
```

## Tips

1. Use `@orchestration` for high-level architecture decisions
2. Use specific agents (@frontend, @backend, @styles, @tests) for implementation
3. Leverage commands for common tasks
4. Keep types in `packages/types` and share between apps
5. Run tests before committing

## More Information

See individual CLAUDE.md files for detailed agent-specific guidelines.
