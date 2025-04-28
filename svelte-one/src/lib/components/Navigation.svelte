<!-- src/lib/components/Navigation.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { onDestroy } from 'svelte';

	// Elementare Variablen
	let mobileMenuVisible = false;
	let activeSection = '';
	let scrollY = 0;
	let isScrolled = false;
	let ticking = false;

	// Authzustand
	let isAuthenticated = false;

	// Store abonnieren
	if (browser) {
		const unsubscribe = authStore.subscribe((state) => {
			isAuthenticated = state.isAuthenticated;
		});

		onDestroy(unsubscribe);
	}

	function toggleMobileMenu() {
		mobileMenuVisible = !mobileMenuVisible;
	}

	// WICHTIGSTE ÄNDERUNG: Vereinfachter Link-Handler
	function handleLinkClick(e) {
		// Mobile Menü immer schließen
		mobileMenuVisible = false;

		const href = e.currentTarget.getAttribute('href');

		// Wenn es ein Anker-Link auf der Hauptseite ist
		if (href && href.startsWith('#') && $page.url.pathname === '/') {
			// Verhindern der Standard-Navigation
			e.preventDefault();
			e.stopPropagation();

			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				// Scroll zum Element
				targetElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});

				// Aktualisiere aktiven Abschnitt
				activeSection = targetId;
			}
		}
		// Sonst lassen wir das Browser-Standardverhalten für Navigation zu
	}

	// Verbesserte getHref-Funktion
	function getHref(anchorLink) {
		// Wenn nicht auf der Hauptseite, füge / vor dem Anker hinzu
		if (anchorLink && anchorLink.startsWith('#') && $page.url.pathname !== '/') {
			return '/' + anchorLink; // z.B. /#features
		}
		return anchorLink;
	}

	// Verbesserte updateActiveSection mit einem Reset
	async function updateActiveSection() {
		// Keine aktive Sektion außerhalb der Hauptseite
		if ($page.url.pathname !== '/') {
			activeSection = '';
			return;
		}

		if (!ticking) {
			ticking = true;
			await tick();

			window.requestAnimationFrame(() => {
				const sections = document.querySelectorAll('section[id]');
				let currentSection = null;
				let maxVisibleArea = 0;

				sections.forEach((section) => {
					const rect = section.getBoundingClientRect();
					const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

					if (visibleHeight > maxVisibleArea && visibleHeight > 0) {
						maxVisibleArea = visibleHeight;
						currentSection = section;
					}
				});

				if (currentSection && currentSection.id) {
					activeSection = currentSection.id;
				}

				isScrolled = scrollY > 50;
				ticking = false;
			});
		}
	}

	onMount(() => {
		// Reset activeSection wenn nicht auf der Hauptseite
		if ($page.url.pathname !== '/') {
			activeSection = '';
		}

		// Initialen aktiven Abschnitt erkennen
		if ($page.url.pathname === '/' && window.location.hash) {
			const hash = window.location.hash.substring(1);
			const element = document.getElementById(hash);
			if (element) {
				activeSection = hash;
			}
		}

		window.addEventListener('scroll', () => {
			scrollY = window.scrollY;
			if ($page.url.pathname === '/') {
				updateActiveSection();
			}
		});

		// Initial ausführen
		updateActiveSection();
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
					<!-- Desktop Navigation -->
					<div class="nav-links-desktop" role="menubar">
						<!-- Hauptseite-Link, immer zur Root-URL -->
						<a
							href="/"
							class="nav-link {$page.url.pathname === '/' ? 'active' : ''}"
							role="menuitem"
						>
							HOME
						</a>

						<!-- Laufpläne-Link, kontextsensitiv -->
						<a
							href={getHref('#laufplaene')}
							class="nav-link {activeSection === 'laufplaene' && $page.url.pathname === '/'
								? 'active'
								: ''}"
							role="menuitem"
							on:click={handleLinkClick}>LAUFPLÄNE</a
						>

						<!-- Features-Link, kontextsensitiv -->
						<a
							href={getHref('#features')}
							class="nav-link {activeSection === 'features' && $page.url.pathname === '/'
								? 'active'
								: ''}"
							role="menuitem"
							on:click={handleLinkClick}>FEATURES</a
						>

						<!-- Blog-Link, direkte URL -->
						<a
							href="/blog"
							class="nav-link {$page.url.pathname.startsWith('/blog') ? 'active' : ''}"
							role="menuitem"
						>
							BLOG
						</a>

						<!-- ERFOLGE-Link korrigiert -->
						<a
							href={getHref('#testimonials')}
							class="nav-link {activeSection === 'testimonials' && $page.url.pathname === '/'
								? 'active'
								: ''}"
							role="menuitem"
							on:click={handleLinkClick}>ERFOLGE</a
						>

						<!-- ÜBER UNS-Link korrigiert -->
						<a
							href={getHref('#about')}
							class="nav-link {activeSection === 'about' && $page.url.pathname === '/'
								? 'active'
								: ''}"
							role="menuitem"
							on:click={handleLinkClick}>ÜBER UNS</a
						>

						<!-- FAQ-Link korrigiert -->
						<a
							href={getHref('#faq')}
							class="nav-link {activeSection === 'faq' && $page.url.pathname === '/'
								? 'active'
								: ''}"
							role="menuitem"
							on:click={handleLinkClick}>FAQ</a
						>
					</div>
				</div>
				<!-- Desktop Navigation Button ändern -->
				<div class="nav-right">
					<a
						href={isAuthenticated ? '/member/dashboard' : '/login'}
						class="btn-primary pulse-animation"
					>
						{isAuthenticated ? 'MEIN DASHBOARD' : 'MITGLIEDERBEREICH LOGIN'}
					</a>
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

			<!-- Mobile Navigation -->
			{#if mobileMenuVisible}
				<div class="mobile-menu" role="menu">
					<a
						href={getHref('#laufplaene')}
						class="mobile-link {activeSection === 'laufplaene' && $page.url.pathname === '/'
							? 'active'
							: ''}"
						role="menuitem"
						on:click={handleLinkClick}>LAUFPLÄNE</a
					>

					<a
						href={getHref('#features')}
						class="mobile-link {activeSection === 'features' && $page.url.pathname === '/'
							? 'active'
							: ''}"
						role="menuitem"
						on:click={handleLinkClick}>FEATURES</a
					>

					<a
						href="/blog"
						class="mobile-link {$page.url.pathname.startsWith('/blog') ? 'active' : ''}"
						role="menuitem">BLOG</a
					>

					<!-- Mobile ERFOLGE-Link korrigiert -->
					<a
						href={getHref('#testimonials')}
						class="mobile-link {activeSection === 'testimonials' && $page.url.pathname === '/'
							? 'active'
							: ''}"
						role="menuitem"
						on:click={handleLinkClick}>ERFOLGE</a
					>

					<!-- Mobile ÜBER UNS-Link korrigiert -->
					<a
						href={getHref('#about')}
						class="mobile-link {activeSection === 'about' && $page.url.pathname === '/'
							? 'active'
							: ''}"
						role="menuitem"
						on:click={handleLinkClick}>ÜBER UNS</a
					>

					<!-- Mobile FAQ-Link korrigiert -->
					<a
						href={getHref('#faq')}
						class="mobile-link {activeSection === 'faq' && $page.url.pathname === '/'
							? 'active'
							: ''}"
						role="menuitem"
						on:click={handleLinkClick}>FAQ</a
					>

					<!-- Mobile JETZT STARTEN-Button korrigiert -->
					<a href={getHref('#signup')} class="mobile-button" on:click={handleLinkClick}
						>MITGLIEDERBEREICH</a
					>
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
		align-items: center; /* Vertikale Ausrichtung */
		height: 100%;
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
		padding: 0.25rem 0.5rem; /* Konsistentes Padding für alle Links */
		transition: all 0.3s ease;
		display: inline-flex; /* Verbesserte Ausrichtung */
		align-items: center; /* Vertikale Zentrierung */
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
		padding: 0.75rem; /* Konsistentes Padding */
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
