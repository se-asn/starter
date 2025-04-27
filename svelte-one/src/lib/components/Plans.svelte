<script>
	import { onMount } from 'svelte';
	import { activePlanTab, setActivePlanTab } from '$lib/store.js';
	import { browser } from '$app/environment';

	// Daten für die Pläne mit kreativ optimierten Beschreibungen und Keywords
	const beginnerPlans = [
		{
			id: 'b5k',
			distance: '5K',
			subtitle: 'in 6-8 Wochen',
			title: 'Vom Sofa zur 5K-Ziellinie',
			description:
				'Der perfekte Einstieg für Laufneulinge – unser Konzept baut deine Ausdauer behutsam auf.',
			features: [
				'Clever konzipierte Geh-Lauf-Intervalle für sanften Aufbau deiner Kondition',
				'3 effektive Trainingseinheiten pro Woche für optimalen Fortschritt',
				'Fokus auf nachhaltige Lauftechnik und Erfolgsroutinen'
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
				'Verdopple deine Ausdauer mit unserem Trainingsaufbau – die perfekte Balance aus Tempo und Erholung.',
			features: [
				'Aufbauend auf 5K-Fitness mit intelligenter Belastungssteigerung',
				'4 strukturierte Trainingseinheiten pro Woche für kontinuierlichen Fortschritt',
				'Einführung effektiver Tempovariationen für spürbaren Leistungsschub'
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
				'Von Läufern für Läufer entwickelt – unser Plan führt dich zur erfolgreichen Bewältigung deiner ersten 21K.',
			features: [
				'Evidenzbasierter, schonender Aufbau deiner Langstreckenfähigkeit',
				'Motivierende Trainingsstruktur für nachhaltiges Durchhaltevermögen',
				'Umfassende Ernährungs-, Erholungs- und Renntaktik-Tipps aus der Praxis'
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
				'Der Traum vom Marathon wird Realität – mit unserem Plan meisterst du die Königsdistanz mit Freude.',
			features: [
				'Realistische, alltagstaugliche Trainingsziele für Marathonneulinge',
				'Kristallklarer Wochenaufbau mit intelligenter Steigerungslogik',
				'Besonderer Fokus auf Verletzungsprävention und nachhaltige Trainingsfreude'
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
			description: 'Sprenge deine Tempogrenzen mit unserem Leistungsplan – jede Sekunde zählt.',
			features: [
				'Hocheffektive Intervall-Architekturen für messbare Geschwindigkeitsexplosion',
				'Ausgeklügeltes Techniktraining für optimale Laufökonomie und Effizienz',
				'Strategisches Peak-Performance-Timing für deine Wettkampfhöhepunkte'
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
				'Durchbreche deine 10K-Schallmauer mit modernsten Trainingsmethoden – unser Plan kombiniert Tempo und mentale Stärke.',
			features: [
				'Hochmoderne Schwelleneinheiten für maximale Tempohärte und Laktattoleranz',
				'Durchdachtes Periodisierungssystem mit präzisen Belastungs- und Erholungsphasen',
				'Maßgeschneidertes Tapering-Konzept für punktgenaue Wettkampfform'
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
				'Revolutioniere deine Halbmarathon-Performance mit unserem Plan – gezielte Optimierung von Tempo und Ausdauer.',
			features: [
				'Präzisionsgesteuertes Tempotraining für optimale Rennpace-Stabilität',
				'Von Profis erprobte Rennstrategien für perfekte Wettkampfeinteilung',
				'Ganzheitliche Wettkampfvorbereitung mit Fokus auf mentale Siegesstrategien'
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
				'Erobere die Königsdistanz mit Bestzeit – unser Plan macht ambitionierte Ziele wie Sub4 zur Realität.',
			features: [
				'Innovatives System aus Tempoeinheiten für optimale Marathon-Pace-Ökonomie',
				'Strategisch durchkomponierte Long Runs mit wechselnden Trainingsschwerpunkten',
				'Von Top-Athleten inspiriertes Tapering-Konzept für maximale Rennpower'
			],
			price: '€54.99',
			keywords: ['Marathon Bestzeit', 'Marathon Performance', 'Sub4 Marathon', 'Schneller Marathon']
		}
	];

	// SEO-Beschreibungen für Tab-Inhalte aktualisiert
	const seoTexts = {
		beginnerTitle: 'Laufpläne für Anfänger - vom ersten Kilometer bis zum Marathon',
		advancedTitle: 'Performance-Pläne für ambitionierte Läufer und Wettkämpfer',
		beginnerDesc:
			'Von Experten konzipierte Laufpläne für Einsteiger - im exklusiven Mitgliederbereich verfügbar mit persönlichem Login und 24/7-Zugriff.',
		advancedDesc:
			'Hochentwickelte Trainingssysteme für ambitionierte Läufer - im Mitgliederbereich jederzeit abrufbar mit individueller Anpassung und Support.',
		metaDescription:
			'Maßgeschneiderte, von Experten entwickelte Laufpläne für 5K, 10K, Halbmarathon und Marathon - mit persönlichem Zugang zum exklusiven Mitgliederbereich!'
	};

	// Add additional SEO metadata
	const pageSEO = {
		title: 'Professionelle Laufpläne für alle Niveaus | LaufPlaner Pro',
		canonical: 'https://laufplanerpro.de/laufplaene',
		ogDescription:
			'Entdecke wissenschaftlich fundierte Laufpläne für jedes Niveau - vom 5K bis zum Marathon. Erreiche deine persönlichen Laufziele mit LaufPlaner Pro.',
		additionalKeywords:
			'Läufer Training, Laufprogramm, personalisierte Laufpläne, Lauftraining für 5K, 10K, Halbmarathon, Marathon'
	};

	function setActiveTab(tab) {
		setActivePlanTab(tab);
	}

	// Verbesserte Schema.org JSON-LD für strukturierte Daten
	let schemaData;

	onMount(() => {
		if (browser) {
			// Erweiterte strukturierte Daten für bessere SEO
			schemaData = {
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				name: 'LaufPlaner Pro Trainingspläne',
				description: 'Professionelle Laufpläne für alle Distanzen und Leistungsniveaus',
				url: window.location.href,
				itemListElement: [...beginnerPlans, ...advancedPlans].map((plan, index) => ({
					'@type': 'Product',
					position: index + 1,
					name: `${plan.title} (${plan.distance})`,
					description: plan.description,
					category:
						plan.distance === '5K' || plan.distance === '10K'
							? 'Kurzdistanz-Laufpläne'
							: 'Langdistanz-Laufpläne',
					offers: {
						'@type': 'Offer',
						price: plan.price.replace('€', ''),
						priceCurrency: 'EUR',
						availability: 'https://schema.org/InStock',
						url: window.location.href + '#' + plan.id,
						priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
							.toISOString()
							.split('T')[0],
						description:
							'Zugang zum exklusiven Mitgliederbereich mit personalisiertem Trainingsplan'
					},
					brand: {
						'@type': 'Brand',
						name: 'LaufPlaner Pro'
					},
					keywords: plan.keywords.join(', ')
				}))
			};

			// Schema.org Daten in den Head einfügen
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);

			// Meta-Beschreibung dynamisch setzen
			if (!document.querySelector('meta[name="description"]')) {
				const metaDesc = document.createElement('meta');
				metaDesc.name = 'description';
				metaDesc.content = seoTexts.metaDescription;
				document.head.appendChild(metaDesc);
			}

			// Add additional metadata for better SEO
			if (!document.querySelector('meta[name="keywords"]')) {
				const metaKeywords = document.createElement('meta');
				metaKeywords.name = 'keywords';
				metaKeywords.content = pageSEO.additionalKeywords;
				document.head.appendChild(metaKeywords);
			}

			// Add canonical link
			if (!document.querySelector('link[rel="canonical"]')) {
				const canonicalLink = document.createElement('link');
				canonicalLink.rel = 'canonical';
				canonicalLink.href = pageSEO.canonical;
				document.head.appendChild(canonicalLink);
			}

			// Add Open Graph meta tags
			const ogTags = [
				{ property: 'og:title', content: pageSEO.title },
				{ property: 'og:description', content: pageSEO.ogDescription },
				{ property: 'og:url', content: window.location.href },
				{ property: 'og:type', content: 'website' },
				{ property: 'og:site_name', content: 'LaufPlaner Pro' }
			];

			ogTags.forEach((tag) => {
				if (!document.querySelector(`meta[property="${tag.property}"]`)) {
					const metaTag = document.createElement('meta');
					metaTag.setAttribute('property', tag.property);
					metaTag.content = tag.content;
					document.head.appendChild(metaTag);
				}
			});
		}
	});
</script>

<section
	id="laufplaene"
	class="plans py-20 bg-dark"
	aria-labelledby="plans-heading"
	itemscope
	itemtype="https://schema.org/CollectionPage"
>
	<meta itemprop="name" content={pageSEO.title} />
	<meta itemprop="description" content={pageSEO.ogDescription} />

	<div class="container mx-auto px-4">
		<!-- SEO-optimierter Header mit verbesserter Struktur -->
		<header class="section-header text-center mb-12">
			<span class="section-tag text-primary text-sm uppercase tracking-wider"
				>Wissenschaftlich fundierte Laufpläne</span
			>
			<h2 id="plans-heading" class="section-title text-3xl md:text-4xl font-bold mt-2 mb-4">
				PROFESSIONELLE LAUFPLÄNE FÜR JEDES NIVEAU
			</h2>
			<p class="section-subtitle text-gray-300 max-w-2xl mx-auto">
				Von Couch to 5K bis zur Marathon-Bestzeit - individualisierte Trainingspläne mit
				Erfolgsgarantie für dein persönliches Laufziel.
			</p>
		</header>

		<!-- Barrierefreie Tab-Navigation -->
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

		<!-- Verbesserte SEO für Kategorie-Beschreibungen mit besserer Zentrierung -->
		<div class="text-center mb-16 w-full px-4" style="margin-bottom: 3%;">
			<div class="mx-auto max-w-4xl">
				<h3 class="text-xl font-semibold mb-8">
					{$activePlanTab === 'beginner' ? seoTexts.beginnerTitle : seoTexts.advancedTitle}
				</h3>
				<div class="spacer py-2"></div>
				<p class="text-gray-300 mx-auto">
					{$activePlanTab === 'beginner' ? seoTexts.beginnerDesc : seoTexts.advancedDesc}
				</p>
			</div>
		</div>

		<!-- Optimiertes Markup für Anfänger-Pläne -->
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
					id={plan.id}
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

						<!-- Redesigned footer with flexbox for perfect alignment -->
						<div class="plan-footer fixed-height">
							<div class="price-container">
								<span
									class="plan-price text-xl font-bold"
									itemprop="offers"
									itemscope
									itemtype="https://schema.org/Offer"
								>
									<span itemprop="price" content={plan.price.replace('€', '')}>{plan.price}</span>
									<meta itemprop="priceCurrency" content="EUR" />
								</span>
							</div>
							<div class="button-container">
								<a
									href="#signup"
									class="btn-primary btn-buy pulse-animation"
									itemprop="url"
									rel="nofollow"
									aria-label="Plan {plan.title} im Mitgliederbereich freischalten"
								>
									<span class="btn-text">Zugang sichern</span>
									<span class="btn-icon">→</span>
								</a>
							</div>
						</div>
					</div>
					<meta itemprop="keywords" content={plan.keywords.join(', ')} />
					<meta itemprop="brand" content="LaufPlaner Pro" />
					<meta itemprop="sku" content={plan.id} />
				</article>
			{/each}
		</div>

		<!-- Optimiertes Markup für Fortgeschrittenen-Pläne mit identischer Struktur -->
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
					id={plan.id}
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

						<!-- Identical footer structure for perfect alignment across tabs -->
						<div class="plan-footer fixed-height">
							<div class="price-container">
								<span
									class="plan-price text-xl font-bold"
									itemprop="offers"
									itemscope
									itemtype="https://schema.org/Offer"
								>
									<span itemprop="price" content={plan.price.replace('€', '')}>{plan.price}</span>
									<meta itemprop="priceCurrency" content="EUR" />
								</span>
							</div>
							<div class="button-container">
								<a
									href="#signup"
									class="btn-primary btn-buy pulse-animation"
									itemprop="url"
									rel="nofollow"
									aria-label="Plan {plan.title} sofort starten"
								>
									<span class="btn-text">Sofort starten</span>
									<span class="btn-icon">→</span>
								</a>
							</div>
						</div>
					</div>
					<meta itemprop="keywords" content={plan.keywords.join(', ')} />
					<meta itemprop="brand" content="LaufPlaner Pro" />
					<meta itemprop="sku" content={plan.id} />
				</article>
			{/each}
		</div>

		<!-- Plan-Section-Footer mit weiteren Infos zum Mitgliederbereich -->
		<div itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
			<div class="text-gray-300 mb-12 leading-relaxed" itemprop="text">
				<p class="mb-10">
					Wähle den passenden Plan basierend auf deinem Fitnesslevel, Lauferfahrungen und
					persönlichen Zielen. Nach der Registrierung erhältst du Zugang zu unserem exklusiven
					Mitgliederbereich mit deinem individualisierten Trainingsplan.
				</p>

				<div class="spacer py-4"></div>

				<p class="mt-4">
					Anfänger sollten mit den Einstiegsplänen beginnen, während erfahrene Läufer von unseren
					leistungsorientierten Plänen profitieren. Alle Pläne sind jederzeit über deinen
					persönlichen Login abrufbar.
				</p>
			</div>
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
		display: grid;
		grid-template-columns: 1fr 140px; /* Fixed grid with exact button width */
		grid-gap: 10px;
		align-items: center;
		border-top: 1px solid var(--light-gray);
		padding-top: 1rem;
		height: 3.75rem;
	}

	.plan-footer.fixed-height {
		border-top: 1px solid var(--light-gray);
		padding-top: 1rem;
		height: 3.75rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.price-container {
		flex: 1;
	}

	.button-container {
		width: 140px;
		height: 2.5rem;
	}

	.plan-price {
		font-size: 1.5rem;
		font-weight: bold;
		background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	/* Neue Stile für verbesserten Kaufbutton */
	.btn-buy {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		height: 100%;
		width: 100%;
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.5px;
		background-color: var(--primary);
		color: var(--dark);
		border-radius: 0.375rem;
		transition: all 0.3s ease;
		overflow: hidden;
		z-index: 1;
		box-shadow: 0 4px 12px rgba(0, 242, 254, 0.2);
	}

	.btn-buy:hover {
		background-color: var(--primary-dark);
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 242, 254, 0.3);
	}

	.btn-buy .btn-icon {
		font-size: 1.1em;
		transition: transform 0.3s ease;
	}

	.btn-buy:hover .btn-icon {
		transform: translateX(4px);
	}

	/* Pulsierender Animationseffekt für mehr Aufmerksamkeit */
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(0, 242, 254, 0.4);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(0, 242, 254, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(0, 242, 254, 0);
		}
	}

	.pulse-animation {
		animation: pulse 2s infinite;
	}

	/* Neuer Stil für den zusätzlichen Abstand */
	.spacer {
		height: 0.75rem;
	}
</style>
