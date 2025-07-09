// Simplified register endpoint - Frontend calls Supabase directly
// This endpoint is kept for compatibility
// src/routes/api/auth/register/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  // This endpoint redirects to client-side auth
  // The frontend should use the Supabase client directly
  
  return json({
    message: 'Please use client-side authentication with Supabase',
    redirect: '/auth',
    instructions: 'Use the auth.signUp() method from $lib/supabase'
  }, { status: 302 });
};