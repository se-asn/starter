<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { writable } from 'svelte/store';

	// Simulierte Trainingsdaten (später durch API-Abfrage ersetzen)
	const trainingPlan = writable({
		title: '10K Training - Anfänger',
		currentWeek: 2,
		totalWeeks: 8,
		nextSession: {
			day: 'Heute',
			type: 'Tempovariationen',
			distance: '5 km',
			description: '5 Min warm laufen, dann 5x (3 Min zügig, 2 Min locker), 5 Min auslaufen'
		},
		weeklyOverview: [
			{ day: 'Montag', completed: true, activity: 'Ruhepause', distance: '-' },
			{ day: 'Dienstag', completed: true, activity: 'Dauerlauf', distance: '4 km' },
			{ day: 'Mittwoch', completed: false, activity: 'Ruhepause', distance: '-' },
			{ day: 'Donnerstag', completed: false, activity: 'Tempovariationen', distance: '5 km' },
			{ day: 'Freitag', completed: false, activity: 'Ruhepause', distance: '-' },
			{ day: 'Samstag', completed: false, activity: 'Dauerlauf', distance: '7 km' },
			{ day: 'Sonntag', completed: false, activity: 'Längster Lauf der Woche', distance: '9 km' }
		]
	});

	const progress = writable({
		completedSessions: 8,
		totalSessions: 24,
		progressPercent: 33
	});

	let isLoading = true;
	let user;

	const unsubscribe = authStore.subscribe((state) => {
		user = state.user;
	});

	onMount(() => {
		// Hier später API-Abfrage für die Trainingsdaten
		setTimeout(() => {
			isLoading = false;
		}, 800);

		return unsubscribe;
	});

	function markAsCompleted() {
		// Später: API-Aufruf, um die Trainingseinheit als erledigt zu markieren
		trainingPlan.update((plan) => {
			const index = plan.weeklyOverview.findIndex((day) => !day.completed);
			if (index !== -1) {
				plan.weeklyOverview[index].completed = true;
			}
			return plan;
		});

		progress.update((p) => {
			p.completedSessions += 1;
			p.progressPercent = Math.round((p.completedSessions / p.totalSessions) * 100);
			return p;
		});
	}
</script>

<svelte:head>
	<title>Dashboard | LaufPlaner Pro</title>
	<meta
		name="description"
		content="Dein persönliches Lauftraining Dashboard - Aktuelle Trainingseinheiten, Fortschritt und Tipps."
	/>
</svelte:head>

