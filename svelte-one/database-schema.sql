-- Triathlon Coach App - Database Schema
-- Cloudflare D1 Database für Triathlon Training & Performance Tracking

-- Athletes (Benutzer)
CREATE TABLE athletes (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL, -- Full name for display
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    weight_kg REAL,
    height_cm REAL,
    ftp_watts INTEGER, -- Functional Threshold Power (Cycling)
    threshold_pace_per_km TEXT, -- Running threshold pace
    css_pace_per_100m TEXT, -- Critical Swim Speed
    max_hr INTEGER,
    resting_hr INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- External API Connections
CREATE TABLE api_connections (
    id TEXT PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    provider TEXT NOT NULL, -- 'strava', 'garmin', 'apple', 'polar', 'wahoo'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at DATETIME,
    scope TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Activities (Trainings from external APIs)
CREATE TABLE activities (
    id TEXT PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    external_id TEXT, -- ID from external API
    provider TEXT NOT NULL, -- Source: strava, garmin, etc.
    activity_type TEXT NOT NULL, -- swim, bike, run, brick, other
    name TEXT,
    description TEXT,
    start_time DATETIME NOT NULL,
    duration_seconds INTEGER,
    distance_meters REAL,
    elevation_gain_meters REAL,
    average_speed_mps REAL, -- meters per second
    max_speed_mps REAL,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    average_power_watts INTEGER, -- for cycling
    max_power_watts INTEGER,
    normalized_power_watts INTEGER,
    tss REAL, -- Training Stress Score
    calories INTEGER,
    perceived_effort INTEGER CHECK (perceived_effort BETWEEN 1 AND 10),
    weather_temp_c REAL,
    weather_condition TEXT,
    gear_id TEXT, -- bike, shoes, etc.
    raw_data TEXT, -- JSON with full API response
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Training Plans
CREATE TABLE training_plans (
    id TEXT PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    plan_type TEXT NOT NULL, -- 'sprint', 'olympic', 'half_ironman', 'ironman', 'custom'
    target_race_date DATE,
    weeks_duration INTEGER,
    current_week INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Planned Workouts
CREATE TABLE planned_workouts (
    id TEXT PRIMARY KEY,
    training_plan_id TEXT NOT NULL,
    week_number INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL, -- 1=Monday, 7=Sunday
    workout_type TEXT NOT NULL, -- swim, bike, run, brick, rest
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    distance_meters REAL,
    intensity_zone TEXT, -- z1, z2, z3, z4, z5
    target_pace_per_km TEXT,
    target_power_watts INTEGER,
    target_hr_zone TEXT,
    notes TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_activity_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (training_plan_id) REFERENCES training_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_activity_id) REFERENCES activities(id)
);

-- Performance Metrics (calculated from activities)
CREATE TABLE performance_metrics (
    id TEXT PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    metric_date DATE NOT NULL,
    metric_type TEXT NOT NULL, -- 'fitness', 'fatigue', 'form', 'weekly_tss'
    value REAL NOT NULL,
    sport TEXT, -- swim, bike, run, overall
    calculation_method TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Race Results
CREATE TABLE race_results (
    id TEXT PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    race_name TEXT NOT NULL,
    race_date DATE NOT NULL,
    race_type TEXT NOT NULL, -- sprint, olympic, half_ironman, ironman
    swim_time_seconds INTEGER,
    t1_time_seconds INTEGER,
    bike_time_seconds INTEGER,
    t2_time_seconds INTEGER,
    run_time_seconds INTEGER,
    total_time_seconds INTEGER,
    overall_place INTEGER,
    age_group_place INTEGER,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Sync Logs (für API debugging)
CREATE TABLE sync_logs (
    id TEXT PRIMARY KEY,
    athlete_id TEXT NOT NULL,
    provider TEXT NOT NULL,
    sync_type TEXT NOT NULL, -- 'activities', 'profile', 'gear'
    status TEXT NOT NULL, -- 'success', 'error', 'partial'
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    sync_started_at DATETIME NOT NULL,
    sync_completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id) ON DELETE CASCADE
);

-- Indices für Performance
CREATE INDEX idx_activities_athlete_date ON activities(athlete_id, start_time);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_api_connections_athlete ON api_connections(athlete_id);
CREATE INDEX idx_planned_workouts_plan ON planned_workouts(training_plan_id);
CREATE INDEX idx_performance_metrics_athlete_date ON performance_metrics(athlete_id, metric_date);
CREATE INDEX idx_sync_logs_athlete ON sync_logs(athlete_id, provider);
