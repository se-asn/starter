// Production Demo Status API
// src/routes/api/status/demo/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const GET: RequestHandler = async () => {
  try {
    const demoUserId = '78ad2599-26d6-49f9-afcf-f06bd7679c14';
    
    // Get athlete profile
    const { data: athlete, error: athleteError } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', demoUserId)
      .single();

    if (athleteError) {
      return json({
        status: 'error',
        message: 'Demo athlete not found',
        demo_ready: false
      }, { status: 404 });
    }

    // Get activities count
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    // Get metrics count
    const { count: metricsCount } = await supabase
      .from('performance_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    // Get recent activities
    const { data: recentActivities } = await supabase
      .from('activities')
      .select('name, activity_type, start_time, distance_meters, duration_seconds, training_stress_score')
      .eq('athlete_id', demoUserId)
      .order('start_time', { ascending: false })
      .limit(5);

    // Get recent metrics
    const { data: recentMetrics } = await supabase
      .from('performance_metrics')
      .select('metric_date, weight_kg, resting_hr, hrv_score, fatigue_level')
      .eq('athlete_id', demoUserId)
      .order('metric_date', { ascending: false })
      .limit(3);

    return json({
      status: 'success',
      demo_ready: true,
      athlete: {
        id: athlete.id,
        name: athlete.name,
        email: athlete.email,
        ftp_watts: athlete.ftp_watts,
        max_hr: athlete.max_hr,
        weight_kg: athlete.weight_kg
      },
      data_counts: {
        activities: activitiesCount || 0,
        metrics: metricsCount || 0
      },
      recent_activities: recentActivities?.map(activity => ({
        name: activity.name,
        type: activity.activity_type,
        date: activity.start_time,
        distance_km: activity.distance_meters ? (activity.distance_meters / 1000).toFixed(1) : null,
        duration: activity.duration_seconds ? `${Math.floor(activity.duration_seconds / 60)}min` : null,
        tss: activity.training_stress_score
      })) || [],
      recent_metrics: recentMetrics?.map(metric => ({
        date: metric.metric_date,
        weight: metric.weight_kg,
        resting_hr: metric.resting_hr,
        hrv: metric.hrv_score,
        fatigue: metric.fatigue_level
      })) || [],
      demo_credentials: {
        email: 'demo@laufplanerpro.de',
        password: 'Demo123!'
      }
    });
    
  } catch (error: any) {
    console.error('Demo status check error:', error);
    return json(
      { 
        status: 'error',
        message: 'Failed to check demo status',
        details: error.message,
        demo_ready: false
      },
      { status: 500 }
    );
  }
};
