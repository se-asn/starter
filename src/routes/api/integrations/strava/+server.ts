// Strava OAuth & Data Sync API - Updated for Supabase
// +server.ts für /api/integrations/strava

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserFromRequest, serverDb } from '$lib/server/supabase-server';

// Strava OAuth redirect
export const GET: RequestHandler = async ({ url, request }) => {
  const action = url.searchParams.get('action');
  
  if (action === 'auth') {
    // Redirect to Strava OAuth
    const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize');
    stravaAuthUrl.searchParams.set('client_id', 'YOUR_STRAVA_CLIENT_ID');
    stravaAuthUrl.searchParams.set('redirect_uri', `${url.origin}/api/integrations/strava/callback`);
    stravaAuthUrl.searchParams.set('response_type', 'code');
    stravaAuthUrl.searchParams.set('scope', 'read,activity:read_all,profile:read_all');
    stravaAuthUrl.searchParams.set('state', 'random_state_string');
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: stravaAuthUrl.toString()
      }
    });
  }
  
  if (action === 'sync') {
    // Get user from auth token
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
      // Get Strava connection
      const connection = await serverDb.getConnection(userId, 'strava');
      if (!connection) {
        return json({ error: 'Strava not connected' }, { status: 400 });
      }

      // Manual sync trigger
      await serverDb.logSync(userId, 'strava', 'manual', 'started');
      
      // TODO: Implement actual Strava API sync here
      
      return json({ 
        message: 'Sync started', 
        status: 'processing',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Strava sync error:', error);
      return json({ error: 'Sync failed' }, { status: 500 });
    }
  }
  
  return json({ error: 'Invalid action' }, { status: 400 });
};

// Webhook für automatische Syncs
export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const data: any = await request.json();
    
    // Strava Webhook Event
    if (data.aspect_type === 'create' && data.object_type === 'activity') {
      // Neue Aktivität wurde erstellt
      const activityId = data.object_id;
      const athleteId = data.owner_id;
      
      // Background job für Activity-Import starten
      // TODO: Implement activity sync
      console.log(`New Strava activity: ${activityId} for athlete: ${athleteId}`);
      
      return json({ status: 'queued' });
    }
    
    return json({ status: 'ignored' });
    
  } catch (error) {
    console.error('Strava webhook error:', error);
    return json({ error: 'Webhook processing failed' }, { status: 500 });
  }
};
