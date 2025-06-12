// Smart Triathlete API Service Layer
// Handles all external API integrations for athlete data

export interface ApiProvider {
  name: string;
  baseUrl: string;
  authType: 'oauth2' | 'api_key';
  rateLimit: {
    requests: number;
    window: number; // seconds
  };
}

export interface AthleteProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  weight?: number; // kg
  height?: number; // cm
  ftp?: number; // watts
  maxHeartRate?: number;
  restingHeartRate?: number;
  timezone?: string;
}

export interface Activity {
  externalId: string;
  provider: string;
  name: string;
  type: 'swim' | 'bike' | 'run' | 'brick' | 'strength' | 'other';
  startDate: Date;
  durationSeconds: number;
  distanceMeters?: number;
  elevationGainMeters?: number;
  calories?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePower?: number;
  maxPower?: number;
  normalizedPower?: number;
  trainingStressScore?: number;
  perceivedExertion?: number;
  description?: string;
  gear?: string;
  weather?: {
    temperature?: number;
    conditions?: string;
    humidity?: number;
    windSpeed?: number;
  };
  splits?: ActivitySplit[];
  rawData?: any; // Full API response
}

export interface ActivitySplit {
  distance: number;
  duration: number;
  pace?: number;
  heartRate?: number;
  power?: number;
  elevation?: number;
}

// Strava API Service
export class StravaApiService {
  private static readonly BASE_URL = 'https://www.strava.com/api/v3';
  private static readonly RATE_LIMIT = { requests: 100, window: 900 }; // 100 requests per 15 minutes
  static async exchangeCodeForToken(code: string, clientId: string, clientSecret: string) {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      throw new Error(`Strava auth failed: ${response.statusText}`);
    }

