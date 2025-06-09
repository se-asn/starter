// filepath: src/routes/api/user/training-plans/+server.js
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';
import {
	userTrainingPlans,
	availableTrainingPlans,
	calculatePlanProgress
} from '$lib/server/training-plans-data.js';
import { TrainingPlanDb } from '$lib/server/db.js';

// Hilfsfunktion für die Initialisierung der Datenbank
async function getDb(platform) {
	if (!platform?.env?.DB) {
		console.warn('Keine Datenbankverbindung gefunden, verwende In-Memory-Daten');
		return { db: null, status: { status: 'disconnected', message: 'Keine Datenbankverbindung' } };
	}

	try {
		const db = new TrainingPlanDb(platform.env);
		// Teste die Verbindung
		await db.getTrainingPlans();
		return {
			db,
			status: { status: 'connected', message: 'Datenbankverbindung erfolgreich' }
		};
	} catch (error) {
		console.error('Fehler bei der Datenbankverbindung:', error);
		return {
			db: null,
			status: { status: 'disconnected', message: 'Fehler bei der Datenbankverbindung' }
		};
	}
}

// GET: Abrufen der Trainingspläne eines Benutzers
export async function GET({ url, locals, getClientAddress, platform }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`get_user_plans_${clientIp}`, 20, 60000)) {
			return json(
				{
					error: 'Zu viele Anfragen. Bitte versuche es später erneut.'
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60'
					}
				}
			);
		}		// Parameter für Abfrage von Details eines Plans
		const planId = url.searchParams.get('planId');

		// Datenbankverbindung herstellen
		const { db } = await getDb(platform);

		if (planId) {
			// Spezifischen Plan mit Details zurückgeben
			let userPlan;
			let planDetails;

			if (db) {
				// Datenbankabfrage
				userPlan = await db.getUserTrainingPlan(userId, planId);
				planDetails = await db.getTrainingPlan(planId);
			} else {
				// Fallback zu In-Memory-Daten
				userPlan = userTrainingPlans.find((p) => p.userId === userId && p.planId === planId);
				planDetails = availableTrainingPlans.find((p) => p.id === planId);
			}

			if (!userPlan) {
				return json({ error: 'Trainingsplan nicht gefunden' }, { status: 404 });
			}

			if (!planDetails) {
				return json({ error: 'Plandetails nicht gefunden' }, { status: 404 });
			}

			// Plan mit benutzerdefinierten Einstellungen zurückgeben
			const fullPlan = {
				...planDetails,
				startDate: userPlan.startDate,
				targetDate: userPlan.targetDate,
				targetEvent: userPlan.targetEvent,
				notes: userPlan.notes,
				currentWeek: userPlan.currentWeek,
				// Übernehme den Fortschritt des Benutzers
				weeks: planDetails.weeks.map((week, idx) => {
					if (userPlan.progress && userPlan.progress[idx]) {
						return {
							...week,
							sessions: week.sessions.map((session, sessionIdx) => ({
								...session,
								completed: userPlan.progress[idx][sessionIdx] || false
							}))
						};
					}
					return week;
				})
			};
			return json(
				{ plan: fullPlan, dbStatus: status },
				{
					headers: getSecurityHeaders()
				}
			);
		}

		// Liste aller Pläne des Benutzers zurückgeben
		let userPlans;
		let allAvailablePlans;

		if (db) {
			// Datenbankabfrage
			userPlans = await db.getUserTrainingPlans(userId);
			allAvailablePlans = await db.getTrainingPlans();
		} else {
			// Fallback zu In-Memory-Daten
			userPlans = userTrainingPlans.filter((plan) => plan.userId === userId);
			allAvailablePlans = availableTrainingPlans;
		}

		const formattedPlans = userPlans
			.map((userPlan) => {
				// Basisinformationen des Plans abrufen
				const basePlan = allAvailablePlans.find((p) => p.id === userPlan.planId);

				if (!basePlan) return null;
				return {
					id: userPlan.planId,
					title: basePlan.title,
					distance: basePlan.distance,
					level: basePlan.level,
					duration: basePlan.duration,
					description: basePlan.description,
					thumbnailUrl: basePlan.thumbnailUrl,
					startDate: userPlan.startDate,
					targetDate: userPlan.targetDate,
					targetEvent: userPlan.targetEvent,
					currentWeek: userPlan.currentWeek,
					isActive: userPlan.isActive,
					progress: calculatePlanProgress(userPlan, basePlan)
				};
			})
			.filter(Boolean);
		return json(
			{ plans: formattedPlans, dbStatus: status },
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Fehler beim Abrufen der Trainingspläne:', error);
		return json(
			{
				error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
			},
			{
				status: 500,
				headers: getSecurityHeaders()
			}
		);
	}
}

