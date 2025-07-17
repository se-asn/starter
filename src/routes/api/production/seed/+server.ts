// LaufplanerPro - Professional Production Demo Data Seeder
// src/routes/api/production/seed/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { dev } from '$app/environment';

// Create admin client with service role (bypasses RLS)
const getSupabaseAdmin = () => {
  const supabaseUrl = dev 
    ? process.env.PUBLIC_SUPABASE_URL 
    : process.env.PUBLIC_SUPABASE_URL;
  
  const serviceKey = dev
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    if (action !== 'create_professional_demo') {
      return json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log('🚀 Starting professional demo data creation...');
    
    const supabaseAdmin = getSupabaseAdmin();
    const demoUserId = '00000000-0000-0000-0000-000000000123';
    const currentTime = new Date();

    // ==========================================
    // 1. CREATE DEMO ATHLETE PROFILE
    // ==========================================
    console.log('👤 Creating professional athlete profile...');
    
    const { data: existingAthlete } = await supabaseAdmin
      .from('athletes')
      .select('id')
      .eq('id', demoUserId)
      .maybeSingle();

    if (!existingAthlete) {
      const { error: athleteError } = await supabaseAdmin
        .from('athletes')
        .insert({
          id: demoUserId,
          email: 'demo@laufplanerpro.de',
          name: 'Alex Mueller',
          first_name: 'Alex',
          last_name: 'Mueller',
          birth_date: '1990-05-15',
          gender: 'male',
          weight_kg: 72.5,
          height_cm: 180,
          ftp_watts: 285,
          threshold_pace_per_km: '4:15',
          css_pace_per_100m: '1:25',
          max_hr: 195,
          resting_hr: 45,
          timezone: 'Europe/Berlin',
          language: 'en',
          units_system: 'metric',
          privacy_level: 'private'
        });

      if (athleteError) {
        console.error('❌ Athlete creation failed:', athleteError);
        return json({
          error: 'Failed to create demo athlete',
          details: athleteError.message,
          solution: 'Ensure the auth user exists in Authentication > Users'
        }, { status: 500 });
      }
      console.log('✅ Demo athlete created');
    } else {
      console.log('✅ Demo athlete already exists');
    }

    // ==========================================
    // 2. CREATE PROFESSIONAL TRAINING ACTIVITIES
    // ==========================================
    console.log('🏃‍♂️ Creating professional training activities...');
    
    // Remove existing demo activities
    await supabaseAdmin
      .from('activities')
      .delete()
      .eq('athlete_id', demoUserId);

    const professionalActivities = [
      // Week 1 - Base Building
      {
        athlete_id: demoUserId,
        external_id: 'demo-swim-technique-001',
        provider: 'demo',
        activity_type: 'swim',
        name: 'Technical Swim Session',
        description: 'Stroke technique refinement with video analysis feedback',
        start_time: new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 3900, // 65 minutes
        distance_meters: 2800,
        average_heart_rate: 142,
        max_heart_rate: 165,
        calories: 420,
        training_stress_score: 48,
        average_pace_per_100m: 88, // 1:28/100m
        stroke_rate: 36,
        pool_length_meters: 50
      },
      {
        athlete_id: demoUserId,
        external_id: 'demo-bike-endurance-001',
        provider: 'demo',
        activity_type: 'bike',
        name: 'Zone 2 Endurance Ride',
        description: 'Aerobic base building with power meter data analysis',
        start_time: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 7200, // 2 hours
        distance_meters: 65000, // 65km
        elevation_gain_meters: 450,
        average_heart_rate: 148,
        max_heart_rate: 165,
        average_power_watts: 210,
        max_power_watts: 285,
        normalized_power_watts: 218,
        calories: 1250,
        training_stress_score: 95,
        average_speed_kmh: 32.5,
        average_cadence: 88
      },
      {
        athlete_id: demoUserId,
        external_id: 'demo-run-tempo-001',
        provider: 'demo',
        activity_type: 'run',
        name: 'Tempo Run Session',
        description: 'Lactate threshold development with heart rate zones',
        start_time: new Date(currentTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 3600, // 60 minutes
        distance_meters: 14000, // 14km
        elevation_gain_meters: 120,
        average_heart_rate: 168,
        max_heart_rate: 185,
        calories: 890,
        training_stress_score: 78,
        average_pace_per_km: 257, // 4:17/km
        average_cadence: 178,
        average_stride_length: 142
      },
      
      // Week 2 - Build Phase
      {
        athlete_id: demoUserId,
        external_id: 'demo-swim-intervals-001',
        provider: 'demo',
        activity_type: 'swim',
        name: 'VO2max Swim Intervals',
        description: '10x100m @ CSS pace with 20s rest - anaerobic capacity',
        start_time: new Date(currentTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 3300, // 55 minutes
        distance_meters: 2500,
        average_heart_rate: 155,
        max_heart_rate: 175,
        calories: 380,
        training_stress_score: 65,
        average_pace_per_100m: 82, // 1:22/100m
        stroke_rate: 42,
        pool_length_meters: 50
      },
      {
        athlete_id: demoUserId,
        external_id: 'demo-bike-ftp-001',
        provider: 'demo',
        activity_type: 'bike',
        name: 'FTP Intervals',
        description: '4x8min @ 100% FTP with 3min recovery - power development',
        start_time: new Date(currentTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 4500, // 75 minutes
        distance_meters: 38000, // 38km
        elevation_gain_meters: 280,
        average_heart_rate: 172,
        max_heart_rate: 188,
        average_power_watts: 268,
        max_power_watts: 325,
        normalized_power_watts: 285,
        calories: 1150,
        training_stress_score: 125,
        average_speed_kmh: 30.4,
        average_cadence: 92
      },
      {
        athlete_id: demoUserId,
        external_id: 'demo-run-intervals-001',
        provider: 'demo',
        activity_type: 'run',
        name: 'Track Intervals',
        description: '6x800m @ 5K pace with 90s recovery - VO2max development',
        start_time: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 2700, // 45 minutes
        distance_meters: 8500, // 8.5km
        elevation_gain_meters: 25,
        average_heart_rate: 178,
        max_heart_rate: 192,
        calories: 580,
        training_stress_score: 88,
        average_pace_per_km: 242, // 4:02/km
        average_cadence: 185,
        average_stride_length: 148
      },
      
      // Recent Sessions
      {
        athlete_id: demoUserId,
        external_id: 'demo-brick-001',
        provider: 'demo',
        activity_type: 'brick',
        name: 'Olympic Distance Brick',
        description: '40K bike + 10K run transition practice with nutrition testing',
        start_time: new Date(currentTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        duration_seconds: 7800, // 2h 10min
        distance_meters: 50000, // 50km total
        elevation_gain_meters: 320,
        average_heart_rate: 162,
        max_heart_rate: 185,
        average_power_watts: 245, // bike portion
        calories: 1420,
        training_stress_score: 145,
        average_speed_kmh: 23.1, // combined
        transition_time_seconds: 180 // 3min transition
      },
      {
        athlete_id: demoUserId,
        external_id: 'demo-recovery-001',
        provider: 'demo',
        activity_type: 'swim',
        name: 'Active Recovery Swim',
        description: 'Easy aerobic swim with mobility and flexibility focus',
        start_time: currentTime.toISOString(),
        duration_seconds: 2700, // 45 minutes
        distance_meters: 2000,
        average_heart_rate: 125,
        max_heart_rate: 140,
        calories: 280,
        training_stress_score: 25,
        average_pace_per_100m: 135, // 2:15/100m - easy pace
        stroke_rate: 28,
        pool_length_meters: 50
      }
    ];

    const { error: activitiesError } = await supabaseAdmin
      .from('activities')
      .insert(professionalActivities);

    if (activitiesError) {
      console.error('❌ Activities creation failed:', activitiesError);
      return json({
        error: 'Failed to create demo activities',
        details: activitiesError.message
      }, { status: 500 });
    }
    console.log(`✅ ${professionalActivities.length} professional activities created`);

    // ==========================================
    // 3. CREATE PERFORMANCE METRICS
    // ==========================================
    console.log('📊 Creating performance metrics...');
    
    await supabaseAdmin
      .from('performance_metrics')
      .delete()
      .eq('athlete_id', demoUserId);

    const performanceMetrics = [
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 73.2,
        resting_hr: 42,
        hrv_score: 72,
        sleep_hours: 8.5,
        sleep_quality: 9,
        fatigue_level: 1,
        motivation_level: 9,
        soreness_level: 1,
        stress_level: 2,
        nutrition_score: 8,
        hydration_level: 9,
        notes: 'Perfect recovery week - feeling incredibly fresh and motivated'
      },
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 73.0,
        resting_hr: 44,
        hrv_score: 68,
        sleep_hours: 7.8,
        sleep_quality: 8,
        fatigue_level: 2,
        motivation_level: 8,
        soreness_level: 2,
        stress_level: 3,
        nutrition_score: 8,
        hydration_level: 8,
        notes: 'Good training day - endurance ride felt strong and controlled'
      },
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 72.8,
        resting_hr: 46,
        hrv_score: 64,
        sleep_hours: 7.2,
        sleep_quality: 7,
        fatigue_level: 4,
        motivation_level: 8,
        soreness_level: 3,
        stress_level: 4,
        nutrition_score: 7,
        hydration_level: 7,
        notes: 'Tempo run pushed the limits - feeling the training load building'
      },
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 72.6,
        resting_hr: 48,
        hrv_score: 58,
        sleep_hours: 6.8,
        sleep_quality: 6,
        fatigue_level: 5,
        motivation_level: 7,
        soreness_level: 4,
        stress_level: 5,
        nutrition_score: 7,
        hydration_level: 6,
        notes: 'Interval session was tough - legs feeling heavy, need extra recovery'
      },
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 72.7,
        resting_hr: 47,
        hrv_score: 61,
        sleep_hours: 7.5,
        sleep_quality: 7,
        fatigue_level: 4,
        motivation_level: 8,
        soreness_level: 3,
        stress_level: 4,
        nutrition_score: 8,
        hydration_level: 8,
        notes: 'Power intervals felt good - hitting target watts consistently'
      },
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 72.5,
        resting_hr: 45,
        hrv_score: 65,
        sleep_hours: 8.0,
        sleep_quality: 8,
        fatigue_level: 3,
        motivation_level: 8,
        soreness_level: 2,
        stress_level: 3,
        nutrition_score: 8,
        hydration_level: 8,
        notes: 'Track session nailed - new 800m splits, feeling strong and fast'
      },
      {
        athlete_id: demoUserId,
        metric_date: new Date(currentTime.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_kg: 72.4,
        resting_hr: 49,
        hrv_score: 54,
        sleep_hours: 6.5,
        sleep_quality: 5,
        fatigue_level: 6,
        motivation_level: 7,
        soreness_level: 5,
        stress_level: 6,
        nutrition_score: 6,
        hydration_level: 7,
        notes: 'Brick session was challenging - transition felt sluggish, nutrition needs work'
      },
      {
        athlete_id: demoUserId,
        metric_date: currentTime.toISOString().split('T')[0],
        weight_kg: 72.5,
        resting_hr: 43,
        hrv_score: 69,
        sleep_hours: 8.2,
        sleep_quality: 8,
        fatigue_level: 2,
        motivation_level: 9,
        soreness_level: 1,
        stress_level: 2,
        nutrition_score: 8,
        hydration_level: 9,
        notes: 'Recovery swim perfect - feeling refreshed and ready for next training block'
      }
    ];

    const { error: metricsError } = await supabaseAdmin
      .from('performance_metrics')
      .insert(performanceMetrics);

    if (metricsError) {
      console.error('❌ Metrics creation failed:', metricsError);
      return json({
        error: 'Failed to create performance metrics',
        details: metricsError.message
      }, { status: 500 });
    }
    console.log(`✅ ${performanceMetrics.length} performance metrics created`);

    // ==========================================
    // 4. CREATE TRAINING PLAN
    // ==========================================
    console.log('📋 Creating professional training plan...');
    
    await supabaseAdmin
      .from('training_plans')
      .delete()
      .eq('athlete_id', demoUserId);

    const { data: trainingPlan, error: planError } = await supabaseAdmin
      .from('training_plans')
      .insert({
        athlete_id: demoUserId,
        name: 'Olympic Triathlon Peak Performance',
        description: 'AI-optimized 16-week periodized plan targeting Olympic distance triathlon with power-based cycling, pace-based running, and technical swimming development',
        plan_type: 'triathlon',
        target_event: 'olympic',
        target_date: new Date(currentTime.getTime() + 16 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weeks_duration: 16,
        difficulty_level: 'advanced',
        is_active: true,
        ai_prompt: 'Generate advanced 16-week Olympic triathlon plan for athlete with FTP 285W, 5K pace 4:02/km, CSS 1:25/100m targeting sub-2:15 Olympic finish',
        training_philosophy: 'Polarized training with 80/20 intensity distribution',
        weekly_hours_target: 12,
        peak_week_hours: 16
      })
      .select('id')
      .single();

    if (planError) {
      console.error('❌ Training plan creation failed:', planError);
      return json({
        error: 'Failed to create training plan',
        details: planError.message
      }, { status: 500 });
    }

    console.log('✅ Professional training plan created');

    // ==========================================
    // 5. SUCCESS RESPONSE
    // ==========================================
    console.log('🎉 Professional demo data creation completed!');
    
    return json({
      success: true,
      message: '🚀 Professional demo data created successfully!',
      data: {
        athlete: {
          name: 'Alex Mueller',
          email: 'demo@laufplanerpro.de',
          profile: 'Advanced triathlete with comprehensive metrics'
        },
        activities: {
          count: professionalActivities.length,
          types: ['swim', 'bike', 'run', 'brick'],
          duration: '2 weeks of professional training data',
          features: 'Full power, pace, heart rate, and technique metrics'
        },
        performance_metrics: {
          count: performanceMetrics.length,
          period: '8 days of comprehensive wellness tracking',
          metrics: 'HRV, sleep, fatigue, motivation, nutrition, hydration'
        },
        training_plan: {
          name: 'Olympic Triathlon Peak Performance',
          duration: '16 weeks',
          level: 'Advanced',
          target: 'Sub-2:15 Olympic distance triathlon'
        }
      },
      next_steps: [
        '✅ Demo login: demo@laufplanerpro.de / Demo123!',
        '✅ All dashboard metrics populated',
        '✅ Activities page with detailed data',
        '✅ Training plans ready',
        '✅ Performance analytics available'
      ]
    });
    
  } catch (error: any) {
    console.error('❌ Professional demo creation failed:', error);
    return json(
      { 
        error: 'Failed to create professional demo data', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
};

// GET: Check demo data status
export const GET: RequestHandler = async () => {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const demoUserId = '00000000-0000-0000-0000-000000000123';
    
    // Check athlete
    const { data: athlete } = await supabaseAdmin
      .from('athletes')
      .select('name, email, ftp_watts, max_hr')
      .eq('id', demoUserId)
      .maybeSingle();

    // Count data
    const [activitiesResult, metricsResult, plansResult] = await Promise.all([
      supabaseAdmin.from('activities').select('*', { count: 'exact', head: true }).eq('athlete_id', demoUserId),
      supabaseAdmin.from('performance_metrics').select('*', { count: 'exact', head: true }).eq('athlete_id', demoUserId),
      supabaseAdmin.from('training_plans').select('*', { count: 'exact', head: true }).eq('athlete_id', demoUserId)
    ]);

    // Recent activity
    const { data: recentActivity } = await supabaseAdmin
      .from('activities')
      .select('name, activity_type, start_time')
      .eq('athlete_id', demoUserId)
      .order('start_time', { ascending: false })
      .limit(1)
      .maybeSingle();

    return json({
      status: athlete ? 'ready' : 'not_ready',
      athlete: athlete,
      counts: {
        activities: activitiesResult.count || 0,
        metrics: metricsResult.count || 0,
        training_plans: plansResult.count || 0
      },
      recent_activity: recentActivity,
      professional_setup: !!athlete && (activitiesResult.count || 0) > 5
    });
    
  } catch (error: any) {
    return json(
      { 
        status: 'error',
        error: 'Failed to check demo status', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
