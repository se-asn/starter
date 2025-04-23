<!-- src/routes/+page.svelte -->
<script>
	import Navigation from '$lib/components/Navigation.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ForWho from '$lib/components/ForWho.svelte';
	import Plans from '$lib/components/Plans.svelte';
	import Features from '$lib/components/Features.svelte';
	import AboutUs from '$lib/components/AboutUs.svelte'; // Neue Komponente importieren
	import WhyPlan from '$lib/components/WhyPlan.svelte';
	import ExampleWeek from '$lib/components/ExampleWeek.svelte';
	import FAQ from '$lib/components/FAQ.svelte';
	import Signup from '$lib/components/Signup.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>LaufPlaner Pro | Premium Laufpläne für 5K, 10K, Halbmarathon & Marathon Training</title>
	<meta
		name="description"
		content="Premium Laufpläne für 5K, 10K, Halbmarathon und Marathon - für Anfänger und Fortgeschrittene. Wissenschaftlich fundiert und individuell anpassbar."
	/>
	<link
		rel="stylesheet"
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
	/>
</svelte:head>

<Navigation />
<Hero />
<ForWho />
<Plans />
<Features />
<AboutUs />
<!-- Fügen Sie die Komponente hier ein -->
<WhyPlan />
<ExampleWeek />
<FAQ />
<Signup />
<Footer />
