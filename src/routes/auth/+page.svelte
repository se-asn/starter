<!-- Neural Authentication Interface -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let isLogin = true;
	let email = '';
	let password = '';
	let name = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let success = '';
	let mounted = false;
	let scanningEffect = false;

	onMount(() => {
		mounted = true;
		// Check if user is already authenticated
		const token = localStorage.getItem('authToken');
		if (token) {
			goto('/dashboard');
		}
	});

	async function handleSubmit() {
		error = '';
		success = '';
		scanningEffect = true;

		if (!email || !password) {
			error = 'Neural authentication requires email and password';
			scanningEffect = false;
			return;
		}

		if (!isLogin) {
			if (!name) {
				error = 'Identity verification requires full name';
				scanningEffect = false;
				return;
			}
			if (password !== confirmPassword) {
				error = 'Neural pattern mismatch detected';
				scanningEffect = false;
				return;
			}
		}

		loading = true;
		try {
			const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
			const body = isLogin ? { email, password } : { email, password, name };

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});

			if (!response.ok) {
				let errorMessage = 'Neural authentication failed';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					errorMessage = `System error ${response.status}: ${response.statusText}`;
				}
				throw new Error(errorMessage);
			}

			const data = await response.json();

			// Store token and user info
			localStorage.setItem('authToken', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));

			success = data.message || (isLogin ? 'Neural link established' : 'Identity verified and registered');
			setTimeout(() => {
				goto('/dashboard');
			}, 1500);
		} catch (err) {
			console.error('Neural auth error:', err);
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Neural network connectivity issues detected.';
			}
		} finally {
			loading = false;
			scanningEffect = false;
		}
	}

	function toggleMode() {
		isLogin = !isLogin;
		error = '';
		success = '';
		password = '';
		confirmPassword = '';
	}
</script>

<svelte:head>
	<title>Neural Authentication - LaufplanerPro</title>
	<meta name="description" content="Secure neural authentication interface for elite training access" />
</svelte:head>

