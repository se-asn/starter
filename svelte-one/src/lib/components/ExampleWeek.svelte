<!-- src/lib/components/ExampleWeek.svelte -->
<script>
	// Trainingswochen-Daten
	const trainingWeek = [
		{
			day: 'Montag',
			training: 'Ruhetag',
			description: 'Vollständige Erholung für optimale Regeneration'
		},
		{
			day: 'Dienstag',
			training: '3 km locker laufen + Dehnen',
			description: 'Leichter Lauf mit anschließender Dehneinheit zur Förderung der Beweglichkeit'
		},
		{
			day: 'Mittwoch',
			training: 'Ruhetag oder Spaziergang',
			description: 'Aktive Erholung durch leichte Bewegung'
		},
		{
			day: 'Donnerstag',
			training: '4 x 400m zügig, dazwischen 90 Sek. Pause',
			description: 'Intervalltraining zur Verbesserung der Geschwindigkeit und Ausdauer'
		},
		{
			day: 'Freitag',
			training: 'Ruhetag oder leichtes Krafttraining',
			description: 'Regeneration oder ergänzendes Krafttraining für bessere Laufökonomie'
		},
		{
			day: 'Samstag',
			training: '4,5 km locker laufen',
			description: 'Moderater Dauerlauf zur Steigerung der Grundlagenausdauer'
		},
		{
			day: 'Sonntag',
			training: '6 km langer, langsamer Lauf',
			description: 'Long Run zur Entwicklung der Ausdauerfähigkeit und mentalen Stärke'
		}
	];

	// Strukturierte Daten für SEO (Schema.org)
	const schemaData = {
		'@context': 'https://schema.org',
		'@type': 'ExercisePlan',
		name: 'Anfänger 10K Trainingsplan - Beispielwoche',
		description:
			'Beispielhafte Trainingswoche für einen 10K-Lauf in 8 Wochen - ideal für Laufanfänger',
		category: 'Lauftraining',
		activityFrequency: '7 Tage pro Woche',
		exerciseType: 'Laufen',
		intensity: 'Anfänger bis Fortgeschrittener',
		repetitions: '8 Wochen',
		restPeriods: '3 Ruhetage pro Woche',
		workload: 'Progressiv steigernd'
	};
</script>

<section id="example-week" class="example-week" aria-labelledby="example-week-title">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Ein Blick in den Plan</span>
			<h2 id="example-week-title" class="section-title">SO SIEHT EINE TRAININGSWOCHE AUS</h2>
			<p class="section-subtitle">
				Beispiel: <strong>Anfänger – 10K in 8 Wochen</strong> Trainingsplan
			</p>
		</div>

		<div class="week-table-container">
			<div class="table-wrapper">
				<table class="week-table" aria-label="Trainingsplan für eine Woche des 10K Laufprogramms">
					<caption class="visually-hidden"
						>10K Lauftrainingsplan für Anfänger - Beispielwoche</caption
					>
					<thead>
						<tr>
							<th scope="col">Trainingstag</th>
							<th scope="col">Trainingseinheit</th>
						</tr>
					</thead>
					<tbody>
						{#each trainingWeek as day}
							<tr>
								<td class="day-cell">{day.day}</td>
								<td class="training-cell">
									<span class="training-type">{day.training}</span>
									{#if day.description}
										<span class="training-description">{day.description}</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="table-footer">
				<p>
					Jede Woche steigert sich leicht – mit <strong
						>Fokus auf Erholung und kontinuierlichen Fortschritt</strong
					> für optimale Laufleistung.
				</p>
				<div class="benefits">
					<h3 class="benefits-title">Vorteile dieses Trainingsplans:</h3>
					<ul class="benefits-list">
						<li>Ausgewogene Balance zwischen Training und Erholung</li>
						<li>Vielseitige Trainingseinheiten für ganzheitlichen Fortschritt</li>
						<li>Schrittweise Steigerung ohne Übertraining</li>
						<li>Ideal für Laufanfänger und Wiedereinsteiger</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="training-resources">
			<h3 class="resources-title">Ergänzende Trainingstipps:</h3>
			<p>
				Für maximalen Erfolg kombiniere diesen Plan mit einer ausgewogenen Ernährung und ausreichend
				Schlaf. Die Ruhetage sind essentiell für deine Fortschritte!
			</p>
		</div>
	</div>

	<!-- Strukturierte Daten für Suchmaschinen -->
	<script type="application/ld+json">
        {@html JSON.stringify(schemaData)}
	</script>
</section>

<style>
	.example-week {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.week-table-container {
		background-color: var(--dark);
		border-radius: 0.5rem;
		overflow: hidden;
		box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
		margin-bottom: 2rem;
	}

	.table-wrapper {
		overflow-x: auto;
	}

	.week-table {
		width: 100%;
		border-collapse: collapse;
	}

	.week-table caption {
		padding: 0.75rem;
		background-color: var(--primary);
		color: var(--dark);
		font-weight: bold;
	}

	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.week-table th {
		background-color: var(--medium-gray);
		color: white;
		text-align: left;
		padding: 0.75rem 1rem;
	}

	.week-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--light-gray);
	}

	.week-table tr:last-child td {
		border-bottom: none;
	}

	.day-cell {
		font-weight: 500;
		min-width: 100px;
	}

	.training-cell {
		display: flex;
		flex-direction: column;
	}

	.training-type {
		font-weight: 500;
		margin-bottom: 0.25rem;
	}

	.training-description {
		font-size: 0.875rem;
		color: var(--text-gray);
		font-style: italic;
	}

	.table-footer {
		background-color: var(--medium-gray);
		padding: 1.5rem;
	}

	.table-footer p {
		font-size: 0.95rem;
		color: #e0e0e0;
		margin: 0 0 1.5rem 0;
	}

	.benefits {
		margin-top: 1rem;
	}

	.benefits-title {
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
		color: var(--primary);
	}

	.benefits-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.benefits-list li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.5rem;
		color: #d0d0d0;
	}

	.benefits-list li::before {
		content: '✓';
		position: absolute;
		left: 0;
		color: var(--primary);
	}

	.training-resources {
		margin-top: 2rem;
		background-color: rgba(0, 242, 254, 0.05);
		padding: 1.5rem;
		border-radius: 0.5rem;
		border-left: 3px solid var(--primary);
	}

	.resources-title {
		font-size: 1.1rem;
		margin-bottom: 0.75rem;
		color: var(--primary);
	}

	.training-resources p {
		color: #d0d0d0;
		margin: 0;
		line-height: 1.6;
	}
</style>
