<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import MemberNav from '$lib/components/member/MemberNav.svelte';
	import MemberSidebar from '$lib/components/member/MemberSidebar.svelte';

	export let data;

	onMount(() => {
		// Authentifizierungsstatus laden
		authStore.initialize();
	});
</script>

<svelte:head>
	<title>Mitgliederbereich | LaufPlaner Pro</title>
	<meta
		name="description"
		content="Dein personalisierter Lauftrainingsplan im exklusiven Mitgliederbereich - optimiert für deine Ziele und Fitness."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="member-layout">
	<MemberNav user={data.user} />

	<div class="member-container">
		<MemberSidebar currentPath={data.urlPath} />

		<main class="member-content">
			<slot />
		</main>
	</div>
</div>

<style>
	.member-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--dark);
	}

	.member-container {
		display: flex;
		flex: 1;
	}

	.member-content {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}

	@media (max-width: 768px) {
		.member-container {
			flex-direction: column;
		}

		.member-content {
			padding: 1.5rem;
		}
	}
</style>
