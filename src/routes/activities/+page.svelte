<!-- Smart Triathlete Neural Activities -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ClientAuth } from '$lib/client-auth';
	import Navigation from '$lib/components/Navigation.svelte';

	// Authentication
	let user = null;

	// Sample Activities Data
	let activities = [
		{
			id: 1,
			sport: 'run',
			name: 'Neural Endurance Protocol',
			date: '2025-06-09',
			duration: '01:45:32',
			distance: '21.1km',
			pace: '4:58/km',
			tss: 94,
			hr_avg: 165,
			hr_max: 182,
			calories: 1247,
			elevation: 234,
			weather: 'Quantum Clear, 18°C'
		},
		{
			id: 2,
			sport: 'bike',
			name: 'Quantum Power Analysis',
			date: '2025-06-08',
			duration: '01:32:15',
			distance: '45.2km',
			power_avg: 287,
			power_max: 342,
			tss: 128,
			hr_avg: 172,
			calories: 892,
			elevation: 145,
			weather: 'Neural Conditions, 22°C'
		},
		{
			id: 3,
			sport: 'swim',
			name: 'Adaptive Threshold Matrix',
			date: '2025-06-07',
			duration: '01:15:20',
			distance: '3.2km',
			pace: '1:34/100m',
			tss: 75,
			stroke_rate: 68,
			calories: 445,
			pool_length: '50m',
			weather: 'Indoor Pool'
		},
		{
			id: 4,
			sport: 'bike',
			name: 'Easy Recovery Ride',
			date: '2025-06-06',
			duration: '02:12:45',
			distance: '65.8km',
			power_avg: 185,
			tss: 89,
			hr_avg: 142,
			calories: 1156,
			elevation: 567,
			weather: 'Sunny, 25°C'
		},
		{
			id: 5,
			sport: 'run',
			name: 'Track Speed Work',
			date: '2025-06-05',
			duration: '00:52:30',
			distance: '12.5km',
			pace: '4:12/km',
			tss: 67,
			hr_avg: 178,
			hr_max: 194,
			calories: 678,
			elevation: 23,
			weather: 'Overcast, 16°C'
		}
	];

	// Summary data
	let weekSummary = {
		totalDistance: { swim: '12.8km', bike: '387km', run: '68.5km' },
		totalTime: { swim: '4:35:20', bike: '12:15:45', run: '6:48:12' },
		totalTSS: { swim: 287, bike: 456, run: 342 },
		totalCalories: 4418
	};

	// Filters
	let selectedSport = 'all';
	let selectedWeek = 'this-week';
	let loading = false;
	let error = '';

	// Pagination
	let currentPage = 0;
	let itemsPerPage = 5;

	$: filteredActivities = activities.filter(
		(activity) => selectedSport === 'all' || activity.sport === selectedSport
	);

	$: paginatedActivities = filteredActivities.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);

	$: totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

	onMount(() => {
		user = ClientAuth.getCurrentUser();
		if (!user) {
			goto('/auth');
			return;
		}
	});
	function getSportIcon(sport: string): string {
		return sport; // Return sport name for CSS class
	}

	function getSportColor(sport: string): string {
		switch (sport) {
			case 'swim':
				return '#00D4FF';
			case 'bike':
				return '#FF6B35';
			case 'run':
				return '#4CAF50';
			default:
				return '#ffffff';
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}
</script>

<svelte:head>
	<title>Smart Triathlete - Neural Activities</title>
	<meta name="description" content="Quantum analysis of your neural training sessions" />
</svelte:head>

<Navigation />

<div class="activities-container">
	<!-- Weekly Summary -->
	<section class="weekly-summary">
		<h2>Neural Activity Matrix</h2>
		<div class="summary-grid">
			<div class="summary-card swim">
				<div class="card-header">
					<div class="icon-swim"></div>
					<span class="sport-name">Neural Swimming</span>
				</div>
				<div class="stats-grid">
					<div class="stat-item">
						<span class="stat-label">Distance</span>
						<span class="stat-value">{weekSummary.totalDistance.swim}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Time</span>
						<span class="stat-value">{weekSummary.totalTime.swim}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">TSS</span>
						<span class="stat-value">{weekSummary.totalTSS.swim}</span>
					</div>
				</div>
			</div>

			<div class="summary-card bike">
				<div class="card-header">
					<div class="icon-bike"></div>
					<span class="sport-name">Quantum Cycling</span>
				</div>
				<div class="stats-grid">
					<div class="stat-item">
						<span class="stat-label">Distance</span>
						<span class="stat-value">{weekSummary.totalDistance.bike}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Time</span>
						<span class="stat-value">{weekSummary.totalTime.bike}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">TSS</span>
						<span class="stat-value">{weekSummary.totalTSS.bike}</span>
					</div>
				</div>
			</div>

			<div class="summary-card run">
				<div class="card-header">
					<div class="icon-run"></div>
					<span class="sport-name">Adaptive Running</span>
				</div>
				<div class="stats-grid">
					<div class="stat-item">
						<span class="stat-label">Distance</span>
						<span class="stat-value">{weekSummary.totalDistance.run}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">Time</span>
						<span class="stat-value">{weekSummary.totalTime.run}</span>
					</div>
					<div class="stat-item">
						<span class="stat-label">TSS</span>
						<span class="stat-value">{weekSummary.totalTSS.run}</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Filters -->
	<section class="filters">
		<div class="filter-group">
			<label for="sport-filter">Sport:</label>
			<select id="sport-filter" bind:value={selectedSport}>
				<option value="all">All Sports</option>
				<option value="swim">Swimming</option>
				<option value="bike">Cycling</option>
				<option value="run">Running</option>
			</select>
		</div>

		<div class="filter-group">
			<label for="week-filter">Period:</label>
			<select id="week-filter" bind:value={selectedWeek}>
				<option value="this-week">This Week</option>
				<option value="last-week">Last Week</option>
				<option value="this-month">This Month</option>
			</select>
		</div>
	</section>
	<!-- Activities List -->
	<section class="activities-list">
		<h2>Neural Activity Log</h2>

		{#if loading}
			<div class="loading">
				<div class="icon-sync loading"></div>
				Analyzing neural patterns...
			</div>
		{:else if error}
			<div class="error">
				<div class="icon-error"></div>
				{error}
			</div>
		{:else if paginatedActivities.length === 0}
			<div class="empty-state">
				<div class="icon-quantum"></div>
				<h3>No neural activities detected</h3>
				<p>Begin your quantum training to initialize activity patterns!</p>
			</div>
		{:else}
			<div class="activities-grid">
				{#each paginatedActivities as activity}
					<div class="activity-card" style="border-left-color: {getSportColor(activity.sport)}">
						<div class="activity-header">
							<div class="activity-title">
								<div class="icon-{activity.sport}"></div>
								<div class="title-info">
									<h3>{activity.name}</h3>
									<span class="activity-date">{formatDate(activity.date)}</span>
								</div>
							</div>
							<div class="tss-badge">
								TSS: {activity.tss}
							</div>
						</div>

						<div class="activity-stats">
							<div class="primary-stats">
								<div class="stat">
									<span class="stat-label">Duration</span>
									<span class="stat-value">{activity.duration}</span>
								</div>
								<div class="stat">
									<span class="stat-label">Distance</span>
									<span class="stat-value">{activity.distance}</span>
								</div>
								{#if activity.pace}
									<div class="stat">
										<span class="stat-label">Pace</span>
										<span class="stat-value">{activity.pace}</span>
									</div>
								{:else if activity.power_avg}
									<div class="stat">
										<span class="stat-label">Avg Power</span>
										<span class="stat-value">{activity.power_avg}W</span>
									</div>
								{/if}
							</div>

							<div class="secondary-stats">
								{#if activity.hr_avg}
									<div class="stat">
										<span class="stat-label">
											<div class="icon-heart"></div>
											Avg HR
										</span>
										<span class="stat-value">{activity.hr_avg} bpm</span>
									</div>
								{/if}
								<div class="stat">
									<span class="stat-label">
										<div class="icon-energy"></div>
										Energy
									</span>
									<span class="stat-value">{activity.calories}</span>
								</div>
								{#if activity.elevation}
									<div class="stat">
										<span class="stat-label">
											<div class="icon-elevation"></div>
											Elevation
										</span>
										<span class="stat-value">{activity.elevation}m</span>
									</div>
								{/if}
							</div>
						</div>

						<div class="activity-footer">
							<span class="weather">
								<div class="icon-weather"></div>
								{activity.weather}
							</span>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="pagination">
					<button on:click={prevPage} disabled={currentPage === 0} class="page-btn">
						← Previous
					</button>

					<span class="page-info">
						Page {currentPage + 1} of {totalPages}
					</span>

					<button on:click={nextPage} disabled={currentPage >= totalPages - 1} class="page-btn">
						Next →
					</button>
				</div>
			{/if}
		{/if}
	</section>
</div>

<style>
	/* Neural/Quantum Activities Design */
	* {
		box-sizing: border-box;
	}

	.activities-container {
		min-height: 100vh;
		background: var(--neural-bg);
		color: var(--neural-text);
		font-family: var(--font-neural);
		padding: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Neural Icons */
	.icon-neural,
	.icon-back,
	.icon-swim,
	.icon-bike,
	.icon-run,
	.icon-sync,
	.icon-error,
	.icon-quantum,
	.icon-heart,
	.icon-energy,
	.icon-elevation,
	.icon-weather {
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

	.icon-back {
		background: linear-gradient(135deg, var(--neural-secondary), var(--neural-accent));
		clip-path: polygon(40% 20%, 20% 50%, 40% 80%, 35% 80%, 15% 50%, 35% 20%);
		margin-right: 0.5rem;
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

	.icon-sync {
		background: var(--neural-accent);
		border-radius: 50%;
		margin-right: 0.5rem;
	}

	.icon-sync.loading {
		animation: rotate 1s linear infinite;
	}

	.icon-error {
		background: #ff4444;
		border-radius: 50%;
		position: relative;
		margin-right: 0.5rem;
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

	.icon-quantum {
		background: linear-gradient(45deg, var(--neural-accent), var(--neural-secondary));
		border-radius: 50%;
		position: relative;
		width: 48px;
		height: 48px;
		margin: 0 auto 1rem;
	}

	.icon-quantum:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 12px;
		height: 12px;
		background: var(--neural-bg);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: quantumSpin 3s linear infinite;
	}

	.icon-heart {
		width: 16px;
		height: 16px;
		background: #ff6b6b;
		border-radius: 50%;
		margin-right: 0.5rem;
	}

	.icon-energy {
		width: 16px;
		height: 16px;
		background: linear-gradient(45deg, #ff6b35, #ffab00);
		clip-path: polygon(
			50% 0%,
			61% 35%,
			98% 35%,
			68% 57%,
			79% 91%,
			50% 70%,
			21% 91%,
			32% 57%,
			2% 35%,
			39% 35%
		);
		margin-right: 0.5rem;
	}

	.icon-elevation {
		width: 16px;
		height: 16px;
		background: linear-gradient(135deg, #4caf50, #2e7d32);
		clip-path: polygon(0% 70%, 50% 0%, 100% 70%, 100% 100%, 0% 100%);
		margin-right: 0.5rem;
	}

	.icon-weather {
		width: 16px;
		height: 16px;
		background: linear-gradient(135deg, #00d4ff, #0099cc);
		border-radius: 50%;
		margin-right: 0.5rem;
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

	@keyframes quantumSpin {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
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
	/* Header */
	.weekly-summary {
		max-width: 1200px;
		margin: 0 auto 3rem auto;
	}

	.weekly-summary h2 {
		font-size: 1.5rem;
		font-weight: 300;
		margin: 0 0 2rem 0;
		letter-spacing: 0.02em;
		opacity: 0.9;
	}

	.summary-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	.summary-card {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 2rem;
		backdrop-filter: blur(20px);
		transition: all var(--neural-transition);
	}

	.summary-card:hover {
		background: var(--neural-hover);
		transform: translateY(-4px);
		box-shadow: var(--neural-shadow);
	}

	.summary-card.swim {
		border-left: 4px solid #00d4ff;
	}
	.summary-card.bike {
		border-left: 4px solid #ff6b35;
	}
	.summary-card.run {
		border-left: 4px solid #4caf50;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.sport-name {
		font-size: 1.2rem;
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat-label {
		font-size: 0.8rem;
		opacity: 0.7;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		font-weight: 300;
	}

	.stat-value {
		font-size: 1.2rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Filters */
	.filters {
		max-width: 1200px;
		margin: 0 auto 2rem auto;
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.filter-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.filter-group label {
		font-size: 0.9rem;
		font-weight: 300;
		opacity: 0.8;
		letter-spacing: 0.01em;
	}

	.filter-group select {
		padding: 1rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		color: var(--neural-text);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: all var(--neural-transition);
	}

	.filter-group select:focus {
		outline: none;
		border-color: var(--neural-accent);
		box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
		background: var(--neural-hover);
	}

	/* Activities List */
	.activities-list {
		max-width: 1200px;
		margin: 0 auto;
	}

	.activities-list h2 {
		font-size: 1.5rem;
		font-weight: 300;
		margin: 0 0 2rem 0;
		letter-spacing: 0.02em;
		opacity: 0.9;
	}

	.activities-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	.activity-card {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-left: 4px solid #00d4ff;
		border-radius: 16px;
		padding: 2rem;
		backdrop-filter: blur(20px);
		transition: all var(--neural-transition);
	}

	.activity-card:hover {
		background: var(--neural-hover);
		transform: translateY(-4px);
		box-shadow: var(--neural-shadow);
	}

	.activity-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
	}

	.activity-title {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.title-info h3 {
		font-size: 1.2rem;
		font-weight: 300;
		margin: 0 0 0.5rem 0;
		letter-spacing: 0.01em;
	}

	.activity-date {
		font-size: 0.9rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.tss-badge {
		padding: 0.75rem 1.25rem;
		background: rgba(0, 212, 255, 0.2);
		border: 1px solid rgba(0, 212, 255, 0.3);
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--neural-accent);
		letter-spacing: 0.02em;
	}

	.activity-stats {
		display: grid;
		gap: 2rem;
		margin-bottom: 1.5rem;
	}

	.primary-stats,
	.secondary-stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1.5rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stat .stat-label {
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.stat .stat-value {
		font-size: 1.1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.activity-footer {
		padding-top: 1.5rem;
		border-top: 1px solid var(--neural-border);
	}

	.weather {
		font-size: 0.9rem;
		opacity: 0.8;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* States */
	.loading {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		text-align: center;
		padding: 4rem;
		font-size: 1.1rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.error {
		background: rgba(255, 68, 68, 0.15);
		border: 1px solid rgba(255, 68, 68, 0.3);
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		color: #ff6b6b;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
	}

	.empty-state h3 {
		font-size: 1.5rem;
		font-weight: 300;
		margin: 0 0 1rem 0;
		letter-spacing: 0.02em;
	}

	.empty-state p {
		opacity: 0.8;
		margin: 0;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		margin: 3rem 0 2rem 0;
	}

	.page-btn {
		padding: 1rem 2rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		color: var(--neural-text);
		cursor: pointer;
		transition: all var(--neural-transition);
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.page-btn:hover:not(:disabled) {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	.page-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none;
	}

	.page-info {
		font-size: 0.9rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	/* Responsive Design */
	@media (min-width: 768px) {
		.activities-container {
			padding: 2rem;
		}

		.summary-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.activities-grid {
			grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		}
		.filters {
			flex-direction: row;
			justify-content: flex-start;
		}
	}

	@media (max-width: 480px) {
		.header-content {
			flex-direction: column;
			gap: 1rem;
		}

		.activities-card {
			padding: 1.5rem;
		}

		.activity-header {
			flex-direction: column;
			gap: 1rem;
			align-items: flex-start;
		}

		.stats-grid {
			grid-template-columns: 1fr;
		}

		.primary-stats,
		.secondary-stats {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
