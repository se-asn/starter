<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';
	import { browser } from '$app/environment';
	import Navigation from '$lib/components/Navigation.svelte';

	let user: any = null;
	let mounted = false;
	let view = '';

	onMount(async () => {
		// Check URL params
		view = $page.url.searchParams.get('view') || '';

		// Check authentication
		if (browser) {
			if (localStorage.getItem('demoMode') === 'true') {
				user = { email: 'demo@laufplanerpro.de', name: 'Demo User' };
			} else {
				const {
					data: { session }
				} = await supabase.auth.getSession();
				if (!session) {
					goto('/auth');
					return;
				}
				user = session.user;
			}
		}
		mounted = true;

		// Handle view modes
		if (view === 'monthly') {
			showMonthlyView();
		} else if (view === 'yearly') {
			showYearlyView();
		}
	});

	function showMonthlyView() {
		alert('Monatsansicht wird geladen...');
		// Here would be monthly view logic
	}

	function showYearlyView() {
		alert('Jahresansicht wird geladen...');
		// Here would be yearly view logic
	}
</script>

<svelte:head>
	<title>Analytics - LaufplanerPro</title>
	<meta name="description" content="Detaillierte Leistungsanalyse und Trends" />
</svelte:head>

{#if mounted}
	<Navigation />

	<div class="analytics-page">
		<div class="container">
			<header class="page-header">
				<h1>Analytics & Leistungsanalyse</h1>
				<p>Detaillierte Auswertung Ihrer Trainingsdaten und Leistungstrends</p>
			</header>

			<div class="analytics-grid">
				<div class="analytics-card">
					<h2>📈 Performance Trends</h2>
					<p>Langzeit-Leistungsentwicklung und Verbesserungen</p>
					<div class="placeholder-chart">
						<div class="chart-line"></div>
						<div class="chart-data">
							<span>VO2 Max: 68.5 ml/kg/min (+2.1 seit letztem Jahr)</span>
							<span>FTP: 285W (+15W seit letztem Test)</span>
							<span>Lauf-Schwelle: 3:45/km (-8s Verbesserung)</span>
						</div>
					</div>
				</div>

				<div class="analytics-card">
					<h2>📊 Training Load Analysis</h2>
					<p>TSS, CTL, ATL und Form-Entwicklung</p>
					<div class="training-metrics">
						<div class="metric">
							<span class="label">Chronic Training Load (CTL)</span>
							<span class="value">95</span>
						</div>
						<div class="metric">
							<span class="label">Acute Training Load (ATL)</span>
							<span class="value">45</span>
						</div>
						<div class="metric">
							<span class="label">Training Stress Balance (TSB)</span>
							<span class="value positive">+50</span>
						</div>
					</div>
				</div>

				<div class="analytics-card">
					<h2>🏃‍♂️ Sport-spezifische Analyse</h2>
					<p>Detaillierte Aufschlüsselung nach Disziplinen</p>
					<div class="sport-breakdown">
						<div class="sport-item">
							<span class="sport-icon">🏊‍♂️</span>
							<span class="sport-name">Schwimmen</span>
							<span class="percentage">25%</span>
						</div>
						<div class="sport-item">
							<span class="sport-icon">🚴‍♂️</span>
							<span class="sport-name">Radfahren</span>
							<span class="percentage">45%</span>
						</div>
						<div class="sport-item">
							<span class="sport-icon">🏃‍♂️</span>
							<span class="sport-name">Laufen</span>
							<span class="percentage">30%</span>
						</div>
					</div>
				</div>

				<div class="analytics-card">
					<h2>🎯 Zone Distribution</h2>
					<p>Trainingsintensität und Zonenverteilung</p>
					<div class="zone-chart">
						<div class="zone-bar zone-1" style="width: 45%">Zone 1-2: 45%</div>
						<div class="zone-bar zone-3" style="width: 25%">Zone 3: 25%</div>
						<div class="zone-bar zone-4" style="width: 20%">Zone 4: 20%</div>
						<div class="zone-bar zone-5" style="width: 10%">Zone 5: 10%</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.analytics-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
		color: #e2e8f0;
		padding-top: 80px;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
	}

	.page-header p {
		font-size: 1.125rem;
		color: #94a3b8;
	}

	.analytics-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 2rem;
	}

	.analytics-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2rem;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.analytics-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(102, 126, 234, 0.1);
	}

	.analytics-card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #e2e8f0;
	}

	.analytics-card p {
		color: #94a3b8;
		margin-bottom: 1.5rem;
	}

	.placeholder-chart {
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		text-align: center;
	}

	.chart-line {
		height: 100px;
		background: linear-gradient(90deg, #4caf50, #667eea, #f44336);
		border-radius: 4px;
		margin-bottom: 1rem;
		opacity: 0.7;
	}

	.chart-data {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.chart-data span {
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.training-metrics {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.metric {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
	}

	.metric .label {
		color: #94a3b8;
	}

	.metric .value {
		font-weight: 600;
		font-size: 1.125rem;
		color: #e2e8f0;
	}

	.metric .value.positive {
		color: #4caf50;
	}

	.sport-breakdown {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sport-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
	}

	.sport-icon {
		font-size: 1.5rem;
	}

	.sport-name {
		flex: 1;
		color: #e2e8f0;
	}

	.percentage {
		font-weight: 600;
		color: #667eea;
	}

	.zone-chart {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.zone-bar {
		padding: 0.75rem;
		border-radius: 4px;
		color: white;
		font-weight: 500;
		transition: width 0.3s ease;
	}

	.zone-bar.zone-1 {
		background: #4caf50;
	}
	.zone-bar.zone-3 {
		background: #ffc107;
	}
	.zone-bar.zone-4 {
		background: #ff9800;
	}
	.zone-bar.zone-5 {
		background: #f44336;
	}

	@media (max-width: 768px) {
		.analytics-grid {
			grid-template-columns: 1fr;
		}

		.container {
			padding: 1rem;
		}

		.page-header h1 {
			font-size: 2rem;
		}
	}
</style>
