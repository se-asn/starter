<!-- Smart Triathlete - Neural Dashboard -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ClientAuth } from '$lib/client-auth';
	// User state
	let user: any = null;
	let mounted = false;
	let glowIntensity = 0;
	let authToken = '';

	// Pro Triathlon Analytics Data
	let performanceMetrics = {
		weeklyVolume: {
			swim: { hours: 4.5, distance: '12.8km', trend: '+8%' },
			bike: { hours: 12.2, distance: '387km', trend: '+12%' },
			run: { hours: 6.8, distance: '68.5km', trend: '+5%' }
		},
		currentForm: {
			fitness: 95,
			fatigue: 42,
			form: 53,
			rampRate: 8.2
		},
		nextRace: {
			name: 'Ironman Frankfurt',
			date: '2025-07-06',
			daysLeft: 26,
			priority: 'A'
		},
		zones: {
			hr: { z1: 155, z2: 165, z3: 175, z4: 185, z5: 195 },
			power: { ftp: 285, z1: 171, z2: 228, z3: 256, z4: 285, z5: 342 },
			pace: { threshold: '4:15', z1: '5:30', z2: '4:45', z3: '4:25', z4: '4:15', z5: '3:55' }
		}
	};

	let recentActivities = [
		{ id: 1, sport: 'swim', duration: '01:15:30', distance: '3.2km', tss: 68, date: '2025-06-09' },
		{ id: 2, sport: 'bike', duration: '02:45:15', distance: '95km', tss: 142, date: '2025-06-08' },
		{ id: 3, sport: 'run', duration: '01:35:20', distance: '18km', tss: 89, date: '2025-06-07' },
		{ id: 4, sport: 'swim', duration: '00:58:45', distance: '2.8km', tss: 55, date: '2025-06-06' }
	];

	let upcomingWorkouts = [
		{ id: 1, sport: 'bike', type: 'FTP Test', duration: '01:30:00', scheduled: '2025-06-11 06:00' },
		{ id: 2, sport: 'run', type: 'Tempo Run', duration: '01:15:00', scheduled: '2025-06-11 18:00' },
		{
			id: 3,
			sport: 'swim',
			type: 'Threshold Set',
			duration: '01:00:00',
			scheduled: '2025-06-12 06:30'
		}
	];	function getSportIcon(sport: string): string {
		const icons: { [key: string]: string } = { swim: 'swim', bike: 'bike', run: 'run' };
		return icons[sport] || 'fitness';
	}

	function getSportColor(sport: string): string {
		const colors: { [key: string]: string } = { swim: '#00D4FF', bike: '#FF6B35', run: '#4CAF50' };
		return colors[sport] || '#666';
	}

	function formatDuration(duration: string): string {
		return duration.replace(/^00:/, '').replace(/^0/, '');
	}

	// Database connection status (simulated for GitHub Pages)
	let databaseStatus = {
		connected: true,
		loading: false,
		tables: ['athletes', 'activities', 'training_plans', 'api_connections'],
		recordCounts: {
			athletes: 156,
			activities: 2847,
			training_plans: 42,
			api_connections: 89
		},
		error: null
	};
	// API Integrations
	let integrations = [		{
			id: 'strava',
			name: 'Strava',
			description: 'Sync activities, segments and performance data',
			icon: 'strava',
			connected: false,
			lastSync: '',
			activities: 0
		},
		{
			id: 'garmin',
			name: 'Garmin Connect',
			description: 'Import workouts and health metrics',
			icon: 'garmin',
			connected: false,
			lastSync: '',
			activities: 0
		},
		{
			id: 'polar',
			name: 'Polar Flow',
			description: 'Training data and recovery metrics',
			icon: 'polar',
			connected: false,
			lastSync: '',
			activities: 0
		},
		{
			id: 'wahoo',
			name: 'Wahoo',
			description: 'Bike computer and trainer data',
			icon: 'wahoo',
			connected: false,
			lastSync: '',
			activities: 0
		}
	];

	let statusMessage = '';
	let statusType: 'success' | 'error' | '' = '';	onMount(() => {
		// Check authentication using ClientAuth
		console.log('🎯 Dashboard: Checking authentication...');
		
		if (!ClientAuth.isAuthenticated()) {
			console.log('🎯 Dashboard: User not authenticated, redirecting to /auth');
			goto('/auth');
			return;
		}

		console.log('🎯 Dashboard: User is authenticated!');
		user = ClientAuth.getCurrentUser();
		authToken = localStorage.getItem('authToken') || '';
		console.log('🎯 Dashboard: Current user:', user);
		console.log('🎯 Dashboard: Auth token present:', !!authToken);

		// Simulate some connected integrations for demo    integrations[0].connected = true; // Strava
		integrations[0].lastSync = new Date().toISOString();
		integrations[0].activities = 127;

		integrations[1].connected = true; // Garmin
		integrations[1].lastSync = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
		integrations[1].activities = 89;

		// Check URL params for OAuth callbacks
		const urlParams = new URLSearchParams($page.url.search);
		const success = urlParams.get('success');
		const error = urlParams.get('error');

		if (success === 'strava_connected') {
			statusMessage = 'Strava successfully connected! 🎉';
			statusType = 'success';
			// Update Strava connection status
			const strava = integrations.find((i) => i.id === 'strava');
			if (strava) strava.connected = true;
		}

		if (error) {
			statusMessage = getErrorMessage(error);
			statusType = 'error';
		}

		// Clear URL params after 3 seconds
		if (success || error) {
			setTimeout(() => {
				const url = new URL(window.location.href);
				url.search = '';
				window.history.replaceState({}, '', url.toString());
				statusMessage = '';
			}, 3000);
		}
	});

	function getErrorMessage(error: string): string {
		switch (error) {
			case 'strava_auth_denied':
				return 'Strava connection was denied. Please try again.';
			case 'strava_auth_failed':
				return 'Failed to connect to Strava. Please try again.';
			default:
				return 'An error occurred. Please try again.';
		}
	}

	function connectIntegration(id: string) {
		switch (id) {
			case 'strava':
				window.location.href = '/api/integrations/strava?action=auth';
				break;
			case 'garmin':
				// TODO: Implement Garmin OAuth
				alert('Garmin integration coming soon!');
				break;
			case 'polar':
				// TODO: Implement Polar OAuth
				alert('Polar integration coming soon!');
				break;
			case 'wahoo':
				// TODO: Implement Wahoo OAuth
				alert('Wahoo integration coming soon!');
				break;
		}
	}
	function syncIntegration(id: string) {
		// Trigger manual sync
		fetch(`/api/integrations/${id}?action=sync`, { method: 'GET' })
			.then((response) => response.json())
			.then((data) => {
				statusMessage = `${id} sync started!`;
				statusType = 'success';
			})
			.catch((error) => {
				statusMessage = `Failed to sync ${id}`;
				statusType = 'error';
			});
	}

	function disconnectIntegration(id: string) {		if (confirm(`Are you sure you want to disconnect ${id}?`)) {
			// TODO: Implement disconnect
			const integration = integrations.find((i) => i.id === id);
			if (integration) {
				integration.connected = false;
				integration.lastSync = '';
				integration.activities = 0;
			}
		}
	}
	function logout() {
		ClientAuth.logout();
		goto('/auth');
	}

	// Test database connection
	async function testDatabaseConnection() {
		databaseStatus.loading = true;		try {
			const response = await fetch('/api/test/database');
			const data: any = await response.json();
			
			if (data.success) {
				databaseStatus = {
					connected: true,
					loading: false,
					tables: data.database.tables || [],
					recordCounts: data.database.recordCounts || {
						athletes: 0,
						activities: 0,
						training_plans: 0,
						api_connections: 0
					},
					error: null
				};
			} else {
				databaseStatus = {
					connected: false,
					loading: false,
					tables: [],
					recordCounts: {
						athletes: 0,
						activities: 0,
						training_plans: 0,
						api_connections: 0
					},
					error: data.error || 'Unknown error'
				};
			}
		} catch (error: any) {
			databaseStatus = {
				connected: false,
				loading: false,
				tables: [],
				recordCounts: {
					athletes: 0,
					activities: 0,
					training_plans: 0,
					api_connections: 0
				},
				error: error.message
			};
		}
	}

	onMount(async () => {
		// Test database on page load
		await testDatabaseConnection();
	});
