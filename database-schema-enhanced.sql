-- Smart Triathlete Database Schema - Complete System
-- Enhanced system for athlete data, API integrations, and AI-powered training

-- Users/Athletes table (Enhanced)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE,
    gender TEXT CHECK(gender IN ('male', 'female', 'other')),
    height_cm INTEGER,
    weight_kg REAL,
    ftp_watts INTEGER, -- Functional Threshold Power
    max_heart_rate INTEGER,
    resting_heart_rate INTEGER,
    vo2_max REAL,
    lactate_threshold_hr INTEGER,
    swim_css_pace REAL, -- Critical Swim Speed (seconds per 100m)
    run_threshold_pace REAL, -- seconds per km
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    units TEXT DEFAULT 'metric' CHECK(units IN ('metric', 'imperial')),
    coach_notes TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- API Integrations table (Enhanced)
CREATE TABLE IF NOT EXISTS api_integrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    provider TEXT NOT NULL CHECK(provider IN ('strava', 'garmin', 'polar', 'wahoo', 'zwift', 'trainingpeaks', 'apple_health', 'fitbit')),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at DATETIME,
    athlete_id TEXT, -- External athlete ID from provider
    webhook_subscription_id TEXT, -- For real-time updates
    last_sync_at DATETIME,
    sync_frequency_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT 1,
    sync_settings TEXT, -- JSON with sync preferences
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, provider)
);

-- Activities table (Enhanced with more metrics)
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    external_id TEXT, -- ID from external provider
    provider TEXT NOT NULL CHECK(provider IN ('strava', 'garmin', 'polar', 'wahoo', 'zwift', 'trainingpeaks', 'manual')),
    activity_type TEXT NOT NULL CHECK(activity_type IN ('swim', 'bike', 'run', 'brick', 'strength', 'yoga', 'other')),
    name TEXT NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    duration_seconds INTEGER NOT NULL,
    distance_meters REAL,
    elevation_gain_meters REAL,
    calories INTEGER,
    
    -- Heart Rate Metrics
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    heart_rate_zones TEXT, -- JSON array with time in each zone
    
    -- Power Metrics (Cycling)
    average_power INTEGER,
    max_power INTEGER,
    normalized_power INTEGER,
    power_zones TEXT, -- JSON array with time in each zone
    
    -- Pace/Speed Metrics
    average_cadence INTEGER,
    average_speed_mps REAL,
    max_speed_mps REAL,
    pace_zones TEXT, -- JSON array with time in each pace zone
    
    -- Training Load Metrics
    training_stress_score REAL,
    intensity_factor REAL,
    chronic_training_load REAL,
    acute_training_load REAL,
    
    -- Environmental Data
    perceived_exertion INTEGER CHECK(perceived_exertion BETWEEN 1 AND 10),
    weather_conditions TEXT,
    temperature_celsius REAL,
    humidity_percent INTEGER,
    wind_speed_kmh REAL,
    
    -- Equipment & Technical
    gear_used TEXT,
    device_name TEXT,
    file_format TEXT, -- tcx, fit, gpx, etc.
    
    -- Analysis & Notes
    notes TEXT,
    coach_feedback TEXT,
    ai_analysis TEXT, -- JSON with AI-generated insights
    tags TEXT, -- JSON array of tags
    
    -- Swim-specific metrics
    swim_stroke_type TEXT CHECK(swim_stroke_type IN ('freestyle', 'backstroke', 'breaststroke', 'butterfly', 'mixed')),
    swim_strokes_per_length INTEGER,
    swim_pool_length_meters INTEGER,
    
    -- Run-specific metrics
    run_cadence_spm INTEGER,
    run_vertical_oscillation_cm REAL,
    run_ground_contact_time_ms INTEGER,
    
    -- Bike-specific metrics
    bike_left_right_balance REAL,
    bike_average_temperature_c REAL,
    
    is_race BOOLEAN DEFAULT 0,
    is_brick_workout BOOLEAN DEFAULT 0,
    workout_type TEXT, -- interval, endurance, recovery, etc.
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Training Plans table (Enhanced)
CREATE TABLE IF NOT EXISTS training_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    goal_type TEXT CHECK(goal_type IN ('sprint', 'olympic', 'half_ironman', 'ironman', '5k', '10k', 'half_marathon', 'marathon', 'custom')),
    target_race_date DATE,
    weeks_duration INTEGER NOT NULL,
    current_week INTEGER DEFAULT 1,
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    weekly_hours_target REAL,
    weekly_tss_target REAL,
    periodization_type TEXT CHECK(periodization_type IN ('linear', 'block', 'reverse', 'polarized')),
    
    -- AI Configuration
    ai_generated BOOLEAN DEFAULT 0,
    ai_model_version TEXT,
    ai_confidence_score REAL,
    auto_adjust BOOLEAN DEFAULT 1,
    
    -- Plan Metrics
    total_swim_hours REAL DEFAULT 0,
    total_bike_hours REAL DEFAULT 0,
    total_run_hours REAL DEFAULT 0,
    total_strength_hours REAL DEFAULT 0,
    
    is_active BOOLEAN DEFAULT 1,
    created_by TEXT DEFAULT 'manual',
    template_id INTEGER, -- Reference to plan template
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Training Sessions table (Enhanced)
CREATE TABLE IF NOT EXISTS training_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    training_plan_id INTEGER NOT NULL,
    week_number INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 1 AND 7),
    session_type TEXT NOT NULL CHECK(session_type IN ('swim', 'bike', 'run', 'brick', 'strength', 'yoga', 'rest')),
    name TEXT NOT NULL,
    description TEXT,
    
    -- Targets
    duration_minutes INTEGER,
    distance_target REAL,
    tss_target REAL,
    
    -- Intensity Zones
    intensity_zone TEXT CHECK(intensity_zone IN ('recovery', 'aerobic', 'tempo', 'threshold', 'vo2max', 'neuromuscular')),
    power_target_watts INTEGER,
    power_range_min INTEGER,
    power_range_max INTEGER,
    heart_rate_zones TEXT, -- JSON with HR zones and durations
    pace_targets TEXT, -- JSON with pace targets and durations
    
    -- Workout Structure
    workout_structure TEXT, -- JSON with detailed workout intervals
    warmup_duration INTEGER,
    main_set_duration INTEGER,
    cooldown_duration INTEGER,
    
    -- Equipment & Environment
    equipment_needed TEXT,
    location_type TEXT CHECK(location_type IN ('indoor', 'outdoor', 'pool', 'track', 'road', 'trail')),
    weather_dependent BOOLEAN DEFAULT 0,
    
    -- Completion Status
    is_completed BOOLEAN DEFAULT 0,
    completed_at DATETIME,
    actual_activity_id INTEGER,
    completion_rating INTEGER CHECK(completion_rating BETWEEN 1 AND 5),
    
    -- Coach & AI
    coach_notes TEXT,
    ai_adaptations TEXT, -- JSON with AI-suggested modifications
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (training_plan_id) REFERENCES training_plans (id) ON DELETE CASCADE,
    FOREIGN KEY (actual_activity_id) REFERENCES activities (id)
);

