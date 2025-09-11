import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

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
