// Complete Database Setup with Schema and Demo Data
// src/routes/api/setup/complete/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

// Use service role client to bypass RLS
const supabaseAdmin = createClient(
  process.env.PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    if (action === 'create_schema_and_data') {
      console.log('Starting complete database setup...');
      
      // Step 1: Create athletes table (demo-friendly version)
      console.log('Creating athletes table...');
      const { error: athletesTableError } = await supabaseAdmin.rpc('execute_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS athletes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            name TEXT,
            first_name TEXT,
            last_name TEXT,
            birth_date DATE,
            gender TEXT CHECK (gender IN ('male', 'female', 'other')),
            weight_kg REAL,
            height_cm REAL,
            ftp_watts INTEGER,
            threshold_pace_per_km TEXT,
            css_pace_per_100m TEXT,
            max_hr INTEGER,
            resting_hr INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );`
      });

      // Alternative approach: Create tables using direct SQL
      const demoUserId = '00000000-0000-0000-0000-000000000123';
      
      console.log('Creating demo athlete directly...');
      
      // First, let's try a more direct approach - create demo data manually
      const { data: existingAthlete } = await supabaseAdmin
        .from('athletes')
        .select('id')
        .eq('email', 'demo@laufplanerpro.de')
        .maybeSingle();

      if (!existingAthlete) {
        // Use upsert which is more forgiving
        const { error: athleteError } = await supabaseAdmin
          .from('athletes')
          .upsert({
            id: demoUserId,
            email: 'demo@laufplanerpro.de',
            name: 'Alex Mueller',
            first_name: 'Alex',
            last_name: 'Mueller',
            weight_kg: 72.5,
            height_cm: 180,
            ftp_watts: 285,
            threshold_pace_per_km: '4:15',
            css_pace_per_100m: '1:25',
            max_hr: 195,
            resting_hr: 45,
            birth_date: '1990-05-15',
            gender: 'male'
          }, {
            onConflict: 'email'
          });

        if (athleteError) {
          console.error('Athlete creation failed:', athleteError);
          return json({
            error: 'Failed to create demo athlete',
            details: athleteError.message,
            suggestion: 'Please run the demo-schema.sql in your Supabase SQL console first'
          }, { status: 500 });
        }
      }

      // Create demo activities
      console.log('Creating demo activities...');
      const currentTime = new Date();
      const demoActivities = [
        {
          athlete_id: demoUserId,
          external_id: 'demo-run-001',
          provider: 'demo',
          activity_type: 'run',
          name: 'Morning Long Run',
          description: 'Easy aerobic base building run along the Main river',
          start_time: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
          description: '4x8min @ FTP with 3min recovery - Power development session',
          start_time: new Date(currentTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
          description: 'Warm-up, drills, main set 6x400m with focus on stroke efficiency',
          start_time: currentTime.toISOString(),
          duration_seconds: 3900,
          distance_meters: 2800,
          average_heart_rate: 145,
          max_heart_rate: 165,
          calories: 420,
          training_stress_score: 45
        },
        {
          athlete_id: demoUserId,
          external_id: 'demo-run-002',
          provider: 'demo',
          activity_type: 'run',
          name: 'Track Intervals',
          description: '6x800m @ 5K pace - VO2max development',
          start_time: new Date(currentTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          duration_seconds: 2700,
          distance_meters: 8000,
          elevation_gain_meters: 20,
          average_heart_rate: 175,
          max_heart_rate: 190,
          calories: 520,
          training_stress_score: 85
        },
        {
          athlete_id: demoUserId,
          external_id: 'demo-bike-002',
          provider: 'demo',
          activity_type: 'bike',
          name: 'Recovery Ride',
          description: 'Easy spinning for active recovery',
          start_time: new Date(currentTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          duration_seconds: 3600,
          distance_meters: 25000,
          elevation_gain_meters: 100,
          average_heart_rate: 135,
          max_heart_rate: 150,
          average_power_watts: 165,
          max_power_watts: 210,
          calories: 650,
          training_stress_score: 35
        }
      ];

      // Remove existing activities first
      await supabaseAdmin
        .from('activities')
        .delete()
        .eq('athlete_id', demoUserId);

      const { error: activitiesError } = await supabaseAdmin
        .from('activities')
        .insert(demoActivities);

      if (activitiesError) {
        console.error('Activities creation failed:', activitiesError);
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
          metric_date: new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight_kg: 73.0,
          resting_hr: 42,
          hrv_score: 68,
          sleep_hours: 8.2,
          sleep_quality: 9,
          fatigue_level: 2,
          motivation_level: 9,
          soreness_level: 1,
          notes: 'Great recovery week, feeling fresh'
        },
        {
          athlete_id: demoUserId,
          metric_date: new Date(currentTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          metric_date: new Date(currentTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight_kg: 72.7,
          resting_hr: 46,
          hrv_score: 62,
          sleep_hours: 7.0,
          sleep_quality: 7,
          fatigue_level: 4,
          motivation_level: 7,
          soreness_level: 3,
          notes: 'Mid-training block fatigue setting in'
        },
        {
          athlete_id: demoUserId,
          metric_date: new Date(currentTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          weight_kg: 72.5,
          resting_hr: 45,
          hrv_score: 58,
          sleep_hours: 6.8,
          sleep_quality: 6,
          fatigue_level: 5,
          motivation_level: 7,
          soreness_level: 4,
          notes: 'Post hard training session'
        },
        {
          athlete_id: demoUserId,
          metric_date: currentTime.toISOString().split('T')[0],
          weight_kg: 72.5,
          resting_hr: 43,
          hrv_score: 64,
          sleep_hours: 7.8,
          sleep_quality: 8,
          fatigue_level: 3,
          motivation_level: 8,
          soreness_level: 2,
          notes: 'Good recovery, ready for next session'
        }
      ];

      // Remove existing metrics first
      await supabaseAdmin
        .from('performance_metrics')
        .delete()
        .eq('athlete_id', demoUserId);

      const { error: metricsError } = await supabaseAdmin
        .from('performance_metrics')
        .insert(demoMetrics);

      if (metricsError) {
        console.error('Metrics creation failed:', metricsError);
        return json({
          error: 'Failed to create demo metrics',
          details: metricsError.message
        }, { status: 500 });
      }

      console.log('Demo data creation completed successfully!');
      
      return json({
        success: true,
        message: 'Complete database setup successful!',
        data: {
          athlete: 'Alex Mueller demo profile created',
          activities: `${demoActivities.length} training activities created`,
          metrics: `${demoMetrics.length} daily performance metrics created`,
          note: 'Training plans and workouts can be created separately if needed'
        }
      });
      
    } else {
      return json({ error: 'Invalid action. Use "create_schema_and_data"' }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('Complete setup error:', error);
    return json(
      { 
        error: 'Failed to complete database setup', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
};

// Get complete status
export const GET: RequestHandler = async () => {
  try {
    const demoUserId = '00000000-0000-0000-0000-000000000123';
    
    // Get athlete
    const { data: athlete, error: athleteError } = await supabaseAdmin
      .from('athletes')
      .select('*')
      .eq('id', demoUserId)
      .maybeSingle();

    // Get activities count
    const { count: activitiesCount } = await supabaseAdmin
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    // Get metrics count
    const { count: metricsCount } = await supabaseAdmin
      .from('performance_metrics')
      .select('*', { count: 'exact', head: true })
      .eq('athlete_id', demoUserId);

    // Get recent activities
    const { data: recentActivities } = await supabaseAdmin
      .from('activities')
      .select('name, activity_type, start_time, distance_meters, duration_seconds')
      .eq('athlete_id', demoUserId)
      .order('start_time', { ascending: false })
      .limit(3);

    return json({
      demo_ready: !!athlete,
      athlete: athlete ? {
        name: athlete.name,
        email: athlete.email,
        ftp_watts: athlete.ftp_watts,
        max_hr: athlete.max_hr
      } : null,
      counts: {
        activities: activitiesCount || 0,
        metrics: metricsCount || 0
      },
      recent_activities: recentActivities || [],
      database_status: 'connected'
    });
    
  } catch (error: any) {
    console.error('Status check error:', error);
    return json(
      { 
        error: 'Failed to check database status', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
