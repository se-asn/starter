-- LaufplanerPro - Athlete Applications Database Schema
-- Professional athlete application management system

-- Applications table
CREATE TABLE athlete_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Application Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'on_hold')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Personal Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    birth_date DATE,
    gender VARCHAR(1) CHECK (gender IN ('m', 'w', 'd')),
    location VARCHAR(255),
    
    -- Athletic Background
    experience INTEGER,
    primary_discipline VARCHAR(50),
    current_level VARCHAR(20),
    weekly_training_hours INTEGER,
    
    -- Performance Data
    best_marathon_time VARCHAR(10),
    best_half_marathon_time VARCHAR(10),
    best_10k_time VARCHAR(10),
    best_5k_time VARCHAR(10),
    best_ironman_time VARCHAR(10),
    best_olympic_tri_time VARCHAR(10),
    best_sprint_tri_time VARCHAR(10),
    
    -- Physiological Data
    resting_hr INTEGER,
    max_hr INTEGER,
    ftp INTEGER,
    lt_hr INTEGER,
    vo2_max DECIMAL(4,1),
    weight DECIMAL(5,2),
    height INTEGER,
    body_fat DECIMAL(4,1),
    
    -- Swimming Data
    best_50m_free VARCHAR(10),
    best_100m_free VARCHAR(10),
    best_1500m_free VARCHAR(10),
    swim_css VARCHAR(10),
    
    -- Goals & Motivation
    goals_2025 TEXT NOT NULL,
    target_races TEXT,
    motivation TEXT NOT NULL,
    expectations TEXT,
    
    -- Equipment & Technology
    devices JSONB DEFAULT '[]'::jsonb,
    training_apps JSONB DEFAULT '[]'::jsonb,
    equipment TEXT,
    
    -- Additional Info
    injuries TEXT,
    medications TEXT,
    coach VARCHAR(255),
    team_club VARCHAR(255),
    social_media VARCHAR(255),
    referral_source VARCHAR(50),
    additional_info TEXT,
    
    -- Scoring (automatic evaluation)
    performance_score INTEGER DEFAULT 0,
    experience_score INTEGER DEFAULT 0,
    motivation_score INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    auto_recommendation VARCHAR(20) DEFAULT 'review' CHECK (auto_recommendation IN ('approve', 'reject', 'review'))
);

-- Create indexes for better performance
CREATE INDEX idx_applications_status ON athlete_applications(status);
CREATE INDEX idx_applications_email ON athlete_applications(email);
CREATE INDEX idx_applications_created_at ON athlete_applications(created_at);
CREATE INDEX idx_applications_total_score ON athlete_applications(total_score);

-- Application notes/comments table for admin communication
CREATE TABLE application_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES athlete_applications(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Email notifications log
CREATE TABLE email_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES athlete_applications(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending'))
);

-- Admin users table (separate from regular athletes)
CREATE TABLE admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'reviewer')),
    permissions JSONB DEFAULT '["review_applications", "approve_applications"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to automatically calculate scores
