<!-- src/lib/components/Navigation.svelte -->
<script>
	let mobileMenuVisible = false;

	function toggleMobileMenu() {
		mobileMenuVisible = !mobileMenuVisible;
	}
</script>

<nav class="nav">
	<div class="container">
		<div class="nav-content">
			<div class="nav-left">
				<div class="nav-logo">
					<a href="/" class="logo-link">
						<span class="logo">LAUF<span class="text-primary">PLANER</span> PRO</span>
					</a>
				</div>
				<div class="nav-links-desktop">
					<a href="#laufplaene" class="nav-link">LAUFPLÄNE</a>
					<a href="#features" class="nav-link">FEATURES</a>
					<a href="#about" class="nav-link">ÜBER UNS</a>
					<a href="#faq" class="nav-link">FAQ</a>
				</div>
			</div>
			<div class="nav-right">
				<a href="#signup" class="btn-primary">JETZT STARTEN</a>
			</div>
			<div class="nav-mobile-button">
				<button on:click={toggleMobileMenu} aria-label="Menü öffnen">
					<i class="fas fa-bars"></i>
				</button>
			</div>
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuVisible}
			<div class="mobile-menu">
				<a href="#laufplaene" class="mobile-link">LAUFPLÄNE</a>
				<a href="#features" class="mobile-link">FEATURES</a>
				<a href="#about" class="mobile-link">ÜBER UNS</a>
				<a href="#faq" class="mobile-link">FAQ</a>
				<a href="#signup" class="mobile-button">JETZT STARTEN</a>
			</div>
		{/if}
	</div>
</nav>

<style>
	.nav {
		background-color: var(--dark-gray);
		position: sticky;
		top: 0;
		z-index: 50;
		border-bottom: 1px solid #2d2d2d;
	}

	.nav-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 4rem;
	}

	.nav-left {
		display: flex;
		align-items: center;
	}

	.nav-logo {
		display: flex;
		align-items: center;
	}

	.logo-link {
		text-decoration: none;
		color: inherit;
		display: inline-block;
		transition: transform 0.2s ease;
	}

	.logo-link:hover {
		transform: scale(1.05);
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
	}

	.text-primary {
		color: var(--primary);
	}

	.nav-links-desktop {
		display: none;
		margin-left: 1.5rem;
	}

	@media (min-width: 640px) {
		.nav-links-desktop {
			display: flex;
			gap: 2rem;
		}
	}

	.nav-link {
		color: #a0a0a0;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		border-bottom: 2px solid transparent;
		padding-bottom: 0.25rem;
		transition: all 0.3s ease;
	}

	.nav-link:hover {
		color: white;
		border-bottom-color: var(--primary);
	}

	.nav-right {
		display: none;
	}

	@media (min-width: 640px) {
		.nav-right {
			display: flex;
			align-items: center;
		}
	}

	.btn-primary {
		font-size: 0.875rem;
		padding: 0.5rem 1rem;
	}

	.nav-mobile-button {
		display: flex;
		align-items: center;
	}

	@media (min-width: 640px) {
		.nav-mobile-button {
			display: none;
		}
	}

	.nav-mobile-button button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
		border-radius: 0.375rem;
		color: #a0a0a0;
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.mobile-menu {
		padding: 0.5rem 0 0.75rem;
		display: flex;
		flex-direction: column;
	}

	.mobile-link {
		color: #d0d0d0;
		text-decoration: none;
		padding: 0.5rem 0.75rem;
		font-size: 1rem;
		font-weight: 500;
	}

	.mobile-button {
		background: linear-gradient(90deg, var(--primary) 0%, var(--primary-dark) 100%);
		color: var(--dark);
		margin: 0.75rem;
		padding: 0.5rem 0;
		border-radius: 0.5rem;
		text-align: center;
		text-decoration: none;
		font-weight: 500;
	}
</style>
