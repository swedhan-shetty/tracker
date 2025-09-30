import React from 'react';

export const DatabaseSetup: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const sqlSchema = `-- Enable Row Level Security on all tables
-- This ensures users can only see their own data

-- Create daily_entries table
CREATE TABLE daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE INDEX idx_daily_entries_user_date ON daily_entries(user_id, date DESC);
CREATE INDEX idx_habits_user ON habits(user_id, created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_daily_entries_updated_at 
  BEFORE UPDATE ON daily_entries 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at 
  BEFORE UPDATE ON habits 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`;

  return (
    <div className="database-setup">
      <div className="setup-card">
        <h2>🛠️ Database Setup Required</h2>
        <p>
          Your Daily Tracker is configured to use Supabase, but the database tables haven't been created yet.
          Follow these steps to complete the setup:
        </p>
        
        <div className="setup-steps">
          <div className="step">
            <h3>Step 1: Go to Supabase Dashboard</h3>
            <p>
              Visit <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                Supabase Dashboard
              </a> and open your project: <strong>daily-tracker</strong>
            </p>
          </div>

          <div className="step">
            <h3>Step 2: Run SQL Schema</h3>
            <p>Go to the SQL Editor in your Supabase dashboard and run this schema:</p>
            <div className="sql-container">
              <pre>{sqlSchema}</pre>
              <button 
                onClick={() => copyToClipboard(sqlSchema)}
                className="copy-button"
              >
                📋 Copy SQL
              </button>
            </div>
          </div>

          <div className="step">
            <h3>Step 3: Enable Authentication</h3>
            <p>
              Go to Authentication → Settings in your Supabase dashboard and make sure:
            </p>
            <ul>
              <li>Email authentication is enabled</li>
              <li>Email confirmations are disabled (for testing) or configure email provider</li>
            </ul>
          </div>

          <div className="step">
            <h3>Step 4: Refresh This Page</h3>
            <p>After completing the above steps, refresh this page to start using your Daily Tracker!</p>
            <button 
              onClick={() => window.location.reload()}
              className="refresh-button"
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>

        <div className="temp-solution">
          <h3>Alternative: Use localStorage (temporary)</h3>
          <p>
            If you want to use the app immediately without database setup, 
            you can temporarily revert to localStorage storage.
          </p>
          <button 
            onClick={() => {
              // This would trigger a localStorage-only mode
              localStorage.setItem('use-local-storage', 'true');
              window.location.reload();
            }}
            className="btn-secondary"
          >
            Use Local Storage (Temporary)
          </button>
        </div>
      </div>
    </div>
  );
};