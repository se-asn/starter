<!-- src/lib/components/FAQ.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	// FAQ-Daten - erweiterte und umfassendere Version
	const faqs = [
		{
			id: 1,
			question: 'Brauche ich Erfahrung, um mit einem Lauftrainingsplan zu starten?',
			answer:
				'Nein, absolut nicht. Unsere Einsteigerpläne sind speziell für Laufanfänger konzipiert und starten ganz behutsam – selbst wenn du aktuell keine 5 Minuten am Stück laufen kannst. Die progressiven Trainingspläne führen dich Schritt für Schritt an längere Laufeinheiten heran und berücksichtigen dabei deinen individuellen Fitnesslevel.'
		},
		{
			id: 2,
			question: 'Wie unterscheiden sich die verschiedenen Lauftrainingspläne voneinander?',
			answer:
				'Alle unsere Trainingspläne sind nach Distanzziel (5k, 10k, Halbmarathon, Marathon) und deinem aktuellen Fitnesslevel (Anfänger oder Fortgeschritten) strukturiert. So erhältst du einen maßgeschneiderten Plan, der optimal zu deinen persönlichen Zielen und deiner aktuellen Laufform passt. Jeder Plan beinhaltet die richtige Balance aus Lauftagen, Regenerationszeiten und ergänzenden Übungen für dein spezifisches Ziel.'
		},
		{
			id: 3,
			question: 'Wie erhalte ich Zugang zu meinem individuellen Lauftrainingsplan?',
			answer:
				'Nach erfolgreicher Registrierung prüfen wir deine Angaben und schalten deinen persönlichen Zugang innerhalb von 24 Stunden frei. Du erhältst dann per E-Mail deine Login-Daten für unseren exklusiven Mitgliederbereich, wo dein individueller Trainingsplan auf dich wartet. Bei komplexeren Anforderungen nehmen wir vorab Kontakt mit dir auf, um alle Details zu besprechen.'
		},
		{
			id: 4,
			question: 'Welche Ausrüstung benötige ich für einen erfolgreichen Trainingsplan?',
			answer:
				'Für den Einstieg ins Lauftraining reichen bequeme Laufschuhe und funktionale Kleidung, in der du dich wohl fühlst. Du brauchst keine teuren Gadgets oder Spezialausrüstung, um mit unseren Plänen Erfolge zu erzielen! Mit zunehmender Erfahrung kannst du deine Ausrüstung bei Bedarf ergänzen, aber der Fokus liegt auf konstanten, strukturierten Trainingseinheiten.'
		},
		{
			id: 5,
			question: 'Kann ich die Lauftrainingspläne an meinen persönlichen Zeitplan anpassen?',
			answer:
				'Absolut! Unsere Lauftrainingspläne sind bewusst flexibel gestaltet und bieten konkrete Anleitungen, wie du Trainingseinheiten verschieben oder anpassen kannst, ohne die Trainingseffekte zu beeinträchtigen. Wir verstehen, dass Beruf, Familie und andere Verpflichtungen Priorität haben können und haben dies bei der Erstellung unserer Pläne berücksichtigt.'
		},
		{
			id: 6,
			question: 'Beinhalten die Trainingspläne auch Ernährungsempfehlungen?',
			answer:
				'Auf Wunsch ergänzen wir deinen Trainingsplan mit individuellen Ernährungsempfehlungen, die auf deine Trainingsziele abgestimmt sind. Diese umfassen Hinweise zur optimalen Ernährung vor, während und nach dem Training sowie allgemeine Empfehlungen für eine läuferfreundliche Ernährung. Gib einfach bei deiner Anfrage an, dass du zusätzliche Ernährungstipps wünschst.'
		},
		{
			id: 7,
			question: 'Wie detailliert sind die Trainingspläne im Mitgliederbereich aufgebaut?',
			answer:
				'In deinem persönlichen Mitgliederbereich findest du einen vollständigen Überblick über alle Trainingswochen bis zu deinem Ziel sowie detaillierte Tagesangaben mit genauen Trainingseinheiten (Distanz/Dauer, Intensität, Tempovorgaben). Das Dashboard bietet zusätzlich Hinweise zu Warm-up und Cool-down, ergänzenden Übungen sowie individuell angepasste Trainingshinweise für deine persönliche Situation und Zielsetzung.'
		},
		{
			id: 8,
			question: 'Was passiert, wenn ich eine Verletzung oder Krankheit habe?',
			answer:
				'Gesundheit geht vor! Bei Verletzungen oder Krankheiten solltest du dein Training unterbrechen oder anpassen. In deinem Trainingsplan im Mitgliederbereich findest du Hinweise zum Umgang mit Trainingspausen und wie du danach wieder einsteigen kannst. Bei längeren Auszeiten kannst du uns direkt über den Support-Bereich im Mitgliederportal kontaktieren - wir helfen dir, deinen Plan anzupassen.'
		},
		{
			id: 9,
			question: 'Welche Informationen werden für einen individuellen Trainingsplan benötigt?',
			answer:
				'Für einen optimal angepassten Plan benötigen wir Angaben zu deinem aktuellen Fitnesslevel, bisherigen Lauferfahrungen, Trainingszielen (Distanz/Zeit), verfügbarer Zeit pro Woche, eventuellen Verletzungen oder gesundheitlichen Einschränkungen und dem Zeitraum bis zum Ziel. Je detaillierter deine Angaben, desto besser können wir den Plan auf dich zuschneiden.'
		},
		{
			id: 10,
			question: 'Wie ist mein Trainingsplan im Mitgliederbereich aufgebaut?',
			answer:
				'Im Mitgliederbereich findest du deinen personalisierten Trainingsplan in einem übersichtlichen Dashboard-Format. Du kannst zwischen der Gesamtübersicht und detaillierten Wochenplänen wechseln. Alle Trainingseinheiten sind präzise aufgeführt mit genauen Angaben zu Distanz, Dauer, Intensität und speziellen Hinweisen. Der Zugriff ist von jedem Gerät aus jederzeit möglich - du brauchst lediglich deine Login-Daten.'
		}
	];

	// Aktives FAQ-Item (für Accordion-Funktion)
	let activeId = null;

	function toggleFaq(id) {
		activeId = activeId === id ? null : id;
	}

	// FAQ Schema.org strukturierte Daten für SEO
	const faqSchemaData = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	};

	// Initial ein FAQ-Element öffnen für bessere Sichtbarkeit
	onMount(() => {
		activeId = 1;
	});
