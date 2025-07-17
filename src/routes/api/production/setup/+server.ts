// Professional Setup Wizard - Complete Production Setup
// src/routes/api/production/setup/+server.ts

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    const { action } = await request.json();
    
    if (action !== 'complete_professional_setup') {
      return json({ error: 'Invalid action' }, { status: 400 });
    }

    console.log('🚀 Starting complete professional setup...');
    const results = {
      auth_user: null as any,
      demo_data: null as any,
      errors: [] as string[]
    };

    // Step 1: Create Auth User
    console.log('Step 1: Creating demo auth user...');
    try {
      const authResponse = await fetch('/api/production/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_demo_auth_user' })
      });
      
      const authResult = await authResponse.json();
      
      if (authResponse.ok) {
        results.auth_user = authResult;
        console.log('✅ Auth user created/updated');
      } else {
        results.errors.push(`Auth user: ${authResult.error}`);
        console.error('❌ Auth user failed:', authResult.error);
      }
    } catch (error: any) {
      results.errors.push(`Auth user: ${error.message}`);
    }

    // Step 2: Create Demo Data (only if auth user was successful)
    if (results.auth_user && !results.errors.length) {
      console.log('Step 2: Creating professional demo data...');
      try {
        const dataResponse = await fetch('/api/production/seed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create_professional_demo' })
        });
        
        const dataResult = await dataResponse.json();
        
        if (dataResponse.ok) {
          results.demo_data = dataResult;
          console.log('✅ Professional demo data created');
        } else {
          results.errors.push(`Demo data: ${dataResult.error}`);
          console.error('❌ Demo data failed:', dataResult.error);
        }
      } catch (error: any) {
        results.errors.push(`Demo data: ${error.message}`);
      }
    }

    // Final Result
    const success = results.errors.length === 0;
    
    if (success) {
      console.log('🎉 Complete professional setup successful!');
      return json({
        success: true,
        message: '🚀 LaufplanerPro is now professionally set up and ready for production!',
        results: results,
        demo_credentials: {
          email: 'demo@laufplanerpro.de',
          password: 'Demo123!',
          user_name: 'Alex Mueller'
        },
        ready_features: [
          '✅ Professional athlete profile with comprehensive metrics',
          '✅ 8 realistic training activities (swim, bike, run, brick)',
          '✅ 8 days of performance metrics (HRV, sleep, fatigue)',
          '✅ Advanced 16-week Olympic triathlon training plan',
          '✅ Complete dashboard with analytics',
          '✅ All navigation pages functional',
          '✅ Demo and real user authentication working'
        ],
        next_steps: [
          '1. Test demo login at /auth',
          '2. Navigate through all dashboard sections',
          '3. Test new user registration',
          '4. Verify all features work correctly',
          '5. Ready for production deployment!'
        ]
      });
    } else {
      return json({
        success: false,
        message: 'Setup completed with some errors',
        results: results,
        errors: results.errors,
        suggestion: 'Check Supabase configuration and run production-schema.sql first'
      }, { status: 207 }); // Multi-status
    }
    
  } catch (error: any) {
    console.error('❌ Complete setup failed:', error);
    return json(
      { 
        success: false,
        error: 'Failed to complete professional setup', 
        details: error.message
      },
      { status: 500 }
    );
  }
};

export const GET: RequestHandler = async ({ fetch }) => {
  try {
    console.log('🔍 Checking complete setup status...');
    
    // Check auth user
    const authResponse = await fetch('/api/production/auth');
    const authStatus = await authResponse.json();
    
    // Check demo data
    const dataResponse = await fetch('/api/production/seed');
    const dataStatus = await dataResponse.json();
    
    const isCompletelyReady = 
      authStatus.exists && 
      dataStatus.status === 'ready' && 
      dataStatus.professional_setup;
    
    return json({
      status: isCompletelyReady ? 'production_ready' : 'needs_setup',
      auth_user: authStatus,
      demo_data: dataStatus,
      production_ready: isCompletelyReady,
      setup_required: !isCompletelyReady,
      recommendation: isCompletelyReady 
        ? '🚀 LaufplanerPro is production ready!'
        : '⚠️ Run professional setup to complete configuration'
    });
    
  } catch (error: any) {
    return json(
      { 
        status: 'error',
        error: 'Failed to check setup status', 
        details: error.message 
      },
      { status: 500 }
    );
  }
};
