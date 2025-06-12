<!-- Smart Triathlete Neural Profile -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Navigation from '$lib/components/Navigation.svelte';

	let user: any = null;

	onMount(() => {
		// Check authentication
		const token = localStorage.getItem('authToken');
		if (!token) {
			goto('/auth');
			return;
		}

		const userData = localStorage.getItem('user');
		if (userData) {
			user = JSON.parse(userData);
		}
	});
</script>

<svelte:head>
	<title>Smart Triathlete - Neural Profile</title>
</svelte:head>

<Navigation />

<div class="profile-page">
	<header class="page-header">
		<div class="container">
			<div class="title-section">
				<div class="logo">
					<div class="icon-neural"></div>
					<h1>Smart Triathlete</h1>
				</div>
				<p>Neural Profile Matrix</p>
			</div>
			<a href="/dashboard" class="back-link">
				<div class="icon-back"></div>
				Dashboard
			</a>
		</div>
	</header>

	<main class="container">
		<div class="profile-grid">
			<!-- Neural Profile Card -->
			<div class="profile-card main-card">
				<div class="card-header">
					<div class="icon-quantum"></div>
					<div class="header-content">
						<h2>Neural Athlete Profile</h2>
						<p>Quantum-enhanced athlete data and neural training optimization</p>
					</div>
				</div>

				<div class="profile-sections">
					<div class="section">
						<div class="section-header">
							<div class="icon-adaptive"></div>
							<h3>Personal Neural Data</h3>
						</div>
						<div class="info-grid">
							<div class="info-item">
								<span class="label">Neural ID</span>
								<span class="value">ATH-2025-{user?.email?.substring(0, 6) || 'GUEST'}</span>
							</div>
							<div class="info-item">
								<span class="label">Quantum Level</span>
								<span class="value">Neural Elite</span>
							</div>
							<div class="info-item">
								<span class="label">Training Status</span>
								<span class="value active">Active Protocol</span>
							</div>
							<div class="info-item">
								<span class="label">Neural Sync</span>
								<span class="value">98.7% Connected</span>
							</div>
						</div>
					</div>

					<div class="section">
						<div class="section-header">
							<div class="icon-pulse"></div>
							<h3>Quantum Training Zones</h3>
						</div>
						<div class="zones-grid">
							<div class="zone-card">
								<div class="zone-header">
									<div class="icon-swim"></div>
									<span>Neural Swimming</span>
								</div>
								<div class="zone-data">
									<div class="zone-metric">
										<span class="metric-label">Base Frequency</span>
										<span class="metric-value">142-158 Hz</span>
									</div>
									<div class="zone-metric">
										<span class="metric-label">Quantum Threshold</span>
										<span class="metric-value">172-186 Hz</span>
									</div>
								</div>
							</div>

							<div class="zone-card">
								<div class="zone-header">
									<div class="icon-bike"></div>
									<span>Neural Cycling</span>
								</div>
								<div class="zone-data">
									<div class="zone-metric">
										<span class="metric-label">Base Frequency</span>
										<span class="metric-value">148-164 Hz</span>
									</div>
									<div class="zone-metric">
										<span class="metric-label">Quantum Threshold</span>
										<span class="metric-value">178-192 Hz</span>
									</div>
								</div>
							</div>

							<div class="zone-card">
								<div class="zone-header">
									<div class="icon-run"></div>
									<span>Neural Running</span>
								</div>
								<div class="zone-data">
									<div class="zone-metric">
										<span class="metric-label">Base Frequency</span>
										<span class="metric-value">155-171 Hz</span>
									</div>
									<div class="zone-metric">
										<span class="metric-label">Quantum Threshold</span>
										<span class="metric-value">185-199 Hz</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Neural Preferences Card -->
			<div class="profile-card">
				<div class="card-header">
					<div class="icon-adaptive"></div>
					<div class="header-content">
						<h2>Neural Preferences</h2>
						<p>Customize your quantum training experience</p>
					</div>
				</div>

				<div class="preferences-list">
					<div class="preference-item">
						<div class="preference-info">
							<div class="icon-pulse"></div>
							<div class="preference-text">
								<h4>Neural Notifications</h4>
								<p>Quantum-enhanced training alerts</p>
							</div>
						</div>
						<div class="preference-status active">Enabled</div>
					</div>

					<div class="preference-item">
						<div class="preference-info">
							<div class="icon-quantum"></div>
							<div class="preference-text">
								<h4>Quantum Sync</h4>
								<p>Real-time neural data synchronization</p>
							</div>
						</div>
						<div class="preference-status active">Connected</div>
					</div>

					<div class="preference-item">
						<div class="preference-info">
							<div class="icon-neural"></div>
							<div class="preference-text">
								<h4>Neural Analytics</h4>
								<p>Advanced performance analysis</p>
							</div>
						</div>
						<div class="preference-status active">Active</div>
					</div>

					<div class="preference-item">
						<div class="preference-info">
							<div class="icon-adaptive"></div>
							<div class="preference-text">
								<h4>Adaptive Training</h4>
								<p>AI-powered training adjustments</p>
							</div>
						</div>
						<div class="preference-status active">Learning</div>
					</div>
				</div>
			</div>

			<!-- Neural System Status -->
			<div class="profile-card">
				<div class="card-header">
					<div class="icon-quantum"></div>
					<div class="header-content">
						<h2>Neural System Status</h2>
						<p>Real-time quantum system monitoring</p>
					</div>
				</div>

				<div class="system-status">
					<div class="status-grid">
						<div class="status-item">
							<div class="status-icon">
								<div class="icon-pulse"></div>
							</div>
							<div class="status-info">
								<h4>Neural Network</h4>
								<div class="status-bar">
									<div class="status-fill" style="width: 98%"></div>
								</div>
								<span class="status-text">98% Optimal</span>
							</div>
						</div>

						<div class="status-item">
							<div class="status-icon">
								<div class="icon-quantum"></div>
							</div>
							<div class="status-info">
								<h4>Quantum Coherence</h4>
								<div class="status-bar">
									<div class="status-fill" style="width: 94%"></div>
								</div>
								<span class="status-text">94% Stable</span>
							</div>
						</div>

						<div class="status-item">
							<div class="status-icon">
								<div class="icon-adaptive"></div>
							</div>
							<div class="status-info">
								<h4>Adaptive Learning</h4>
								<div class="status-bar">
									<div class="status-fill" style="width: 87%"></div>
								</div>
								<span class="status-text">87% Training</span>
							</div>
						</div>
					</div>

					<div class="system-message">
						<div class="message-icon">
							<div class="icon-neural"></div>
						</div>
						<div class="message-content">
							<h4>Neural System Online</h4>
							<p>
								All quantum training protocols are operational. Neural enhancement ready for
								deployment.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.profile-page {
		min-height: 100vh;
		background: var(--neural-bg);
		padding: 2rem 0;
		position: relative;
	}

	.profile-page::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: var(--neural-gradient);
		opacity: 0.1;
		z-index: 0;
	}

	.page-header {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 1.5rem 0;
		margin-bottom: 2rem;
		position: relative;
		z-index: 1;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
		position: relative;
		z-index: 1;
	}

	.page-header .container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.title-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo h1 {
		color: var(--neural-text);
		margin: 0;
		font-size: 1.75rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		background: var(--neural-gradient);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.title-section p {
		color: var(--neural-text-secondary);
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		margin: 0;
	}

	.back-link {
		color: var(--neural-text-secondary);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		transition: var(--neural-transition);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
	}

	.back-link:hover {
		color: var(--neural-text);
		background: rgba(255, 255, 255, 0.1);
		transform: translateY(-2px);
	}

	.profile-grid {
		display: grid;
		grid-template-columns: 1fr 400px;
		gap: 2rem;
	}

	.profile-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		height: fit-content;
	}

	.main-card {
		grid-row: span 2;
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.header-content h2 {
		margin: 0 0 0.5rem 0;
		color: var(--neural-text);
		font-size: 1.5rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.header-content p {
		color: var(--neural-text-secondary);
		margin: 0;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.profile-sections {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section {
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.section-header h3 {
		color: var(--neural-text);
		margin: 0;
		font-size: 1.1rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.info-item .label {
		color: var(--neural-text-secondary);
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.info-item .value {
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.info-item .value.active {
		color: var(--neural-accent);
	}

	.zones-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.zone-card {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: var(--neural-transition);
	}

	.zone-card:hover {
		background: rgba(255, 255, 255, 0.08);
		transform: translateY(-2px);
	}

	.zone-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.zone-header span {
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.zone-data {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.zone-metric {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.metric-label {
		color: var(--neural-text-secondary);
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.metric-value {
		color: var(--neural-accent);
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.preferences-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.preference-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: var(--neural-transition);
	}

	.preference-item:hover {
		background: rgba(255, 255, 255, 0.06);
	}

	.preference-info {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.preference-text h4 {
		color: var(--neural-text);
		margin: 0 0 0.25rem 0;
		font-size: 0.95rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.preference-text p {
		color: var(--neural-text-secondary);
		margin: 0;
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.preference-status {
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		background: rgba(255, 255, 255, 0.1);
		color: var(--neural-text-secondary);
	}

	.preference-status.active {
		background: var(--neural-accent);
		color: var(--neural-bg);
	}

	.system-status {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.status-grid {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.status-icon {
		flex-shrink: 0;
	}

	.status-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.status-info h4 {
		color: var(--neural-text);
		margin: 0;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.status-bar {
		width: 100%;
		height: 4px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 2px;
		overflow: hidden;
	}

	.status-fill {
		height: 100%;
		background: var(--neural-accent);
		border-radius: 2px;
		transition: width 0.5s ease;
	}

	.status-text {
		color: var(--neural-text-secondary);
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.system-message {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.message-content h4 {
		color: var(--neural-text);
		margin: 0 0 0.25rem 0;
		font-size: 0.95rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.message-content p {
		color: var(--neural-text-secondary);
		margin: 0;
		font-size: 0.8rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		line-height: 1.4;
	}

	/* Professional CSS Icons */
	.icon-neural {
		width: 48px;
		height: 48px;
		border: 2px solid var(--neural-accent);
		border-radius: 50%;
		position: relative;
		animation: neuralPulse 3s infinite;
	}

	.icon-neural::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 16px;
		height: 16px;
		background: var(--neural-accent);
		border-radius: 50%;
		animation: innerPulse 2s infinite;
	}

	.icon-quantum {
		width: 32px;
		height: 32px;
		border: 2px solid var(--neural-accent);
		border-radius: 50%;
		position: relative;
		animation: quantumSpin 4s linear infinite;
	}

	.icon-quantum::before,
	.icon-quantum::after {
		content: '';
		position: absolute;
		width: 8px;
		height: 8px;
		background: var(--neural-accent);
		border-radius: 50%;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.icon-quantum::before {
		animation: orbit 2s linear infinite;
	}

	.icon-quantum::after {
		animation: orbit 2s linear infinite reverse;
	}

	.icon-adaptive {
		width: 24px;
		height: 24px;
		position: relative;
	}

	.icon-adaptive::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		border: 2px solid var(--neural-accent);
		border-radius: 20% 80% 60% 40%;
		animation: morphing 4s ease-in-out infinite;
	}

	.icon-pulse {
		width: 24px;
		height: 24px;
		background: var(--neural-accent);
		border-radius: 6px;
		position: relative;
		animation: pulse 2s infinite;
	}

	.icon-pulse::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60%;
		height: 60%;
		background: var(--neural-bg);
		border-radius: 3px;
	}

	.icon-swim {
		width: 24px;
		height: 24px;
		border: 2px solid var(--neural-accent);
		border-radius: 50% 20% 50% 20%;
		position: relative;
		animation: swim 3s ease-in-out infinite;
	}

	.icon-bike {
		width: 24px;
		height: 24px;
		position: relative;
	}

	.icon-bike::before,
	.icon-bike::after {
		content: '';
		position: absolute;
		width: 10px;
		height: 10px;
		border: 2px solid var(--neural-accent);
		border-radius: 50%;
	}

	.icon-bike::before {
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		animation: wheel 2s linear infinite;
	}

	.icon-bike::after {
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		animation: wheel 2s linear infinite reverse;
	}

	.icon-run {
		width: 24px;
		height: 24px;
		background: transparent;
		border: 2px solid var(--neural-accent);
		border-radius: 20%;
		position: relative;
		animation: run 1.5s ease-in-out infinite;
	}

	.icon-run::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 8px;
		height: 8px;
		background: var(--neural-accent);
		border-radius: 50%;
	}

	.icon-back {
		width: 16px;
		height: 16px;
		border-left: 2px solid currentColor;
		border-bottom: 2px solid currentColor;
		transform: rotate(45deg);
	}

	/* Animations */
	@keyframes neuralPulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
	}

	@keyframes innerPulse {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	@keyframes quantumSpin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	@keyframes orbit {
		0% {
			transform: translate(-50%, -50%) translateX(12px) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) translateX(12px) rotate(360deg);
		}
	}

	@keyframes morphing {
		0%,
		100% {
			border-radius: 20% 80% 60% 40%;
		}
		25% {
			border-radius: 60% 40% 20% 80%;
		}
		50% {
			border-radius: 40% 60% 80% 20%;
		}
		75% {
			border-radius: 80% 20% 40% 60%;
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@keyframes swim {
		0%,
		100% {
			border-radius: 50% 20% 50% 20%;
		}
		50% {
			border-radius: 20% 50% 20% 50%;
		}
	}

	@keyframes wheel {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}

	@keyframes run {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.1) rotate(180deg);
		}
	}

	/* Responsive Design */
	@media (max-width: 1200px) {
		.profile-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.main-card {
			grid-row: unset;
		}
	}

	@media (max-width: 768px) {
		.page-header .container {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.logo {
			justify-content: center;
		}

		.profile-card {
			padding: 1.5rem;
		}

		.card-header {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}

		.zones-grid {
			grid-template-columns: 1fr;
		}

		.preference-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.system-message {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
	}
</style>
