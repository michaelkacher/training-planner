# Complete Project Structure

```
project-root/
├── .claude/
│   ├── commands/
│   │   ├── new-component.md
│   │   ├── new-api-route.md
│   │   ├── add-page.md
│   │   ├── setup-feature.md
│   │   ├── fix-bug.md
│   │   ├── refactor.md
│   │   └── deploy.md
│   ├── frontend/
│   │   └── CLAUDE.md
│   ├── backend/
│   │   └── CLAUDE.md
│   ├── styles/
│   │   └── CLAUDE.md
│   └── tests/
│       └── CLAUDE.md
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/         # shadcn/ui
│   │   │   │   └── features/
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   └── utils.ts
│   │   │   └── types/
│   │   ├── public/
│   │   ├── tests/
│   │   │   ├── integration/
│   │   │   └── e2e/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── playwright.config.ts
│   │   ├── .env.local
│   │   └── package.json
│   └── api/                    # Fastify backend
│       ├── src/
│       │   ├── index.ts
│       │   ├── app.ts
│       │   ├── routes/
│       │   │   ├── users.ts
│       │   │   └── auth.ts
│       │   ├── services/
│       │   ├── middleware/
│       │   ├── db/
│       │   │   ├── schema.ts
│       │   │   └── client.ts
│       │   └── types/
│       ├── tests/
│       │   └── integration/
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       ├── .env
│       └── package.json
├── packages/
│   ├── types/                  # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── user.ts
│   │   │   └── api.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── ui/                     # Shared UI components (optional)
│   │   └── package.json
│   └── config/                 # Shared configs
│       ├── tsconfig/
│       │   ├── base.json
│       │   ├── nextjs.json
│       │   └── node.json
│       └── eslint/
├── .github/
│   └── workflows/
│       ├── test.yml
│       └── deploy.yml
├── .gitignore
├── turbo.json
├── package.json
├── CLAUDE.md                   # Main orchestration
└── README.md
```

## Key Files

### Root package.json
```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test"
  }
}
```

### turbo.json
```json
{
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
    }
  }
}
```

### apps/web/package.json
```json
{
  "name": "web",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@repo/types": "workspace:*"
  }
}
```

### apps/api/package.json
```json
{
  "name": "api",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest"
  },
  "dependencies": {
    "fastify": "^5.0.0",
    "@fastify/cors": "^10.0.0",
    "drizzle-orm": "^0.35.0",
    "postgres": "^3.4.0",
    "@repo/types": "workspace:*"
  }
}
```

### packages/types/package.json
```json
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
```
