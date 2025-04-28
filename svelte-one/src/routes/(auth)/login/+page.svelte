<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';

	let email = '';
	let password = '';
	let rememberMe = false;
	let isLoading = false;
	let error = '';

	// Redirect-URL aus Query-Parameter abrufen
	const redirectTo = $page.url.searchParams.get('redirect') || '/member/dashboard';

	async function handleSubmit() {
		error = '';
		isLoading = true;

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password, rememberMe })
			});

			const data = await response.json();

			if (data.success) {
				authStore.login(data.user);
				goto(redirectTo);
			} else {
				error = data.message || 'Anmeldung fehlgeschlagen';
			}
		} catch (err) {
			error = 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="login-page">
	<h1>Anmelden</h1>
	<p class="subtitle">Zugang zu deinem personalisierten Trainingsplan</p>

	{#if error}
		<div class="error-message">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="email">E-Mail</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				autocomplete="email"
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
				autocomplete="current-password"
				disabled={isLoading}
			/>
		</div>

		<div class="form-options">
			<label class="remember-me">
				<input type="checkbox" bind:checked={rememberMe} disabled={isLoading} />
				<span>Angemeldet bleiben</span>
			</label>
			<a href="/password-reset" class="forgot-password">Passwort vergessen?</a>
		</div>

		<button type="submit" class="btn-primary w-full" disabled={isLoading}>
			{#if isLoading}
				<span class="loading-spinner"></span>
				<span>Anmeldung...</span>
			{:else}
				<span>Anmelden</span>
			{/if}
		</button>
	</form>

	<div class="auth-footer">
		<p>Noch kein Konto? <a href="/signup">Jetzt registrieren</a></p>
	</div>

	<!-- Demo-Hinweis (nur für Entwicklung) -->
	<div class="demo-hint">
		<p>Demo-Zugangsdaten:</p>
		<p>E-Mail: <strong>demo@example.com</strong></p>
		<p>Passwort: <strong>demo123</strong></p>
	</div>
</div>

<style>
	.login-page {
		color: var(--text-light);
	}

	h1 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: var(--text-light);
		font-size: 2rem;
		text-align: center;
	}

	.subtitle {
		text-align: center;
		color: var(--text-gray);
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--text-light);
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		background-color: var(--dark);
		border: 1px solid var(--light-gray);
		border-radius: 4px;
		color: var(--text-light);
		font-size: 1rem;
		box-sizing: border-box;
	}

	.form-group input:focus {
		border-color: var(--primary);
		outline: none;
		box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.25);
	}

	.form-options {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.remember-me {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.remember-me input {
		margin-right: 0.5rem;
	}

	.forgot-password {
		color: var(--primary);
		text-decoration: none;
	}

	.forgot-password:hover {
		text-decoration: underline;
	}

	.btn-primary {
		width: 100%;
		padding: 0.75rem;
		background-color: var(--primary);
		color: var(--dark);
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.btn-primary:hover {
		background-color: rgba(0, 242, 254, 0.8);
	}

	.btn-primary:disabled {
		background-color: rgba(0, 242, 254, 0.5);
		cursor: not-allowed;
	}

	.auth-footer {
		text-align: center;
		margin-top: 2rem;
		color: var(--text-gray);
	}

	.auth-footer a {
		color: var(--primary);
		text-decoration: none;
	}

	.auth-footer a:hover {
		text-decoration: underline;
	}

	.error-message {
		background-color: rgba(255, 0, 0, 0.1);
		border-left: 3px solid #ff3333;
		color: #ff6666;
		padding: 0.75rem;
		margin-bottom: 1.5rem;
	}

	.loading-spinner {
		width: 1.2rem;
		height: 1.2rem;
		border: 2px solid rgba(0, 0, 0, 0.3);
		border-top: 2px solid var(--dark);
		border-radius: 50%;
		margin-right: 0.5rem;
		animation: spin 1s linear infinite;
	}

	.demo-hint {
		margin-top: 2rem;
		padding: 1rem;
		background-color: rgba(0, 242, 254, 0.1);
		border-radius: 4px;
		font-size: 0.9rem;
		color: var(--text-light);
		text-align: center;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.w-full {
		width: 100%;
	}
</style>
