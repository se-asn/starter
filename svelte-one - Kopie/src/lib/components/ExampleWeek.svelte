<!-- src/lib/components/ExampleWeek.svelte -->
<script>
	const trainingWeek = [
		{ day: 'Montag', training: 'Ruhetag' },
		{ day: 'Dienstag', training: '3 km locker laufen + Dehnen' },
		{ day: 'Mittwoch', training: 'Ruhetag oder Spaziergang' },
		{ day: 'Donnerstag', training: '4 x 400m zügig, dazwischen 90 Sek. Pause' },
		{ day: 'Freitag', training: 'Ruhetag oder leichtes Krafttraining' },
		{ day: 'Samstag', training: '4,5 km locker laufen' },
		{ day: 'Sonntag', training: '6 km langer, langsamer Lauf' }
	];
</script>

<section id="example-week" class="example-week">
	<div class="container">
		<div class="section-header">
			<span class="section-tag">Ein Blick in den Plan</span>
			<h2 class="section-title">SO SIEHT EINE TRAININGSWOCHE AUS</h2>
			<p class="section-subtitle">Beispiel: Anfänger – 10K in 8 Wochen</p>
		</div>

		<div class="week-table-container">
			<div class="table-wrapper">
				<table class="week-table">
					<thead>
						<tr>
							<th>Tag</th>
							<th>Training</th>
						</tr>
					</thead>
					<tbody>
						{#each trainingWeek as day}
							<tr>
								<td class="day-cell">{day.day}</td>
								<td class="training-cell">{day.training}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="table-footer">
				<p>Jede Woche steigert sich leicht – mit Fokus auf Erholung und Fortschritt.</p>
			</div>
		</div>
	</div>
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
	}

	.table-wrapper {
		overflow-x: auto;
	}

	.week-table {
		width: 100%;
		border-collapse: collapse;
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
	}

	.table-footer {
		background-color: var(--medium-gray);
		padding: 1rem;
	}

	.table-footer p {
		font-size: 0.875rem;
		color: #d0d0d0;
		margin: 0;
	}
</style>
