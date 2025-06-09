<script>
	import { onMount } from 'svelte';
	
	let userStats = {
		total: 0,
		active: 0,
		withPlans: 0,
		activeLastWeek: 0,
		activeLastMonth: 0,
		growth: 0,
		completionRate: 0
	};
	
	let planStats = {
		total: 0,
		assigned: 0,
		completed: 0,
		mostPopularPlan: null,
		avgCompletion: 0
	};
	
	let monthlyActivity = {
		months: [],
		sessionsCompleted: [],
		avgCompletionRate: [],
		newUsers: []
	};
	
	let dayOfWeekStats = {
		days: [],
		completionRates: []
	};
	
	let isLoading = true;
	
	// Charts würden in einer echten App mit Chart.js oder D3.js erstellt werden
	// Hier simulieren wir die Darstellung mit einfachen DIV-Elementen
	
	// Laden der Statistikdaten vom Server
	async function loadReportingData() {
		try {
			// In einer echten App würden diese API-Endpunkte existieren
			const response = await fetch('/api/admin/reporting');
			
			if (!response.ok) {
				throw new Error('Fehler beim Laden der Reporting-Daten');
			}
			
			const data = await response.json();
			
			// Daten aus der API-Antwort extrahieren
			userStats = {
				...userStats,
				...data.userStats
			};
			
			planStats = {
				...planStats,
				...data.planStats
			};
			
			monthlyActivity = data.monthlyActivity;
			dayOfWeekStats = data.dayOfWeekCompletion;
			
		} catch (error) {
			console.error('Fehler beim Laden der Reporting-Daten:', error);
			// Fallback zu Beispieldaten im Fehlerfall
			useExampleData();
		} finally {
			isLoading = false;
		}
	}
	
	// Beispieldaten für die Entwicklung
	function useExampleData() {
		userStats = {
			total: 245,
			active: 178,
			withPlans: 132,
			activeLastWeek: 87,
			activeLastMonth: 126,
			growth: 12.5,
			completionRate: 68
		};
		
		planStats = {
			total: 6,
			assigned: 156,
			completed: 43,
			avgCompletion: 65,
			mostPopularPlan: {
				id: 'b5k',
				title: 'Vom Sofa zur 5K-Ziellinie',
				count: 45
			}
		};
		
		monthlyActivity = {
			months: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun'],
			sessionsCompleted: [120, 145, 165, 160, 185, 210],
			avgCompletionRate: [65, 68, 72, 70, 75, 78],
			newUsers: [15, 12, 18, 22, 25, 30]
		};
		
		dayOfWeekStats = {
			days: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
			completionRates: [65, 72, 58, 70, 62, 85, 45]
		};
	}
	
	// In einer echten App würden diese Daten vom Server geladen
	onMount(() => {
		// Für Demozwecke verwenden wir Beispieldaten nach einer kurzen Verzögerung
		setTimeout(() => {
			//loadReportingData(); // In einer echten App würde dieser API-Aufruf erfolgen
			useExampleData();
		}, 800);
	});
</script>

<svelte:head>
	<title>Admin Dashboard | LaufPlaner Pro</title>
</svelte:head>

