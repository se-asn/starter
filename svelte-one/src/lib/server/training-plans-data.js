// This module stores training plan data that's shared between different API endpoints
// Diese Daten werden als Fallback verwendet, wenn keine Datenbankverbindung verfügbar ist
// und dienen beim ersten Start als Seed-Daten für die Datenbank

// User training plans data - Beispiel-Benutzerpläne für Test und Entwicklung
export let userTrainingPlans = [
	{
		userId: 'user1',
		planId: 'b5k',
		userEmail: 'max@example.com',
		userName: 'Max Mustermann',
		startDate: '2023-06-01',
		targetDate: '2023-07-26',
		targetEvent: 'Stadtlauf Berlin',
		currentWeek: 3,
		isActive: true,
		progress: {}
	},
	{
		userId: 'user2',
		planId: 'bhm',
		userEmail: 'anna@example.com',
		userName: 'Anna Schmidt',
		startDate: '2023-05-15',
		targetDate: '2023-08-10',
		targetEvent: 'Halbmarathon München',
		currentWeek: 4,
		isActive: true,
		progress: {}
	}
];

// Available training plans with detailed structure
export const availableTrainingPlans = [
	{
		id: 'b5k',
		title: 'Vom Sofa zur 5K-Ziellinie',
		distance: '5K',
		level: 'Anfänger',
		duration: '8 Wochen',
		description:
			'Der perfekte Einstieg für Laufneulinge – unser Konzept baut deine Ausdauer behutsam auf.',
		thumbnailUrl: '/images/5km-anfaenger-laufen-einstieg.webp',
		price: '29.99',
		weeks: [
			// Woche 1
			{
				weekNumber: 1,
				sessions: [
					{
						day: 'Montag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Dienstag',
						type: 'Geh-Lauf',
						description:
							'5 Min gehen zur Erwärmung, 6x (1 Min laufen, 1.5 Min gehen), 5 Min gehen zum Auskühlen',
						duration: 25,
						distance: 2.5,
						completed: false
					},
					{
						day: 'Mittwoch',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Donnerstag',
						type: 'Geh-Lauf',
						description:
							'5 Min gehen zur Erwärmung, 6x (1 Min laufen, 1.5 Min gehen), 5 Min gehen zum Auskühlen',
						duration: 25,
						distance: 2.5,
						completed: false
					},
					{
						day: 'Freitag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Samstag',
						type: 'Geh-Lauf',
						description:
							'5 Min gehen zur Erwärmung, 6x (1 Min laufen, 1.5 Min gehen), 5 Min gehen zum Auskühlen',
						duration: 25,
						distance: 2.5,
						completed: false
					},
					{
						day: 'Sonntag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					}
				]
			},
			// Woche 2
			{
				weekNumber: 2,
				sessions: [
					{
						day: 'Montag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Dienstag',
						type: 'Geh-Lauf',
						description:
							'5 Min gehen zur Erwärmung, 7x (1.5 Min laufen, 1.5 Min gehen), 5 Min gehen zum Auskühlen',
						duration: 30,
						distance: 3,
						completed: false
					},
					{
						day: 'Mittwoch',
						type: 'Ruhetag',
						description: 'Erholung oder leichtes Krafttraining',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Donnerstag',
						type: 'Geh-Lauf',
						description:
							'5 Min gehen zur Erwärmung, 7x (1.5 Min laufen, 1.5 Min gehen), 5 Min gehen zum Auskühlen',
						duration: 30,
						distance: 3,
						completed: false
					},
					{
						day: 'Freitag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Samstag',
						type: 'Geh-Lauf',
						description:
							'5 Min gehen zur Erwärmung, 7x (1.5 Min laufen, 1.5 Min gehen), 5 Min gehen zum Auskühlen',
						duration: 30,
						distance: 3,
						completed: false
					},
					{
						day: 'Sonntag',
						type: 'Aktive Erholung',
						description: '20-30 Min leichtes Gehen',
						duration: 25,
						distance: 2,
						completed: false
					}
				]
			}
		]
	},
	{
		id: 'b10k',
		title: 'Systematisch zur 10K-Distanz',
		distance: '10K',
		level: 'Anfänger',
		duration: '10 Wochen',
		description:
			'Verdopple deine Ausdauer mit unserem Trainingsaufbau – die perfekte Balance aus Tempo und Erholung.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '34.99',
		weeks: [
			// Beispiel für die erste Woche
			{
				weekNumber: 1,
				sessions: [
					{
						day: 'Montag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Dienstag',
						type: 'Leichter Lauf',
						description: '25 Minuten lockeres Joggen',
						duration: 25,
						distance: 3.5,
						completed: false
					},
					{
						day: 'Mittwoch',
						type: 'Ruhetag',
						description: 'Erholung oder Krafttraining',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Donnerstag',
						type: 'Intervall',
						description: '10 Min Aufwärmen, 5x (2 Min zügig, 1 Min Gehen), 5 Min Auslaufen',
						duration: 30,
						distance: 4,
						completed: false
					},
					{
						day: 'Freitag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Samstag',
						type: 'Leichter Lauf',
						description: '25 Minuten lockeres Joggen',
						duration: 25,
						distance: 3.5,
						completed: false
					},
					{
						day: 'Sonntag',
						type: 'Längerer Lauf',
						description: '35 Minuten in gleichmäßigem Tempo',
						duration: 35,
						distance: 5,
						completed: false
					}
				]
			}
		]
	},
	{
		id: 'bhm',
		title: 'Dein erster Halbmarathon',
		distance: 'Halbmarathon',
		level: 'Anfänger',
		duration: '12 Wochen',
		description:
			'Mit Struktur zur 21K-Distanz – so wirst du Schritt für Schritt zum Halbmarathon-Finisher.',
		thumbnailUrl: '/images/laufplaner_pro.webp',
		price: '39.99',
		weeks: [
			// Some sample weeks would be here
			{
				weekNumber: 1,
				sessions: [
					{
						day: 'Montag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Dienstag',
						type: 'Leichter Lauf',
						description: '35 Minuten lockeres Laufen',
						duration: 35,
						distance: 5,
						completed: false
					},
					{
						day: 'Mittwoch',
						type: 'Cross-Training',
						description: '30 Minuten Radfahren oder Schwimmen für Ausdauer ohne Laufbelastung',
						duration: 30,
						distance: null,
						completed: false
					},
					{
						day: 'Donnerstag',
						type: 'Leichter Lauf',
						description: '30 Minuten lockeres Laufen',
						duration: 30,
						distance: 4.5,
						completed: false
					},
					{
						day: 'Freitag',
						type: 'Ruhetag',
						description: 'Erholung',
						duration: null,
						distance: null,
						completed: false
					},
					{
						day: 'Samstag',
						type: 'Intervall',
						description:
							'10 Min Aufwärmen, 6x (3 Min mittleres Tempo, 2 Min langsames Joggen), 5 Min Auslaufen',
						duration: 45,
						distance: 6,
						completed: false
					},
					{
						day: 'Sonntag',
						type: 'Längerer Lauf',
						description: '60 Minuten langsames Laufen zum Aufbau der Grundlagenausdauer',
						duration: 60,
						distance: 8,
						completed: false
					}
				]
			}
		]
	}
];

// Update user training plans - nur für In-Memory-Daten verwendet
export function updateUserTrainingPlans(updatedPlans) {
	userTrainingPlans = updatedPlans;
}

// Helfer-Funktion um Fortschritt eines Plans zu berechnen
export function calculatePlanProgress(userPlan, planDetails) {
	if (!userPlan?.progress || Object.keys(userPlan.progress).length === 0) return 0;

	let totalSessions = 0;
	let completedSessions = 0;

	// Wenn keine Plan-Details vorhanden sind, einfach den Fortschritt zählen
	if (!planDetails || !planDetails.weeks) {
		Object.keys(userPlan.progress).forEach((weekIdx) => {
			Object.keys(userPlan.progress[weekIdx]).forEach((sessionIdx) => {
				totalSessions++;
				if (userPlan.progress[weekIdx][sessionIdx]) {
					completedSessions++;
				}
			});
		});
	} else {
		// Wenn Plan-Details vorhanden sind, nur Nicht-Ruhetage zählen
		planDetails.weeks.forEach((week, weekIndex) => {
			// Nur Wochen bis zur aktuellen Woche zählen (inklusiv)
			if (weekIndex >= userPlan.currentWeek) return;

			week.sessions.forEach((session, sessionIndex) => {
				if (session.type !== 'Ruhetag') {
					totalSessions++;

					if (userPlan.progress[weekIndex] && userPlan.progress[weekIndex][sessionIndex]) {
						completedSessions++;
					}
				}
			});
		});
	}

	if (totalSessions === 0) return 0;
	return Math.round((completedSessions / totalSessions) * 100);
}
