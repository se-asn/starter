<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let agreeTerms = false;
	let isLoading = false;
	let error = '';

	async function handleSubmit() {
		error = '';
		
		// Grundlegende Validierung
		if (!name || !email || !password || !confirmPassword) {
			error = 'Bitte fülle alle Felder aus.';
			return;
		}
		
		if (password !== confirmPassword) {
			error = 'Die Passwörter stimmen nicht überein.';
			return;
		}
		
		if (!agreeTerms) {
			error = 'Bitte stimme den Nutzungsbedingungen zu.';
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			const data = await response.json();

			if (data.success) {
				authStore.login(data.user);
				goto('/member/dashboard');
			} else {
				error = data.message || 'Registrierung fehlgeschlagen';
			}
		} catch (err) {
			error = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="signup-page">
	<h1>Registrieren</h1>
	<p class="subtitle">Erstelle deinen Account für personalisierte Trainingspläne</p>

	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="auth-form">
		<div class="form-group">
			<label for="name">Name</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				required
				placeholder="Dein vollständiger Name"
				disabled={isLoading}
			/>
		</div>

		<div class="form-group">
			<label for="email">E-Mail</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				placeholder="deine.email@beispiel.de"
				disabled={isLoading}
			/>
		</div>

		<div class="form-group">
			<label for="password">Passwort</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				minlength="8"
				placeholder="Mindestens 8 Zeichen"
				disabled={isLoading}
			/>
		</div>

		<div class="form-group">
			<label for="confirm-password">Passwort bestätigen</label>
			<input
				type="password"
				id="confirm-password"
				bind:value={confirmPassword}
				required
				minlength="8"
				placeholder="Passwort wiederholen"
				disabled={isLoading}
			/>
		</div>

		<div class="form-group checkbox-group">
			<input type="checkbox" id="terms" bind:checked={agreeTerms} disabled={isLoading} />
			<label for="terms">
				Ich stimme den <a href="/terms" target="_blank">Nutzungsbedingungen</a> und der
				<a href="/privacy" target="_blank">Datenschutzerklärung</a> zu
			</label>
		</div>

		<button type="submit" class="btn btn-primary btn-block" disabled={isLoading}>
			{#if isLoading}
				<span class="spinner"></span>
				Registrierung...
			{:else}
				Konto erstellen
			{/if}
		</button>
	</form>

	<div class="auth-links">
		<p>Bereits registriert? <a href="/login">Anmelden</a></p>
	</div>
</div>

<style>
	.signup-page {
		max-width: 480px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
		text-align: center;
		color: var(--primary);
	}

	.subtitle {
		text-align: center;
		margin-bottom: 2rem;
		color: var(--text-light);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.checkbox-group {
		flex-direction: row;
		align-items: center;
		gap: 0.75rem;
	}

	.checkbox-group label {
		font-size: 0.9rem;
	}

	.checkbox-group a {
		color: var(--primary);
		text-decoration: underline;
	}

	label {
		font-weight: 500;
		color: var(--text);
	}

	input {
		padding: 0.75rem;
		border-radius: 4px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background-color: rgba(0, 0, 0, 0.2);
		color: var(--text);
	}

	input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.25);
	}

	.btn-block {
		width: 100%;
	}

	.error-message {
		background-color: rgba(255, 0, 0, 0.1);
		border: 1px solid rgba(255, 0, 0, 0.3);
		color: #ff6b6b;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.auth-links {
		margin-top: 2rem;
		text-align: center;
		font-size: 0.9rem;
	}

	.auth-links a {
		color: var(--primary);
		text-decoration: underline;
	}

	.spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		margin-right: 0.5rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
