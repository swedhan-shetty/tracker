-- Enable UUID extension (required for gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create daily_entries table
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  productivity INTEGER CHECK (productivity >= 1 AND productivity <= 10),
  sleep NUMERIC CHECK (sleep >= 0),
  exercise INTEGER CHECK (exercise >= 0),
  notes TEXT,
  goals JSONB DEFAULT '[]'::jsonb,
  habits JSONB DEFAULT '[]'::jsonb,
  simple_tasks JSONB DEFAULT '[]'::jsonb,
  supplements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one entry per user per date
  UNIQUE(user_id, date)
);

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own daily entries" ON daily_entries;
DROP POLICY IF EXISTS "Users can insert their own daily entries" ON daily_entries;
DROP POLICY IF EXISTS "Users can update their own daily entries" ON daily_entries;
DROP POLICY IF EXISTS "Users can delete their own daily entries" ON daily_entries;

DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;

-- Create policies for daily_entries
CREATE POLICY "Users can view their own daily entries" ON daily_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily entries" ON daily_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily entries" ON daily_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily entries" ON daily_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for habits
CREATE POLICY "Users can view their own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id, created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_daily_entries_updated_at ON daily_entries;
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;

-- Create triggers for updated_at
CREATE TRIGGER update_daily_entries_updated_at 
  BEFORE UPDATE ON daily_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at 
  BEFORE UPDATE ON habits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();