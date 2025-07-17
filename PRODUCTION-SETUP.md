# LaufplanerPro - Professionelle Produktions-Setup Anleitung

## 🚀 **SCHRITT-FÜR-SCHRITT ANLEITUNG**

### **1. SUPABASE DATENBANK SETUP**

#### A) Gehen Sie zu Ihrer Supabase Konsole:
- Öffnen Sie: https://app.supabase.com/projects
- Wählen Sie Ihr LaufplanerPro Projekt
- Gehen Sie zu: **SQL Editor**

#### B) Führen Sie das Production Schema aus:
```bash
# Kopieren Sie den gesamten Inhalt von production-schema.sql
# Fügen Sie ihn in den SQL Editor ein
# Klicken Sie "RUN"
```

#### C) Verifizieren Sie das Setup:
- Prüfen Sie, dass alle Tabellen erstellt wurden:
  - athletes
  - activities  
  - training_plans
  - workouts
  - performance_metrics
  - api_connections
  - races

### **2. DEMO DATEN SETUP**

#### A) Service Role Key prüfen:
- Gehen Sie zu: **Settings > API**
- Kopieren Sie den **service_role** Key
- Stellen Sie sicher, dass er in `.env.local` steht

#### B) Demo Daten erstellen:
```bash
# Verwenden Sie unsere Professional Demo Data API
curl -X POST http://localhost:5181/api/production/seed \
  -H "Content-Type: application/json" \
  -d '{"action": "create_professional_demo"}'
```

### **3. AUTHENTICATION SETUP**

#### A) Auth User für Demo erstellen:
- Gehen Sie zu: **Authentication > Users**
- Klicken Sie: **Add user**
- Email: `demo@laufplanerpro.de`
- Password: `Demo123!`
- User ID: `00000000-0000-0000-0000-000000000123`

#### B) RLS Policies aktivieren:
- Alle Tables haben bereits RLS aktiviert
- Policies sind für authenticated users konfiguriert

### **4. FINALE TESTS**

#### A) Demo Login testen:
- Gehen Sie zu: http://localhost:5181/auth
- Verwenden Sie Demo Credentials
- Prüfen Sie alle Seiten

#### B) Neue User Registration testen:
- Erstellen Sie einen neuen Account
- Prüfen Sie dass Navigation funktioniert

## ✅ **ERGEBNIS**
- 100% professionelle Datenbank
- Vollständige Demo Daten
- Produktionsreife Authentication
- Alle Features funktional

## 🔧 **WARTUNG**
- Demo Daten können jederzeit neu erstellt werden
- Schema Updates über Migration Files
- Monitoring über Supabase Dashboard
