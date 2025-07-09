// Simplified login endpoint - Frontend calls Supabase directly
// This endpoint is kept for compatibility, but frontend should use Supabase client
// src/routes/api/auth/login/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  // This endpoint redirects to client-side auth
  // The frontend should use the Supabase client directly
  
  return json({
    message: 'Please use client-side authentication with Supabase',
    redirect: '/auth',
    instructions: 'Use the auth.signIn() method from $lib/supabase'
  }, { status: 302 });
};
