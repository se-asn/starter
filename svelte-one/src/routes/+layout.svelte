<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	// Navigation und Footer importieren
	import Navigation from '$lib/components/Navigation.svelte';
	import Footer from '$lib/components/Footer.svelte';

	// Performance-Tracking
	let navigationStart;
	beforeNavigate(() => {
		navigationStart = performance.now();
	});

	afterNavigate(() => {
		if (navigationStart && typeof window !== 'undefined') {
			const duration = performance.now() - navigationStart;
			// Optional: Analytics-Tracking der Navigationsdauer
			console.debug(`Navigation took ${duration.toFixed(1)}ms`);
		}
	});
</script>

<svelte:head>
	<!-- Alle bestehenden Meta-Tags... -->
</svelte:head>

<!-- Navigation auf ALLEN Seiten zeigen, auch auf Blog-Seiten -->
<Navigation />

<!-- Accessibility und SEO: Lang-Attribut -->
<div lang="de">
	<!-- Der slot-Tag für Kinderrouten -->
	<slot />
</div>

<!-- Footer auf ALLEN Seiten zeigen -->
<Footer />
