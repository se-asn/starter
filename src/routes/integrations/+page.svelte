<!-- Smart Triathlete - API Integrations Page -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ClientAuth } from '$lib/client-auth';

	// API Integrations State
	let apiIntegrations = {
		strava: {
			connected: false,
			lastSync: null,
			activitiesCount: 0,
			athlete: null,
			status: 'disconnected'
		},
		garmin: {
			connected: false,
			lastSync: null,
			activitiesCount: 0,
			athlete: null,
			status: 'disconnected'
		},
		polar: {
			connected: false,
			lastSync: null,
			activitiesCount: 0,
			athlete: null,
			status: 'disconnected'
		}
	};

	let syncInProgress = false;
	let notification = { show: false, message: '', type: '' };
	let user = null;

	// API Integration functions
	async function connectStrava() {
		try {
			console.log('🔄 Connecting to Strava...');
			showNotification('Connecting to Strava...', 'info');

			// Mock successful connection for demo
			setTimeout(() => {
				apiIntegrations.strava.connected = true;
				apiIntegrations.strava.lastSync = new Date().toISOString();
				apiIntegrations.strava.activitiesCount = 127;
				apiIntegrations.strava.athlete = {
					id: 'strava_123',
					name: 'Test Athlete',
					profilePicture: null
				};
				apiIntegrations.strava.status = 'connected';
				apiIntegrations = { ...apiIntegrations };

				showNotification('Strava connected successfully! 🎉', 'success');
			}, 2000);
		} catch (error) {
			console.error('❌ Strava connection failed:', error);
			showNotification('Failed to connect Strava', 'error');
		}
	}

	async function connectGarmin() {
		try {
			console.log('🔄 Connecting to Garmin...');
			showNotification('Connecting to Garmin...', 'info');

			// Mock successful connection for demo
			setTimeout(() => {
				apiIntegrations.garmin.connected = true;
				apiIntegrations.garmin.lastSync = new Date().toISOString();
				apiIntegrations.garmin.activitiesCount = 89;
				apiIntegrations.garmin.athlete = {
					id: 'garmin_456',
					name: 'Test Athlete',
					profilePicture: null
				};
				apiIntegrations.garmin.status = 'connected';
				apiIntegrations = { ...apiIntegrations };

				showNotification('Garmin connected successfully! 🎉', 'success');
			}, 2000);
		} catch (error) {
			console.error('❌ Garmin connection failed:', error);
			showNotification('Failed to connect Garmin', 'error');
		}
	}

	async function syncApiData(provider: string) {
		try {
			syncInProgress = true;
			console.log(`🔄 Syncing ${provider} data...`);
			showNotification(`Syncing ${provider} data...`, 'info');

			// Mock sync process
			setTimeout(() => {
				const newActivities = Math.floor(Math.random() * 10) + 1;
				apiIntegrations[provider].lastSync = new Date().toISOString();
				apiIntegrations[provider].activitiesCount += newActivities;
				apiIntegrations = { ...apiIntegrations };

				showNotification(`${provider} sync completed! ${newActivities} new activities.`, 'success');
				syncInProgress = false;
			}, 3000);
		} catch (error) {
			console.error(`❌ ${provider} sync failed:`, error);
			showNotification(`${provider} sync failed`, 'error');
			syncInProgress = false;
		}
	}

	async function disconnectProvider(provider: string) {
		if (confirm(`Are you sure you want to disconnect ${provider}?`)) {
			apiIntegrations[provider].connected = false;
			apiIntegrations[provider].lastSync = null;
			apiIntegrations[provider].activitiesCount = 0;
			apiIntegrations[provider].athlete = null;
			apiIntegrations[provider].status = 'disconnected';
			apiIntegrations = { ...apiIntegrations };

			showNotification(`${provider} disconnected successfully`, 'success');
		}
	}

	function showNotification(message: string, type: 'success' | 'error' | 'info') {
		notification = { show: true, message, type };

		setTimeout(() => {
			notification.show = false;
		}, 5000);
	}

	onMount(() => {
		if (!ClientAuth.isAuthenticated()) {
			goto('/auth');
			return;
		}

		user = ClientAuth.getCurrentUser();
		console.log('✅ API Integrations page loaded for user:', user);
	});
</script>

<svelte:head>
	<title>Smart Triathlete - API Integrations</title>
	<meta
		name="description"
		content="Connect your training devices and platforms to Smart Triathlete"
	/>
</svelte:head>

