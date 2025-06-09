<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import NotificationSettings from '$lib/components/member/NotificationSettings.svelte';
	
	let user;
	let isLoading = true;
	let message = '';
	let messageType = '';
	
	// Einstellungsoptionen
	let settings = {
		privacy: {
			shareProgress: false,
			publicProfile: false
		},
		units: {
			distanceUnit: "km",
			paceUnit: "min/km",
			weightUnit: "kg"
		},
		appearance: {
			darkMode: true,
			compactView: false
		}
	};
	
	// Authentifizierung überwachen
	const unsubscribe = authStore.subscribe((state) => {
		user = state.user;
	});
	
	// Seite initialisieren
	onMount(() => {
		// In einer echten App hier API-Anfrage für Benutzereinstellungen
		loadUserSettings();
		
		return unsubscribe;
	});
	
	// Einstellungen laden (simuliert)
	function loadUserSettings() {
		// Simulierte API-Anfrage
		setTimeout(() => {
			// In einer echten App würden die Einstellungen vom Server kommen
			isLoading = false;
		}, 800);
	}
	
	// Einstellungen speichern
	async function saveSettings() {
		isLoading = true;
		message = '';
		
		try {
			// Simulierte API-Anfrage
			await new Promise(resolve => setTimeout(resolve, 800));
			
			// Erfolgsmeldung
			message = 'Einstellungen erfolgreich gespeichert!';
			messageType = 'success';
		} catch (error) {
			console.error('Error saving settings:', error);
			message = 'Fehler beim Speichern der Einstellungen';
			messageType = 'error';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="settings-page">
	<div class="page-header">
		<h1>Einstellungen</h1>
	</div>
	
	{#if message}
		<div class="alert {messageType === 'success' ? 'alert-success' : 'alert-error'}">
			{message}
		</div>
	{/if}
	
	{#if isLoading}
		<div class="loading-container">
			<div class="loading-spinner"></div>
			<p>Einstellungen werden geladen...</p>
		</div>
	{:else}
		<form on:submit|preventDefault={saveSettings} class="settings-form">			<!-- Trainings-Benachrichtigungen -->
			<NotificationSettings />
			
			<!-- Datenschutzeinstellungen -->
					</div>
					
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.notifications.email} />
						<span class="toggle-slider"></span>
					</label>
				</div>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Push-Benachrichtigungen</h3>
						<p>Erhalte Push-Benachrichtigungen für anstehende Trainingseinheiten</p>
					</div>
					
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.notifications.pushNotifications} />
						<span class="toggle-slider"></span>
					</label>
				</div>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Erinnerungszeit</h3>
						<p>Wann möchtest du an dein Training erinnert werden?</p>
					</div>
					
					<div class="option-control">
						<input type="time" bind:value={settings.notifications.reminderTime} />
					</div>
				</div>
			</div>
			
			<!-- Datenschutzeinstellungen -->
			<div class="settings-section">
				<h2>Datenschutz</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Fortschritt teilen</h3>
						<p>Erlaube uns, deinen Fortschritt zu nutzen, um unsere Trainingspläne zu verbessern</p>
					</div>
					
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.privacy.shareProgress} />
						<span class="toggle-slider"></span>
					</label>
				</div>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Öffentliches Profil</h3>
						<p>Zeige dein Profil und deine Fortschritte anderen Nutzern an</p>
					</div>
					
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.privacy.publicProfile} />
						<span class="toggle-slider"></span>
					</label>
				</div>
			</div>
			
			<!-- Einheiten & Maße -->
			<div class="settings-section">
				<h2>Einheiten & Maße</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Distanzeinheit</h3>
						<p>Wähle deine bevorzugte Einheit für Laufstrecken</p>
					</div>
					
					<div class="option-control">
						<select bind:value={settings.units.distanceUnit}>
							<option value="km">Kilometer (km)</option>
							<option value="mi">Meilen (mi)</option>
						</select>
					</div>
				</div>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Tempo-Einheit</h3>
						<p>Wähle deine bevorzugte Einheit für Lauftempo</p>
					</div>
					
					<div class="option-control">
						<select bind:value={settings.units.paceUnit}>
							<option value="min/km">min/km</option>
							<option value="min/mi">min/mi</option>
						</select>
					</div>
				</div>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Gewichtseinheit</h3>
						<p>Wähle deine bevorzugte Einheit für Gewichtsangaben</p>
					</div>
					
					<div class="option-control">
						<select bind:value={settings.units.weightUnit}>
							<option value="kg">Kilogramm (kg)</option>
							<option value="lb">Pfund (lb)</option>
						</select>
					</div>
				</div>
			</div>
			
			<!-- Darstellung -->
			<div class="settings-section">
				<h2>Darstellung</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Dunkler Modus</h3>
						<p>Verwende dunkle Farbgebung für die Benutzeroberfläche</p>
					</div>
					
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.appearance.darkMode} />
						<span class="toggle-slider"></span>
					</label>
				</div>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Kompakte Ansicht</h3>
						<p>Reduziere den Abstand zwischen Elementen für mehr Inhalte auf dem Bildschirm</p>
					</div>
					
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.appearance.compactView} />
						<span class="toggle-slider"></span>
					</label>
				</div>
			</div>
			
			<!-- Kontoeinstellungen -->
			<div class="settings-section">
				<h2>Konto</h2>
				
				<div class="account-actions">
					<a href="/member/profile" class="btn btn-outline">Profil bearbeiten</a>
					<a href="/member/delete-account" class="btn btn-danger">Konto löschen</a>
				</div>
			</div>
			
			<div class="form-actions">
				<button type="submit" class="btn btn-primary" disabled={isLoading}>
					{#if isLoading}
						<span class="spinner"></span>
						Speichern...
					{:else}
						Einstellungen speichern
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>

<style>
	.settings-page {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}
	
	.page-header h1 {
		font-size: 1.5rem;
		color: var(--primary);
		margin-bottom: 2rem;
	}
	
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
	}
	
	.loading-spinner {
		width: 2rem;
		height: 2rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-radius: 50%;
		border-top-color: var(--primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	
	.settings-form {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		padding: 1.5rem;
	}
	
	.settings-section {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.settings-section:last-of-type {
		border-bottom: none;
		padding-bottom: 0;
	}
	
	.settings-section h2 {
		font-size: 1.25rem;
		margin-bottom: 1.5rem;
		color: var(--primary);
	}
	
	.settings-option {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
	}
	
	.option-info {
		max-width: 70%;
	}
	
	.option-info h3 {
		font-size: 1rem;
		margin: 0 0 0.5rem 0;
		font-weight: 500;
	}
	
	.option-info p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--text-light);
	}
	
	/* Toggle Switch Styling */
	.toggle {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 26px;
	}
	
	.toggle input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	
	.toggle-slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(255, 255, 255, 0.1);
		transition: 0.4s;
		border-radius: 34px;
	}
	
	.toggle-slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 4px;
		bottom: 4px;
		background-color: var(--text);
		transition: 0.4s;
		border-radius: 50%;
	}
	
	input:checked + .toggle-slider {
		background-color: var(--primary);
	}
	
	input:checked + .toggle-slider:before {
		transform: translateX(24px);
		background-color: white;
	}
	
	/* Form Controls Styling */
	select, input[type="time"] {
		background-color: rgba(0, 0, 0, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		color: var(--text);
		font-size: 0.9rem;
		min-width: 140px;
	}
	
	select:focus, input[type="time"]:focus {
		outline: none;
		border-color: var(--primary);
	}
	
	.account-actions {
		display: flex;
		gap: 1rem;
	}
	
	.form-actions {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
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
	
	.btn-danger {
		background-color: rgba(231, 76, 60, 0.2);
		border: 1px solid rgba(231, 76, 60, 0.3);
		color: #e74c3c;
	}
	
	.btn-danger:hover {
		background-color: rgba(231, 76, 60, 0.3);
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
	
	@media (max-width: 768px) {
		.settings-option {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}
		
		.option-info {
			max-width: 100%;
		}
		
		.option-control, .toggle {
			align-self: flex-start;
		}
	}
</style>
