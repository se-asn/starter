// Simple Demo Data Creator - Direct Insert Method
// src/routes/api/simple-demo/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    if (action === 'create_demo') {
      console.log('Creating demo data...');
      
      const demoUserId = '00000000-0000-0000-0000-000000000123';
      
      // Simple approach: try to insert data and see what happens
      console.log('Attempting to create demo athlete...');
      
      // Try to create athlete with simpler approach
      const { data: newAthlete, error: athleteError } = await supabase
        .from('athletes')
        .insert({
          id: demoUserId,
          email: 'demo@laufplanerpro.de',
          name: 'Alex Mueller',
          first_name: 'Alex',
          last_name: 'Mueller'
        })
        .select()
        .single();

      if (athleteError) {
        console.log('Athlete creation error:', athleteError);
        
        // If athlete already exists, that's OK
        if (athleteError.code === '23505') { // Unique constraint violation
          console.log('Demo athlete already exists, continuing...');
        } else {
          return json({
            error: 'Failed to create demo athlete',
            details: athleteError.message,
            code: athleteError.code,
            hint: athleteError.hint
          }, { status: 500 });
        }
      } else {
        console.log('Demo athlete created:', newAthlete);
      }

      // Create some demo activities
      console.log('Creating demo activities...');
      const currentTime = new Date();
      
      const { data: newActivities, error: activitiesError } = await supabase
        .from('activities')
        .insert([
          {
            athlete_id: demoUserId,
            external_id: 'demo-run-simple',
            provider: 'demo',
            activity_type: 'run',
            name: 'Demo Run',
            start_time: new Date(currentTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
            duration_seconds: 3600,
            distance_meters: 10000
          },
          {
            athlete_id: demoUserId,
            external_id: 'demo-bike-simple',
            provider: 'demo',
            activity_type: 'bike',
            name: 'Demo Bike Ride',
            start_time: new Date(currentTime.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            duration_seconds: 3600,
            distance_meters: 30000
          }
        ])
        .select();

      if (activitiesError) {
        console.log('Activities creation error:', activitiesError);
        return json({
          error: 'Failed to create demo activities',
          details: activitiesError.message,
          code: activitiesError.code
        }, { status: 500 });
      }

      console.log('Demo activities created:', newActivities?.length);

      return json({
        success: true,
        message: 'Demo data created successfully',
        data: {
          athlete: newAthlete || 'existed',
          activities: newActivities?.length || 0
        }
      });
      
    } else {
      return json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error: any) {
    console.error('Demo creation error:', error);
    return json(
      { 
        error: 'Failed to create demo data', 
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async () => {
  try {
    // Simple status check
    const { data: tables, error } = await supabase
      .from('athletes')
      .select('id')
      .limit(1);

    if (error) {
      return json({
        status: 'error',
        message: 'Cannot connect to athletes table',
        details: error.message
      }, { status: 500 });
    }

    return json({
      status: 'connected',
      message: 'Supabase connection working',
      athletes_table: 'accessible'
    });
    
  } catch (error: any) {
    return json(
      { 
        status: 'error',
        message: 'Database connection failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
};
