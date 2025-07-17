-- LaufplanerPro - Production-Ready Database Schema
-- Professional Supabase Setup with RLS, Triggers, and Indexes
-- Execute this in your Supabase SQL Console

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ========================================
-- CORE TABLES WITH PROPER CONSTRAINTS
-- ========================================

-- Athletes Table (extends auth.users)
CREATE TABLE public.athletes (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    weight_kg REAL CHECK (weight_kg > 0 AND weight_kg < 300),
    height_cm REAL CHECK (height_cm > 0 AND height_cm < 300),
    ftp_watts INTEGER CHECK (ftp_watts > 0),
    threshold_pace_per_km TEXT,
    css_pace_per_100m TEXT,
    max_hr INTEGER CHECK (max_hr > 0 AND max_hr < 250),
    resting_hr INTEGER CHECK (resting_hr > 0 AND resting_hr < 150),
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    units_system TEXT DEFAULT 'metric' CHECK (units_system IN ('metric', 'imperial')),
    privacy_level TEXT DEFAULT 'private' CHECK (privacy_level IN ('public', 'friends', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities Table
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    external_id TEXT,
    provider TEXT NOT NULL CHECK (provider IN ('strava', 'garmin', 'polar', 'wahoo', 'apple', 'demo', 'manual')),
    activity_type TEXT NOT NULL CHECK (activity_type IN ('swim', 'bike', 'run', 'brick', 'strength', 'other')),
    name TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER CHECK (duration_seconds > 0),
    distance_meters REAL CHECK (distance_meters >= 0),
    elevation_gain_meters REAL CHECK (elevation_gain_meters >= 0),
    average_heart_rate INTEGER CHECK (average_heart_rate > 0 AND average_heart_rate < 250),
    max_heart_rate INTEGER CHECK (max_heart_rate > 0 AND max_heart_rate < 250),
    average_power_watts REAL CHECK (average_power_watts >= 0),
    max_power_watts REAL CHECK (max_power_watts >= 0),
    normalized_power_watts REAL CHECK (normalized_power_watts >= 0),
    calories INTEGER CHECK (calories >= 0),
    average_cadence REAL CHECK (average_cadence >= 0),
    max_cadence REAL CHECK (max_cadence >= 0),
    training_stress_score REAL CHECK (training_stress_score >= 0),
    intensity_factor REAL CHECK (intensity_factor >= 0 AND intensity_factor <= 2.0),
    average_pace_per_km TEXT,
    best_pace_per_km TEXT,
    lap_data JSONB,
    raw_data JSONB,
    gear_id TEXT,
    weather_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, external_id, provider)
);

-- Training Plans Table
CREATE TABLE public.training_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    plan_type TEXT NOT NULL CHECK (plan_type IN ('triathlon', 'running', 'cycling', 'swimming')),
    target_event TEXT CHECK (target_event IN ('sprint', 'olympic', 'half-ironman', '70.3', 'ironman', 'marathon', 'half-marathon', '10k', '5k')),
    target_date DATE,
    start_date DATE DEFAULT CURRENT_DATE,
    weeks_duration INTEGER CHECK (weeks_duration > 0 AND weeks_duration <= 52),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'elite')),
    weekly_hours_target INTEGER CHECK (weekly_hours_target > 0),
    is_active BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT false,
    completion_percentage REAL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    ai_prompt TEXT,
    coach_notes TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts Table
CREATE TABLE public.workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES public.training_plans(id) ON DELETE CASCADE,
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    workout_date DATE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
    sport TEXT NOT NULL CHECK (sport IN ('swim', 'bike', 'run', 'brick', 'strength', 'rest')),
    workout_type TEXT NOT NULL CHECK (workout_type IN ('base', 'build', 'peak', 'recovery', 'test', 'race')),
    name TEXT NOT NULL,
    description TEXT,
    planned_duration_minutes INTEGER CHECK (planned_duration_minutes > 0),
    planned_distance_meters REAL CHECK (planned_distance_meters >= 0),
    planned_intensity TEXT CHECK (planned_intensity IN ('easy', 'moderate', 'hard', 'max')),
    planned_tss INTEGER CHECK (planned_tss >= 0),
    instructions JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration_minutes INTEGER CHECK (actual_duration_minutes > 0),
    actual_distance_meters REAL CHECK (actual_distance_meters >= 0),
    actual_tss INTEGER CHECK (actual_tss >= 0),
    notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    rpe INTEGER CHECK (rpe BETWEEN 1 AND 10), -- Rate of Perceived Exertion
    weather_conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Metrics Table
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    weight_kg REAL CHECK (weight_kg > 0 AND weight_kg < 300),
    body_fat_percentage REAL CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 50),
    resting_hr INTEGER CHECK (resting_hr > 0 AND resting_hr < 150),
    hrv_score REAL CHECK (hrv_score >= 0),
    sleep_hours REAL CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
    sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
    fatigue_level INTEGER CHECK (fatigue_level BETWEEN 1 AND 10),
    motivation_level INTEGER CHECK (motivation_level BETWEEN 1 AND 10),
    soreness_level INTEGER CHECK (soreness_level BETWEEN 1 AND 10),
    stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
    hydration_level INTEGER CHECK (hydration_level BETWEEN 1 AND 10),
    nutrition_quality INTEGER CHECK (nutrition_quality BETWEEN 1 AND 10),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, metric_date)
);

