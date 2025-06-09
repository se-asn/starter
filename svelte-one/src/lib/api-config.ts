// API Configuration für External Integrations
// Triathlon Coach App - External API Endpoints

export const API_PROVIDERS = {
  STRAVA: {
    name: 'Strava',
    baseUrl: 'https://www.strava.com/api/v3',
    authUrl: 'https://www.strava.com/oauth/authorize',
    tokenUrl: 'https://www.strava.com/oauth/token',
    scopes: ['read,activity:read_all,profile:read_all'],
    activities: '/athlete/activities',
    athlete: '/athlete',
    segments: '/segments/starred'
  },
  
  GARMIN: {
    name: 'Garmin Connect IQ',
    baseUrl: 'https://connectapi.garmin.com',
    authUrl: 'https://connect.garmin.com/oauthConfirm',
    tokenUrl: 'https://connectapi.garmin.com/oauth-service/oauth/access_token',
    scopes: ['read'],
    activities: '/wellness-service/wellness/dailies',
    athlete: '/userprofile-service/userprofile'
  },
  
  POLAR: {
    name: 'Polar Flow',
    baseUrl: 'https://www.polaraccesslink.com/v3',
    authUrl: 'https://flow.polar.com/oauth2/authorization',
    tokenUrl: 'https://polarremote.com/v2/oauth2/token',
    scopes: ['accesslink.read_all'],
    activities: '/exercises',
    athlete: '/users'
  },
  
  WAHOO: {
    name: 'Wahoo Cloud',
    baseUrl: 'https://api.wahooligan.com/v1',
    authUrl: 'https://api.wahooligan.com/oauth/authorize',
    tokenUrl: 'https://api.wahooligan.com/oauth/token',
    scopes: ['workouts:read,user:read'],
    activities: '/workouts',
    athlete: '/user'
  },
  
  APPLE_HEALTH: {
    name: 'Apple HealthKit',
    // Note: Apple HealthKit requires iOS app, we'll use HealthKit REST proxy
    baseUrl: 'https://healthkit-proxy.vercel.app/api', // Custom proxy needed
    scopes: ['fitness,workouts'],
    activities: '/workouts',
    metrics: '/health-data'
  },
  
  TRAININGPEAKS: {
    name: 'TrainingPeaks',
    baseUrl: 'https://api.trainingpeaks.com/v1',
    authUrl: 'https://api.trainingpeaks.com/oauth/authorize',
    tokenUrl: 'https://api.trainingpeaks.com/oauth/token',
    scopes: ['read:athlete,read:workouts'],
    activities: '/athlete/workouts',
    athlete: '/athlete'
  }
};

// Activity Type Mapping (verschiedene APIs nutzen verschiedene Namen)
export const ACTIVITY_TYPE_MAPPING = {
  // Strava -> Unified
  'Swim': 'swim',
  'Ride': 'bike', 
  'Run': 'run',
  'Workout': 'other',
  
  // Garmin -> Unified
  'swimming': 'swim',
  'cycling': 'bike',
  'running': 'run',
  'multi_sport': 'brick',
  
  // Polar -> Unified
  'SWIMMING': 'swim',
  'CYCLING': 'bike', 
  'RUNNING': 'run',
  'OTHER': 'other'
};

// Rate Limits für APIs (requests per hour)
export const RATE_LIMITS = {
  STRAVA: 1000,      // 1000/15min
  GARMIN: 10000,     // 10k/day
  POLAR: 1000,       // 1000/hour
  WAHOO: 5000,       // 5k/hour
  TRAININGPEAKS: 300 // 300/hour
};

// Sync Intervals (wie oft sollen Daten geholt werden)
export const SYNC_INTERVALS = {
  ACTIVITIES: 15,    // minutes
  PROFILE: 60,       // minutes  
  PERFORMANCE: 1440  // minutes (daily)
};
