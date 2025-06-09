<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';

	let user;
	let isLoading = true;
	let isEditing = false;
	let message = '';
	let messageType = '';

	// Form data
	let name = '';
	let email = '';
	let currentPassword = '';
	let newPassword = '';
	let confirmPassword = '';

	// Subscribe to the auth store
	const unsubscribe = authStore.subscribe((state) => {
		user = state.user;
		if (user) {
			name = user.name;
			email = user.email;
		}
	});

	onMount(() => {
		isLoading = false;
		return unsubscribe;
	});

	function toggleEdit() {
		isEditing = !isEditing;
		
		if (!isEditing) {
			// Reset form
			name = user.name;
			email = user.email;
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
			message = '';
		}
	}

	async function updateProfile() {
		isLoading = true;
		message = '';

		// Client-side validation
		if (newPassword && newPassword !== confirmPassword) {
			message = 'Die Passwörter stimmen nicht überein.';
			messageType = 'error';
			isLoading = false;
			return;
		}

		try {
			const updateData = {
				name,
				email
			};

			// Only include password fields if the user is trying to change password
			if (currentPassword && newPassword) {
				updateData.currentPassword = currentPassword;
				updateData.newPassword = newPassword;
			}

			const response = await fetch('/api/user/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(updateData)
			});

			const data = await response.json();

			if (data.success) {
				// Update user in store
				authStore.updateUser(data.user);
				message = 'Profil erfolgreich aktualisiert!';
				messageType = 'success';
				toggleEdit();
			} else {
				message = data.message || 'Ein Fehler ist aufgetreten.';
				messageType = 'error';
			}
		} catch (error) {
			console.error('Profile update error:', error);
			message = 'Ein Fehler ist aufgetreten.';
			messageType = 'error';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="profile-page">
	<div class="page-header">
		<h1>Mein Profil</h1>
		{#if !isEditing}
			<button class="btn btn-secondary" on:click={toggleEdit}>
				<i class="material-icons">edit</i>
				Bearbeiten
			</button>
		{/if}
	</div>

	{#if message}
		<div class="alert {messageType === 'success' ? 'alert-success' : 'alert-error'}">
			{message}
		</div>
	{/if}

	{#if isLoading}
		<div class="loading-spinner"></div>
	{:else if user}
		<div class="profile-content">
			{#if isEditing}
				<form on:submit|preventDefault={updateProfile} class="profile-form">
					<div class="form-group">
						<label for="name">Name</label>
						<input type="text" id="name" bind:value={name} required />
					</div>

					<div class="form-group">
						<label for="email">E-Mail-Adresse</label>
						<input type="email" id="email" bind:value={email} required />
					</div>

					<div class="form-divider">
						<span>Passwort ändern (optional)</span>
					</div>

					<div class="form-group">
						<label for="current-password">Aktuelles Passwort</label>
						<input type="password" id="current-password" bind:value={currentPassword} />
					</div>

					<div class="form-group">
						<label for="new-password">Neues Passwort</label>
						<input type="password" id="new-password" bind:value={newPassword} />
					</div>

					<div class="form-group">
						<label for="confirm-password">Passwort bestätigen</label>
						<input type="password" id="confirm-password" bind:value={confirmPassword} />
					</div>

					<div class="form-actions">
						<button type="button" class="btn btn-outline" on:click={toggleEdit} disabled={isLoading}>
							Abbrechen
						</button>
						<button type="submit" class="btn btn-primary" disabled={isLoading}>
							{#if isLoading}
								<span class="spinner"></span>
								Speichern...
							{:else}
								Speichern
							{/if}
						</button>
					</div>
				</form>
			{:else}
				<div class="profile-info">
					<div class="info-group">
						<div class="info-label">Name</div>
						<div class="info-value">{user.name}</div>
					</div>

					<div class="info-group">
						<div class="info-label">E-Mail-Adresse</div>
						<div class="info-value">{user.email}</div>
					</div>

					<div class="info-group">
						<div class="info-label">Mitglied seit</div>
						<div class="info-value">
							{new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' })}
						</div>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		<p>Benutzerinformationen konnten nicht geladen werden.</p>
	{/if}
</div>

<style>
	.profile-page {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		font-size: 1.5rem;
		color: var(--primary);
		margin: 0;
	}

	.profile-info {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 1.5rem;
	}

	.info-group {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.info-group:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.info-label {
		font-size: 0.9rem;
		color: var(--text-light);
		margin-bottom: 0.5rem;
	}

	.info-value {
		font-size: 1.1rem;
		color: var(--text);
	}

	.profile-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-divider {
		margin: 1rem 0;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		position: relative;
		padding-top: 1.5rem;
	}

	.form-divider span {
		position: absolute;
		top: -0.75rem;
		left: 1rem;
		background-color: var(--dark-bg);
		padding: 0 0.5rem;
		font-size: 0.9rem;
		color: var(--text-light);
	}

	label {
		font-size: 0.9rem;
		color: var(--text-light);
	}

	input {
		padding: 0.75rem;
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		color: var(--text);
	}

	input:focus {
		outline: none;
		border-color: var(--primary);
		box-shadow: 0 0 0 2px rgba(0, 242, 254, 0.25);
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	.alert {
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.alert-success {
		background-color: rgba(39, 174, 96, 0.2);
		border: 1px solid rgba(39, 174, 96, 0.3);
		color: #2ecc71;
	}

	.alert-error {
		background-color: rgba(231, 76, 60, 0.2);
		border: 1px solid rgba(231, 76, 60, 0.3);
		color: #e74c3c;
	}

	.spinner {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		margin-right: 0.5rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #fff;
		animation: spin 1s ease-in-out infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
