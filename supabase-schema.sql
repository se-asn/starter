-- Supabase Database Schema für LaufplanerPro
-- Führen Sie diese SQL-Statements in Ihrer Supabase SQL-Konsole aus

-- Enable Row Level Security (RLS)
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Athletes (Benutzer) - Erweitert die auth.users Tabelle
CREATE TABLE athletes (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- External API Connections
CREATE TABLE api_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'strava', 'garmin', 'apple', 'polar', 'wahoo'
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, provider)
);

-- Activities (Trainings from external APIs)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    external_id TEXT, -- ID from external API
    provider TEXT NOT NULL, -- Source: strava, garmin, etc.
    activity_type TEXT NOT NULL, -- swim, bike, run, brick, other
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
    raw_data JSONB, -- Store complete API response
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, external_id, provider)
);

-- Training Plans (AI-generated plans)
CREATE TABLE training_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    plan_type TEXT NOT NULL, -- 'triathlon', 'running', 'cycling', 'swimming'
    target_event TEXT, -- 'sprint', 'olympic', 'half-ironman', '70.3', 'ironman', 'marathon', etc.
    target_date DATE,
    weeks_duration INTEGER,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    is_active BOOLEAN DEFAULT false,
    ai_prompt TEXT, -- Store the original AI generation prompt
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts (Individual training sessions within plans)
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES training_plans(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id), -- Link to completed activity
    workout_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    sport TEXT NOT NULL CHECK (sport IN ('swim', 'bike', 'run', 'brick', 'strength', 'rest')),
    workout_type TEXT NOT NULL, -- 'base', 'build', 'peak', 'recovery', 'test'
    name TEXT NOT NULL,
    description TEXT,
    planned_duration_minutes INTEGER,
    planned_distance_meters REAL,
    planned_intensity TEXT, -- 'easy', 'moderate', 'hard', 'very_hard'
    target_zones JSONB, -- Heart rate zones, power zones, pace zones
    instructions JSONB, -- Structured workout instructions
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    athlete_notes TEXT,
    coach_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync Logs (Track API synchronizations)
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    sync_type TEXT NOT NULL, -- 'activities', 'profile', 'full'
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'partial')),
    records_processed INTEGER DEFAULT 0,
    error_message TEXT,
    sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sync_completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athlete performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    weight_kg REAL,
    resting_hr INTEGER,
    hrv_score REAL, -- Heart Rate Variability
    sleep_hours REAL,
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10),
    motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
    soreness_level INTEGER CHECK (soreness_level BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, metric_date)
);

-- Indexes for better performance
CREATE INDEX idx_athletes_email ON athletes(email);
CREATE INDEX idx_api_connections_athlete_provider ON api_connections(athlete_id, provider);
CREATE INDEX idx_activities_athlete_start_time ON activities(athlete_id, start_time DESC);
CREATE INDEX idx_activities_provider_external_id ON activities(provider, external_id);
CREATE INDEX idx_training_plans_athlete_active ON training_plans(athlete_id, is_active);
CREATE INDEX idx_workouts_plan_date ON workouts(plan_id, workout_date);
CREATE INDEX idx_workouts_athlete_date ON workouts(athlete_id, workout_date);
CREATE INDEX idx_sync_logs_athlete_created ON sync_logs(athlete_id, created_at DESC);
CREATE INDEX idx_performance_metrics_athlete_date ON performance_metrics(athlete_id, metric_date DESC);

-- Row Level Security (RLS) Policies

-- Athletes: Users can only access their own data
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own athlete profile" ON athletes
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own athlete profile" ON athletes
    FOR UPDATE USING (auth.uid() = id);

-- API Connections: Users can only access their own connections
ALTER TABLE api_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own API connections" ON api_connections
    FOR ALL USING (auth.uid() = athlete_id);

-- Activities: Users can only access their own activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own activities" ON activities
    FOR ALL USING (auth.uid() = athlete_id);

-- Training Plans: Users can only access their own plans
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own training plans" ON training_plans
    FOR ALL USING (auth.uid() = athlete_id);

-- Workouts: Users can only access their own workouts
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own workouts" ON workouts
    FOR ALL USING (auth.uid() = athlete_id);

-- Sync Logs: Users can only access their own sync logs
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sync logs" ON sync_logs
    FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "System can create sync logs" ON sync_logs
    FOR INSERT WITH CHECK (true);

-- Performance Metrics: Users can only access their own metrics
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own performance metrics" ON performance_metrics
    FOR ALL USING (auth.uid() = athlete_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON athletes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_plans_updated_at BEFORE UPDATE ON training_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create athlete profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.athletes (id, email, name, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create athlete profile on user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
