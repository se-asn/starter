-- migrations.sql
-- SQL-Migrationen für die Training Plans Datenbank

-- Erstelle Users Tabelle
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Erstelle Training Plans Tabelle
CREATE TABLE IF NOT EXISTS training_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    weekly_plan TEXT, -- JSON string containing the weekly training structure
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Erstelle User Training Plans Tabelle (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_training_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    training_plan_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    progress_data TEXT, -- JSON string containing progress information
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (training_plan_id) REFERENCES training_plans (id) ON DELETE CASCADE,
    UNIQUE(user_id, training_plan_id, start_date)
);

-- Erstelle Training Sessions Tabelle
CREATE TABLE IF NOT EXISTS training_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_training_plan_id INTEGER NOT NULL,
    session_date DATE NOT NULL,
    week_number INTEGER NOT NULL,
    day_number INTEGER NOT NULL,
    session_type TEXT NOT NULL,
    planned_data TEXT, -- JSON string with planned session data
    actual_data TEXT, -- JSON string with actual completed session data
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'skipped', 'rescheduled')),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_training_plan_id) REFERENCES user_training_plans (id) ON DELETE CASCADE
);

-- Erstelle Progress Tracking Tabelle
CREATE TABLE IF NOT EXISTS progress_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    user_training_plan_id INTEGER NOT NULL,
    entry_date DATE NOT NULL,
    metrics TEXT NOT NULL, -- JSON string containing various metrics (time, distance, heart_rate, etc.)
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (user_training_plan_id) REFERENCES user_training_plans (id) ON DELETE CASCADE
);

-- Erstelle Blog Posts Tabelle
CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    author_id INTEGER,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    featured_image TEXT,
    tags TEXT, -- JSON string containing tags array
    meta_description TEXT,
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Erstelle Blog Comments Tabelle
CREATE TABLE IF NOT EXISTS blog_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER, -- For nested comments
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES blog_comments (id) ON DELETE CASCADE
);

-- Erstelle Newsletter Subscribers Tabelle
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at DATETIME
);

-- Erstelle User Sessions Tabelle (für Auth)
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Erstelle Notifications Tabelle
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT, -- JSON string for additional data
    is_read BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Erstelle Indexes für bessere Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_user_training_plans_user_id ON user_training_plans (user_id);
