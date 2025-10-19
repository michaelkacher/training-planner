import type { WorkoutSession } from '../types/index.js';

// Shared mock storage for workout sessions
// This allows different routes to access the same mock data
export const mockSessions = new Map<string, WorkoutSession>();
