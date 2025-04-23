<!-- src/lib/components/Signup.svelte -->
<script>
	let email = '';
	let name = '';
	let goal = '';
	let submitted = false;

	function handleSubmit() {
		// Hier würdest du später die Daten an deinen Server senden
		// Für jetzt simulieren wir eine erfolgreiche Anmeldung
		submitted = true;

		// Formular zurücksetzen
		email = '';
		name = '';
		goal = '';

		// Nach 5 Sekunden die Erfolgsmeldung ausblenden
		setTimeout(() => {
			submitted = false;
		}, 5000);
	}
</script>

<section id="signup" class="signup">
	<div class="container">
		<div class="signup-card">
			<div class="signup-header">
				<h2 class="signup-title">HOL DIR JETZT DEN ZUGANG</h2>
				<p class="signup-description">
					Trag dich ein und erfahre als Erste:r, wenn die Pläne live gehen. Mit Bonus-Tipps, PDFs &
					Trainingsmotivation direkt in dein Postfach!
				</p>
			</div>

			{#if submitted}
				<div class="success-message">
					<p>Vielen Dank! Du wirst informiert, sobald unsere Laufpläne verfügbar sind.</p>
				</div>
			{:else}
				<form on:submit|preventDefault={handleSubmit} class="signup-form">
					<div class="form-group">
						<label for="email">E-Mail</label>
						<input
							type="email"
							id="email"
							bind:value={email}
							placeholder="deine@email.de"
							required
						/>
					</div>

					<div class="form-group">
						<label for="name">Name (optional)</label>
						<input type="text" id="name" bind:value={name} placeholder="Dein Name" />
					</div>

					<div class="form-group">
						<label for="goal">Dein Laufziel (optional)</label>
						<select id="goal" bind:value={goal}>
							<option value="">Bitte wählen...</option>
							<option value="5k">5K</option>
							<option value="10k">10K</option>
							<option value="21k">Halbmarathon</option>
							<option value="42k">Marathon</option>
						</select>
					</div>

					<div class="form-submit">
						<button type="submit" class="btn-primary"> JETZT VORMERKEN </button>
					</div>

					<p class="privacy-note">
						Deine Daten werden sicher behandelt und nur für die Benachrichtigung über den Start
						unserer Laufpläne verwendet.
					</p>
				</form>
			{/if}
		</div>
	</div>
</section>

<style>
	.signup {
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
		gap: 1rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #d0d0d0;
		margin-bottom: 0.25rem;
	}

	.form-group input,
	.form-group select {
		width: 100%;
		padding: 0.75rem 1rem;
		background-color: var(--medium-gray);
		border: 1px solid #333;
		border-radius: 0.5rem;
		color: white;
		font-size: 1rem;
	}

	.form-group input:focus,
	.form-group select:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.2);
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

	.success-message {
		text-align: center;
		padding: 2rem;
		background-color: rgba(0, 242, 254, 0.1);
		border: 1px solid var(--primary);
		border-radius: 0.5rem;
		color: var(--primary);
	}
</style>