<div class="dashboard-container">
	<header class="dashboard-header">
		<h1>Willkommen, {user?.name || 'Läufer'}</h1>
		<p class="current-date">
			{new Date().toLocaleDateString('de-DE', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}
		</p>
	</header>

	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Trainingsplan wird geladen...</p>
		</div>
	{:else}
		<div class="dashboard-content">
			<div class="dashboard-grid">
				<section class="next-session card">
					<div class="card-header">
						<h2>Nächste Trainingseinheit</h2>
					</div>
					<div class="card-body">
						<div class="session-details">
							<div class="session-time">{$trainingPlan.nextSession.day}</div>
							<div class="session-type">{$trainingPlan.nextSession.type}</div>
							<div class="session-distance">{$trainingPlan.nextSession.distance}</div>
						</div>
						<p class="session-description">{$trainingPlan.nextSession.description}</p>
					</div>
					<div class="card-footer">
						<button class="btn-primary" on:click={markAsCompleted}>
							<span class="material-icons">check_circle</span>
							<span>Als erledigt markieren</span>
						</button>
					</div>
				</section>

				<section class="progress-section card">
					<div class="card-header">
						<h2>Dein Fortschritt</h2>
					</div>
					<div class="card-body">
						<div class="progress-stats">
							<div class="progress-bar-container">
								<div class="progress-bar">
									<div class="progress" style="width: {$progress.progressPercent}%"></div>
								</div>
							</div>
							<div class="progress-text">
								<span class="week-display"
									>Woche {$trainingPlan.currentWeek} von {$trainingPlan.totalWeeks}</span
								>
								<span class="session-count"
									>{$progress.completedSessions} von {$progress.totalSessions} Einheiten absolviert</span
								>
							</div>
						</div>
					</div>
				</section>

				<section class="weekly-overview card">
					<div class="card-header">
						<h2>Wochenübersicht</h2>
					</div>
					<div class="card-body">
						<div class="week-table-wrapper">
							<table class="week-table">
								<thead>
									<tr>
										<th>Tag</th>
										<th>Training</th>
										<th>Distanz</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{#each $trainingPlan.weeklyOverview as day}
										<tr class={day.completed ? 'completed' : ''}>
											<td>{day.day}</td>
											<td>{day.activity}</td>
											<td>{day.distance}</td>
											<td>
												<span class="status-indicator" class:done={day.completed}></span>
												{day.completed ? 'Erledigt' : 'Ausstehend'}
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
					<div class="card-footer">
						<a href="/member/training-plan" class="btn-text">
							<span>Vollständigen Plan anzeigen</span>
							<span class="material-icons">arrow_forward</span>
						</a>
					</div>
				</section>

				<section class="tips card">
					<div class="card-header">
						<h2>Tipp der Woche</h2>
					</div>
					<div class="card-body">
						<div class="tip-content">
							<h3>Richtige Lauftechnik</h3>
							<p>
								Eine gute Lauftechnik hilft dir, effizienter zu laufen und Verletzungen vorzubeugen.
								Achte auf eine aufrechte Körperhaltung, einen mittleren Fußaufsatz und eine
								entspannte Armhaltung mit 90-Grad-Winkel im Ellbogen.
							</p>
							<a href="/member/tips" class="tip-link">Mehr Tipps &rarr;</a>
						</div>
					</div>
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.dashboard-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.dashboard-header {
		margin-bottom: 2rem;
	}

	h1 {
		margin-bottom: 0.5rem;
		color: var(--text-light);
	}

	.current-date {
		color: var(--text-gray);
	}

	.dashboard-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.card {
		background-color: var(--dark-gray);
		border-radius: 8px;
		overflow: hidden;
		border: 1px solid rgba(0, 242, 254, 0.1);
		height: fit-content;
	}

	.weekly-overview {
		grid-column: 1 / -1;
	}

	.card-header {
		padding: 1.25rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		background-color: rgba(0, 0, 0, 0.1);
	}

	.card-header h2 {
		font-size: 1.25rem;
		margin: 0;
		color: var(--primary);
	}

	.card-body {
		padding: 1.5rem;
	}

	.card-footer {
		padding: 1rem 1.5rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.1);
		border-top: 1px solid rgba(255, 255, 255, 0.05);
	}

	.session-details {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
		padding-bottom: 1rem;
	}

	.session-time {
		background-color: var(--primary);
		color: var(--dark);
		padding: 0.25rem 0.75rem;
		border-radius: 4px;
		font-weight: 600;
	}

	.session-type {
		font-weight: 600;
		color: var(--text-light);
	}

	.session-distance {
		color: var(--text-gray);
	}

	.session-description {
		color: var(--text-light);
		line-height: 1.5;
	}

	.btn-primary {
		background-color: var(--primary);
		color: var(--dark);
		border: none;
		border-radius: 4px;
		padding: 0.5rem 1rem;
		cursor: pointer;
		font-weight: 600;
		transition: background-color 0.2s;
		display: flex;
		align-items: center;
	}

	.btn-primary:hover {
		background-color: rgba(0, 242, 254, 0.8);
	}

	.btn-primary .material-icons {
		margin-right: 0.5rem;
		font-size: 1.1rem;
	}

	.btn-text {
		color: var(--primary);
		background: none;
		border: none;
		padding: 0.5rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		text-decoration: none;
	}

	.btn-text .material-icons {
		margin-left: 0.5rem;
		font-size: 1.1rem;
	}

	.btn-text:hover {
		text-decoration: underline;
	}

	.progress-bar-container {
		margin-bottom: 1rem;
	}

	.progress-bar {
		height: 8px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background-color: var(--primary);
	}

	.progress-text {
		display: flex;
		justify-content: space-between;
		color: var(--text-gray);
	}

	.week-table-wrapper {
		overflow-x: auto;
	}

	.week-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}

	.week-table th,
	.week-table td {
		padding: 0.75rem;
	}

	.week-table th {
		color: var(--text-light);
		font-weight: 600;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.week-table tr {
		border-bottom: 1px solid rgba(255, 255, 255, 0.05);
	}

	.week-table tr:last-child {
		border-bottom: none;
	}

	.week-table tr.completed {
		background-color: rgba(0, 242, 254, 0.05);
	}

	.status-indicator {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--text-gray);
		margin-right: 0.5rem;
	}

	.status-indicator.done {
		background-color: #4caf50;
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
		color: var(--text-gray);
	}

	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-top: 3px solid var(--primary);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	.tip-content h3 {
		color: var(--primary);
		margin-top: 0;
		margin-bottom: 0.75rem;
	}

	.tip-content p {
		color: var(--text-light);
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.tip-link {
		color: var(--primary);
		text-decoration: none;
	}

	.tip-link:hover {
		text-decoration: underline;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Responsive Design - für bessere mobile Darstellung */
	@media (max-width: 768px) {
		.dashboard-grid {
			grid-template-columns: 1fr;
		}

		.session-details {
			flex-direction: column;
			gap: 0.5rem;
			align-items: flex-start;
		}

		.session-time {
			margin-bottom: 0.5rem;
		}

		.progress-text {
			flex-direction: column;
			gap: 0.5rem;
		}

		.card-header {
			padding: 1rem;
		}

		.card-body {
			padding: 1rem;
		}
	}
</style>
