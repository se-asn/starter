# Cloudflare D1 Integration - Anweisungen

## 1. Erstelle eine Cloudflare D1 Datenbank

```bash
# Installiere Wrangler CLI, falls noch nicht geschehen
npm install -g wrangler

# Melde dich bei Cloudflare an
wrangler login

# Erstelle eine neue D1-Datenbank
wrangler d1 create training_plans_db
```

Nach dem Ausführen des Befehls erhältst du eine Datenbank-ID. Diese solltest du dir aufschreiben.

## 2. Konfiguriere die wrangler.toml-Datei

Öffne die Datei `wrangler.toml` und ersetze `YOUR_DATABASE_ID` mit der ID, die du gerade erhalten hast:

```toml
[[d1_databases]]
binding = "DB"
database_name = "training_plans_db"
database_id = "DEINE_DATENBANK_ID"
```

## 3. Initialisiere die Datenbank

```bash
# Führe das Migrationsskript aus
wrangler d1 execute training_plans_db --file=./migrations.js
```

## 4. Entwicklung mit lokaler D1-Datenbankanbindung

```bash
# Lade einen lokalen Snapshot der Datenbank herunter
wrangler d1 get training_plans_db --local

# Starte den lokalen Entwicklungsserver mit Datenbankbindung
npm run dev
```

## 5. Testen der API mit D1-Integration

Um die API mit der D1-Datenbankintegration zu testen, kannst du das bereitgestellte Testskript verwenden:

```bash
# Passe zuerst den Authentifizierungstoken in test-d1-api.js an
# Dann führe das Skript aus
node test-d1-api.js
```

## 6. Deployment auf Cloudflare Pages

```bash
# Baue die Anwendung
npm run build

# Deploye die Anwendung auf Cloudflare Pages
wrangler pages deploy build --project-name dein-projekt-name

# Binde die D1-Datenbank an dein Cloudflare Pages-Projekt
wrangler pages deployment --project-name dein-projekt-name --binding DB=training_plans_db
```

## 7. Nützliche D1-Befehle für die Entwicklung

```bash
# Tabellenstruktur anzeigen
wrangler d1 execute training_plans_db --command="PRAGMA table_info(training_plans);"
wrangler d1 execute training_plans_db --command="PRAGMA table_info(user_training_plans);"

# Alle Trainingspläne anzeigen
wrangler d1 execute training_plans_db --command="SELECT * FROM training_plans;"

# Alle Benutzertrainingspläne anzeigen
wrangler d1 execute training_plans_db --command="SELECT * FROM user_training_plans;"

# Daten aus der Datenbank löschen (vorsichtig verwenden!)
wrangler d1 execute training_plans_db --command="DELETE FROM user_training_plans;"
wrangler d1 execute training_plans_db --command="DELETE FROM training_plans;"
```

## Troubleshooting

- **Fehler: D1-Datenbank nicht gefunden**
  - Überprüfe, ob die Datenbank-ID in `wrangler.toml` korrekt ist
  - Stelle sicher, dass du bei Cloudflare angemeldet bist: `wrangler login`

- **API gibt "Keine Datenbankverbindung gefunden" zurück**
  - Im Entwicklungsmodus: Stelle sicher, dass du den lokalen Snapshot heruntergeladen hast
  - Im Produktionsmodus: Überprüfe, ob die D1-Datenbankbindung korrekt konfiguriert ist

- **Änderungen werden nicht übernommen**
  - Löschen des lokalen D1-Snapshots und erneutes Herunterladen: `rm .wrangler/state/d1 && wrangler d1 get training_plans_db --local`
