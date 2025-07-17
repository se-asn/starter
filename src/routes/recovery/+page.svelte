<script lang="ts">
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	let user: any = null;
	let mounted = false;

	// Recovery metrics data
	let recoveryData = {
		overall: {
			score: 78,
			status: 'Gut erholt',
			recommendation: 'Moderate Intensität empfohlen',
			color: '#4CAF50'
		},
		hrv: {
			current: 42,
			baseline: 45,
			trend: 'stable',
			status: 'Normal',
			color: '#2196F3'
		},
		restingHR: {
			current: 38,
			baseline: 38,
			trend: 'stable',
			status: 'Excellent',
			color: '#4CAF50'
		},
		sleep: {
			duration: 7.5,
			quality: 85,
			deepSleep: 1.8,
			remSleep: 1.2,
			efficiency: 92,
			status: 'Sehr gut',
			color: '#4CAF50'
		},
		stress: {
			level: 32,
			max: 100,
			status: 'Niedrig',
			color: '#4CAF50'
		},
		fatigue: {
			muscular: 25,
			metabolic: 30,
			neurological: 20,
			overall: 'Gering',
			color: '#4CAF50'
		},
		readiness: {
			score: 82,
			factors: [
				{ name: 'Schlafqualität', value: 85, color: '#4CAF50' },
				{ name: 'HRV Status', value: 78, color: '#4CAF50' },
				{ name: 'Ruhepuls', value: 95, color: '#4CAF50' },
				{ name: 'Stress Level', value: 88, color: '#4CAF50' },
				{ name: 'Subjektives Gefühl', value: 80, color: '#4CAF50' }
			]
		}
	};

	// Weekly recovery trend
	let weeklyTrend = [
		{ day: 'Mo', score: 85, sleep: 8.2, hrv: 44 },
		{ day: 'Di', score: 72, sleep: 6.8, hrv: 39 },
		{ day: 'Mi', score: 78, sleep: 7.5, hrv: 42 },
		{ day: 'Do', score: 80, sleep: 7.8, hrv: 43 },
		{ day: 'Fr', score: 75, sleep: 7.2, hrv: 41 },
		{ day: 'Sa', score: 88, sleep: 8.5, hrv: 46 },
		{ day: 'So', score: 82, sleep: 8.0, hrv: 44 }
	];

	// Recovery recommendations
	let recommendations = [
		{
			category: 'Schlaf',
			icon: '😴',
			title: 'Optimiere deine Schlafqualität',
			tips: [
				'Konstante Schlafenszeiten einhalten',
				'2h vor dem Schlaf kein Bildschirm',
				'Raum auf 18-20°C kühlen',
				'Meditation vor dem Schlaf'
			]
		},
		{
			category: 'Ernährung',
			icon: '🥗',
			title: 'Recovery-optimierte Ernährung',
			tips: [
				'Antioxidantienreiche Lebensmittel',
				'Omega-3 Fettsäuren erhöhen',
				'Ausreichend Protein (1.6g/kg)',
				'Magnesium und Zink supplementieren'
			]
		},
		{
			category: 'Active Recovery',
			icon: '🧘',
			title: 'Regenerative Measures',
			tips: [
				'Yoga or stretching',
				'Light swimming sessions',
				'Nature walks',
				'Practice breathing exercises'
			]
		},
		{
			category: 'Therapy',
			icon: '💆',
			title: 'Professional Support',
			tips: [
				'Regular massage',
				'Physiotherapy when needed',
				'Cold therapy/ice bath',
				'Use compression wear'
			]
		}
	];

	onMount(async () => {
		mounted = true;
	});

	function getScoreColor(score: number): string {
		if (score >= 80) return '#4CAF50';
		if (score >= 60) return '#FF9800';
		return '#f44336';
	}

	function getTrendIcon(trend: string): string {
		switch (trend) {
			case 'up':
				return '📈';
			case 'down':
				return '📉';
			case 'stable':
				return '➡️';
			default:
				return '➡️';
		}
	}
</script>

<Navigation />

