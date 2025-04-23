<!-- src/lib/components/WhyPlan.svelte -->
<section id="why-plan" class="why-plan">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Unser Ansatz</span>
			<h2 class="section-title">WARUM EIN PLAN (FAST) ALLES VERÄNDERT</h2>
			<p class="section-subtitle">
				Ohne Plan trainierst du einfach drauflos – mit Plan trainierst du mit Richtung.
			</p>
		</div>

		<div class="why-plan-content">
			<div class="why-plan-image">
				<div class="image-container">
					<img
						src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
						alt="Läufer mit Trainingsplan"
					/>
				</div>
				<div class="blur-circle"></div>
			</div>

			<div class="why-plan-text">
				<p class="intro-text">
					Ein guter Laufplan bringt dich viel effizienter ans Ziel, als wenn du einfach ohne Plan
					trainierst.
				</p>

				<div class="reason-list">
					<div class="reason-item">
						<div class="reason-number">1</div>
						<div class="reason-content">
							<h4 class="reason-title">Verhindert Übertraining & Verletzungen</h4>
							<p class="reason-text">
								Mit einer durchdachten Struktur aus Belastung und Erholung schützt du deinen Körper
								vor Überlastung.
							</p>
						</div>
					</div>

					<div class="reason-item">
						<div class="reason-number">2</div>
						<div class="reason-content">
							<h4 class="reason-title">Steigert deine Motivation</h4>
							<p class="reason-text">
								Kleine, erreichbare Schritte und messbare Fortschritte helfen dir, auch an
								schwierigen Tagen dranzubleiben.
							</p>
						</div>
					</div>

					<div class="reason-item">
						<div class="reason-number">3</div>
						<div class="reason-content">
							<h4 class="reason-title">Hilft dir, realistische Ziele zu setzen</h4>
							<p class="reason-text">
								Ein guter Plan basiert auf deiner aktuellen Fitness, nicht auf unrealistischen
								Wunschvorstellungen.
							</p>
						</div>
					</div>

					<div class="reason-item">
						<div class="reason-number">4</div>
						<div class="reason-content">
							<h4 class="reason-title">Gibt dir ein sicheres Gefühl</h4>
							<p class="reason-text">
								Mit einem soliden Plan weißt du, dass du optimal vorbereitet an der Startlinie
								stehst.
							</p>
						</div>
					</div>
				</div>

				<p class="highlight-text">
					Und das Beste: Du brauchst keine Hightech-Uhr oder jahrelange Erfahrung. Nur ein Ziel –
					und die Lust, loszulaufen.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.why-plan {
		padding: 5rem 0;
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
	}
</style>
