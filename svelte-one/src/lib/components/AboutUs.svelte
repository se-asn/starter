<!-- src/lib/components/About.svelte -->
<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Schema.org JSON-LD für strukturierte Daten
	onMount(() => {
		if (browser) {
			const schemaData = {
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: 'LaufPlaner Pro',
				description:
					'Professionelle Laufpläne und individualisierte Trainingsprogramme für Läufer aller Leistungsniveaus.',
				foundingDate: '2022'
			};
			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);
		}
	});
</script>

<section id="about" class="about">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Wer wir sind</span>
			<h2 class="section-title">ÜBER LAUFPLANER PRO</h2>
			<p class="section-subtitle">
				Ein Team aus leidenschaftlichen Läufern und Sportwissenschaftlern mit der Mission,
				wissenschaftlich fundierte Laufpläne für jeden zugänglich zu machen.
			</p>
		</div>

		<div class="about-content">
			<div class="about-section story-section">
				<h3 class="about-heading">Unsere Geschichte</h3>
				<div class="accent-line"></div>
				<p class="about-paragraph">
					Die Idee zu LaufPlaner Pro entstand 2023, als wir die Lücke zwischen komplexen
					wissenschaftlichen Trainingsmethoden und einfachen, zugänglichen Laufplänen für
					Hobbysportler erkannten.
				</p>
				<p class="about-paragraph">
					Nach Jahren der Forschung im Bereich der Lauftrainingswissenschaft entwickelten wir ein
					System, das professionelle, individualisierte Trainingspläne für Läufer aller Niveaus
					ermöglicht – von Anfängern bis zu ambitionierten Marathonläufern.
				</p>
			</div>

			<div class="about-section philosophy-section">
				<h3 class="about-heading">Unsere Philosophie</h3>
				<div class="accent-line"></div>
				<div class="philosophy-items">
					<div class="philosophy-item">
						<div class="philosophy-number">01</div>
						<div class="philosophy-content">
							<h4 class="philosophy-title">Wissenschaftlich fundiert</h4>
							<p class="philosophy-text">
								Wir integrieren aktuelle sportwissenschaftliche Erkenntnisse in praktische,
								alltagstaugliche Trainingspläne.
							</p>
						</div>
					</div>

					<div class="philosophy-item">
						<div class="philosophy-number">02</div>
						<div class="philosophy-content">
							<h4 class="philosophy-title">Individuell anpassbar</h4>
							<p class="philosophy-text">
								Jeder Läufer ist einzigartig. Unsere Pläne berücksichtigen persönliche
								Voraussetzungen und Ziele.
							</p>
						</div>
					</div>

					<div class="philosophy-item">
						<div class="philosophy-number">03</div>
						<div class="philosophy-content">
							<h4 class="philosophy-title">Gemeinschaft & Support</h4>
							<p class="philosophy-text">
								Wir bieten nicht nur Pläne, sondern eine unterstützende Community und professionelle
								Betreuung.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="about-cta">
			<a href="#signup" class="btn-primary">Starte jetzt mit uns</a>
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
	}

	.philosophy-text {
		color: var(--text-gray);
		line-height: 1.5;
	}

	.about-cta {
		margin-top: 3rem;
		text-align: center;
	}

	.about-cta .btn-primary {
		padding: 0.75rem 2.5rem;
		font-size: 1rem;
	}
</style>