<div class="admin-dashboard">
	<div class="page-header">
		<h1>Admin Dashboard</h1>
	</div>
	
	{#if isLoading}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<p>Lade Dashboard-Daten...</p>
		</div>
	{:else}		<div class="dashboard-overview">
			<div class="stats-grid">
				<div class="stat-card">
					<div class="stat-icon user-icon">
						<i class="material-icons">people</i>
					</div>
					<div class="stat-content">
						<h3>Nutzer insgesamt</h3>
						<div class="stat-value">{userStats.total}</div>
						<div class="stat-trend positive">
							<span class="trend-arrow">↑</span>
							<span class="trend-value">{userStats.growth}%</span>
							<span class="trend-period">vs. letzter Monat</span>
						</div>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon active-icon">
						<i class="material-icons">person</i>
					</div>
					<div class="stat-content">
						<h3>Aktive Nutzer</h3>
						<div class="stat-value">{userStats.active}</div>
						<div class="stat-detail">
							<span>{userStats.activeLastWeek} letzte Woche</span>
						</div>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon plan-icon">
						<i class="material-icons">fitness_center</i>
					</div>
					<div class="stat-content">
						<h3>Nutzer mit Plänen</h3>
						<div class="stat-value">{userStats.withPlans}</div>
						<div class="stat-detail">
							<span>{Math.round(userStats.withPlans / userStats.total * 100)}% aller Nutzer</span>
						</div>
					</div>
				</div>
				
				<div class="stat-card">
					<div class="stat-icon training-icon">
						<i class="material-icons">event_available</i>
					</div>
					<div class="stat-content">
						<h3>Trainingseinheiten</h3>
						<div class="stat-value">{userStats.completionRate}%</div>
						<div class="stat-detail">
							<span>Abschlussrate</span>
						</div>
					</div>
				</div>
			</div>
			
			<div class="report-section">
				<h2>Detaillierte Berichte</h2>
				
				<div class="report-grid">
					<div class="report-card">
						<h3>Monatliche Aktivität</h3>
						<div class="chart bar-chart">
							<div class="chart-legend">
								<div class="legend-item">
									<span class="legend-color sessions"></span>
									<span>Absolvierte Einheiten</span>
								</div>
								<div class="legend-item">
									<span class="legend-color users"></span>
									<span>Neue Nutzer</span>
								</div>
							</div>
							<div class="chart-container">
								{#each monthlyActivity.months as month, i}
									<div class="chart-column">
										<div class="bar-container">
											<div class="bar sessions" style="height: {monthlyActivity.sessionsCompleted[i] / Math.max(...monthlyActivity.sessionsCompleted) * 100}%"></div>
											<div class="bar users" style="height: {monthlyActivity.newUsers[i] / Math.max(...monthlyActivity.newUsers) * 100}%"></div>
										</div>
										<div class="chart-label">{month}</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
					
					<div class="report-card">
						<h3>Aktivität nach Wochentag</h3>
						<div class="chart bar-chart">
							<div class="chart-container">
								{#each dayOfWeekStats.days as day, i}
									<div class="chart-column">
										<div class="bar-container">
											<div class="bar day-completion" style="height: {dayOfWeekStats.completionRates[i]}%"></div>
										</div>
										<div class="chart-label">{day}</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
				
				<div class="report-row">
					<div class="report-card plan-insights">
						<h3>Plan-Insights</h3>
						<div class="insights-grid">
							<div class="insight-item">
								<div class="insight-label">Beliebtester Plan</div>
								<div class="insight-value">{planStats.mostPopularPlan ? planStats.mostPopularPlan.title : 'Kein Daten'}</div>
								<div class="insight-detail">{planStats.mostPopularPlan ? planStats.mostPopularPlan.count : 0} Zuweisungen</div>
							</div>
							<div class="insight-item">
								<div class="insight-label">Durchschnittliche Completion</div>
								<div class="insight-value">{planStats.avgCompletion}%</div>
							</div>
							<div class="insight-item">
								<div class="insight-label">Abgeschlossene Pläne</div>
								<div class="insight-value">{planStats.completed}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			
			<div class="dashboard-actions">
				<div class="action-section">
					<h2>Schnellzugriff</h2>
					<div class="actions-grid">
						<a href="/admin/users" class="action-card">
							<i class="material-icons">group_add</i>
							<span>Nutzerverwaltung</span>
						</a>
						
						<a href="/admin/training-plans" class="action-card">
							<i class="material-icons">fitness_center</i>
							<span>Trainingspläne zuweisen</span>
						</a>
						
						<a href="/admin/orders" class="action-card">
							<i class="material-icons">receipt</i>
							<span>Bestellungen anzeigen</span>
						</a>
						
						<a href="/admin/blog" class="action-card">
							<i class="material-icons">edit</i>
							<span>Blog-Beitrag erstellen</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.admin-dashboard {
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
	
	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2.5rem;
	}
	
	.stat-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	.stat-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 8px;
		margin-right: 1rem;
	}
	
	.stat-icon i {
		font-size: 1.75rem;
	}
	
	.user-icon {
		background-color: rgba(52, 152, 219, 0.15);
		color: #3498db;
	}
	
	.active-icon {
		background-color: rgba(46, 204, 113, 0.15);
		color: #2ecc71;
	}
	
	.plan-icon {
		background-color: rgba(155, 89, 182, 0.15);
		color: #9b59b6;
	}
	
	.training-icon {
		background-color: rgba(230, 126, 34, 0.15);
		color: #e67e22;
	}
	
	.stat-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.7);
	}
	
	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
	}
	
	.stat-detail {
		font-size: 0.8rem;
		color: var(--text-light);
		margin-top: 0.25rem;
	}
	
	.stat-trend {
		display: flex;
		align-items: center;
		font-size: 0.8rem;
		margin-top: 0.5rem;
		gap: 0.25rem;
	}
	
	.stat-trend.positive {
		color: #2ecc71;
	}
	
	.stat-trend.negative {
		color: #e74c3c;
	}
	
	.trend-period {
		color: var(--text-light);
	}
	
	.report-section {
		margin-top: 2rem;
	}
	
	.report-section h2 {
		font-size: 1.25rem;
		margin: 0 0 1.5rem 0;
		color: var(--primary);
	}
	
	.report-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}
	
	.report-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	.report-card h3 {
		margin: 0 0 1.5rem 0;
		font-size: 1.1rem;
		color: var(--primary);
	}
	
	.chart {
		height: 250px;
	}
	
	.chart-legend {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
	}
	
	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
	}
	
	.legend-color {
		width: 1rem;
		height: 0.5rem;
		border-radius: 2px;
	}
	
	.legend-color.sessions {
		background-color: rgba(52, 152, 219, 0.7);
	}
	
	.legend-color.users {
		background-color: rgba(155, 89, 182, 0.7);
	}
	
	.chart-container {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		height: 200px;
	}
	
	.chart-column {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}
	
	.bar-container {
		width: 80%;
		height: 180px;
		display: flex;
		align-items: flex-end;
		position: relative;
	}
	
	.bar {
		width: 100%;
		transition: height 0.5s ease;
		border-radius: 3px 3px 0 0;
	}
	
	.bar.sessions {
		background-color: rgba(52, 152, 219, 0.7);
		position: absolute;
		bottom: 0;
		z-index: 2;
	}
	
	.bar.users {
		background-color: rgba(155, 89, 182, 0.7);
		position: absolute;
		bottom: 0;
		right: 0;
		width: 50%;
		z-index: 1;
	}
	
	.bar.day-completion {
		background-color: rgba(46, 204, 113, 0.7);
	}
	
	.chart-label {
		font-size: 0.8rem;
		color: var(--text-light);
	}
	
	.report-row {
		margin-bottom: 1.5rem;
	}
	
	.insights-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1.5rem;
	}
	
	.insight-item {
		text-align: center;
	}
	
	.insight-label {
		font-size: 0.9rem;
		color: var(--text-light);
		margin-bottom: 0.5rem;
	}
	
	.insight-value {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
	
	.insight-detail {
		font-size: 0.8rem;
		color: var(--text-light);
	}
	
	.dashboard-actions {
		margin-top: 2rem;
	}
	
	.action-section {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.action-section h2 {
		font-size: 1.25rem;
		margin: 0 0 1.5rem 0;
		color: var(--primary);
	}
	
	.actions-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}
	
	.action-card {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.25rem;
		text-align: center;
		text-decoration: none;
		color: var(--text);
		transition: all 0.3s ease;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}
	
	.action-card:hover {
		background-color: rgba(0, 242, 254, 0.1);
		transform: translateY(-3px);
	}
	
	.action-card i {
		font-size: 2rem;
		color: var(--primary);
	}
</style>
