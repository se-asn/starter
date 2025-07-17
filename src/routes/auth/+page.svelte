<!-- Smart Triathlete Neural Authentication -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabase';

	let isLogin = true;
	let email = '';
	let password = '';
	let confirmPassword = '';
	let name = '';
	let loading = false;
	let error = '';
	let success = '';
	let mounted = false;

	onMount(() => {
		mounted = true;

		// Check URL parameters for demo mode
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get('mode') === 'demo') {
			email = 'demo@laufplanerpro.de';
			password = 'Demo123!';
		}

		// Redirect if already authenticated (browser only)
		if (typeof window !== 'undefined') {
			supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
				if (user) {
					goto('/dashboard');
				}
			});
		}
	});

	function toggleMode() {
		isLogin = !isLogin;
		error = '';
		success = '';
	}

	function fillDemoCredentials() {
		email = 'demo@laufplanerpro.de';
		password = 'Demo123!';
		error = '';
		success = 'Demo credentials loaded! Click "Neural Login" to proceed.';
	}

	async function handleDemoLogin() {
		loading = true;
		error = '';
		success = '';

		try {
			// For demo purposes, create a mock session
			const demoUser = {
				id: 'demo-user-123',
				email: 'demo@laufplanerpro.de',
				user_metadata: { name: 'Demo User' },
				created_at: new Date().toISOString()
			};

			const demoSession = {
				access_token: 'demo-token-123',
				user: demoUser
			};

			// Store demo session
			localStorage.setItem('authToken', demoSession.access_token);
			localStorage.setItem('user', JSON.stringify(demoUser));
			localStorage.setItem('demoMode', 'true');

			success = 'Demo session established! Accessing dashboard...';

			setTimeout(() => {
				goto('/dashboard');
			}, 1500);
		} catch (error) {
			console.error('Demo login error:', error);
			error = 'Demo login failed. Please try again.';
		} finally {
			loading = false;
		}
	}

	async function handleSubmit() {
		if (loading) return;

		loading = true;
		error = '';
		success = '';
		try {
			if (isLogin) {
				console.log('🔐 Attempting login with:', email);

				let data: any;
				let authError: any;

				// Special handling for demo user
				if (email === 'demo@laufplanerpro.de' && password === 'Demo123!') {
					console.log('🔐 Demo login detected, ensuring demo user exists...');

					// First try to sign in
					const loginResult = await supabase.auth.signInWithPassword({
						email,
						password
					});
					data = loginResult.data;
					authError = loginResult.error;

					// If login fails, try to create the demo user
					if (authError && authError.message.includes('Invalid login credentials')) {
						console.log('🔐 Demo user not found, creating...');
						const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
							email,
							password,
							options: {
								data: { name: 'Demo User' }
							}
						});

						if (signUpData.user && !signUpError) {
							console.log('🔐 Demo user created, attempting login...');
							// Try to sign in again
							const secondLoginResult = await supabase.auth.signInWithPassword({
								email,
								password
							});
							data = secondLoginResult.data;
							authError = secondLoginResult.error;
						} else {
							error = signUpError?.message || 'Failed to create demo user';
							loading = false;
							return;
						}
					}

					console.log('🔐 Demo login result:', { data, error: authError });
				} else {
					// Regular login for non-demo users
					const loginResult = await supabase.auth.signInWithPassword({
						email,
						password
					});
					data = loginResult.data;
					authError = loginResult.error;
				}

				if (data.user && !authError) {
					// Store user session data
					if (data.session?.access_token) {
						localStorage.setItem('authToken', data.session.access_token);
						console.log('🔐 Token stored:', data.session.access_token);
					}
					if (data.user) {
						localStorage.setItem('user', JSON.stringify(data.user));
						console.log('🔐 User stored:', data.user);
					}
					success = 'Neural connection established! Accessing dashboard...';
					console.log('🔐 Redirecting to dashboard in 1500ms...');
					setTimeout(() => {
						console.log('🔐 Executing redirect to /dashboard');
						goto('/dashboard');
					}, 1500);
				} else {
					error = authError?.message || 'Authentication failed. Please verify your credentials.';
				}
			} else {
				if (password !== confirmPassword) {
					error = 'Password confirmation does not match.';
					loading = false;
					return;
				}
				const { data, error: regError } = await supabase.auth.signUp({
					email,
					password,
					options: {
						data: { name: name || 'Neural Athlete' }
					}
				});
				if (data.user && !regError) {
					// Store token and user data
					if (data.session?.access_token) {
						localStorage.setItem('authToken', data.session.access_token);
					}
					if (data.user) {
						localStorage.setItem('user', JSON.stringify(data.user));
					}
					success = 'Account created successfully! Neural profile initialized.';
					setTimeout(() => {
						goto('/dashboard');
					}, 2000);
				} else {
					error = regError?.message || 'Registration failed. Please try again.';
				}
			}
		} catch (err) {
			error = 'Network error. Please check your connection and try again.';
		}

		loading = false;
	}
