<!-- src/lib/components/WhyPlan.svelte -->
<script>
	// Strukturierte Daten für SEO - ausbalancierter
	const schemaData = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'Warum ein strukturierter Laufplan dein Training verbessert',
		description:
			'Entdecke, wie ein professionell erstellter Trainingsplan essentiell ist, um Verletzungen zu vermeiden, Motivation zu steigern und Laufziele zu erreichen.',
		step: [
			{
				'@type': 'HowToStep',
				name: 'Verletzungsprävention durch ausgewogenes Training',
				text: 'Mit dem richtigen Verhältnis aus Belastung und Erholung schützt du deinen Körper vor Überlastung.'
			},
			{
				'@type': 'HowToStep',
				name: 'Kontinuierliche Motivationssteigerung',
				text: 'Kleine, erreichbare Schritte und messbare Fortschritte helfen dir, auch an schwierigen Tagen dranzubleiben.'
			},
			{
				'@type': 'HowToStep',
				name: 'Realistische Zielsetzung',
				text: 'Dein Plan basiert auf deiner aktuellen Fitness und entwickelt sich mit dir weiter.'
			},
			{
				'@type': 'HowToStep',
				name: 'Optimale Wettkampfvorbereitung',
				text: 'Mit systematischem Training stehst du perfekt vorbereitet an jeder Startlinie.'
			}
		]
	};
</script>

<section id="why-plan" class="why-plan" aria-labelledby="why-plan-title">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Effektives Lauftraining</span>
			<h1 id="why-plan-title" class="section-title">
				WARUM EIN STRUKTURIERTER TRAININGSPLAN DEIN LAUFTRAINING VERBESSERT
			</h1>
			<p class="section-subtitle">
				Durchdachtes, strukturiertes Training führt nachweislich schneller zu Fortschritten - für
				Anfänger und ambitionierte Läufer gleichermaßen.
			</p>
		</div>

		<div class="why-plan-content">
			<div class="why-plan-image">
				<div class="image-container">
					<img
						src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
						alt="Läufer mit strukturiertem Trainingsplan - bessere Ergebnisse durch professionelles Training"
						loading="lazy"
						width="800"
						height="533"
					/>
				</div>
				<div class="blur-circle"></div>
			</div>

			<div class="why-plan-text">
				<p class="intro-text">
					Ein <strong>strukturierter Laufplan</strong> bringt dich nachweislich effizienter ans Ziel
					und verbessert deine Laufleistung deutlich schneller als improvisiertes Training ohne Plan.
				</p>

				<div class="reason-list">
					<article class="reason-item">
						<div class="reason-number" aria-hidden="true">1</div>
						<div class="reason-content">
							<h2 class="reason-title">Verhindert Übertraining & Verletzungen</h2>
							<p class="reason-text">
								Mit einem ausgewogenen Verhältnis aus Belastung und Erholung reduzierst du das
								Verletzungsrisiko und optimierst die Trainingseffekte für langfristigen Fortschritt.
							</p>
						</div>
					</article>

					<article class="reason-item">
						<div class="reason-number" aria-hidden="true">2</div>
						<div class="reason-content">
							<h2 class="reason-title">Steigert deine Laufmotivation langfristig</h2>
							<p class="reason-text">
								Durch messbare Zwischenerfolge und klar definierte Trainingseinheiten bleibt deine
								Motivation konstant hoch - selbst an Tagen, an denen das Training schwerfällt.
							</p>
						</div>
					</article>

					<article class="reason-item">
						<div class="reason-number" aria-hidden="true">3</div>
						<div class="reason-content">
							<h2 class="reason-title">Individuell angepasste, realistische Laufziele</h2>
							<p class="reason-text">
								Dein Trainingsplan basiert auf deinem aktuellen Fitnesslevel und entwickelt sich mit
								dir weiter - für maximalen Trainingserfolg ohne Frustration.
							</p>
						</div>
					</article>

					<article class="reason-item">
						<div class="reason-number" aria-hidden="true">4</div>
						<div class="reason-content">
							<h2 class="reason-title">Optimale Wettkampfvorbereitung garantiert</h2>
							<p class="reason-text">
								Mit systematischem Training nach einem professionellen Plan stehst du perfekt
								vorbereitet an jeder Startlinie - egal ob 5km-Lauf, Halbmarathon oder Marathon.
							</p>
						</div>
					</article>
				</div>

				<p class="highlight-text">
					Und das Beste: Du benötigst weder teure Ausrüstung noch jahrelange Erfahrung. Ein klares
					Laufziel und ein individueller Trainingsplan im Mitgliederbereich reichen völlig aus!
				</p>
			</div>
		</div>
	</div>

	<!-- Strukturierte Daten für Suchmaschinen -->
	<script type="application/ld+json">
        {@html JSON.stringify(schemaData)}
	</script>
</section>

<style>
	.why-plan {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.why-plan-content {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	@media (min-width: 768px) {
		.why-plan-content {
			flex-direction: row;
		}
	}

	.why-plan-image {
		flex: 1;
		position: relative;
	}

	.image-container {
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
		height: 100%;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.blur-circle {
		position: absolute;
		width: 8rem;
		height: 8rem;
		background-color: var(--primary);
		border-radius: 50%;
		bottom: -1.25rem;
		right: -1.25rem;
		opacity: 0.1;
		filter: blur(1.5rem);
	}

	.why-plan-text {
		flex: 1;
	}

	.intro-text {
		font-size: 1.125rem;
		color: #d0d0d0;
		margin-bottom: 2rem;
		line-height: 1.6;
	}

	.reason-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.reason-item {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.reason-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		background-color: var(--primary);
		color: var(--dark);
		border-radius: 50%;
		font-weight: bold;
		flex-shrink: 0;
	}

	.reason-content {
		flex: 1;
	}

	.reason-title {
		font-weight: bold;
		margin-bottom: 0.5rem;
		font-size: 1.25rem;
	}

	.reason-text {
		color: var(--text-gray);
		line-height: 1.5;
	}

	.highlight-text {
		font-size: 1.125rem;
		color: var(--primary);
		font-weight: 500;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}
</style>