    const data: any = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(data.expires_at * 1000),
      athleteId: data.athlete.id.toString(),
      athlete: this.parseStravaAthlete(data.athlete)
    };
  }
  static async refreshToken(refreshToken: string, clientId: string, clientSecret: string) {
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error(`Strava token refresh failed: ${response.statusText}`);
    }

    const data: any = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(data.expires_at * 1000)
    };
  }
  static async getActivities(accessToken: string, page: number = 1, perPage: number = 30): Promise<Activity[]> {
    const response = await fetch(
      `${this.BASE_URL}/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const activities: any[] = await response.json();
    return activities.map(this.parseStravaActivity);
  }

  static async getActivity(accessToken: string, activityId: string): Promise<Activity> {
    const response = await fetch(
      `${this.BASE_URL}/activities/${activityId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const activity = await response.json();
    return this.parseStravaActivity(activity);
  }

  static async getAthleteProfile(accessToken: string): Promise<AthleteProfile> {
    const response = await fetch(
      `${this.BASE_URL}/athlete`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.statusText}`);
    }

    const athlete = await response.json();
    return this.parseStravaAthlete(athlete);
  }

  private static parseStravaAthlete(athlete: any): AthleteProfile {
    return {
      id: athlete.id.toString(),
      firstName: athlete.firstname || '',
      lastName: athlete.lastname || '',
      gender: athlete.sex === 'M' ? 'male' : athlete.sex === 'F' ? 'female' : 'other',
      weight: athlete.weight,
      ftp: athlete.ftp
    };
  }

  private static parseStravaActivity(activity: any): Activity {
    return {
      externalId: activity.id.toString(),
      provider: 'strava',
      name: activity.name,
      type: this.mapStravaActivityType(activity.type),
      startDate: new Date(activity.start_date),
      durationSeconds: activity.moving_time,
      distanceMeters: activity.distance,
      elevationGainMeters: activity.total_elevation_gain,
      calories: activity.calories,
      averageHeartRate: activity.average_heartrate,
      maxHeartRate: activity.max_heartrate,
      averagePower: activity.average_watts,
      maxPower: activity.max_watts,
      trainingStressScore: activity.suffer_score,
      perceivedExertion: activity.perceived_exertion,
      description: activity.description,
      gear: activity.gear_id,
      rawData: activity
    };
  }

  private static mapStravaActivityType(stravaType: string): Activity['type'] {
    const typeMap: Record<string, Activity['type']> = {
      'Run': 'run',
      'Ride': 'bike',
      'Swim': 'swim',
      'WeightTraining': 'strength',
      'Workout': 'other'
    };
    return typeMap[stravaType] || 'other';
  }
}

// Garmin API Service (Connect IQ)
export class GarminApiService {
  private static readonly BASE_URL = 'https://connectapi.garmin.com';
  static async getActivities(accessToken: string, limit: number = 50): Promise<Activity[]> {
    const response = await fetch(
      `${this.BASE_URL}/fitness-service/activity?limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Garmin API error: ${response.statusText}`);
    }

    const data: any[] = await response.json();
    return data.map(this.parseGarminActivity);
  }

  static async getActivityDetails(accessToken: string, activityId: string): Promise<Activity> {
    const response = await fetch(
      `${this.BASE_URL}/fitness-service/activity/${activityId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Garmin API error: ${response.statusText}`);
    }

    const activity = await response.json();
    return this.parseGarminActivity(activity);
  }

  private static parseGarminActivity(activity: any): Activity {
    return {
      externalId: activity.activityId.toString(),
      provider: 'garmin',
      name: activity.activityName,
      type: this.mapGarminActivityType(activity.activityType?.typeKey),
      startDate: new Date(activity.startTimeLocal),
      durationSeconds: activity.duration,
      distanceMeters: activity.distance,
      elevationGainMeters: activity.elevationGain,
      calories: activity.calories,
      averageHeartRate: activity.averageHR,
      maxHeartRate: activity.maxHR,
      averagePower: activity.avgPower,
      maxPower: activity.maxPower,
      rawData: activity
    };
  }

  private static mapGarminActivityType(garminType: string): Activity['type'] {
    const typeMap: Record<string, Activity['type']> = {
      'running': 'run',
      'cycling': 'bike',
      'swimming': 'swim',
      'strength_training': 'strength'
    };
    return typeMap[garminType] || 'other';
  }
}

// API Integration Manager
export class ApiIntegrationManager {
  private static instance: ApiIntegrationManager;
  private syncInProgress = new Set<string>();

  static getInstance(): ApiIntegrationManager {
    if (!this.instance) {
      this.instance = new ApiIntegrationManager();
    }
    return this.instance;
  }

  async syncUserData(userId: number, provider: string, accessToken: string): Promise<{
    success: boolean;
    activitiesSynced: number;
    error?: string;
  }> {
    const syncKey = `${userId}-${provider}`;
    
    if (this.syncInProgress.has(syncKey)) {
      return { success: false, activitiesSynced: 0, error: 'Sync already in progress' };
    }

    this.syncInProgress.add(syncKey);
    const startTime = Date.now();

    try {
      let activities: Activity[] = [];
      
      switch (provider) {
        case 'strava':
          activities = await StravaApiService.getActivities(accessToken);
          break;
        case 'garmin':
          activities = await GarminApiService.getActivities(accessToken);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Store activities in database
      const activitiesSynced = await this.storeActivities(userId, activities);

      // Log successful sync
      await this.logSync(userId, provider, 'success', {
        activitiesSynced,
        duration: Date.now() - startTime
      });

      return { success: true, activitiesSynced };

    } catch (error) {
      console.error(`Sync failed for user ${userId}, provider ${provider}:`, error);
      
      // Log failed sync
      await this.logSync(userId, provider, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      });

      return { 
        success: false, 
        activitiesSynced: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    } finally {
      this.syncInProgress.delete(syncKey);
    }
  }

  private async storeActivities(userId: number, activities: Activity[]): Promise<number> {
    // This would integrate with your database layer
    // For now, return mock count
    console.log(`Storing ${activities.length} activities for user ${userId}`);
    return activities.length;
  }

  private async logSync(userId: number, provider: string, status: string, details: any): Promise<void> {
    // This would integrate with your database layer
    console.log(`Sync log: User ${userId}, Provider ${provider}, Status ${status}`, details);
  }

  async schedulePeriodicSync(userId: number): Promise<void> {
    // This would set up scheduled syncing
    console.log(`Scheduling periodic sync for user ${userId}`);
  }
}

// Webhook handler for real-time updates
export class WebhookHandler {
  static async handleStravaWebhook(payload: any): Promise<void> {
    if (payload.object_type === 'activity') {
      const { owner_id, object_id, aspect_type } = payload;
      
      if (aspect_type === 'create') {
        // New activity created
        console.log(`New Strava activity ${object_id} for athlete ${owner_id}`);
        // Implement real-time sync logic here
      }
    }
  }

  static async handleGarminWebhook(payload: any): Promise<void> {
    // Implement Garmin webhook handling
    console.log('Garmin webhook received:', payload);
  }
}

// Rate limiting utility
export class RateLimiter {
  private static limits = new Map<string, { count: number; resetTime: number }>();

  static async checkLimit(provider: string, limit: number, windowSeconds: number): Promise<boolean> {
    const key = provider;
    const now = Date.now();
    const current = this.limits.get(key);

    if (!current || now > current.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + (windowSeconds * 1000) });
      return true;
    }

    if (current.count >= limit) {
      return false;
    }

    current.count++;
    return true;
  }

  static getRemainingRequests(provider: string): number {
    const current = this.limits.get(provider);
    return current ? Math.max(0, 100 - current.count) : 100; // Default limit
  }
}