</script>

<section id="faq" class="faq" aria-labelledby="faq-title">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Häufige Fragen zum Lauftraining</span>
			<h2 id="faq-title" class="section-title">TRAININGSPLÄNE FAQ</h2>
			<p class="section-subtitle">
				Hier findest du ausführliche Antworten auf die häufigsten Fragen zu unseren professionellen
				Lauftrainingsplänen für Anfänger und Fortgeschrittene.
			</p>
		</div>

		<div class="faq-container">
			{#each faqs as faq (faq.id)}
				<div class="faq-item" id={`faq-item-${faq.id}`}>
					<h3>
						<button
							class="faq-question {activeId === faq.id ? 'active' : ''}"
							on:click={() => toggleFaq(faq.id)}
							aria-expanded={activeId === faq.id}
							aria-controls={`faq-answer-${faq.id}`}
						>
							{faq.question}
							<span class="faq-icon" aria-hidden="true">{activeId === faq.id ? '−' : '+'}</span>
						</button>
					</h3>

					{#if activeId === faq.id}
						<div
							class="faq-answer"
							id={`faq-answer-${faq.id}`}
							transition:slide
							role="region"
							aria-labelledby={`faq-item-${faq.id}`}
						>
							<p>{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Änderung der Info-Box im unteren Bereich -->
		<div class="faq-info-box">
			<h3 class="info-box-title">Dein individueller Lauftrainingsplan</h3>
			<p>
				Wir erstellen für dich einen maßgeschneiderten Trainingsplan, der exklusiv in deinem
				persönlichen Mitgliederbereich verfügbar ist und genau auf deine Ziele und deinen aktuellen
				Fitnesslevel abgestimmt wird.
			</p>
			<div class="info-box-features">
				<div class="feature-item">
					<span class="feature-icon">⏱️</span>
					<span class="feature-text"
						>Zugang innerhalb von 24 Stunden nach Registrierung und Freischaltung</span
					>
				</div>
				<div class="feature-item">
					<span class="feature-icon">📊</span>
					<span class="feature-text">Individuell auf dein Niveau und deine Ziele angepasst</span>
				</div>
				<div class="feature-item">
					<span class="feature-icon">🥗</span>
					<span class="feature-text">Auf Wunsch mit ergänzenden Ernährungsempfehlungen</span>
				</div>
				<div class="feature-item">
					<span class="feature-icon">📱</span>
					<span class="feature-text">Auf allen Geräten mit deinem persönlichen Login abrufbar</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Strukturierte Daten für Suchmaschinen -->
	<script type="application/ld+json">
        {@html JSON.stringify(faqSchemaData)}
	</script>
</section>

<style>
	.faq {
		padding: 5rem 0;
		/* Angepasst für den visuellen Rhythmus */
		background-color: var(--dark-gray);
	}

	.faq-container {
		max-width: 48rem;
		margin: 0 auto 2rem;
	}

	.faq-item {
		margin-bottom: 1rem;
	}

	.faq-item h3 {
		margin: 0;
		padding: 0;
		font-size: inherit;
	}

	.faq-question {
		width: 100%;
		/* Dunkler als Hintergrund für Kontrast */
		background-color: var(--dark);
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

	.faq-question:focus {
		outline: 2px solid var(--primary);
		outline-offset: 2px;
	}

	.faq-question.active {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: 1px solid var(--light-gray);
	}

	.faq-icon {
		font-size: 1.5rem;
		color: var(--primary);
		min-width: 1.5rem;
		text-align: center;
		margin-left: 1rem;
	}

	.faq-answer {
		/* Gleiche Farbe wie Fragen für Konsistenz */
		background-color: var(--dark);
		padding: 1.25rem;
		border-bottom-left-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
		color: var(--text-gray);
	}

	.faq-answer p {
		margin: 0;
		line-height: 1.6;
	}

	/* Neuer Info-Box-Stil anstatt der CTA */
	.faq-info-box {
		/* Gleiche Farbe wie Fragen für Konsistenz */
		background-color: var(--dark);
		border-left: 3px solid var(--primary);
		max-width: 48rem;
		margin: 3rem auto 0;
		padding: 2rem;
		border-radius: 0.5rem;
	}

	.info-box-title {
		color: var(--primary);
		font-size: 1.25rem;
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.faq-info-box p {
		color: #d0d0d0;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.info-box-features {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.info-box-features {
			grid-template-columns: 1fr 1fr;
		}
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.feature-icon {
		font-size: 1.5rem;
		display: inline-block;
	}

	.feature-text {
		color: #d0d0d0;
		font-size: 0.95rem;
	}
</style>
