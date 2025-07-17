// Database Setup and Demo Data Seeder
// src/routes/api/setup/database/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    if (action === 'setup_and_seed') {
      // First, let's check what tables exist by trying to query them
      console.log('Checking database structure...');
      
      // Check if athletes table exists by attempting to create demo data
      const demoUserId = '00000000-0000-0000-0000-000000000123'; // Valid UUID format
      
      // Try to create demo athlete with more flexible approach
      const { data: existingAthlete, error: checkError } = await supabase
        .from('athletes')
        .select('*')
        .eq('id', demoUserId)
        .maybeSingle();

      console.log('Existing athlete check:', { existingAthlete, checkError });

      if (checkError) {
        console.error('Table might not exist:', checkError);
        return json({ 
          error: 'Database tables not found. Please run the Supabase schema first.',
          details: checkError.message,
          solution: 'Run the SQL commands from supabase-schema.sql in your Supabase SQL console'
        }, { status: 500 });
      }

      // If athlete doesn't exist, create it
      if (!existingAthlete) {
        console.log('Creating demo athlete...');
        
        // For demo purposes, we'll create a standalone athlete record
        // In production, this would be linked to auth.users
        const { error: athleteError } = await supabase
          .from('athletes')
          .insert({
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
          
          // If it's a foreign key constraint error, let's create a simpler approach
          if (athleteError.message.includes('foreign key') || athleteError.message.includes('violates')) {
            // Try with raw SQL to bypass foreign key constraints for demo
            const { error: rawError } = await supabase.rpc('create_demo_athlete', {
              athlete_id: demoUserId,
              athlete_email: 'demo@laufplanerpro.de'
            });
            
            if (rawError) {
              return json({ 
                error: 'Could not create demo athlete. Database schema may need to be updated.',
                details: athleteError.message,
                suggestion: 'Run the Supabase schema or create a demo user in auth.users first'
              }, { status: 500 });
            }
          } else {
            return json({ 
              error: 'Failed to create demo athlete',
              details: athleteError.message 
            }, { status: 500 });
          }
        }
      }

      // Create demo activities
      console.log('Creating demo activities...');
      const demoActivities = [
        {
          athlete_id: demoUserId,
          external_id: 'demo-run-001',
          provider: 'demo',
          activity_type: 'run',
          name: 'Morning Long Run',
          description: 'Easy aerobic base building run',
          start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          duration_seconds: 3600,
          distance_meters: 12000,
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
          start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          duration_seconds: 4200,
          distance_meters: 35000,
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
          start_time: new Date().toISOString(),
          duration_seconds: 3900,
          distance_meters: 2800,
          average_heart_rate: 145,
          max_heart_rate: 165,
          calories: 420,
          training_stress_score: 45
        }
      ];

      // Remove existing demo activities first
      await supabase
        .from('activities')
        .delete()
        .eq('athlete_id', demoUserId);

      // Insert new demo activities
      const { error: activitiesError } = await supabase
        .from('activities')
        .insert(demoActivities);

      if (activitiesError) {
        console.error('Activities insert error:', activitiesError);
        return json({ 
          error: 'Failed to create demo activities',
          details: activitiesError.message 
        }, { status: 500 });
      }

      // Create demo performance metrics
      console.log('Creating demo performance metrics...');
      const demoMetrics = [
        {
          athlete_id: demoUserId,
          metric_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          metric_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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

      // Remove existing demo metrics first
      await supabase
        .from('performance_metrics')
        .delete()
        .eq('athlete_id', demoUserId);

      // Insert new demo metrics
      const { error: metricsError } = await supabase
        .from('performance_metrics')
        .insert(demoMetrics);

      if (metricsError) {
        console.error('Metrics insert error:', metricsError);
        return json({ 
          error: 'Failed to create demo metrics',
          details: metricsError.message 
        }, { status: 500 });
      }

      // Create demo training plan
      console.log('Creating demo training plan...');
      
      // Remove existing demo plans first
      await supabase
        .from('training_plans')
        .delete()
        .eq('athlete_id', demoUserId);

      const { data: planData, error: planError } = await supabase
        .from('training_plans')
        .insert({
          athlete_id: demoUserId,
          name: 'Olympic Triathlon Preparation',
          description: 'AI-generated 12-week plan for Olympic distance triathlon',
          plan_type: 'triathlon',
          target_event: 'olympic',
          target_date: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weeks_duration: 12,
          difficulty_level: 'intermediate',
          is_active: true,
          ai_prompt: 'Generate 12-week Olympic triathlon plan for intermediate athlete with FTP 285W'
        })
        .select('id')
        .single();

      if (planError) {
        console.error('Training plan insert error:', planError);
        return json({ 
          error: 'Failed to create demo training plan',
          details: planError.message 
        }, { status: 500 });
      }

      const planId = planData?.id;

      // Create demo workouts
      if (planId) {
        console.log('Creating demo workouts...');
        
        // Remove existing demo workouts first
        await supabase
          .from('workouts')
          .delete()
          .eq('athlete_id', demoUserId);

        const demoWorkouts = [
          {
            plan_id: planId,
            athlete_id: demoUserId,
            workout_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
            workout_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          },
          {
            plan_id: planId,
            athlete_id: demoUserId,
            workout_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            week_number: 1,
            day_of_week: 3,
            sport: 'run',
            workout_type: 'speed',
            name: 'Track Intervals',
            description: 'VO2max development session',
            planned_duration_minutes: 75,
            planned_distance_meters: 10000,
            planned_intensity: 'hard',
            instructions: {
              warmup: '15min easy + drills',
              main: '6x800m @ 5K pace, 90s recovery',
              cooldown: '10min easy'
            }
          }
        ];

        const { error: workoutsError } = await supabase
          .from('workouts')
          .insert(demoWorkouts);

        if (workoutsError) {
          console.error('Workouts insert error:', workoutsError);
          return json({ 
            error: 'Failed to create demo workouts',
            details: workoutsError.message 
          }, { status: 500 });
        }
      }

      console.log('Demo data creation completed successfully!');
      
      return json({
        success: true,
        message: 'Database setup and demo data seeded successfully!',
        data: {
          athlete: 'Demo athlete profile created/updated',
          activities: `${demoActivities.length} demo activities created`,
          metrics: `${demoMetrics.length} performance metrics created`,
          training_plan: 'Olympic triathlon training plan created',
          workouts: '3 sample workouts created for first week'
        }
      });
      
    } else {
      return json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('Database setup error:', error);
    return json(
      { 
        error: 'Failed to setup database and seed demo data', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
};

// Get database status
export const GET: RequestHandler = async () => {
  try {
    const demoUserId = '00000000-0000-0000-0000-000000000123'; // Valid UUID format
    
    // Check each table
    const checks = {
      athletes: false,
      activities: false,
      training_plans: false,
      performance_metrics: false,
      workouts: false
    };

    // Check athletes table
    try {
      const { data: athlete } = await supabase
        .from('athletes')
        .select('*')
        .eq('id', demoUserId)
        .maybeSingle();
      checks.athletes = !!athlete;
    } catch (e) {
      console.log('Athletes table check failed:', e);
    }

    // Check activities table
    try {
      const { count } = await supabase
        .from('activities')
        .select('*', { count: 'exact', head: true })
        .eq('athlete_id', demoUserId);
      checks.activities = (count || 0) > 0;
    } catch (e) {
      console.log('Activities table check failed:', e);
    }

    // Check training_plans table
    try {
      const { count } = await supabase
        .from('training_plans')
        .select('*', { count: 'exact', head: true })
        .eq('athlete_id', demoUserId);
      checks.training_plans = (count || 0) > 0;
    } catch (e) {
      console.log('Training plans table check failed:', e);
    }

    // Check performance_metrics table
    try {
      const { count } = await supabase
        .from('performance_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('athlete_id', demoUserId);
      checks.performance_metrics = (count || 0) > 0;
    } catch (e) {
      console.log('Performance metrics table check failed:', e);
    }

    // Check workouts table
    try {
      const { count } = await supabase
        .from('workouts')
        .select('*', { count: 'exact', head: true })
        .eq('athlete_id', demoUserId);
      checks.workouts = (count || 0) > 0;
    } catch (e) {
      console.log('Workouts table check failed:', e);
    }

    return json({
      database_status: 'connected',
      demo_data_status: checks,
      all_demo_data_ready: Object.values(checks).every(Boolean),
      supabase_url: process.env.PUBLIC_SUPABASE_URL || 'not configured'
    });
    
  } catch (error: any) {
    console.error('Database status check error:', error);
    return json(
      { 
        error: 'Failed to check database status', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
