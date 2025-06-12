<!-- Navigation Component - Reusable across all pages -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { ClientAuth } from '$lib/client-auth';
	import { onMount } from 'svelte';

	let user: any = null;

	// Initialize user data only on client side
	onMount(() => {
		if (browser) {
			user = ClientAuth.getCurrentUser();
		}
	});

	function logout() {
		ClientAuth.logout();
		goto('/auth');
	}

	// Get current page for active state
	$: currentPath = $page.url.pathname;
</script>

<!-- Top Navigation Bar -->
<nav class="top-nav">
	<div class="nav-brand">
		<div class="logo">
			<div class="icon-neural"></div>
			<span class="logo-text">Smart Triathlete</span>
		</div>
	</div>
	
	<!-- Main Navigation Menu -->
	<div class="nav-menu">
		<a href="/dashboard" class="nav-link" class:active={currentPath === '/dashboard'}>
			<div class="icon-dashboard"></div>
			<span>Dashboard</span>
		</a>
		<a href="/activities" class="nav-link" class:active={currentPath === '/activities'}>
			<div class="icon-activities"></div>
			<span>Activities</span>
		</a>
		<a href="/training-plans" class="nav-link" class:active={currentPath === '/training-plans'}>
			<div class="icon-training"></div>
			<span>Training</span>
		</a>
		<a href="/integrations" class="nav-link" class:active={currentPath === '/integrations'}>
			<div class="icon-integrations"></div>
			<span>Integrations</span>
		</a>
		<a href="/profile" class="nav-link" class:active={currentPath === '/profile'}>
			<div class="icon-profile"></div>
			<span>Profile</span>
		</a>
	</div>
	
	<div class="nav-actions">
		{#if user}
			<button class="user-menu" on:click={logout}>
				<div class="icon-user"></div>
				<span class="user-name">{user.name}</span>
				<div class="icon-chevron"></div>
			</button>
		{/if}
	</div>
</nav>

<style>
	/* Top Navigation */
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: var(--neural-glass);
		backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--neural-border);
		position: sticky;
		top: 0;
		z-index: 100;
		gap: 2rem;
	}

	.nav-brand {
		flex-shrink: 0;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-text {
		font-size: 1.5rem;
		font-weight: 300;
		letter-spacing: 0.05em;
		background: var(--neural-gradient);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.nav-menu {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		justify-content: center;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		color: var(--neural-text);
		text-decoration: none;
		font-weight: 300;
		letter-spacing: 0.01em;
		transition: all var(--neural-transition);
		position: relative;
		opacity: 0.7;
	}

	.nav-link:hover {
		background: var(--neural-hover);
		opacity: 1;
		transform: translateY(-2px);
	}

	.nav-link.active {
		background: rgba(59, 130, 246, 0.15);
		color: var(--neural-accent);
		opacity: 1;
	}

	.nav-link.active::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--neural-accent);
		border-radius: 2px;
	}

	.nav-actions {
		flex-shrink: 0;
	}

	.user-menu {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		padding: 0.75rem 1.25rem;
		border-radius: 25px;
		color: var(--neural-text);
		cursor: pointer;
		transition: all var(--neural-transition);
		font-weight: 300;
		letter-spacing: 0.02em;
	}

	.user-menu:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	/* Icons */
	.icon-neural,
	.icon-dashboard,
	.icon-activities,
	.icon-training,
	.icon-integrations,
	.icon-profile,
	.icon-user,
	.icon-chevron {
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

	.icon-dashboard {
		background: linear-gradient(135deg, #667eea, #764ba2);
		border-radius: 8px;
		position: relative;
	}

	.icon-dashboard:before {
		content: '';
		position: absolute;
		top: 6px;
		left: 6px;
		right: 6px;
		bottom: 6px;
		border: 2px solid white;
		border-radius: 4px;
		border-bottom: none;
		border-right: none;
	}

	.icon-activities {
		background: linear-gradient(135deg, #4caf50, #45a049);
		border-radius: 50%;
		position: relative;
	}

	.icon-activities:before {
		content: '';
		position: absolute;
		top: 8px;
		left: 8px;
		right: 8px;
		bottom: 8px;
		border: 2px solid white;
		border-radius: 50%;
	}

	.icon-training {
		background: linear-gradient(135deg, #ff9800, #f57c00);
		border-radius: 6px;
		position: relative;
	}

	.icon-training:before {
		content: '';
		position: absolute;
		top: 6px;
		left: 6px;
		right: 6px;
		bottom: 6px;
		background: white;
		clip-path: polygon(50% 20%, 80% 80%, 20% 80%);
	}

	.icon-integrations {
		background: linear-gradient(135deg, #9c27b0, #7b1fa2);
		border-radius: 6px;
		position: relative;
	}

	.icon-integrations:before,
	.icon-integrations:after {
		content: '';
		position: absolute;
		width: 8px;
		height: 8px;
		background: white;
		border-radius: 50%;
	}

	.icon-integrations:before {
		top: 4px;
		left: 8px;
	}

	.icon-integrations:after {
		bottom: 4px;
		right: 8px;
	}

	.icon-profile {
		background: linear-gradient(135deg, var(--neural-secondary), var(--neural-accent));
		border-radius: 50%;
	}

	.icon-user {
		background: linear-gradient(135deg, var(--neural-accent), #4a90e2);
		border-radius: 50%;
		position: relative;
	}

	.icon-user:before {
		content: '';
		position: absolute;
		top: 6px;
		left: 8px;
		right: 8px;
		height: 6px;
		background: white;
		border-radius: 50%;
	}

	.icon-user:after {
		content: '';
		position: absolute;
		bottom: 4px;
		left: 6px;
		right: 6px;
		height: 8px;
		background: white;
		border-radius: 8px 8px 0 0;
	}

	.icon-chevron {
		width: 16px;
		height: 16px;
		background: transparent;
		border: none;
		position: relative;
	}

	.icon-chevron:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 6px;
		height: 6px;
		border-right: 2px solid var(--neural-text);
		border-bottom: 2px solid var(--neural-text);
		transform: translate(-50%, -50%) rotate(45deg);
		opacity: 0.7;
	}

	/* Animations */
	@keyframes neuralPulse {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
		}
		50% {
			box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
		}
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0.5;
			transform: translate(-50%, -50%) scale(1.2);
		}
	}

	/* Mobile Responsive Design */
	@media (max-width: 768px) {
		.top-nav {
			padding: 1rem;
			flex-wrap: wrap;
			gap: 1rem;
		}

		.nav-menu {
			order: 3;
			width: 100%;
			justify-content: flex-start;
			overflow-x: auto;
			padding: 0.5rem 0;
			gap: 0.25rem;
		}

		.nav-link {
			flex-shrink: 0;
			padding: 0.5rem 0.75rem;
			white-space: nowrap;
		}

		.nav-link span {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.nav-link span {
			display: none;
		}

		.nav-link {
			padding: 0.75rem;
		}
	}
</style>
