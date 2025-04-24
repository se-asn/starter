<!-- src/lib/components/FAQ.svelte -->
<script>
	import { slide } from 'svelte/transition';

	// FAQ-Daten
	const faqs = [
		{
			id: 1,
			question: 'Brauche ich Erfahrung, um loszulegen?',
			answer:
				'Nein. Unsere Einsteigerpläne starten ganz easy – auch wenn du aktuell keine 5 Minuten am Stück läufst.'
		},
		{
			id: 2,
			question: 'Wie unterscheiden sich die Pläne?',
			answer:
				'Alle Pläne sind nach Ziel (5k, 10k, 21k, 42k) und deinem aktuellen Level (Anfänger oder Fortgeschritten) aufgebaut – damit du genau das bekommst, was du brauchst.'
		},
		{
			id: 3,
			question: 'Wann kommen die Pläne online?',
			answer: 'Wir arbeiten mit Hochdruck daran – sichere dir jetzt den Early Access!'
		},
		{
			id: 4,
			question: 'Welche Ausrüstung benötige ich?',
			answer:
				'Für den Anfang reichen bequeme Laufschuhe und Kleidung, in der du dich wohl fühlst. Keine teuren Gadgets notwendig!'
		},
		{
			id: 5,
			question: 'Kann ich die Pläne an meinen Zeitplan anpassen?',
			answer:
				'Absolut! Unsere Pläne bieten Flexibilität und Tipps, wie du sie an deinen Alltag anpassen kannst, ohne die Trainingseffekte zu verlieren.'
		}
	];

	// Aktives FAQ-Item (für Accordion-Funktion)
	let activeId = null;

	function toggleFaq(id) {
		activeId = activeId === id ? null : id;
	}
</script>

<section id="faq" class="faq">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Häufige Fragen</span>
			<h2 class="section-title">FAQ</h2>
			<p class="section-subtitle">
				Hier findest du Antworten auf die häufigsten Fragen zu unseren Laufplänen.
			</p>
		</div>

		<div class="faq-container">
			{#each faqs as faq}
				<div class="faq-item">
					<button
						class="faq-question {activeId === faq.id ? 'active' : ''}"
						on:click={() => toggleFaq(faq.id)}
					>
						{faq.question}
						<span class="faq-icon">{activeId === faq.id ? '−' : '+'}</span>
					</button>

					{#if activeId === faq.id}
						<div class="faq-answer" transition:slide>
							<p>{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.faq {
		padding: 5rem 0;
	}

	.faq-container {
		max-width: 48rem;
		margin: 0 auto;
	}

	.faq-item {
		margin-bottom: 1rem;
	}

	.faq-question {
		width: 100%;
		background-color: var(--dark-gray);
		padding: 1.25rem;
		border-radius: 0.5rem;
		text-align: left;
		font-size: 1.125rem;
		font-weight: bold;
		color: white;
		border: none;
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.faq-question:hover {
		background-color: var(--medium-gray);
	}

	.faq-question.active {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 1px solid var(--light-gray);
	}

	.faq-icon {
		font-size: 1.5rem;
		color: var(--primary);
	}

	.faq-answer {
		background-color: var(--dark-gray);
		padding: 1.25rem;
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		color: var(--text-gray);
	}

	.faq-answer p {
		margin: 0;
		line-height: 1.6;
	}
</style>
