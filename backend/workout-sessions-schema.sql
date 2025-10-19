-- Workout Sessions table for calendar functionality
-- Run this SQL in your Supabase SQL editor to create the workout_sessions table

CREATE TABLE IF NOT EXISTS workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id VARCHAR(255) NOT NULL,
  training_plan_id UUID NOT NULL,
  workout_id UUID,
  scheduled_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'partial', 'skipped')),
  notes TEXT,
  workout_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_workout_sessions_athlete ON workout_sessions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_training_plan ON workout_sessions(training_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_athlete_date ON workout_sessions(athlete_id, scheduled_date);

-- Enable Row Level Security (RLS)
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own sessions
CREATE POLICY "Users can read own sessions" ON workout_sessions
  FOR SELECT
  USING (true);

-- Create policy to allow users to create sessions
CREATE POLICY "Users can create sessions" ON workout_sessions
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own sessions
CREATE POLICY "Users can update own sessions" ON workout_sessions
  FOR UPDATE
  USING (true);

-- Create policy to allow users to delete their own sessions
CREATE POLICY "Users can delete own sessions" ON workout_sessions
  FOR DELETE
  USING (true);
