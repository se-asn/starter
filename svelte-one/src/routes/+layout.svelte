<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';

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
	<!-- Performance: Viewport für responsive Design -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!-- Performance: Preload wichtiger Ressourcen -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
	<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com" />
	<link rel="preload" href="/images/laufplaner_pro.webp" as="image" type="image/webp" />

	<!-- SEO: Standard-Meta-Tags -->
	<meta name="robots" content="index, follow" />
	<meta name="google-site-verification" content="wbsrgzS0E1z6KtPxqGSjgG5GXUZv2TQpVRmqc_Qlnh4" />
	<link rel="canonical" href="https://laufplanerpro.de{$page.url.pathname}" />

	<meta
		name="description"
		content="LaufPlaner Pro - Premium Laufpläne für 5K, 10K, Halbmarathon & Marathon Training"
	/>

	<!-- SEO: Open Graph für bessere Social Media Shares -->
	<meta property="og:title" content="LaufPlaner Pro | Premium Laufpläne" />
	<meta
		property="og:description"
		content="Wissenschaftlich fundierte Laufpläne für 5K, 10K, Halbmarathon und Marathon"
	/>
	<meta property="og:image" content="https://laufplanerpro.de/images/og-image.jpg" />
	<meta property="og:url" content={$page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />

	<!-- Font Awesome mit defer für bessere Performance -->
	<script
		defer
		src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js"
	></script>
</svelte:head>

<!-- Accessibility und SEO: Lang-Attribut -->
<div lang="de">
	<!-- Der slot-Tag für Kinderrouten -->
	<slot />
</div>
