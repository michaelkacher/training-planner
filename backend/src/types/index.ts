export interface Athlete {
  id: string;
  name: string;
  email: string;
  position: 'Setter' | 'Outside Hitter' | 'Middle Blocker' | 'Opposite' | 'Libero' | 'Defensive Specialist';
  goals: string[];
  created_at: string;
  updated_at: string;
}

export type WorkoutType =
  | 'Court Practice/Skills'
  | 'Plyometrics'
  | 'Agility'
  | 'Strength'
  | 'Conditioning'
  | 'Rest'
  | 'Other';

export interface Workout {
  id: string;
  athlete_id: string;
  name: string;
  type: WorkoutType;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  intensity_rpe?: number; // 1-10 scale
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ScheduledWorkout {
  id: string;
  athlete_id: string;
  workout_id: string;
  scheduled_date: string;
  scheduled_time: string;
  is_recurring: boolean;
  recurrence_pattern?: string; // e.g., "weekly:tuesday,thursday"
  completed: boolean;
  completed_at?: string;
  actual_duration_minutes?: number;
  actual_sets?: number;
  actual_reps?: number;
  actual_rpe?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreference {
  id: string;
  athlete_id: string;
  email_enabled: boolean;
  sms_enabled: boolean;
  phone_number?: string;
  reminder_minutes_before: number; // default 60
  created_at: string;
  updated_at: string;
}

export interface TrainingPlan {
  id: string;
  athlete_id: string;
  name: string;
  description?: string;
  phase_type: 'Off-Season' | 'Pre-Season' | 'Competition' | 'Recovery';
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// DTOs for API requests
export interface CreateWorkoutDTO {
  name: string;
  type: WorkoutType;
  duration_minutes?: number;
  sets?: number;
  reps?: number;
  intensity_rpe?: number;
  description?: string;
}

export interface UpdateWorkoutDTO extends Partial<CreateWorkoutDTO> {}

export interface CreateTrainingPlanDTO {
  name: string;
  description?: string;
  phase_type: 'Off-Season' | 'Pre-Season' | 'Competition' | 'Recovery';
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
}

export interface CreateWorkoutSessionDTO {
  training_plan_id: string;
  workout_id?: string;
  scheduled_date: string;
  workout_summary?: string;
}

export interface UpdateWorkoutSessionDTO {
  status?: SessionStatus;
  notes?: string;
  workout_summary?: string;
}
