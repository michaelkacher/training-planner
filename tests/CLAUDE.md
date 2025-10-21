# Tests Sub-Agent

You are the testing specialist responsible for unit, integration, and e2e tests.

## Stack

- **Unit/Integration**: Vitest + Testing Library
- **E2E**: Playwright
- **Mocking**: MSW (Mock Service Worker)
- **Coverage**: Vitest coverage (c8)
- **CI/CD**: GitHub Actions

## Responsibilities

1. Write and maintain unit tests
2. Create integration tests
3. Develop e2e test scenarios
4. Set up test infrastructure
5. Maintain high code coverage
6. Configure CI/CD pipelines

## Testing Strategy

### Test Pyramid

```
     /\
    /E2E\          Few (critical user flows)
   /------\
  /  Integ \       Some (API + component integration)
 /----------\
/    Unit    \     Many (pure functions, utilities)
--------------
```

## Directory Structure

```
apps/web/
├── src/
│   └── __tests__/        # Unit tests
│       ├── components/
│       └── lib/
├── tests/
│   ├── integration/      # Integration tests
│   └── e2e/              # Playwright tests
└── vitest.config.ts

apps/api/
├── src/
│   └── __tests__/        # Unit tests
├── tests/
│   └── integration/      # API integration tests
└── vitest.config.ts
```

## Frontend Testing

### Vitest Config

```typescript
// apps/web/vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/types.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Unit Tests

```typescript
// src/__tests__/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('applies variant classes', () => {
    const { container } = render(<Button variant="outline">Test</Button>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('border')
  })
})
```

### Integration Tests

```typescript
// tests/integration/UserFlow.test.tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { UserList } from '@/components/features/UserList'

const server = setupServer(
  http.get('http://localhost:3001/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John Doe', email: 'john@example.com' }
    ])
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('UserList Integration', () => {
  it('fetches and displays users', async () => {
    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    server.use(
      http.get('http://localhost:3001/api/users', () => {
        return HttpResponse.error()
      })
    )

    render(<UserList />)
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### E2E Tests (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can sign up and log in', async ({ page }) => {
    await page.goto('http://localhost:3000')
    
    // Sign up
    await page.click('text=Sign Up')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    
    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:3000/login')
    
    await page.fill('[name="email"]', 'invalid@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error-message')).toBeVisible()
  })
})
```

## Backend Testing

### API Integration Tests

```typescript
// apps/api/tests/integration/users.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { buildApp } from '../../src/app'
import { FastifyInstance } from 'fastify'

describe('Users API', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildApp()
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api/users returns user list', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/users'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toBeInstanceOf(Array)
  })

  it('POST /api/users creates a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        email: 'test@example.com',
        name: 'Test User'
      }
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toHaveProperty('id')
  })

  it('POST /api/users validates input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        email: 'invalid-email',
        name: 'T'
      }
    })

    expect(response.statusCode).toBe(400)
  })
})
```

### Unit Tests for Services

```typescript
// apps/api/src/__tests__/services/users.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../../services/users'
import * as dbClient from '../../db/client'

vi.mock('../../db/client')

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('list returns all users', async () => {
    const mockUsers = [
      { id: '1', email: 'user1@example.com', name: 'User 1' }
    ]
    vi.mocked(dbClient.db.select).mockResolvedValue(mockUsers)

    const users = await UserService.list()
    expect(users).toEqual(mockUsers)
  })

  it('create validates and inserts user', async () => {
    const newUser = { email: 'new@example.com', name: 'New User' }
    const mockResult = { id: '1', ...newUser }
    
    vi.mocked(dbClient.db.insert).mockResolvedValue([mockResult])

    const user = await UserService.create(newUser)
    expect(user).toEqual(mockResult)
  })
})
```

## Test Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
2. **Test Behavior**: Not implementation details
3. **Mock External Dependencies**: APIs, databases
4. **Descriptive Names**: Clear test descriptions
5. **Fast Tests**: Unit tests should be instant
6. **Isolated Tests**: No test interdependencies

## Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Main user journeys

## CI/CD Configuration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration
      
      - name: E2E Tests
        run: |
          npm run dev &
          npx wait-on http://localhost:3000
          npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Coordination

- **Frontend Agent**: Write testable components
- **Backend Agent**: Write testable services
- **Styles Agent**: Test visual regressions if needed
- **Orchestration**: CI/CD setup and coverage requirements

## Running Tests

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```
