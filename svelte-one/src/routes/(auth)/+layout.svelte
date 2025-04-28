<script>
	import { page } from '$app/stores';
</script>

<svelte:head>
	<title>
		{$page.url.pathname === '/login' ? 'Anmelden' : 'Registrieren'} | LaufPlaner Pro
	</title>
	<meta
		name="description"
		content="Melde dich in deinem exklusiven Mitgliederbereich an und greife auf deinen persönlichen Lauftrainingsplan zu."
	/>
</svelte:head>

<div class="auth-layout">
	<div class="auth-container">
		<div class="auth-logo">
			<a href="/">
				<span class="logo">LAUF<span class="text-primary">PLANER</span> PRO</span>
			</a>
		</div>
		<slot />
	</div>
</div>

<style>
	.auth-layout {
		display: flex;
		min-height: 100vh;
		align-items: center;
		justify-content: center;
		background-color: var(--dark);
		background-image: linear-gradient(145deg, #1a1a2e, #16213e);
	}

	.auth-container {
		width: 100%;
		max-width: 480px;
		padding: 2.5rem;
		background-color: var(--dark-gray);
		border-radius: 8px;
		box-shadow: 0 0 25px rgba(0, 242, 254, 0.15);
		border: 1px solid rgba(0, 242, 254, 0.1);
		margin: 1rem;
	}

	.auth-logo {
		text-align: center;
		margin-bottom: 2rem;
	}

	.logo {
		font-size: 1.75rem;
		font-weight: 700;
		letter-spacing: 1px;
		color: white;
	}

	.text-primary {
		color: var(--primary);
	}
</style>
