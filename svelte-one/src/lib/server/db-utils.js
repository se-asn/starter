// src/lib/server/db-utils.js
// Utility-Funktionen für Datenbankoperationen

import { TrainingPlanDb } from './db.js';
import { availableTrainingPlans, userTrainingPlans } from './training-plans-data.js';

/**
 * Initialisiert eine Datenbankverbindung und führt optional eine Migration durch
 * @param {Object} env - Cloudflare-Umgebungsvariablen mit D1-Datenbankbindung
 * @param {boolean} migrate - Gibt an, ob eine Migration durchgeführt werden soll
 * @returns {Promise<TrainingPlanDb|null>} Die initialisierte DB-Instanz oder null bei Fehler
 */
export async function initializeDatabase(env, migrate = false) {
	if (!env?.DB) {
		console.warn('Keine Datenbankverbindung gefunden');
		return null;
	}

	try {
		const db = new TrainingPlanDb(env);

		if (migrate) {
			await migrateAndSeedDatabase(db);
		}

		return db;
	} catch (error) {
		console.error('Fehler bei der Datenbankinitialisierung:', error);
		return null;
	}
}

/**
 * Führt Migrationen und Seed-Operationen für die Datenbank durch
 * @param {TrainingPlanDb} db - Die Datenbankinstanz
 * @returns {Promise<boolean>} Gibt an, ob die Migration erfolgreich war
 */
export async function migrateAndSeedDatabase(db) {
	try {
		// Tabellen erstellen
		await db.migrateDatabase();

		// Prüfen, ob Seed-Daten benötigt werden
		const plansCount = await getTableCount(db, 'training_plans');
		const userPlansCount = await getTableCount(db, 'user_training_plans');

		// Seed-Daten einfügen wenn keine vorhanden sind
		if (plansCount === 0) {
			await db.seedTrainingPlansData(availableTrainingPlans);
		}

		if (userPlansCount === 0) {
			await db.seedUserTrainingPlansData(userTrainingPlans);
		}

		return true;
	} catch (error) {
		console.error('Fehler bei der Datenbankmigration:', error);
		return false;
	}
}

/**
 * Hilfsfunktion zur Ermittlung der Anzahl der Datensätze in einer Tabelle
 * @param {TrainingPlanDb} db - Die Datenbankinstanz
 * @param {string} tableName - Der Name der Tabelle
 * @returns {Promise<number>} Die Anzahl der Datensätze
 */
async function getTableCount(db, tableName) {
	try {
		const { results } = await db.db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).all();
		return results[0]?.count || 0;
	} catch (error) {
		// Tabelle existiert möglicherweise noch nicht
		return 0;
	}
}

/**
 * Prüft den Gesundheitszustand der Datenbank
 * @param {TrainingPlanDb} db - Die Datenbankinstanz
 * @returns {Promise<Object>} Statusinformationen zur Datenbank
 */
export async function checkDatabaseHealth(db) {
	if (!db) return { status: 'error', message: 'Keine Datenbankverbindung' };

	try {
		// Tabellen prüfen
		const trainingPlansCount = await getTableCount(db, 'training_plans');
		const userPlansCount = await getTableCount(db, 'user_training_plans');

		return {
			status: 'ok',
			tables: {
				training_plans: { count: trainingPlansCount },
				user_training_plans: { count: userPlansCount }
			}
		};
	} catch (error) {
		return {
			status: 'error',
			message: error.message
		};
	}
}