// POST: Hinzufügen oder Aktivieren eines Trainingsplans
export async function POST({ request, locals, getClientAddress, platform }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;
		const userEmail = locals.user.email || '';
		const userName = locals.user.name || '';

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`add_user_plan_${clientIp}`, 10, 60000)) {
			return json(
				{
					error: 'Zu viele Anfragen. Bitte versuche es später erneut.'
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60'
					}
				}
			);
		}

		const { planId, startDate, targetDate, targetEvent } = await request.json();

		if (!planId) {		return json({ error: 'Plan-ID ist erforderlich' }, { status: 400 });
		}

		// Datenbankverbindung herstellen
		const { db } = await getDb(platform);

		let planExists = false;

		if (db) {
			const plan = await db.getTrainingPlan(planId);
			planExists = !!plan;
		} else {
			// Überprüfen, ob der Plan existiert (In-Memory-Fallback)
			planExists = availableTrainingPlans.some((p) => p.id === planId);
		}

		if (!planExists) {
			return json({ error: 'Trainingsplan nicht gefunden' }, { status: 404 });
		}

		// Versuche, den Plan in der Datenbank zu finden oder im In-Memory-Store
		let existingPlan = null;

		if (db) {
			existingPlan = await db.getUserTrainingPlan(userId, planId);
		} else {
			existingPlan = userTrainingPlans.find((p) => p.userId === userId && p.planId === planId);
		}

		if (existingPlan) {
			// Wenn der Plan bereits existiert, aktualisieren wir ihn
			const updates = {
				startDate: startDate || existingPlan.startDate,
				targetDate: targetDate || existingPlan.targetDate,
				targetEvent: targetEvent || existingPlan.targetEvent,
				isActive: true
			};

			if (db) {
				await db.updateUserTrainingPlan(userId, planId, updates);

				// Andere Pläne deaktivieren
				const otherPlans = await db.getUserTrainingPlans(userId);
				for (const plan of otherPlans) {
					if (plan.planId !== planId && plan.isActive) {
						await db.updateUserTrainingPlan(userId, plan.planId, { isActive: false });
					}
				}
			} else {
				// In-Memory-Update
				// Finde den Index des existierenden Plans
				const existingPlanIndex = userTrainingPlans.findIndex(
					(p) => p.userId === userId && p.planId === planId
				);

				// Aktualisiere den Plan
				userTrainingPlans[existingPlanIndex] = {
					...userTrainingPlans[existingPlanIndex],
					...updates
				};

				// Andere Pläne deaktivieren
				for (let i = 0; i < userTrainingPlans.length; i++) {
					const plan = userTrainingPlans[i];
					if (plan.userId === userId && plan.planId !== planId && plan.isActive) {
						userTrainingPlans[i] = {
							...plan,
							isActive: false
						};
					}
				}
			}

			return json(
				{
					success: true,
					message: 'Plan aktiviert',
					planId
				},
				{
					headers: getSecurityHeaders()
				}
			);
		} else {
			// Neuen Plan erstellen
			const newPlan = {
				userId,
				userEmail,
				userName,
				planId,
				startDate: startDate || new Date().toISOString().split('T')[0],
				targetDate: targetDate || '',
				targetEvent: targetEvent || '',
				currentWeek: 1,
				isActive: true,
				progress: {}
			};

			if (db) {
				// In Datenbank speichern
				await db.addUserTrainingPlan(newPlan);

				// Andere Pläne deaktivieren
				const otherPlans = await db.getUserTrainingPlans(userId);
				for (const plan of otherPlans) {
					if (plan.planId !== planId && plan.isActive) {
						await db.updateUserTrainingPlan(userId, plan.planId, { isActive: false });
					}
				}
			} else {
				// In-Memory-Speicherung
				userTrainingPlans.push(newPlan);

				// Andere Pläne deaktivieren
				for (let i = 0; i < userTrainingPlans.length; i++) {
					const plan = userTrainingPlans[i];
					if (plan.userId === userId && plan.planId !== planId && plan.isActive) {
						userTrainingPlans[i] = {
							...plan,
							isActive: false
						};
					}
				}
			}

			return json(
				{
					success: true,
					message: 'Plan hinzugefügt',
					planId
				},
				{
					headers: getSecurityHeaders()
				}
			);
		}
	} catch (error) {
		console.error('Fehler beim Hinzufügen des Trainingsplans:', error);
		return json(
			{
				error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
			},
			{
				status: 500,
				headers: getSecurityHeaders()
			}
		);
	}
}

