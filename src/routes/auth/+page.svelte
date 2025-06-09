<!-- Authentication page for login/register -->
<!-- src/routes/auth/+page.svelte -->

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

	// Check if user is already authenticated
	onMount(() => {
		const token = localStorage.getItem('authToken');
		if (token) {
			goto('/dashboard');
		}
	});

	async function handleSubmit() {
		error = '';
		success = '';

		if (!email || !password) {
			error = 'Email and password are required';
			return;
		}

		if (!isLogin) {
			if (!name) {
				error = 'Name is required for registration';
				return;
			}
			if (password !== confirmPassword) {
				error = 'Passwords do not match';
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
				// Try to get error message from response
				let errorMessage = 'Authentication failed';
				try {
					const errorData = await response.json();
					errorMessage = errorData.error || errorMessage;
				} catch {
					errorMessage = `HTTP ${response.status}: ${response.statusText}`;
				}
				throw new Error(errorMessage);
			}

			const data = await response.json();

			// Store token and user info
			localStorage.setItem('authToken', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));

			success = data.message || (isLogin ? 'Login successful!' : 'Registration successful!');
			setTimeout(() => {
				goto('/dashboard');
			}, 1000);
		} catch (err) {
			console.error('Auth error:', err);
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = 'Network error. Please try again.';
			}
		} finally {
			loading = false;
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
	<title>{isLogin ? 'Login' : 'Register'} - Triathlon Coach</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card">
		<div class="auth-header">
			<h1>🏊‍♂️🚴‍♂️🏃‍♂️</h1>
			<h2>Triathlon Coach</h2>
			<p>{isLogin ? 'Welcome back!' : 'Start your triathlon journey'}</p>
		</div>

		<form on:submit|preventDefault={handleSubmit} class="auth-form">
			<h3>{isLogin ? 'Sign In' : 'Create Account'}</h3>

			{#if !isLogin}
				<div class="form-group">
					<label for="name">Full Name</label>
					<input
						id="name"
						type="text"
						bind:value={name}
						placeholder="Enter your full name"
						required={!isLogin}
					/>
				</div>
			{/if}

			<div class="form-group">
				<label for="email">Email</label>
				<input id="email" type="email" bind:value={email} placeholder="Enter your email" required />
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Enter your password"
					required
				/>
			</div>

			{#if !isLogin}
				<div class="form-group">
					<label for="confirmPassword">Confirm Password</label>
					<input
						id="confirmPassword"
						type="password"
						bind:value={confirmPassword}
						placeholder="Confirm your password"
						required={!isLogin}
					/>
				</div>
			{/if}

			{#if error}
				<div class="error-message">{error}</div>
			{/if}

			{#if success}
				<div class="success-message">{success}</div>
			{/if}

			<button type="submit" class="submit-btn" disabled={loading}>
				{loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
			</button>

			<div class="toggle-mode">
				<span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
				<button type="button" on:click={toggleMode} class="toggle-btn">
					{isLogin ? 'Sign up' : 'Sign in'}
				</button>
			</div>
		</form>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 20px;
	}

	.auth-card {
		background: white;
		border-radius: 16px;
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
		padding: 40px;
		width: 100%;
		max-width: 400px;
	}

	.auth-header {
		text-align: center;
		margin-bottom: 30px;
	}

	.auth-header h1 {
		font-size: 2.5rem;
		margin: 0 0 10px 0;
	}

	.auth-header h2 {
		color: #333;
		margin: 0 0 10px 0;
		font-size: 1.8rem;
	}

	.auth-header p {
		color: #666;
		margin: 0;
		font-size: 1rem;
	}

	.auth-form h3 {
		color: #333;
		margin: 0 0 25px 0;
		font-size: 1.4rem;
		text-align: center;
	}

	.form-group {
		margin-bottom: 20px;
	}

	label {
		display: block;
		margin-bottom: 5px;
		color: #333;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 12px 16px;
		border: 2px solid #e1e5e9;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.3s ease;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
	}

	.submit-btn {
		width: 100%;
		padding: 14px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.3s ease;
		margin-bottom: 20px;
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.toggle-mode {
		text-align: center;
		color: #666;
	}

	.toggle-btn {
		background: none;
		border: none;
		color: #667eea;
		cursor: pointer;
		font-weight: 600;
		text-decoration: underline;
		margin-left: 5px;
	}

	.toggle-btn:hover {
		color: #764ba2;
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 12px;
		border-radius: 6px;
		margin-bottom: 15px;
		font-size: 14px;
	}

	.success-message {
		background: #efe;
		color: #363;
		padding: 12px;
		border-radius: 6px;
		margin-bottom: 15px;
		font-size: 14px;
	}

	@media (max-width: 480px) {
		.auth-card {
			padding: 30px 20px;
		}
	}
</style>
