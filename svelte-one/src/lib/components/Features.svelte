<!-- src/lib/components/Features.svelte -->
<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Erweiterte Feature-Daten mit zusätzlichen SEO-relevanten Informationen
	const features = [
		{
			id: 'structured-plans',
			title: 'Strukturiert & klar verständlich',
			text: 'Keine komplizierten Fachbegriffe – sondern klare Wochenpläne, die einfach umzusetzen sind. Ob 3 oder 5 Einheiten pro Woche: du weißt immer, was zu tun ist.',
			keywords: [
				'strukturierte Laufpläne',
				'verständliche Trainingspläne',
				'klare Wochenpläne',
				'einfache Laufanleitungen'
			]
		},
		{
			id: 'realistic-goals',
			title: 'Realistische Ziele',
			text: 'Unsere Pläne orientieren sich nicht an Profis, sondern an echten Menschen mit echten Jobs, Familien & Alltag. Du bekommst einen Plan, der motiviert – nicht überfordert.',
			keywords: [
				'realistische Laufziele',
				'alltagstaugliche Laufpläne',
				'motivierende Trainingspläne',
				'Lauftraining für Berufstätige'
			]
		},
		{
			id: 'science-based',
			title: 'Wissenschaftlich fundiert',
			text: 'Alle Inhalte basieren auf erprobten Trainingsprinzipien: progressive Belastung, Regeneration, Lauftechnik, Tempovariation und mentale Vorbereitung.',
			keywords: [
				'wissenschaftliche Laufpläne',
				'fundierte Trainingsprinzipien',
				'evidenzbasiertes Lauftraining',
				'professionelle Laufvorbereitung'
			]
		},
		{
			id: 'adaptable',
			title: 'Anpassbar an dein Leben',
			text: 'Kein Plan ist in Stein gemeißelt. Wir geben dir Tools & Tipps an die Hand, um dein Training flexibel anzupassen – damit du auch bei Stress, Urlaub oder Krankheit dranbleiben kannst.',
			keywords: [
				'flexible Laufpläne',
				'anpassbare Trainingspläne',
				'individuelles Lauftraining',
				'personalisierte Laufprogramme'
			]
		}
	];

	// Meta-Informationen für SEO
	const seoData = {
		sectionTitle: 'Professionelle Laufpläne mit wissenschaftlicher Grundlage',
		sectionDescription:
			'Entdecke die einzigartigen Vorteile unserer spezialisierten Laufpläne: wissenschaftlich fundiert, alltagstauglich und individuell anpassbar für optimalen Trainingserfolg.',
		keywords: [
			'Laufplan Vorteile',
			'strukturierte Laufpläne',
			'wissenschaftliches Lauftraining',
			'flexible Trainingspläne',
			'realistische Laufziele'
		]
	};

	// Schema.org JSON-LD für strukturierte Daten
	let schemaData;

	onMount(() => {
		if (browser) {
			// Schema.org strukturierte Daten generieren
			schemaData = {
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: 'Vorteile der LaufPlaner Pro Trainingspläne',
				description: seoData.sectionDescription,
				url: window.location.href,
				itemListElement: features.map((feature, index) => ({
					'@type': 'ListItem',
					position: index + 1,
					name: feature.title,
					description: feature.text,
					url: `${window.location.href}#${feature.id}`
				}))
			};

			// Schema.org Daten als JSON-LD in den Head einfügen
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);
		}
	});
</script>

<section id="features" class="features py-20" aria-labelledby="features-heading">
	<div class="container mx-auto px-4">
		<header class="section-header text-center mb-12">
			<span class="section-tag text-primary text-sm uppercase tracking-wider" aria-hidden="true"
				>Besonderheiten</span
			>
			<h2 id="features-heading" class="section-title text-3xl md:text-4xl font-bold mt-2 mb-4">
				WAS UNSERE LAUFPLÄNE BESONDERS MACHT
			</h2>
			<p class="section-subtitle max-w-2xl mx-auto">
				Unsere professionellen Laufpläne sind wissenschaftlich fundiert, strukturiert und für den
				Alltag optimiert – entwickelt für echte Erfolge ohne Überforderung.
			</p>
			<meta name="description" content={seoData.sectionDescription} />
			<meta name="keywords" content={seoData.keywords.join(', ')} />
		</header>

		<div class="features-grid">
			{#each features as feature, i (feature.id)}
				<article
					class="feature-item"
					id={feature.id}
					itemscope
					itemtype="https://schema.org/Article"
				>
					<div class="feature-content">
						<h3 class="feature-title" itemprop="headline">{feature.title}</h3>
						<p class="feature-text" itemprop="description">{feature.text}</p>
						<meta itemprop="keywords" content={feature.keywords.join(', ')} />
						<meta itemprop="author" content="LaufPlaner Pro Trainingsexperten" />
					</div>
				</article>
			{/each}
		</div>

		<div class="mt-12 text-center">
			<p class="text-lg text-gray-300" style="margin-bottom: 2.5rem;">
				Maximiere deinen Trainingserfolg mit professionell gestalteten Laufplänen, die auf deine
				individuellen Ziele und deinen Alltag abgestimmt sind.
			</p>
			<a href="#laufplaene" class="btn-primary inline-flex items-center gap-2">
				<span>Laufpläne entdecken</span>
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
	.features {
		padding: 5rem 0;
		/* Geändert von var(--dark) zu var(--dark-gray) */
		background-color: var(--dark-gray);
	}

	.features-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.features-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.feature-item {
		/* Von var(--dark-gray) zu var(--dark) geändert für besseren Kontrast */
		background-color: var(--dark);
		border-radius: 0.5rem;
		padding: 1.5rem;
		position: relative;
		overflow: hidden;
		animation: fadeUpIn 0.5s ease forwards;
		opacity: 0;
		transform: translateY(20px);
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.feature-item:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 242, 254, 0.1);
		border-color: rgba(0, 242, 254, 0.2);
	}

	.feature-item::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 3px;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.feature-item:hover::after {
		opacity: 1;
	}

	.feature-item:nth-child(1) {
		animation-delay: 0.1s;
	}

	.feature-item:nth-child(2) {
		animation-delay: 0.2s;
	}

	.feature-item:nth-child(3) {
		animation-delay: 0.3s;
	}

	.feature-item:nth-child(4) {
		animation-delay: 0.4s;
	}

	@keyframes fadeUpIn {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.feature-content {
		position: relative;
		z-index: 1;
	}

	.feature-title {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 0.75rem;
		color: var(--primary);
	}

	.feature-text {
		color: var(--text-gray);
		line-height: 1.6;
	}

	.btn-primary {
		padding: 0.75rem 1.5rem;
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
</style>
