<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	
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
		notifications: {
			email: true,
			push: false,
			reminderTime: '18:00'
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
	
	onMount(() => {
		loadSettings();
		return unsubscribe;
	});
	
	async function loadSettings() {
		if (!user) {
			isLoading = false;
			return;
		}
		
		try {
			const response = await fetch('/api/user/settings');
			if (response.ok) {
				const data = await response.json();
				if (data.settings) {
					settings = { ...settings, ...data.settings };
				}
			}
		} catch (error) {
			console.error('Fehler beim Laden der Einstellungen:', error);
		} finally {
			isLoading = false;
		}
	}
	
	async function saveSettings(event) {
		event.preventDefault();
		
		try {
			const response = await fetch('/api/user/settings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ settings })
			});
			
			const data = await response.json();
			
			if (data.success) {
				message = 'Einstellungen erfolgreich gespeichert';
				messageType = 'success';
			} else {
				message = data.message || 'Fehler beim Speichern';
				messageType = 'error';
			}
		} catch (error) {
			message = 'Ein Fehler ist aufgetreten. Versuche es erneut.';
			messageType = 'error';
		}
		
		// Nachricht nach 3 Sekunden ausblenden
		setTimeout(() => {
			message = '';
			messageType = '';
		}, 3000);
	}
</script>

<div class="settings-page">
	<div class="page-header">
		<h1>Einstellungen</h1>
		<p>Personalisiere deine Training-App nach deinen Wünschen</p>
	</div>
	
	{#if message}
		<div class="message {messageType}">
			{message}
		</div>
	{/if}
	
	{#if isLoading}
		<div class="loading">
			<p>Einstellungen werden geladen...</p>
		</div>
	{:else}
		<form on:submit|preventDefault={saveSettings} class="settings-form">
			<!-- Benachrichtigungen -->
			<div class="settings-section">
				<h2>Benachrichtigungen</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>E-Mail-Benachrichtigungen</h3>
						<p>Erhalte E-Mails über deinen Trainingsfortschritt</p>
					</div>
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.notifications.email} />
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
			
			<!-- Datenschutz -->
			<div class="settings-section">
				<h2>Datenschutz</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Fortschritt teilen</h3>
						<p>Erlaube uns, deinen Fortschritt zu nutzen, um Trainingspläne zu verbessern</p>
					</div>
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.privacy.shareProgress} />
						<span class="toggle-slider"></span>
					</label>
				</div>
			</div>
			
			<!-- Einheiten -->
			<div class="settings-section">
				<h2>Einheiten</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Entfernungseinheit</h3>
					</div>
					<select bind:value={settings.units.distanceUnit}>
						<option value="km">Kilometer</option>
						<option value="mi">Meilen</option>
					</select>
				</div>
			</div>
			
			<!-- Darstellung -->
			<div class="settings-section">
				<h2>Darstellung</h2>
				
				<div class="settings-option">
					<div class="option-info">
						<h3>Dunkler Modus</h3>
						<p>Verwende ein dunkles Design</p>
					</div>
					<label class="toggle">
						<input type="checkbox" bind:checked={settings.appearance.darkMode} />
						<span class="toggle-slider"></span>
					</label>
				</div>
			</div>
			
			<button type="submit" class="btn-primary">
				Einstellungen speichern
			</button>
		</form>
	{/if}
</div>

<style>
	.settings-page {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}
	
	.page-header {
		margin-bottom: 2rem;
	}
	
	.page-header h1 {
		color: var(--primary);
		margin-bottom: 0.5rem;
	}
	
	.page-header p {
		color: var(--text-secondary);
	}
	
	.message {
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1rem;
	}
	
	.message.success {
		background-color: #d4edda;
		color: #155724;
		border: 1px solid #c3e6cb;
	}
	
	.message.error {
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
	}
	
	.loading {
		text-align: center;
		padding: 2rem;
	}
	
	.settings-form {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	
	.settings-section {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		padding: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.settings-section h2 {
		color: var(--primary);
		margin-bottom: 1rem;
	}
	
	.settings-option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	.settings-option:last-child {
		border-bottom: none;
	}
	
	.option-info h3 {
		margin: 0 0 0.25rem 0;
		color: var(--text-primary);
	}
	
	.option-info p {
		margin: 0;
		color: var(--text-secondary);
		font-size: 0.9rem;
	}
	
	.toggle {
		position: relative;
		display: inline-block;
		width: 50px;
		height: 24px;
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
		background-color: #ccc;
		transition: 0.4s;
		border-radius: 24px;
	}
	
	.toggle-slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: 0.4s;
		border-radius: 50%;
	}
	
	.toggle input:checked + .toggle-slider {
		background-color: var(--primary);
	}
	
	.toggle input:checked + .toggle-slider:before {
		transform: translateX(26px);
	}
	
	select, input[type="time"] {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		padding: 0.5rem;
		color: var(--text-primary);
		min-width: 120px;
	}
	
	select:focus, input[type="time"]:focus {
		outline: none;
		border-color: var(--primary);
	}
	
	.btn-primary {
		background: linear-gradient(135deg, var(--primary) 0%, #0891b2 100%);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		align-self: flex-start;
	}
	
	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(0, 242, 254, 0.3);
	}
	
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
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		padding: 0.5rem 0.75rem;
		border-radius: 4px;
		color: var(--text-primary);
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
