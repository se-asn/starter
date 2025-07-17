// Admin Training Plans Overview API
// src/routes/api/admin/plans-overview/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const authHeader = url.searchParams.get('auth');
    
    if (authHeader !== 'admin-token-laufplanerpro-2025') {
      return json({ error: 'Admin access required' }, { status: 401 });
    }

    const athleteId = url.searchParams.get('athlete_id') || '78ad2599-26d6-49f9-afcf-f06bd7679c14';
    
    // Direct Supabase REST API calls
    const supabaseUrl = 'https://ncmfcwknvxoirlmniraq.supabase.co';
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbWZjd2tudnhvaXJsbW5pcmFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5MTI2OSwiZXhwIjoyMDY3NjY3MjY5fQ.DqsMjmNm3oPNhqomeihOos6O8XcD080MvSOj1mwVh9s';

    // Get athlete info
    const athleteResponse = await fetch(`${supabaseUrl}/rest/v1/athletes?id=eq.${athleteId}&select=name,email`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    const athleteData = await athleteResponse.json();
    const athlete = athleteData[0];

    // Get training plans
    const plansResponse = await fetch(`${supabaseUrl}/rest/v1/training_plans?athlete_id=eq.${athleteId}&select=*&order=created_at.desc`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    const plans = await plansResponse.json();

    // Get workout counts for each plan
    const plansWithWorkouts = await Promise.all(
      plans.map(async (plan: any) => {
        const workoutsResponse = await fetch(`${supabaseUrl}/rest/v1/workouts?plan_id=eq.${plan.id}&select=count`, {
          headers: {
            'apikey': serviceKey,
            'Authorization': `Bearer ${serviceKey}`,
            'Prefer': 'count=exact'
          }
        });
        
        const workoutCount = workoutsResponse.headers.get('Content-Range')?.split('/')[1] || '0';

        // Get upcoming workouts (next 7 days)
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];

        const upcomingResponse = await fetch(
          `${supabaseUrl}/rest/v1/workouts?plan_id=eq.${plan.id}&workout_date=gte.${today}&workout_date=lte.${nextWeekStr}&select=workout_date,sport,name,planned_duration_minutes&order=workout_date.asc&limit=5`,
          {
            headers: {
              'apikey': serviceKey,
              'Authorization': `Bearer ${serviceKey}`
            }
          }
        );
        const upcomingWorkouts = await upcomingResponse.json();

        return {
          ...plan,
          workout_count: parseInt(workoutCount),
          upcoming_workouts: upcomingWorkouts
        };
      })
    );

    return json({
      success: true,
      athlete: {
        id: athleteId,
        name: athlete?.name || 'Unknown',
        email: athlete?.email || 'Unknown'
      },
      training_plans: plansWithWorkouts.map((plan: any) => ({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        plan_type: plan.plan_type,
        target_event: plan.target_event,
        target_date: plan.target_date,
        weeks_duration: plan.weeks_duration,
        difficulty_level: plan.difficulty_level,
        is_active: plan.is_active,
        created_at: plan.created_at,
        workout_count: plan.workout_count,
        upcoming_workouts: plan.upcoming_workouts
      })),
      summary: {
        total_plans: plansWithWorkouts.length,
        active_plans: plansWithWorkouts.filter((p: any) => p.is_active).length,
        total_workouts: plansWithWorkouts.reduce((sum: number, p: any) => sum + p.workout_count, 0)
      }
    });

  } catch (error: any) {
    console.error('Admin plans overview error:', error);
    return json(
      { 
        error: 'Failed to fetch training plans overview', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
