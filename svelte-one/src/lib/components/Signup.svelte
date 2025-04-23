<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let email = '';
	let name = '';
	let goal = '';
	let experience = '';
	let weeklyKm = '';
	let age = '';
	let trainingDays = 3;
	let injuries = false;
	let injuryDetails = '';
	let weight = '';
	let height = '';
	let preferredTime = '';
	let lastRaceTime = '';
	let lastRaceDistance = '';
	let submitted = false;

	// Validierung vor dem Absenden
	function validateForm() {
		// Grundlegende Validierung hier
		return true;
	}

	function handleSubmit() {
		if (!validateForm()) return;

		// Hier würdest du später die Daten an deinen Server senden
		submitted = true;

		// Formular zurücksetzen
		email = '';
		name = '';
		goal = '';
		experience = '';
		weeklyKm = '';
		age = '';
		trainingDays = 3;
		injuries = false;
		injuryDetails = '';
		weight = '';
		height = '';
		preferredTime = '';
		lastRaceTime = '';
		lastRaceDistance = '';

		setTimeout(() => {
			submitted = false;
		}, 5000);
	}

	// Schema.org JSON-LD für strukturierte Daten
	onMount(() => {
		if (browser) {
			const schemaData = {
				'@context': 'https://schema.org',
				'@type': 'WebForm',
				name: 'Laufplan Anfrage Formular',
				description:
					'Formular zur Anforderung eines personalisierten Lauftrainingsplans für 5K, 10K, Halbmarathon oder Marathon',
				url: window.location.href + '#signup',
				mainEntity: {
					'@type': 'Service',
					name: 'Personalisierter Laufplan',
					description:
						'Wissenschaftlich fundierter, individuell angepasster Lauftrainingsplan basierend auf persönlichen Daten und Zielen',
					provider: {
						'@type': 'SportsOrganization',
						name: 'LaufPlaner Pro',
						sameAs: window.location.origin
					},
					category: 'Lauftraining, Marathon, Halbmarathon, 5K, 10K'
				}
			};

			const script = document.createElement('script');
			script.type = 'application/ld+json';
			script.text = JSON.stringify(schemaData);
			document.head.appendChild(script);
		}
	});
</script>

