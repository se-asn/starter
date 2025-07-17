// User activities endpoint
// src/routes/api/activities/+server.ts

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

    // Get URL parameters for pagination and filtering
    const url = new URL(event.request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const activityType = url.searchParams.get('type'); // swim, bike, run
    
    // Build query with optional filtering
    let query = supabaseServer
      .from('activities')
      .select(`
        id, external_id, provider, activity_type, name, description,
        start_time, duration_seconds, distance_meters, elevation_gain_meters,
        avg_heart_rate, max_heart_rate, avg_power_watts, max_power_watts,
        avg_cadence, max_speed_mps, calories, training_stress_score,
        intensity_factor, normalized_power_watts, work_joules, created_at
      `)
      .eq('athlete_id', userId)
      .order('start_time', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }

    const { data: activities, error: activitiesError } = await query;

    if (activitiesError) {
      console.error('Activities fetch error:', activitiesError);
      return json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabaseServer
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', userId);
    
    if (activityType) {
      countQuery = countQuery.eq('activity_type', activityType);
    }
    
    const { count: total, error: countError } = await countQuery;

    if (countError) {
      console.error('Count fetch error:', countError);
      return json(
        { error: 'Failed to fetch count' },
        { status: 500 }
      );
    }

    // Get activity type summary for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: summaryData, error: summaryError } = await supabaseServer
      .from('activities')
      .select('activity_type, distance_meters, duration_seconds, avg_heart_rate')
      .eq('athlete_id', userId)
      .gte('start_time', thirtyDaysAgo.toISOString());

    let summary: any[] = [];
    if (!summaryError && summaryData) {
      // Group by activity type and calculate summaries
      const grouped = summaryData.reduce((acc: any, activity: any) => {
        const type = activity.activity_type;
        if (!acc[type]) {
          acc[type] = {
            activity_type: type,
            count: 0,
            total_distance: 0,
            total_duration: 0,
            heart_rates: []
          };
        }
        acc[type].count++;
        acc[type].total_distance += activity.distance_meters || 0;
        acc[type].total_duration += activity.duration_seconds || 0;
        if (activity.avg_heart_rate) {
          acc[type].heart_rates.push(activity.avg_heart_rate);
        }
        return acc;
      }, {});

      summary = Object.values(grouped).map((group: any) => ({
        activity_type: group.activity_type,
        count: group.count,
        total_distance: group.total_distance,
        total_duration: group.total_duration,
        avg_hr: group.heart_rates.length > 0 
          ? group.heart_rates.reduce((a: number, b: number) => a + b, 0) / group.heart_rates.length 
          : null
      })).sort((a: any, b: any) => b.count - a.count);
    }

    return json({
      success: true,
      activities: activities || [],
      pagination: {
        total: total || 0,
        limit,
        offset,
        hasMore: offset + limit < (total || 0)
      },
      summary
    });

  } catch (error) {
    console.error('Activities endpoint error:', error);
    return json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};