<main class="recovery-page">
	<div class="page-header">
		<h1>🔋 Recovery Analyse</h1>
		<div class="overall-score">
			<div class="score-circle" style="border-color: {recoveryData.overall.color}">
				<span class="score-value">{recoveryData.overall.score}</span>
				<span class="score-label">Recovery</span>
			</div>
		</div>
	</div>

	<div class="recovery-grid">
		<!-- HRV Card -->
		<div class="metric-card">
			<div class="card-header">
				<h3>💓 Herzfrequenzvariabilität</h3>
				<span class="trend-icon">{getTrendIcon(recoveryData.hrv.trend)}</span>
			</div>
			<div class="metric-value">
				<span class="value">{recoveryData.hrv.current}</span>
				<span class="unit">ms</span>
			</div>
			<div class="metric-details">
				<div class="detail-row">
					<span>Baseline:</span>
					<span>{recoveryData.hrv.baseline} ms</span>
				</div>
				<div class="detail-row">
					<span>Status:</span>
					<span style="color: {recoveryData.hrv.color}">{recoveryData.hrv.status}</span>
				</div>
			</div>
		</div>

		<!-- Resting HR Card -->
		<div class="metric-card">
			<div class="card-header">
				<h3>❤️ Ruheherzfrequenz</h3>
				<span class="trend-icon">{getTrendIcon(recoveryData.restingHR.trend)}</span>
			</div>
			<div class="metric-value">
				<span class="value">{recoveryData.restingHR.current}</span>
				<span class="unit">bpm</span>
			</div>
			<div class="metric-details">
				<div class="detail-row">
					<span>Baseline:</span>
					<span>{recoveryData.restingHR.baseline} bpm</span>
				</div>
				<div class="detail-row">
					<span>Status:</span>
					<span style="color: {recoveryData.restingHR.color}">{recoveryData.restingHR.status}</span>
				</div>
			</div>
		</div>

		<!-- Sleep Card -->
		<div class="metric-card sleep-card">
			<div class="card-header">
				<h3>😴 Schlafanalyse</h3>
				<span class="sleep-score" style="color: {recoveryData.sleep.color}"
					>{recoveryData.sleep.quality}%</span
				>
			</div>
			<div class="sleep-metrics">
				<div class="sleep-metric">
					<span class="metric-label">Schlafdauer</span>
					<span class="metric-value">{recoveryData.sleep.duration}h</span>
				</div>
				<div class="sleep-metric">
					<span class="metric-label">Tiefschlaf</span>
					<span class="metric-value">{recoveryData.sleep.deepSleep}h</span>
				</div>
				<div class="sleep-metric">
					<span class="metric-label">REM-Schlaf</span>
					<span class="metric-value">{recoveryData.sleep.remSleep}h</span>
				</div>
				<div class="sleep-metric">
					<span class="metric-label">Effizienz</span>
					<span class="metric-value">{recoveryData.sleep.efficiency}%</span>
				</div>
			</div>
		</div>

		<!-- Stress Level Card -->
		<div class="metric-card">
			<div class="card-header">
				<h3>😰 Stress Level</h3>
				<span class="status-badge" style="background: {recoveryData.stress.color}"
					>{recoveryData.stress.status}</span
				>
			</div>
			<div class="stress-bar">
				<div
					class="stress-fill"
					style="width: {recoveryData.stress.level}%; background: {recoveryData.stress.color}"
				></div>
			</div>
			<div class="metric-details">
				<span>{recoveryData.stress.level}/100</span>
			</div>
		</div>

		<!-- Fatigue Analysis -->
		<div class="metric-card fatigue-card">
			<div class="card-header">
				<h3>🏃 Ermüdungsanalyse</h3>
				<span class="overall-fatigue" style="color: {recoveryData.fatigue.color}"
					>{recoveryData.fatigue.overall}</span
				>
			</div>
			<div class="fatigue-types">
				<div class="fatigue-type">
					<span class="fatigue-label">Muskulär</span>
					<div class="fatigue-bar">
						<div class="fatigue-fill" style="width: {recoveryData.fatigue.muscular}%"></div>
					</div>
					<span class="fatigue-value">{recoveryData.fatigue.muscular}%</span>
				</div>
				<div class="fatigue-type">
					<span class="fatigue-label">Metabolisch</span>
					<div class="fatigue-bar">
						<div class="fatigue-fill" style="width: {recoveryData.fatigue.metabolic}%"></div>
					</div>
					<span class="fatigue-value">{recoveryData.fatigue.metabolic}%</span>
				</div>
				<div class="fatigue-type">
					<span class="fatigue-label">Neurologisch</span>
					<div class="fatigue-bar">
						<div class="fatigue-fill" style="width: {recoveryData.fatigue.neurological}%"></div>
					</div>
					<span class="fatigue-value">{recoveryData.fatigue.neurological}%</span>
				</div>
			</div>
		</div>

		<!-- Readiness Factors -->
		<div class="metric-card readiness-card">
			<div class="card-header">
				<h3>⚡ Bereitschaftsfaktoren</h3>
				<span class="readiness-score" style="color: {getScoreColor(recoveryData.readiness.score)}"
					>{recoveryData.readiness.score}%</span
				>
			</div>
			<div class="readiness-factors">
				{#each recoveryData.readiness.factors as factor}
					<div class="factor">
						<span class="factor-name">{factor.name}</span>
						<div class="factor-bar">
							<div
								class="factor-fill"
								style="width: {factor.value}%; background: {factor.color}"
							></div>
						</div>
						<span class="factor-value">{factor.value}%</span>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Weekly Trend -->
	<div class="trend-section">
		<h2>📊 Wochentrend</h2>
		<div class="trend-chart">
			{#each weeklyTrend as day}
				<div class="trend-day">
					<div class="trend-bar">
						<div
							class="trend-fill"
							style="height: {day.score}%; background: {getScoreColor(day.score)}"
						></div>
					</div>
					<span class="trend-label">{day.day}</span>
					<span class="trend-score">{day.score}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Recommendations -->
	<div class="recommendations-section">
		<h2>💡 Recovery-Empfehlungen</h2>
		<div class="recommendations-grid">
			{#each recommendations as rec}
				<div class="recommendation-card">
					<div class="rec-header">
						<span class="rec-icon">{rec.icon}</span>
						<h3>{rec.title}</h3>
					</div>
					<ul class="rec-tips">
						{#each rec.tips as tip}
							<li>{tip}</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	.recovery-page {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0;
		color: #667eea;
		font-size: 2.5rem;
		font-weight: 700;
	}

	.overall-score {
		display: flex;
		align-items: center;
	}

	.score-circle {
		width: 120px;
		height: 120px;
		border: 4px solid;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
	}

	.score-value {
		font-size: 2rem;
		font-weight: 700;
		color: #333;
	}

	.score-label {
		font-size: 0.9rem;
		color: #666;
		font-weight: 500;
	}

	.recovery-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.metric-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.metric-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.card-header h3 {
		margin: 0;
		color: #667eea;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.metric-value {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.metric-value .value {
		font-size: 2.5rem;
		font-weight: 700;
		color: #333;
	}

	.metric-value .unit {
		font-size: 1rem;
		color: #666;
	}

	.metric-details {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
	}

	.sleep-metrics {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.sleep-metric {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.metric-label {
		font-size: 0.8rem;
		color: #666;
	}

	.stress-bar {
		width: 100%;
		height: 8px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.5rem;
	}

	.stress-fill {
		height: 100%;
		transition: width 0.3s ease;
	}

	.fatigue-types {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.fatigue-type {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.fatigue-label {
		min-width: 80px;
		font-size: 0.9rem;
		color: #666;
	}

	.fatigue-bar {
		flex: 1;
		height: 6px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		overflow: hidden;
	}

	.fatigue-fill {
		height: 100%;
		background: linear-gradient(90deg, #4caf50, #ff9800, #f44336);
		transition: width 0.3s ease;
	}

	.fatigue-value {
		min-width: 35px;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.readiness-factors {
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.factor {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.factor-name {
		min-width: 120px;
		font-size: 0.9rem;
		color: #666;
	}

	.factor-bar {
		flex: 1;
		height: 6px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 3px;
		overflow: hidden;
	}

	.factor-fill {
		height: 100%;
		transition: width 0.3s ease;
	}

	.factor-value {
		min-width: 35px;
		font-size: 0.9rem;
		font-weight: 600;
	}

	.trend-section {
		margin: 3rem 0;
	}

	.trend-section h2 {
		color: #667eea;
		margin-bottom: 1.5rem;
	}

	.trend-chart {
		display: flex;
		gap: 1rem;
		align-items: end;
		height: 200px;
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 2rem;
	}

	.trend-day {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.trend-bar {
		width: 30px;
		height: 120px;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 15px;
		overflow: hidden;
		display: flex;
		align-items: end;
	}

	.trend-fill {
		width: 100%;
		border-radius: 15px;
		transition: height 0.3s ease;
	}

	.trend-label {
		font-weight: 600;
		color: #666;
	}

	.trend-score {
		font-size: 0.9rem;
		font-weight: 700;
		color: #333;
	}

	.recommendations-section {
		margin-top: 3rem;
	}

	.recommendations-section h2 {
		color: #667eea;
		margin-bottom: 1.5rem;
	}

	.recommendations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.recommendation-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.recommendation-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
	}

	.rec-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.rec-icon {
		font-size: 2rem;
	}

	.rec-header h3 {
		margin: 0;
		color: #667eea;
		font-size: 1.1rem;
		font-weight: 600;
	}

	.rec-tips {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.rec-tips li {
		color: #666;
		font-size: 0.9rem;
		padding-left: 1rem;
		position: relative;
	}

	.rec-tips li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: #4caf50;
		font-weight: bold;
	}

	.status-badge {
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
	}

	.trend-icon {
		font-size: 1.2rem;
	}

	@media (max-width: 768px) {
		.recovery-page {
			padding: 1rem;
		}

		.page-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.recovery-grid {
			grid-template-columns: 1fr;
		}

		.trend-chart {
			padding: 1rem;
			height: 150px;
		}

		.trend-bar {
			height: 80px;
		}

		.recommendations-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