-- Performance Metrics table (AI analysis)
CREATE TABLE IF NOT EXISTS performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    
    -- Fitness Metrics
    fitness_score REAL, -- CTL (Chronic Training Load)
    fatigue_score REAL, -- ATL (Acute Training Load)
    form_score REAL, -- TSB (Training Stress Balance)
    
    -- Performance Estimates
    vo2_max_estimate REAL,
    ftp_estimate INTEGER,
    swim_css_estimate REAL, -- Critical Swim Speed
    run_threshold_pace_estimate REAL,
    
    -- Sport-specific metrics
    swim_efficiency_score REAL,
    bike_efficiency_score REAL,
    run_efficiency_score REAL,
    
    -- Training Load
    weekly_training_load REAL,
    monthly_training_load REAL,
    ramp_rate REAL, -- Week-over-week load change
    
    -- Risk Assessment
    injury_risk_score REAL CHECK(injury_risk_score BETWEEN 0 AND 1),
    overtraining_risk REAL CHECK(overtraining_risk BETWEEN 0 AND 1),
    readiness_score REAL CHECK(readiness_score BETWEEN 0 AND 1),
    
    -- Recovery Metrics
    hrv_score REAL, -- Heart Rate Variability
    sleep_quality_score REAL,
    stress_level REAL,
    
    calculated_by TEXT DEFAULT 'ai_analysis',
    model_version TEXT,
    confidence_score REAL,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, metric_date)
);

