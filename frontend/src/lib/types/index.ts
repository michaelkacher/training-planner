// Shared types for frontend (matches backend types)

export type WorkoutType =
  | 'Court Practice/Skills'
  | 'Plyometrics'
  | 'Agility'
  | 'Strength'
  | 'Conditioning'
  | 'Rest'
  | 'Other';

export type Position =
  | 'Setter'
  | 'Outside Hitter'
  | 'Middle Blocker'
  | 'Opposite'
  | 'Libero'
  | 'Defensive Specialist';

export type PhaseType = 'Off-Season' | 'Pre-Season' | 'Competition' | 'Recovery';

export interface Workout {
  id: string;
  athlete_id: string;
  name: string;
  type: WorkoutType;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  intensity_rpe?: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface TrainingPlan {
  id: string;
  athlete_id: string;
  name: string;
  description?: string;
  phase_type: PhaseType;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkoutDTO {
  name: string;
  type: WorkoutType;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  intensity_rpe?: number;
  description?: string;
}

export interface CreateTrainingPlanDTO {
  name: string;
  description?: string;
  phase_type: PhaseType;
  start_date?: string;
  end_date?: string;
}

export type SessionStatus = 'scheduled' | 'completed' | 'partial' | 'skipped';

export interface WorkoutSession {
  id: string;
  athlete_id: string;
  training_plan_id: string;
  workout_id?: string;
  scheduled_date: string;
  status: SessionStatus;
  notes?: string;
  workout_summary?: string;
  created_at: string;
  updated_at: string;
  workout?: Workout;
}

export interface CreateWorkoutSessionDTO {
  training_plan_id: string;
  workout_id?: string;
  scheduled_date: string;
  workout_summary?: string;
}
