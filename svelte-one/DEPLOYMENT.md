# Deployment Guide - Training Plan App

## 🚀 Cloudflare Pages Deployment

### Schritt 1: GitHub Repository vorbereitet ✅
Das Repository ist bereits auf GitHub gepusht.

### Schritt 2: Cloudflare Pages Setup

1. **Gehe zu [Cloudflare Dashboard](https://dash.cloudflare.com/)**
2. **Navigiere zu "Pages"**
3. **Klicke auf "Create a project"**
4. **Wähle "Connect to Git"**
5. **Verbinde dein GitHub Repository**

### Schritt 3: Build-Konfiguration

Verwende diese Einstellungen für die Deployment-Konfiguration:

```
Framework preset: SvelteKit
Build command: npm run build
Build output directory: build
Root directory: / (leer lassen)
Node.js version: 18 oder höher
```

### Schritt 4: Umgebungsvariablen (Optional)

Zunächst wird die App mit In-Memory-Daten funktionieren. Später können wir eine D1-Datenbank hinzufügen.

### Schritt 5: Domain konfigurieren

Nach dem Deployment erhältst du eine `*.pages.dev` URL. Du kannst später eine eigene Domain verknüpfen.

## 🔐 Demo-Zugangsdaten

Die App enthält bereits Test-Benutzer:

**Standard-Benutzer:**
- Email: `demo@example.com`
- Passwort: `demo123`

**Admin-Benutzer:**
- Email: `admin@example.com`  
- Passwort: `admin123`

## 📊 Features

✅ **Implementiert:**
- Benutzer-Authentifizierung
- Trainingsplan-Übersicht mit Fortschrittsanzeige
- Responsive Design
- Sichere API-Endpunkte
- Datenbankstatus-Anzeige
- Fallback auf In-Memory-Daten

🔄 **Geplant (nach D1-Setup):**
- Persistente Datenspeicherung
- Benutzerregistrierung
- Benutzerdefinierte Trainingspläne

## 🛠️ Technische Details

- **Framework:** SvelteKit
- **Hosting:** Cloudflare Pages
- **Datenbank:** Cloudflare D1 (geplant)
- **Authentifizierung:** JWT mit bcrypt
- **Styling:** Vanilla CSS mit modernem Design