<div class="integrations-container">
	<!-- Navigation Header -->
	<nav class="top-nav">
		<div class="nav-brand">
			<button class="back-btn" on:click={() => goto('/dashboard')} aria-label="Back to Dashboard">
				<div class="icon-back"></div>
			</button>
			<div class="logo">
				<div class="icon-neural"></div>
				<span class="logo-text">API Integrations</span>
			</div>
		</div>
		<div class="nav-actions">
			<div class="connection-summary">
				{Object.values(apiIntegrations).filter((api) => api.connected).length}/3 Connected
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<div class="integrations-content">
		<!-- Overview Section -->
		<section class="overview-section">
			<div class="section-header">
				<h1>Connect Your Training Platforms</h1>
				<p>Automatically sync your training data from popular fitness platforms and devices</p>
			</div>

			<div class="benefits-grid">
				<div class="benefit-card">
					<div class="benefit-icon">🔄</div>
					<h3>Automatic Sync</h3>
					<p>Your workouts are automatically imported and analyzed</p>
				</div>
				<div class="benefit-card">
					<div class="benefit-icon">🤖</div>
					<h3>AI Analysis</h3>
					<p>Advanced AI algorithms analyze your performance trends</p>
				</div>
				<div class="benefit-card">
					<div class="benefit-icon">📊</div>
					<h3>Unified Dashboard</h3>
					<p>All your training data in one comprehensive view</p>
				</div>
			</div>
		</section>

		<!-- API Integrations Section -->
		<section class="integrations-section">
			<h2>Available Integrations</h2>

			<div class="integrations-grid">
				<!-- Strava Integration -->
				<div class="integration-card" class:connected={apiIntegrations.strava.connected}>
					<div class="card-header">
						<div class="provider-logo strava">
							<div class="icon-strava"></div>
						</div>
						<div class="provider-info">
							<h3>Strava</h3>
							<p>The social network for athletes</p>
						</div>
						<div class="connection-status {apiIntegrations.strava.status}">
							{#if apiIntegrations.strava.connected}
								<div class="status-dot connected"></div>
								<span>Connected</span>
							{:else}
								<div class="status-dot"></div>
								<span>Not Connected</span>
							{/if}
						</div>
					</div>

					<div class="card-content">
						<div class="features-list">
							<div class="feature">✓ Activities and workouts</div>
							<div class="feature">✓ Segments and achievements</div>
							<div class="feature">✓ Social activity feed</div>
							<div class="feature">✓ Performance analytics</div>
						</div>

						{#if apiIntegrations.strava.connected}
							<div class="connection-stats">
								<div class="stat-item">
									<span class="stat-value">{apiIntegrations.strava.activitiesCount}</span>
									<span class="stat-label">Activities Synced</span>
								</div>
								<div class="stat-item">
									<span class="stat-value">
										{apiIntegrations.strava.lastSync
											? new Date(apiIntegrations.strava.lastSync).toLocaleDateString()
											: 'Never'}
									</span>
									<span class="stat-label">Last Sync</span>
								</div>
							</div>

							<div class="card-actions">
								<button
									class="btn-sync"
									on:click={() => syncApiData('strava')}
									disabled={syncInProgress}
								>
									{syncInProgress ? 'Syncing...' : 'Sync Now'}
								</button>
								<button class="btn-disconnect" on:click={() => disconnectProvider('strava')}>
									Disconnect
								</button>
							</div>
						{:else}
							<div class="card-actions">
								<button class="btn-connect" on:click={connectStrava}> Connect Strava </button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Garmin Integration -->
				<div class="integration-card" class:connected={apiIntegrations.garmin.connected}>
					<div class="card-header">
						<div class="provider-logo garmin">
							<div class="icon-garmin"></div>
						</div>
						<div class="provider-info">
							<h3>Garmin Connect</h3>
							<p>Advanced sports watches and devices</p>
						</div>
						<div class="connection-status {apiIntegrations.garmin.status}">
							{#if apiIntegrations.garmin.connected}
								<div class="status-dot connected"></div>
								<span>Connected</span>
							{:else}
								<div class="status-dot"></div>
								<span>Not Connected</span>
							{/if}
						</div>
					</div>

					<div class="card-content">
						<div class="features-list">
							<div class="feature">✓ Detailed workout metrics</div>
							<div class="feature">✓ Heart rate and power data</div>
							<div class="feature">✓ Sleep and recovery metrics</div>
							<div class="feature">✓ Training load analysis</div>
						</div>

						{#if apiIntegrations.garmin.connected}
							<div class="connection-stats">
								<div class="stat-item">
									<span class="stat-value">{apiIntegrations.garmin.activitiesCount}</span>
									<span class="stat-label">Activities Synced</span>
								</div>
								<div class="stat-item">
									<span class="stat-value">
										{apiIntegrations.garmin.lastSync
											? new Date(apiIntegrations.garmin.lastSync).toLocaleDateString()
											: 'Never'}
									</span>
									<span class="stat-label">Last Sync</span>
								</div>
							</div>

							<div class="card-actions">
								<button
									class="btn-sync"
									on:click={() => syncApiData('garmin')}
									disabled={syncInProgress}
								>
									{syncInProgress ? 'Syncing...' : 'Sync Now'}
								</button>
								<button class="btn-disconnect" on:click={() => disconnectProvider('garmin')}>
									Disconnect
								</button>
							</div>
						{:else}
							<div class="card-actions">
								<button class="btn-connect" on:click={connectGarmin}> Connect Garmin </button>
							</div>
						{/if}
					</div>
				</div>

				<!-- Polar Integration -->
				<div class="integration-card">
					<div class="card-header">
						<div class="provider-logo polar">
							<div class="icon-polar"></div>
						</div>
						<div class="provider-info">
							<h3>Polar Flow</h3>
							<p>Training data and recovery insights</p>
						</div>
						<div class="connection-status coming-soon">
							<div class="status-dot"></div>
							<span>Coming Soon</span>
						</div>
					</div>

					<div class="card-content">
						<div class="features-list">
							<div class="feature">✓ Training sessions</div>
							<div class="feature">✓ Recovery guidance</div>
							<div class="feature">✓ Running and fitness tests</div>
							<div class="feature">✓ Training benefit analysis</div>
						</div>

						<div class="card-actions">
							<button class="btn-connect" disabled> Coming Soon </button>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Data Privacy Section -->
		<section class="privacy-section">
			<div class="privacy-card">
				<div class="privacy-header">
					<div class="privacy-icon">🔐</div>
					<h3>Your Data is Secure</h3>
				</div>
				<div class="privacy-content">
					<p>We take your privacy seriously. Your training data is:</p>
					<ul>
						<li>Encrypted in transit and at rest</li>
						<li>Never shared with third parties</li>
						<li>Used only to improve your training experience</li>
						<li>Deletable at any time from your profile</li>
					</ul>
					<div class="privacy-actions">
						<button class="btn-secondary" on:click={() => goto('/privacy')}>
							Learn More About Privacy
						</button>
					</div>
				</div>
			</div>
		</section>
	</div>

	<!-- Notification -->
	{#if notification.show}
		<div class="notification {notification.type}">
			<div class="notification-content">
				{#if notification.type === 'success'}
					<div class="icon-check"></div>
				{:else if notification.type === 'error'}
					<div class="icon-error"></div>
				{:else}
					<div class="icon-info"></div>
				{/if}
				<span>{notification.message}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Neural/Quantum Design System */
	.integrations-container {
		min-height: 100vh;
		background: var(--neural-bg);
		color: var(--neural-text);
		font-family: var(--font-neural);
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Navigation */
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

	.nav-brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.back-btn {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 8px;
		padding: 0.75rem;
		color: var(--neural-text);
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.back-btn:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
	}

	.icon-back {
		width: 20px;
		height: 20px;
		background: var(--neural-accent);
		clip-path: polygon(40% 20%, 20% 50%, 40% 80%, 50% 70%, 40% 50%, 50% 30%);
	}

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

	.connection-summary {
		color: var(--neural-accent);
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	/* Main Content */
	.integrations-content {
		padding: 2rem 1.5rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	/* Overview Section */
	.overview-section {
		margin-bottom: 4rem;
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-header h1 {
		font-size: 2.5rem;
		font-weight: 200;
		margin: 0 0 1rem 0;
		background: var(--neural-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: 0.02em;
	}

	.section-header p {
		font-size: 1.1rem;
		opacity: 0.8;
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
		font-weight: 300;
	}

	.benefits-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
	}

	.benefit-card {
		text-align: center;
		padding: 2rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		transition: all var(--neural-transition);
	}

	.benefit-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--neural-shadow);
		border-color: var(--neural-accent);
	}

	.benefit-icon {
		font-size: 3rem;
		margin-bottom: 1.5rem;
	}

	.benefit-card h3 {
		margin: 0 0 1rem 0;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.benefit-card p {
		margin: 0;
		opacity: 0.8;
		line-height: 1.6;
		font-weight: 300;
	}

	/* Integrations Section */
	.integrations-section h2 {
		font-size: 2rem;
		font-weight: 300;
		margin: 0 0 2rem 0;
		letter-spacing: 0.02em;
	}

	.integrations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
		margin-bottom: 4rem;
	}

	.integration-card {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		overflow: hidden;
		transition: all var(--neural-transition);
	}

	.integration-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--neural-shadow);
	}

	.integration-card.connected {
		border-color: var(--neural-accent);
		background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), var(--neural-glass));
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.5rem;
		border-bottom: 1px solid var(--neural-border);
	}

	.provider-logo {
		width: 60px;
		height: 60px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.provider-logo.strava {
		background: linear-gradient(135deg, #fc4c02, #e34402);
	}

	.provider-logo.garmin {
		background: linear-gradient(135deg, #007cc3, #005c91);
	}

	.provider-logo.polar {
		background: linear-gradient(135deg, #00d4ff, #0099cc);
	}

	.provider-info {
		flex: 1;
	}

	.provider-info h3 {
		margin: 0 0 0.5rem 0;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.provider-info p {
		margin: 0;
		font-size: 0.9rem;
		opacity: 0.7;
		font-weight: 300;
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
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
		animation: pulse 2s ease-in-out infinite;
	}

	.connection-status.connected {
		color: #4caf50;
	}

	.connection-status.coming-soon {
		color: rgba(255, 255, 255, 0.5);
	}

	.card-content {
		padding: 1.5rem;
	}

	.features-list {
		margin-bottom: 2rem;
	}

	.feature {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
		font-size: 0.9rem;
		opacity: 0.8;
		font-weight: 300;
	}

	.connection-stats {
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

	.stat-value {
		font-size: 1.2rem;
		font-weight: 300;
		color: var(--neural-accent);
		letter-spacing: 0.01em;
	}

	.stat-label {
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.card-actions {
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
		min-width: 140px;
	}

	.btn-connect:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 212, 255, 0.3);
	}

	.btn-connect:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-sync {
		background: var(--neural-glass);
		border: 1px solid var(--neural-accent);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		color: var(--neural-accent);
		font-weight: 300;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.btn-sync:hover:not(:disabled) {
		background: rgba(0, 212, 255, 0.1);
		transform: translateY(-2px);
	}

	.btn-sync:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-disconnect {
		background: rgba(255, 107, 53, 0.2);
		border: 1px solid rgba(255, 107, 53, 0.3);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		color: #ff6b35;
		font-weight: 300;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.btn-disconnect:hover {
		background: rgba(255, 107, 53, 0.3);
		transform: translateY(-2px);
	}

	.btn-secondary {
		background: transparent;
		border: 1px solid var(--neural-border);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.01em;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.btn-secondary:hover {
		background: var(--neural-hover);
		border-color: var(--neural-accent);
		transform: translateY(-2px);
	}

	/* Privacy Section */
	.privacy-section {
		margin-top: 4rem;
	}

	.privacy-card {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
	}

	.privacy-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.privacy-icon {
		font-size: 2rem;
	}

	.privacy-header h3 {
		margin: 0;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.privacy-content p {
		margin: 0 0 1.5rem 0;
		line-height: 1.6;
		font-weight: 300;
	}

	.privacy-content ul {
		margin: 0 0 2rem 0;
		padding-left: 1.5rem;
	}

	.privacy-content li {
		margin-bottom: 0.75rem;
		line-height: 1.5;
		font-weight: 300;
	}

	.privacy-actions {
		text-align: center;
	}

	/* Notification */
	.notification {
		position: fixed;
		top: 100px;
		right: 2rem;
		z-index: 1000;
		padding: 1rem 1.5rem;
		border-radius: 12px;
		backdrop-filter: blur(20px);
		box-shadow: var(--neural-shadow);
		animation: slideIn 0.3s ease;
	}

	.notification.success {
		background: rgba(76, 175, 80, 0.9);
		border: 1px solid rgba(76, 175, 80, 0.5);
	}

	.notification.error {
		background: rgba(255, 68, 68, 0.9);
		border: 1px solid rgba(255, 68, 68, 0.5);
	}

	.notification.info {
		background: rgba(0, 212, 255, 0.9);
		border: 1px solid rgba(0, 212, 255, 0.5);
	}

	.notification-content {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Icons */
	.icon-neural,
	.icon-strava,
	.icon-garmin,
	.icon-polar,
	.icon-check,
	.icon-error,
	.icon-info {
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
		border: 1px solid white;
		border-radius: 50%;
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

	.icon-info {
		background: var(--neural-accent);
		border-radius: 50%;
		position: relative;
	}

	.icon-info:before {
		content: 'i';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	/* Animations */
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: scale(1);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.1);
		}
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

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(100%);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.integrations-grid {
			grid-template-columns: 1fr;
		}

		.benefits-grid {
			grid-template-columns: 1fr;
		}

		.card-actions {
			flex-direction: column;
		}

		.connection-stats {
			flex-direction: column;
			gap: 1rem;
		}

		.notification {
			right: 1rem;
			left: 1rem;
		}
	}
</style>