// PATCH: Aktualisieren eines bestehenden Trainingsplans
export async function PATCH({ request, locals, getClientAddress, platform }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`update_user_plan_${clientIp}`, 20, 60000)) {
			return json(
				{
					error: 'Zu viele Anfragen. Bitte versuche es später erneut.'
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60'
					}
				}
			);
		}
		const data = await request.json();
		const { planId } = data;

		if (!planId) {
			return json({ error: 'Plan-ID ist erforderlich' }, { status: 400 });
		}

		// Datenbankverbindung herstellen
		const { db } = await getDb(platform);

		// Überprüfen, ob der Plan existiert
		let existingPlan = null;

		if (db) {
			existingPlan = await db.getUserTrainingPlan(userId, planId);
		} else {
			existingPlan = userTrainingPlans.find((p) => p.userId === userId && p.planId === planId);
		}

		if (!existingPlan) {
			return json({ error: 'Trainingsplan nicht gefunden' }, { status: 404 });
		}

		// Ermittle die zu aktualisierenden Felder
		const updates = {};

		// Fortschritt einer bestimmten Trainingseinheit aktualisieren
		if (
			data.weekNumber !== undefined &&
			data.sessionIndex !== undefined &&
			data.completed !== undefined
		) {
			let progress = existingPlan.progress || {};
			const weekIdx = data.weekNumber - 1; // 0-basierter Index

			if (!progress[weekIdx]) {
				progress[weekIdx] = {};
			}

			progress[weekIdx][data.sessionIndex] = data.completed;
			updates.progress = progress;
		}

		// Aktuelle Woche aktualisieren
		if (data.currentWeek !== undefined) {
			updates.currentWeek = data.currentWeek;
		}

		// Ziel-Event aktualisieren
		if (data.targetEvent !== undefined) {
			updates.targetEvent = data.targetEvent;
		}

		// Zieldatum aktualisieren
		if (data.targetDate !== undefined) {
			updates.targetDate = data.targetDate;
		}

		// Notizen aktualisieren
		if (data.notes !== undefined) {
			updates.notes = data.notes;
		}

		// Plan aktualisieren
		if (db) {
			await db.updateUserTrainingPlan(userId, planId, updates);

			// Wenn der Plan aktiv gesetzt wird, andere Pläne deaktivieren
			if (data.isActive) {
				const otherPlans = await db.getUserTrainingPlans(userId);
				for (const plan of otherPlans) {
					if (plan.planId !== planId && plan.isActive) {
						await db.updateUserTrainingPlan(userId, plan.planId, { isActive: false });
					}
				}
			}
		} else {
			// In-Memory-Update
			const planIndex = userTrainingPlans.findIndex(
				(p) => p.userId === userId && p.planId === planId
			);

			userTrainingPlans[planIndex] = {
				...userTrainingPlans[planIndex],
				...updates
			};

			// Wenn der Plan aktiv gesetzt wird, andere Pläne deaktivieren
			if (data.isActive) {
				for (let i = 0; i < userTrainingPlans.length; i++) {
					const plan = userTrainingPlans[i];
					if (plan.userId === userId && plan.planId !== planId && plan.isActive) {
						userTrainingPlans[i] = {
							...plan,
							isActive: false
						};
					}
				}
			}
		}

		return json(
			{
				success: true,
				message: 'Plan aktualisiert'
			},
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Fehler beim Aktualisieren des Trainingsplans:', error);
		return json(
			{
				error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
			},
			{
				status: 500,
				headers: getSecurityHeaders()
			}
		);
	}
}

// DELETE: Entfernen eines Trainingsplans
export async function DELETE({ url, locals, getClientAddress, platform }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user) {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		const userId = locals.user.id;

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`delete_user_plan_${clientIp}`, 10, 60000)) {
			return json(
				{
					error: 'Zu viele Anfragen. Bitte versuche es später erneut.'
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60'
					}
				}
			);
		}

		const planId = url.searchParams.get('planId');
		if (!planId) {
			return json({ error: 'Plan-ID ist erforderlich' }, { status: 400 });
		}

		// Datenbankverbindung herstellen
		const { db } = await getDb(platform);

		// Überprüfen, ob der Plan existiert
		let existingPlan = null;

		if (db) {
			existingPlan = await db.getUserTrainingPlan(userId, planId);
		} else {
			existingPlan = userTrainingPlans.find((p) => p.userId === userId && p.planId === planId);
		}

		if (!existingPlan) {
			return json({ error: 'Trainingsplan nicht gefunden' }, { status: 404 });
		}

		// Plan löschen
		if (db) {
			await db.deleteUserTrainingPlan(userId, planId);
		} else {
			// In-Memory-Löschung
			const initialLength = userTrainingPlans.length;
			const newPlans = userTrainingPlans.filter(
				(p) => !(p.userId === userId && p.planId === planId)
			);
		if (newPlans.length === initialLength) {
			return json({ error: 'Trainingsplan nicht gefunden' }, { status: 404 });
		}

		// Update the userTrainingPlans array by clearing and refilling it
		userTrainingPlans.length = 0;
		userTrainingPlans.push(...newPlans);
		}

		return json(
			{
				success: true,
				message: 'Plan gelöscht'
			},
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Fehler beim Löschen des Trainingsplans:', error);
		return json(
			{
				error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
			},
			{
				status: 500,
				headers: getSecurityHeaders()
			}
		);
	}
}