<!-- SEO-optimierte Section mit semantischem HTML -->
<section id="signup" class="signup-section py-20 bg-dark-gray" aria-labelledby="signup-heading">
	<div class="container mx-auto px-4">
		<article class="signup-card">
			<header class="signup-header">
				<h2 id="signup-heading" class="signup-title text-3xl font-bold mb-4">
					PERSONALISIERTER LAUFPLAN FÜR DEIN TRAINING
				</h2>
				<p class="signup-description text-gray-300 mb-6">
					Erhalte deinen wissenschaftlich fundierten, individuellen Trainingsplan für 5K, 10K,
					Halbmarathon oder Marathon. Erstellt basierend auf deinen persönlichen Daten, mit
					Trainingstipps und Ernährungsempfehlungen.
				</p>
			</header>

			{#if submitted}
				<div class="success-message" role="alert" aria-live="polite">
					<p>
						<strong>Vielen Dank für deine Anfrage!</strong> Wir erstellen jetzt deinen personalisierten
						Laufplan basierend auf deinen Zielen und werden dich schnellstmöglich per E-Mail benachrichtigen.
					</p>
				</div>
			{:else}
				<form
					on:submit|preventDefault={handleSubmit}
					class="signup-form"
					name="laufplan-formular"
					aria-label="Laufplan Anfrageformular"
				>
					<!-- Persönliche Daten Sektion -->
					<fieldset class="form-section">
						<legend class="section-title text-primary font-medium text-xl mb-4">
							Persönliche Daten für deinen Laufplan
						</legend>

						<div class="form-group">
							<label for="email" class="form-label"
								>E-Mail-Adresse <span class="required">*</span></label
							>
							<input
								type="email"
								id="email"
								name="email"
								bind:value={email}
								placeholder="deine@email.de"
								required
								aria-required="true"
								class="form-input"
								autocomplete="email"
							/>
						</div>

						<div class="form-group">
							<label for="name" class="form-label"
								>Vollständiger Name <span class="required">*</span></label
							>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={name}
								placeholder="Dein Name"
								required
								aria-required="true"
								class="form-input"
								autocomplete="name"
							/>
						</div>

						<div class="form-row">
							<div class="form-group form-group-half">
								<label for="age" class="form-label">Alter <span class="required">*</span></label>
								<input
									type="number"
									id="age"
									name="age"
									bind:value={age}
									min="16"
									max="120"
									placeholder="Jahre"
									required
									aria-required="true"
									class="form-input"
									autocomplete="bday-year"
								/>
							</div>

							<div class="form-group form-group-half">
								<label for="goal" class="form-label"
									>Dein Laufziel <span class="required">*</span></label
								>
								<select
									id="goal"
									name="goal"
									bind:value={goal}
									required
									aria-required="true"
									class="form-select"
								>
									<option value="">Bitte wählen...</option>
									<option value="5k">5K Laufplan</option>
									<option value="10k">10K Laufplan</option>
									<option value="21k">Halbmarathon Training</option>
									<option value="42k">Marathon Vorbereitung</option>
									<option value="trail">Trail Running Plan</option>
									<option value="fitness">Fitness & Ausdauer verbessern</option>
								</select>
							</div>
						</div>
					</fieldset>

					<!-- Lauferfahrung Sektion -->
					<fieldset class="form-section">
						<legend class="section-title text-primary font-medium text-xl mb-4">
							Lauferfahrung & aktuelle Trainingsgewohnheiten
						</legend>

						<div class="form-group">
							<label for="experience" class="form-label"
								>Deine Lauferfahrung <span class="required">*</span></label
							>
							<select
								id="experience"
								name="experience"
								bind:value={experience}
								required
								aria-required="true"
								class="form-select"
							>
								<option value="">Bitte wählen...</option>
								<option value="beginner">Anfänger (0-12 Monate Lauferfahrung)</option>
								<option value="intermediate">Fortgeschritten (1-3 Jahre Lauferfahrung)</option>
								<option value="advanced">Erfahren (mehr als 3 Jahre Lauferfahrung)</option>
							</select>
						</div>

						<div class="form-row">
							<div class="form-group form-group-half">
								<label for="weeklyKm" class="form-label">
									Wöchentlicher Laufumfang <span class="required">*</span>
								</label>
								<input
									type="number"
									id="weeklyKm"
									name="weeklyKm"
									bind:value={weeklyKm}
									min="0"
									max="300"
									placeholder="km pro Woche"
									required
									aria-required="true"
									class="form-input"
								/>
							</div>

							<div class="form-group form-group-half">
								<label for="trainingDays" class="form-label">
									Verfügbare Trainingstage <span class="required">*</span>
								</label>
								<select
									id="trainingDays"
									name="trainingDays"
									bind:value={trainingDays}
									required
									aria-required="true"
									class="form-select"
								>
									<option value="2">2 Tage pro Woche</option>
									<option value="3">3 Tage pro Woche</option>
									<option value="4">4 Tage pro Woche</option>
									<option value="5">5 Tage pro Woche</option>
									<option value="6">6 Tage pro Woche</option>
									<option value="7">7 Tage pro Woche</option>
								</select>
							</div>
						</div>
					</fieldset>

					<!-- Gesundheitssektion -->
					<fieldset class="form-section">
						<legend class="section-title text-primary font-medium text-xl mb-4">
							Gesundheitsprofil für optimales Lauftraining
						</legend>

						<div class="form-row">
							<div class="form-group form-group-half">
								<label for="height" class="form-label">Körpergröße (cm)</label>
								<input
									type="number"
									id="height"
									name="height"
									bind:value={height}
									min="120"
									max="220"
									placeholder="z.B. 175"
									class="form-input"
								/>
							</div>

							<div class="form-group form-group-half">
								<label for="weight" class="form-label">Gewicht (kg)</label>
								<input
									type="number"
									id="weight"
									name="weight"
									bind:value={weight}
									min="30"
									max="200"
									placeholder="z.B. 70"
									class="form-input"
								/>
							</div>
						</div>

						<div class="form-group">
							<label class="checkbox-label">
								<input type="checkbox" name="injuries" bind:checked={injuries} />
								<span>Verletzungshistorie: Ich hatte in den letzten 6 Monaten Laufverletzungen</span
								>
							</label>
						</div>

						{#if injuries}
							<div class="form-group">
								<label for="injuryDetails" class="form-label"
									>Verletzungsdetails für angepassten Trainingsplan</label
								>
								<textarea
									id="injuryDetails"
									name="injuryDetails"
									bind:value={injuryDetails}
									placeholder="Beschreibe deine Verletzungen (Art, Dauer, aktuelle Beschwerden)"
									rows="3"
									class="form-textarea"
									aria-describedby="injury-help"
								></textarea>
								<p id="injury-help" class="input-help-text">
									Diese Information hilft uns, deinen Plan verletzungspräventiv zu gestalten
								</p>
							</div>
						{/if}

						<div class="form-group">
							<label for="preferredTime" class="form-label">Bevorzugte Trainingszeit</label>
							<select
								id="preferredTime"
								name="preferredTime"
								bind:value={preferredTime}
								class="form-select"
							>
								<option value="">Bitte wählen (optional)</option>
								<option value="morning">Morgens (5-9 Uhr)</option>
								<option value="midday">Mittags (10-14 Uhr)</option>
								<option value="afternoon">Nachmittags (15-18 Uhr)</option>
								<option value="evening">Abends (19-22 Uhr)</option>
								<option value="flexible">Flexibel</option>
							</select>
						</div>
					</fieldset>

					<!-- Leistungsdaten -->
					<fieldset class="form-section">
						<legend class="section-title text-primary font-medium text-xl mb-4">
							Lauf-Bestzeiten für optimierte Trainingspläne
						</legend>

						<div class="form-row">
							<div class="form-group form-group-half">
								<label for="lastRaceDistance" class="form-label">Letzte Wettkampfdistanz</label>
								<select
									id="lastRaceDistance"
									name="lastRaceDistance"
									bind:value={lastRaceDistance}
									class="form-select"
								>
									<option value="">Bitte wählen (optional)</option>
									<option value="5k">5K Lauf</option>
									<option value="10k">10K Wettkampf</option>
									<option value="21k">Halbmarathon</option>
									<option value="42k">Marathon</option>
								</select>
							</div>

							<div class="form-group form-group-half">
								<label for="lastRaceTime" class="form-label">Erzielte Zeit (hh:mm:ss)</label>
								<input
									type="text"
									id="lastRaceTime"
									name="lastRaceTime"
									bind:value={lastRaceTime}
									placeholder="z.B. 00:45:30"
									pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
									title="Format: hh:mm:ss"
									class="form-input"
								/>
							</div>
						</div>
					</fieldset>

					<div class="data-notice" aria-labelledby="data-info" role="region">
						<h4 id="data-info" class="text-lg font-medium mb-2">
							Warum diese Daten für deinen Laufplan wichtig sind
						</h4>
						<p>
							Mit diesen Informationen erstellen wir einen wissenschaftlich fundierten,
							individuellen Laufplan, der perfekt zu deinen aktuellen Fähigkeiten, Trainingszielen
							und körperlichen Voraussetzungen passt. Alle mit <span class="required">*</span> markierten
							Felder sind für einen optimalen Trainingsplan erforderlich.
						</p>
					</div>

					<div class="form-submit">
						<button type="submit" class="btn-primary w-full" aria-label="Laufplan anfordern">
							DEINEN LAUFPLAN ANFORDERN
						</button>
					</div>

					<p class="privacy-note">
						Deine persönlichen Daten werden gemäß DSGVO sicher verarbeitet und ausschließlich zur
						Erstellung deines individuellen Laufplans verwendet. Mehr dazu in unserer
						<a href="/datenschutz" rel="noopener">Datenschutzerklärung</a>.
					</p>
				</form>
			{/if}
		</article>
	</div>
</section>

<style>
	.signup-section {
		padding: 5rem 0;
		background-color: var(--dark-gray);
	}

	.signup-card {
		max-width: 48rem;
		margin: 0 auto;
		background-color: var(--dark);
		border-radius: 0.5rem;
		padding: 2rem;
		box-shadow: 0 0 15px rgba(0, 242, 254, 0.3);
	}

	.signup-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.signup-title {
		font-size: 1.875rem;
		font-weight: bold;
		margin-bottom: 1rem;
	}

	.signup-description {
		color: #d0d0d0;
	}

	.signup-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-section {
		border: none;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0 0 1.5rem 0;
		margin: 0;
	}

	.section-title {
		font-size: 1.25rem;
		font-weight: 500;
		margin-bottom: 1rem;
		color: var(--primary);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}

	.form-row {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.form-group-half {
		flex: 1 1 calc(50% - 0.5rem);
		min-width: 200px;
	}

	.form-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #d0d0d0;
		margin-bottom: 0.25rem;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: auto;
		margin-right: 0.5rem;
	}

	.form-input,
	.form-select,
	.form-textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: var(--medium-gray);
		border: 1px solid #333;
		border-radius: 0.5rem;
		color: white;
		font-size: 1rem;
	}

	.form-input:focus,
	.form-select:focus,
	.form-textarea:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.2);
	}

	.input-help-text {
		font-size: 0.75rem;
		color: #aaa;
		margin-top: 0.25rem;
	}

	.required {
		color: var(--primary);
		margin-left: 0.125rem;
	}

	.data-notice {
		background-color: rgba(0, 242, 254, 0.1);
		padding: 1.25rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.data-notice p {
		font-size: 0.875rem;
		color: #d0d0d0;
		margin: 0;
		line-height: 1.5;
	}

	.form-submit {
		margin-top: 1rem;
	}

	.form-submit .btn-primary {
		width: 100%;
		padding: 0.75rem;
		font-size: 1rem;
		font-weight: 600;
		text-align: center;
		cursor: pointer;
		border: none;
	}

	.privacy-note {
		font-size: 0.75rem;
		color: #777;
		text-align: center;
		margin-top: 1rem;
	}

	.privacy-note a {
		color: var(--primary);
		text-decoration: none;
	}

	.privacy-note a:hover {
		text-decoration: underline;
	}

	.success-message {
		text-align: center;
		padding: 2rem;
		background-color: rgba(0, 242, 254, 0.1);
		border: 1px solid var(--primary);
		border-radius: 0.5rem;
		color: var(--primary);
	}
</style>
