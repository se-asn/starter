// Simple Admin Training Plan Creator
// src/routes/api/admin/create-plan/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authHeader = request.headers.get('authorization');
    
    // Simple admin check
    if (authHeader !== 'Bearer admin-token-laufplanerpro-2025') {
      return json({ error: 'Admin access required' }, { status: 401 });
    }

    const { athlete_id, template } = await request.json();
    
    // Direct Supabase REST API call
    const supabaseUrl = 'https://ncmfcwknvxoirlmniraq.supabase.co';
    const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jbWZjd2tudnhvaXJsbW5pcmFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA5MTI2OSwiZXhwIjoyMDY3NjY3MjY5fQ.DqsMjmNm3oPNhqomeihOos6O8XcD080MvSOj1mwVh9s';

    const templates: any = {
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
      }
    };

    const selectedTemplate = templates[template];
    if (!selectedTemplate) {
      return json({ error: 'Invalid template' }, { status: 400 });
    }

    // Calculate dates
    const startDate = new Date('2025-07-20');
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (selectedTemplate.weeks_duration * 7));

    // Create training plan
    const planResponse = await fetch(`${supabaseUrl}/rest/v1/training_plans`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        athlete_id,
        name: selectedTemplate.name,
        description: selectedTemplate.description,
        plan_type: selectedTemplate.plan_type,
        target_event: selectedTemplate.target_event,
        weeks_duration: selectedTemplate.weeks_duration,
        difficulty_level: selectedTemplate.difficulty_level,
        target_date: endDate.toISOString().split('T')[0],
        is_active: true,
        ai_prompt: `Template: ${template}`
      })
    });

    if (!planResponse.ok) {
      const error = await planResponse.text();
      return json({ 
        error: 'Failed to create plan', 
        details: error 
      }, { status: 500 });
    }

    const planData = await planResponse.json();
    const planId = planData[0].id;

    // Generate workouts for each week
    const workouts = [];
    
    for (let week = 1; week <= selectedTemplate.weeks_duration; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(weekStart.getDate() + ((week - 1) * 7));

      // Weekly workout pattern
      const weeklyPattern = [
        { day: 1, sport: 'swim', name: 'Technique Focus', duration: 45, type: 'technique' },
        { day: 2, sport: 'bike', name: 'Endurance Ride', duration: 90, type: 'endurance' },
        { day: 3, sport: 'run', name: 'Easy Run', duration: 45, type: 'recovery' },
        { day: 4, sport: 'swim', name: 'Interval Set', duration: 60, type: 'intervals' },
        { day: 5, sport: 'bike', name: 'Threshold Work', duration: 75, type: 'threshold' },
        { day: 6, sport: 'run', name: 'Long Run', duration: 90, type: 'endurance' },
        { day: 7, sport: 'rest', name: 'Recovery', duration: 0, type: 'rest' }
      ];

      for (const day of weeklyPattern) {
        if (day.sport === 'rest') continue;

        const workoutDate = new Date(weekStart);
        workoutDate.setDate(workoutDate.getDate() + (day.day - 1));

        workouts.push({
          plan_id: planId,
          athlete_id,
          workout_date: workoutDate.toISOString().split('T')[0],
          week_number: week,
          day_of_week: day.day,
          sport: day.sport,
          workout_type: day.type,
          name: day.name,
          description: `Week ${week} - ${day.name}`,
          planned_duration_minutes: day.duration,
          planned_intensity: day.type === 'intervals' ? 'hard' : 'moderate'
        });
      }
    }

    // Insert workouts
    const workoutsResponse = await fetch(`${supabaseUrl}/rest/v1/workouts`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workouts)
    });

    if (!workoutsResponse.ok) {
      const error = await workoutsResponse.text();
      return json({ 
        error: 'Plan created but workouts failed', 
        plan_id: planId,
        details: error 
      }, { status: 500 });
    }

    return json({
      success: true,
      message: `${selectedTemplate.name} created successfully!`,
      data: {
        plan_id: planId,
        name: selectedTemplate.name,
        weeks: selectedTemplate.weeks_duration,
        workouts_created: workouts.length,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0]
      }
    });

  } catch (error: any) {
    console.error('Admin create plan error:', error);
    return json(
      { 
        error: 'Failed to create training plan', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
