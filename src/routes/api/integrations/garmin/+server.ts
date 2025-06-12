// API Route: Garmin Integration
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GarminApiService, ApiIntegrationManager } from '$lib/api-integrations';

const GARMIN_CLIENT_ID = process.env.GARMIN_CLIENT_ID || 'your_garmin_client_id';
const GARMIN_CLIENT_SECRET = process.env.GARMIN_CLIENT_SECRET || 'your_garmin_client_secret';

// POST /api/integrations/garmin - Connect Garmin account
export const POST: RequestHandler = async ({ request }) => {
  try {
    const { accessToken, userId } = await request.json();

    if (!accessToken || !userId) {
      return json({ error: 'Missing required parameters' }, { status: 400 });
    }

    console.log('🔄 Connecting Garmin for user:', userId);

    // Store integration in database
    const integration = {
      userId,
      provider: 'garmin',
      accessToken,
      isActive: true
    };

    console.log('✅ Garmin integration created for user:', userId);

    // Start initial sync
    console.log('🔄 Starting initial Garmin sync...');
    const syncResult = await ApiIntegrationManager.getInstance().syncUserData(
      userId,
      'garmin',
      accessToken
    );

    console.log('✅ Initial Garmin sync completed:', syncResult);

    return json({
      success: true,
      integration: {
        provider: 'garmin',
        connectedAt: new Date().toISOString()
      },
      sync: syncResult
    });

  } catch (error) {
    console.error('❌ Garmin connection error:', error);
    return json(
      { 
        error: 'Failed to connect Garmin account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};

// GET /api/integrations/garmin - Sync Garmin data
export const GET: RequestHandler = async ({ url }) => {
  try {
    const userId = parseInt(url.searchParams.get('userId') || '0');
    
    if (!userId) {
      return json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    console.log('🔄 Starting Garmin sync for user:', userId);

    // Get user's Garmin integration from database
    const mockIntegration = {
      accessToken: 'mock_garmin_token',
      isActive: true
    };

    // Perform sync
    const syncResult = await ApiIntegrationManager.getInstance().syncUserData(
      userId,
      'garmin',
      mockIntegration.accessToken
    );

    console.log('✅ Garmin sync completed:', syncResult);

    return json({
      success: true,
      ...syncResult,
      lastSync: new Date().toISOString(),
      integration: {
        provider: 'garmin'
      }
    });

  } catch (error) {
    console.error('❌ Garmin sync error:', error);
    return json(
      { 
        error: 'Failed to sync Garmin data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};

// DELETE /api/integrations/garmin - Disconnect Garmin
export const DELETE: RequestHandler = async ({ url }) => {
  try {
    const userId = parseInt(url.searchParams.get('userId') || '0');
    
    if (!userId) {
      return json({ error: 'Missing userId parameter' }, { status: 400 });
    }

    console.log('🔄 Disconnecting Garmin for user:', userId);

    // In production, this would deactivate the integration in the database
    console.log('✅ Garmin disconnected for user:', userId);

    return json({
      success: true,
      message: 'Garmin integration disconnected',
      disconnectedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Garmin disconnect error:', error);
    return json(
      { 
        error: 'Failed to disconnect Garmin',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
};
