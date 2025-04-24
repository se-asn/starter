<!-- src/lib/components/Navigation.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mobileMenuVisible = false;
	let activeSection = 'home';
	let scrollY = 0;
	let isScrolled = false;
	let lastScrollY = 0;
	let ticking = false;

	function toggleMobileMenu() {
		mobileMenuVisible = !mobileMenuVisible;
	}

	// Track active section based on scroll position with improved performance
	function updateActiveSection() {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				const sections = document.querySelectorAll('section[id]');

				// Find the section that's most in view
				let currentSection = null;
				let maxVisibleArea = 0;

				sections.forEach((section) => {
					const rect = section.getBoundingClientRect();
					const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

					if (visibleHeight > maxVisibleArea) {
						maxVisibleArea = visibleHeight;
						currentSection = section;
					}
				});

				if (currentSection && currentSection.id) {
					activeSection = currentSection.id;
					// Update URL hash without scrolling
					history.replaceState(null, null, `#${activeSection}`);
				}

				// Check if page is scrolled for styling
				isScrolled = scrollY > 50;
				lastScrollY = scrollY;
				ticking = false;
			});

			ticking = true;
		}
	}

	// Close mobile menu when a link is clicked
	function handleLinkClick(e) {
		mobileMenuVisible = false;

		// Implement smooth scrolling
		const href = e.currentTarget.getAttribute('href');
		if (href && href.startsWith('#')) {
			e.preventDefault();
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});

				// Update active section after scroll
				setTimeout(() => {
					activeSection = targetId;
				}, 500);
			}
		}
	}

	onMount(() => {
		window.addEventListener('scroll', () => {
			scrollY = window.scrollY;
			updateActiveSection();
		});
	});
</script>

<svelte:window bind:scrollY on:scroll={updateActiveSection} />

<!-- Skip to main content for accessibility -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<header
	class="site-header {isScrolled ? 'scrolled' : ''}"
	itemscope
	itemtype="https://schema.org/SiteNavigationElement"
>
	<nav class="nav" aria-label="Main Navigation">
		<div class="container">
			<div class="nav-content">
				<div class="nav-left">
					<div class="nav-logo" itemscope itemtype="https://schema.org/Organization">
						<a href="/" class="logo-link" itemprop="url" aria-label="LaufPlaner Pro Homepage">
							<span class="logo" itemprop="name"
								>LAUF<span class="text-primary">PLANER</span> PRO</span
							>
						</a>
						<meta itemprop="logo" content="/images/logo.png" />
					</div>
					<div class="nav-links-desktop" role="menubar">
						<a
							href="#laufplaene"
							class="nav-link {activeSection === 'laufplaene' ? 'active' : ''}"
							role="menuitem"
							on:click={handleLinkClick}>LAUFPLÄNE</a
						>
						<a
							href="#features"
							class="nav-link {activeSection === 'features' ? 'active' : ''}"
							role="menuitem"
							on:click={handleLinkClick}>FEATURES</a
						>
						<a
							href="#testimonials"
							class="nav-link {activeSection === 'testimonials' ? 'active' : ''}"
							role="menuitem"
							on:click={handleLinkClick}>ERFOLGE</a
						>
						<a
							href="#about"
							class="nav-link {activeSection === 'about' ? 'active' : ''}"
							role="menuitem"
							on:click={handleLinkClick}>ÜBER UNS</a
						>
						<a
							href="#faq"
							class="nav-link {activeSection === 'faq' ? 'active' : ''}"
							role="menuitem"
							on:click={handleLinkClick}>FAQ</a
						>
					</div>
				</div>
				<div class="nav-right">
					<div class="search-container">
						<button class="search-button" aria-label="Suchen">
							<i class="fas fa-search"></i>
						</button>
					</div>
					<a href="#signup" class="btn-primary pulse-animation" on:click={handleLinkClick}
						>JETZT STARTEN</a
					>
				</div>
				<div class="nav-mobile-button">
					<button
						on:click={toggleMobileMenu}
						aria-label={mobileMenuVisible ? 'Menü schließen' : 'Menü öffnen'}
						aria-expanded={mobileMenuVisible}
					>
						<i class={mobileMenuVisible ? 'fas fa-times' : 'fas fa-bars'}></i>
					</button>
				</div>
			</div>

			<!-- Mobile menu with improved accessibility -->
			{#if mobileMenuVisible}
				<div class="mobile-menu" role="menu">
					<a
						href="#laufplaene"
						class="mobile-link {activeSection === 'laufplaene' ? 'active' : ''}"
						role="menuitem"
						on:click={handleLinkClick}>LAUFPLÄNE</a
					>
					<a
						href="#features"
						class="mobile-link {activeSection === 'features' ? 'active' : ''}"
						role="menuitem"
						on:click={handleLinkClick}>FEATURES</a
					>
					<a
						href="#testimonials"
						class="mobile-link {activeSection === 'testimonials' ? 'active' : ''}"
						role="menuitem"
						on:click={handleLinkClick}>ERFOLGE</a
					>
					<a
						href="#about"
						class="mobile-link {activeSection === 'about' ? 'active' : ''}"
						role="menuitem"
						on:click={handleLinkClick}>ÜBER UNS</a
					>
					<a
						href="#faq"
						class="mobile-link {activeSection === 'faq' ? 'active' : ''}"
						role="menuitem"
						on:click={handleLinkClick}>FAQ</a
					>
					<a href="#signup" class="mobile-button" on:click={handleLinkClick}>JETZT STARTEN</a>
				</div>
			{/if}
		</div>
	</nav>

	<!-- Optional breadcrumbs for deep pages -->
	{#if $page?.url?.pathname !== '/'}
		<div class="breadcrumbs container">
			<a href="/">Startseite</a> &rsaquo;
			<span>{$page?.data?.title || 'Aktuelle Seite'}</span>
		</div>
	{/if}
</header>

<style>
	.nav {
		background-color: var(--dark-gray);
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 50;
		border-bottom: 1px solid #2d2d2d;
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}

	.site-header.scrolled .nav {
		background-color: rgba(18, 18, 18, 0.95);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	}

	/* Add padding to body to prevent content from hiding under fixed navbar */
	:global(body) {
		padding-top: 4rem;
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

	.nav-link.active,
	.mobile-link.active {
		color: white;
		border-bottom-color: var(--primary);
		font-weight: 600;
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

	.pulse-animation {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(0, 242, 254, 0.4);
		}
		70% {
			box-shadow: 0 0 0 6px rgba(0, 242, 254, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(0, 242, 254, 0);
		}
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
		transition:
			color 0.3s ease,
			border-color 0.3s ease,
			font-weight 0.3s ease;
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

	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--primary);
		color: var(--dark);
		padding: 8px;
		z-index: 100;
		transition: top 0.3s;
	}

	.skip-link:focus {
		top: 0;
	}

	.search-container {
		margin-right: 15px;
		display: none;
	}

	@media (min-width: 768px) {
		.search-container {
			display: block;
		}
	}

	.search-button {
		background: transparent;
		border: none;
		color: #a0a0a0;
		cursor: pointer;
		padding: 5px 10px;
		transition: color 0.3s;
	}

	.search-button:hover {
		color: white;
	}

	.breadcrumbs {
		padding: 10px 0;
		font-size: 0.8rem;
		color: #a0a0a0;
	}

	.breadcrumbs a {
		color: #a0a0a0;
		text-decoration: none;
	}

	.breadcrumbs a:hover {
		color: var(--primary);
	}
</style>
