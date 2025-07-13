<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	let mounted = false;
	let glowIntensity = 0;
	let particlesVisible = false;

	onMount(() => {
		mounted = true;

		// Animate glow effect
		const interval = setInterval(() => {
			glowIntensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
		}, 16);

		// Show particles after delay
		setTimeout(() => {
			particlesVisible = true;
		}, 1000);

		// Check if user is already authenticated (browser only)
		if (typeof window !== 'undefined') {
			supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
				if (user) {
					goto('/dashboard');
				}
			});
		}

		return () => clearInterval(interval);
	});

	function handleGetStarted() {
		goto('/auth');
	}

	function handleLogin() {
		goto('/auth');
	}
</script>

<svelte:head>
	<title>LaufplanerPro - AI-Powered Training Intelligence</title>
	<meta
		name="description"
		content="Intelligent training optimization through AI analysis of your Garmin, Strava, Whoop, and Apple Health data. Personalized training plans reviewed by experienced coaches."
	/>
</svelte:head>

<div class="quantum-page">
	<!-- Neural Header -->
	<header class="neural-header" class:mounted>
		<div class="neural-container">
			<div class="neural-logo">
				<div class="logo-pulse" style="--glow: {glowIntensity}"></div>
				<span class="logo-text">LaufplanerPro</span>
				<span class="logo-version">2.0</span>
			</div>
			<nav class="neural-nav">
				<a href="#features" class="nav-link">Features</a>
				<a href="#integration" class="nav-link">Integrations</a>
				<a href="#process" class="nav-link">How it Works</a>
				<button on:click={handleLogin} class="neural-btn neural-btn-ghost">Sign In</button>
			</nav>
		</div>
	</header>

	<!-- Quantum Hero -->
	<section class="quantum-hero" class:animate={mounted}>
		<div class="hero-background">
			{#if particlesVisible}
				<div class="neural-particles">
					{#each Array(20) as _, i}
						<div
							class="particle"
							style="--delay: {i * 0.1}s; --x: {Math.random() * 100}%; --y: {Math.random() * 100}%"
						></div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="neural-container">
			<div class="hero-content">
				<div class="hero-badge">
					<span class="badge-text">Neural Training System</span>
					<span class="badge-version">v2.0</span>
				</div>

				<h1 class="quantum-title">
					<span class="title-line">Elite Triathlon</span>
					<span class="title-line title-accent">Performance</span>
					<span class="title-line">Optimization</span>
				</h1>

				<p class="quantum-subtitle">
					Advanced neural networks analyze your biometric data streams to generate precision
					training protocols for peak performance. Personalized plans reviewed by experienced
					coaches and optimized by individual AI systems.
				</p>

				<!-- Quantum Stats -->
				<div class="quantum-stats">
					<div class="stat-item">
						<div class="stat-number">100%</div>
						<div class="stat-label">Coach-Approved</div>
						<div class="stat-glow"></div>
					</div>
					<div class="stat-item">
						<div class="stat-number">24/7</div>
						<div class="stat-label">Live Monitoring</div>
						<div class="stat-glow"></div>
					</div>
					<div class="stat-item">
						<div class="stat-number">9+</div>
						<div class="stat-label">Platforms</div>
						<div class="stat-glow"></div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Neural Capabilities -->
	<section id="features" class="neural-section">
		<div class="neural-container">
			<div class="section-header">
				<h2 class="section-title">Intelligent Features</h2>
				<p class="section-subtitle">AI-powered training optimization with professional coaching</p>
			</div>

			<div class="capabilities-grid">
				<div class="capability-card">
					<div class="card-header">
						<div class="capability-icon">
							<div class="icon-neural"></div>
						</div>
						<div class="capability-pulse"></div>
					</div>
					<h3 class="capability-title">Personalized AI Systems</h3>
					<p class="capability-text">
						Each athlete receives an individual GPT system that learns from complete training
						history and creates tailored plans
					</p>
					<div class="capability-tags">
						<span class="tag">Individual AI</span>
						<span class="tag">Machine Learning</span>
					</div>
				</div>

				<div class="capability-card">
					<div class="card-header">
						<div class="capability-icon">
							<div class="icon-pulse"></div>
						</div>
						<div class="capability-pulse"></div>
					</div>
					<h3 class="capability-title">Multi-Platform Integration</h3>
					<p class="capability-text">
						Automatic synchronization with Garmin, Strava, Whoop, Apple Health, Oura Ring and other
						fitness platforms for complete data capture
					</p>
					<div class="capability-tags">
						<span class="tag">9+ Platforms</span>
						<span class="tag">Real-time Sync</span>
					</div>
				</div>

				<div class="capability-card">
					<div class="card-header">
						<div class="capability-icon">
							<div class="icon-adaptive"></div>
						</div>
						<div class="capability-pulse"></div>
					</div>
					<h3 class="capability-title">Coach-Approved Plans</h3>
					<p class="capability-text">
						All AI-generated training plans are reviewed and approved by experienced coaches and
						sports professionals - safety and quality guaranteed
					</p>
					<div class="capability-tags">
						<span class="tag">Professional Coaching</span>
						<span class="tag">Quality Control</span>
					</div>
				</div>

				<div class="capability-card">
					<div class="card-header">
						<div class="capability-icon">
							<div class="icon-quantum"></div>
						</div>
						<div class="capability-pulse"></div>
					</div>
					<h3 class="capability-title">Goal-Based Optimization</h3>
					<p class="capability-text">
						Define your individual goals - whether marathon, triathlon, or fitness. AI continuously
						adapts your training plans to your progress
					</p>
					<div class="capability-tags">
						<span class="tag">Adaptive Plans</span>
						<span class="tag">Goal-Oriented</span>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- How It Works Section -->
	<section id="process" class="how-it-works-section">
		<div class="neural-container">
			<div class="section-header">
				<h2 class="section-title">How It Works</h2>
				<p class="section-subtitle">From data collection to the perfect training plan</p>
			</div>

			<div class="process-grid">
				<div class="process-step">
					<div class="step-number">01</div>
					<div class="step-icon">
						<div class="icon-connect"></div>
					</div>
					<h3 class="step-title">Connect Your Apps</h3>
					<p class="step-text">
						Link your Garmin, Strava, Whoop and other fitness apps for complete data collection
					</p>
				</div>

				<div class="process-step">
					<div class="step-number">02</div>
					<div class="step-icon">
						<div class="icon-target"></div>
					</div>
					<h3 class="step-title">Define Your Goal</h3>
					<p class="step-text">
						Sprint, Olympic, Half or Full Ironman - we create individually tailored triathlon goals
						for you
					</p>
				</div>

				<div class="process-step">
					<div class="step-number">03</div>
					<div class="step-icon">
						<div class="icon-ai"></div>
					</div>
					<h3 class="step-title">AI Creates Your Plan</h3>
					<p class="step-text">
						Your personal AI analyzes your history and creates a customized training plan based on
						your individual triathlon goals
					</p>
				</div>

				<div class="process-step">
					<div class="step-number">04</div>
					<div class="step-icon">
						<div class="icon-coach"></div>
					</div>
					<h3 class="step-title">Coach Approval</h3>
					<p class="step-text">
						Experienced trainers review and approve every plan before it gets activated
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- Integration Matrix -->
	<section id="integration" class="integration-section">
		<div class="neural-container">
			<div class="section-header">
				<h2 class="section-title">Supported Platforms</h2>
				<p class="section-subtitle">Seamless integration with your favorite fitness apps</p>
			</div>

			<div class="integration-grid">
				<div class="integration-item">
					<div class="integration-logo">ST</div>
					<span class="integration-name">Strava</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">GA</div>
					<span class="integration-name">Garmin</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">WH</div>
					<span class="integration-name">Whoop</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">AH</div>
					<span class="integration-name">Apple Health</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">OR</div>
					<span class="integration-name">Oura Ring</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">PO</div>
					<span class="integration-name">Polar</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">WA</div>
					<span class="integration-name">Wahoo</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">FT</div>
					<span class="integration-name">Fitbit</span>
					<div class="integration-status connected">●</div>
				</div>
				<div class="integration-item">
					<div class="integration-logo">NR</div>
					<span class="integration-name">Nextring</span>
					<div class="integration-status connected">●</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* 2050 Neural Interface Styles */
	.quantum-page {
		min-height: 100vh;
		background: var(--neural-black);
		overflow-x: hidden;
	}

	/* Neural Header */
	.neural-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1000;
		background: rgba(10, 10, 11, 0.8);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--neural-border);
		transition: var(--transition-smooth);
		transform: translateY(-100%);
	}

	.neural-header.mounted {
		transform: translateY(0);
	}

	.neural-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-lg);
	}

	.neural-header .neural-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 70px;
	}

	.neural-logo {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		position: relative;
	}

	.logo-pulse {
		width: 12px;
		height: 12px;
		background: var(--neural-accent);
		border-radius: var(--radius-full);
		opacity: calc(0.5 + var(--glow) * 0.5);
		box-shadow: 0 0 20px var(--neural-accent-glow);
	}
	.logo-text {
		font-family: var(--font-primary);
		font-weight: 300;
		font-size: 1.125rem;
		color: var(--neural-bright);
		letter-spacing: 0.05em;
	}

	.logo-version {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		color: var(--neural-accent);
		background: rgba(59, 130, 246, 0.08);
		padding: 1px 4px;
		border-radius: var(--radius-sm);
		border: 1px solid rgba(59, 130, 246, 0.15);
		font-weight: 400;
	}

	.neural-nav {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}
	.nav-link {
		color: var(--neural-text);
		text-decoration: none;
		font-weight: 300;
		font-size: 0.8125rem;
		transition: var(--transition-fast);
		position: relative;
		letter-spacing: 0.025em;
	}

	.nav-link:hover {
		color: var(--neural-bright);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--neural-accent);
		transition: var(--transition-fast);
	}

	.nav-link:hover::after {
		width: 100%;
	}

	/* Neural Buttons */
	.neural-btn {
		position: relative;
		padding: var(--space-sm) var(--space-lg);
		border: none;
		border-radius: var(--radius-md);
		font-family: var(--font-primary);
		font-weight: 300;
		font-size: 0.8125rem;
		cursor: pointer;
		transition: var(--transition-smooth);
		overflow: hidden;
		letter-spacing: 0.025em;
	}

	.neural-btn-ghost {
		background: rgba(255, 255, 255, 0.05);
		color: var(--neural-text);
		border: 1px solid var(--neural-border);
	}

	.neural-btn-ghost:hover {
		background: rgba(255, 255, 255, 0.1);
		color: var(--neural-bright);
		border-color: var(--neural-accent);
	}

	.neural-btn-primary {
		background: var(--neural-accent);
		color: white;
		border: 1px solid transparent;
		padding: var(--space-md) var(--space-xl);
		font-weight: 600;
	}

	.neural-btn-primary:hover {
		background: #2563eb;
		transform: translateY(-1px);
		box-shadow: var(--shadow-glow);
	}

	.neural-btn-outline {
		background: transparent;
		color: var(--neural-text);
		border: 1px solid var(--neural-border);
		padding: var(--space-md) var(--space-xl);
	}

	.neural-btn-outline:hover {
		background: rgba(255, 255, 255, 0.05);
		border-color: var(--neural-accent);
		color: var(--neural-bright);
	}

	.btn-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
		opacity: 0;
		transition: var(--transition-smooth);
	}

	.neural-btn-primary:hover .btn-glow {
		opacity: 1;
	}

	/* Quantum Hero */
	.quantum-hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
		padding-top: 70px;
		opacity: 0;
		transform: translateY(30px);
		transition: all 1s ease-out;
	}

	.quantum-hero.animate {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-background {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.neural-particles {
		position: absolute;
		inset: 0;
	}

	.particle {
		position: absolute;
		width: 2px;
		height: 2px;
		background: var(--neural-accent);
		border-radius: var(--radius-full);
		left: var(--x);
		top: var(--y);
		animation: particle-float 4s ease-in-out infinite;
		animation-delay: var(--delay);
		opacity: 0.6;
	}

	@keyframes particle-float {
		0%,
		100% {
			transform: translateY(0) scale(1);
			opacity: 0.6;
		}
		50% {
			transform: translateY(-20px) scale(1.2);
			opacity: 1;
		}
	}

	.hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 800px;
		margin: 0 auto;
	}

	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: var(--radius-full);
		padding: var(--space-sm) var(--space-md);
		margin-bottom: var(--space-xl);
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--neural-accent);
	}

	.badge-version {
		background: var(--neural-accent);
		color: white;
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		font-size: 0.625rem;
	}

	.quantum-title {
		margin-bottom: var(--space-xl);
	}

	.title-line {
		display: block;
		font-size: clamp(2.5rem, 8vw, 5rem);
		font-weight: 800;
		line-height: 0.9;
		color: var(--neural-bright);
		margin-bottom: var(--space-sm);
	}

	.title-accent {
		background: var(--quantum-primary);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.quantum-subtitle {
		font-size: clamp(1rem, 3vw, 1.25rem);
		color: var(--neural-text);
		max-width: 600px;
		margin: 0 auto var(--space-3xl);
		line-height: 1.6;
	}

	/* Quantum Stats */
	.quantum-stats {
		display: flex;
		justify-content: center;
		gap: var(--space-3xl);
		margin-bottom: var(--space-3xl);
		flex-wrap: wrap;
	}

	.stat-item {
		position: relative;
		text-align: center;
	}

	.stat-number {
		font-family: var(--font-mono);
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--neural-bright);
		margin-bottom: var(--space-xs);
	}

	.stat-label {
		font-size: 0.875rem;
		color: var(--neural-text);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-glow {
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		width: 30px;
		height: 2px;
		background: var(--neural-accent);
		border-radius: var(--radius-full);
		box-shadow: 0 0 10px var(--neural-accent-glow);
	}

	/* Neural CTA */
	.neural-cta {
		display: flex;
		justify-content: center;
		gap: var(--space-lg);
		flex-wrap: wrap;
	}

	/* Neural Sections */
	.neural-section {
		padding: var(--space-3xl) 0;
		border-top: 1px solid var(--neural-border);
	}

	.section-header {
		text-align: center;
		margin-bottom: var(--space-3xl);
	}
	.section-title {
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 200;
		color: var(--neural-bright);
		margin-bottom: var(--space-md);
		letter-spacing: 0.02em;
	}

	.section-subtitle {
		font-size: 1rem;
		font-weight: 300;
		color: var(--neural-text);
		max-width: 500px;
		margin: 0 auto;
		letter-spacing: 0.015em;
	}

	/* Capabilities Grid */
	.capabilities-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: var(--space-xl);
	}

	.capability-card {
		background: var(--neural-surface);
		border: 1px solid var(--neural-border);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		transition: var(--transition-smooth);
		position: relative;
		overflow: hidden;
	}

	.capability-card:hover {
		border-color: var(--neural-accent);
		transform: translateY(-4px);
		box-shadow: var(--shadow-neural);
	}

	.card-header {
		position: relative;
		margin-bottom: var(--space-lg);
	}
	.capability-icon {
		width: 48px;
		height: 48px;
		margin-bottom: var(--space-md);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Professional Minimalist Icons */
	.icon-neural {
		width: 32px;
		height: 32px;
		border: 2px solid var(--neural-accent);
		border-radius: 50%;
		position: relative;
	}

	.icon-neural::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 12px;
		height: 12px;
		background: var(--neural-accent);
		border-radius: 50%;
		animation: neural-pulse 2s ease-in-out infinite;
	}

	@keyframes neural-pulse {
		0%,
		100% {
			opacity: 0.6;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	.icon-pulse {
		width: 32px;
		height: 32px;
		border: 2px solid var(--neural-accent);
		border-radius: 4px;
		position: relative;
		background: linear-gradient(45deg, transparent 0%, var(--neural-accent) 50%, transparent 100%);
		background-size: 200% 200%;
		animation: pulse-sweep 3s ease-in-out infinite;
	}

	@keyframes pulse-sweep {
		0%,
		100% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
	}

	.icon-adaptive {
		width: 32px;
		height: 32px;
		position: relative;
	}

	.icon-adaptive::before,
	.icon-adaptive::after {
		content: '';
		position: absolute;
		width: 14px;
		height: 14px;
		border: 2px solid var(--neural-accent);
		border-radius: 50%;
	}

	.icon-adaptive::before {
		top: 0;
		left: 0;
		animation: adaptive-orbit1 4s linear infinite;
	}

	.icon-adaptive::after {
		bottom: 0;
		right: 0;
		animation: adaptive-orbit2 4s linear infinite reverse;
	}

	@keyframes adaptive-orbit1 {
		0% {
			transform: rotate(0deg) translateX(8px) rotate(0deg);
		}
		100% {
			transform: rotate(360deg) translateX(8px) rotate(-360deg);
		}
	}

	@keyframes adaptive-orbit2 {
		0% {
			transform: rotate(0deg) translateX(-8px) rotate(0deg);
		}
		100% {
			transform: rotate(360deg) translateX(-8px) rotate(-360deg);
		}
	}

	.icon-quantum {
		width: 32px;
		height: 32px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-quantum::before {
		content: '';
		width: 24px;
		height: 24px;
		border: 2px solid var(--neural-accent);
		border-style: solid solid none none;
		transform: rotate(45deg);
		border-radius: 0 4px 0 0;
	}

	.icon-quantum::after {
		content: '';
		position: absolute;
		width: 8px;
		height: 8px;
		background: var(--neural-accent);
		border-radius: 50%;
		animation: quantum-spin 3s linear infinite;
	}

	@keyframes quantum-spin {
		0% {
			transform: rotate(0deg) translateX(8px) rotate(0deg);
		}
		100% {
			transform: rotate(360deg) translateX(8px) rotate(-360deg);
		}
	}

	.capability-pulse {
		position: absolute;
		top: 0;
		right: 0;
		width: 8px;
		height: 8px;
		background: var(--neural-success);
		border-radius: var(--radius-full);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.2);
		}
	}
	.capability-title {
		font-size: 1.125rem;
		font-weight: 400;
		color: var(--neural-bright);
		margin-bottom: var(--space-sm);
		letter-spacing: 0.01em;
	}

	.capability-text {
		color: var(--neural-text);
		line-height: 1.7;
		margin-bottom: var(--space-md);
		font-weight: 300;
		font-size: 0.9375rem;
	}

	.capability-tags {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.tag {
		background: rgba(59, 130, 246, 0.1);
		color: var(--neural-accent);
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 500;
		border: 1px solid rgba(59, 130, 246, 0.2);
	}

	/* How It Works Section */
	.how-it-works-section {
		padding: var(--space-3xl) 0;
		background: var(--neural-surface);
		border-top: 1px solid var(--neural-border);
	}

	.process-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--space-xl);
		margin-top: var(--space-3xl);
	}

	.process-step {
		text-align: center;
		position: relative;
		padding: var(--space-xl);
	}

	.step-number {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 32px;
		height: 32px;
		background: var(--neural-accent);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		font-weight: 600;
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
	}

	.step-icon {
		margin: var(--space-lg) auto var(--space-md);
		width: 64px;
		height: 64px;
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.step-title {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--neural-bright);
		margin-bottom: var(--space-sm);
	}

	.step-text {
		color: var(--neural-text);
		line-height: 1.6;
		font-size: 0.9375rem;
	}

	/* Step Icons */
	.icon-connect {
		width: 32px;
		height: 32px;
		position: relative;
	}

	.icon-connect::before,
	.icon-connect::after {
		content: '';
		position: absolute;
		width: 12px;
		height: 12px;
		border: 2px solid var(--neural-accent);
		border-radius: 50%;
	}

	.icon-connect::before {
		top: 0;
		left: 0;
	}

	.icon-connect::after {
		bottom: 0;
		right: 0;
		animation: connect-pulse 2s ease-in-out infinite;
	}

	@keyframes connect-pulse {
		0%,
		100% {
			opacity: 0.5;
			transform: scale(1);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	.icon-target {
		width: 32px;
		height: 32px;
		border: 3px solid var(--neural-accent);
		border-radius: 50%;
		position: relative;
	}

	.icon-target::before {
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

	.icon-ai {
		width: 32px;
		height: 32px;
		background: linear-gradient(45deg, var(--neural-accent), #8b5cf6);
		border-radius: var(--radius-md);
		position: relative;
		animation: ai-glow 3s ease-in-out infinite;
	}

	@keyframes ai-glow {
		0%,
		100% {
			box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
		}
		50% {
			box-shadow: 0 0 30px rgba(59, 130, 246, 0.6);
		}
	}

	.icon-coach {
		width: 32px;
		height: 32px;
		border: 2px solid var(--neural-accent);
		border-radius: var(--radius-md);
		position: relative;
	}

	.icon-coach::before {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: var(--neural-accent);
		font-weight: bold;
		font-size: 1.2rem;
	}

	/* Integration Section */
	.integration-section {
		padding: var(--space-3xl) 0;
		background: var(--neural-dark);
	}

	.integration-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-lg);
		max-width: 1000px;
		margin: 0 auto;
	}

	.integration-item {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		background: var(--neural-surface);
		border: 1px solid var(--neural-border);
		border-radius: var(--radius-md);
		padding: var(--space-lg);
		transition: var(--transition-smooth);
	}

	.integration-item:hover {
		border-color: var(--neural-accent);
		transform: scale(1.02);
	}

	.integration-logo {
		width: 40px;
		height: 40px;
		background: var(--neural-accent);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-mono);
		font-weight: 700;
		color: white;
		font-size: 0.875rem;
	}

	.integration-name {
		flex: 1;
		color: var(--neural-bright);
		font-weight: 500;
	}

	.integration-status {
		color: var(--neural-success);
		font-size: 1.25rem;
	}

	.connected {
		animation: status-pulse 2s ease-in-out infinite;
	}

	@keyframes status-pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
	}

	/* Mobile Optimizations */
	@media (max-width: 768px) {
		.neural-header .neural-container {
			padding: 0 var(--space-md);
		}

		.neural-nav {
			gap: var(--space-md);
		}

		.nav-link {
			font-size: 0.8rem;
		}

		.quantum-hero {
			padding: 70px var(--space-md) var(--space-3xl);
		}

		.quantum-stats {
			gap: var(--space-xl);
		}

		.neural-cta {
			flex-direction: column;
			align-items: center;
		}

		.neural-btn {
			width: 100%;
			max-width: 280px;
		}

		.capabilities-grid {
			grid-template-columns: 1fr;
		}

		.integration-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.integration-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
