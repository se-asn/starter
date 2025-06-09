// migrations.js
// Ein Skript zum Initialisieren und Migrieren der Cloudflare D1-Datenbank

import { availableTrainingPlans, userTrainingPlans } from './src/lib/server/training-plans-data.js';
import { TrainingPlanDb } from './src/lib/server/db.js';

// Hilfsfunktion zur Ermittlung der Anzahl der Datensätze in einer Tabelle
async function getTableCount(db, tableName) {
	try {
		const { results } = await db.db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).all();
		return results[0]?.count || 0;
	} catch (error) {
		return 0;
	}
}

// Hauptfunktion zum Migrieren und Seeden der Datenbank
export async function runMigrations(env) {
	console.log('🚀 Starte Datenbankmigrationen...');

	if (!env.DB) {
		console.error(
			'❌ Keine Datenbankverbindung gefunden. Stelle sicher, dass die DB in wrangler.toml konfiguriert ist.'
		);
		process.exit(1);
	}

	try {
		// Datenbank initialisieren
		const db = new TrainingPlanDb(env);

		// Manuelles Ausführen der Migration, um detaillierte Logs zu erhalten
		console.log('📊 Erstelle Tabellen...');
		await db.migrateDatabase();
		console.log('✅ Tabellen erfolgreich erstellt');

		// Trainingspläne seeden
		console.log('🌱 Seede Trainingspläne...');
		const plansSeeded = await db.seedTrainingPlansData(availableTrainingPlans);

		if (plansSeeded) {
			console.log('✅ Trainingspläne erfolgreich geseedet');
		} else {
			console.log('⏩ Trainingspläne bereits vorhanden, überspringe Seeding');
		}

		// Benutzertrainingspläne seeden (für Testzwecke)
		console.log('🌱 Seede Benutzertrainingspläne...');
		const userPlansSeeded = await db.seedUserTrainingPlansData(userTrainingPlans);

		if (userPlansSeeded) {
			console.log('✅ Benutzertrainingspläne erfolgreich geseedet');
		} else {
			console.log('⏩ Benutzertrainingspläne bereits vorhanden, überspringe Seeding');
		}

		// Gesundheitsprüfung der Datenbank
		console.log('🩺 Prüfe Datenbankstatus...');
		const trainingPlansCount = await getTableCount(db, 'training_plans');
		const userPlansCount = await getTableCount(db, 'user_training_plans');

		console.log(
			`📈 Statistik: ${trainingPlansCount} Trainingspläne, ${userPlansCount} Benutzertrainingspläne`
		);
		console.log('🎉 Alle Migrationen erfolgreich abgeschlossen!');
	} catch (error) {
		console.error('❌ Fehler bei der Migration:', error);
		process.exit(1);
	}
}

// Diese Funktion kann direkt mit wrangler ausgeführt werden:
// npx wrangler d1 execute DB --file=./migrations.js
export default {
	async fetch(request, env) {
		await runMigrations(env);
		return new Response('Migrationen abgeschlossen!', { status: 200 });
	}
};
