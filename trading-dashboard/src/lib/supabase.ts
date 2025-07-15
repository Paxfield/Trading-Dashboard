import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mouxgjftujdctsraxjmu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXhnamZ0dWpkY3RzcmF4am11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Mjk5NzksImV4cCI6MjA2ODAwNTk3OX0.6NFWrVTfFpOH1-yOsL3jzaKuJeznZMDsQzdCDIhukkE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Trade {
  id?: number
  user_id?: string
  qty?: string
  buy_price?: number
  sell_price?: number
  pnl?: number
  bought_time?: string
  sold_time?: string
  duration?: string
  bias?: string
  commodity?: string
  symbol?: string
  stop_price?: number
  target_price?: number
  entry_class?: string
  execution_model?: string
  variables_used?: string
  trade_feeling?: string
  trade_management?: string
  win_loss_percent?: string
  return_amount?: number
  risk_amount?: number
  risk_reward?: string
  trade_timestamp?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface DailyScore {
  id?: number
  user_id?: string
  score_date: string
  scores?: any
  total_score?: number
  checklist_completed?: number
  total_checklist_items?: number
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Insight {
  id?: number
  user_id?: string
  insight_type: string
  title?: string
  content?: string
  data?: any
  filename?: string
  file_type?: string
  file_size?: number
  insight_date?: string
  created_at?: string
  updated_at?: string
}

export interface MarketData {
  id?: number
  user_id?: string
  data_type: string
  data_content?: any
  market_date?: string
  symbol?: string
  timeframe?: string
  analysis_notes?: string
  created_at?: string
  updated_at?: string
}

export interface UserSettings {
  id?: number
  user_id?: string
  preferences?: any
  dashboard_config?: any
  notification_settings?: any
  timezone?: string
  theme?: string
  created_at?: string
  updated_at?: string
}

// Database helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// Trade operations
export async function getTrades(): Promise<Trade[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching trades:', error)
    return []
  }

  return data || []
}

export async function addTrade(trade: Omit<Trade, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Trade | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('trades')
    .insert([{ ...trade, user_id: user.id }])
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error adding trade:', error)
    return null
  }

  return data
}

export async function updateTrade(id: number, updates: Partial<Trade>): Promise<Trade | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('trades')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating trade:', error)
    return null
  }

  return data
}

export async function deleteTrade(id: number): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const { error } = await supabase
    .from('trades')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting trade:', error)
    return false
  }

  return true
}

// Daily scores operations
export async function getDailyScores(): Promise<DailyScore[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('daily_scores')
    .select('*')
    .eq('user_id', user.id)
    .order('score_date', { ascending: false })

  if (error) {
    console.error('Error fetching daily scores:', error)
    return []
  }

  return data || []
}

export async function saveDailyScore(score: Omit<DailyScore, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<DailyScore | null> {
  const user = await getCurrentUser()
  if (!user) return null

  // Check if score for this date already exists
  const { data: existingScore } = await supabase
    .from('daily_scores')
    .select('*')
    .eq('user_id', user.id)
    .eq('score_date', score.score_date)
    .maybeSingle()

  if (existingScore) {
    // Update existing score
    const { data, error } = await supabase
      .from('daily_scores')
      .update(score)
      .eq('id', existingScore.id)
      .eq('user_id', user.id)
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error updating daily score:', error)
      return null
    }

    return data
  } else {
    // Create new score
    const { data, error } = await supabase
      .from('daily_scores')
      .insert([{ ...score, user_id: user.id }])
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error adding daily score:', error)
      return null
    }

    return data
  }
}

// Insights operations (excluding journal entries)
export async function getInsights(): Promise<Insight[]> {
  const user = await getCurrentUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('user_id', user.id)
    .neq('insight_type', 'journal') // Exclude journal entries
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching insights:', error)
    return []
  }

  return data || []
}

export async function addInsight(insight: Omit<Insight, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Insight | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('insights')
    .insert([{ ...insight, user_id: user.id }])
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error adding insight:', error)
    return null
  }

  return data
}

// User settings operations
export async function getUserSettings(): Promise<UserSettings | null> {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching user settings:', error)
    return null
  }

  return data
}

export async function saveUserSettings(settings: Omit<UserSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserSettings | null> {
  const user = await getCurrentUser()
  if (!user) return null

  // Check if settings already exist
  const existingSettings = await getUserSettings()

  if (existingSettings) {
    // Update existing settings
    const { data, error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', user.id)
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error updating user settings:', error)
      return null
    }

    return data
  } else {
    // Create new settings
    const { data, error } = await supabase
      .from('user_settings')
      .insert([{ ...settings, user_id: user.id }])
      .select()
      .maybeSingle()

    if (error) {
      console.error('Error creating user settings:', error)
      return null
    }

    return data
  }
}
