<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// SEO-optimierte Daten mit Mitgliederbereich-Fokus
	const heroData = {
		title: 'Professionelle Laufpläne in deinem persönlichen Trainingsbereich',
		description:
			'Erreiche deine Laufziele mit wissenschaftlich fundierten Trainingsplänen im exklusiven Mitgliederbereich – individuell angepasst an dein Niveau und deinen Alltag. Von Couch-to-5K bis zur Marathon-Bestzeit: Mit persönlichem Login optimierst du dein Training!',
		keywords: [
			'Laufplan',
			'Laufpläne',
			'Trainingsplan Laufen',
			'Lauftraining',
			'Marathon Trainingsplan',
			'5K Laufplan',
			'10K Trainingsplan',
			'Halbmarathon Plan',
			'Lauftraining für Anfänger',
			'Laufplan Fortgeschrittene',
			'strukturierte Laufpläne',
			'individueller Laufplan',
			'Mitgliederbereich Laufen',
			'personalisiertes Training',
			'Laufplan mit Login',
			'interaktiver Trainingsplan'
		],
		stats: [
			{
				number: '750+',
				label: 'Zufriedene Läufer',
				description: 'Über 750 erfolgreiche Läufer haben mit unseren Plänen ihre Ziele erreicht'
			},
			{
				number: '8',
				label: 'Spezialisierte Pläne',
				description:
					'Acht professionell erstellte Trainingspläne für alle Distanzen und Leistungsniveaus'
			},
			{
				number: '97%',
				label: 'Zielzeit erreicht',
				description: '97% unserer Kunden erreichen ihre angestrebte Zielzeit'
			},
			{
				number: '24/7',
				label: 'Zugang',
				description: 'Jederzeit und überall Zugriff auf deinen persönlichen Trainingsplan'
			}
		],
		imageUrl: '/images/laufplaner_pro.webp',
		imageAlt:
			'LaufPlaner Pro Trainingsbeispiel im Mitgliederbereich - Personalisierter Laufplan mit individuellen Trainingseinheiten'
	};

	// Schema.org structured data - aktualisiert
	onMount(() => {
		if (browser) {
			const schema = {
				'@context': 'https://schema.org',
				'@type': 'SportsActivityLocation',
				name: 'LaufPlaner Pro',
				description: heroData.description,
				image: new URL(heroData.imageUrl, window.location.origin).toString(),
				offers: {
					'@type': 'Offer',
					description: 'Personalisierte Laufpläne im exklusiven Mitgliederbereich',
					availability: 'https://schema.org/OnlineOnly'
				},
				review: {
					'@type': 'Review',
					reviewRating: {
						'@type': 'Rating',
						ratingValue: '4.9',
						bestRating: '5'
					},
					author: {
						'@type': 'Person',
						name: 'LaufPlaner Pro Mitglieder'
					},
					reviewBody:
						'Der persönliche Trainingsbereich hat mir geholfen, strukturiert zu trainieren und meine Zielzeit zu erreichen.'
				}
			};

			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schema);
			document.head.appendChild(script);
		}
	});
</script>

<section class="hero" aria-labelledby="hero-heading">
	<!-- Bestehender Code bleibt unverändert -->
	<div class="cyber-grid" aria-hidden="true"></div>
	<div class="animated-bg" aria-hidden="true"></div>

	<div class="container mx-auto px-4">
		<div class="hero-content">
			<div class="hero-left">
				<h1 id="hero-heading" class="hero-title">
					OPTIMIERE DEINE <span class="gradient-text">LAUFREISE</span>
				</h1>
				<p class="hero-description">
					{heroData.description}
				</p>
				<div class="hero-buttons">
					<a href="#laufplaene" class="btn-primary">LAUFPLÄNE ENTDECKEN</a>
					<a href="#features" class="btn-outline">MEHR ERFAHREN</a>
				</div>

				<div class="hero-stats" aria-label="Erfolgsstatistiken LaufPlaner Pro">
					{#each heroData.stats as stat, i}
						<div class="stat">
							<p class="stat-number gradient-text">{stat.number}</p>
							<p class="stat-label">{stat.label}</p>
							<meta itemprop="description" content={stat.description} />
						</div>
					{/each}
				</div>
			</div>

			<div class="hero-right">
				<!-- Bild und Layout bleiben unverändert -->
				<div class="hero-image-container">
					<img
						src={heroData.imageUrl}
						alt={heroData.imageAlt}
						class="hero-image"
						width="600"
						height="400"
						loading="eager"
						fetchpriority="high"
					/>
					<div class="blur-circle blur-circle-bottom" aria-hidden="true"></div>
					<div class="blur-circle blur-circle-top" aria-hidden="true"></div>
				</div>
			</div>
		</div>
	</div>

	<!-- Hidden SEO-optimized metadata -->
	<meta itemprop="keywords" content={heroData.keywords.join(', ')} />
</section>

<style>
	.hero {
		position: relative;
		min-height: 75vh; /* Geändert von 100vh auf 75vh - reduziert den vertikalen Raum um 25% */
		display: flex;
		align-items: center;
		padding-top: 3rem; /* Fügt oben etwas Abstand hinzu */
		padding-bottom: 3rem; /* Fügt unten etwas Abstand hinzu */
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