CREATE OR REPLACE FUNCTION calculate_application_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Performance Score (0-40 points)
    NEW.performance_score := CASE 
        WHEN NEW.current_level = 'elite' THEN 40
        WHEN NEW.current_level = 'competitive' THEN 30
        WHEN NEW.current_level = 'amateur' THEN 20
        WHEN NEW.current_level = 'beginner' THEN 10
        ELSE 0
    END;
    
    -- Experience Score (0-30 points)
    NEW.experience_score := CASE 
        WHEN NEW.experience >= 10 THEN 30
        WHEN NEW.experience >= 5 THEN 25
        WHEN NEW.experience >= 3 THEN 20
        WHEN NEW.experience >= 1 THEN 15
        ELSE 10
    END;
    
    -- Motivation Score (0-30 points) - based on text length and keywords
    NEW.motivation_score := CASE 
        WHEN LENGTH(NEW.motivation) > 500 AND LENGTH(NEW.goals_2025) > 300 THEN 30
        WHEN LENGTH(NEW.motivation) > 300 AND LENGTH(NEW.goals_2025) > 200 THEN 25
        WHEN LENGTH(NEW.motivation) > 200 AND LENGTH(NEW.goals_2025) > 100 THEN 20
        WHEN LENGTH(NEW.motivation) > 100 THEN 15
        ELSE 10
    END;
    
    -- Total Score
    NEW.total_score := NEW.performance_score + NEW.experience_score + NEW.motivation_score;
    
    -- Auto Recommendation
    NEW.auto_recommendation := CASE 
        WHEN NEW.total_score >= 80 THEN 'approve'
        WHEN NEW.total_score <= 40 THEN 'reject'
        ELSE 'review'
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate scores on insert/update
CREATE TRIGGER trigger_calculate_scores
    BEFORE INSERT OR UPDATE ON athlete_applications
    FOR EACH ROW
    EXECUTE FUNCTION calculate_application_scores();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE TRIGGER trigger_update_applications_timestamp
    BEFORE UPDATE ON athlete_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE athlete_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for admin access to applications
CREATE POLICY "Admins can view all applications" ON athlete_applications
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Policy for admin modifications
CREATE POLICY "Admins can update applications" ON athlete_applications
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE user_id = auth.uid()
        )
    );

-- Insert a default super admin (you can change this email)
INSERT INTO admin_users (user_id, role, permissions) VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@laufplanerpro.de' LIMIT 1),
    'super_admin',
    '["review_applications", "approve_applications", "manage_admins", "view_analytics"]'::jsonb
);

-- Create sample test data for development
INSERT INTO athlete_applications (
    first_name, last_name, email, phone, birth_date, gender, location,
    experience, primary_discipline, current_level, weekly_training_hours,
    best_marathon_time, best_half_marathon_time, best_10k_time, best_5k_time,
    resting_hr, max_hr, ftp, vo2_max, weight, height,
    goals_2025, motivation, devices, referral_source, status
) VALUES 
(
    'Max', 'Mustermann', 'max.mustermann@email.de', '+49 123 456789', '1990-03-15', 'm', 'München, Deutschland',
    8, 'triathlon', 'competitive', 15,
    '2:45:30', '1:18:45', '35:20', '16:45',
    45, 195, 285, 58.5, 75.2, 180,
    'Ich möchte 2025 meinen ersten Ironman unter 9 Stunden finishen und dabei eine neue persönliche Bestzeit im Marathon laufen.',
    'LaufplanerPro würde mir helfen, mein Training zu strukturieren und wissenschaftlich fundierte Trainingspläne zu erstellen.',
    '["Garmin", "Strava", "TrainingPeaks"]'::jsonb,
    'google',
    'pending'
),
(
    'Sarah', 'Schmidt', 'sarah.schmidt@email.de', '+49 987 654321', '1985-07-22', 'w', 'Berlin, Deutschland',
    12, 'running', 'elite', 20,
    '2:28:15', '1:08:30', '31:45', '15:20',
    38, 192, 320, 65.2, 58.5, 168,
    'Qualifikation für die Deutsche Marathonmeisterschaft und Top-10 Platzierung bei einem Major Marathon.',
    'Als ambitionierte Läuferin suche ich professionelle Unterstützung für meine Wettkampfvorbereitung und Leistungsoptimierung.',
    '["Garmin", "Wahoo", "Strava", "TrainingPeaks", "Zwift"]'::jsonb,
    'coach',
    'approved'
),
(
    'Tom', 'Weber', 'tom.weber@email.de', '+49 555 123456', '1995-11-08', 'm', 'Hamburg, Deutschland',
    3, 'cycling', 'amateur', 8,
    NULL, NULL, '42:30', '18:45',
    55, 188, 245, 52.1, 80.0, 185,
    'Erste Triathlon-Teilnahme und Verbesserung meiner Schwimmtechnik.',
    'Ich bin Einsteiger und möchte systematisch trainieren.',
    '["Garmin", "Strava"]'::jsonb,
    'friend',
    'rejected'
);
