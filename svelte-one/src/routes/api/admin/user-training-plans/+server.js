// Admin API endpoint to manage user training plans
import { json } from '@sveltejs/kit';
import { checkRateLimit, getSecurityHeaders } from '$lib/server/security';

// In einer echten Anwendung würden diese Daten in einer Datenbank gespeichert
let userTrainingPlans = [
	{
		userId: 'user1',
		planId: 'b5k',
		userName: 'Max Mustermann',
		planTitle: 'Vom Sofa zur 5K-Ziellinie',
		startDate: '2023-06-01',
		targetDate: '2023-07-26',
		targetEvent: 'Stadtlauf Berlin',
		currentWeek: 3,
		isActive: true,
		progress: 45
	},
	{
		userId: 'user2',
		planId: 'bhm',
		userName: 'Anna Schmidt',
		planTitle: 'Dein erster Halbmarathon',
		startDate: '2023-05-15',
		targetDate: '2023-08-10',
		targetEvent: 'Halbmarathon München',
		currentWeek: 4,
		isActive: true,
		progress: 32
	}
];

// GET: Abrufen der zugewiesenen Trainingspläne
export async function GET({ locals, getClientAddress }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`admin_get_user_plans_${clientIp}`, 20, 60000)) {
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

		return json(
			{ assignments: userTrainingPlans },
			{
				headers: getSecurityHeaders()
			}
		);
	} catch (error) {
		console.error('Error fetching user training plans:', error);
		return json(
			{ error: 'Serverfehler beim Abrufen der zugewiesenen Trainingspläne' },
			{ status: 500 }
		);
	}
}

// POST: Zuweisen eines Trainingsplans an einen Benutzer
export async function POST({ request, locals, getClientAddress }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`admin_assign_plan_${clientIp}`, 10, 60000)) {
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

		const { userId, planId, startDate, targetDate, targetEvent } = await request.json();

		if (!userId || !planId) {
			return json({ error: 'Benutzer-ID und Plan-ID sind erforderlich' }, { status: 400 });
		}

		// Überprüfen, ob der Benutzer bereits einen aktiven Plan hat
		const existingActivePlan = userTrainingPlans.find((p) => p.userId === userId && p.isActive);

		if (existingActivePlan) {
			// Deaktivieren des vorhandenen aktiven Plans
			existingActivePlan.isActive = false;
		}

		// Überprüfen, ob der Benutzer den spezifischen Plan bereits hat
		const existingPlan = userTrainingPlans.find((p) => p.userId === userId && p.planId === planId);

		if (existingPlan) {
			// Plan aktualisieren statt neu hinzufügen
			existingPlan.startDate = startDate || existingPlan.startDate;
			existingPlan.targetDate = targetDate || existingPlan.targetDate;
			existingPlan.targetEvent = targetEvent || existingPlan.targetEvent;
			existingPlan.isActive = true;
			existingPlan.currentWeek = 1; // Zurücksetzen auf Woche 1

			// Synchronisieren mit dem User-API
			// In einer echten App würde dies über eine Datenbank-Aktualisierung geschehen
			// Hier müssten wir einen API-Aufruf an die User-Training-Plans-API machen

			return json({
				success: true,
				message: 'Trainingsplan wurde aktualisiert und aktiviert'
			});
		}

		// In einer echten App würden wir Benutzer- und Plandetails aus der Datenbank holen
		// Für dieses Beispiel verwenden wir Hardcoded-Werte
		const users = [
			{ id: 'user1', name: 'Max Mustermann' },
			{ id: 'user2', name: 'Anna Schmidt' },
			{ id: 'user3', name: 'Thomas Müller' },
			{ id: 'user4', name: 'Julia Weber' }
		];

		const plans = [
			{ id: 'b5k', title: 'Vom Sofa zur 5K-Ziellinie' },
			{ id: 'b10k', title: 'Systematisch zur 10K-Distanz' },
			{ id: 'bhm', title: 'Dein erster Halbmarathon' },
			{ id: 'bm', title: 'Marathon-Finisher-Programm' },
			{ id: 'a5k', title: 'Deine neue 5K-Bestzeit' },
			{ id: 'a10k', title: 'Die 10K-Zeitenjagd' }
		];

		const user = users.find((u) => u.id === userId);
		const plan = plans.find((p) => p.id === planId);

		if (!user || !plan) {
			return json({ error: 'Benutzer oder Plan nicht gefunden' }, { status: 404 });
		}

		// Neuen Plan erstellen
		const newAssignment = {
			userId,
			planId,
			userName: user.name,
			planTitle: plan.title,
			startDate: startDate || new Date().toISOString().split('T')[0],
			targetDate: targetDate || '',
			targetEvent: targetEvent || '',
			currentWeek: 1,
			isActive: true,
			progress: 0
		};

		// Plan hinzufügen
		userTrainingPlans.push(newAssignment);

		// Synchronisieren mit dem User-API
		// In einer echten App würde eine POST-Anfrage an die User-API gesendet werden
		try {
			// Dummy-Anfrage an die User-API (wird in einer echten App ersetzt)
			// fetch('/api/user/training-plans', {
			//     method: 'POST',
			//     headers: { 'Content-Type': 'application/json' },
			//     body: JSON.stringify({
			//         userId,
			//         planId,
			//         startDate,
			//         targetDate,
			//         targetEvent
			//     })
			// });
			// In einer echten App würden wir auf die Antwort warten und entsprechend reagieren
		} catch (syncError) {
			console.error('Fehler bei der Synchronisierung mit der User-API:', syncError);
			// In einer Produktionsumgebung würden wir hier transaktionale Fehlerbehandlung implementieren
		}

		return json({
			success: true,
			message: 'Trainingsplan wurde erfolgreich zugewiesen'
		});
	} catch (error) {
		console.error('Error assigning training plan:', error);
		return json({ error: 'Serverfehler beim Zuweisen des Trainingsplans' }, { status: 500 });
	}
}

