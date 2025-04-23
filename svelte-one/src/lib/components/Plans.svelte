<script>
	import { onMount } from 'svelte';
	import { activePlanTab, setActivePlanTab } from '$lib/store.js'; // Füge die .js-Erweiterung hinzu
	import { browser } from '$app/environment';

	// Daten für die Pläne mit SEO-optimierten Beschreibungen und Keywords
	const beginnerPlans = [
		{
			id: 'b5k',
			distance: '5K',
			subtitle: 'in 6-8 Wochen',
			title: 'Vom Sofa zur 5K-Ziellinie',
			description:
				'Idealer Laufplan für Anfänger und Wiedereinsteiger – schrittweise Steigerung ohne Überforderung mit bewährtem Konzept.',
			features: [
				'Wissenschaftlich fundierte Geh-Lauf-Intervalle für optimalen Trainingseffekt',
				'3 effektive Trainingseinheiten pro Woche für maximalen Fortschritt',
				'Fokus auf nachhaltige Lauftechnik und Regelmäßigkeit'
			],
			price: '€29.99',
			keywords: ['5K Laufplan', 'Anfänger Laufen', 'Couch to 5K', 'Laufen lernen']
		},
		{
			id: 'b10k',
			distance: '10K',
			subtitle: 'mit System',
			title: 'Systematisch zur 10K-Distanz',
			description:
				'Verdopple deine Ausdauer mit wissenschaftlich fundierten Tempoeinheiten und strategischen Regenerationstagen für optimale Leistungssteigerung.',
			features: [
				'Aufbauend auf 5K-Fitness mit progressiver Belastungssteigerung',
				'4 strukturierte Trainingseinheiten pro Woche für kontinuierlichen Fortschritt',
				'Einführung effektiver Tempovariationen für Leistungssteigerung'
			],
			price: '€34.99',
			keywords: ['10K Training', 'Laufplan 10 Kilometer', 'Ausdauer verbessern', '10K für Anfänger']
		},
		{
			id: 'b21k',
			distance: '21K',
			subtitle: 'für Einsteiger',
			title: 'Erster Halbmarathon-Erfolg',
			description:
				'Perfekter Trainingsplan für alle, die erstmals die Halbmarathon-Distanz bewältigen wollen – mit professioneller Anleitung zum Erfolg.',
			features: [
				'Wissenschaftlich fundierter, schonender Aufbau der Langstreckenfähigkeit',
				'Effektives Training für nachhaltiges Durchhaltevermögen und Motivation',
				'Umfassende Ernährungs-, Erholungs- und Renntaktik-Tipps für optimale Vorbereitung'
			],
			price: '€39.99',
			keywords: [
				'Halbmarathon Einsteiger',
				'21K Trainingsplan',
				'erster Halbmarathon',
				'Halbmarathon Training'
			]
		},
		{
			id: 'b42k',
			distance: '42K',
			subtitle: 'erster Marathon',
			title: 'Erfolgreicher Marathon-Einsteiger',
			description:
				'Professioneller Trainingsplan für deinen ersten Marathon – mit der richtigen Vorbereitung zum erfolgreichen Finish über die volle Distanz.',
			features: [
				'Realistische, individuell anpassbare Trainingsziele für Marathonanfänger',
				'Klar strukturierter Wochenplan mit optimaler Belastungssteigerung',
				'Besonderer Fokus auf Gesundheit, Regeneration und Verletzungsprävention'
			],
			price: '€49.99',
			keywords: ['Marathon Anfänger', 'Erster Marathon', 'Marathon Training', '42K Laufplan']
		}
	];

	const advancedPlans = [
		{
			id: 'a5k',
			distance: '5K',
			subtitle: 'Bestzeiten',
			title: 'Deine neue 5K-Bestzeit',
			description:
				'Wissenschaftlich entwickelter Leistungsplan für ambitionierte Läufer mit Wettkampfambitionen – optimiert für maximale Geschwindigkeit.',
			features: [
				'Hocheffektive Intervall- und Tempotrainings für messbare Leistungssteigerung',
				'Fortgeschrittenes Techniktraining für optimale Laufökonomie und Effizienz',
				'Strategisches Peak-Performance-Timing für Wettkampfhöhepunkte'
			],
			price: '€34.99',
			keywords: ['5K Bestzeit', 'Schneller laufen', '5K PB', 'Leistungssteigerung 5K']
		},
		{
			id: 'a10k',
			distance: '10K',
			subtitle: 'Leistungsorientiert',
			title: 'Performance-Optimierung 10K',
			description:
				'Mit wissenschaftlichem Schwellentraining, Lauf-ABC und strategischer Progression zur persönlichen Bestleistung über 10 Kilometer.',
			features: [
				'Spezialisierte Schwellenläufe für maximale Tempohärte und Laktattoleranz',
				'Periodisiertes Trainingssystem mit optimalen Belastungs- und Erholungsphasen',
				'Präziser Tapering-Plan für perfektes Wettkampf-Timing'
			],
			price: '€39.99',
			keywords: ['10K Wettkampf', 'Schwellentraining', '10K Bestzeit', 'Tempotraining']
		},
		{
			id: 'a21k',
			distance: '21K',
			subtitle: 'mit Strategie',
			title: 'Halbmarathon auf neuem Niveau',
			description:
				'Wissenschaftlich fundierter Plan zur Steigerung von Tempo, Ausdauer und Renntaktik für neue persönliche Halbmarathon-Bestzeiten.',
			features: [
				'Hochspezialisiertes Tempotraining für optimale Wettkampfgeschwindigkeit',
				'Effektive Rennstrategien und präzises Pacing für perfekte Renneinteilung',
				'Umfassende Wettkampfvorbereitung mit Ernährung, Taper und mentaler Stärke'
			],
			price: '€44.99',
			keywords: [
				'Halbmarathon Bestzeit',
				'21K Wettkampf',
				'Schneller Halbmarathon',
				'Halbmarathon Leistung'
			]
		},
		{
			id: 'a42k',
			distance: '42K',
			subtitle: 'Performance',
			title: 'Marathon-Leistungsoptimierung',
			description:
				'Wissenschaftlich optimierter Leistungsplan für ambitionierte Ziele wie Sub4, Sub3:30 oder schneller – mit professioneller Unterstützung zum Erfolg.',
			features: [
				'Hocheffektive Tempoeinheiten für optimale Marathonpace und Schwellentoleranz',
				'Strategisch optimierte Long Runs mit spezifischen Trainingsschwerpunkten',
				'Professionelles Tapering-Konzept für maximale Wettkampfleistung'
			],
			price: '€54.99',
			keywords: ['Marathon Bestzeit', 'Marathon Performance', 'Sub4 Marathon', 'Schneller Marathon']
		}
	];

	// SEO-optimierte Überschriften und Beschreibungen
	const seoTexts = {
		beginnerTitle: 'Laufpläne für Anfänger - vom 5K bis zum Marathon',
		advancedTitle: 'Leistungsorientierte Laufpläne für Fortgeschrittene',
		beginnerDesc:
			'Wissenschaftlich fundierte Trainingspläne für Einsteiger und Wiedereinsteiger - mit individueller Anpassung für optimalen Trainingsfortschritt.',
		advancedDesc:
			'Professionelle Trainingspläne für ambitionierte Läufer zur gezielten Leistungssteigerung und Wettkampfvorbereitung.'
	};

	// Verwenden des globalen Stores für bessere Konsistenz
	function setActiveTab(tab) {
		setActivePlanTab(tab);
	}

	// Schema.org JSON-LD für strukturierte Daten
	let schemaData;

	onMount(() => {
		if (browser) {
			// Erzeugen der strukturierten Daten für bessere SEO
			schemaData = {
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				itemListElement: [...beginnerPlans, ...advancedPlans].map((plan, index) => ({
					'@type': 'Product',
					position: index + 1,
					name: `${plan.title} (${plan.distance})`,
					description: plan.description,
					offers: {
						'@type': 'Offer',
						price: plan.price.replace('€', ''),
						priceCurrency: 'EUR'
					},
					keywords: plan.keywords.join(', ')
				}))
			};

			// Schema.org Daten in den Head einfügen
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);
		}
	});
