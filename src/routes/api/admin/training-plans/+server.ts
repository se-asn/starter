// Admin Training Plan Creator API
// src/routes/api/admin/training-plans/+server.ts

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
  // In production: implement proper admin JWT verification
  // For demo: simple token check
  return authHeader === 'Bearer admin-token-laufplanerpro-2025';
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Verify admin access
    if (!await verifyAdmin(authHeader)) {
      return json({ error: 'Admin access required' }, { status: 401 });
    }

    const { action, data } = await request.json();
    
    if (action === 'create_training_plan') {
      const {
        athlete_id,
        plan_name,
        plan_description,
        start_date,
        weeks_duration,
        plan_type,
        target_event,
        weekly_hours,
        difficulty_level,
        workouts
      } = data;

      // Calculate end date
      const endDate = new Date(start_date);
      endDate.setDate(endDate.getDate() + (weeks_duration * 7));

      console.log(`Creating training plan for athlete: ${athlete_id}`);

      // Create training plan
      const { data: planData, error: planError } = await supabaseAdmin
        .from('training_plans')
        .insert({
          athlete_id,
          name: plan_name,
          description: plan_description,
          plan_type: plan_type || 'triathlon',
          target_event: target_event || 'olympic',
          target_date: endDate.toISOString().split('T')[0],
          weeks_duration,
          difficulty_level: difficulty_level || 'intermediate',
          is_active: true,
          weekly_hours: weekly_hours || 12,
          ai_prompt: `Generated ${weeks_duration}-week ${plan_type} plan for ${target_event}`
        })
        .select('id')
        .single();

      if (planError) {
        console.error('Training plan creation error:', planError);
        return json({
          error: 'Failed to create training plan',
          details: planError.message
        }, { status: 500 });
      }

      const planId = planData.id;
      console.log(`Training plan created with ID: ${planId}`);

      // Create workouts if provided
      if (workouts && workouts.length > 0) {
        const workoutInserts = workouts.map((workout: any) => ({
          plan_id: planId,
          athlete_id,
          workout_date: workout.date,
          week_number: workout.week,
          day_of_week: workout.day_of_week,
          sport: workout.sport,
          workout_type: workout.type,
          name: workout.name,
          description: workout.description,
          planned_duration_minutes: workout.duration_minutes,
          planned_distance_meters: workout.distance_meters,
          planned_intensity: workout.intensity,
          instructions: workout.instructions || {}
        }));

        const { error: workoutsError } = await supabaseAdmin
          .from('workouts')
          .insert(workoutInserts);

        if (workoutsError) {
          console.error('Workouts creation error:', workoutsError);
          return json({
            error: 'Training plan created but workouts failed',
            details: workoutsError.message,
            plan_id: planId
          }, { status: 500 });
        }

        console.log(`${workouts.length} workouts created for plan ${planId}`);
      }

      return json({
        success: true,
        message: 'Training plan created successfully',
        data: {
          plan_id: planId,
          athlete_id,
          name: plan_name,
          weeks: weeks_duration,
          workouts_created: workouts?.length || 0,
          start_date,
          end_date: endDate.toISOString().split('T')[0]
        }
      });

    } else if (action === 'create_quick_plan') {
      // Quick plan creation with predefined templates
      const { athlete_id, template, start_date } = data;
      
      const templates = {
        'olympic_4week': {
          name: 'Olympic Distance Preparation - 4 Weeks',
          description: 'Intensive 4-week preparation phase for Olympic distance triathlon',
          weeks_duration: 4,
          plan_type: 'triathlon',
          target_event: 'olympic',
          weekly_hours: 12,
          difficulty_level: 'intermediate'
        },
        'sprint_2week': {
          name: 'Sprint Triathlon Taper - 2 Weeks',
          description: 'Final preparation and taper for sprint distance',
          weeks_duration: 2,
          plan_type: 'triathlon',
          target_event: 'sprint',
          weekly_hours: 8,
          difficulty_level: 'intermediate'
        },
        'ironman_8week': {
          name: 'Ironman Build Phase - 8 Weeks',
          description: 'High-volume build phase for Ironman preparation',
          weeks_duration: 8,
          plan_type: 'triathlon',
          target_event: 'ironman',
          weekly_hours: 18,
          difficulty_level: 'advanced'
        }
      };

      const selectedTemplate = templates[template as keyof typeof templates];
      if (!selectedTemplate) {
        return json({ error: 'Invalid template selected' }, { status: 400 });
      }

      // Create plan with template
      const endDate = new Date(start_date);
      endDate.setDate(endDate.getDate() + (selectedTemplate.weeks_duration * 7));

      const { data: planData, error: planError } = await supabaseAdmin
        .from('training_plans')
        .insert({
          athlete_id,
          ...selectedTemplate,
          target_date: endDate.toISOString().split('T')[0],
          is_active: true,
          ai_prompt: `Template: ${template}`
        })
        .select('id, name')
        .single();

      if (planError) {
        return json({
          error: 'Failed to create quick plan',
          details: planError.message
        }, { status: 500 });
      }

      return json({
        success: true,
        message: 'Quick training plan created',
        data: {
          plan_id: planData.id,
          name: planData.name,
          template_used: template
        }
      });

    } else {
      return json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Admin training plan API error:', error);
    return json(
      { 
        error: 'Failed to process training plan request', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};

// Get training plans for athlete (Admin view)
export const GET: RequestHandler = async ({ url }) => {
  try {
    const authHeader = url.searchParams.get('auth');
    
    if (!await verifyAdmin(`Bearer ${authHeader}`)) {
      return json({ error: 'Admin access required' }, { status: 401 });
    }

    const athleteId = url.searchParams.get('athlete_id');
    
    if (!athleteId) {
      return json({ error: 'athlete_id parameter required' }, { status: 400 });
    }

    // Get training plans for athlete
    const { data: plans, error: plansError } = await supabaseAdmin
      .from('training_plans')
      .select(`
        id,
        name,
        description,
        plan_type,
        target_event,
        target_date,
        weeks_duration,
        difficulty_level,
        is_active,
        weekly_hours,
        created_at
      `)
      .eq('athlete_id', athleteId)
      .order('created_at', { ascending: false });

    if (plansError) {
      return json({
        error: 'Failed to fetch training plans',
        details: plansError.message
      }, { status: 500 });
    }

    // Get workout counts for each plan
    const plansWithCounts = await Promise.all(
      (plans || []).map(async (plan) => {
        const { count } = await supabaseAdmin
          .from('workouts')
          .select('*', { count: 'exact', head: true })
          .eq('plan_id', plan.id);

        return {
          ...plan,
          workout_count: count || 0
        };
      })
    );

    return json({
      success: true,
      athlete_id: athleteId,
      plans: plansWithCounts
    });

  } catch (error: any) {
    return json(
      { 
        error: 'Failed to fetch training plans', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
