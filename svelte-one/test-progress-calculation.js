// test-progress-calculation.js
// Dieses Skript testet die Fortschrittsberechnung für Trainingspläne

// Da wir ES Module verwenden, müssen wir Node.js konfigurieren
// Für dieses Testscript verwenden wir den CommonJS-Ansatz mit direkter Funktion

// Fortschrittsberechnungsfunktion (Kopie aus training-plans-data.js)
function calculatePlanProgress(userPlan, planDetails) {
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

// Beispiel-Trainingsplan für Tests
const samplePlan = {
	weeks: [
		{
			weekNumber: 1,
			sessions: [
				{ day: 'Montag', type: 'Ruhetag', description: 'Erholung' },
				{ day: 'Dienstag', type: 'Lauf', description: 'Leichter Lauf' },
				{ day: 'Mittwoch', type: 'Intervall', description: 'Intervalltraining' },
				{ day: 'Donnerstag', type: 'Ruhetag', description: 'Erholung' },
				{ day: 'Freitag', type: 'Lauf', description: 'Mittlerer Lauf' },
				{ day: 'Samstag', type: 'Lauf', description: 'Langer Lauf' },
				{ day: 'Sonntag', type: 'Ruhetag', description: 'Erholung' }
			]
		},
		{
			weekNumber: 2,
			sessions: [
				{ day: 'Montag', type: 'Ruhetag', description: 'Erholung' },
				{ day: 'Dienstag', type: 'Lauf', description: 'Leichter Lauf' },
				{ day: 'Mittwoch', type: 'Intervall', description: 'Intervalltraining' },
				{ day: 'Donnerstag', type: 'Ruhetag', description: 'Erholung' },
				{ day: 'Freitag', type: 'Lauf', description: 'Mittlerer Lauf' },
				{ day: 'Samstag', type: 'Lauf', description: 'Langer Lauf' },
				{ day: 'Sonntag', type: 'Ruhetag', description: 'Erholung' }
			]
		}
	]
};

// Test: Fortschritt berechnen für verschiedene Szenarien
function runProgressTests() {
	console.log('\n=== FORTSCHRITTS-BERECHNUNGSTESTS ===');

	// Test 1: Kein Fortschritt
	const userPlan1 = { currentWeek: 1, progress: {} };
	const progress1 = calculatePlanProgress(userPlan1, samplePlan);
	console.log('Test 1 - Kein Fortschritt:', progress1 === 0 ? '✓ OK' : '❌ Fehlgeschlagen');

	// Test 2: 50% Fortschritt in Woche 1 (2 von 4 nicht-Ruhetagen)
	const userPlan2 = {
		currentWeek: 1,
		progress: {
			0: { 1: true, 2: true }
		}
	};
	const progress2 = calculatePlanProgress(userPlan2, samplePlan);
	console.log(
		'Test 2 - 50% Fortschritt in Woche 1:',
		progress2 === 50 ? '✓ OK' : `❌ Fehlgeschlagen (${progress2}%)`
	);

	// Test 3: 75% Fortschritt in Woche 1
	const userPlan3 = {
		currentWeek: 1,
		progress: {
			0: { 1: true, 2: true, 4: true }
		}
	};
	const progress3 = calculatePlanProgress(userPlan3, samplePlan);
	console.log(
		'Test 3 - 75% Fortschritt in Woche 1:',
		progress3 === 75 ? '✓ OK' : `❌ Fehlgeschlagen (${progress3}%)`
	);

	// Test 4: 100% Fortschritt in Woche 1
	const userPlan4 = {
		currentWeek: 1,
		progress: {
			0: { 1: true, 2: true, 4: true, 5: true }
		}
	};
	const progress4 = calculatePlanProgress(userPlan4, samplePlan);
	console.log(
		'Test 4 - 100% Fortschritt in Woche 1:',
		progress4 === 100 ? '✓ OK' : `❌ Fehlgeschlagen (${progress4}%)`
	);
	// Test 5: Komplexerer Fortschritt über 2 Wochen
	const userPlan5 = {
		currentWeek: 2,
		progress: {
			0: { 1: true, 2: true, 4: true, 5: true }, // 4 erledigt in Woche 1
			1: { 1: true, 2: true } // 2 erledigt in Woche 2
		}
	};
	const progress5 = calculatePlanProgress(userPlan5, samplePlan);
	// 4 erledigt in Woche 1 + 2 erledigt in Woche 2 = 6 erledigt
	// 4 nicht-Ruhetage in Woche 1 + 4 nicht-Ruhetage in Woche 2 = 8 insgesamt
	const expectedProgress5 = Math.round((6 / 8) * 100); // 75%
	console.log(
		`Test 5 - Fortschritt über 2 Wochen (6/8 Einheiten):`,
		progress5 === expectedProgress5
			? '✓ OK'
			: `❌ Fehlgeschlagen (${progress5}% statt ${expectedProgress5}%)`
	);
}

// Test-Datenbank-Status-Ausgabe
function testDbStatusResponse() {
	console.log('\n=== DATENBANK-STATUS TESTS ===');

	// Simulierte API-Antworten
	const connectedResponse = {
		plans: [],
		dbStatus: { status: 'connected', message: 'Datenbankverbindung erfolgreich' }
	};

	const disconnectedResponse = {
		plans: [],
		dbStatus: { status: 'disconnected', message: 'Keine Datenbankverbindung' }
	};

	// UI-Darstellungssimulation
	function renderDbStatus(response) {
		const { dbStatus } = response;
		if (!dbStatus) return 'Kein Datenbank-Status verfügbar';

		const statusIcon = dbStatus.status === 'connected' ? '🟢' : '🟠';
		return `${statusIcon} ${dbStatus.message}`;
	}

	console.log('Test 1 - Verbundene Datenbank:', renderDbStatus(connectedResponse));
	console.log('Test 2 - Keine Datenbankverbindung:', renderDbStatus(disconnectedResponse));
}

// Führe Tests aus
runProgressTests();
testDbStatusResponse();

console.log('\nAlle Tests abgeschlossen');
