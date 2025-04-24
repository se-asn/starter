<!-- src/lib/components/About.svelte -->
<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Enhanced SEO data
	const seoData = {
		title: 'Über LaufPlaner Pro - Wissenschaftlich fundierte Laufpläne für alle Niveaus',
		description:
			'LaufPlaner Pro - Ein Team aus erfahrenen Lauftrainern und Sportwissenschaftlern, das seit 2023 hochwertige und personalisierte Laufpläne für Anfänger bis Fortgeschrittene entwickelt.',
		keywords: [
			'Laufexperten',
			'Lauftrainer',
			'Sportwissenschaft',
			'personalisierte Laufpläne',
			'Lauftraining',
			'Trainingsphilosophie'
		],
		companyInfo: {
			name: 'LaufPlaner Pro',
			foundingDate: '2023-01-15',
			founders: ['Dr. Max Muster', 'Anna Schmidt'],
			employees: 12
		}
	};

	// Enhanced Schema.org JSON-LD für strukturierte Daten
	onMount(() => {
		if (browser) {
			const schemaData = {
				'@context': 'https://schema.org',
				'@type': 'Organization',
				'@id': 'https://laufplanerpro.de/#organization',
				name: seoData.companyInfo.name,
				description: seoData.description,
				url: 'https://laufplanerpro.de/',
				logo: 'https://laufplanerpro.de/images/logo.png',
				foundingDate: seoData.companyInfo.foundingDate,
				founders: seoData.companyInfo.founders.map((founder) => ({
					'@type': 'Person',
					name: founder
				})),
				numberOfEmployees: {
					'@type': 'QuantitativeValue',
					value: seoData.companyInfo.employees
				},
				knowsAbout: ['Lauftraining', 'Sportwissenschaft', 'Trainingspläne', 'Marathon-Vorbereitung']
			};

			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);

			// Meta-Tags hinzufügen falls nicht vorhanden
			if (!document.querySelector('meta[name="description"]')) {
				const metaDesc = document.createElement('meta');
				metaDesc.name = 'description';
				metaDesc.content = seoData.description;
				document.head.appendChild(metaDesc);
			}

			if (!document.querySelector('meta[name="keywords"]')) {
				const metaKeys = document.createElement('meta');
				metaKeys.name = 'keywords';
				metaKeys.content = seoData.keywords.join(', ');
				document.head.appendChild(metaKeys);
			}
		}
	});
</script>

<section
	id="about"
	class="about py-20"
	aria-labelledby="about-heading"
	itemscope
	itemtype="https://schema.org/Organization"
