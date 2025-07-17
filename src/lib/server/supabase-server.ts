// Server-Side Supabase Utils für API-Integrationen
// src/lib/server/supabase-server.ts

import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

// Server-side client with service role for API operations
export const supabaseServer = createClient(
  publicEnv.PUBLIC_SUPABASE_URL!,
  env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Helper function to get user from request
export async function getUserFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  
  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }
    
    return user.id;
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// Server-side database operations
export const serverDb = {
  // Save activity (for API integrations)
  async saveActivity(userId: string, activity: any) {
    const { data, error } = await supabaseServer
      .from('activities')
      .upsert({
        ...activity,
        athlete_id: userId
      }, {
        onConflict: 'athlete_id,external_id,provider'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get API connection (for refreshing tokens)
  async getConnection(userId: string, provider: string) {
    const { data, error } = await supabaseServer
      .from('api_connections')
      .select('*')
      .eq('athlete_id', userId)
      .eq('provider', provider)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  // Update API connection (for token refresh)
  async updateConnection(connectionId: string, updates: any) {
    const { data, error } = await supabaseServer
      .from('api_connections')
      .update(updates)
      .eq('id', connectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Save sync log
  async logSync(userId: string, provider: string, syncType: string, status: string, details?: any) {
    const { data, error } = await supabaseServer
      .from('sync_logs')
      .insert({
        athlete_id: userId,
        provider,
        sync_type: syncType,
        status,
        records_processed: details?.recordsProcessed || 0,
        error_message: details?.errorMessage || null,
        sync_started_at: details?.syncStartedAt || new Date().toISOString(),
        sync_completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