-- AI Training Recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recommendation_type TEXT CHECK(recommendation_type IN ('workout', 'recovery', 'nutrition', 'equipment', 'race_strategy', 'technique', 'periodization')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- AI Metrics
    confidence_score REAL CHECK(confidence_score BETWEEN 0 AND 1),
    model_version TEXT,
    based_on_data TEXT, -- JSON string with data sources
    
    -- Action Items
    action_required TEXT,
    estimated_impact TEXT,
    time_to_implement TEXT,
    
    -- Lifecycle
    expires_at DATETIME,
    is_acknowledged BOOLEAN DEFAULT 0,
    acknowledged_at DATETIME,
    is_implemented BOOLEAN DEFAULT 0,
    implemented_at DATETIME,
    implementation_notes TEXT,
    
    -- Feedback
    user_rating INTEGER CHECK(user_rating BETWEEN 1 AND 5),
    user_feedback TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- API Sync Log table (Enhanced)
CREATE TABLE IF NOT EXISTS api_sync_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    provider TEXT NOT NULL,
    sync_type TEXT CHECK(sync_type IN ('activities', 'profile', 'gear', 'segments', 'routes', 'achievements')),
    
    -- Sync Results
    activities_synced INTEGER DEFAULT 0,
    new_activities INTEGER DEFAULT 0,
    updated_activities INTEGER DEFAULT 0,
    last_activity_date DATETIME,
    
    -- Status & Performance
    status TEXT CHECK(status IN ('started', 'success', 'partial', 'failed', 'cancelled')),
    error_message TEXT,
    error_code TEXT,
    sync_duration_ms INTEGER,
    
    -- Rate Limiting
    api_calls_made INTEGER DEFAULT 0,
    rate_limit_remaining INTEGER,
    rate_limit_reset_at DATETIME,
    
    -- Metadata
    sync_trigger TEXT CHECK(sync_trigger IN ('manual', 'scheduled', 'webhook', 'startup')),
    batch_id TEXT, -- Group related sync operations
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Race Results table (Enhanced)
CREATE TABLE IF NOT EXISTS race_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    race_name TEXT NOT NULL,
    race_date DATE NOT NULL,
    race_type TEXT CHECK(race_type IN ('sprint', 'olympic', 'half_ironman', 'ironman', '5k', '10k', 'half_marathon', 'marathon', 'other')),
    race_distance_swim_m REAL,
    race_distance_bike_m REAL,
    race_distance_run_m REAL,
    
    -- Split Times
    time_swim_seconds INTEGER,
    time_bike_seconds INTEGER,
    time_run_seconds INTEGER,
    time_transition1_seconds INTEGER,
    time_transition2_seconds INTEGER,
    total_time_seconds INTEGER NOT NULL,
    
    -- Rankings
    overall_rank INTEGER,
    gender_rank INTEGER,
    age_group_rank INTEGER,
    age_group TEXT,
    total_participants INTEGER,
    
    -- Performance Metrics
    average_swim_pace_per_100m REAL,
    average_bike_power INTEGER,
    average_bike_speed_kmh REAL,
    average_run_pace_per_km REAL,
    
    -- Environment
    weather_conditions TEXT,
    temperature_celsius REAL,
    course_difficulty TEXT,
    
    -- Goals & Analysis
    goal_time_seconds INTEGER,
    goal_achieved BOOLEAN,
    performance_rating INTEGER CHECK(performance_rating BETWEEN 1 AND 10),
    notes TEXT,
    lessons_learned TEXT,
    
    -- External Links
    strava_activity_id TEXT,
    official_results_url TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Gear/Equipment table (Enhanced)
CREATE TABLE IF NOT EXISTS gear (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    gear_type TEXT CHECK(gear_type IN ('bike', 'shoes_run', 'shoes_bike', 'wetsuit', 'watch', 'helmet', 'wheels', 'other')),
    brand TEXT,
    model TEXT,
    purchase_date DATE,
    purchase_price REAL,
    
    -- Usage Tracking
    total_distance_meters REAL DEFAULT 0,
    total_time_seconds INTEGER DEFAULT 0,
    total_activities INTEGER DEFAULT 0,
    
    -- Maintenance
    last_service_date DATE,
    next_service_due_km REAL,
    service_notes TEXT,
    
    -- Status
    is_retired BOOLEAN DEFAULT 0,
    retirement_date DATE,
    replacement_gear_id INTEGER,
    
    -- Specifications
    weight_grams INTEGER,
    specifications TEXT, -- JSON with detailed specs
    
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (replacement_gear_id) REFERENCES gear (id)
);

-- Wellness Data table (for recovery tracking)
CREATE TABLE IF NOT EXISTS wellness_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    
    -- Sleep Metrics
    sleep_duration_hours REAL,
    sleep_quality_score INTEGER CHECK(sleep_quality_score BETWEEN 1 AND 10),
    sleep_deep_hours REAL,
    sleep_rem_hours REAL,
    
    -- Recovery Metrics
    resting_heart_rate INTEGER,
    hrv_score REAL,
    recovery_score INTEGER CHECK(recovery_score BETWEEN 1 AND 100),
    
    -- Subjective Measures
    energy_level INTEGER CHECK(energy_level BETWEEN 1 AND 10),
    motivation_level INTEGER CHECK(motivation_level BETWEEN 1 AND 10),
    stress_level INTEGER CHECK(stress_level BETWEEN 1 AND 10),
    muscle_soreness INTEGER CHECK(muscle_soreness BETWEEN 1 AND 10),
    
    -- Body Metrics
    weight_kg REAL,
    body_fat_percent REAL,
    
    -- Health Indicators
    rpe_yesterday INTEGER CHECK(rpe_yesterday BETWEEN 1 AND 10),
    illness_severity INTEGER CHECK(illness_severity BETWEEN 0 AND 5),
    injury_status TEXT,
    
    -- External Data Sources
    data_source TEXT, -- manual, garmin, oura, whoop, etc.
    
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, date)
);

