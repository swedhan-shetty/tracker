import { supabase, DatabaseDailyEntry, DatabaseHabit } from '../lib/supabase'
import { DailyEntry, Habit } from '../types'

export class DatabaseService {
  // Authentication
  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }

  // Daily Entries
  static async getDailyEntries(): Promise<DailyEntry[]> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (error) throw error

    return data.map(this.mapDatabaseEntryToAppEntry)
  }

  static async saveDailyEntry(entry: DailyEntry): Promise<DailyEntry> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const dbEntry: Partial<DatabaseDailyEntry> = {
      id: entry.id,
      user_id: user.id,
      date: entry.date,
      mood: entry.mood,
      energy: entry.energy,
      productivity: entry.productivity,
      sleep: entry.sleep,
      exercise: entry.exercise ? 1 : 0, // Convert boolean to integer
      notes: entry.notes,
      goals: entry.goals || [],
      habits: entry.habits || [],
      simple_tasks: (entry as any).simpleTasks || [],
      supplements: (entry as any).supplements || [],
    }

    const { data, error } = await supabase
      .from('daily_entries')
      .upsert(dbEntry)
      .select()
      .single()

    if (error) throw error

    return this.mapDatabaseEntryToAppEntry(data)
  }

  static async deleteDailyEntry(id: string): Promise<void> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('daily_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Habits
  static async getHabits(): Promise<Habit[]> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) throw error

    return data.map(this.mapDatabaseHabitToAppHabit)
  }

  static async saveHabit(habit: Habit): Promise<Habit> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const dbHabit: Partial<DatabaseHabit> = {
      id: habit.id,
      user_id: user.id,
      name: habit.name,
      description: habit.description,
      category: habit.category,
    }

    const { data, error } = await supabase
      .from('habits')
      .upsert(dbHabit)
      .select()
      .single()

    if (error) throw error

    return this.mapDatabaseHabitToAppHabit(data)
  }

  static async deleteHabit(id: string): Promise<void> {
    const user = await this.getCurrentUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Utility functions to map between database and app types
  private static mapDatabaseEntryToAppEntry(dbEntry: DatabaseDailyEntry): DailyEntry {
    return {
      id: dbEntry.id,
      date: dbEntry.date,
      mood: dbEntry.mood || 5,
      energy: dbEntry.energy || 5,
      productivity: dbEntry.productivity || 5,
      sleep: dbEntry.sleep || 8,
      exercise: !!dbEntry.exercise, // Convert integer back to boolean
      notes: dbEntry.notes || '',
      goals: dbEntry.goals || [],
      habits: dbEntry.habits || [],
    } as DailyEntry & { simpleTasks?: any[]; supplements?: any[] }
  }

  private static mapDatabaseHabitToAppHabit(dbHabit: DatabaseHabit): Habit {
    return {
      id: dbHabit.id,
      name: dbHabit.name,
      description: dbHabit.description || '',
      category: dbHabit.category || '',
      target: 1, // Default target
      color: '#8884d8' // Default color
    }
  }
}
