<!-- src/lib/components/Plans.svelte -->
<script>
	// Daten für die Pläne
	const beginnerPlans = [
		{
			id: 'b5k',
			distance: '5K',
			subtitle: 'in 6-8 Wochen',
			title: 'Komm vom Sofa zur Ziellinie',
			description: 'Ideal für Laufanfänger und Wiedereinsteiger – ohne Überforderung.',
			features: [
				'Sanfter Einstieg mit Geh-Lauf-Intervallen',
				'3 Trainingseinheiten pro Woche',
				'Fokus auf Regelmäßigkeit'
			],
			price: '€29.99'
		},
		{
			id: 'b10k',
			distance: '10K',
			subtitle: 'mit System',
			title: 'Bau auf deinen 5K-Erfolg auf',
			description: 'Verdopple deine Ausdauer mit einfachen Tempoeinheiten & Regenerationstagen.',
			features: [
				'Aufbauend auf 5K-Fitness',
				'4 Trainingseinheiten pro Woche',
				'Erste Tempovariationen'
			],
			price: '€34.99'
		},
		{
			id: 'b21k',
			distance: '21K',
			subtitle: 'für Einsteiger',
			title: 'Laufend zur nächsten Herausforderung',
			description: 'Für alle, die sich erstmals an längere Strecken wagen wollen.',
			features: [
				'Schonender Aufbau der Langstrecke',
				'Fokus auf Durchhaltevermögen',
				'Ernährungs- & Erholungstipps'
			],
			price: '€39.99'
		},
		{
			id: 'b42k',
			distance: '42K',
			subtitle: 'erster Marathon',
			title: 'Dein erster Marathon',
			description: 'Langstrecke? Kein Problem – mit der richtigen Vorbereitung.',
			features: ['Realistische Zeitziele', 'Klare Wochenstruktur', 'Fokus auf Gesundheit'],
			price: '€49.99'
		}
	];

	const advancedPlans = [
		{
			id: 'a5k',
			distance: '5K',
			subtitle: 'schnell & effizient',
			title: 'Hol dir deine neue Bestzeit',
			description: 'Perfekt für ambitionierte Läufer:innen mit Wettkampfambitionen.',
			features: [
				'Intensive Intervalle',
				'Techniktraining für Effizienz',
				'Peak-Performance-Timing'
			],
			price: '€34.99'
		},
		{
			id: 'a10k',
			distance: '10K',
			subtitle: 'mit Kick',
			title: 'Leistungsorientiertes Training',
			description: 'Mit Schwellentraining, Lauf-ABC und Progression zur Bestleistung.',
			features: [
				'Schwellenläufe für Tempohärte',
				'Periodisiertes Training',
				'Genauer Tapering-Plan'
			],
			price: '€39.99'
		},
		{
			id: 'a21k',
			distance: '21K',
			subtitle: 'mit Plan',
			title: 'Strategisch zum starken Finish',
			description: 'Steigere Tempo, Ausdauer und Renntaktik für neue Bestzeiten.',
			features: [
				'Spezifisches Tempotraining',
				'Rennstrategien & Pacing',
				'Optimale Wettkampfvorbereitung'
			],
			price: '€44.99'
		},
		{
			id: 'a42k',
			distance: '42K',
			subtitle: 'Performance',
			title: 'Marathon-Performance',
			description: 'Ob Sub4, Sub3:30 oder ambitionierter – wir helfen dir, dein Ziel zu erreichen.',
			features: ['Fokus auf Tempoeinheiten', 'Optimierte Long Runs', 'Professionelles Tapering'],
			price: '€54.99'
		}
	];

	let activeTab = 'beginner'; // 'beginner' oder 'advanced'

	function setActiveTab(tab) {
		activeTab = tab;
	}
</script>

<section id="plans" class="plans">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Unsere Laufpläne</span>
			<h2 class="section-title">VOM ERSTEN 5K BIS ZUM MARATHON</h2>
			<p class="section-subtitle">Bald verfügbar – trag dich ein & sei unter den Ersten!</p>
		</div>

		<div class="plan-tabs">
			<button
				class="plan-tab {activeTab === 'beginner' ? 'active' : ''}"
				on:click={() => setActiveTab('beginner')}
			>
				Anfänger
			</button>
			<button
				class="plan-tab {activeTab === 'advanced' ? 'active' : ''}"
				on:click={() => setActiveTab('advanced')}
			>
				Fortgeschrittene
			</button>
		</div>

		<!-- Pläne anzeigen basierend auf ausgewähltem Tab -->
		<div class="plan-grid">
			{#each activeTab === 'beginner' ? beginnerPlans : advancedPlans as plan (plan.id)}
				<div class="plan-card">
					<div class="plan-header {activeTab === 'advanced' ? 'advanced' : ''}">
						<div class="plan-header-content">
							<h3 class="plan-distance">{plan.distance}</h3>
						</div>
						<div class="plan-subtitle">{plan.subtitle}</div>
						<div class="plan-header-bg"></div>
					</div>
					<div class="plan-content">
						<h4 class="plan-title">{plan.title}</h4>
						<p class="plan-description">{plan.description}</p>
						<ul class="plan-features">
							{#each plan.features as feature}
								<li class="plan-feature">{feature}</li>
							{/each}
						</ul>
						<div class="plan-footer">
							<span class="plan-price">{plan.price}</span>
							<a href="#signup" class="btn-primary">Vormerken</a>
						</div>
					</div>
				</div>
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
	}
</style>
