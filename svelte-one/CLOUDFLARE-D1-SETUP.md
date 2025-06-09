# Cloudflare D1 Setup Guide

Dieses Dokument beschreibt, wie Sie die Cloudflare D1 Datenbank für die SvelteKit Training Plan Anwendung einrichten.

## Voraussetzungen

1. **Cloudflare Account**: Erstellen Sie einen kostenlosen Account bei [Cloudflare](https://cloudflare.com)
2. **Wrangler CLI**: Sollte bereits installiert sein (überprüfen Sie mit `npx wrangler --version`)

## Schritt 1: Bei Cloudflare anmelden

```bash
npx wrangler login
```

Folgen Sie den Anweisungen im Browser, um sich zu authentifizieren.

## Schritt 2: D1 Datenbank erstellen

```bash
npx wrangler d1 create training_plans_db
```

**Wichtig**: Kopieren Sie die Ausgabe! Sie sollte etwa so aussehen:
```
✅ Successfully created DB 'training_plans_db' in region EEUR
Created your database using D1's new storage engine.

[[d1_databases]]
binding = "DB"
database_name = "training_plans_db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

## Schritt 3: Database ID in wrangler.toml aktualisieren

Öffnen Sie `wrangler.toml` und ersetzen Sie `YOUR_DATABASE_ID` mit der tatsächlichen Database ID aus Schritt 2.

## Schritt 4: Datenbank-Schema erstellen

```bash
# Führen Sie die Migrations für die lokale Entwicklung aus
npx wrangler d1 execute training_plans_db --local --file=./migrations.sql

# Führen Sie die Migrations für die Produktion aus
npx wrangler d1 execute training_plans_db --file=./migrations.sql
```

## Schritt 5: Anwendung mit D1 testen

```bash
# Lokale Entwicklung mit D1
npm run dev
```

Die Anwendung sollte jetzt mit der D1 Datenbank funktionieren.

## Schritt 6: Auf Cloudflare Pages deployen

1. **Pushen Sie Ihren Code zu GitHub**:
   ```bash
   git add .
   git commit -m "Add Cloudflare D1 database configuration"
   git push origin main
   ```

2. **Gehen Sie zu Cloudflare Pages**:
   - Besuchen Sie [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigieren Sie zu "Pages" → "Create a project"
   - Verbinden Sie Ihr GitHub Repository
   - Wählen Sie "SvelteKit" als Framework preset

3. **Build-Einstellungen**:
   - Build command: `npm run build`
   - Output directory: `.svelte-kit/output/client`

4. **Umgebungsvariablen hinzufügen**:
   - Gehen Sie zu Ihrem Pages-Projekt → Settings → Environment variables
   - Fügen Sie folgende Variablen hinzu:
     - `NODE_ENV`: `production`
     - Weitere anwendungsspezifische Variablen nach Bedarf

5. **D1 Datenbank verbinden**:
   - Gehen Sie zu Ihrem Pages-Projekt → Settings → Functions
   - Unter "D1 database bindings" fügen Sie hinzu:
     - Variable name: `DB`
     - D1 database: `training_plans_db`

## Troubleshooting

### Fehler: "Unknown binding DB"
- Stellen Sie sicher, dass die D1 Database Binding in den Pages-Einstellungen konfiguriert ist
- Überprüfen Sie, dass `database_id` in `wrangler.toml` korrekt ist

### Fehler: "Table doesn't exist"
- Führen Sie die Migrations erneut aus: `npx wrangler d1 execute training_plans_db --file=./migrations.js`

### Lokale Entwicklung funktioniert nicht
- Stellen Sie sicher, dass Sie `--local` Flag verwenden: `npx wrangler dev --local`
- Überprüfen Sie, dass lokale Migrations ausgeführt wurden

## Nützliche Befehle

```bash
# Liste aller D1 Datenbanken anzeigen
npx wrangler d1 list

# SQL-Abfragen direkt ausführen
npx wrangler d1 execute training_plans_db --command="SELECT * FROM users LIMIT 5"

# Lokale D1 Datenbank zurücksetzen
npx wrangler d1 execute training_plans_db --local --command="DROP TABLE IF EXISTS users; DROP TABLE IF EXISTS training_plans;"

# Backup der Datenbank erstellen
npx wrangler d1 export training_plans_db --output=backup.sql
```

## Produktions-Deployment Checkliste

- [ ] Cloudflare Account erstellt
- [ ] Wrangler CLI authentifiziert (`npx wrangler login`)
- [ ] D1 Datenbank erstellt (`training_plans_db`)
- [ ] Database ID in `wrangler.toml` eingetragen
- [ ] Migrations ausgeführt (lokal und remote)
- [ ] Code zu GitHub gepusht
- [ ] Cloudflare Pages-Projekt erstellt
- [ ] D1 Database Binding in Pages konfiguriert
- [ ] Deployment erfolgreich
- [ ] Anwendung funktioniert in Produktion

## Support

Bei Problemen:
1. Überprüfen Sie die Cloudflare Pages Logs
2. Überprüfen Sie die Browser-Konsole auf Fehler
3. Verwenden Sie `npx wrangler tail` um Live-Logs zu sehen
4. Konsultieren Sie die [Cloudflare D1 Dokumentation](https://developers.cloudflare.com/d1/)
