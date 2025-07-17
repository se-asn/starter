// Professional Auth User Creator for Demo Account
// src/routes/api/production/auth/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { action } = await request.json();
    
    if (action !== 'create_demo_auth_user') {
      return json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log('🔐 Creating demo auth user...');
    
    const supabaseAdmin = getSupabaseAdmin();
    const demoUserId = '00000000-0000-0000-0000-000000000123';
    
    // Create or update auth user
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      id: demoUserId,
      email: 'demo@laufplanerpro.de',
      password: 'Demo123!',
      email_confirm: true,
      user_metadata: {
        name: 'Alex Mueller',
        first_name: 'Alex',
        last_name: 'Mueller',
        demo_account: true
      }
    });

    if (authError) {
      // If user already exists, try to update
      if (authError.message.includes('already registered')) {
        console.log('⚠️ Auth user already exists, updating...');
        
        const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          demoUserId,
          {
            email: 'demo@laufplanerpro.de',
            password: 'Demo123!',
            email_confirm: true,
            user_metadata: {
              name: 'Alex Mueller',
              first_name: 'Alex',
              last_name: 'Mueller',
              demo_account: true
            }
          }
        );

        if (updateError) {
          return json({
            error: 'Failed to update demo auth user',
            details: updateError.message
          }, { status: 500 });
        }

        console.log('✅ Demo auth user updated');
        return json({
          success: true,
          message: 'Demo auth user updated successfully',
          user: updateData.user
        });
      } else {
        return json({
          error: 'Failed to create demo auth user',
          details: authError.message
        }, { status: 500 });
      }
    }

    console.log('✅ Demo auth user created');
    
    return json({
      success: true,
      message: 'Demo auth user created successfully',
      user: authUser.user,
      credentials: {
        email: 'demo@laufplanerpro.de',
        password: 'Demo123!',
        note: 'Ready for demo login'
      }
    });
    
  } catch (error: any) {
    console.error('❌ Auth user creation failed:', error);
    return json(
      { 
        error: 'Failed to create demo auth user', 
        details: error.message
      },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async () => {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const demoUserId = '00000000-0000-0000-0000-000000000123';
    
    // Check if demo auth user exists
    const { data: authUser, error } = await supabaseAdmin.auth.admin.getUserById(demoUserId);
    
    if (error) {
      return json({
        exists: false,
        error: error.message
      });
    }
    
    return json({
      exists: true,
      user: {
        id: authUser.user.id,
        email: authUser.user.email,
        created_at: authUser.user.created_at,
        email_confirmed_at: authUser.user.email_confirmed_at,
        user_metadata: authUser.user.user_metadata
      }
    });
    
  } catch (error: any) {
    return json(
      { 
        exists: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
};
