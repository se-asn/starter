// Supabase Client & Helper Functions
// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// Main Supabase client
export const supabase = createClient(env.PUBLIC_SUPABASE_URL!, env.PUBLIC_SUPABASE_ANON_KEY!);

// Database Types
export interface Athlete {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  weight_kg?: number;
  ftp_watts?: number;
  threshold_pace_per_km?: string;
  max_hr?: number;
  resting_hr?: number;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  athlete_id: string;
  external_id?: string;
  provider: string;
  activity_type: string;
  name?: string;
  start_time: string;
  duration_seconds?: number;
  distance_meters?: number;
  average_heart_rate?: number;
  max_heart_rate?: number;
  average_power_watts?: number;
  calories?: number;
  raw_data?: any;
  created_at: string;
}

export interface ApiConnection {
  id: string;
  athlete_id: string;
  provider: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  scope?: string;
  is_active: boolean;
  last_sync?: string;
  created_at: string;
}

// Auth Helper Functions
export const auth = {
  // Sign up new user
  async signUp(email: string, password: string, metadata?: { firstName?: string; lastName?: string }) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
  },

  // Sign in user
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  // Sign out user
  async signOut() {
    return await supabase.auth.signOut();
  },

  // Get current user
  async getUser() {
    return await supabase.auth.getUser();
  },

  // Get current session
  async getSession() {
    return await supabase.auth.getSession();
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database Helper Functions
export const db = {
  // Get current user's profile
  async getMyProfile(): Promise<Athlete | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update current user's profile
  async updateMyProfile(updates: Partial<Athlete>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('athletes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get my activities
  async getMyActivities(limit = 20): Promise<Activity[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('athlete_id', user.id)
      .order('start_time', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Get my API connections
  async getMyConnections(): Promise<ApiConnection[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('api_connections')
      .select('*')
      .eq('athlete_id', user.id)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },

  // Save activity
  async saveActivity(activity: Omit<Activity, 'id' | 'athlete_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('activities')
      .upsert({
        ...activity,
        athlete_id: user.id
      }, {
        onConflict: 'athlete_id,external_id,provider'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Save API connection
  async saveConnection(connection: Omit<ApiConnection, 'id' | 'athlete_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('api_connections')
      .upsert({
        ...connection,
        athlete_id: user.id
      }, {
        onConflict: 'athlete_id,provider'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