-- API Connections Table
CREATE TABLE public.api_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('strava', 'garmin', 'polar', 'wahoo', 'apple', 'fitbit')),
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    scope TEXT,
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency TEXT DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly', 'manual')),
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(athlete_id, provider)
);

-- Races Table
CREATE TABLE public.races (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    race_type TEXT NOT NULL CHECK (race_type IN ('triathlon', 'running', 'cycling', 'swimming')),
    distance TEXT NOT NULL,
    race_date DATE NOT NULL,
    location TEXT,
    goal_time TEXT,
    actual_time TEXT,
    placement INTEGER CHECK (placement > 0),
    total_participants INTEGER CHECK (total_participants > 0),
    age_group_placement INTEGER CHECK (age_group_placement > 0),
    age_group_total INTEGER CHECK (age_group_total > 0),
    notes TEXT,
    is_target_race BOOLEAN DEFAULT false,
    preparation_plan_id UUID REFERENCES public.training_plans(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Athletes indexes
CREATE INDEX idx_athletes_email ON public.athletes(email);
CREATE INDEX idx_athletes_created_at ON public.athletes(created_at);

-- Activities indexes
CREATE INDEX idx_activities_athlete_id ON public.activities(athlete_id);
CREATE INDEX idx_activities_start_time ON public.activities(start_time);
CREATE INDEX idx_activities_activity_type ON public.activities(activity_type);
CREATE INDEX idx_activities_provider ON public.activities(provider);
CREATE INDEX idx_activities_athlete_start_time ON public.activities(athlete_id, start_time DESC);

-- Training Plans indexes
CREATE INDEX idx_training_plans_athlete_id ON public.training_plans(athlete_id);
CREATE INDEX idx_training_plans_is_active ON public.training_plans(is_active);
CREATE INDEX idx_training_plans_target_date ON public.training_plans(target_date);

-- Workouts indexes
CREATE INDEX idx_workouts_athlete_id ON public.workouts(athlete_id);
CREATE INDEX idx_workouts_plan_id ON public.workouts(plan_id);
CREATE INDEX idx_workouts_workout_date ON public.workouts(workout_date);
CREATE INDEX idx_workouts_athlete_date ON public.workouts(athlete_id, workout_date);

-- Performance Metrics indexes
CREATE INDEX idx_performance_metrics_athlete_id ON public.performance_metrics(athlete_id);
CREATE INDEX idx_performance_metrics_metric_date ON public.performance_metrics(metric_date);
CREATE INDEX idx_performance_metrics_athlete_date ON public.performance_metrics(athlete_id, metric_date DESC);

-- API Connections indexes
CREATE INDEX idx_api_connections_athlete_id ON public.api_connections(athlete_id);
CREATE INDEX idx_api_connections_provider ON public.api_connections(provider);
CREATE INDEX idx_api_connections_is_active ON public.api_connections(is_active);

-- Races indexes
CREATE INDEX idx_races_athlete_id ON public.races(athlete_id);
CREATE INDEX idx_races_race_date ON public.races(race_date);
CREATE INDEX idx_races_is_target_race ON public.races(is_target_race);

-- ========================================
-- TRIGGERS FOR UPDATED_AT
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_athletes_updated_at BEFORE UPDATE ON public.athletes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_training_plans_updated_at BEFORE UPDATE ON public.training_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_performance_metrics_updated_at BEFORE UPDATE ON public.performance_metrics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_api_connections_updated_at BEFORE UPDATE ON public.api_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_races_updated_at BEFORE UPDATE ON public.races FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.races ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Athletes
CREATE POLICY "Users can view own athlete profile" ON public.athletes FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own athlete profile" ON public.athletes FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own athlete profile" ON public.athletes FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for Activities
CREATE POLICY "Users can view own activities" ON public.activities FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Users can insert own activities" ON public.activities FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Users can update own activities" ON public.activities FOR UPDATE USING (auth.uid() = athlete_id);
CREATE POLICY "Users can delete own activities" ON public.activities FOR DELETE USING (auth.uid() = athlete_id);

-- RLS Policies for Training Plans
CREATE POLICY "Users can view own training plans" ON public.training_plans FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Users can insert own training plans" ON public.training_plans FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Users can update own training plans" ON public.training_plans FOR UPDATE USING (auth.uid() = athlete_id);
CREATE POLICY "Users can delete own training plans" ON public.training_plans FOR DELETE USING (auth.uid() = athlete_id);

-- RLS Policies for Workouts
CREATE POLICY "Users can view own workouts" ON public.workouts FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Users can insert own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Users can update own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = athlete_id);
CREATE POLICY "Users can delete own workouts" ON public.workouts FOR DELETE USING (auth.uid() = athlete_id);

-- RLS Policies for Performance Metrics
CREATE POLICY "Users can view own metrics" ON public.performance_metrics FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Users can insert own metrics" ON public.performance_metrics FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Users can update own metrics" ON public.performance_metrics FOR UPDATE USING (auth.uid() = athlete_id);
CREATE POLICY "Users can delete own metrics" ON public.performance_metrics FOR DELETE USING (auth.uid() = athlete_id);

-- RLS Policies for API Connections
CREATE POLICY "Users can view own api connections" ON public.api_connections FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Users can insert own api connections" ON public.api_connections FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Users can update own api connections" ON public.api_connections FOR UPDATE USING (auth.uid() = athlete_id);
CREATE POLICY "Users can delete own api connections" ON public.api_connections FOR DELETE USING (auth.uid() = athlete_id);

-- RLS Policies for Races
CREATE POLICY "Users can view own races" ON public.races FOR SELECT USING (auth.uid() = athlete_id);
CREATE POLICY "Users can insert own races" ON public.races FOR INSERT WITH CHECK (auth.uid() = athlete_id);
CREATE POLICY "Users can update own races" ON public.races FOR UPDATE USING (auth.uid() = athlete_id);
CREATE POLICY "Users can delete own races" ON public.races FOR DELETE USING (auth.uid() = athlete_id);

-- ========================================
-- DEMO DATA POLICIES (BYPASS RLS FOR DEMO)
-- ========================================

-- Allow service role to bypass RLS for demo data
CREATE POLICY "Service role can manage demo data" ON public.athletes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage demo activities" ON public.activities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage demo plans" ON public.training_plans FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage demo workouts" ON public.workouts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage demo metrics" ON public.performance_metrics FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage demo connections" ON public.api_connections FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage demo races" ON public.races FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ========================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ========================================

-- Function to calculate training stress balance
CREATE OR REPLACE FUNCTION public.calculate_training_stress_balance(
    athlete_uuid UUID,
    target_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    date DATE,
    acute_training_load REAL,
    chronic_training_load REAL,
    training_stress_balance REAL
) AS $$
BEGIN
    RETURN QUERY
    WITH daily_tss AS (
        SELECT 
            a.start_time::DATE as activity_date,
            COALESCE(SUM(a.training_stress_score), 0) as daily_tss_sum
        FROM public.activities a
        WHERE a.athlete_id = athlete_uuid
        AND a.start_time::DATE <= target_date
        AND a.start_time::DATE >= target_date - INTERVAL '42 days'
        GROUP BY a.start_time::DATE
    ),
    date_series AS (
        SELECT generate_series(
            target_date - INTERVAL '42 days',
            target_date,
            INTERVAL '1 day'
        )::DATE as series_date
    )
    SELECT 
        ds.series_date,
        -- ATL (7-day exponentially weighted average)
        AVG(COALESCE(dt.daily_tss_sum, 0)) OVER (
            ORDER BY ds.series_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        )::REAL as acute_training_load,
        -- CTL (42-day exponentially weighted average)
        AVG(COALESCE(dt.daily_tss_sum, 0)) OVER (
            ORDER BY ds.series_date 
            ROWS BETWEEN 41 PRECEDING AND CURRENT ROW
        )::REAL as chronic_training_load,
        -- TSB = CTL - ATL
        (AVG(COALESCE(dt.daily_tss_sum, 0)) OVER (
            ORDER BY ds.series_date 
            ROWS BETWEEN 41 PRECEDING AND CURRENT ROW
        ) - AVG(COALESCE(dt.daily_tss_sum, 0)) OVER (
            ORDER BY ds.series_date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ))::REAL as training_stress_balance
    FROM date_series ds
    LEFT JOIN daily_tss dt ON ds.series_date = dt.activity_date
    ORDER BY ds.series_date;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- ========================================
-- COMPLETION MESSAGE
-- ========================================
DO $$
BEGIN
    RAISE NOTICE 'LaufplanerPro database schema created successfully!';
    RAISE NOTICE 'Tables: athletes, activities, training_plans, workouts, performance_metrics, api_connections, races';
    RAISE NOTICE 'Features: RLS enabled, triggers for updated_at, performance indexes, business logic functions';
    RAISE NOTICE 'Ready for professional deployment!';
END $$;