</script>

<svelte:head>
	<title>Smart Triathlete - Neural Dashboard</title>
	<meta
		name="description"
		content="Neural triathlon training dashboard with quantum performance analytics"
	/>
</svelte:head>

<!-- Professional Mobile-First Dashboard -->
<div class="dashboard-container">
	<!-- Top Navigation Bar -->
	<nav class="top-nav">
		<div class="nav-brand">
			<div class="logo">
				<div class="icon-neural"></div>
				<span class="logo-text">Smart Triathlete</span>
			</div>
		</div>
		<div class="nav-actions">
			{#if user}
				<button class="user-menu" on:click={logout}>
					<div class="icon-profile"></div>
					<span class="user-name">{user.name}</span>
				</button>
			{/if}
		</div>
	</nav>

	<!-- Performance Overview Cards -->
	<section class="performance-overview">
		<div class="metric-cards">
			<!-- Current Form Card -->
			<div class="metric-card primary">
				<div class="metric-header">
					<h3>Current Form</h3>
					<span class="metric-trend positive">+{performanceMetrics.currentForm.rampRate}</span>
				</div>
				<div class="form-gauge">
					<div class="gauge-value">{performanceMetrics.currentForm.form}</div>
					<div class="gauge-label">Form Score</div>
				</div>
				<div class="form-breakdown">
					<div class="form-item">
						<span>Fitness</span>
						<div class="form-bar">
							<div class="form-fill" style="width: {performanceMetrics.currentForm.fitness}%"></div>
						</div>
						<span>{performanceMetrics.currentForm.fitness}</span>
					</div>
					<div class="form-item">
						<span>Fatigue</span>
						<div class="form-bar fatigue">
							<div class="form-fill" style="width: {performanceMetrics.currentForm.fatigue}%"></div>
						</div>
						<span>{performanceMetrics.currentForm.fatigue}</span>
					</div>
				</div>
			</div>

			<!-- Weekly Volume Card -->
			<div class="metric-card">
				<h3>This Week</h3>
				<div class="volume-sports">
					{#each Object.entries(performanceMetrics.weeklyVolume) as [sport, data]}
						<div class="sport-volume" style="border-left: 4px solid {getSportColor(sport)}">
							<div class="sport-header">
								<div class="icon-{sport}"></div>
								<span class="sport-name">{sport.toUpperCase()}</span>
								<span class="sport-trend positive">{data.trend}</span>
							</div>
							<div class="volume-stats">
								<div class="volume-stat">
									<strong>{data.hours}h</strong>
									<span>Time</span>
								</div>
								<div class="volume-stat">
									<strong>{data.distance}</strong>
									<span>Distance</span>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Next Race Card -->
			<div class="metric-card race-card">
				<div class="race-header">
					<h3>Next Race</h3>
					<span class="race-priority priority-{performanceMetrics.nextRace.priority.toLowerCase()}">
						Priority {performanceMetrics.nextRace.priority}
					</span>
				</div>
				<div class="race-info">
					<h4>{performanceMetrics.nextRace.name}</h4>
					<div class="race-countdown">
						<span class="countdown-number">{performanceMetrics.nextRace.daysLeft}</span>
						<span class="countdown-label">days to go</span>
					</div>
					<div class="race-date">{performanceMetrics.nextRace.date}</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Recent Activities -->
	<section class="recent-activities">
		<div class="section-header">
			<h2>Recent Activities</h2>
			<a href="/activities" class="view-all">View All →</a>
		</div>
		<div class="activity-list">
			{#each recentActivities as activity}
				<div class="activity-item">
					<div class="activity-sport" style="background: {getSportColor(activity.sport)}">
						<div class="icon-{activity.sport}"></div>
					</div>
					<div class="activity-details">
						<div class="activity-main">
							<span class="activity-distance">{activity.distance}</span>
							<span class="activity-duration">{formatDuration(activity.duration)}</span>
						</div>
						<div class="activity-meta">
							<span class="activity-tss">TSS: {activity.tss}</span>
							<span class="activity-date">{activity.date}</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Upcoming Workouts -->
	<section class="upcoming-workouts">
		<div class="section-header">
			<h2>Upcoming Workouts</h2>
			<a href="/training-plans" class="view-all">View Plan →</a>
		</div>
		<div class="workout-list">
			{#each upcomingWorkouts as workout}
				<div class="workout-item">
					<div class="workout-sport" style="background: {getSportColor(workout.sport)}">
						<div class="icon-{workout.sport}"></div>
					</div>
					<div class="workout-details">
						<div class="workout-main">
							<h4>{workout.type}</h4>
							<span class="workout-duration">{formatDuration(workout.duration)}</span>
						</div>
						<div class="workout-schedule">{workout.scheduled}</div>
					</div>
					<button class="workout-action">Start</button>
				</div>
			{/each}
		</div>
	</section>

	<!-- Device Integrations -->
	<section class="device-integrations">
		<div class="section-header">
			<h2>Device Connections</h2>
			<span class="connection-count"
				>{integrations.filter((i) => i.connected).length}/{integrations.length} connected</span
			>
		</div>
		<div class="device-grid">
			{#each integrations as integration}
				<div class="device-card" class:connected={integration.connected}>
					<div class="device-header">
						<div class="icon-{integration.icon}"></div>
						<div class="device-info">
							<h4>{integration.name}</h4>
							<p>{integration.description}</p>
						</div>
						<div class="connection-indicator" class:connected={integration.connected}>
							{#if integration.connected}
								<span class="status-dot connected"></span>
							{:else}
								<span class="status-dot"></span>
							{/if}
						</div>
					</div>

					{#if integration.connected}
						<div class="device-stats">
							<div class="stat-item">
								<span class="stat-number">{integration.activities}</span>
								<span class="stat-label">Activities</span>
							</div>
							<div class="stat-item">
								<span class="stat-number">
									{integration.lastSync
										? new Date(integration.lastSync).toLocaleDateString()
										: 'Never'}
								</span>
								<span class="stat-label">Last Sync</span>
							</div>
						</div>
						<div class="device-actions">
							<button class="btn-sync" on:click={() => syncIntegration(integration.id)}>
								<div class="icon-sync"></div>
								Sync Now
							</button>
							<button class="btn-disconnect" on:click={() => disconnectIntegration(integration.id)}>
								Disconnect
							</button>
						</div>
					{:else}
						<div class="device-connect">
							<button class="btn-connect" on:click={() => connectIntegration(integration.id)}>
								Connect {integration.name}
							</button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
	{#if statusMessage}
		<div class="status-banner {statusType}">
			<div class="status-icon">
				{#if statusType === 'success'}
					<div class="icon-check"></div>
				{:else}
					<div class="icon-error"></div>
				{/if}
			</div>
			<span class="status-text">{statusMessage}</span>
		</div>
	{/if}
</div>

<style>
	/* Neural/Quantum Dashboard Design */
	* {
		box-sizing: border-box;
	}

	.dashboard-container {
		min-height: 100vh;
		background: var(--neural-bg);
		color: var(--neural-text);
		font-family: var(--font-neural);
		padding: 0;
		margin: 0;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Neural Logo and Icons */
	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		background: var(--neural-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.icon-neural,
	.icon-profile,
	.icon-swim,
	.icon-bike,
	.icon-run,
	.icon-strava,
	.icon-garmin,
	.icon-polar,
	.icon-wahoo,
	.icon-sync,
	.icon-check,
	.icon-error {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		position: relative;
		flex-shrink: 0;
	}

	.icon-neural {
		background: radial-gradient(circle at center, var(--neural-accent) 30%, transparent 70%);
		border: 1px solid var(--neural-accent);
		animation: neuralPulse 2s ease-in-out infinite;
	}

	.icon-neural:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		background: var(--neural-accent);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.icon-profile {
		background: linear-gradient(135deg, var(--neural-secondary), var(--neural-accent));
		border-radius: 50%;
	}

	.icon-swim {
		background: linear-gradient(135deg, #00d4ff, #0099cc);
		clip-path: polygon(20% 40%, 40% 20%, 80% 60%, 60% 80%);
	}

	.icon-bike {
		background: linear-gradient(135deg, #ff6b35, #cc5429);
		border-radius: 50%;
		position: relative;
	}

	.icon-bike:before,
	.icon-bike:after {
		content: '';
		position: absolute;
		width: 6px;
		height: 6px;
		background: var(--neural-bg);
		border-radius: 50%;
		top: 50%;
		transform: translateY(-50%);
	}

	.icon-bike:before {
		left: 3px;
	}

	.icon-bike:after {
		right: 3px;
	}

	.icon-run {
		background: linear-gradient(135deg, #4caf50, #2e7d32);
		clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
	}

	.icon-strava {
		background: linear-gradient(135deg, #fc4c02, #e34402);
		clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	}

	.icon-garmin {
		background: linear-gradient(135deg, #007cc3, #005c91);
		border-radius: 4px;
	}

	.icon-polar {
		background: linear-gradient(135deg, #00d4ff, #0099cc);
		border-radius: 50%;
		position: relative;
	}

	.icon-polar:before {
		content: '';
		position: absolute;
		top: 6px;
		left: 6px;
		right: 6px;
		bottom: 6px;
		border: 1px solid var(--neural-bg);
		border-radius: 50%;
	}

	.icon-wahoo {
		background: linear-gradient(135deg, #00d4ff, #4caf50);
		clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
	}

	.icon-sync {
		background: var(--neural-accent);
		border-radius: 50%;
		animation: rotate 2s linear infinite;
		margin-right: 0.5rem;
	}

	.icon-check {
		background: #4caf50;
		border-radius: 50%;
		position: relative;
	}

	.icon-check:before {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.icon-error {
		background: #ff4444;
		border-radius: 50%;
		position: relative;
	}

	.icon-error:before {
		content: '!';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	@keyframes neuralPulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(0, 212, 255, 0);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Top Navigation */
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--neural-border);
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		padding: 0.75rem 1.25rem;
		border-radius: 25px;
		color: var(--neural-text);
		cursor: pointer;
		transition: all var(--neural-transition);
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.user-menu:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	.user-name {
		font-size: 0.9rem;
		font-weight: 300;
	}

	/* Performance Overview */
	.performance-overview {
		padding: 2rem 1.5rem;
	}

	.metric-cards {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	.metric-card {
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 2rem;
		position: relative;
		overflow: hidden;
		transition: all var(--neural-transition);
	}

	.metric-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--neural-shadow);
		border-color: var(--neural-accent);
	}

	.metric-card.primary {
		background: linear-gradient(
			135deg,
			rgba(0, 212, 255, 0.1),
			rgba(255, 107, 53, 0.1),
			rgba(76, 175, 80, 0.1)
		);
		border: 1px solid var(--neural-accent);
	}

	.metric-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.metric-header h3 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		opacity: 0.9;
	}

	.metric-trend {
		font-size: 0.85rem;
		padding: 0.4rem 0.8rem;
		border-radius: 12px;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.metric-trend.positive {
		background: rgba(76, 175, 80, 0.2);
		color: #4caf50;
		border: 1px solid rgba(76, 175, 80, 0.3);
	}

	/* Form Gauge */
	.form-gauge {
		text-align: center;
		margin: 2rem 0;
	}

	.gauge-value {
		font-size: 3.5rem;
		font-weight: 200;
		color: var(--neural-accent);
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.gauge-label {
		font-size: 0.9rem;
		opacity: 0.7;
		margin-top: 0.5rem;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.form-breakdown {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: 0.9rem;
		font-weight: 300;
	}

	.form-item span:first-child {
		min-width: 60px;
		opacity: 0.8;
		letter-spacing: 0.01em;
	}

	.form-item span:last-child {
		min-width: 30px;
		font-weight: 300;
		text-align: right;
		letter-spacing: 0.01em;
	}

	.form-bar {
		flex: 1;
		height: 8px;
		background: var(--neural-glass);
		border-radius: 4px;
		overflow: hidden;
		border: 1px solid var(--neural-border);
	}

	.form-fill {
		height: 100%;
		background: var(--neural-gradient);
		border-radius: 4px;
		transition: width var(--neural-transition);
	}

	.form-bar.fatigue .form-fill {
		background: linear-gradient(90deg, #ff6b35, #ff4444);
	}

	/* Volume Sports */
	.volume-sports {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.sport-volume {
		padding: 1.5rem;
		background: var(--neural-glass);
		border-radius: 12px;
		border: 1px solid var(--neural-border);
		transition: all var(--neural-transition);
	}

	.sport-volume:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
	}

	.sport-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.25rem;
	}

	.sport-name {
		font-weight: 300;
		flex: 1;
		letter-spacing: 0.05em;
		font-size: 0.9rem;
	}

	.sport-trend {
		font-size: 0.8rem;
		padding: 0.3rem 0.6rem;
		border-radius: 8px;
		font-weight: 300;
	}

	.volume-stats {
		display: flex;
		gap: 2rem;
	}

	.volume-stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.volume-stat strong {
		font-size: 1.1rem;
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.volume-stat span {
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	/* Race Card */
	.race-card {
		background: linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(76, 175, 80, 0.15));
		border: 1px solid rgba(255, 107, 53, 0.3);
	}

	.race-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.race-priority {
		padding: 0.3rem 0.8rem;
		border-radius: 12px;
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.race-priority.priority-a {
		background: rgba(255, 68, 68, 0.2);
		color: #ff4444;
		border: 1px solid rgba(255, 68, 68, 0.3);
	}

	.race-info h4 {
		margin: 0 0 1.5rem 0;
		font-size: 1.2rem;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.race-countdown {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.countdown-number {
		font-size: 2.5rem;
		font-weight: 200;
		color: #ff6b35;
		line-height: 1;
		letter-spacing: -0.02em;
	}

	.countdown-label {
		font-size: 0.9rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.race-date {
		font-size: 0.9rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Sections */
	.recent-activities,
	.upcoming-workouts,
	.device-integrations {
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--neural-border);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.section-header h2 {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.view-all {
		color: var(--neural-accent);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: all var(--neural-transition);
	}

	.view-all:hover {
		color: var(--neural-text);
		transform: translateX(4px);
	}

	/* Activity List */
	.activity-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.activity-item {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--neural-glass);
		border-radius: 12px;
		border: 1px solid var(--neural-border);
		transition: all var(--neural-transition);
	}

	.activity-item:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	.activity-sport {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 1px solid var(--neural-border);
	}

	.activity-details {
		flex: 1;
	}

	.activity-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.activity-distance {
		font-weight: 300;
		font-size: 1.1rem;
		letter-spacing: 0.01em;
	}

	.activity-duration {
		color: var(--neural-accent);
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.activity-meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Workout List */
	.workout-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.workout-item {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--neural-glass);
		border-radius: 12px;
		border: 1px solid var(--neural-border);
		transition: all var(--neural-transition);
	}

	.workout-item:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
	}

	.workout-sport {
		width: 50px;
		height: 50px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		border: 1px solid var(--neural-border);
	}

	.workout-details {
		flex: 1;
	}

	.workout-main {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.workout-main h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.workout-duration {
		color: #4caf50;
		font-weight: 300;
		font-size: 0.9rem;
		letter-spacing: 0.01em;
	}

	.workout-schedule {
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.workout-action {
		background: var(--neural-gradient);
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		color: white;
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.workout-action:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
	}

	/* Device Integrations */
	.connection-count {
		font-size: 0.9rem;
		color: var(--neural-accent);
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.device-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	.device-card {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 2rem;
		transition: all var(--neural-transition);
	}

	.device-card:hover {
		background: var(--neural-hover);
		transform: translateY(-4px);
		box-shadow: var(--neural-shadow);
	}

	.device-card.connected {
		border: 1px solid rgba(76, 175, 80, 0.4);
		background: var(--neural-glass);
	}

	.device-header {
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		margin-bottom: 2rem;
	}

	.device-info {
		flex: 1;
	}

	.device-info h4 {
		margin: 0 0 0.75rem 0;
		font-size: 1.1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.device-info p {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.8;
		line-height: 1.5;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.connection-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
	}

	.status-dot.connected {
		background: #4caf50;
		box-shadow: 0 0 8px rgba(76, 175, 80, 0.5);
		animation: pulse 2s ease-in-out infinite;
	}

	.device-stats {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: var(--neural-glass);
		border-radius: 12px;
		border: 1px solid var(--neural-border);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-number {
		font-size: 1.2rem;
		font-weight: 300;
		color: var(--neural-text);
		letter-spacing: 0.01em;
	}

	.stat-label {
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.device-actions,
	.device-connect {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	/* Buttons */
	.btn-connect {
		background: var(--neural-gradient);
		border: none;
		padding: 1rem 2rem;
		border-radius: 12px;
		color: white;
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
		flex: 1;
		min-width: 160px;
	}

	.btn-connect:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3);
	}

	.btn-sync {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		padding: 0.75rem 1.25rem;
		border-radius: 8px;
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: all var(--neural-transition);
		font-size: 0.9rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-sync:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
	}

	.btn-disconnect {
		background: rgba(255, 107, 53, 0.2);
		border: 1px solid rgba(255, 107, 53, 0.3);
		padding: 0.75rem 1.25rem;
		border-radius: 8px;
		color: #ff6b35;
		font-weight: 300;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: all var(--neural-transition);
		font-size: 0.9rem;
	}

	.btn-disconnect:hover {
		background: rgba(255, 107, 53, 0.3);
		transform: translateY(-2px);
	}

	/* Status Banner */
	.status-banner {
		position: fixed;
		top: 80px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		padding: 1.25rem 2rem;
		border-radius: 12px;
		display: flex;
		align-items: center;
		gap: 1rem;
		backdrop-filter: blur(20px);
		box-shadow: var(--neural-shadow);
		animation: slideDown 0.3s ease;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.status-banner.success {
		background: rgba(76, 175, 80, 0.9);
		border: 1px solid rgba(76, 175, 80, 0.5);
	}

	.status-banner.error {
		background: rgba(255, 68, 68, 0.9);
		border: 1px solid rgba(255, 68, 68, 0.5);
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	/* Responsive Design */
	@media (min-width: 768px) {
		.metric-cards {
			grid-template-columns: 1fr 1fr;
		}

		.device-grid {
			grid-template-columns: 1fr 1fr;
		}

		.volume-stats {
			gap: 3rem;
		}

		.device-actions {
			flex-wrap: nowrap;
		}
	}

	@media (min-width: 1024px) {
		.metric-cards {
			grid-template-columns: 2fr 1fr 1fr;
		}

		.device-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.dashboard-container {
			padding: 0;
		}

		.performance-overview,
		.recent-activities,
		.upcoming-workouts,
		.device-integrations {
			padding: 2.5rem 3rem;
		}

		.top-nav {
			padding: 1rem 3rem;
		}
	}
</style>
