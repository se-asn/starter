<!-- src/lib/components/ForWho.svelte -->
<section id="for-who" class="for-who">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Für wen sind unsere Pläne</span>
			<h2 class="section-title">DER RICHTIGE PLAN FÜR DEIN ZIEL</h2>
			<p class="section-subtitle">
				Unsere Laufpläne sind für alle, die ihr nächstes Laufziel erreichen wollen - egal ob
				Anfänger oder Fortgeschrittene.
			</p>
		</div>

		<div class="for-who-grid">
			<!-- Beginner -->
			<div class="for-who-card slant-box">
				<div class="card-content">
					<h3 class="card-title">FÜR ANFÄNGER</h3>
					<p class="card-text">
						Du möchtest endlich mit dem Laufen anfangen oder hast dir ein klares Ziel gesetzt – 5K,
						10K oder vielleicht sogar ein Halbmarathon? Kein Problem. Unsere Einsteigerprogramme
						nehmen dich an die Hand, bauen langsam deine Ausdauer auf und motivieren dich durch
						klare, einfache Schritte.
					</p>
					<h4 class="card-subtitle">Ziele für Anfänger:</h4>
					<ul class="card-list">
						<li class="check-item">Erste 5 Kilometer durchlaufen</li>
						<li class="check-item">10K-Ziel erreichen ohne Überforderung</li>
						<li class="check-item">Halbmarathon als großer Meilenstein</li>
					</ul>
				</div>
			</div>

			<!-- Advanced -->
			<div class="for-who-card slant-box slant-box-red">
				<div class="card-content">
					<h3 class="card-title">FÜR FORTGESCHRITTENE</h3>
					<p class="card-text">
						Du hast schon Lauferfahrung, willst schneller werden oder ein neues Rennen angehen?
						Unsere Pläne helfen dir, gezielter zu trainieren – mit Fokus auf Tempo, Ausdauer,
						Regeneration und smarter Periodisierung.
					</p>
					<h4 class="card-subtitle">Ziele für Fortgeschrittene:</h4>
					<ul class="card-list">
						<li class="check-item">Persönliche Bestzeit auf 5K oder 10K</li>
						<li class="check-item">Halbmarathon in Bestform</li>
						<li class="check-item">Dein erster oder schnellster Marathon</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.for-who {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.for-who-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}

	@media (min-width: 768px) {
		.for-who-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.for-who-card {
		padding: 2rem;
		background-color: var(--dark);
		border-radius: 0.5rem;
		position: relative;
		overflow: hidden;
	}

	.slant-box {
		position: relative;
		overflow: hidden;
	}

	.slant-box:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 200%;
		height: 100%;
		background: linear-gradient(130deg, rgba(0, 242, 254, 0.2) 0%, transparent 50%);
		transform: translateX(-50%) translateY(-10%);
		z-index: 0;
	}

	.slant-box-red:before {
		background: linear-gradient(130deg, rgba(255, 0, 60, 0.2) 0%, transparent 50%);
	}

	.card-content {
		position: relative;
		z-index: 1;
	}

	.card-title {
		font-size: 1.5rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.card-text {
		color: var(--text-gray);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.card-subtitle {
		font-weight: bold;
		margin-bottom: 0.75rem;
	}

	.card-list {
		list-style: none;
		padding: 0;
	}
</style>
