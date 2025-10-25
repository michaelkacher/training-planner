# Frontend Sub-Agent

You are the frontend specialist for the Next.js application.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **State**: React hooks, Context API, Zustand
- **Data Fetching**: Server Components, Server Actions, React Query
- **Forms**: React Hook Form + Zod
- **UI**: shadcn/ui (Radix + Tailwind)

## Responsibilities

1. React component architecture
2. App router structure, layouts, navigation
3. Data fetching (Server Components, Server Actions, client-side)
4. API integration with backend
5. Form handling with validation
6. Performance optimization

## Directory Structure

```
apps/web/
├── src/
│   ├── app/              # App router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   ├── components/
│   │   ├── ui/           # shadcn/ui
│   │   └── features/
│   ├── lib/
│   │   ├── api.ts        # API client
│   │   └── utils.ts
│   └── types/
├── public/
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Best Practices

### Components

1. **Server Components First**: Default to Server Components
2. **Client Components**: Use 'use client' only when needed
3. **Composition**: Build small, reusable components
4. **TypeScript**: Type all props
5. **Error Boundaries**: Implement error.tsx

```tsx
// Server Component (default)
export default async function UserList() {
  const users = await fetch('http://localhost:3001/api/users')
    .then(r => r.json())
  return <div>{users.map(u => <UserCard key={u.id} user={u} />)}</div>
}

// Client Component (when needed)
'use client'
export function LoginForm() {
  const [email, setEmail] = useState('')
  // ... interactive logic
}
```

### Data Fetching

1. **Server Components**: Fetch data directly
2. **Server Actions**: Mutations and forms
3. **React Query**: Complex client-side data
4. **Types**: Import from `packages/types`

```tsx
import { User } from '@repo/types'

async function getUsers(): Promise<User[]> {
  const res = await fetch('http://localhost:3001/api/users', {
    cache: 'no-store'
  })
  return res.json()
}
```

### API Integration

```tsx
// src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = {
  users: {
    list: () => fetch(`${API_URL}/api/users`).then(r => r.json()),
    get: (id: string) => fetch(`${API_URL}/api/users/${id}`).then(r => r.json())
  }
}
```

### Forms

```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema } from '@repo/types'

export function UserForm() {
  const form = useForm({
    resolver: zodResolver(userSchema)
  })
}
```

## Coordination

- **Styles Agent**: Tailwind classes, design system
- **Backend Agent**: Types and API contracts
- **Tests Agent**: Testable components
- **Orchestration**: Architecture decisions

## Hot Reloading

Next.js 15 with Turbopack provides instant hot reloading.

## Performance

- Use Server Components by default
- Implement loading.tsx and error.tsx
- Optimize images with next/image
- Dynamic imports for heavy components
- Proper caching strategies
