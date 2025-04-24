<!-- src/lib/components/Testimonials.svelte -->
<script>
	import { onMount } from 'svelte';

	// Erweiterte Erfolgsstories von Läufern ohne Bilder
	const testimonials = [
		{
			id: 1,
			name: 'Sarah M.',
			age: 34,
			quote:
				'Nach zwei fehlgeschlagenen Marathon-Versuchen hat mir der LaufPlaner endlich zum Erfolg verholfen. Ich konnte meine Zeit um ganze 23 Minuten verbessern und bin nun qualifiziert für Boston!',
			achievement: 'Marathon in 3:47:12',
			plan: 'Marathon - Fortgeschritten',
			category: 'Marathon'
		},
		{
			id: 2,
			name: 'Markus K.',
			age: 42,
			quote:
				'Mit 40+ dachte ich, schnelle Zeiten wären vorbei. Der individualisierte Trainingsplan hat mir gezeigt, dass ich auch jetzt noch persönliche Bestzeiten laufen kann! Die gezielten Tempoeinheiten haben meinen Laufstil komplett verändert.',
			achievement: '10K in 39:24',
			plan: '10K - Fortgeschritten',
			category: '10K'
		},
		{
			id: 3,
			name: 'Lisa T.',
			age: 28,
			quote:
				'Vom Couchpotato zum Halbmarathon in nur 6 Monaten! Der strukturierte Lauftrainingsplan war perfekt aufgebaut und hat mich Schritt für Schritt ans Ziel gebracht. Die langsame Steigerung hat Verletzungen verhindert.',
			achievement: 'Halbmarathon in 2:08:45',
			plan: 'Halbmarathon - Anfänger',
			category: 'Halbmarathon'
		},
		{
			id: 4,
			name: 'Johannes F.',
			age: 51,
			quote:
				'Nachdem ich aufgrund von ständigen Knieschmerzen fast mit dem Laufen aufgehört hätte, haben die gezielten Übungen und das angepasste Training mir ermöglicht, schmerzfrei zu laufen. Jetzt bereite ich mich auf meinen ersten Marathon vor.',
			achievement: '20km ohne Schmerzen',
			plan: '10K - Gesundheitsfokus',
			category: 'Gesundheit'
		},
		{
			id: 5,
			name: 'Nina R.',
			age: 33,
			quote:
				'Als Mutter von zwei kleinen Kindern fehlte mir die Zeit für regelmäßiges Training. Der flexible LaufPlaner hat es mir ermöglicht, mit nur 3 Trainingseinheiten pro Woche fit zu werden. Die Zeiteffizienz ist unglaublich!',
			achievement: '5K in 22:47',
			plan: '5K - Zeitsparend',
			category: '5K'
		},
		{
			id: 6,
			name: 'Thorsten H.',
			age: 39,
			quote:
				'Nach einer schweren Covid-Erkrankung hatte ich Probleme mit der Lungenkapazität. Das behutsame Aufbautraining hat meine Ausdauer Woche für Woche verbessert. Die App hat mich perfekt dabei unterstützt, meine Belastung optimal zu steuern.',
			achievement: 'Halbmarathon nach Krankheit',
			plan: 'Halbmarathon - Wiedereinsteiger',
			category: 'Rehabilitation'
		},
		{
			id: 7,
			name: 'Stefanie P.',
			age: 25,
			quote:
				'Als Wettkampfläuferin suchte ich nach einem Plan, der mich an meine Grenzen bringt. Die hochintensiven Intervalle und wissenschaftlich fundierten Trainingsmethoden haben mich in nur 12 Wochen zu meiner persönlichen Bestzeit geführt.',
			achievement: '10K in 37:15',
			plan: '10K - Elite',
			category: 'Leistung'
		}
	];

	// Erfolgsstatistiken
	const statistics = [
		{ value: '97%', label: 'aller Läufer erreichen ihr Trainingsziel' },
		{ value: '22%', label: 'durchschnittliche Leistungssteigerung' },
		{ value: '750+', label: 'erfolgreich abgeschlossene Trainingspläne' },
		{ value: '4.9/5', label: 'durchschnittliche Kundenbewertung' }
	];

	// Erfolgsgeschichten nach Kategorien filtern (für optional erweiterte Funktion)
	const categories = [...new Set(testimonials.map((t) => t.category))];

	// Strukturierte Daten für SEO
	const reviewSchema = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'LaufPlaner Pro',
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.9',
			reviewCount: '2743'
		},
		review: testimonials.map((t) => ({
			'@type': 'Review',
			author: {
				'@type': 'Person',
				name: t.name
			},
			reviewRating: {
				'@type': 'Rating',
				ratingValue: '5'
			},
			reviewBody: t.quote
		}))
	};

	// Slider-Funktionalität
	let currentSlide = 0;
	let sliderInterval;

	function nextSlide() {
		currentSlide = (currentSlide + 1) % testimonials.length;
	}

	function prevSlide() {
		currentSlide = (currentSlide - 1 + testimonials.length) % testimonials.length;
	}

	function setSlide(index) {
		currentSlide = index;
		resetInterval();
	}

	function resetInterval() {
		clearInterval(sliderInterval);
		sliderInterval = setInterval(nextSlide, 8000); // Längere Zeit für mehr Text
	}

	onMount(() => {
		sliderInterval = setInterval(nextSlide, 8000);
		return () => clearInterval(sliderInterval);
	});
