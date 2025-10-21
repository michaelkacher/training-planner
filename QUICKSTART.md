# Quick Start Guide

Get your Next.js + Fastify project running in minutes with Claude sub-agents.

## 1. Extract Files

Extract the `claude-subagents-setup.zip` to your project root:
```bash
unzip claude-subagents-setup.zip
cd claude-setup
```

## 2. Initialize Project

### Option A: Start from Scratch

```bash
# Create root package.json
npm init -y

# Copy over the package.json from this setup
cp package.json ../your-project/

# Install turbo
npm install -D turbo typescript
```

### Option B: Add to Existing Project

```bash
# Copy .claude directory
cp -r .claude /path/to/your/project/

# Copy CLAUDE.md
cp CLAUDE.md /path/to/your/project/
```

## 3. Setup Frontend (Next.js)

```bash
mkdir -p apps/web
cd apps/web

# Create Next.js app
npx create-next-app@latest . --typescript --tailwind --app

# Install additional dependencies
npm install react-hook-form zod @hookform/resolvers/zod
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react

# Install shadcn/ui
npx shadcn@latest init
```

## 4. Setup Backend (Fastify)

```bash
mkdir -p apps/api
cd apps/api
npm init -y

# Install dependencies
npm install fastify @fastify/cors dotenv zod
npm install -D typescript tsx @types/node vitest

# Install database (Drizzle + Postgres)
npm install drizzle-orm postgres
npm install -D drizzle-kit

# Create tsconfig.json
cat > tsconfig.json << 'JSON'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
JSON

# Create basic structure
mkdir -p src/routes src/services src/db
```

## 5. Setup Shared Types

```bash
mkdir -p packages/types/src
cd packages/types

cat > package.json << 'JSON'
{
  "name": "@repo/types",
  "version": "0.0.0",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "zod": "^3.23.0"
  }
}
JSON

cat > src/index.ts << 'TS'
export * from './user'
export * from './api'
TS
```

## 6. Configure Turbo

Create `turbo.json` in root:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

## 7. Add Scripts to Root package.json

```json
{
  "name": "fullstack-app",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.6.0"
  }
}
```

## 8. Setup Environment Variables

### Frontend (.env.local)
```bash
cd apps/web
cat > .env.local << 'ENV'
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ENV
```

### Backend (.env)
```bash
cd apps/api
cat > .env << 'ENV'
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
PORT=3001
ENV
```

## 9. Create Basic Backend Server

```bash
cd apps/api
cat > src/index.ts << 'TS'
import Fastify from 'fastify'
import cors from '@fastify/cors'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
})

app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
TS
```

Add to `apps/api/package.json`:
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 10. Run the Project

```bash
# From project root
npm run dev
```

This will start:
- Frontend at http://localhost:3000
- Backend API at http://localhost:3001

## 11. Use Claude Sub-Agents

Now you can use the sub-agents:

```
"@frontend Create a home page with a hero section"
"@backend Add a users API endpoint"
"@styles Setup the design system with custom colors"
"@tests Add integration tests for the users API"
```

Or use commands:
```
"Create a new Button component with primary and secondary variants"
"Add a new page for user profile at /profile"
"Set up authentication feature"
```

## Next Steps

1. Setup Supabase database
2. Add authentication
3. Create your first feature
4. Deploy to Vercel

See README.md for more details!