<div class="neural-auth-container" class:mounted>
	<div class="neural-grid">
		{#each Array(50) as _, i}
			<div class="grid-cell" style="--delay: {i * 0.02}s"></div>
		{/each}
	</div>

	<div class="auth-interface">
		<div class="neural-auth-card" class:scanning={scanningEffect}>
			<div class="auth-header">
				<div class="neural-logo">
					<div class="logo-pulse"></div>
					<span class="logo-text">LaufplanerPro</span>
				</div>
				<h2 class="auth-title">Neural Authentication</h2>
				<p class="auth-subtitle">
					{isLogin ? 'Establish neural link' : 'Register biometric profile'}
				</p>
			</div>

			<div class="mode-selector">
				<button 
					class="mode-btn" 
					class:active={isLogin}
					on:click={() => { isLogin = true; toggleMode(); }}
				>
					Access
				</button>
				<button 
					class="mode-btn" 
					class:active={!isLogin}
					on:click={() => { isLogin = false; toggleMode(); }}
				>
					Register
				</button>
				<div class="mode-indicator" class:register-mode={!isLogin}></div>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="neural-form">
				{#if !isLogin}
					<div class="form-field">
						<label for="name" class="field-label">Identity Vector</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="Full designation"
							class="neural-input"
							required={!isLogin}
						/>
						<div class="input-glow"></div>
					</div>
				{/if}

				<div class="form-field">
					<label for="email" class="field-label">Neural ID</label>
					<input 
						id="email" 
						type="email" 
						bind:value={email} 
						placeholder="neural.address@domain.com" 
						class="neural-input"
						required 
					/>
					<div class="input-glow"></div>
				</div>

				<div class="form-field">
					<label for="password" class="field-label">Access Key</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						placeholder="••••••••••••"
						class="neural-input"
						required
					/>
					<div class="input-glow"></div>
				</div>

				{#if !isLogin}
					<div class="form-field">
						<label for="confirmPassword" class="field-label">Verify Access Key</label>
						<input
							id="confirmPassword"
							type="password"
							bind:value={confirmPassword}
							placeholder="••••••••••••"
							class="neural-input"
							required={!isLogin}
						/>
						<div class="input-glow"></div>
					</div>
				{/if}

				{#if error}
					<div class="error-message" role="alert">
						<span class="error-icon">⚠</span>
						{error}
					</div>
				{/if}

				{#if success}
					<div class="success-message" role="status">
						<span class="success-icon">✓</span>
						{success}
					</div>
				{/if}

				<button 
					type="submit" 
					class="neural-submit-btn" 
					disabled={loading}
					class:loading
				>
					{#if loading}
						<div class="loading-spinner"></div>
						<span>Processing...</span>
					{:else}
						<span>{isLogin ? 'Initialize Link' : 'Register Profile'}</span>
						<div class="btn-arrow">→</div>
					{/if}
					<div class="btn-glow-effect"></div>
				</button>
			</form>

			<div class="auth-footer">
				<div class="neural-status">
					<div class="status-indicator"></div>
					<span class="status-text">Neural Network: Online</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.neural-auth-container {
		min-height: 100vh;
		background: var(--neural-black);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-lg);
		position: relative;
		overflow: hidden;
		opacity: 0;
		transition: opacity 1s ease-out;
	}

	.neural-auth-container.mounted {
		opacity: 1;
	}

	.neural-grid {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(10, 1fr);
		grid-template-rows: repeat(5, 1fr);
		opacity: 0.1;
	}

	.grid-cell {
		border: 1px solid var(--neural-border);
		animation: grid-pulse 3s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	@keyframes grid-pulse {
		0%, 100% { opacity: 0.1; }
		50% { opacity: 0.3; border-color: var(--neural-accent); }
	}

	.auth-interface {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 420px;
	}

	.neural-auth-card {
		background: var(--neural-surface);
		border: 1px solid var(--neural-border);
		border-radius: var(--radius-xl);
		padding: var(--space-3xl);
		backdrop-filter: blur(20px);
		box-shadow: var(--shadow-neural);
		position: relative;
		overflow: hidden;
		transition: var(--transition-smooth);
	}

	.neural-auth-card.scanning::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent 0%, var(--neural-accent-glow) 50%, transparent 100%);
		animation: scan-effect 2s ease-in-out;
	}

	@keyframes scan-effect {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.auth-header {
		text-align: center;
		margin-bottom: var(--space-3xl);
	}

	.neural-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	.logo-pulse {
		width: 16px;
		height: 16px;
		background: var(--neural-accent);
		border-radius: var(--radius-full);
		animation: logo-pulse 2s ease-in-out infinite;
		box-shadow: 0 0 20px var(--neural-accent-glow);
	}

	@keyframes logo-pulse {
		0%, 100% { opacity: 0.6; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.2); }
	}

	.logo-text {
		font-family: var(--font-mono);
		font-weight: 700;
		font-size: 1.25rem;
		color: var(--neural-bright);
		letter-spacing: -0.02em;
	}

	.auth-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--neural-bright);
		margin-bottom: var(--space-sm);
		letter-spacing: -0.02em;
	}

	.auth-subtitle {
		color: var(--neural-text);
		font-size: 0.95rem;
		margin: 0;
	}

	.mode-selector {
		display: flex;
		background: var(--neural-muted);
		border-radius: var(--radius-md);
		padding: 4px;
		margin-bottom: var(--space-3xl);
		position: relative;
	}

	.mode-btn {
		flex: 1;
		padding: var(--space-sm) var(--space-lg);
		background: transparent;
		border: none;
		color: var(--neural-text);
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: var(--transition-fast);
		position: relative;
		z-index: 2;
	}

	.mode-btn.active {
		color: var(--neural-bright);
	}

	.mode-indicator {
		position: absolute;
		top: 4px;
		left: 4px;
		bottom: 4px;
		width: calc(50% - 4px);
		background: var(--neural-accent);
		border-radius: var(--radius-sm);
		transition: var(--transition-smooth);
		box-shadow: 0 0 20px var(--neural-accent-glow);
	}

	.mode-indicator.register-mode {
		transform: translateX(100%);
	}

	.neural-form {
		space-y: var(--space-lg);
	}

	.form-field {
		margin-bottom: var(--space-lg);
		position: relative;
	}

	.field-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--neural-text);
		margin-bottom: var(--space-sm);
		font-family: var(--font-mono);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.neural-input {
		width: 100%;
		padding: var(--space-md);
		background: var(--neural-muted);
		border: 1px solid var(--neural-border);
		border-radius: var(--radius-md);
		color: var(--neural-bright);
		font-size: 0.95rem;
		transition: var(--transition-fast);
		outline: none;
		font-family: var(--font-primary);
	}

	.neural-input:focus {
		border-color: var(--neural-accent);
		box-shadow: 0 0 0 3px var(--neural-accent-glow);
	}

	.neural-input::placeholder {
		color: var(--neural-subtle);
	}

	.input-glow {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-md);
		background: var(--neural-accent);
		opacity: 0;
		filter: blur(20px);
		transition: var(--transition-fast);
		pointer-events: none;
	}

	.neural-input:focus + .input-glow {
		opacity: 0.1;
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.2);
		color: var(--neural-error);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		margin-bottom: var(--space-lg);
	}

	.error-icon {
		font-size: 1rem;
	}

	.success-message {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		background: rgba(16, 185, 129, 0.1);
		border: 1px solid rgba(16, 185, 129, 0.2);
		color: var(--neural-success);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		font-size: 0.875rem;
		margin-bottom: var(--space-lg);
	}

	.success-icon {
		font-size: 1rem;
	}

	.neural-submit-btn {
		width: 100%;
		padding: var(--space-md) var(--space-lg);
		background: var(--neural-accent);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
		transition: var(--transition-smooth);
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
		margin-top: var(--space-xl);
	}

	.neural-submit-btn:hover:not(:disabled) {
		background: #2563eb;
		transform: translateY(-1px);
		box-shadow: var(--shadow-glow);
	}

	.neural-submit-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.neural-submit-btn.loading {
		color: transparent;
	}

	.loading-spinner {
		width: 20px;
		height: 20px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-top: 2px solid white;
		border-radius: var(--radius-full);
		animation: spin 1s linear infinite;
		position: absolute;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.btn-arrow {
		font-size: 1.2rem;
		transition: var(--transition-fast);
	}

	.neural-submit-btn:hover .btn-arrow {
		transform: translateX(4px);
	}

	.btn-glow-effect {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
		opacity: 0;
		transition: var(--transition-smooth);
	}

	.neural-submit-btn:hover .btn-glow-effect {
		opacity: 1;
	}

	.auth-footer {
		margin-top: var(--space-3xl);
		text-align: center;
	}

	.neural-status {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-sm);
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		background: var(--neural-success);
		border-radius: var(--radius-full);
		animation: status-blink 2s ease-in-out infinite;
	}

	@keyframes status-blink {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	.status-text {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--neural-text);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* Mobile Optimizations */
	@media (max-width: 480px) {
		.neural-auth-container {
			padding: var(--space-md);
		}

		.neural-auth-card {
			padding: var(--space-xl);
		}

		.auth-title {
			font-size: 1.5rem;
		}

		.grid-cell {
			opacity: 0.05;
		}
	}
</style>