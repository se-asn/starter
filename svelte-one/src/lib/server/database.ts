// Database utilities für Cloudflare D1
// src/lib/server/database.ts

export interface DatabaseEnv {
  DB: D1Database;
}

// Athlete Management
export class AthleteService {
  constructor(private db: D1Database) {}
  
  async createAthlete(data: {
    id: string;
    email: string;
    passwordHash: string;
    firstName?: string;
    lastName?: string;
  }) {
    return await this.db.prepare(`
      INSERT INTO athletes (id, email, password_hash, first_name, last_name, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      data.id,
      data.email,
      data.passwordHash,
      data.firstName || null,
      data.lastName || null,
      new Date().toISOString()
    ).run();
  }
  
  async getAthleteByEmail(email: string) {
    return await this.db.prepare(`
      SELECT * FROM athletes WHERE email = ?
    `).bind(email).first();
  }
  
  async updateAthleteMetrics(athleteId: string, metrics: {
    weightKg?: number;
    ftpWatts?: number;
    thresholdPace?: string;
    maxHr?: number;
    restingHr?: number;
  }) {
    const updates = [];
    const values = [];
    
    if (metrics.weightKg) {
      updates.push('weight_kg = ?');
      values.push(metrics.weightKg);
    }
    if (metrics.ftpWatts) {
      updates.push('ftp_watts = ?');
      values.push(metrics.ftpWatts);
    }
    if (metrics.thresholdPace) {
      updates.push('threshold_pace_per_km = ?');
      values.push(metrics.thresholdPace);
    }
    if (metrics.maxHr) {
      updates.push('max_hr = ?');
      values.push(metrics.maxHr);
    }
    if (metrics.restingHr) {
      updates.push('resting_hr = ?');
      values.push(metrics.restingHr);
    }
    
    if (updates.length === 0) return;
    
    values.push(new Date().toISOString(), athleteId);
    
    return await this.db.prepare(`
      UPDATE athletes 
      SET ${updates.join(', ')}, updated_at = ?
      WHERE id = ?
    `).bind(...values).run();
  }
}

// API Connection Management
export class APIConnectionService {
  constructor(private db: D1Database) {}
  
  async saveConnection(data: {
    athleteId: string;
    provider: string;
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    scope?: string;
  }) {
    return await this.db.prepare(`
      INSERT OR REPLACE INTO api_connections 
      (id, athlete_id, provider, access_token, refresh_token, expires_at, scope, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      data.athleteId,
      data.provider,
      data.accessToken,
      data.refreshToken || null,
      data.expiresAt || null,
      data.scope || null,
      true,
      new Date().toISOString()
    ).run();
  }
  
  async getConnection(athleteId: string, provider: string) {
    return await this.db.prepare(`
      SELECT * FROM api_connections 
      WHERE athlete_id = ? AND provider = ? AND is_active = true
    `).bind(athleteId, provider).first();
  }
  
  async refreshToken(connectionId: string, newAccessToken: string, expiresAt: string) {
    return await this.db.prepare(`
      UPDATE api_connections 
      SET access_token = ?, expires_at = ?, last_sync = ?
      WHERE id = ?
    `).bind(newAccessToken, expiresAt, new Date().toISOString(), connectionId).run();
  }
}

// Activity Data Management
export class ActivityService {
  constructor(private db: D1Database) {}
  
  async saveActivity(data: {
    athleteId: string;
    externalId: string;
    provider: string;
    activityType: string;
    name: string;
    startTime: string;
    durationSeconds?: number;
    distanceMeters?: number;
    averageHeartRate?: number;
    maxHeartRate?: number;
    averagePowerWatts?: number;
    calories?: number;
    rawData: string;
  }) {
    return await this.db.prepare(`
      INSERT OR REPLACE INTO activities 
      (id, athlete_id, external_id, provider, activity_type, name, start_time, 
       duration_seconds, distance_meters, average_heart_rate, max_heart_rate, 
       average_power_watts, calories, raw_data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      data.athleteId,
      data.externalId,
      data.provider,
      data.activityType,
      data.name,
      data.startTime,
      data.durationSeconds || null,
      data.distanceMeters || null,
      data.averageHeartRate || null,
      data.maxHeartRate || null,
      data.averagePowerWatts || null,
      data.calories || null,
      data.rawData,
      new Date().toISOString()
    ).run();
  }
  
  async getRecentActivities(athleteId: string, limit = 20) {
    return await this.db.prepare(`
      SELECT * FROM activities 
      WHERE athlete_id = ? 
      ORDER BY start_time DESC 
      LIMIT ?
    `).bind(athleteId, limit).all();
  }
  
  async getActivityStats(athleteId: string, days = 30) {
    return await this.db.prepare(`
      SELECT 
        activity_type,
        COUNT(*) as count,
        SUM(distance_meters) as total_distance,
        SUM(duration_seconds) as total_time,
        AVG(average_heart_rate) as avg_hr
      FROM activities 
      WHERE athlete_id = ? AND start_time > datetime('now', '-${days} days')
      GROUP BY activity_type
    `).bind(athleteId).all();
  }
}

// Sync Logging
export class SyncLogService {
  constructor(private db: D1Database) {}
  
  async logSync(data: {
    athleteId: string;
    provider: string;
    syncType: string;
    status: 'success' | 'error' | 'partial';
    recordsProcessed?: number;
    errorMessage?: string;
    syncStartedAt: string;
  }) {
    return await this.db.prepare(`
      INSERT INTO sync_logs 
      (id, athlete_id, provider, sync_type, status, records_processed, error_message, 
       sync_started_at, sync_completed_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      data.athleteId,
      data.provider,
      data.syncType,
      data.status,
      data.recordsProcessed || 0,
      data.errorMessage || null,
      data.syncStartedAt,
      new Date().toISOString(),
      new Date().toISOString()
    ).run();
  }
}
