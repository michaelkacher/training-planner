# Authentication System Setup

## Overview

A complete JWT-based authentication system has been implemented for the Training Planner application. Users must log in to access any features.

## Features

- User Registration with email, password, and name
- User Login with JWT token generation
- Protected routes requiring authentication
- Navigation bar with logout functionality
- Mock mode support (works without Supabase)
- Secure password hashing with bcrypt
- Client-side auth state management with Svelte stores

## Architecture

### Backend (Fastify)
- **JWT Authentication**: Uses `@fastify/jwt` for token generation and verification
- **Password Security**: Bcrypt for password hashing
- **Middleware**: Authentication middleware at [backend/src/middleware/auth.ts](backend/src/middleware/auth.ts)
- **Auth Routes**: Registration, login, logout, and user info at [backend/src/routes/auth.ts](backend/src/routes/auth.ts)

### Frontend (SvelteKit)
- **Auth Store**: Svelte store managing authentication state at [frontend/src/lib/stores/auth.ts](frontend/src/lib/stores/auth.ts)
- **Login Page**: [frontend/src/routes/login/+page.svelte](frontend/src/routes/login/+page.svelte)
- **Register Page**: [frontend/src/routes/register/+page.svelte](frontend/src/routes/register/+page.svelte)
- **Route Protection**: Implemented in [frontend/src/routes/+layout.svelte](frontend/src/routes/+layout.svelte)

## API Endpoints

### POST /api/v1/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/v1/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### GET /api/v1/auth/me
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### POST /api/v1/auth/logout
Logout (client-side token removal, requires authentication).

**Headers:**
```
Authorization: Bearer {token}
```

## Database Setup (Optional - Supabase)

The system works in mock mode by default. To use Supabase:

1. Run the SQL schema at [backend/supabase-schema.sql](backend/supabase-schema.sql) in your Supabase SQL editor
2. Update your `.env` file with:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=your-secure-secret-key
   ```

## Testing

The authentication system has been tested with:
- User registration
- User login
- Protected endpoint access with valid token
- Unauthorized access rejection

## Usage

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:5173`
4. You'll be redirected to login page
5. Register a new account or login with existing credentials
6. Access all features after authentication

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- JWT tokens are stored in localStorage
- Protected routes automatically redirect to login
- Tokens are validated on protected endpoints
- Change the JWT_SECRET in production!
