<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Navigation from '$lib/components/Navigation.svelte';

	let user: any = null;
	let mounted = false;
	let action = '';

	// Sample race data
	let races = [
		{
			id: 1,
			name: 'Frankfurt City Triathlon',
			date: '2025-09-15',
			distance: 'Olympic',
			location: 'Frankfurt am Main',
			status: 'registered',
			goal: 'Sub 2:30:00',
			phases: {
				swim: '1.5km',
				bike: '40km',
				run: '10km'
			},
			preparation: 'Peak phase',
			priority: 'A-Race'
		},
		{
			id: 2,
			name: 'Berlin Marathon',
			date: '2025-10-20',
			distance: 'Marathon',
			location: 'Berlin',
			status: 'planned',
			goal: 'Sub 3:15:00',
			phases: {
				run: '42.2km'
			},
			preparation: 'Base building',
			priority: 'B-Race'
		},
		{
			id: 3,
			name: 'Roth Challenge',
			date: '2026-07-12',
			distance: 'Ironman',
			location: 'Roth',
			status: 'target',
			goal: 'Sub 10:30:00',
			phases: {
				swim: '3.8km',
				bike: '180km',
				run: '42.2km'
			},
			preparation: 'Long-term goal',
			priority: 'A-Race'
		}
	];

	onMount(async () => {
		// Check URL params for action
		action = $page.url.searchParams.get('action') || '';
		mounted = true;
	});

	function addNewRace() {
		alert('Wettkampf-Formular wird geöffnet...');
		// Here would be race creation logic
	}

	function editRace(raceId: number) {
		alert(`Wettkampf ${raceId} bearbeiten...`);
		// Here would be race editing logic
	}

	function deleteRace(raceId: number) {
		if (confirm('Wettkampf wirklich löschen?')) {
			races = races.filter((race) => race.id !== raceId);
		}
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'A-Race':
				return '#FF5722';
			case 'B-Race':
				return '#FF9800';
			case 'C-Race':
				return '#4CAF50';
			default:
				return '#9E9E9E';
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'registered':
				return '#4CAF50';
			case 'planned':
				return '#2196F3';
			case 'target':
				return '#FF9800';
			default:
				return '#9E9E9E';
		}
	}

	// Auto-add mode
	if (action === 'add') {
		setTimeout(() => addNewRace(), 100);
	}
</script>

<Navigation />

<main class="races-page">
	<div class="page-header">
		<h1>🏆 Wettkampfplanung</h1>
		<button class="add-btn" on:click={addNewRace}> ➕ Neuer Wettkampf </button>
	</div>

	<div class="races-grid">
		{#each races as race}
			<div class="race-card">
				<div class="race-header">
					<h3>{race.name}</h3>
					<div class="race-badges">
						<span
							class="priority-badge"
							style="background-color: {getPriorityColor(race.priority)}"
						>
							{race.priority}
						</span>
						<span class="status-badge" style="background-color: {getStatusColor(race.status)}">
							{race.status}
						</span>
					</div>
				</div>

				<div class="race-details">
					<div class="detail-row">
						<span class="icon">📅</span>
						<span>{race.date}</span>
					</div>
					<div class="detail-row">
						<span class="icon">📍</span>
						<span>{race.location}</span>
					</div>
					<div class="detail-row">
						<span class="icon">🏃</span>
						<span>{race.distance}</span>
					</div>
					<div class="detail-row">
						<span class="icon">🎯</span>
						<span>{race.goal}</span>
					</div>
				</div>

				<div class="race-phases">
					{#if race.phases.swim}
						<div class="phase">
							<span class="phase-icon">🏊</span>
							<span>{race.phases.swim}</span>
						</div>
					{/if}
					{#if race.phases.bike}
						<div class="phase">
							<span class="phase-icon">🚴</span>
							<span>{race.phases.bike}</span>
						</div>
					{/if}
					{#if race.phases.run}
						<div class="phase">
							<span class="phase-icon">🏃</span>
							<span>{race.phases.run}</span>
						</div>
					{/if}
				</div>

				<div class="race-actions">
					<button class="action-btn edit" on:click={() => editRace(race.id)}>
						✏️ Bearbeiten
					</button>
					<button class="action-btn delete" on:click={() => deleteRace(race.id)}>
						🗑️ Löschen
					</button>
				</div>
			</div>
		{/each}
	</div>
</main>

<style>
	.races-page {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	.page-header h1 {
		margin: 0;
		color: #667eea;
		font-size: 2.5rem;
		font-weight: 700;
	}

	.add-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 1rem 2rem;
		border-radius: 12px;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	.add-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
	}

	.races-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
	}

	.race-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 16px;
		padding: 1.5rem;
		transition: all 0.3s ease;
	}

	.race-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
	}

	.race-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.race-header h3 {
		margin: 0;
		color: #667eea;
		font-size: 1.4rem;
		font-weight: 600;
		flex: 1;
	}

	.race-badges {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.priority-badge,
	.status-badge {
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
		color: white;
		text-align: center;
	}

	.race-details {
		margin-bottom: 1rem;
	}

	.detail-row {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.icon {
		font-size: 1.2rem;
		width: 24px;
		text-align: center;
	}

	.race-phases {
		display: flex;
		gap: 1rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.phase {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(102, 126, 234, 0.1);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.phase-icon {
		font-size: 1.1rem;
	}

	.race-actions {
		display: flex;
		gap: 1rem;
	}

	.action-btn {
		flex: 1;
		padding: 0.8rem;
		border: none;
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.action-btn.edit {
		background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
		color: white;
	}

	.action-btn.delete {
		background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
		color: white;
	}

	.action-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 768px) {
		.races-page {
			padding: 1rem;
		}

		.page-header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.races-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.race-phases {
			justify-content: center;
		}

		.action-btn {
			font-size: 0.8rem;
			padding: 0.6rem;
		}
	}
</style>
