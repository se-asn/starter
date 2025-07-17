// Demo Data Seeder for Supabase
// src/routes/api/demo/seed-data/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    if (action === 'seed_demo_data') {
      
      // Create demo athlete profile (if not exists)
      const demoUserId = '00000000-0000-0000-0000-000000000123'; // Valid UUID format
      
      // Insert demo athlete
      const { error: athleteError } = await supabase
        .from('athletes')
        .upsert({
          id: demoUserId,
          email: 'demo@laufplanerpro.de',
          name: 'Demo Athlete',
          first_name: 'Demo',
          last_name: 'Athlete',
          weight_kg: 72.5,
          height_cm: 180,
          ftp_watts: 285,
          threshold_pace_per_km: '4:15',
          css_pace_per_100m: '1:25',
          max_hr: 195,
          resting_hr: 45,
          birth_date: '1990-05-15',
          gender: 'male'
        });

      if (athleteError) {
        console.error('Athlete insert error:', athleteError);
        return json({ error: 'Failed to create demo athlete' }, { status: 500 });
      }

      // Demo activities data
      const demoActivities = [
        {
          athlete_id: demoUserId,
          external_id: 'demo-run-001',
          provider: 'demo',
          activity_type: 'run',
          name: 'Morning Long Run',
          description: 'Easy aerobic base building run',
          start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          duration_seconds: 3600, // 1 hour
          distance_meters: 12000, // 12km
          elevation_gain_meters: 150,
          average_heart_rate: 155,
          max_heart_rate: 172,
          calories: 750,
          training_stress_score: 65
        },
        {
          athlete_id: demoUserId,
          external_id: 'demo-bike-001',
          provider: 'demo',
          activity_type: 'bike',
          name: 'FTP Intervals',
          description: '4x8min @ FTP with 3min recovery',
          start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          duration_seconds: 4200, // 70 minutes
          distance_meters: 35000, // 35km
          elevation_gain_meters: 280,
          average_heart_rate: 165,
          max_heart_rate: 185,
          average_power_watts: 270,
          max_power_watts: 320,
          normalized_power_watts: 285,
          calories: 980,
          training_stress_score: 105
        },
        {
          athlete_id: demoUserId,
          external_id: 'demo-swim-001',
          provider: 'demo',
          activity_type: 'swim',
          name: 'Technique + Endurance',
          description: 'Warm-up, drills, main set 6x400m',
          start_time: new Date().toISOString(), // Today
          duration_seconds: 3900, // 65 minutes
          distance_meters: 2800, // 2.8km
          average_heart_rate: 145,
          max_heart_rate: 165,
          calories: 420,
          training_stress_score: 45
        }
      ];

      // Insert demo activities
      const { error: activitiesError } = await supabase
        .from('activities')
        .upsert(demoActivities);

      if (activitiesError) {
        console.error('Activities insert error:', activitiesError);
        return json({ error: 'Failed to create demo activities' }, { status: 500 });
      }

      // Demo performance metrics
      const demoMetrics = [
        {
          athlete_id: demoUserId,
          metric_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
          weight_kg: 72.8,
          resting_hr: 44,
          hrv_score: 65,
          sleep_hours: 7.5,
          sleep_quality: 8,
          fatigue_level: 3,
          motivation_level: 8,
          soreness_level: 2,
          notes: 'Feeling strong and recovered'
        },
        {
          athlete_id: demoUserId,
          metric_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Yesterday
          weight_kg: 72.5,
          resting_hr: 45,
          hrv_score: 58,
          sleep_hours: 6.8,
          sleep_quality: 6,
          fatigue_level: 5,
          motivation_level: 7,
          soreness_level: 4,
          notes: 'Post hard training session'
        }
      ];

      // Insert demo metrics
      const { error: metricsError } = await supabase
        .from('performance_metrics')
        .upsert(demoMetrics);

      if (metricsError) {
        console.error('Metrics insert error:', metricsError);
        return json({ error: 'Failed to create demo metrics' }, { status: 500 });
      }

      // Demo training plan
      const { data: planData, error: planError } = await supabase
        .from('training_plans')
        .upsert({
          athlete_id: demoUserId,
          name: 'Olympic Triathlon Preparation',
          description: 'AI-generated 12-week plan for Olympic distance triathlon',
          plan_type: 'triathlon',
          target_event: 'olympic',
          target_date: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 weeks from now
          weeks_duration: 12,
          difficulty_level: 'intermediate',
          is_active: true,
          ai_prompt: 'Generate 12-week Olympic triathlon plan for intermediate athlete with FTP 285W'
        })
        .select('id')
        .single();

      if (planError) {
        console.error('Training plan insert error:', planError);
        return json({ error: 'Failed to create demo training plan' }, { status: 500 });
      }

      const planId = planData?.id;

      // Demo workouts for the first week
      if (planId) {
        const demoWorkouts = [
          {
            plan_id: planId,
            athlete_id: demoUserId,
            workout_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
            week_number: 1,
            day_of_week: 1,
            sport: 'swim',
            workout_type: 'base',
            name: 'Technique Focus',
            description: 'Easy swim with technique focus',
            planned_duration_minutes: 45,
            planned_distance_meters: 1500,
            planned_intensity: 'easy',
            instructions: {
              warmup: '400m easy',
              main: '8x50m drill focus + 400m steady',
              cooldown: '200m easy'
            }
          },
          {
            plan_id: planId,
            athlete_id: demoUserId,
            workout_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
            week_number: 1,
            day_of_week: 2,
            sport: 'bike',
            workout_type: 'build',
            name: 'Sweet Spot Intervals',
            description: 'Sweet spot power development',
            planned_duration_minutes: 90,
            planned_distance_meters: 40000,
            planned_intensity: 'moderate',
            instructions: {
              warmup: '15min easy spinning',
              main: '3x12min @ 90% FTP, 3min recovery',
              cooldown: '10min easy'
            }
          }
        ];

        const { error: workoutsError } = await supabase
          .from('workouts')
          .upsert(demoWorkouts);

        if (workoutsError) {
          console.error('Workouts insert error:', workoutsError);
          return json({ error: 'Failed to create demo workouts' }, { status: 500 });
        }
      }

      return json({
        success: true,
        message: 'Demo data seeded successfully!',
        data: {
          athlete: 'Created demo athlete profile',
          activities: `Created ${demoActivities.length} demo activities`,
          metrics: `Created ${demoMetrics.length} performance metrics`,
          training_plan: 'Created Olympic triathlon training plan',
          workouts: 'Created sample workouts'
        }
      });
      
    } else {
      return json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('Seed data error:', error);
    return json(
      { error: 'Failed to seed demo data', details: error.message },
      { status: 500 }
    );
  }
};

// Get current demo data
export const GET: RequestHandler = async () => {
  try {
    const demoUserId = '00000000-0000-0000-0000-000000000123'; // Valid UUID format
    
    // Get athlete profile
    const { data: athlete, error: athleteError } = await supabase
      .from('athletes')
      .select('*')
      .eq('id', demoUserId)
      .single();

    // Get activities count
    const { count: activitiesCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    // Get training plans count
    const { count: plansCount } = await supabase
      .from('training_plans')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    // Get metrics count
    const { count: metricsCount } = await supabase
      .from('performance_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    return json({
      demo_user_exists: !!athlete,
      athlete: athlete || null,
      counts: {
        activities: activitiesCount || 0,
        training_plans: plansCount || 0,
        performance_metrics: metricsCount || 0
      }
    });
    
  } catch (error: any) {
    console.error('Get demo data error:', error);
    return json(
      { error: 'Failed to get demo data', details: error.message },
      { status: 500 }
    );
  }
};
