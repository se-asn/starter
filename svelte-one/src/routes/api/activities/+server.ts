// User activities endpoint
// src/routes/api/activities/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { authenticateRequest } from '$lib/server/auth-middleware';

export const GET: RequestHandler = async (event) => {
  // Authenticate the request
  const authResult = await authenticateRequest(event);
  
  if (authResult instanceof Response) {
    return authResult;
  }
  
  const user = authResult;
  
  if (!event.platform?.env?.DB) {
    return json(
      { error: 'Database not available' },
      { status: 500 }
    );
  }

  const db = event.platform.env.DB;

  try {
    // Get URL parameters for pagination and filtering
    const url = new URL(event.request.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 50);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const activityType = url.searchParams.get('type'); // swim, bike, run
    
    // Build query with optional filtering
    let query = `
      SELECT id, external_id, provider, activity_type, name, description,
             start_time, duration_seconds, distance_meters, elevation_gain_meters,
             avg_heart_rate, max_heart_rate, avg_power_watts, max_power_watts,
             avg_cadence, max_speed_mps, calories, training_stress_score,
             intensity_factor, normalized_power_watts, work_joules, created_at
      FROM activities 
      WHERE athlete_id = ?
    `;
    
    const params = [user.id];
    
    if (activityType) {
      query += ` AND activity_type = ?`;
      params.push(activityType);
    }
    
    query += ` ORDER BY start_time DESC LIMIT ? OFFSET ?`;
    params.push(limit.toString(), offset.toString());

    const activities = await db.prepare(query).bind(...params).all();

    // Get total count for pagination
    let countQuery = `SELECT COUNT(*) as total FROM activities WHERE athlete_id = ?`;
    const countParams = [user.id];
    
    if (activityType) {
      countQuery += ` AND activity_type = ?`;
      countParams.push(activityType);
    }
    
    const totalResult = await db.prepare(countQuery).bind(...countParams).first();
    const total = totalResult?.total || 0;

    // Get activity type summary
    const summary = await db.prepare(`
      SELECT 
        activity_type,
        COUNT(*) as count,
        SUM(distance_meters) as total_distance,
        SUM(duration_seconds) as total_duration,
        AVG(avg_heart_rate) as avg_hr
      FROM activities 
      WHERE athlete_id = ? AND start_time > datetime('now', '-30 days')
      GROUP BY activity_type
      ORDER BY count DESC
    `).bind(user.id).all();

    return json({
      success: true,
      activities: activities.results || [],
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      summary: summary.results || []
    });

  } catch (error) {
    console.error('Activities fetch error:', error);
    return json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
};
