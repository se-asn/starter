<script>
	import { onMount } from 'svelte';

	let users = [];
	let isLoading = true;
	let error = null;
    
    // Funktion zum Laden der Benutzerdaten
    async function loadUsers() {
        try {
            isLoading = true;
            error = null;
            
            const response = await fetch('/api/admin/users');
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fehler beim Laden der Benutzerdaten');
            }
            
            const data = await response.json();
            users = data.users || [];
        } catch (err) {
            console.error('Fehler beim Laden der Benutzerdaten:', err);
            error = err.message;
        } finally {
            isLoading = false;
        }
    }
    
    // Beim Initialisieren Daten laden
    onMount(() => {
        loadUsers();
    });
</script>

<svelte:head>
	<title>Benutzerverwaltung | LaufPlaner Pro Admin</title>
</svelte:head>

<div class="users-admin">
	<div class="page-header">
		<h1>Benutzerverwaltung</h1>
	</div>
	
	{#if isLoading}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<p>Lade Benutzerdaten...</p>
		</div>
	{:else if error}
		<div class="error-message">
			<p>{error}</p>
			<button class="btn btn-primary" on:click={() => location.reload()}>Erneut versuchen</button>
		</div>
	{:else}
		<div class="admin-section">
			<div class="section-header">
				<h2>Alle Benutzer</h2>
				<div class="section-actions">
					<input type="text" placeholder="Suchen..." class="search-input">
					<button class="btn btn-primary">
						<i class="material-icons">add</i>
						Benutzer hinzufügen
					</button>
				</div>
			</div>
			
			<div class="users-table">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>E-Mail</th>
							<th>Rolle</th>
							<th>Registriert am</th>
							<th>Status</th>
							<th>Aktionen</th>
						</tr>
					</thead>
					<tbody>
						{#each users as user}
							<tr>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td><span class="badge {user.role === 'admin' ? 'admin' : 'user'}">{user.role}</span></td>
								<td>{new Date(user.createdAt).toLocaleDateString('de-DE')}</td>
								<td><span class="badge active">Aktiv</span></td>
								<td class="actions">
									<button class="btn-icon" title="Bearbeiten">
										<i class="material-icons">edit</i>
									</button>
									<a href="/admin/training-plans?userId={user.id}" class="btn-icon" title="Trainingspläne zuweisen">
										<i class="material-icons">fitness_center</i>
									</a>
									<button class="btn-icon danger" title="Löschen">
										<i class="material-icons">delete</i>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>

<style>
	.users-admin {
		max-width: 1200px;
		margin: 0 auto;
	}
	
	.page-header {
		margin-bottom: 2rem;
	}
	
	.page-header h1 {
		font-size: 1.75rem;
		margin: 0;
		color: var(--primary);
	}
	
	.loading-indicator {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 300px;
	}
	
	.spinner {
		width: 2.5rem;
		height: 2.5rem;
		border: 3px solid rgba(0, 242, 254, 0.3);
		border-radius: 50%;
		border-top-color: var(--primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	
	.error-message {
		background-color: rgba(231, 76, 60, 0.2);
		border-left: 4px solid #e74c3c;
		padding: 1rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}
	
	.admin-section {
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}
	
	.section-header h2 {
		font-size: 1.25rem;
		margin: 0;
		color: var(--primary);
	}
	
	.section-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}
	
	.search-input {
		background-color: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		padding: 0.5rem 1rem;
		color: var(--text);
		font-size: 0.9rem;
		min-width: 250px;
	}
	
	.search-input:focus {
		border-color: var(--primary);
		outline: none;
	}
	
	.users-table {
		overflow-x: auto;
	}
	
	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}
	
	thead {
		background-color: rgba(0, 0, 0, 0.3);
	}
	
	th, td {
		padding: 0.75rem 1rem;
		text-align: left;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	
	th {
		font-weight: 500;
		color: var(--primary);
	}
	
	.badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
	}
	
	.badge.admin {
		background-color: rgba(155, 89, 182, 0.2);
		color: #9b59b6;
	}
	
	.badge.user {
		background-color: rgba(52, 152, 219, 0.2);
		color: #3498db;
	}
	
	.badge.active {
		background-color: rgba(46, 204, 113, 0.2);
		color: #2ecc71;
	}
	
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	
	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 4px;
		background-color: rgba(255, 255, 255, 0.1);
		border: none;
		color: var(--text-light);
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.btn-icon:hover {
		background-color: rgba(0, 242, 254, 0.1);
		color: var(--primary);
	}
	
	.btn-icon.danger:hover {
		background-color: rgba(231, 76, 60, 0.2);
		color: #e74c3c;
	}
	
	.btn-icon i {
		font-size: 1.1rem;
	}
</style>
