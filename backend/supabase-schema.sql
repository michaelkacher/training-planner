-- Users table for authentication
-- Run this SQL in your Supabase SQL editor to create the users table

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Create policy to allow anyone to insert (for registration)
CREATE POLICY "Anyone can register" ON users
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);