</script>

<section id="testimonials" class="testimonials" aria-labelledby="testimonials-title">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Läufer berichten</span>
			<h2 id="testimonials-title" class="section-title">ERFOLGSGESCHICHTEN UNSERER LÄUFER</h2>
			<p class="section-subtitle">
				Erfahre, wie unsere strukturierten Lauftrainingspläne Läufern jeder Altersgruppe und
				Fitnesslevels zu neuen persönlichen Bestzeiten verholfen haben.
			</p>
		</div>

		<div class="testimonials-slider">
			<div class="slider-container" style="transform: translateX(-{currentSlide * 100}%)">
				{#each testimonials as testimonial, i}
					<div class="testimonial-slide" class:active={currentSlide === i}>
						<div class="testimonial-content">
							<div class="testimonial-text">
								<div class="testimonial-header">
									<div class="testimonial-category">{testimonial.category}</div>
									<div class="achievement-badge">
										<span class="achievement-text">{testimonial.achievement}</span>
									</div>
								</div>

								<blockquote>
									<p>"{testimonial.quote}"</p>
									<footer>
										<div class="testimonial-author">
											<strong>{testimonial.name}, {testimonial.age}</strong>
											<span class="plan-tag">{testimonial.plan}</span>
										</div>
									</footer>
								</blockquote>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<button class="slider-arrow prev" on:click={prevSlide} aria-label="Vorheriges Testimonial">
				&#10094;
			</button>
			<button class="slider-arrow next" on:click={nextSlide} aria-label="Nächstes Testimonial">
				&#10095;
			</button>

			<div class="slider-dots">
				{#each testimonials as _, i}
					<button
						class="slider-dot {currentSlide === i ? 'active' : ''}"
						on:click={() => setSlide(i)}
						aria-label="Testimonial {i + 1} anzeigen"
						aria-current={currentSlide === i}
					></button>
				{/each}
			</div>
		</div>

		<div class="success-stats">
			{#each statistics as stat}
				<div class="stat-item">
					<div class="stat-value">{stat.value}</div>
					<div class="stat-label">{stat.label}</div>
				</div>
			{/each}
		</div>

		<div class="testimonials-cta">
			<p>
				Schließe dich tausenden zufriedener Läufer an und erlebe, wie ein maßgeschneiderter
				Trainingsplan dein Lauftraining revolutioniert.
			</p>
		</div>
	</div>

	<!-- Strukturierte Daten für Suchmaschinen -->
	<script type="application/ld+json">
        {@html JSON.stringify(reviewSchema)}
	</script>
</section>

<style>
	.testimonials {
		padding: 5rem 0;
		background-color: var(--dark);
	}

	.section-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.section-tag {
		display: inline-block;
		background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
		color: var(--dark);
		padding: 0.35rem 1rem;
		border-radius: 2rem;
		font-size: 0.875rem;
		font-weight: 500;
		margin-bottom: 1rem;
		text-transform: uppercase;
	}

	.section-title {
		color: white;
		font-size: 2rem;
		margin: 0 0 1rem;
		font-weight: 700;
	}

	.section-subtitle {
		color: #a0a0a0;
		max-width: 38rem;
		margin: 0 auto;
		font-size: 1.125rem;
	}

	.testimonials-slider {
		position: relative;
		overflow: hidden;
		margin: 2rem 0 3rem;
		border-radius: 0.5rem;
		box-shadow: 0 0 20px rgba(0, 242, 254, 0.15);
	}

	.slider-container {
		display: flex;
		transition: transform 0.5s ease-in-out;
	}

	.testimonial-slide {
		min-width: 100%;
		padding: 2.5rem 2rem;
		box-sizing: border-box;
		background-color: var(--dark-gray);
	}

	.testimonial-content {
		max-width: 900px;
		margin: 0 auto;
	}

	.testimonial-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}

	.testimonial-category {
		font-size: 0.9rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--primary);
		font-weight: 600;
	}

	.achievement-badge {
		background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
		color: var(--dark);
		padding: 0.35rem 0.85rem;
		border-radius: 1rem;
		font-size: 0.85rem;
		font-weight: bold;
	}

	.testimonial-text {
		position: relative;
		padding: 0 1.5rem;
	}

	.testimonial-text::before {
		content: '"';
		font-family: Georgia, serif;
		font-size: 5rem;
		color: var(--primary);
		opacity: 0.2;
		position: absolute;
		top: -2rem;
		left: -1rem;
	}

	.testimonial-text blockquote {
		margin: 0;
		font-style: italic;
		color: #d0d0d0;
		line-height: 1.7;
	}

	.testimonial-text p {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
	}

	.testimonial-text footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	.testimonial-author {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.testimonial-author strong {
		color: white;
		margin-bottom: 0.25rem;
	}

	.plan-tag {
		display: inline-block;
		background-color: rgba(0, 242, 254, 0.1);
		color: var(--primary);
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		font-size: 0.75rem;
	}

	.slider-arrow {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1rem;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.slider-arrow:hover {
		opacity: 1;
		background-color: rgba(0, 242, 254, 0.2);
	}

	.slider-arrow.prev {
		left: 1rem;
	}

	.slider-arrow.next {
		right: 1rem;
	}

	.slider-dots {
		position: absolute;
		bottom: 1rem;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		gap: 0.5rem;
	}

	.slider-dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.3);
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.slider-dot.active {
		background-color: var(--primary);
		transform: scale(1.2);
	}

	.success-stats {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
		margin-top: 3rem;
	}

	@media (min-width: 768px) {
		.success-stats {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat-item {
		text-align: center;
		background-color: var(--dark-gray);
		padding: 1.5rem;
		border-radius: 0.5rem;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
		border: 1px solid rgba(0, 242, 254, 0.05);
	}

	.stat-item:hover {
		transform: translateY(-5px);
		box-shadow: 0 5px 15px rgba(0, 242, 254, 0.15);
	}

	.stat-value {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--primary);
		margin-bottom: 0.75rem;
	}

	.stat-label {
		color: #d0d0d0;
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.testimonials-cta {
		text-align: center;
		margin-top: 3rem;
		padding: 1rem;
		color: var(--primary);
		font-size: 1.25rem;
		font-weight: 500;
	}
</style>
