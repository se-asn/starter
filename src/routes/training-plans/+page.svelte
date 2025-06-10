<!-- Smart Triathlete Neural Training Plans -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user = null;

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
	<title>Smart Triathlete - Neural Training Plans</title>
</svelte:head>

<div class="training-plans-page">
	<header class="page-header">
		<div class="container">
			<div class="title-section">
				<div class="logo">
					<div class="icon-neural"></div>
					<h1>Smart Triathlete</h1>
				</div>
				<p>Neural Training Matrix</p>
			</div>
			<a href="/dashboard" class="back-link">
				<div class="icon-back"></div>
				Dashboard
			</a>
		</div>
	</header>

	<main class="container">
		<div class="plans-card">
			<div class="card-header">
				<div class="icon-quantum"></div>
				<div class="header-content">
					<h2>Quantum Training Plans</h2>
					<p>
						AI-powered neural training schedules based on your performance data and quantum
						algorithms.
					</p>
				</div>
			</div>

			<div class="coming-soon">
				<div class="neural-animation">
					<div class="icon-adaptive"></div>
				</div>
				<h3>Neural Training System Initializing</h3>
				<p>
					Our quantum AI system is learning your training patterns to create the perfect neural
					plans.
				</p>

				<div class="features-grid">
					<div class="feature-card">
						<div class="icon-pulse"></div>
						<h4>Adaptive Scheduling</h4>
						<p>Neural networks adapt your training based on real-time performance metrics</p>
					</div>

					<div class="feature-card">
						<div class="icon-quantum"></div>
						<h4>Quantum Analytics</h4>
						<p>Advanced quantum algorithms optimize training load distribution</p>
					</div>

					<div class="feature-card">
						<div class="icon-neural"></div>
						<h4>Neural Recovery</h4>
						<p>AI-driven recovery protocols prevent overtraining and optimize adaptation</p>
					</div>

					<div class="feature-card">
						<div class="icon-adaptive"></div>
						<h4>Race Preparation</h4>
						<p>Quantum-optimized tapering and peak performance programs</p>
					</div>

					<div class="feature-card">
						<div class="icon-pulse"></div>
						<h4>Injury Prevention</h4>
						<p>Neural pattern recognition identifies risk factors before injury occurs</p>
					</div>

					<div class="feature-card">
						<div class="icon-quantum"></div>
						<h4>Device Integration</h4>
						<p>Seamless connection with your neural training ecosystem</p>
					</div>
				</div>

				<div class="status-indicator">
					<div class="status-dot"></div>
					<span>Neural system training in progress...</span>
				</div>
			</div>
		</div>
	</main>
</div>

<style>
	.training-plans-page {
		min-height: 100vh;
		background: var(--neural-bg);
		padding: 2rem 0;
		position: relative;
	}

	.training-plans-page::before {
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
		max-width: 1200px;
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

	.plans-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 2.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
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

	.coming-soon {
		text-align: center;
		padding: 3rem 2rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.neural-animation {
		margin-bottom: 2rem;
	}

	.coming-soon h3 {
		color: var(--neural-text);
		margin-bottom: 1rem;
		font-size: 1.25rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.coming-soon > p {
		color: var(--neural-text-secondary);
		margin-bottom: 2rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.feature-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border-radius: 12px;
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
		transition: var(--neural-transition);
		text-align: left;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		background: rgba(255, 255, 255, 0.08);
		box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
	}

	.feature-card h4 {
		color: var(--neural-text);
		margin: 1rem 0 0.5rem 0;
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.feature-card p {
		color: var(--neural-text-secondary);
		margin: 0;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		line-height: 1.5;
	}

	.status-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 2rem;
		color: var(--neural-text-secondary);
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.05em;
	}

	.status-dot {
		width: 8px;
		height: 8px;
		background: var(--neural-accent);
		border-radius: 50%;
		animation: pulse 2s infinite;
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
		width: 48px;
		height: 48px;
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
		width: 32px;
		height: 32px;
		background: var(--neural-accent);
		border-radius: 8px;
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
		border-radius: 4px;
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

	/* Responsive Design */
	@media (max-width: 768px) {
		.page-header .container {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.logo {
			justify-content: center;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}

		.plans-card {
			padding: 1.5rem;
		}

		.card-header {
			flex-direction: column;
			text-align: center;
			gap: 1rem;
		}
	}
</style>
