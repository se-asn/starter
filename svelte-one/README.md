# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

# Lauftrainings-App

Eine SvelteKit-Anwendung für personalisierte Trainingspläne, mit Backend-Integration für Cloudflare Pages und D1-Datenbank.

## Features

- Personalisierte Trainingspläne für verschiedene Laufniveaus
- Benutzerbereich zum Verfolgen des Fortschritts
- Admin-Dashboard zur Verwaltung von Trainingsplänen und Benutzern
- Export-Funktionalität für Trainingspläne (ICS, CSV, PDF)
- Benachrichtigungssystem für anstehende Trainingseinheiten
- Integration mit Cloudflare D1-Datenbank

## Cloudflare D1 Einrichtung

### 1. Cloudflare D1-Datenbank erstellen

```bash
# Installiere Wrangler CLI, falls noch nicht geschehen
npm install -g wrangler

# Anmelden bei Cloudflare (folge den Anweisungen im Browser)
wrangler login

# Erstelle eine neue D1-Datenbank
wrangler d1 create training_plans_db

# Die Ausgabe enthält einen ID-Wert, den du in der wrangler.toml-Datei eintragen musst
```

### 2. D1-Datenbank-ID in wrangler.toml eintragen

Öffne die Datei `wrangler.toml` und ersetze `YOUR_DATABASE_ID` mit der ID, die du aus dem vorherigen Schritt erhalten hast:

```toml
[[d1_databases]]
binding = "DB"
database_name = "training_plans_db"
database_id = "DEINE_DATENBANK_ID"
```

### 3. Datenbank migrieren und seeden

```bash
# Migriere die Datenbank und fülle sie mit Testdaten
wrangler d1 execute training_plans_db --file=./migrations.js

# Optional: Überprüfe, ob alles funktioniert hat
wrangler d1 execute training_plans_db --command="SELECT * FROM training_plans;"
```

### 4. Lokale Entwicklung mit D1

Um lokal mit der D1-Datenbank zu entwickeln, führe den folgenden Befehl aus:

```bash
# Lade einen lokalen Snapshot der Datenbank herunter
wrangler d1 get training_plans_db --local

# Starte den lokalen Entwicklungsserver mit Datenbankbindung
npm run dev
```

### 5. Deployment auf Cloudflare Pages

```bash
# Baue die Anwendung
npm run build

# Deploye die Anwendung auf Cloudflare Pages
wrangler pages deploy build --project-name deine-projekt-name
```

## Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# oder Server starten und App im Browser öffnen
npm run dev -- --open

# Produktionsversion bauen
npm run build

# Produktionsversion lokal testen
npm run preview
```

## Technologien

- SvelteKit
- Cloudflare Pages
- Cloudflare D1 (SQLite-Datenbank)
- JavaScript ES6+
- HTML/CSS
