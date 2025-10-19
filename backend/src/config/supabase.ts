import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Check if Supabase is actually configured (not just placeholder values)
const isSupabaseConfigured =
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('your_supabase') &&
  !supabaseKey.includes('your_supabase') &&
  supabaseUrl.startsWith('https://');

if (!isSupabaseConfigured) {
  console.warn('⚠️  Supabase not configured. Running in MOCK mode.');
  console.warn('   Workouts will not persist. To enable database:');
  console.warn('   1. Sign up at https://supabase.com');
  console.warn('   2. Create a project');
  console.warn('   3. Update SUPABASE_URL and SUPABASE_ANON_KEY in .env');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export const isDbConnected = isSupabaseConfigured;
