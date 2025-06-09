// test-d1-api.js
// Ein einfaches Skript, um die API mit der D1-Datenbank zu testen

// Konfiguriere die Details für deine API-Anfrage
const apiUrl = 'http://localhost:5173/api/user/training-plans';
const authToken = 'DEIN_AUTH_TOKEN'; // Ersetze dies mit einem gültigen Auth-Token

// Test-Konfiguration: Setze auf true, um auch Schreiboperationen zu testen
const testWriteOperations = false;

async function testTrainingPlansApi() {
	console.log('🧪 Teste Training Plans API mit D1-Datenbankintegration...');

	try {
		// GET-Anfrage, um alle Trainingspläne des Benutzers abzurufen
		console.log('📝 GET-Anfrage: Alle Trainingspläne abrufen');
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${authToken}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`API-Fehler: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		console.log('✅ Antwort erhalten:');
		console.log(JSON.stringify(data, null, 2));

		// Wenn Pläne vorhanden sind, teste auch das Abrufen eines einzelnen Plans
		if (data.plans && data.plans.length > 0) {
			const planId = data.plans[0].id;
			console.log(`📝 GET-Anfrage: Details für Plan ${planId} abrufen`);

			const detailResponse = await fetch(`${apiUrl}?planId=${planId}`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${authToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (!detailResponse.ok) {
				throw new Error(`API-Fehler: ${detailResponse.status} ${detailResponse.statusText}`);
			}

			const detailData = await detailResponse.json();
			console.log('✅ Plan-Details erhalten:');
			console.log(JSON.stringify(detailData, null, 2));

			// Teste den Fortschritt-Wert
			if (detailData.plan && 'progress' in detailData.plan) {
				console.log(`📊 Plan-Fortschritt: ${detailData.plan.progress}%`);
			}

			// Teste Schreiboperationen, wenn aktiviert
			if (testWriteOperations) {
				await testWriteOperationsForPlan(planId);
			}
		} else {
			console.log('⚠️ Keine Pläne gefunden, überspringe Detail-Tests');

			if (testWriteOperations) {
				// Teste das Hinzufügen eines neuen Plans, wenn keine vorhanden sind
				await testAddNewPlan();
			}
		}

		console.log('🎉 API-Test erfolgreich abgeschlossen!');
	} catch (error) {
		console.error('❌ Fehler beim API-Test:', error);
	}
}

async function testWriteOperationsForPlan(planId) {
	console.log(`🔄 Teste Schreiboperationen für Plan ${planId}...`);

	// PATCH: Aktualisiere eine Trainingseinheit
	console.log('📝 PATCH-Anfrage: Markiere eine Trainingseinheit als abgeschlossen');
	const patchResponse = await fetch(apiUrl, {
		method: 'PATCH',
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			planId,
			weekNumber: 1,
			sessionIndex: 1,
			completed: true
		})
	});

	if (!patchResponse.ok) {
		throw new Error(`API-Fehler: ${patchResponse.status} ${patchResponse.statusText}`);
	}

	const patchData = await patchResponse.json();
	console.log('✅ Aktualisierung erfolgreich:');
	console.log(JSON.stringify(patchData, null, 2));
}

async function testAddNewPlan() {
	console.log('📝 POST-Anfrage: Füge einen neuen Trainingsplan hinzu');
	const postResponse = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${authToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			planId: 'b5k',
			startDate: new Date().toISOString().split('T')[0],
			targetDate: new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
			targetEvent: 'Test-Event'
		})
	});

	if (!postResponse.ok) {
		throw new Error(`API-Fehler: ${postResponse.status} ${postResponse.statusText}`);
	}

	const postData = await postResponse.json();
	console.log('✅ Plan hinzugefügt:');
	console.log(JSON.stringify(postData, null, 2));
}

// Führe den Test aus
testTrainingPlansApi();