-- Nutrition Data table
CREATE TABLE IF NOT EXISTS nutrition_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date DATE NOT NULL,
    
    -- Macronutrients
    calories_total INTEGER,
    protein_grams REAL,
    carbs_grams REAL,
    fat_grams REAL,
    fiber_grams REAL,
    sugar_grams REAL,
    
    -- Hydration
    water_liters REAL,
    
    -- Timing
    pre_workout_nutrition TEXT,
    during_workout_nutrition TEXT,
    post_workout_nutrition TEXT,
    
    -- Supplements
    supplements_taken TEXT, -- JSON array
    
    -- Subjective
    energy_rating INTEGER CHECK(energy_rating BETWEEN 1 AND 10),
    digestion_rating INTEGER CHECK(digestion_rating BETWEEN 1 AND 10),
    
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE(user_id, date)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, start_date);
CREATE INDEX IF NOT EXISTS idx_activities_external ON activities(external_id, provider);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_training_sessions_plan ON training_sessions(training_plan_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_week_day ON training_sessions(week_number, day_of_week);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_date ON performance_metrics(user_id, metric_date);
CREATE INDEX IF NOT EXISTS idx_api_integrations_user ON api_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_api_sync_log_user_date ON api_sync_log(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user ON ai_recommendations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_wellness_data_user_date ON wellness_data(user_id, date);
CREATE INDEX IF NOT EXISTS idx_race_results_user_date ON race_results(user_id, race_date);

-- Sample data for testing
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, birth_date, gender, height_cm, weight_kg, ftp_watts, max_heart_rate, resting_heart_rate) 
VALUES (1, 'test@smarttriathlete.com', '$2b$10$example', 'Test', 'Athlete', '1990-01-01', 'male', 180, 75, 250, 190, 50);

-- Sample API integration
INSERT OR IGNORE INTO api_integrations (user_id, provider, access_token, athlete_id, is_active)
VALUES (1, 'strava', 'sample_token', 'strava_123', 1);

-- Sample training plan
INSERT OR IGNORE INTO training_plans (id, user_id, name, description, goal_type, target_race_date, weeks_duration, difficulty_level, weekly_hours_target)
VALUES (1, 1, 'Olympic Triathlon Plan', 'AI-generated 16-week plan for Olympic distance', 'olympic', '2025-08-15', 16, 'intermediate', 8.5);

-- Sample training sessions
INSERT OR IGNORE INTO training_sessions (training_plan_id, week_number, day_of_week, session_type, name, description, duration_minutes, intensity_zone)
VALUES 
(1, 1, 1, 'swim', 'Base Endurance Swim', 'Easy aerobic swim focusing on technique', 45, 'aerobic'),
(1, 1, 2, 'bike', 'Base Endurance Ride', 'Steady aerobic ride with good form', 90, 'aerobic'),
(1, 1, 3, 'run', 'Base Endurance Run', 'Comfortable pace run', 60, 'aerobic');
