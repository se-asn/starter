<script>
	import { onMount } from 'svelte';

	let users = [];
	let availablePlans = [];
	let userTrainingPlans = [];
	let isLoading = true;
	let error = null;
	
	// Formularwerte
	let selectedUserId = '';
	let selectedPlanId = '';
	let startDate = new Date().toISOString().split('T')[0];
	let targetDate = '';
	let targetEvent = '';
	let isAssigning = false;
	let successMessage = '';
	
	// Laden aller Benutzer
	async function loadUsers() {
		try {
			const response = await fetch('/api/admin/users');
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Laden der Benutzer');
			}
			
			const data = await response.json();
			users = data.users || [];
		} catch (err) {
			console.error('Fehler beim Laden der Benutzer:', err);
			error = err.message;
		}
	}
	
	// Laden aller verfügbaren Trainingspläne
	async function loadAvailablePlans() {
		try {
			const response = await fetch('/api/admin/training-plans');
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Laden der Trainingspläne');
			}
			
			const data = await response.json();
			availablePlans = data.plans || [];
		} catch (err) {
			console.error('Fehler beim Laden der Trainingspläne:', err);
			error = err.message;
		}
	}
	
	// Laden aller zugewiesenen Trainingspläne
	async function loadUserTrainingPlans() {
		try {
			const response = await fetch('/api/admin/user-training-plans');
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Laden der zugewiesenen Trainingspläne');
			}
			
			const data = await response.json();
			userTrainingPlans = data.assignments || [];
		} catch (err) {
			console.error('Fehler beim Laden der zugewiesenen Trainingspläne:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}
	
	// Trainingsplan einem Benutzer zuweisen
	async function assignPlanToUser() {
		if (!selectedUserId || !selectedPlanId) {
			error = 'Bitte wählen Sie einen Benutzer und einen Trainingsplan aus.';
			return;
		}
		
		try {
			isAssigning = true;
			error = null;
			successMessage = '';
			
			const response = await fetch('/api/admin/user-training-plans', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: selectedUserId,
					planId: selectedPlanId,
					startDate,
					targetDate,
					targetEvent
				})
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Zuweisen des Trainingsplans');
			}
			
			// Formular zurücksetzen
			selectedUserId = '';
			selectedPlanId = '';
			startDate = new Date().toISOString().split('T')[0];
			targetDate = '';
			targetEvent = '';
			
			// Erfolgsmeldung anzeigen
			successMessage = 'Trainingsplan wurde erfolgreich zugewiesen!';
			
			// Liste der zugewiesenen Pläne aktualisieren
			await loadUserTrainingPlans();
		} catch (err) {
			console.error('Fehler beim Zuweisen des Trainingsplans:', err);
			error = err.message;
		} finally {
			isAssigning = false;
		}
	}
	
	// Trainingsplan-Zuweisung entfernen
	async function removeAssignment(userId, planId) {
		if (!confirm('Sind Sie sicher, dass Sie diesen Trainingsplan vom Benutzer entfernen möchten?')) {
			return;
		}
		
		try {
			error = null;
			
			const response = await fetch(`/api/admin/user-training-plans?userId=${userId}&planId=${planId}`, {
				method: 'DELETE'
			});
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Entfernen des Trainingsplans');
			}
			
			// Liste der zugewiesenen Pläne aktualisieren
			await loadUserTrainingPlans();
			
			successMessage = 'Trainingsplan wurde erfolgreich entfernt!';
		} catch (err) {
			console.error('Fehler beim Entfernen des Trainingsplans:', err);
			error = err.message;
		}
	}
	
	// Daten laden, wenn die Komponente gemountet wird
	onMount(async () => {
		try {
			// In einer echten App würden wir diese Daten vom Server laden
			// Für Demonstrations-/Entwicklungszwecke fügen wir hier Beispieldaten ein
			
			// Simulierte API-Anfragen
			users = [
				{ id: 'user1', name: 'Max Mustermann', email: 'max@example.com' },
				{ id: 'user2', name: 'Anna Schmidt', email: 'anna@example.com' },
				{ id: 'user3', name: 'Thomas Müller', email: 'thomas@example.com' },
				{ id: 'user4', name: 'Julia Weber', email: 'julia@example.com' }
			];
			
			availablePlans = [
				{ id: 'b5k', title: 'Vom Sofa zur 5K-Ziellinie', level: 'Anfänger', distance: '5K', duration: '8 Wochen' },
				{ id: 'b10k', title: 'Systematisch zur 10K-Distanz', level: 'Anfänger', distance: '10K', duration: '10 Wochen' },
				{ id: 'bhm', title: 'Dein erster Halbmarathon', level: 'Anfänger', distance: 'Halbmarathon', duration: '12 Wochen' },
				{ id: 'bm', title: 'Marathon-Finisher-Programm', level: 'Anfänger', distance: 'Marathon', duration: '16 Wochen' },
				{ id: 'a5k', title: 'Deine neue 5K-Bestzeit', level: 'Fortgeschritten', distance: '5K', duration: '8 Wochen' },
				{ id: 'a10k', title: 'Die 10K-Zeitenjagd', level: 'Fortgeschritten', distance: '10K', duration: '10 Wochen' }
			];
			
			userTrainingPlans = [
				{ 
					userId: 'user1', 
					planId: 'b5k', 
					userName: 'Max Mustermann', 
					planTitle: 'Vom Sofa zur 5K-Ziellinie',
					startDate: '2023-06-01',
					targetDate: '2023-07-26',
					targetEvent: 'Stadtlauf Berlin',
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
					progress: 32
				}
			];
			
			// In einer echten App würden wir stattdessen diese Funktionen aufrufen:
			// await Promise.all([loadUsers(), loadAvailablePlans(), loadUserTrainingPlans()]);
		} catch (err) {
			console.error('Fehler beim Laden der Daten:', err);
			error = 'Fehler beim Laden der erforderlichen Daten. Bitte versuchen Sie es später erneut.';
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Trainingspläne verwalten | Admin</title>
</svelte:head>

<div class="training-plans-admin">
	<div class="page-header">
		<h1>Trainingspläne verwalten</h1>
	</div>
	
	{#if isLoading}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<p>Lade Daten...</p>
		</div>
	{:else}
		{#if error}
			<div class="error-message">
				<p>{error}</p>
				<button class="btn btn-primary" on:click={() => location.reload()}>Erneut versuchen</button>
			</div>
		{/if}
		
		{#if successMessage}
			<div class="success-message">
				<p>{successMessage}</p>
				<button class="close-btn" on:click={() => successMessage = ''}>×</button>
			</div>
		{/if}
		
		<div class="admin-section">
			<h2>Neuen Trainingsplan zuweisen</h2>
			<div class="assignment-form">
				<div class="form-group">
					<label for="user">Benutzer auswählen</label>
					<select id="user" bind:value={selectedUserId} required>
						<option value="">-- Benutzer auswählen --</option>
						{#each users as user}
							<option value={user.id}>{user.name} ({user.email})</option>
						{/each}
					</select>
				</div>
				
				<div class="form-group">
					<label for="plan">Trainingsplan auswählen</label>
					<select id="plan" bind:value={selectedPlanId} required>
						<option value="">-- Trainingsplan auswählen --</option>
						{#each availablePlans as plan}
							<option value={plan.id}>{plan.title} ({plan.level}, {plan.distance})</option>
						{/each}
					</select>
				</div>
				
				<div class="form-row">
					<div class="form-group">
						<label for="start-date">Startdatum</label>
						<input type="date" id="start-date" bind:value={startDate} required>
					</div>
					
					<div class="form-group">
						<label for="target-date">Zieldatum (optional)</label>
						<input type="date" id="target-date" bind:value={targetDate}>
					</div>
				</div>
				
				<div class="form-group">
					<label for="target-event">Zielevent (optional)</label>
					<input type="text" id="target-event" bind:value={targetEvent} placeholder="z.B. Berlin Marathon">
				</div>
				
				<div class="form-actions">
					<button 
						class="btn btn-primary" 
						on:click={assignPlanToUser} 
						disabled={isAssigning || !selectedUserId || !selectedPlanId}
					>
						{isAssigning ? 'Wird zugewiesen...' : 'Trainingsplan zuweisen'}
					</button>
				</div>
			</div>
		</div>
		
		<div class="admin-section">
			<h2>Zugewiesene Trainingspläne</h2>
			
			{#if userTrainingPlans.length === 0}
				<div class="empty-state">
					<p>Derzeit sind keine Trainingspläne zugewiesen.</p>
				</div>
			{:else}
				<div class="assignment-list">
					<table>
						<thead>
							<tr>
								<th>Benutzer</th>
								<th>Trainingsplan</th>
								<th>Start</th>
								<th>Ziel</th>
								<th>Zielevent</th>
								<th>Fortschritt</th>
								<th>Aktionen</th>
							</tr>
						</thead>
						<tbody>
							{#each userTrainingPlans as assignment}
								<tr>
									<td>{assignment.userName}</td>
									<td>{assignment.planTitle}</td>
									<td>{new Date(assignment.startDate).toLocaleDateString('de-DE')}</td>
									<td>{assignment.targetDate ? new Date(assignment.targetDate).toLocaleDateString('de-DE') : '–'}</td>
									<td>{assignment.targetEvent || '–'}</td>
									<td>
										<div class="progress-bar">
											<div class="progress" style="width: {assignment.progress}%"></div>
										</div>
										<span class="progress-text">{assignment.progress}%</span>
									</td>
									<td>
										<button 
											class="btn btn-small btn-danger" 
											on:click={() => removeAssignment(assignment.userId, assignment.planId)}
										>
											Entfernen
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.training-plans-admin {
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.page-header {
		margin-bottom: 2rem;
	}
	
	.page-header h1 {
		font-size: 1.75rem;
		margin: 0;
		color: var(--primary);
	}
	
	.loading-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}
	
	.spinner {
		width: 2.5rem;
		height: 2.5rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-radius: 50%;
		border-top-color: var(--primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.error-message {
		background-color: rgba(231, 76, 60, 0.2);
		border-left: 4px solid #e74c3c;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}
	
	.success-message {
		background-color: rgba(46, 204, 113, 0.2);
		border-left: 4px solid #2ecc71;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
		position: relative;
	}
	
	.close-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		background: transparent;
		border: none;
		color: #2ecc71;
		font-size: 1.25rem;
		cursor: pointer;
	}
	
	.admin-section {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.admin-section h2 {
		font-size: 1.25rem;
		margin: 0 0 1.5rem 0;
		color: var(--primary);
	}
	
	.assignment-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.form-group label {
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.form-group select,
	.form-group input {
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		padding: 0.75rem;
		color: var(--text);
		font-size: 1rem;
	}
	
	.form-group select:focus,
	.form-group input:focus {
		border-color: var(--primary);
		outline: none;
	}
	
	.form-actions {
		margin-top: 1rem;
	}
	
	.empty-state {
		text-align: center;
		padding: 2rem;
		color: var(--text-light);
	}
	
	.assignment-list {
		overflow-x: auto;
	}
	
	table {
		width: 100%;
		border-collapse: collapse;
	}
	
	thead {
		background-color: rgba(0, 0, 0, 0.3);
	}
	
	th, td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	th {
		font-weight: 500;
		color: var(--primary);
	}
	
	.progress-bar {
		width: 100px;
		height: 8px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.25rem;
	}
	
	.progress {
		height: 100%;
		background-color: var(--primary);
	}
	
	.progress-text {
		font-size: 0.8rem;
		color: var(--text-light);
	}
	
	.btn-small {
		font-size: 0.8rem;
		padding: 0.25rem 0.5rem;
	}
	
	.btn-danger {
		background-color: rgba(231, 76, 60, 0.2);
		color: #e74c3c;
		border: 1px solid rgba(231, 76, 60, 0.3);
	}
	
	.btn-danger:hover {
		background-color: rgba(231, 76, 60, 0.3);
	}
</style>
