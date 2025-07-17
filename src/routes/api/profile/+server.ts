// Protected profile endpoint
// src/routes/api/profile/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabaseServer, getUserFromRequest } from '$lib/server/supabase-server';

export const GET: RequestHandler = async (event) => {
  try {
    // Get authenticated user ID
    const userId = await getUserFromRequest(event.request);
    
    if (!userId) {
      return json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get full user profile from database
    const { data: userProfile, error: profileError } = await supabaseServer
      .from('athletes')
      .select(`
        id, email, name, first_name, last_name, birth_date, gender, 
        weight_kg, height_cm, ftp_watts, threshold_pace_per_km, 
        css_pace_per_100m, max_hr, resting_hr, created_at, updated_at
      `)
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get API connections count
    const { count: apiConnectionsCount, error: connectionsError } = await supabaseServer
      .from('api_connections')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', userId)
      .eq('is_active', true);

    // Get recent activities count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentActivitiesCount, error: activitiesError } = await supabaseServer
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', userId)
      .gte('start_time', thirtyDaysAgo.toISOString());

    return json({
      success: true,
      profile: userProfile,
      stats: {
        apiConnections: apiConnectionsCount || 0,
        recentActivities: recentActivitiesCount || 0
      }
    });

  } catch (error) {
    console.error('Profile endpoint error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
