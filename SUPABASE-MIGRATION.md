# Supabase Migration Guide

Ihr LaufplanerPro-Projekt wurde erfolgreich auf Supabase umgestellt! Hier sind die nächsten Schritte:

## 🚀 Setup-Schritte

### 1. Supabase-Projekt erstellen
1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein neues Projekt
3. Notieren Sie sich:
   - Project URL
   - Anon Public Key
   - Service Role Key

### 2. Environment Variables konfigurieren
Erstellen Sie eine `.env.local` Datei basierend auf `.env.example`:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 3. Datenbank Schema einrichten
1. Öffnen Sie die Supabase SQL-Konsole
2. Führen Sie das Schema aus `supabase-schema.sql` aus
3. Das Schema erstellt automatisch:
   - Alle Tabellen mit Row Level Security (RLS)
   - Indexes für Performance
   - Trigger für automatische Timestamps
   - Auth-Integration

### 4. Cloudflare Pages anpassen (falls weiterhin genutzt)
Da Sie jetzt Supabase statt Cloudflare D1 nutzen, können Sie:
- Die D1-Datenbank-Bindungen entfernen
- Nur noch statische Assets hosten
- Environment Variables in Cloudflare Pages setzen

## 🔄 Was wurde geändert

### Neue Dateien:
- `src/lib/supabase.ts` - Supabase Client-Konfiguration
- `src/lib/server/supabase-auth.ts` - Supabase Auth Service
- `supabase-schema.sql` - Datenbank Schema für Supabase

### Angepasste Dateien:
- `src/lib/server/database.ts` - Umgestellt auf Supabase
- `src/routes/api/auth/login/+server.ts` - Supabase Auth Integration
- `src/routes/api/auth/register/+server.ts` - Supabase Auth Integration
- `package.json` - Supabase Dependency hinzugefügt

### Entfernte Dependencies:
- Cloudflare D1-spezifische Funktionen
- Manuelle Password-Hashing (jetzt über Supabase Auth)

## ✨ Neue Features

### Supabase Auth
- Automatische Email-Verifikation
- Password-Reset Funktionalität
- OAuth-Provider Integration möglich
- Session-Management

### Row Level Security (RLS)
- Automatische Datensicherheit
- User können nur ihre eigenen Daten sehen
- Keine manuellen Berechtigungsprüfungen nötig

### Real-time Features (optional)
- Supabase Realtime für Live-Updates
- Kann später für Live-Sync aktiviert werden

## 🔧 Migration bestehender Daten

Falls Sie bereits Daten in Cloudflare D1 haben:
1. Exportieren Sie die Daten aus D1
2. Importieren Sie sie in Supabase über die SQL-Konsole
3. Achten Sie auf UUID-Formatierung für die `id`-Felder

## 🧪 Testen

```bash
# Development starten
npm run dev

# Neue Benutzer registrieren über /auth
# Anmelden über /auth
# API-Endpunkte testen
```

## 📱 Frontend-Integration

Der Frontend-Code kann weiterhin die gleichen API-Endpunkte nutzen. Zusätzlich können Sie jetzt direkt den Supabase-Client verwenden:

```typescript
import { supabase } from '$lib/supabase';

// Direkter Zugriff auf Supabase Features
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});
```

## 🔒 Sicherheit

- RLS ist für alle Tabellen aktiviert
- Users können nur ihre eigenen Daten zugreifen
- Service Role Key nur für Server-Side Operations
- Public Key für Client-Side sicher verwendbar

## 📊 Überwachung

In Supabase Dashboard haben Sie Zugriff auf:
- Database-Performance
- Auth-Logs
- API-Usage
- Real-time Monitoring

## ❓ Nächste Schritte

1. Environment Variables setzen
2. Supabase Schema einrichten
3. Ersten Test-User registrieren
4. API-Integrationen (Strava, Garmin) testen
5. Optional: Real-time Features aktivieren

Ihr Projekt ist jetzt bereit für Production mit Supabase! 🎉
