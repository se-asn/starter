// Protected profile endpoint
// src/routes/api/profile/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { authenticateRequest } from '$lib/server/auth-middleware';

export const GET: RequestHandler = async (event) => {
  // Authenticate the request
  const authResult = await authenticateRequest(event);
  
  // If authentication failed, return the error response
  if (authResult instanceof Response) {
    return authResult;
  }
  
  // authResult is now the authenticated user
  const user = authResult;
  
  if (!event.platform?.env?.DB) {
    return json(
      { error: 'Database not available' },
      { status: 500 }
    );
  }

  const db = event.platform.env.DB;

  try {
    // Get full user profile from database
    const userProfile = await db.prepare(`
      SELECT id, email, name, first_name, last_name, birth_date, gender, 
             weight_kg, height_cm, ftp_watts, threshold_pace_per_km, 
             css_pace_per_100m, max_hr, resting_hr, created_at, updated_at
      FROM athletes 
      WHERE id = ?
    `).bind(user.id).first();

    if (!userProfile) {
      return json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Get API connections count
    const apiConnections = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM api_connections 
      WHERE athlete_id = ? AND is_active = true
    `).bind(user.id).first();

    // Get recent activities count
    const recentActivities = await db.prepare(`
      SELECT COUNT(*) as count 
      FROM activities 
      WHERE athlete_id = ? AND start_time > datetime('now', '-30 days')
    `).bind(user.id).first();

    return json({
      success: true,
      profile: userProfile,
      stats: {
        apiConnections: apiConnections?.count || 0,
        recentActivities: recentActivities?.count || 0
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    return json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
};