</script>

<section id="laufplaene" class="plans py-20 bg-dark" aria-labelledby="plans-heading">
	<div class="container mx-auto px-4">
		<header class="section-header text-center mb-12">
			<span class="section-tag text-primary text-sm uppercase tracking-wider">Unsere Laufpläne</span
			>
			<h2 id="plans-heading" class="section-title text-3xl md:text-4xl font-bold mt-2 mb-4">
				VOM ERSTEN 5K BIS ZUM MARATHON
			</h2>
			<p class="section-subtitle text-gray-300 max-w-2xl mx-auto">
				Wissenschaftlich fundierte Trainingspläne für jedes Niveau und Ziel - jetzt vormerken und zu
				den Ersten gehören!
			</p>
		</header>

		<div
			class="plan-tabs flex gap-4 mb-8 flex-wrap justify-center"
			role="tablist"
			aria-label="Laufplan-Kategorien"
		>
			<button
				class="plan-tab {$activePlanTab === 'beginner' ? 'active' : ''}"
				on:click={() => setActiveTab('beginner')}
				role="tab"
				aria-selected={$activePlanTab === 'beginner'}
				aria-controls="beginner-plans"
				id="tab-beginner"
			>
				<span>Anfänger</span>
			</button>
			<button
				class="plan-tab {$activePlanTab === 'advanced' ? 'active' : ''}"
				on:click={() => setActiveTab('advanced')}
				role="tab"
				aria-selected={$activePlanTab === 'advanced'}
				aria-controls="advanced-plans"
				id="tab-advanced"
			>
				<span>Fortgeschrittene</span>
			</button>
		</div>

		<!-- Beschreibungstext je nach Tab für bessere SEO -->
		<div class="mb-8 text-center">
			<h3 class="text-xl font-semibold mb-2">
				{$activePlanTab === 'beginner' ? seoTexts.beginnerTitle : seoTexts.advancedTitle}
			</h3>
			<p class="text-gray-300 max-w-3xl mx-auto">
				{$activePlanTab === 'beginner' ? seoTexts.beginnerDesc : seoTexts.advancedDesc}
			</p>
		</div>

		<!-- Pläne anzeigen basierend auf ausgewähltem Tab -->
		<div
			id="beginner-plans"
			role="tabpanel"
			aria-labelledby="tab-beginner"
			class="plan-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
			style="display: {$activePlanTab === 'beginner' ? 'grid' : 'none'}"
		>
			{#each beginnerPlans as plan (plan.id)}
				<article
					class="plan-card h-full flex flex-col"
					itemscope
					itemtype="https://schema.org/Product"
				>
					<div class="plan-header relative overflow-hidden">
						<div class="plan-header-content absolute inset-0 flex items-center justify-center">
							<h4 class="plan-distance text-2xl font-bold text-white" itemprop="name">
								<span itemprop="category">{plan.distance}</span>
							</h4>
						</div>
						<div
							class="plan-subtitle absolute bottom-4 left-4 z-10 text-sm"
							itemprop="alternateHeadline"
						>
							{plan.subtitle}
						</div>
						<div class="plan-header-bg absolute inset-0"></div>
					</div>
					<div class="plan-content flex-grow flex flex-col p-6">
						<h5 class="plan-title text-xl font-bold mb-2" itemprop="headline">{plan.title}</h5>
						<p class="plan-description text-gray-300 mb-4" itemprop="description">
							{plan.description}
						</p>
						<ul class="plan-features mb-6 flex-grow">
							{#each plan.features as feature}
								<li class="plan-feature mb-2 pl-6 relative text-gray-200" itemprop="featureList">
									{feature}
								</li>
							{/each}
						</ul>
						<div
							class="plan-footer flex justify-between items-center border-t border-gray-700 pt-4"
						>
							<span
								class="plan-price text-xl font-bold"
								itemprop="offers"
								itemscope
								itemtype="https://schema.org/Offer"
							>
								<span itemprop="price" content={plan.price.replace('€', '')}>{plan.price}</span>
								<meta itemprop="priceCurrency" content="EUR" />
							</span>
							<a href="#signup" class="btn-primary" itemprop="url" rel="nofollow"> Vormerken </a>
						</div>
					</div>
					<meta itemprop="keywords" content={plan.keywords.join(', ')} />
				</article>
			{/each}
		</div>

		<div
			id="advanced-plans"
			role="tabpanel"
			aria-labelledby="tab-advanced"
			class="plan-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
			style="display: {$activePlanTab === 'advanced' ? 'grid' : 'none'}"
		>
			{#each advancedPlans as plan (plan.id)}
				<article
					class="plan-card h-full flex flex-col"
					itemscope
					itemtype="https://schema.org/Product"
				>
					<div class="plan-header advanced relative overflow-hidden">
						<div class="plan-header-content absolute inset-0 flex items-center justify-center">
							<h4 class="plan-distance text-2xl font-bold text-white" itemprop="name">
								<span itemprop="category">{plan.distance}</span>
							</h4>
						</div>
						<div
							class="plan-subtitle absolute bottom-4 left-4 z-10 text-sm"
							itemprop="alternateHeadline"
						>
							{plan.subtitle}
						</div>
						<div class="plan-header-bg absolute inset-0"></div>
					</div>
					<div class="plan-content flex-grow flex flex-col p-6">
						<h5 class="plan-title text-xl font-bold mb-2" itemprop="headline">{plan.title}</h5>
						<p class="plan-description text-gray-300 mb-4" itemprop="description">
							{plan.description}
						</p>
						<ul class="plan-features mb-6 flex-grow">
							{#each plan.features as feature}
								<li class="plan-feature mb-2 pl-6 relative text-gray-200" itemprop="featureList">
									{feature}
								</li>
							{/each}
						</ul>
						<div
							class="plan-footer flex justify-between items-center border-t border-gray-700 pt-4"
						>
							<span
								class="plan-price text-xl font-bold"
								itemprop="offers"
								itemscope
								itemtype="https://schema.org/Offer"
							>
								<span itemprop="price" content={plan.price.replace('€', '')}>{plan.price}</span>
								<meta itemprop="priceCurrency" content="EUR" />
							</span>
							<a href="#signup" class="btn-primary" itemprop="url" rel="nofollow"> Vormerken </a>
						</div>
					</div>
					<meta itemprop="keywords" content={plan.keywords.join(', ')} />
				</article>
			{/each}
		</div>
	</div>
</section>

<style>
	.plans {
		padding: 5rem 0;
	}

	.plan-tabs {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.plan-tab {
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		background: transparent;
		cursor: pointer;
		transition: all 0.3s ease;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: #ffffff;
	}

	.plan-tab.active {
		background: rgba(0, 242, 254, 0.1);
		border-color: var(--primary);
		color: var(--primary);
	}

	.plan-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 640px) {
		.plan-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.plan-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.plan-card {
		background-color: var(--dark);
		border-radius: 0.5rem;
		overflow: hidden;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
		background: linear-gradient(145deg, var(--dark-gray) 0%, var(--dark) 100%);
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.plan-card:hover {
		transform: translateY(-5px);
		box-shadow:
			0 15px 35px rgba(0, 242, 254, 0.1),
			0 5px 15px rgba(0, 242, 254, 0.05);
		border: 1px solid rgba(0, 242, 254, 0.3);
	}

	.plan-header {
		height: 10rem;
		background: linear-gradient(to right, var(--dark-gray), var(--medium-gray));
		position: relative;
		overflow: hidden;
	}

	.plan-header-content {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.plan-distance {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
	}

	.plan-subtitle {
		position: absolute;
		bottom: 1rem;
		left: 1rem;
		z-index: 10;
		color: #d0d0d0;
	}

	.plan-header-bg {
		position: absolute;
		inset: 0;
		opacity: 0.3;
		background: linear-gradient(to bottom right, var(--primary), transparent);
	}

	.plan-header.advanced .plan-header-bg {
		background: linear-gradient(to bottom right, var(--secondary), transparent);
	}

	.plan-content {
		padding: 1.5rem;
	}

	.plan-title {
		font-size: 1.25rem;
		font-weight: bold;
		margin-bottom: 0.75rem;
	}

	.plan-description {
		color: var(--text-gray);
		margin-bottom: 1rem;
		font-size: 0.9375rem;
	}

	.plan-features {
		list-style: none;
		padding: 0;
		margin: 0 0 1.5rem;
	}

	.plan-feature {
		display: flex;
		align-items: flex-start;
		margin-bottom: 0.5rem;
		padding-left: 1.25rem;
		position: relative;
		color: #d0d0d0;
	}

	.plan-feature::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.5rem;
		width: 6px;
		height: 12px;
		border-right: 2px solid var(--primary);
		border-bottom: 2px solid var(--primary);
		transform: rotate(45deg) translateY(-50%);
	}

	.plan-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid var(--light-gray);
		padding-top: 1rem;
	}

	.plan-price {
		font-size: 1.5rem;
		font-weight: bold;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.btn-primary {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		background-color: var(--primary);
		color: var(--dark);
		font-weight: 500;
		border-radius: 0.375rem;
		transition: background-color 0.2s ease;
		text-decoration: none;
		display: inline-block;
	}

	.btn-primary:hover {
		background-color: var(--primary-dark);
	}
</style>
