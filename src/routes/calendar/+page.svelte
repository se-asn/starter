<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { browser } from '$app/environment';
	import Navigation from '$lib/components/Navigation.svelte';

	let user: any = null;
	let mounted = false;

	onMount(async () => {
		// Check authentication
		if (browser) {
			if (localStorage.getItem('demoMode') === 'true') {
				user = { email: 'demo@laufplanerpro.de', name: 'Demo User' };
			} else {
				const {
					data: { session }
				} = await supabase.auth.getSession();
				if (!session) {
					goto('/auth');
					return;
				}
				user = session.user;
			}
		}
		mounted = true;
	});
</script>

<svelte:head>
	<title>Calendar - LaufplanerPro</title>
	<meta name="description" content="Trainingskalender und Terminplanung" />
</svelte:head>

{#if mounted}
	<Navigation />

	<div class="calendar-page">
		<div class="container">
			<header class="page-header">
				<h1>📅 Trainingskalender</h1>
				<p>Planen und verwalten Sie Ihre Trainings und Wettkämpfe</p>
			</header>

			<div class="calendar-container">
				<div class="calendar-header">
					<button class="nav-btn">‹</button>
					<h2>Juli 2025</h2>
					<button class="nav-btn">›</button>
				</div>

				<div class="calendar-grid">
					<div class="day-header">Mo</div>
					<div class="day-header">Di</div>
					<div class="day-header">Mi</div>
					<div class="day-header">Do</div>
					<div class="day-header">Fr</div>
					<div class="day-header">Sa</div>
					<div class="day-header">So</div>

					<!-- Calendar Days -->
					{#each Array(35) as _, i}
						{@const day = i - 5 + 1}
						{@const isToday = day === 13}
						{@const hasWorkout = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29, 31].includes(day)}
						{@const hasRace = [20].includes(day)}

						<div
							class="calendar-day"
							class:today={isToday}
							class:has-workout={hasWorkout}
							class:has-race={hasRace}
						>
							{#if day > 0 && day <= 31}
								<span class="day-number">{day}</span>
								{#if hasWorkout}
									<div class="workout-indicator">🏃‍♂️</div>
								{/if}
								{#if hasRace}
									<div class="race-indicator">🏆</div>
								{/if}
							{/if}
						</div>
					{/each}
				</div>

				<div class="calendar-sidebar">
					<div class="upcoming-events">
						<h3>📋 Kommende Events</h3>
						<div class="event-list">
							<div class="event-item workout">
								<div class="event-date">14. Juli</div>
								<div class="event-title">Schwellwert-Training</div>
								<div class="event-time">06:00 Uhr</div>
							</div>
							<div class="event-item workout">
								<div class="event-date">15. Juli</div>
								<div class="event-title">Long Ride</div>
								<div class="event-time">08:00 Uhr</div>
							</div>
							<div class="event-item race">
								<div class="event-date">20. Juli</div>
								<div class="event-title">Ironman Frankfurt</div>
								<div class="event-time">06:30 Uhr</div>
							</div>
						</div>
					</div>

					<div class="quick-actions">
						<h3>⚡ Quick Actions</h3>
						<button class="action-button">+ Workout hinzufügen</button>
						<button class="action-button">+ Wettkampf planen</button>
						<button class="action-button">📊 Trainingsanalyse</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.calendar-page {
		min-height: 100vh;
		background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
		color: #e2e8f0;
		padding-top: 80px;
	}

	.container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.page-header h1 {
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		margin-bottom: 1rem;
	}

	.page-header p {
		font-size: 1.125rem;
		color: #94a3b8;
	}

	.calendar-container {
		display: grid;
		grid-template-columns: 1fr 300px;
		gap: 2rem;
	}

	.calendar-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 2rem;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 1rem 2rem;
	}

	.calendar-header h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0;
	}

	.nav-btn {
		background: rgba(102, 126, 234, 0.2);
		border: none;
		color: #667eea;
		font-size: 1.5rem;
		padding: 0.5rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.nav-btn:hover {
		background: rgba(102, 126, 234, 0.4);
		transform: scale(1.1);
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		overflow: hidden;
		padding: 1rem;
	}

	.day-header {
		background: rgba(102, 126, 234, 0.2);
		color: #667eea;
		font-weight: 600;
		text-align: center;
		padding: 1rem 0.5rem;
		font-size: 0.875rem;
	}

	.calendar-day {
		background: rgba(255, 255, 255, 0.03);
		min-height: 100px;
		padding: 0.5rem;
		position: relative;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 8px;
		margin: 2px;
	}

	.calendar-day:hover {
		background: rgba(255, 255, 255, 0.08);
		transform: scale(1.02);
	}

	.calendar-day.today {
		background: rgba(102, 126, 234, 0.3);
		border: 2px solid #667eea;
	}

	.calendar-day.has-workout {
		border-left: 4px solid #4caf50;
	}

	.calendar-day.has-race {
		border-left: 4px solid #f44336;
	}

	.day-number {
		font-weight: 600;
		color: #e2e8f0;
	}

	.workout-indicator,
	.race-indicator {
		position: absolute;
		bottom: 0.25rem;
		right: 0.25rem;
		font-size: 0.75rem;
	}

	.calendar-sidebar {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.upcoming-events,
	.quick-actions {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 2rem;
	}

	.upcoming-events h3,
	.quick-actions h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #e2e8f0;
		margin-bottom: 1.5rem;
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.event-item {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border-left: 4px solid;
	}

	.event-item.workout {
		border-left-color: #4caf50;
	}

	.event-item.race {
		border-left-color: #f44336;
	}

	.event-date {
		font-size: 0.875rem;
		color: #667eea;
		font-weight: 600;
	}

	.event-title {
		font-weight: 600;
		color: #e2e8f0;
		margin: 0.25rem 0;
	}

	.event-time {
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.action-button {
		width: 100%;
		background: rgba(102, 126, 234, 0.2);
		border: 1px solid rgba(102, 126, 234, 0.3);
		color: #667eea;
		padding: 0.75rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.action-button:hover {
		background: rgba(102, 126, 234, 0.4);
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.calendar-container {
			grid-template-columns: 1fr;
		}

		.container {
			padding: 1rem;
		}

		.calendar-grid {
			padding: 0.5rem;
		}

		.calendar-day {
			min-height: 60px;
		}

		.page-header h1 {
			font-size: 2rem;
		}
	}
</style>
