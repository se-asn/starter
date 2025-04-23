<!-- src/lib/components/Features.svelte -->
<script>
	const features = [
		{
			title: 'Strukturiert & klar verständlich',
			text: 'Keine komplizierten Fachbegriffe – sondern klare Wochenpläne, die einfach umzusetzen sind. Ob 3 oder 5 Einheiten pro Woche: du weißt immer, was zu tun ist.'
		},
		{
			title: 'Realistische Ziele',
			text: 'Unsere Pläne orientieren sich nicht an Profis, sondern an echten Menschen mit echten Jobs, Familien & Alltag. Du bekommst einen Plan, der motiviert – nicht überfordert.'
		},
		{
			title: 'Wissenschaftlich fundiert',
			text: 'Alle Inhalte basieren auf erprobten Trainingsprinzipien: progressive Belastung, Regeneration, Lauftechnik, Tempovariation und mentale Vorbereitung.'
		},
		{
			title: 'Anpassbar an dein Leben',
			text: 'Kein Plan ist in Stein gemeißelt. Wir geben dir Tools & Tipps an die Hand, um dein Training flexibel anzupassen – damit du auch bei Stress, Urlaub oder Krankheit dranbleiben kannst.'
		}
	];
</script>

<section id="features" class="features">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Besonderheiten</span>
			<h2 class="section-title">WAS UNSERE LAUFPLÄNE BESONDERS MACHT</h2>
			<p class="section-subtitle">
				Unsere Laufpläne (coming soon!) sind wissenschaftlich fundiert, strukturiert und
				praxisorientiert.
			</p>
		</div>

		<div class="features-grid">
			{#each features as feature, i}
				<div class="feature-item">
					<div class="feature-content">
						<h3 class="feature-title">{feature.title}</h3>
						<p class="feature-text">{feature.text}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.features {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.features-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.features-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.feature-item {
		background-color: var(--dark);
		border-radius: 0.5rem;
		padding: 1.5rem;
		position: relative;
		overflow: hidden;
		animation: fadeUpIn 0.5s ease forwards;
		opacity: 0;
		transform: translateY(20px);
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
	}

	.feature-text {
		color: var(--text-gray);
		line-height: 1.6;
	}
</style>