// DELETE: Entfernen eines Trainingsplans von einem Benutzer
export async function DELETE({ url, locals, getClientAddress }) {
	try {
		// Authentifizierung überprüfen
		if (!locals.user || locals.user.role !== 'admin') {
			return json({ error: 'Nicht autorisiert' }, { status: 401 });
		}

		// Rate-Limiting anwenden
		const clientIp = getClientAddress();
		if (!checkRateLimit(`admin_remove_plan_${clientIp}`, 10, 60000)) {
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

		const userId = url.searchParams.get('userId');
		const planId = url.searchParams.get('planId');

		if (!userId || !planId) {
			return json({ error: 'Benutzer-ID und Plan-ID sind erforderlich' }, { status: 400 });
		}

		// Trainingsplan-Zuweisung löschen
		const initialLength = userTrainingPlans.length;
		userTrainingPlans = userTrainingPlans.filter(
			(p) => !(p.userId === userId && p.planId === planId)
		);

		if (userTrainingPlans.length === initialLength) {
			return json({ error: 'Trainingsplan-Zuweisung nicht gefunden' }, { status: 404 });
		}

		// Synchronisieren mit dem User-API
		// In einer echten App würde eine DELETE-Anfrage an die User-API gesendet werden
		try {
			// Dummy-Anfrage an die User-API (wird in einer echten App ersetzt)
			// fetch(`/api/user/training-plans?userId=${userId}&planId=${planId}`, {
			//     method: 'DELETE'
			// });
			// In einer echten App würden wir auf die Antwort warten und entsprechend reagieren
		} catch (syncError) {
			console.error('Fehler bei der Synchronisierung mit der User-API:', syncError);
			// In einer Produktionsumgebung würden wir hier transaktionale Fehlerbehandlung implementieren
		}

		return json({
			success: true,
			message: 'Trainingsplan-Zuweisung wurde entfernt'
		});
	} catch (error) {
		console.error('Error removing training plan assignment:', error);
		return json(
			{ error: 'Serverfehler beim Entfernen der Trainingsplan-Zuweisung' },
			{ status: 500 }
		);
	}
}
