<script>
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';

	export let user;

	let isMenuOpen = false;

	async function logout() {
		try {
			await fetch('/api/auth/logout', { method: 'POST' });
			authStore.logout();
			goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	// Klickaußerhalb schließt das Menü
	function handleClickOutside(event) {
		if (isMenuOpen && !event.target.closest('.user-menu')) {
			isMenuOpen = false;
		}
	}
</script>

<svelte:window on:click={handleClickOutside} />

<header class="member-nav">
	<div class="nav-container">
		<div class="nav-logo">
			<a href="/" aria-label="LaufPlaner Pro Homepage"
				>LAUF<span class="highlight">PLANER</span> PRO</a
			>
		</div>

		<div class="nav-right">
			<div class="user-menu">
				<button
					class="user-button"
					on:click={toggleMenu}
					aria-label="Benutzermenü öffnen"
					aria-expanded={isMenuOpen}
					aria-controls="user-dropdown"
				>
					<span class="user-name">{user?.name || 'Läufer'}</span>
					<span class="user-avatar">
						{#if user?.name}
							{user.name.charAt(0).toUpperCase()}
						{:else}
							L
						{/if}
					</span>
				</button>

				{#if isMenuOpen}
					<div id="user-dropdown" class="dropdown-menu" role="menu">
						<a href="/member/profile" class="dropdown-item" role="menuitem">
							<span class="material-icons">person</span>
							<span>Profil</span>
						</a>
						<a href="/member/settings" class="dropdown-item" role="menuitem">
							<span class="material-icons">settings</span>
							<span>Einstellungen</span>
						</a>
						<button class="dropdown-item logout-button" on:click={logout} role="menuitem">
							<span class="material-icons">logout</span>
							<span>Abmelden</span>
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>

<style>
	.member-nav {
		background-color: var(--dark-gray);
		border-bottom: 1px solid rgba(0, 242, 254, 0.1);
		padding: 1rem 0;
	}

	.nav-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.nav-logo a {
		font-size: 1.5rem;
		font-weight: 700;
		text-decoration: none;
		color: var(--text-light);
	}

	.highlight {
		color: var(--primary);
	}

	.user-menu {
		position: relative;
	}

	.user-button {
		display: flex;
		align-items: center;
		background: none;
		border: none;
		color: var(--text-light);
		cursor: pointer;
		padding: 0.5rem;
	}

	.user-name {
		margin-right: 0.75rem;
	}

	.user-avatar {
		background-color: var(--primary);
		color: var(--dark);
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		right: 0;
		background-color: var(--dark-gray);
		border: 1px solid rgba(0, 242, 254, 0.2);
		border-radius: 4px;
		width: 200px;
		z-index: 10;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		margin-top: 0.5rem;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		color: var(--text-light);
		text-decoration: none;
		transition: background-color 0.2s;
		text-align: left;
		width: 100%;
		border: none;
		background: none;
		cursor: pointer;
		font-size: 1rem;
	}

	.dropdown-item:hover {
		background-color: rgba(0, 242, 254, 0.1);
	}

	.dropdown-item:not(:last-child) {
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.dropdown-item .material-icons {
		margin-right: 0.5rem;
	}

	.logout-button {
		color: #ff6666;
	}

	/* Mobile Optimierungen */
	@media (max-width: 480px) {
		.user-name {
			display: none;
		}

		.nav-logo a {
			font-size: 1.2rem;
		}
	}
</style>
