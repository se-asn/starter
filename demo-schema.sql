-- Demo-friendly Supabase Schema für LaufplanerPro
-- Diese Version erstellt Tabellen ohne auth.users Constraint für Demo-Zwecke

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Athletes (Demo-Version ohne auth.users Constraint)
CREATE TABLE IF NOT EXISTS athletes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    weight_kg REAL,
    height_cm REAL,
    ftp_watts INTEGER,
    threshold_pace_per_km TEXT,
    css_pace_per_100m TEXT,
    max_hr INTEGER,
    resting_hr INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    external_id TEXT,
    provider TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    name TEXT,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER,
    distance_meters REAL,
    elevation_gain_meters REAL,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    average_power_watts REAL,
    max_power_watts REAL,
    normalized_power_watts REAL,
    calories INTEGER,
    average_cadence REAL,
    max_cadence REAL,
    training_stress_score REAL,
    intensity_factor REAL,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, external_id, provider)
);

-- Training Plans
CREATE TABLE IF NOT EXISTS training_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    plan_type TEXT NOT NULL,
    target_event TEXT,
    target_date DATE,
    weeks_duration INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    is_active BOOLEAN DEFAULT false,
    ai_prompt TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id),
    workout_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    sport TEXT NOT NULL CHECK (sport IN ('swim', 'bike', 'run', 'brick', 'strength', 'rest')),
    workout_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    planned_duration_minutes INTEGER,
    planned_distance_meters REAL,
    planned_intensity TEXT,
    instructions JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration_minutes INTEGER,
    actual_distance_meters REAL,
    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    weight_kg REAL,
    resting_hr INTEGER,
    hrv_score REAL,
    sleep_hours REAL,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10),
    motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
    soreness_level INTEGER CHECK (soreness_level BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, metric_date)
);

-- API Connections
CREATE TABLE IF NOT EXISTS api_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, provider)
);

-- Enable Row Level Security (optional for demo)
-- ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE api_connections ENABLE ROW LEVEL SECURITY;