CREATE INDEX IF NOT EXISTS idx_user_training_plans_status ON user_training_plans (status);
CREATE INDEX IF NOT EXISTS idx_training_sessions_user_training_plan_id ON training_sessions (user_training_plan_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_date ON training_sessions (session_date);
CREATE INDEX IF NOT EXISTS idx_progress_entries_user_id ON progress_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_progress_entries_date ON progress_entries (entry_date);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts (status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_slug ON blog_comments (post_slug);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments (status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions (expires_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications (user_id, is_read);

-- Füge Standard-Trainingspläne ein (nur wenn Tabelle leer ist)
INSERT OR IGNORE INTO training_plans (id, name, description, duration_weeks, difficulty_level, category, price, weekly_plan) VALUES
(1, '5K für Anfänger', 'Ein 8-wöchiger Plan für Laufanfänger, um ihre ersten 5 Kilometer zu schaffen', 8, 'beginner', 'running', 29.99, '{"week1":{"days":[{"type":"run_walk","duration":20,"description":"3x (Laufen 1 Min, Gehen 2 Min)"},{"type":"rest","description":"Ruhetag"},{"type":"run_walk","duration":20,"description":"3x (Laufen 1 Min, Gehen 2 Min)"},{"type":"cross_training","duration":30,"description":"Leichtes Radfahren oder Schwimmen"},{"type":"run_walk","duration":25,"description":"4x (Laufen 1 Min, Gehen 2 Min)"},{"type":"rest","description":"Ruhetag"},{"type":"long_walk","duration":30,"description":"Entspannter Spaziergang"}]}}'),

(2, '10K Aufbau', 'Aufbauplan für Läufer mit 5K-Erfahrung zum ersten 10K-Lauf', 10, 'intermediate', 'running', 39.99, '{"week1":{"days":[{"type":"easy_run","duration":30,"description":"Entspannter 30-Minuten-Lauf"},{"type":"rest","description":"Ruhetag"},{"type":"tempo_run","duration":25,"description":"5 Min Aufwärmen, 15 Min Tempo, 5 Min Cool-down"},{"type":"cross_training","duration":40,"description":"Krafttraining oder Radfahren"},{"type":"easy_run","duration":35,"description":"Lockerer 35-Minuten-Lauf"},{"type":"rest","description":"Ruhetag"},{"type":"long_run","duration":45,"description":"Langer Dauerlauf"}]}}'),

(3, 'Halbmarathon Challenge', 'Umfassender 16-Wochen-Plan für deinen ersten Halbmarathon', 16, 'advanced', 'running', 59.99, '{"week1":{"days":[{"type":"easy_run","duration":40,"description":"Lockerer 40-Minuten-Grundlagenlauf"},{"type":"strength_training","duration":45,"description":"Krafttraining mit Fokus auf Rumpf und Beine"},{"type":"tempo_run","duration":35,"description":"10 Min Aufwärmen, 20 Min Tempo, 5 Min Cool-down"},{"type":"cross_training","duration":45,"description":"Alternativtraining (Radfahren, Schwimmen)"},{"type":"easy_run","duration":45,"description":"Entspannter 45-Minuten-Lauf"},{"type":"rest","description":"Aktive Erholung oder Ruhetag"},{"type":"long_run","duration":60,"description":"Langer Dauerlauf mit progressiver Steigerung"}]}}'),

(4, 'Kraft & Kondition', 'Ganzheitliches Fitnessprogramm für Kraft und Ausdauer', 12, 'intermediate', 'fitness', 49.99, '{"week1":{"days":[{"type":"strength_training","duration":60,"description":"Ganzkörper-Krafttraining"},{"type":"cardio","duration":30,"description":"HIIT-Training"},{"type":"strength_training","duration":60,"description":"Oberkörper-Focus"},{"type":"yoga","duration":45,"description":"Flexibilität und Erholung"},{"type":"strength_training","duration":60,"description":"Unterkörper-Focus"},{"type":"cardio","duration":45,"description":"Ausdauertraining"},{"type":"rest","description":"Vollständige Erholung"}]}}'),

(5, 'Yoga Grundlagen', 'Sanfter Einstieg in die Welt des Yoga', 6, 'beginner', 'yoga', 34.99, '{"week1":{"days":[{"type":"hatha_yoga","duration":30,"description":"Grundlegende Asanas und Atemtechniken"},{"type":"rest","description":"Ruhetag für Reflexion"},{"type":"vinyasa_flow","duration":35,"description":"Sanfter Flow für Anfänger"},{"type":"meditation","duration":20,"description":"Geführte Meditation"},{"type":"yin_yoga","duration":45,"description":"Entspannende Yin-Praxis"},{"type":"rest","description":"Ruhetag"},{"type":"gentle_flow","duration":40,"description":"Wochenabschluss mit sanftem Flow"}]}}');

-- Füge einen Standard-Admin-User ein (nur für Entwicklung)
INSERT OR IGNORE INTO users (id, email, password_hash, first_name, last_name, role) VALUES
(1, 'admin@trainingsapp.com', '$2a$10$example_hash_replace_in_production', 'Admin', 'User', 'admin');

-- Füge Standard-Blog-Post ein
INSERT OR IGNORE INTO blog_posts (slug, title, excerpt, content, author_id, published_at) VALUES
('5km-laufen-fuer-anfaenger', '5KM Laufen für Anfänger: Der komplette Guide', 'Alles was du wissen musst, um mit dem Laufen zu beginnen und deine ersten 5 Kilometer zu schaffen.', 'Vollständiger Blog-Content hier...', 1, CURRENT_TIMESTAMP);
