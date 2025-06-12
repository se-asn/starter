// Strava OAuth Callback Handler
// /api/integrations/strava/callback/+server.ts

import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform, cookies }) => {
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');
  
  if (error) {
    return redirect(302, `/dashboard?error=strava_auth_denied`);
  }
  
  if (!code) {
    return redirect(302, `/dashboard?error=strava_auth_failed`);
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: 'YOUR_STRAVA_CLIENT_ID',
        client_secret: 'YOUR_STRAVA_CLIENT_SECRET',
        code: code,      grant_type: 'authorization_code'
      })
    });
    
    const tokenData: any = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(`Strava token exchange failed: ${tokenData.message}`);
    }
    
    // Get athlete info from Strava
    const athleteResponse = await fetch('https://www.strava.com/api/v3/athlete', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    const athleteData: any = await athleteResponse.json();
    
    // TODO: Store in D1 Database
    /*
    const db = platform?.env?.DB;
    await db.prepare(`
      INSERT OR REPLACE INTO api_connections 
      (id, athlete_id, provider, access_token, refresh_token, expires_at, scope, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      'current_user_id', // TODO: Get from session
      'strava',
      tokenData.access_token,
      tokenData.refresh_token,
      new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      tokenData.scope,
      true
    ).run();
    */
    
    console.log('Strava connected:', {
      athlete: athleteData.firstname + ' ' + athleteData.lastname,
      id: athleteData.id
    });
    
    return redirect(302, `/dashboard?success=strava_connected`);
    
  } catch (error) {
    console.error('Strava callback error:', error);
    return redirect(302, `/dashboard?error=strava_auth_failed`);
  }
};
