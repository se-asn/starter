<script>
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let user = null;
	let isAdmin = false;
	let isLoading = true;

	onMount(() => {
		const unsubscribe = authStore.subscribe((state) => {
			user = state.user;
			// Überprüfe, ob der Benutzer ein Administrator ist
			isAdmin = user && user.role === 'admin';
			
			// Wenn der Benutzer kein Admin ist, zur Startseite weiterleiten
			if (!isLoading && !isAdmin) {
				goto('/');
			}
			
			isLoading = false;
		});

		return unsubscribe;
	});
</script>

<div class="admin-layout">
	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Wird geladen...</p>
		</div>
	{:else if isAdmin}
		<div class="admin-sidebar">
			<div class="admin-logo">
				<h2>Admin-Bereich</h2>
			</div>
			<nav class="admin-nav">
				<a href="/admin/dashboard" class="nav-item">
					<i class="material-icons">dashboard</i>
					<span>Dashboard</span>
				</a>
				<a href="/admin/users" class="nav-item">
					<i class="material-icons">people</i>
					<span>Nutzer</span>
				</a>
				<a href="/admin/training-plans" class="nav-item">
					<i class="material-icons">fitness_center</i>
					<span>Trainingspläne</span>
				</a>
				<a href="/admin/orders" class="nav-item">
					<i class="material-icons">receipt</i>
					<span>Bestellungen</span>
				</a>
				<a href="/admin/blog" class="nav-item">
					<i class="material-icons">article</i>
					<span>Blog</span>
				</a>
				<a href="/admin/settings" class="nav-item">
					<i class="material-icons">settings</i>
					<span>Einstellungen</span>
				</a>
			</nav>
			<div class="admin-user">
				<div class="user-info">
					<span>{user ? user.name || user.email : ''}</span>
					<small>Administrator</small>
				</div>
				<a href="/" class="back-link">
					<i class="material-icons">exit_to_app</i>
					<span>Zurück zur Website</span>
				</a>
			</div>
		</div>
		<main class="admin-content">
			<slot />
		</main>
	{:else}
		<div class="unauthorized">
			<h2>Nicht autorisiert</h2>
			<p>Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.</p>
			<a href="/" class="btn btn-primary">Zurück zur Startseite</a>
		</div>
	{/if}
</div>

<style>
	.admin-layout {
		display: flex;
		min-height: 100vh;
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 100vh;
	}
	
	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-radius: 50%;
		border-top-color: var(--primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.admin-sidebar {
		width: 250px;
		background-color: #1a1a2e;
		color: #fff;
		display: flex;
		flex-direction: column;
		height: 100vh;
		position: sticky;
		top: 0;
	}
	
	.admin-logo {
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.admin-logo h2 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--primary);
	}
	
	.admin-nav {
		padding: 1rem 0;
		flex-grow: 1;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		padding: 0.75rem 1.5rem;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		transition: all 0.3s ease;
	}
	
	.nav-item:hover,
	.nav-item.active {
		background-color: rgba(0, 242, 254, 0.1);
		color: var(--primary);
	}
	
	.nav-item i {
		margin-right: 1rem;
	}
	
	.admin-user {
		padding: 1rem 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
	}
	
	.user-info small {
		color: rgba(255, 255, 255, 0.6);
		margin-top: 0.25rem;
	}
	
	.back-link {
		display: flex;
		align-items: center;
		color: rgba(255, 255, 255, 0.8);
		text-decoration: none;
		font-size: 0.9rem;
		transition: color 0.3s ease;
	}
	
	.back-link:hover {
		color: var(--primary);
	}
	
	.back-link i {
		margin-right: 0.5rem;
		font-size: 1.1rem;
	}
	
	.admin-content {
		flex-grow: 1;
		padding: 2rem;
		background-color: #121212;
	}
	
	.unauthorized {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		min-height: 100vh;
		text-align: center;
	}
	
	.unauthorized h2 {
		color: #e74c3c;
		margin-bottom: 1rem;
	}
	
	.unauthorized p {
		margin-bottom: 2rem;
	}
</style>