</script>

<svelte:head>
	<title>Smart Triathlete - Neural Authentication</title>
	<meta name="description" content="Access your neural triathlon training system" />
</svelte:head>

<div class="auth-container">
	<!-- Neural Background Pattern -->
	<div class="neural-bg"></div>

	<!-- Header -->
	<header class="auth-header">
		<div class="logo">
			<div class="icon-neural"></div>
			<span class="logo-text">Smart Triathlete</span>
		</div>
		<p class="subtitle">Neural Training System</p>
	</header>

	<!-- Main Auth Card -->
	<main class="auth-main">
		<div class="auth-card">
			<div class="auth-form-header">
				<h1>{isLogin ? 'Neural Access' : 'Initialize Profile'}</h1>
				<p class="form-subtitle">
					{isLogin
						? 'Connect to your training neural network'
						: 'Create your quantum athlete profile'}
				</p>
			</div>

			{#if error}
				<div class="alert error">
					<div class="icon-error"></div>
					<span>{error}</span>
				</div>
			{/if}

			{#if success}
				<div class="alert success">
					<div class="icon-check"></div>
					<span>{success}</span>
				</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit} class="auth-form">
				<div class="form-group">
					<label for="email">Neural ID (Email)</label>
					<input
						type="email"
						id="email"
						bind:value={email}
						placeholder="athlete@neural.training"
						required
						disabled={loading}
					/>
				</div>

				<div class="form-group">
					<label for="password">Quantum Key (Password)</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						placeholder="Enter your quantum key"
						required
						disabled={loading}
					/>
				</div>
				{#if !isLogin}
					<div class="form-group">
						<label for="name">Neural Identity (Name)</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							placeholder="Enter your neural identity"
							required
							disabled={loading}
						/>
					</div>
					<div class="form-group">
						<label for="confirmPassword">Confirm Quantum Key</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPassword}
							placeholder="Confirm your quantum key"
							required
							disabled={loading}
						/>
					</div>
				{/if}

				<button type="submit" class="auth-submit" disabled={loading}>
					{#if loading}
						<div class="icon-sync loading"></div>
						{isLogin ? 'Connecting...' : 'Initializing...'}
					{:else}
						{isLogin ? 'Establish Connection' : 'Initialize Profile'}
					{/if}
				</button>
			</form>

			<div class="auth-actions">
				<button type="button" class="toggle-mode" on:click={toggleMode}>
					{isLogin ? 'Need to create a profile?' : 'Already have a profile?'}
					<span class="toggle-text">
						{isLogin ? 'Initialize new account' : 'Access existing account'}
					</span>
				</button>

				{#if isLogin}
					<button type="button" class="demo-access" on:click={handleDemoLogin}>
						<div class="icon-quantum"></div>
						Demo Neural Access
					</button>
				{/if}
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="auth-footer">
		<p>© 2025 Smart Triathlete - Neural Training System</p>
		<div class="footer-links">
			<a href="/">Home</a>
			<span>•</span>
			<span class="disabled">About</span>
			<span>•</span>
			<span class="disabled">Privacy</span>
		</div>
	</footer>
</div>

<style>
	/* Neural/Quantum Authentication Design */
	* {
		box-sizing: border-box;
	}

	.auth-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--neural-bg);
		color: var(--neural-text);
		font-family: var(--font-neural);
		position: relative;
		overflow: hidden;
		font-weight: 300;
	}

	/* Neural Background */
	.neural-bg {
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.15) 0%, transparent 60%),
			radial-gradient(circle at 75% 75%, rgba(255, 107, 53, 0.15) 0%, transparent 60%),
			radial-gradient(circle at 50% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 60%);
		pointer-events: none;
		animation: neuralShift 20s ease-in-out infinite;
	}

	@keyframes neuralShift {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.1) rotate(180deg);
		}
	}

	/* Neural Icons */
	.icon-neural,
	.icon-quantum,
	.icon-sync,
	.icon-check,
	.icon-error {
		width: 24px;
		height: 24px;
		border-radius: 6px;
		position: relative;
		flex-shrink: 0;
	}

	.icon-neural {
		background: radial-gradient(circle at center, var(--neural-accent) 30%, transparent 70%);
		border: 1px solid var(--neural-accent);
		animation: neuralPulse 2s ease-in-out infinite;
	}

	.icon-neural:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 8px;
		height: 8px;
		background: var(--neural-accent);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: pulse 1.5s ease-in-out infinite;
	}

	.icon-quantum {
		background: linear-gradient(45deg, var(--neural-accent), var(--neural-secondary));
		border-radius: 50%;
		position: relative;
		margin-right: 0.5rem;
	}

	.icon-quantum:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 6px;
		height: 6px;
		background: var(--neural-bg);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		animation: quantumSpin 3s linear infinite;
	}

	.icon-sync {
		background: var(--neural-accent);
		border-radius: 50%;
		margin-right: 0.5rem;
	}

	.icon-sync.loading {
		animation: rotate 1s linear infinite;
	}

	.icon-check {
		background: #4caf50;
		border-radius: 50%;
		position: relative;
		margin-right: 0.5rem;
	}

	.icon-check:before {
		content: '✓';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	.icon-error {
		background: #ff4444;
		border-radius: 50%;
		position: relative;
		margin-right: 0.5rem;
	}

	.icon-error:before {
		content: '!';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		color: white;
		font-size: 12px;
		font-weight: bold;
	}

	@keyframes neuralPulse {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(0, 212, 255, 0);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	@keyframes quantumSpin {
		from {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		to {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Header */
	.auth-header {
		text-align: center;
		padding: 3rem 2rem 2rem;
		position: relative;
		z-index: 2;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.logo-text {
		font-size: 2.5rem;
		font-weight: 200;
		letter-spacing: 0.05em;
		background: var(--neural-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		font-size: 1rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.03em;
		margin: 0;
	}

	/* Main Auth Card */
	.auth-main {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		position: relative;
		z-index: 2;
	}

	.auth-card {
		width: 100%;
		max-width: 480px;
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border: 1px solid var(--neural-border);
		border-radius: 24px;
		padding: 3rem;
		box-shadow: var(--neural-shadow);
		transform: translateY(20px);
		animation: slideUp 0.8s ease forwards;
	}

	@keyframes slideUp {
		to {
			transform: translateY(0);
		}
	}

	.auth-form-header {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.auth-form-header h1 {
		font-size: 2rem;
		font-weight: 200;
		margin: 0 0 1rem 0;
		letter-spacing: 0.02em;
		color: var(--neural-text);
	}

	.form-subtitle {
		font-size: 1rem;
		opacity: 0.8;
		font-weight: 300;
		letter-spacing: 0.01em;
		margin: 0;
		line-height: 1.5;
	}

	/* Alerts */
	.alert {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1.25rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.alert.error {
		background: rgba(255, 68, 68, 0.15);
		border: 1px solid rgba(255, 68, 68, 0.3);
		color: #ff6b6b;
	}

	.alert.success {
		background: rgba(76, 175, 80, 0.15);
		border: 1px solid rgba(76, 175, 80, 0.3);
		color: #4caf50;
	}

	/* Form */
	.auth-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 2.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.form-group label {
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		opacity: 0.9;
		color: var(--neural-text);
	}

	.form-group input {
		padding: 1.25rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		color: var(--neural-text);
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: all var(--neural-transition);
	}

	.form-group input::placeholder {
		color: rgba(255, 255, 255, 0.5);
		font-weight: 300;
	}

	.form-group input:focus {
		outline: none;
		border-color: var(--neural-accent);
		box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
		background: var(--neural-hover);
	}

	.form-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	/* Submit Button */
	.auth-submit {
		padding: 1.25rem 2rem;
		background: var(--neural-gradient);
		border: none;
		border-radius: 12px;
		color: white;
		font-size: 1rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}

	.auth-submit:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
	}

	.auth-submit:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	/* Auth Actions */
	.auth-actions {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		text-align: center;
	}

	.toggle-mode {
		background: none;
		border: none;
		color: var(--neural-text);
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.01em;
		padding: 0.75rem;
		transition: all var(--neural-transition);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.toggle-mode:hover {
		color: var(--neural-accent);
	}

	.toggle-text {
		font-size: 0.8rem;
		opacity: 0.7;
		color: var(--neural-accent);
	}

	.demo-access {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		padding: 1rem 2rem;
		border-radius: 12px;
		color: var(--neural-text);
		font-weight: 300;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.demo-access:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	/* Footer */
	.auth-footer {
		padding: 2rem;
		text-align: center;
		border-top: 1px solid var(--neural-border);
		position: relative;
		z-index: 2;
	}

	.auth-footer p {
		margin: 0 0 1rem 0;
		font-size: 0.8rem;
		opacity: 0.7;
		font-weight: 300;
		letter-spacing: 0.01em;
	}

	.footer-links {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		font-size: 0.8rem;
		font-weight: 300;
	}

	.footer-links a {
		color: var(--neural-accent);
		text-decoration: none;
		transition: color var(--neural-transition);
	}
	.footer-links a:hover {
		color: var(--neural-text);
	}

	.footer-links span.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		color: var(--neural-accent);
	}

	.footer-links span {
		opacity: 0.5;
	}

	/* Responsive Design */
	@media (max-width: 768px) {
		.auth-card {
			padding: 2rem;
			margin: 1rem;
		}

		.logo-text {
			font-size: 2rem;
		}

		.auth-form-header h1 {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.auth-header {
			padding: 2rem 1rem 1rem;
		}

		.auth-main {
			padding: 1rem;
		}

		.auth-card {
			padding: 1.5rem;
		}

		.logo-text {
			font-size: 1.8rem;
		}
	}
</style>
