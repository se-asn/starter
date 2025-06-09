#!/usr/bin/env node

/**
 * Quick Setup Script für Cloudflare D1 Database
 * 
 * Führt automatisch alle notwendigen Schritte aus:
 * 1. Erstellt D1 Datenbank
 * 2. Aktualisiert wrangler.toml mit Database ID
 * 3. Führt Migrations aus
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DB_NAME = 'training_plans_db';

console.log('🚀 Training Plans App - Cloudflare D1 Setup');
console.log('==========================================\n');

try {
  // Schritt 1: Prüfe Wrangler Installation
  console.log('📋 Überprüfe Wrangler Installation...');
  try {
    execSync('npx wrangler --version', { stdio: 'pipe' });
    console.log('✅ Wrangler ist installiert\n');
  } catch (error) {
    console.error('❌ Wrangler ist nicht installiert. Installiere es mit: npm install wrangler');
    process.exit(1);
  }

  // Schritt 2: Prüfe Cloudflare Authentication
  console.log('🔐 Überprüfe Cloudflare Authentication...');
  try {
    execSync('npx wrangler whoami', { stdio: 'pipe' });
    console.log('✅ Bei Cloudflare angemeldet\n');
  } catch (error) {
    console.error('❌ Nicht bei Cloudflare angemeldet. Führe zuerst aus: npx wrangler login');
    process.exit(1);
  }

  // Schritt 3: Erstelle D1 Datenbank
  console.log(`📦 Erstelle D1 Datenbank '${DB_NAME}'...`);
  let dbOutput;
  try {
    dbOutput = execSync(`npx wrangler d1 create ${DB_NAME}`, { encoding: 'utf8' });
    console.log('✅ D1 Datenbank erfolgreich erstellt\n');
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Datenbank existiert bereits, verwende existierende\n');
      // Hole die Database ID der existierenden Datenbank
      const listOutput = execSync(`npx wrangler d1 list`, { encoding: 'utf8' });
      const lines = listOutput.split('\n');
      const dbLine = lines.find(line => line.includes(DB_NAME));
      if (dbLine) {
        const parts = dbLine.split('│').map(s => s.trim());
        const dbId = parts[1]; // Database ID ist normalerweise in der zweiten Spalte
        dbOutput = `database_id = "${dbId}"`;
      }
    } else {
      console.error('❌ Fehler beim Erstellen der Datenbank:', error.message);
      process.exit(1);
    }
  }

  // Schritt 4: Extrahiere Database ID
  console.log('🔧 Aktualisiere wrangler.toml mit Database ID...');
  const dbIdMatch = dbOutput.match(/database_id = "([^"]+)"/);
  if (!dbIdMatch) {
    console.error('❌ Konnte Database ID nicht extrahieren. Bitte manuell in wrangler.toml eintragen.');
    console.log('Output war:', dbOutput);
    process.exit(1);
  }

  const databaseId = dbIdMatch[1];
  console.log(`📝 Database ID: ${databaseId}`);

  // Schritt 5: Aktualisiere wrangler.toml
  const wranglerTomlPath = join(process.cwd(), 'wrangler.toml');
  let wranglerContent = readFileSync(wranglerTomlPath, 'utf8');
  
  // Ersetze "YOUR_DATABASE_ID" mit der echten Database ID
  wranglerContent = wranglerContent.replace('YOUR_DATABASE_ID', databaseId);
  
  writeFileSync(wranglerTomlPath, wranglerContent);
  console.log('✅ wrangler.toml aktualisiert\n');

  // Schritt 6: Führe Migrations aus
  console.log('🗄️  Führe Datenbank-Migrations aus...');
  
  // Lokale Migrations
  console.log('   → Lokale Entwicklungsdatenbank...');
  try {
    execSync(`npx wrangler d1 execute ${DB_NAME} --local --file=./migrations.sql`, { stdio: 'pipe' });
    console.log('   ✅ Lokale Migrations abgeschlossen');
  } catch (error) {
    console.warn('   ⚠️  Lokale Migrations fehlgeschlagen (möglicherweise bereits vorhanden)');
  }

  // Remote Migrations
  console.log('   → Produktionsdatenbank...');
  try {
    execSync(`npx wrangler d1 execute ${DB_NAME} --file=./migrations.sql`, { stdio: 'pipe' });
    console.log('   ✅ Remote Migrations abgeschlossen');
  } catch (error) {
    console.warn('   ⚠️  Remote Migrations fehlgeschlagen (möglicherweise bereits vorhanden)');
  }

  console.log('\n🎉 Setup erfolgreich abgeschlossen!');
  console.log('==========================================');
  console.log('');
  console.log('Nächste Schritte:');
  console.log('1. Starte die Entwicklungsumgebung: npm run dev');
  console.log('2. Teste die Anwendung lokal');
  console.log('3. Deploye auf Cloudflare Pages (siehe DEPLOYMENT.md)');
  console.log('');
  console.log('📚 Weitere Informationen: CLOUDFLARE-D1-SETUP.md');

} catch (error) {
  console.error('❌ Unerwarteter Fehler:', error.message);
  console.error('');
  console.error('Für manuelle Schritte siehe: CLOUDFLARE-D1-SETUP.md');
  process.exit(1);
}
