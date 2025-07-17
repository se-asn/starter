// Admin Workout Generator API
// src/routes/api/admin/workouts/generate/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

// Use service role client for admin operations
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

// Admin authentication check
async function verifyAdmin(authHeader: string | null): Promise<boolean> {
  return authHeader === 'Bearer admin-token-laufplanerpro-2025';
}

// Workout templates by sport and type
const workoutTemplates = {
  run: {
    easy: {
      name: "Easy Aerobic Run",
      description: "Comfortable aerobic pace run for base building",
      intensity: "easy",
      instructions: {
        warmup: "10min easy jog",
        main: "Steady aerobic pace",
        cooldown: "5min easy walk"
      }
    },
    tempo: {
      name: "Tempo Run",
      description: "Comfortably hard threshold pace run",
      intensity: "moderate",
      instructions: {
        warmup: "15min easy + 4x100m strides",
        main: "20-30min @ threshold pace",
        cooldown: "10min easy jog"
      }
    },
    intervals: {
      name: "VO2max Intervals",
      description: "High-intensity intervals at VO2max pace",
      intensity: "hard",
      instructions: {
        warmup: "20min easy + drills",
        main: "6x800m @ 5K pace, 90s recovery",
        cooldown: "15min easy jog"
      }
    },
    long: {
      name: "Long Run",
      description: "Extended aerobic run for endurance",
      intensity: "easy",
      instructions: {
        warmup: "10min easy build",
        main: "Steady aerobic pace throughout",
        cooldown: "5min easy walk + stretching"
      }
    }
  },
  bike: {
    easy: {
      name: "Recovery Ride",
      description: "Easy spinning for active recovery",
      intensity: "easy",
      instructions: {
        warmup: "10min easy spinning",
        main: "Zone 1-2 pace, high cadence",
        cooldown: "5min easy spinning"
      }
    },
    endurance: {
      name: "Aerobic Endurance",
      description: "Steady aerobic base building ride",
      intensity: "moderate",
      instructions: {
        warmup: "15min progressive build",
        main: "Zone 2 steady effort",
        cooldown: "10min easy spinning"
      }
    },
    ftp: {
      name: "FTP Intervals",
      description: "Functional Threshold Power intervals",
      intensity: "hard",
      instructions: {
        warmup: "20min easy with 3x3min builds",
        main: "4x8min @ FTP, 3min recovery",
        cooldown: "15min easy spinning"
      }
    },
    vo2max: {
      name: "VO2max Intervals",
      description: "High-intensity power intervals",
      intensity: "very_hard",
      instructions: {
        warmup: "20min easy + 3x1min efforts",
        main: "5x3min @ 120% FTP, 3min recovery",
        cooldown: "15min easy spinning"
      }
    }
  },
  swim: {
    technique: {
      name: "Technique Focus",
      description: "Stroke technique and efficiency work",
      intensity: "easy",
      instructions: {
        warmup: "400m easy various strokes",
        main: "8x50m drill focus + 400m steady",
        cooldown: "200m easy backstroke"
      }
    },
    endurance: {
      name: "Aerobic Endurance",
      description: "Steady aerobic swimming",
      intensity: "moderate",
      instructions: {
        warmup: "500m easy build",
        main: "6x400m @ CSS pace, 30s rest",
        cooldown: "300m easy choice"
      }
    },
    intervals: {
      name: "High Intensity Intervals",
      description: "VO2max swimming intervals",
      intensity: "hard",
      instructions: {
        warmup: "600m easy + 4x50m build",
        main: "8x100m @ 5K pace, 20s rest",
        cooldown: "400m easy backstroke"
      }
    },
    css: {
      name: "Critical Swim Speed",
      description: "Threshold pace swimming",
      intensity: "moderate",
      instructions: {
        warmup: "500m easy + 6x50m build",
        main: "4x400m @ CSS pace, 45s rest",
        cooldown: "300m easy choice"
      }
    }
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!await verifyAdmin(authHeader)) {
      return json({ error: 'Admin access required' }, { status: 401 });
    }

    const { action, data } = await request.json();
    
    if (action === 'generate_weekly_workouts') {
      const {
        plan_id,
        athlete_id,
        week_number,
        start_date,
        workout_pattern
      } = data;

      // Default workout pattern for triathlon
      const defaultPattern = [
        { day: 1, sport: 'swim', type: 'technique', duration: 45 },
        { day: 2, sport: 'bike', type: 'endurance', duration: 90 },
        { day: 3, sport: 'run', type: 'easy', duration: 45 },
        { day: 4, sport: 'swim', type: 'endurance', duration: 60 },
        { day: 5, sport: 'bike', type: 'ftp', duration: 75 },
        { day: 6, sport: 'run', type: 'long', duration: 90 },
        { day: 7, sport: 'rest', type: 'recovery', duration: 0 }
      ];

      const pattern = workout_pattern || defaultPattern;
      const workouts = [];

      for (const dayPattern of pattern) {
        if (dayPattern.sport === 'rest') continue;

        const workoutDate = new Date(start_date);
        workoutDate.setDate(workoutDate.getDate() + (dayPattern.day - 1));

        const template = (workoutTemplates as any)[dayPattern.sport]?.[dayPattern.type];
        
        if (!template) {
          console.warn(`Template not found for ${dayPattern.sport}:${dayPattern.type}`);
          continue;
        }

        // Calculate distance based on sport and duration
        let distance_meters = null;
        if (dayPattern.sport === 'run') {
          distance_meters = Math.round((dayPattern.duration / 60) * 12000); // 12km/h average
        } else if (dayPattern.sport === 'bike') {
          distance_meters = Math.round((dayPattern.duration / 60) * 30000); // 30km/h average
        } else if (dayPattern.sport === 'swim') {
          distance_meters = Math.round((dayPattern.duration / 60) * 2400); // 2.4km/h average
        }

        workouts.push({
          plan_id,
          athlete_id,
          workout_date: workoutDate.toISOString().split('T')[0],
          week_number,
          day_of_week: dayPattern.day,
          sport: dayPattern.sport,
          workout_type: dayPattern.type,
          name: template.name,
          description: template.description,
          planned_duration_minutes: dayPattern.duration,
          planned_distance_meters: distance_meters,
          planned_intensity: template.intensity,
          instructions: template.instructions
        });
      }

      // Insert workouts
      const { error: workoutsError } = await supabaseAdmin
        .from('workouts')
        .insert(workouts);

      if (workoutsError) {
        return json({
          error: 'Failed to generate workouts',
          details: workoutsError.message
        }, { status: 500 });
      }

      return json({
        success: true,
        message: `Generated ${workouts.length} workouts for week ${week_number}`,
        data: {
          plan_id,
          week_number,
          workouts_generated: workouts.length,
          start_date,
          workouts: workouts.map(w => ({
            date: w.workout_date,
            sport: w.sport,
            name: w.name,
            duration: w.planned_duration_minutes
          }))
        }
      });

    } else if (action === 'generate_full_plan_workouts') {
      const {
        plan_id,
        athlete_id,
        start_date,
        weeks_duration,
        plan_type = 'triathlon'
      } = data;

      let totalWorkouts = 0;
      const weeklyResults = [];

      for (let week = 1; week <= weeks_duration; week++) {
        const weekStartDate = new Date(start_date);
        weekStartDate.setDate(weekStartDate.getDate() + ((week - 1) * 7));

        // Adjust intensity based on week (periodization)
        let intensityModifier = 'moderate';
        if (week === 1) intensityModifier = 'easy';
        else if (week === weeks_duration) intensityModifier = 'taper';
        else if (week > weeks_duration * 0.75) intensityModifier = 'hard';

        const pattern = getWeeklyPattern(plan_type, week, weeks_duration, intensityModifier);
        
        const workouts = [];
        for (const dayPattern of pattern) {
          if (dayPattern.sport === 'rest') continue;

          const workoutDate = new Date(weekStartDate);
          workoutDate.setDate(workoutDate.getDate() + (dayPattern.day - 1));

          const template = (workoutTemplates as any)[dayPattern.sport]?.[dayPattern.type];
          if (!template) continue;

          let distance_meters = null;
          if (dayPattern.sport === 'run') {
            distance_meters = Math.round((dayPattern.duration / 60) * 12000);
          } else if (dayPattern.sport === 'bike') {
            distance_meters = Math.round((dayPattern.duration / 60) * 30000);
          } else if (dayPattern.sport === 'swim') {
            distance_meters = Math.round((dayPattern.duration / 60) * 2400);
          }

          workouts.push({
            plan_id,
            athlete_id,
            workout_date: workoutDate.toISOString().split('T')[0],
            week_number: week,
            day_of_week: dayPattern.day,
            sport: dayPattern.sport,
            workout_type: dayPattern.type,
            name: template.name,
            description: template.description,
            planned_duration_minutes: dayPattern.duration,
            planned_distance_meters: distance_meters,
            planned_intensity: template.intensity,
            instructions: template.instructions
          });
        }

        // Insert workouts for this week
        const { error: weekError } = await supabaseAdmin
          .from('workouts')
          .insert(workouts);

        if (weekError) {
          return json({
            error: `Failed to generate workouts for week ${week}`,
            details: weekError.message
          }, { status: 500 });
        }

        totalWorkouts += workouts.length;
        weeklyResults.push({
          week,
          workouts_count: workouts.length,
          start_date: weekStartDate.toISOString().split('T')[0]
        });
      }

      return json({
        success: true,
        message: `Generated complete ${weeks_duration}-week training plan`,
        data: {
          plan_id,
          weeks_duration,
          total_workouts: totalWorkouts,
          weekly_breakdown: weeklyResults
        }
      });

    } else {
      return json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Workout generation error:', error);
    return json(
      { 
        error: 'Failed to generate workouts', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};

// Helper function to get weekly workout patterns
function getWeeklyPattern(planType: string, week: number, totalWeeks: number, intensityModifier: string) {
  const baseTriathlonPattern = [
    { day: 1, sport: 'swim', type: 'technique', duration: 45 },
    { day: 2, sport: 'bike', type: 'endurance', duration: 90 },
    { day: 3, sport: 'run', type: 'easy', duration: 45 },
    { day: 4, sport: 'swim', type: 'endurance', duration: 60 },
    { day: 5, sport: 'bike', type: 'ftp', duration: 75 },
    { day: 6, sport: 'run', type: 'long', duration: 90 },
    { day: 7, sport: 'rest', type: 'recovery', duration: 0 }
  ];

  // Modify pattern based on week and intensity
  if (intensityModifier === 'easy') {
    return baseTriathlonPattern.map(day => ({
      ...day,
      duration: Math.round(day.duration * 0.8),
      type: day.type === 'ftp' ? 'endurance' : day.type
    }));
  } else if (intensityModifier === 'hard') {
    return baseTriathlonPattern.map(day => ({
      ...day,
      duration: Math.round(day.duration * 1.2),
      type: day.type === 'endurance' && day.sport === 'run' ? 'tempo' : day.type
    }));
  } else if (intensityModifier === 'taper') {
    return baseTriathlonPattern.map(day => ({
      ...day,
      duration: Math.round(day.duration * 0.6),
      type: day.type === 'ftp' ? 'easy' : day.type === 'long' ? 'easy' : day.type
    }));
  }

  return baseTriathlonPattern;
}
