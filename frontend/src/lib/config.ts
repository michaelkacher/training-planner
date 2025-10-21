// Centralized configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  athleteId: import.meta.env.VITE_ATHLETE_ID || 'default-athlete-123',
  appName: 'Volleyball Training Planner',
  appDescription: 'Create custom workouts, track your progress, and take your volleyball game to the next level',
} as const;
