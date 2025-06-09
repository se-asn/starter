<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	let user;
	let isLoading = true;
	let activeTab = 'overview';

	// Dummy-Daten für die Fortschrittsanzeige (in einer echten App würden diese vom Server kommen)
	const progressData = {
		overall: {
			completedSessions: 23,
			totalSessions: 48,
			progressPercent: 48,
			kilometersRun: 78.6,
			hoursTraining: 12.5,
			sessionsPerWeek: 3.2
		},
		recentActivities: [
			{
				date: '2025-05-16',
				type: 'Intervalltraining',
				distance: 5.2,
				duration: 32,
				pace: '6:09',
				notes: 'Fühlte mich stark, konnte das Tempo gut halten.'
			},
			{
				date: '2025-05-14',
				type: 'Leichter Lauf',
				distance: 4.0,
				duration: 25,
				pace: '6:15',
				notes: 'Erholungslauf nach dem Intervalltraining vom Dienstag.'
			},
			{
				date: '2025-05-12',
				type: 'Tempowechsel',
				distance: 6.1,
				duration: 38,
				pace: '6:13',
				notes: 'Schwere Beine zu Beginn, aber dann gut reingefunden.'
			},
			{
				date: '2025-05-10',
				type: 'Längerer Lauf',
				distance: 9.5,
				duration: 60,
				pace: '6:19',
				notes: 'Gleichmäßiges Tempo gehalten, etwas müde gegen Ende.'
			}
		],
		performance: {
			paceImprovement: 8.3, // Prozent schneller im Vergleich zum Beginn
			distanceImprovement: 42.5, // Prozent mehr Distanz im Vergleich zum Beginn
			weeklyData: [
				{ week: 1, avgPace: 415, distance: 12.5 }, // Pace in Sekunden pro km
				{ week: 2, avgPace: 402, distance: 15.3 },
				{ week: 3, avgPace: 395, distance: 16.8 },
				{ week: 4, avgPace: 390, distance: 18.2 },
				{ week: 5, avgPace: 385, distance: 19.5 },
				{ week: 6, avgPace: 380, distance: 21.0 }
			]
		}
	};

	// Funktion zum Formatieren des Datums
	function formatDate(dateString) {
		const date = new Date(dateString);
		return date.toLocaleDateString('de-DE', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	// Funktion zum Konvertieren von Sekunden in MM:SS Format
	function formatPace(seconds) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = Math.floor(seconds % 60);
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	// In einer echten App würden die Fortschrittsdaten vom Server geladen werden
	onMount(() => {
		// Simulation einer API-Anfrage
		setTimeout(() => {
			isLoading = false;
		}, 800);
	});
</script>

<div class="progress-page">
	<div class="page-header">
		<h1>Mein Fortschritt</h1>
	</div>

	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Fortschrittsdaten werden geladen...</p>
		</div>
	{:else}
		<div class="tabs">
			<button 
				class="tab-button {activeTab === 'overview' ? 'active' : ''}" 
				on:click={() => activeTab = 'overview'}
			>
				Übersicht
			</button>
			<button 
				class="tab-button {activeTab === 'activities' ? 'active' : ''}" 
				on:click={() => activeTab = 'activities'}
			>
				Aktivitäten
			</button>
			<button 
				class="tab-button {activeTab === 'performance' ? 'active' : ''}" 
				on:click={() => activeTab = 'performance'}
			>
				Leistung
			</button>
		</div>

		<div class="tab-content">
			{#if activeTab === 'overview'}
				<div class="overview-tab">
					<div class="stats-grid">
						<div class="stat-card">
							<h3>Trainingsplan</h3>
							<div class="progress-circle" style="--progress: {progressData.overall.progressPercent}%">
								<span class="progress-text">{progressData.overall.progressPercent}%</span>
							</div>
							<p class="progress-description">
								{progressData.overall.completedSessions} von {progressData.overall.totalSessions} Einheiten absolviert
							</p>
						</div>

						<div class="stat-card">
							<h3>Gesamtdistanz</h3>
							<div class="stat-value">{progressData.overall.kilometersRun.toFixed(1)}</div>
							<div class="stat-unit">Kilometer</div>
						</div>

						<div class="stat-card">
							<h3>Trainingszeit</h3>
							<div class="stat-value">{progressData.overall.hoursTraining.toFixed(1)}</div>
							<div class="stat-unit">Stunden</div>
						</div>

						<div class="stat-card">
							<h3>Sessions pro Woche</h3>
							<div class="stat-value">{progressData.overall.sessionsPerWeek.toFixed(1)}</div>
							<div class="stat-unit">Ø Einheiten</div>
						</div>
					</div>

					<div class="recent-activity">
						<h3>Letzte Aktivität</h3>
						{#if progressData.recentActivities.length > 0}
							<div class="activity-card">
								<div class="activity-header">
									<div class="activity-date">{formatDate(progressData.recentActivities[0].date)}</div>
									<div class="activity-type">{progressData.recentActivities[0].type}</div>
								</div>
								
								<div class="activity-stats">
									<div class="activity-stat">
										<span class="stat-label">Distanz</span>
										<span class="stat-value">{progressData.recentActivities[0].distance.toFixed(1)} km</span>
									</div>
									
									<div class="activity-stat">
										<span class="stat-label">Dauer</span>
										<span class="stat-value">{progressData.recentActivities[0].duration} min</span>
									</div>
									
									<div class="activity-stat">
										<span class="stat-label">Pace</span>
										<span class="stat-value">{progressData.recentActivities[0].pace} min/km</span>
									</div>
								</div>
								
								{#if progressData.recentActivities[0].notes}
									<div class="activity-notes">
										<span class="notes-label">Notizen:</span>
										<p>{progressData.recentActivities[0].notes}</p>
									</div>
								{/if}
							</div>
						{:else}
							<p>Keine Aktivitäten vorhanden.</p>
						{/if}
					</div>
				</div>
			{:else if activeTab === 'activities'}
				<div class="activities-tab">
					<h3>Meine Aktivitäten</h3>
					
					{#if progressData.recentActivities.length > 0}
						<div class="activity-list">
							{#each progressData.recentActivities as activity}
								<div class="activity-card">
									<div class="activity-header">
										<div class="activity-date">{formatDate(activity.date)}</div>
										<div class="activity-type">{activity.type}</div>
									</div>
									
									<div class="activity-stats">
										<div class="activity-stat">
											<span class="stat-label">Distanz</span>
											<span class="stat-value">{activity.distance.toFixed(1)} km</span>
										</div>
										
										<div class="activity-stat">
											<span class="stat-label">Dauer</span>
											<span class="stat-value">{activity.duration} min</span>
										</div>
										
										<div class="activity-stat">
											<span class="stat-label">Pace</span>
											<span class="stat-value">{activity.pace} min/km</span>
										</div>
									</div>
									
									{#if activity.notes}
										<div class="activity-notes">
											<span class="notes-label">Notizen:</span>
											<p>{activity.notes}</p>
										</div>
									{/if}
								</div>
							{/each}
						</div>
						
						<div class="load-more">
							<button class="btn btn-outline">Mehr laden</button>
						</div>
					{:else}
						<p>Keine Aktivitäten vorhanden.</p>
					{/if}
				</div>
			{:else if activeTab === 'performance'}
				<div class="performance-tab">
					<div class="improvement-cards">
						<div class="improvement-card">
							<h3>Tempo-Verbesserung</h3>
							<div class="improvement-value positive">+{progressData.performance.paceImprovement.toFixed(1)}%</div>
							<p>Dein durchschnittliches Tempo hat sich verbessert</p>
						</div>
						
						<div class="improvement-card">
							<h3>Distanz-Steigerung</h3>
							<div class="improvement-value positive">+{progressData.performance.distanceImprovement.toFixed(1)}%</div>
							<p>Deine wöchentliche Laufdistanz hat sich erhöht</p>
						</div>
					</div>
					
					<div class="performance-charts">
						<div class="chart-container">
							<h3>Tempo-Entwicklung</h3>
							<div class="chart pace-chart">
								<div class="chart-y-axis">
									<span>6:00</span>
									<span>6:30</span>
									<span>7:00</span>
								</div>
								
								<div class="chart-bars">
									{#each progressData.performance.weeklyData as data}
										<div class="chart-bar-container">
											<!-- Berechne Höhe basierend auf Pace (415s = 6:55 => niedrig, 380s = 6:20 => hoch) -->
											<!-- Skala von 380s bis 420s -->
											<div class="chart-bar" style="height: {100 - ((data.avgPace - 380) / (420 - 380) * 100)}%;">
												<div class="bar-tooltip">{formatPace(data.avgPace)} min/km</div>
											</div>
											<div class="chart-label">W{data.week}</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
						
						<div class="chart-container">
							<h3>Distanz-Entwicklung</h3>
							<div class="chart distance-chart">
								<div class="chart-y-axis">
									<span>25 km</span>
									<span>15 km</span>
									<span>5 km</span>
								</div>
								
								<div class="chart-bars">
									{#each progressData.performance.weeklyData as data}
										<div class="chart-bar-container">
											<!-- Berechne Höhe basierend auf Distanz (max ca. 25km) -->
											<div class="chart-bar" style="height: {(data.distance / 25) * 100}%;">
												<div class="bar-tooltip">{data.distance.toFixed(1)} km</div>
											</div>
											<div class="chart-label">W{data.week}</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.progress-page {
		padding: 2rem;
		max-width: 1000px;
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
	
	.tabs {
		display: flex;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		margin-bottom: 2rem;
	}
	
	.tab-button {
		background: none;
		border: none;
		padding: 0.75rem 1.5rem;
		color: var(--text-light);
		font-size: 1rem;
		cursor: pointer;
		position: relative;
		transition: all 0.3s ease;
	}
	
	.tab-button.active {
		color: var(--primary);
	}
	
	.tab-button.active::after {
		content: '';
		position: absolute;
		bottom: -1px;
		left: 0;
		right: 0;
		height: 2px;
		background-color: var(--primary);
	}
	
	.tab-content {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 1.5rem;
	}
	
	/* Übersichts-Tab Styling */
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.stat-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.stat-card h3 {
		font-size: 1rem;
		font-weight: 500;
		margin: 0 0 1rem 0;
		color: var(--text-light);
	}
	
	.progress-circle {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		background: conic-gradient(
			var(--primary) 0% var(--progress),
			rgba(255, 255, 255, 0.1) var(--progress) 100%
		);
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-bottom: 1rem;
	}
	
	.progress-circle::before {
		content: '';
		position: absolute;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.7);
	}
	
	.progress-text {
		position: relative;
		z-index: 1;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--primary);
	}
	
	.progress-description {
		font-size: 0.9rem;
		color: var(--text-light);
		margin: 0;
	}
	
	.stat-value {
		font-size: 2rem;
		font-weight: 600;
		color: var(--primary);
		margin-bottom: 0.5rem;
	}
	
	.stat-unit {
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.recent-activity h3 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		color: var(--text);
	}
	
	/* Aktivitäten Styling */
	.activity-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.25rem;
		margin-bottom: 1rem;
	}
	
	.activity-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.activity-date {
		font-weight: 500;
		color: var(--text);
	}
	
	.activity-type {
		color: var(--primary);
		font-weight: 500;
	}
	
	.activity-stats {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	
	.activity-stat {
		display: flex;
		flex-direction: column;
		text-align: center;
	}
	
	.stat-label {
		font-size: 0.8rem;
		color: var(--text-light);
		margin-bottom: 0.25rem;
	}
	
	.activity-notes {
		padding-top: 0.75rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.notes-label {
		font-weight: 500;
		font-size: 0.9rem;
	}
	
	.activity-notes p {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	.load-more {
		text-align: center;
		margin-top: 1.5rem;
	}
	
	/* Performance Tab Styling */
	.improvement-cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.improvement-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
	}
	
	.improvement-card h3 {
		font-size: 1rem;
		font-weight: 500;
		margin: 0 0 1rem 0;
		color: var(--text-light);
	}
	
	.improvement-value {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
	
	.improvement-value.positive {
		color: #2ecc71;
	}
	
	.improvement-value.negative {
		color: #e74c3c;
	}
	
	.improvement-card p {
		font-size: 0.9rem;
		color: var(--text-light);
		margin: 0;
	}
	
	.performance-charts {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 2rem;
	}
	
	.chart-container {
		margin-top: 1.5rem;
	}
	
	.chart-container h3 {
		font-size: 1rem;
		margin-bottom: 1.5rem;
		text-align: center;
	}
	
	.chart {
		display: flex;
		height: 250px;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 1.5rem;
	}
	
	.chart-y-axis {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-right: 1rem;
		width: 60px;
		color: var(--text-light);
		font-size: 0.8rem;
	}
	
	.chart-bars {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		flex-grow: 1;
		height: 100%;
	}
	
	.chart-bar-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
		position: relative;
	}
	
	.chart-bar {
		width: 30px;
		background-color: var(--primary);
		border-radius: 3px 3px 0 0;
		position: relative;
		transition: all 0.3s ease;
	}
	
	.pace-chart .chart-bar {
		background-color: #3498db;
	}
	
	.distance-chart .chart-bar {
		background-color: #2ecc71;
	}
	
	.chart-bar:hover .bar-tooltip {
		opacity: 1;
		transform: translateY(0);
	}
	
	.bar-tooltip {
		position: absolute;
		top: -30px;
		left: 50%;
		transform: translateX(-50%) translateY(10px);
		background-color: rgba(0, 0, 0, 0.8);
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		white-space: nowrap;
		opacity: 0;
		transition: all 0.3s ease;
	}
	
	.bar-tooltip::after {
		content: '';
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
		border-width: 5px 5px 0;
		border-style: solid;
		border-color: rgba(0, 0, 0, 0.8) transparent transparent;
	}
	
	.chart-label {
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: var(--text-light);
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	@media (max-width: 768px) {
		.tabs {
			overflow-x: auto;
			white-space: nowrap;
		}
		
		.performance-charts {
			grid-template-columns: 1fr;
		}
		
		.activity-stats {
			flex-direction: column;
			gap: 1rem;
		}
		
		.activity-stat {
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>
