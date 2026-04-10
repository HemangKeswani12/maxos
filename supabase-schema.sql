-- maxOS Supabase Schema
-- Run this in your Supabase SQL editor

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  image TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age >= 14 AND age <= 100),
  height_cm INTEGER CHECK (height_cm >= 100 AND height_cm <= 250),
  weight_kg NUMERIC(5,1) CHECK (weight_kg >= 20 AND weight_kg <= 300),
  insecurities TEXT[] DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Routine progress tracking
CREATE TABLE IF NOT EXISTS routine_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  routine_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress metrics (for charting)
CREATE TABLE IF NOT EXISTS progress_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  metric_key TEXT NOT NULL,
  metric_value NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routine_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;

-- Policies: users can only read/write their own data
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::TEXT = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::TEXT = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid()::TEXT = id);

CREATE POLICY "Users can view own routines" ON routine_progress
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own routines" ON routine_progress
  FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view own metrics" ON progress_metrics
  FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own metrics" ON progress_metrics
  FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
