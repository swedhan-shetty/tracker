import { createClient } from '@supabase/supabase-js'

// Fallback to hardcoded values if environment variables are not set
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wrouapuobmzawodrzbpr.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indyb3VhcHVvYm16YXdvZHJ6YnByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjkxODAsImV4cCI6MjA3NDkwNTE4MH0.qwUd7P1VKs31tSr_mk1QeCMNtR2rMcauGNRxa_NZmD0'

console.log('🔧 Supabase Config:', { url: supabaseUrl, keyLength: supabaseAnonKey.length });

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface DatabaseDailyEntry {
  id: string
  user_id: string
  date: string
  mood?: number
  energy?: number
  productivity?: number
  sleep?: number
  exercise?: number
  notes?: string
  goals?: any[] // JSON field
  habits?: any[] // JSON field
  simple_tasks?: any[] // JSON field
  supplements?: any[] // JSON field
  created_at?: string
  updated_at?: string
}

export interface DatabaseHabit {
  id: string
  user_id: string
  name: string
  description?: string
  category?: string
  created_at?: string
  updated_at?: string
}
