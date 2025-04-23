<!-- src/lib/components/Hero.svelte -->
<section class="hero">
	<div class="cyber-grid"></div>
	<div class="animated-bg"></div>

	<div class="container">
		<div class="hero-content">
			<div class="hero-left">
				<h1 class="hero-title">
					STARTE DEINE <span class="gradient-text">LAUFREISE</span>
				</h1>
				<p class="hero-description">
					Mit dem richtigen Plan zum Ziel. Ob 5K oder Marathon – wir bringen dich Schritt für
					Schritt ins Ziel.
				</p>
				<div class="hero-buttons">
					<a href="#plans" class="btn-primary">PLÄNE ENTDECKEN</a>
					<a href="#features" class="btn-outline">MEHR ERFAHREN</a>
				</div>

				<div class="hero-stats">
					<div class="stat">
						<p class="stat-number gradient-text">5000+</p>
						<p class="stat-label">Zufriedene Läufer</p>
					</div>
					<div class="stat">
						<p class="stat-number gradient-text">8</p>
						<p class="stat-label">Spezialisierte Pläne</p>
					</div>
					<div class="stat">
						<p class="stat-number gradient-text">94%</p>
						<p class="stat-label">Zielzeit erreicht</p>
					</div>
					<div class="stat">
						<p class="stat-number gradient-text">15+</p>
						<p class="stat-label">Jahre Expertise</p>
					</div>
				</div>
			</div>

			<div class="hero-right">
				<div class="hero-image-container">
					<img
						src="/images/laufplaner_pro.webp"
						alt="LaufPlaner Pro Trainingsbeispiel"
						class="hero-image"
					/>
					<div class="blur-circle blur-circle-bottom"></div>
					<div class="blur-circle blur-circle-top"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		position: relative;
		min-height: 100vh;
		display: flex;
		align-items: center;
	}

	.animated-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: 0;
	}

	.animated-bg:after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background:
			radial-gradient(circle at 20% 35%, rgba(0, 242, 254, 0.15) 0%, transparent 25%),
			radial-gradient(circle at 75% 65%, rgba(255, 0, 60, 0.15) 0%, transparent 25%);
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		z-index: 10;
	}

	@media (min-width: 1024px) {
		.hero-content {
			flex-direction: row;
		}
	}

	.hero-left {
		width: 100%;
	}

	@media (min-width: 1024px) {
		.hero-left {
			width: 50%;
			padding-right: 2.5rem;
		}
	}

	.hero-title {
		font-size: 2.25rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.hero-title {
			font-size: 3.75rem;
		}
	}

	.hero-description {
		font-size: 1.25rem;
		color: #d0d0d0;
		margin-bottom: 2rem;
	}

	.hero-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 3rem;
	}

	.hero-stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 3rem;
	}

	@media (min-width: 768px) {
		.hero-stats {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat {
		text-align: center;
	}

	.stat-number {
		font-size: 1.875rem;
		font-weight: bold;
		margin: 0;
	}

	.stat-label {
		font-size: 0.75rem;
		color: var(--text-gray);
		text-transform: uppercase;
		margin: 0.25rem 0 0;
	}

	.hero-right {
		width: 100%;
		margin-top: 2.5rem;
	}

	@media (min-width: 1024px) {
		.hero-right {
			width: 50%;
			margin-top: 0;
		}
	}

	.hero-image-container {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.hero-image {
		width: 100%;
		height: auto;
		border-radius: 0.75rem;
		box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
	}

	.blur-circle {
		position: absolute;
		width: 10rem;
		height: 10rem;
		border-radius: 9999px;
		opacity: 0.1;
		filter: blur(2rem);
	}

	.blur-circle-bottom {
		background-color: var(--primary);
		bottom: -2.5rem;
		left: -2.5rem;
	}

	.blur-circle-top {
		background-color: var(--secondary);
		top: -2.5rem;
		right: -2.5rem;
	}
</style>