>
	<div class="container mx-auto px-4">
		<header class="section-header text-center mb-12">
			<span class="section-tag text-primary text-sm uppercase tracking-wider" aria-hidden="true"
				>Wer wir sind</span
			>
			<h2
				id="about-heading"
				class="section-title text-3xl md:text-4xl font-bold mt-2 mb-4"
				itemprop="name"
			>
				ÜBER LAUFPLANER PRO
			</h2>
			<p class="section-subtitle max-w-2xl mx-auto" itemprop="description">
				Ein Team aus leidenschaftlichen Läufern und Sportwissenschaftlern mit der Mission,
				wissenschaftlich fundierte Laufpläne für jeden zugänglich zu machen.
			</p>
			<meta itemprop="foundingDate" content={seoData.companyInfo.foundingDate} />
			<meta itemprop="location" content={seoData.companyInfo.location} />
		</header>

		<div class="about-content">
			<article class="about-section story-section">
				<h3 class="about-heading" id="our-story">Unsere Geschichte</h3>
				<div class="accent-line"></div>
				<div itemprop="description">
					<p class="about-paragraph">
						Die Idee zu <span itemprop="name">LaufPlaner Pro</span> entstand
						<time datetime="2023" itemprop="foundingDate">2023</time>, als unsere Gründer, erfahrene
						Lauftrainer und Sportwissenschaftler, die Lücke zwischen komplexen wissenschaftlichen
						Trainingsmethoden und einfachen, zugänglichen Laufplänen für Hobbysportler erkannten.
					</p>
					<p class="about-paragraph">
						Nach Jahren der Forschung und Praxiserfahrung im Bereich der Lauftrainingswissenschaft
						entwickelten wir ein innovatives System, das professionelle, individualisierte
						Trainingspläne für Läufer aller Niveaus ermöglicht – vom absoluten Laufanfänger bis zum
						ambitionierten Marathonläufer mit Bestzeit-Ambitionen.
					</p>
				</div>
			</article>

			<article class="about-section philosophy-section">
				<h3 class="about-heading" id="our-philosophy">Unsere Trainingsphilosophie</h3>
				<div class="accent-line"></div>
				<div
					class="philosophy-items"
					itemprop="makesOffer"
					itemscope
					itemtype="https://schema.org/Offer"
				>
					<meta itemprop="name" content="LaufPlaner Pro Trainingsphilosophie" />

					<div class="philosophy-item">
						<div class="philosophy-number" aria-hidden="true">01</div>
						<div class="philosophy-content">
							<h4 class="philosophy-title">Wissenschaftlich fundiert</h4>
							<p class="philosophy-text">
								Wir integrieren aktuelle sportwissenschaftliche Erkenntnisse und Studien in
								praktische, alltagstaugliche Trainingspläne. Jede Trainingseinheit basiert auf
								bewährten Trainingsmethoden.
							</p>
						</div>
					</div>

					<div class="philosophy-item">
						<div class="philosophy-number" aria-hidden="true">02</div>
						<div class="philosophy-content">
							<h4 class="philosophy-title">Individuell anpassbar</h4>
							<p class="philosophy-text">
								Jeder Läufer ist einzigartig mit unterschiedlichen Zielen und Voraussetzungen.
								Unsere personalisierten Trainingspläne berücksichtigen deine persönlichen
								Gegebenheiten und passen sich deinem Alltag an.
							</p>
						</div>
					</div>

					<div class="philosophy-item">
						<div class="philosophy-number" aria-hidden="true">03</div>
						<div class="philosophy-content">
							<h4 class="philosophy-title">Gemeinschaft & professionelle Betreuung</h4>
							<p class="philosophy-text">
								Wir bieten nicht nur Trainingspläne, sondern eine unterstützende Community und
								professionelle Betreuung durch zertifizierte Laufexperten. Gemeinsam erreichst du
								deine Laufziele.
							</p>
						</div>
					</div>
				</div>
			</article>
		</div>

		<!-- Visual separator with proper spacing -->
		<div class="separator-container my-20">
			<div class="separator"></div>
		</div>

		<div class="about-team-preview text-center">
			<p class="text-lg text-gray-300 mb-8">
				Hinter LaufPlaner Pro steht ein Team aus <strong>erfahrenen Lauftrainern</strong>,
				<strong>Sportwissenschaftlern</strong> und <strong>passionierten Läufern</strong>, die ihre
				Expertise täglich einsetzen, um optimale Trainingsergebnisse für unsere Kunden zu erreichen.
			</p>
		</div>

		<div class="about-cta text-center mt-12">
			<a href="#signup" class="btn-primary inline-flex items-center gap-2">
				<span>Starte jetzt mit uns</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5 12h14"></path>
					<path d="m12 5 7 7-7 7"></path>
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	.about {
		padding: 5rem 0;
		background-color: var(--dark);
		position: relative;
		overflow: hidden;
	}

	.about::before {
		content: '';
		position: absolute;
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, transparent 70%);
		top: -200px;
		left: -200px;
		z-index: 0;
	}

	.about::after {
		content: '';
		position: absolute;
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(255, 0, 60, 0.1) 0%, transparent 70%);
		bottom: -200px;
		right: -200px;
		z-index: 0;
	}

	.about-content {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		margin-top: 3rem;
		position: relative;
		z-index: 1;
	}

	@media (min-width: 768px) {
		.about-content {
			grid-template-columns: 1fr 1fr;
			gap: 4rem;
		}
	}

	.about-section {
		padding: 2rem;
		background: linear-gradient(145deg, var(--dark-gray) 0%, var(--dark) 100%);
		border-radius: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.about-section:hover {
		transform: translateY(-5px);
		box-shadow:
			0 15px 35px rgba(0, 242, 254, 0.1),
			0 5px 15px rgba(0, 242, 254, 0.05);
	}

	.story-section:hover {
		border: 1px solid rgba(0, 242, 254, 0.3);
	}

	.philosophy-section:hover {
		border: 1px solid rgba(255, 0, 60, 0.3);
	}

	.about-heading {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		position: relative;
		color: var(--primary);
	}

	.accent-line {
		width: 50px;
		height: 3px;
		margin-bottom: 1.5rem;
		background: linear-gradient(90deg, var(--primary), var(--secondary));
	}

	.about-paragraph {
		color: var(--text-gray);
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	.philosophy-items {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.philosophy-item {
		display: flex;
		gap: 1rem;
		transition: transform 0.3s ease;
	}

	.philosophy-item:hover {
		transform: translateX(5px);
	}

	.philosophy-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		background: linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(0, 242, 254, 0.05) 100%);
		border: 1px solid rgba(0, 242, 254, 0.2);
		border-radius: 0.5rem;
		font-weight: 700;
		color: var(--primary);
		flex-shrink: 0;
	}

	.philosophy-content {
		flex: 1;
	}

	.philosophy-title {
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #ffffff;
	}

	.philosophy-text {
		color: var(--text-gray);
		line-height: 1.5;
	}

	.separator-container {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 2rem 0;
	}

	.separator {
		width: 80%;
		max-width: 400px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--primary), transparent);
		opacity: 0.6;
	}

	.about-cta {
		margin-top: 3rem;
		text-align: center;
	}

	.btn-primary {
		padding: 0.75rem 2.5rem;
		font-size: 1rem;
		background-color: var(--primary);
		color: var(--dark);
		border-radius: 0.375rem;
		font-weight: 600;
		transition: all 0.3s ease;
		text-decoration: none;
	}

	.btn-primary:hover {
		background-color: var(--primary-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 12px rgba(0, 242, 254, 0.2);
	}

	strong {
		color: var(--primary);
		font-weight: 600;
	}
</style>
