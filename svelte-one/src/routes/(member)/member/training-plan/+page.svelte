<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	let user;
	let isLoading = true;
	let activePlanId = null;
	let weekIndex = 0;
	let userTrainingPlans = [];
	let activePlan = null;
	let error = null;
	let progressPercentage = 0;
	let dbStatus = null;

	// Funktion zum Laden der Trainingspläne des Benutzers
	async function loadUserPlans() {
		try {
			isLoading = true;
			error = null;
			const response = await fetch('/api/user/training-plans');
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Laden der Trainingspläne');
			}
			
			const data = await response.json();
			userTrainingPlans = data.plans || [];
			
			// Speichere den Datenbankstatus, wenn vorhanden
			if (data.dbStatus) {
				dbStatus = data.dbStatus;
			}
			
			// Aktiven Plan finden
			const active = userTrainingPlans.find(p => p.isActive);
			if (active) {
				activePlanId = active.id;
				progressPercentage = active.progress || 0;
				await loadPlanDetails(activePlanId);
			}
		} catch (err) {
			console.error('Fehler beim Laden der Trainingspläne:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	// Funktion zum Laden der Details eines Plans
	async function loadPlanDetails(planId) {
		try {
			isLoading = true;
			const response = await fetch(`/api/user/training-plans?planId=${planId}`);
			
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Laden der Plandetails');
			}
			
			const data = await response.json();
			activePlan = data.plan;
			
			// Setze die Wochenansicht auf die aktuelle Woche
			weekIndex = Math.min(activePlan.currentWeek - 1, activePlan.weeks.length - 1);
		} catch (err) {
			console.error('Fehler beim Laden der Plandetails:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}
	
	// Funktion zum Markieren einer Trainingseinheit als abgeschlossen
	async function toggleSessionCompleted(dayIndex) {
		if (!activePlan) return;
		
		try {
			// Wir arbeiten mit der aktuellen Woche (Index ist 0-basiert, aber API erwartet 1-basierte Wochen)
			const currentWeek = activePlan.weeks[weekIndex];
			const weekNumber = currentWeek.weekNumber;
			
			// Aktuellen Status umkehren
			const newCompletedStatus = !currentWeek.sessions[dayIndex].completed;
			
			// Optimistisches UI-Update
			currentWeek.sessions[dayIndex].completed = newCompletedStatus;
			
			// API-Aufruf, um den Status zu speichern
			const response = await fetch('/api/user/training-plans', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					planId: activePlanId,
					weekNumber: weekNumber,
					sessionIndex: dayIndex,
					completed: newCompletedStatus
				})
			});
			
			if (!response.ok) {
				// Bei Fehler den Status zurücksetzen
				currentWeek.sessions[dayIndex].completed = !newCompletedStatus;
				const errorData = await response.json();
				throw new Error(errorData.error || 'Fehler beim Aktualisieren des Trainingsstatus');
			}
			
			// Erfolgsbenachrichtigung
			console.log(`Training für ${currentWeek.sessions[dayIndex].day} auf ${newCompletedStatus ? 'erledigt' : 'nicht erledigt'} gesetzt`);
		} catch (err) {
			console.error('Fehler beim Aktualisieren des Trainingsstatus:', err);
			error = err.message;
		}
	}
	
	// Funktion zum Exportieren des Trainingsplans in verschiedenen Formaten
	function exportTrainingPlan(format) {
		if (!activePlanId) return;
		
		// URL für den Download erstellen
		const downloadUrl = `/api/user/export-plan?planId=${activePlanId}&format=${format}`;
		
		// Neues Fenster öffnen oder Datei herunterladen
		if (format === 'pdf') {
			// PDF in neuem Tab anzeigen
			window.open(downloadUrl, '_blank');
		} else {
			// ICS oder CSV direkt herunterladen
			const link = document.createElement('a');
			link.href = downloadUrl;
			link.download = `trainingsplan-${format}.${format}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
	
	// Trainingsplan laden, wenn die Komponente gemountet wird
	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			user = state.user;
			if (user) {
				loadUserPlans();
			}
		});
		
		return unsubscribe;
	});
</script>

<div class="training-plan-page">
	<div class="page-header">
		<h1>Mein Trainingsplan</h1>
	</div>
	
	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Trainingsplan wird geladen...</p>
		</div>
	{:else if error}
		<div class="error-message">
			<p>{error}</p>
			<button class="btn btn-primary" on:click={loadUserPlans}>Erneut versuchen</button>
		</div>
	{:else if activePlan}		<div class="plan-overview">			
			<div class="plan-header">
				<div class="plan-title">
					<h2>{activePlan.title}</h2>
					<span class="plan-progress">Woche {activePlan.currentWeek} von {activePlan.weeks.length}</span>
				</div>
				
				<div class="plan-actions">
					<div class="dropdown">
						<button class="btn btn-small">
							<i class="material-icons">file_download</i>
							Exportieren
						</button>
						<div class="dropdown-content">
							<button on:click={() => exportTrainingPlan('ics')}>Als Kalender (ICS)</button>
							<button on:click={() => exportTrainingPlan('csv')}>Als Tabelle (CSV)</button>
							<button on:click={() => exportTrainingPlan('pdf')}>Als PDF</button>
						</div>
					</div>
				</div>
				
				<div class="plan-target">
					{#if activePlan.targetEvent}
						<div class="target-event">
							<i class="material-icons">event</i>
							<span>{activePlan.targetEvent}</span>
						</div>
					{/if}
					
					{#if activePlan.targetDate}
						<div class="target-date">
							<i class="material-icons">calendar_today</i>
							<span>Zieldatum: {new Date(activePlan.targetDate).toLocaleDateString('de-DE')}</span>
						</div>
					{/if}
				</div>
			</div>
					<div class="progress-container">
				<div class="progress-info">
					<span class="progress-label">Fortschritt</span>
					<span class="progress-percentage">{progressPercentage}%</span>
				</div>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercentage}%"></div>
				</div>
				{#if dbStatus}
					<div class="db-status {dbStatus.status === 'connected' ? 'connected' : 'disconnected'}">
						<i class="material-icons">{dbStatus.status === 'connected' ? 'cloud_done' : 'cloud_off'}</i>
						<span>{dbStatus.message || (dbStatus.status === 'connected' ? 'Daten aus Datenbank' : 'Lokale Daten')}</span>
					</div>
				{/if}
			</div>
			
			<div class="week-navigation">
				<button 
					class="btn btn-icon" 
					disabled={weekIndex === 0}
					on:click={() => weekIndex = Math.max(0, weekIndex - 1)}
				>
					<i class="material-icons">chevron_left</i>
				</button>
				
				<div class="current-week">
					Woche {activePlan.weeks[weekIndex].weekNumber}
				</div>
				
				<button 
					class="btn btn-icon" 
					disabled={weekIndex >= activePlan.weeks.length - 1}
					on:click={() => weekIndex = Math.min(activePlan.weeks.length - 1, weekIndex + 1)}
				>
					<i class="material-icons">chevron_right</i>
				</button>
			</div>
			
			<div class="week-schedule">
				{#each activePlan.weeks[weekIndex].sessions as session, i}
					<div class="training-day {session.completed ? 'completed' : ''}">
						<div class="day-header">
							<span class="day-name">{session.day}</span>
							{#if session.type !== 'Ruhetag'}
								<button class="btn btn-small" on:click={() => toggleSessionCompleted(i)}>
									{session.completed ? 'Erledigt ✓' : 'Als erledigt markieren'}
								</button>
							{/if}
						</div>
						
						<div class="training-info">
							<div class="training-type">
								<span class="icon {session.type === 'Ruhetag' ? 'rest' : session.type === 'Intervall' ? 'interval' : 'run'}">
									<i class="material-icons">
										{#if session.type === 'Ruhetag'}
											hotel
										{:else if session.type === 'Intervall'}
											speed
										{:else}
											directions_run
										{/if}
									</i>
								</span>
								<h3>{session.type}</h3>
							</div>
							
							<p class="training-description">{session.description}</p>
							
							{#if session.duration || session.distance}
								<div class="training-stats">
									{#if session.duration}
										<div class="stat">
											<i class="material-icons">schedule</i>
											<span>{session.duration} min</span>
										</div>
									{/if}
									
									{#if session.distance}
										<div class="stat">
											<i class="material-icons">straighten</i>
											<span>{session.distance} km</span>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else if userTrainingPlans && userTrainingPlans.length > 0}
		<div class="plan-selection">
			<h2>Wähle einen Trainingsplan</h2>
			<div class="plans-grid">
				{#each userTrainingPlans as plan}
					<div class="plan-card">
						<h3>{plan.title}</h3>
						<p>{plan.description}</p>
						<div class="plan-details">
							<div class="plan-detail">
								<i class="material-icons">fitness_center</i>
								<span>{plan.level}</span>
							</div>
							<div class="plan-detail">
								<i class="material-icons">straighten</i>
								<span>{plan.distance}</span>
							</div>
							<div class="plan-detail">
								<i class="material-icons">event</i>
								<span>{plan.duration}</span>
							</div>
						</div>
						<button class="btn btn-primary" on:click={() => loadPlanDetails(plan.id)}>
							Trainingsplan anzeigen
						</button>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="no-plan">
			<p>Du hast aktuell keinen aktiven Trainingsplan.</p>
			<a href="/plans" class="btn btn-primary">Trainingsplan auswählen</a>
		</div>
	{/if}
</div>

<style>
	.training-plan-page {
		padding: 2rem;
		max-width: 900px;
		margin: 0 auto;
	}
	
	.page-header h1 {
		font-size: 1.5rem;
		color: var(--primary);
		margin-bottom: 2rem;
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}
	
	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-radius: 50%;
		border-top-color: var(--primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	
	.error-message {
		background-color: rgba(231, 76, 60, 0.2);
		border-left: 4px solid #e74c3c;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
	}
	
	.plan-overview {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 1.5rem;
	}
	
	.plan-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}
	
	.plan-title h2 {
		font-size: 1.25rem;
		color: var(--primary);
		margin: 0 0 0.5rem 0;
	}
	
	.plan-progress {
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.plan-actions {
		display: flex;
		gap: 1rem;
	}
	
	.dropdown {
		position: relative;
		display: inline-block;
	}
	
	.dropdown-content {
		display: none;
		position: absolute;
		right: 0;
		background-color: rgba(0, 0, 0, 0.9);
		min-width: 200px;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
		z-index: 1;
		border-radius: 4px;
		overflow: hidden;
	}
	
	.dropdown:hover .dropdown-content {
		display: flex;
		flex-direction: column;
	}
	
	.dropdown-content button {
		background: none;
		border: none;
		padding: 0.75rem 1rem;
		text-align: left;
		color: var(--text);
		font-size: 0.9rem;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.dropdown-content button:hover {
		background-color: rgba(255, 255, 255, 0.1);
		color: var(--primary);
	}
	
	.plan-target {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.target-event, .target-date {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
	}
	
	.target-event i, .target-date i {
		font-size: 1.2rem;
		color: var(--primary);
	}
	
	.progress-container {
		margin-bottom: 1.5rem;
		background-color: rgba(255, 255, 255, 0.05);
		padding: 1rem;
		border-radius: 6px;
	}
	
	.progress-info {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
	
	.progress-label {
		font-weight: 500;
	}
	
	.progress-percentage {
		color: var(--primary);
		font-weight: 500;
	}
	
	.progress-bar {
		height: 10px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 5px;
		overflow: hidden;
		margin-bottom: 0.75rem;
	}
	
	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--primary) 0%, #3498db 100%);
		border-radius: 5px;
		transition: width 0.3s ease;
	}
	
	.db-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-light);
	}
	
	.db-status.connected {
		color: #2ecc71;
	}
	
	.db-status.disconnected {
		color: #e67e22;
	}
	
	.db-status i {
		font-size: 1rem;
	}
	
	.week-navigation {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 1.5rem;
		gap: 1rem;
	}
	
	.current-week {
		font-size: 1.1rem;
		font-weight: 500;
	}
	
	.week-schedule {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}
	
	.training-day {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
		padding: 1rem;
		transition: all 0.3s ease;
	}
	
	.training-day.completed {
		border-left: 4px solid #27ae60;
	}
	
	.day-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	
	.day-name {
		font-weight: 500;
		color: var(--text);
	}
	
	.training-type {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}
	
	.training-type h3 {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
	}
	
	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
	}
	
	.icon.run {
		background-color: rgba(52, 152, 219, 0.2);
		color: #3498db;
	}
	
	.icon.interval {
		background-color: rgba(231, 76, 60, 0.2);
		color: #e74c3c;
	}
	
	.icon.rest {
		background-color: rgba(46, 204, 113, 0.2);
		color: #2ecc71;
	}
	
	.training-description {
		font-size: 0.9rem;
		color: var(--text-light);
		margin-bottom: 1rem;
	}
	
	.training-stats {
		display: flex;
		gap: 1rem;
		font-size: 0.9rem;
	}
	
	.stat {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-light);
	}
	
	.stat i {
		font-size: 1.1rem;
		color: var(--primary);
	}
	
	.plan-selection {
		padding: 1.5rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}
	
	.plan-selection h2 {
		font-size: 1.25rem;
		color: var(--primary);
		margin-bottom: 1.5rem;
		text-align: center;
	}
	
	.plans-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}
	
	.plan-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.plan-card h3 {
		font-size: 1.1rem;
		color: var(--primary);
		margin: 0;
	}
	
	.plan-details {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}
	
	.plan-detail {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.plan-detail i {
		font-size: 1.1rem;
		color: var(--primary);
	}
	
	.no-plan {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		gap: 1.5rem;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 3rem;
		text-align: center;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
