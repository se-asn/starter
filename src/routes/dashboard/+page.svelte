<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';
	import { browser } from '$app/environment';
	import Navigation from '$lib/components/Navigation.svelte';
	import { t, lang } from '$lib/i18n';

	// Basic state
	let user: any = null;
	let mounted = false;

	// Enhanced athlete data with comprehensive metrics
	let athleteProfile = {
		name: 'Alex Mueller',
		age: 32,
		location: 'Frankfurt, Germany',
		discipline: 'Triathlon',
		experience: '8 Years',
		currentWeight: 72.5, // kg
		targetWeight: 71.0, // kg
		bodyFat: 8.2, // %
		// Performance metrics
		restingHR: 38,
		maxHR: 195,
		ltHR: 175, // Lactate Threshold HR
		ftp: 285, // watts
		vo2Max: 68.5,
		// Swimming metrics
		swimCSS: '1:25', // Critical Swim Speed per 100m
		swimT100: '1:18', // Best 100m time
		// Running metrics
		runningFTP: '3:45', // per km at threshold
		vVO2max: '3:25', // per km at VO2max
		// Current form
		ctlFitness: 95, // Chronic Training Load
		atlFatigue: 45, // Acute Training Load
		tsbForm: 50, // Training Stress Balance
		// Season stats
		totalDistance: 2847, // km this year
		totalTime: '387:42:15', // this year
		totalTSS: 12450 // this year
	};

	// Enhanced training zones with power and pace
	let trainingZones = {
		hr: {
			z1: { min: 38, max: 155, label: 'Recovery', color: '#4CAF50', percentage: '65-75%' },
			z2: { min: 156, max: 165, label: 'Aerobic', color: '#8BC34A', percentage: '75-85%' },
			z3: { min: 166, max: 175, label: 'Tempo', color: '#FFC107', percentage: '85-90%' },
			z4: { min: 176, max: 185, label: 'Threshold', color: '#FF9800', percentage: '90-95%' },
			z5: { min: 186, max: 195, label: 'VO2Max', color: '#F44336', percentage: '95-100%' }
		},
		power: {
			z1: { min: 0, max: 171, label: 'Recovery', color: '#4CAF50', percentage: '0-55%' },
			z2: { min: 172, max: 228, label: 'Endurance', color: '#8BC34A', percentage: '56-75%' },
			z3: { min: 229, max: 256, label: 'Tempo', color: '#FFC107', percentage: '76-90%' },
			z4: { min: 257, max: 285, label: 'Threshold', color: '#FF9800', percentage: '91-105%' },
			z5: { min: 286, max: 342, label: 'VO2Max', color: '#F44336', percentage: '106-120%' }
		},
		pace: {
			z1: { min: '5:30', max: '6:30', label: 'Easy', color: '#4CAF50', kmh: '9.2-10.9' },
			z2: { min: '4:45', max: '5:29', label: 'Aerobic', color: '#8BC34A', kmh: '11.0-12.6' },
			z3: { min: '4:15', max: '4:44', label: 'Tempo', color: '#FFC107', kmh: '12.7-14.1' },
			z4: { min: '3:45', max: '4:14', label: 'Threshold', color: '#FF9800', kmh: '14.2-16.0' },
			z5: { min: '3:25', max: '3:44', label: 'VO2Max', color: '#F44336', kmh: '16.1-17.5' }
		},
		swim: {
			z1: { min: '1:50', max: '2:10', label: 'Easy', color: '#4CAF50', pace100: '/100m' },
			z2: { min: '1:35', max: '1:49', label: 'Aerobic', color: '#8BC34A', pace100: '/100m' },
			z3: { min: '1:28', max: '1:34', label: 'Tempo', color: '#FFC107', pace100: '/100m' },
			z4: { min: '1:22', max: '1:27', label: 'Threshold', color: '#FF9800', pace100: '/100m' },
			z5: { min: '1:18', max: '1:21', label: 'VO2Max', color: '#F44336', pace100: '/100m' }
		}
	};

	// Enhanced recent activities with comprehensive data
	let recentActivities = [
		{
			id: 1,
			sport: 'swim',
			type: 'Threshold Training',
			duration: '01:15:30',
			distance: '3.2km',
			tss: 68,
			date: '2025-07-12',
			avgPace: '1:34/100m',
			strokeRate: 42,
			swolf: 38,
			pool: '50m',
			calories: 420,
			equipment: 'Paddles, Pull-Buoy',
			feeling: 'Excellent',
			effort: 8,
			notes: 'Perfect technique, new PR on 200m'
		},
		{
			id: 2,
			sport: 'bike',
			type: 'FTP Test + Endurance',
			duration: '02:45:15',
			distance: '95km',
			tss: 142,
			date: '2025-07-11',
			avgPower: 285,
			maxPower: 415,
			avgSpeed: '34.5km/h',
			maxSpeed: '68.2km/h',
			elevation: 850,
			normalizedPower: 295,
			intensityFactor: 0.89,
			cadence: 92,
			temperature: '24°C',
			equipment: 'Time Trial Bike, PowerMeter',
			feeling: 'Strong',
			effort: 9,
			notes: 'New FTP: 315W! Perfect aerodynamics'
		},
		{
			id: 3,
			sport: 'run',
			type: 'Tempo Run + Cool-Down',
			duration: '01:35:20',
			distance: '18km',
			tss: 89,
			date: '2025-07-10',
			avgPace: '4:15/km',
			avgHR: 168,
			maxHR: 182,
			cadence: 185,
			verticalRatio: 8.2,
			groundContactTime: 215,
			elevation: 125,
			calories: 950,
			splits: ['4:18', '4:12', '4:15', '4:08'],
			weather: 'Bewölkt, 18°C',
			equipment: 'Carbon-Laufschuhe',
			feeling: 'Perfekt',
			effort: 7,
			notes: 'Even splits, perfect execution'
		},
		{
			id: 4,
			sport: 'bike',
			type: 'Recovery',
			duration: '01:20:00',
			distance: '35km',
			tss: 28,
			date: '2025-07-09',
			avgPower: 165,
			avgSpeed: '26.2km/h',
			avgHR: 142,
			feeling: 'Entspannt',
			effort: 3,
			notes: 'Easy recovery ride'
		},
		{
			id: 5,
			sport: 'swim',
			type: 'Technique + Endurance',
			duration: '01:05:00',
			distance: '2.8km',
			tss: 45,
			date: '2025-07-08',
			avgPace: '1:38/100m',
			strokeRate: 38,
			drills: 'Einarmig, Wasserfassen',
			feeling: 'Good',
			effort: 5,
			notes: 'Focus on technique improvement'
		}
	];

	// Enhanced upcoming workouts with detailed structure
	let upcomingWorkouts = [
		{
			id: 1,
			sport: 'bike',
			type: 'VO2Max Intervalle',
			duration: '02:15:00',
			scheduled: '2025-07-13 06:00',
			tssPlanned: 125,
			coach: 'TrainerAI',
			description: '5x5min @ 120% FTP',
			warmup: '20min Easy spinning',
			mainSet: '5 x (5min @ 350W / 2min @ 150W)',
			cooldown: '15min Easy',
			targetPower: '340-360W',
			targetHR: '185-195bpm',
			equipment: 'Zeitfahrrad, PowerMeter',
			nutrition: 'Isotonic drink, 1 gel',
			weather: 'Sonnig, 22°C',
			location: 'Outdoor-Strecke A5',
			priority: 'high'
		},
		{
			id: 2,
			sport: 'run',
			type: 'Langer Lauf',
			duration: '02:45:00',
			scheduled: '2025-07-13 18:00',
			tssPlanned: 156,
			coach: 'TrainerAI',
			description: '32km aerobic base',
			warmup: '10min @ 5:30/km',
			mainSet: '30km @ 4:45-5:00/km',
			cooldown: '2km @ 5:30/km',
			targetPace: '4:45-5:00/km',
			targetHR: '155-165bpm',
			elevation: '+245m',
			route: 'Main-Ufer Rundkurs',
			nutrition: '3 gels, Electrolytes',
			hydration: '750ml/hour',
			equipment: 'Endurance Running Shoes',
			priority: 'high'
		},
		{
			id: 3,
			sport: 'swim',
			type: 'Race Pace',
			duration: '01:30:00',
			scheduled: '2025-07-14 06:30',
			tssPlanned: 85,
			coach: 'TrainerAI',
			description: 'Race pace simulation',
			warmup: '600m Easy + 4x50m build',
			mainSet: '3 x (400m @ 1:25/100m + 100m Easy)',
			cooldown: '400m Easy',
			targetPace: '1:22-1:28/100m',
			targetHR: '175-185bpm',
			strokeRate: '40-42/min',
			pool: '50m Outdoor',
			equipment: 'Neopren optional',
			technique: 'Bilaterale Atmung',
			priority: 'medium'
		},
		{
			id: 4,
			sport: 'bike',
			type: 'Recovery',
			duration: '01:00:00',
			scheduled: '2025-07-14 17:00',
			tssPlanned: 25,
			coach: 'TrainerAI',
			description: 'Active recovery',
			targetPower: '120-150W',
			targetHR: '135-145bpm',
			route: 'Stadtpark flach',
			priority: 'low'
		}
	];

	// Weekly and monthly statistics
	let weeklyStats = {
		totalTime: '12:45:30',
		totalDistance: 127.5,
		totalTSS: 548,
		activities: 7,
		avgDailyTSS: 78,
		breakdown: {
			swim: { time: '3:15:00', distance: 12.5, percentage: 25 },
			bike: { time: '6:30:00', distance: 285, percentage: 51 },
			run: { time: '3:00:30', distance: 47.5, percentage: 24 }
		}
	};

	let monthlyStats = {
		totalTime: '52:20:15',
		totalDistance: 542.8,
		totalTSS: 2156,
		activities: 28,
		avgWeeklyTSS: 539,
		breakdown: {
			swim: { time: '12:45:00', distance: 48.2, percentage: 24 },
			bike: { time: '28:10:00', distance: 1125, percentage: 54 },
			run: { time: '11:25:15', distance: 195.5, percentage: 22 }
		}
	};

	// Performance trends and analysis
	let performanceTrends = {
		fitness: { current: 95, trend: '+8', change: 'improving' },
		fatigue: { current: 45, trend: '-5', change: 'decreasing' },
		form: { current: 50, trend: '+13', change: 'peaking' },
		vo2max: { current: 68.5, trend: '+1.2', change: 'improving' },
		ftp: { current: 285, trend: '+15', change: 'improving' },
		runningThreshold: { current: '3:45', trend: '-8sec', change: 'improving' },
		swimCSS: { current: '1:25', trend: '-2sec', change: 'improving' }
	};

	// Upcoming races and goals
	let upcomingRaces = [
		{
			id: 1,
			name: 'Frankfurt Ironman 70.3',
			date: '2025-08-24',
			distance: '70.3',
			type: 'Half Ironman',
			location: 'Frankfurt am Main',
			daysLeft: 42,
			goalTime: '4:15:00',
			currentForm: 'On Track',
			preparation: 85,
			priority: 'A-Race'
		},
		{
			id: 2,
			name: 'München Marathon',
			date: '2025-10-12',
			distance: '42.2km',
			type: 'Marathon',
			location: 'München',
			daysLeft: 91,
			goalTime: '2:45:00',
			currentForm: 'Early Prep',
			preparation: 35,
			priority: 'B-Race'
		}
	];

	// Training readiness factors with detailed breakdown
	let readinessFactors = {
		overall: 85,
		status: 'High intensity OK',
		sleep: { score: 95, hours: 8.2, quality: 'Excellent', deepSleep: '2:15' },
		hrv: { score: 88, value: 42, trend: 'stable', rmssd: '52ms' },
		recovery: { score: 98, status: 'Fully Recovered', muscleOxygen: 95 },
		stress: { score: 82, level: 'Low', mentalFatigue: 'Low' },
		nutrition: { score: 90, hydration: 'Good', energyBalance: '+150kcal' },
		motivation: { score: 95, mentalReadiness: 'High', focus: 'Excellent' }
	};

	// Zone selection for training zones display
	let selectedZoneType: 'hr' | 'power' | 'pace' | 'swim' = 'hr';

	// Button action functions
	function updateZones() {
		// Simulate zone update with new FTP test values
		showNotification('Updating zones based on latest test data...');
		// Here you would normally call an API to recalculate zones
	}

	function planTest() {
		// Navigate to test planning
		showNotification('Redirecting to training planning...');
		setTimeout(() => goto('/training-plans?focus=test'), 500);
	}

	function analyzePerformance() {
		// Navigate to detailed analytics
		showNotification('Opening detailed performance analysis...');
		setTimeout(() => goto('/analytics'), 500);
	}

	function addActivity() {
		// Navigate to activity entry
		showNotification('Adding new activity...');
		setTimeout(() => goto('/activities?action=add'), 500);
	}

	function viewAllActivities() {
		// Navigate to all activities
		showNotification('Alle Aktivitäten anzeigen...');
		setTimeout(() => goto('/activities'), 500);
	}

	function addWorkout() {
		// Navigate to workout planner
		showNotification('Planning new workout...');
		setTimeout(() => goto('/training-plans?action=add'), 500);
	}

	function openCalendar() {
		// Navigate to training calendar
		showNotification('Opening training calendar...');
		setTimeout(() => goto('/calendar'), 500);
	}

	function viewMonthlyStats() {
		// Navigate to monthly view
		showNotification('Loading monthly statistics...');
		setTimeout(() => goto('/analytics?view=monthly'), 500);
	}

	function addRace() {
		// Navigate to race planning
		showNotification('Adding new race...');
		setTimeout(() => goto('/races?action=add'), 500);
	}

	function viewRecoveryDetails() {
		// Navigate to recovery analytics
		showNotification('Recovery-Details laden...');
		setTimeout(() => goto('/recovery'), 500);
	}

	function viewYearlyStats() {
		// Navigate to yearly overview
		showNotification('Loading yearly overview...');
		setTimeout(() => goto('/analytics?view=yearly'), 500);
	}

	// Show notifications for successful actions
	function showNotification(message: string) {
		if (!browser) return;

		// Simple notification system
		const notification = document.createElement('div');
		notification.style.cssText = `
			position: fixed;
			top: 20px;
			right: 20px;
			background: rgba(102, 126, 234, 0.9);
			color: white;
			padding: 1rem 2rem;
			border-radius: 8px;
			z-index: 1000;
			backdrop-filter: blur(10px);
			animation: slideInNotification 0.3s ease-out;
		`;
		notification.textContent = message;

		// Add CSS animation if not already added
		if (!document.getElementById('notification-styles')) {
			const style = document.createElement('style');
			style.id = 'notification-styles';
			style.textContent = `
				@keyframes slideInNotification {
					from {
						transform: translateX(100%);
						opacity: 0;
					}
					to {
						transform: translateX(0);
						opacity: 1;
					}
				}
			`;
			document.head.appendChild(style);
		}

		document.body.appendChild(notification);

		setTimeout(() => {
			notification.style.animation = 'slideInNotification 0.3s ease-out reverse';
			setTimeout(() => {
				notification.remove();
			}, 300);
		}, 3000);
	}

	// Function to switch zone types
	function switchZoneType(type: 'hr' | 'power' | 'pace' | 'swim') {
		selectedZoneType = type;
	}

	// Function to get current zone based on HR/Power
	function getCurrentZone(metric: number, type: 'hr' | 'power'): string {
		const zones = trainingZones[type];
		for (const [zone, data] of Object.entries(zones)) {
			if (metric >= data.min && metric <= data.max) {
				return `${zone.toUpperCase()} - ${data.label}`;
			}
		}
		return 'Unknown';
	}

	// Function to format time duration
	function formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}

	// Function to get effort color
	function getEffortColor(effort: number): string {
		if (effort <= 3) return '#4CAF50';
		if (effort <= 5) return '#8BC34A';
		if (effort <= 7) return '#FFC107';
		if (effort <= 8) return '#FF9800';
		return '#F44336';
	}

	// Function to get priority color
	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'high':
				return '#F44336';
			case 'medium':
				return '#FF9800';
			case 'low':
				return '#4CAF50';
			default:
				return '#757575';
		}
	}

	// Auth check
	onMount(async () => {
		if (browser) {
			try {
				// Check for demo mode first
				const demoMode = localStorage.getItem('demoMode');
				const storedUser = localStorage.getItem('user');

				if (demoMode === 'true' && storedUser) {
					// Demo mode - use stored user data
					user = JSON.parse(storedUser);
					mounted = true;
					startAnimations();
					return;
				}

				// Regular Supabase auth check
				const {
					data: { user: currentUser }
				} = await supabase.auth.getUser();

				if (!currentUser) {
					goto('/auth');
					return;
				}

				user = currentUser;

				// Check admin status
				await checkAdminStatus();

				mounted = true;
				startAnimations();
			} catch (error) {
				console.error('Error loading dashboard:', error);
				goto('/auth');
			}
		}
	});

	// Check if user is admin
	let isAdmin = false;

	async function checkAdminStatus() {
		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) return;

			const response = await fetch('/api/admin', {
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});

			const result = await response.json();
			isAdmin = result.isAdmin || false;
		} catch (error) {
			console.error('Admin check error:', error);
			isAdmin = false;
		}
	}

	// Utility functions
	function getSportIcon(sport: string): string {
		const icons: { [key: string]: string } = {
			swim: '🏊‍♂️',
			bike: '🚴‍♂️',
			run: '🏃‍♂️'
		};
		return icons[sport] || '💪';
	}

	function getSportColor(sport: string): string {
		const colors: { [key: string]: string } = {
			swim: '#00BCD4',
			bike: '#FF9800',
			run: '#4CAF50'
		};
		return colors[sport] || '#757575';
	}

	// Animation variables like homepage
	let glowIntensity = 0;
	let particlesVisible = false;

	// Start animations after mount
	function startAnimations() {
		// Animate glow effect like homepage
		const interval = setInterval(() => {
			glowIntensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
		}, 16);

		// Show particles after delay
		setTimeout(() => {
			particlesVisible = true;
		}, 500);
	}
</script>

<svelte:head>
	<title>Neural Dashboard - Smart Triathlete</title>
	<meta name="description" content="Your intelligent triathlon training command center" />
</svelte:head>

<div class="quantum-page dashboard">
	<Navigation />

	<!-- Neural Dashboard Header -->
	<header class="neural-dashboard-header" class:mounted>
		<div class="neural-container">
			<div class="dashboard-title-section">
				<div class="neural-logo-small">
					<div class="logo-pulse" style="--glow: {glowIntensity}"></div>
					<span class="dashboard-title">Neural Command Center</span>
				</div>
				<div class="athlete-status">
					<div class="athlete-name">{athleteProfile.name}</div>
					<div class="athlete-location">{athleteProfile.location}</div>
				</div>
			</div>

			<!-- Admin Access Button -->
			{#if isAdmin}
				<div class="admin-section">
					<button class="admin-btn" on:click={() => goto('/admin')}> 🔧 Admin Dashboard </button>
				</div>
			{/if}

			{#if particlesVisible}
				<div class="neural-particles">
					{#each Array(10) as _, i}
						<div
							class="particle"
							style="--delay: {i * 0.2}s; --x: {Math.random() * 100}%; --y: {Math.random() * 100}%"
						></div>
					{/each}
				</div>
			{/if}
		</div>
	</header>
	<div class="neural-dashboard-content">
		<!-- Perfect Symmetrical Dashboard Grid - 3x3 Layout -->
		<div class="neural-dashboard-grid-symmetrical">
			<!-- Row 1: Core Performance Metrics -->
			<div class="grid-row row-performance">
				<div class="neural-card performance-card">
					<div class="neural-card-header">
						<div class="card-icon">⚡</div>
						<h3 class="card-title">Performance Metrics</h3>
						<div class="card-actions">
							<button class="action-btn" title="Update Zones" on:click={updateZones}
								>🔄</button
							>
							<button class="action-btn" title="Plan Test" on:click={planTest}>📊</button>
						</div>
					</div>
					<div class="neural-metrics-grid enhanced">
						<div class="neural-metric-item">
							<div class="metric-icon">💓</div>
							<div class="metric-content">
								<span class="neural-metric-label">Resting HR</span>
								<span class="neural-metric-value"
									>{athleteProfile.restingHR} <span class="metric-unit">bpm</span></span
								>
								<span class="metric-trend positive">-2 bpm</span>
							</div>
						</div>
						<div class="neural-metric-item">
							<div class="metric-icon">🔥</div>
							<div class="metric-content">
								<span class="neural-metric-label">Max HR</span>
								<span class="neural-metric-value"
									>{athleteProfile.maxHR} <span class="metric-unit">bpm</span></span
								>
								<span class="metric-trend stable">stabil</span>
							</div>
						</div>
						<div class="neural-metric-item">
							<div class="metric-icon">⚡</div>
							<div class="metric-content">
								<span class="neural-metric-label">FTP</span>
								<span class="neural-metric-value"
									>{athleteProfile.ftp}<span class="metric-unit">W</span></span
								>
								<span class="metric-trend positive">+15W</span>
							</div>
						</div>
						<div class="neural-metric-item">
							<div class="metric-icon">🫁</div>
							<div class="metric-content">
								<span class="neural-metric-label">VO2 Max</span>
								<span class="neural-metric-value"
									>{athleteProfile.vo2Max}<span class="metric-unit">ml/kg/min</span></span
								>
								<span class="metric-trend positive">+1.2</span>
							</div>
						</div>
						<div class="neural-metric-item">
							<div class="metric-icon">🏃‍♂️</div>
							<div class="metric-content">
								<span class="neural-metric-label">Run Threshold</span>
								<span class="neural-metric-value"
									>{athleteProfile.runningFTP}<span class="metric-unit">/km</span></span
								>
								<span class="metric-trend positive">-8s</span>
							</div>
						</div>
						<div class="neural-metric-item">
							<div class="metric-icon">🏊‍♂️</div>
							<div class="metric-content">
								<span class="neural-metric-label">Swim CSS</span>
								<span class="neural-metric-value"
									>{athleteProfile.swimCSS}<span class="metric-unit">/100m</span></span
								>
								<span class="metric-trend positive">-2s</span>
							</div>
						</div>
					</div>
				</div>

				<div class="neural-card zones-card">
					<div class="neural-card-header">
						<div class="card-icon">🎯</div>
						<h3 class="card-title">Training Zones</h3>
						<div class="zone-switcher">
							<button
								class="zone-btn"
								class:active={selectedZoneType === 'hr'}
								on:click={() => switchZoneType('hr')}>HR</button
							>
							<button
								class="zone-btn"
								class:active={selectedZoneType === 'power'}
								on:click={() => switchZoneType('power')}>Power</button
							>
							<button
								class="zone-btn"
								class:active={selectedZoneType === 'pace'}
								on:click={() => switchZoneType('pace')}>Pace</button
							>
							<button
								class="zone-btn"
								class:active={selectedZoneType === 'swim'}
								on:click={() => switchZoneType('swim')}>Swim</button
							>
						</div>
					</div>
					<div class="neural-zones-list">
						{#each Object.entries(trainingZones[selectedZoneType]) as [zone, data]}
							<div class="neural-zone-item" style="--zone-color: {data.color}">
								<div class="zone-indicator"></div>
								<div class="zone-content">
									<div class="zone-header">
										<span class="neural-zone-name">{zone.toUpperCase()}</span>
										<span class="neural-zone-label">{data.label}</span>
									</div>
									<div class="neural-zone-range">
										{data.min} - {data.max}
										{#if selectedZoneType === 'hr'}bpm{:else if selectedZoneType === 'power'}W{:else if selectedZoneType === 'pace'}/km{:else if selectedZoneType === 'swim'}/100m{/if}
										{#if 'percentage' in data && data.percentage}
											<span class="zone-percentage">({data.percentage})</span>
										{/if}
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="neural-card trends-card">
					<div class="neural-card-header">
						<div class="card-icon">📈</div>
						<h3 class="card-title">Performance Trends</h3>
						<div class="card-actions">
							<button class="action-btn" title="Detailed Analysis" on:click={analyzePerformance}
								>🔬</button
							>
						</div>
					</div>
					<div class="trends-grid">
						{#each Object.entries(performanceTrends) as [metric, data]}
							<div
								class="trend-item"
								class:improving={data.change === 'improving'}
								class:declining={data.change === 'declining'}
							>
								<div class="trend-metric">
									<span class="trend-label"
										>{metric === 'fitness'
											? 'Fitness'
											: metric === 'fatigue'
												? 'Ermüdung'
												: metric === 'form'
													? 'Form'
													: metric === 'vo2max'
														? 'VO2 Max'
														: metric === 'ftp'
															? 'FTP'
															: metric === 'runningThreshold'
																? 'Laufschwelle'
																: 'Schwimm-CSS'}</span
									>
									<span class="trend-value"
										>{data.current}{metric === 'vo2max'
											? ' ml/kg/min'
											: metric === 'ftp'
												? 'W'
												: metric === 'runningThreshold' || metric === 'swimCSS'
													? '/km'
													: ''}</span
									>
								</div>
								<div
									class="trend-change"
									class:positive={data.change === 'improving'}
									class:negative={data.change === 'declining'}
								>
									{data.trend}
									{data.change === 'improving' ? '📈' : data.change === 'declining' ? '📉' : '➡️'}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<!-- Row 2: Activity & Training -->
			<div class="grid-row row-training">
				<div class="neural-card activities-card">
					<div class="neural-card-header">
						<div class="card-icon">📋</div>
						<h3 class="card-title">Recent Activities</h3>
						<div class="card-actions">
							<button class="action-btn" title="Add Activity" on:click={addActivity}
								>➕</button
							>
							<button class="action-btn" title="View All" on:click={viewAllActivities}
								>📊</button
							>
						</div>
					</div>
					<div class="neural-activities-list">
						{#each recentActivities.slice(0, 4) as activity}
							<div class="neural-activity-item enhanced">
								<div
									class="activity-sport-icon"
									style="--sport-color: {getSportColor(activity.sport)}"
								>
									{getSportIcon(activity.sport)}
								</div>
								<div class="activity-content">
									<div class="activity-main">
										<span class="neural-activity-type">{activity.type}</span>
										<span class="neural-activity-date">{activity.date}</span>
										{#if activity.effort}
											<span
												class="effort-badge"
												style="--effort-color: {getEffortColor(activity.effort)}"
												>{activity.effort}/10</span
											>
										{/if}
									</div>
									<div class="neural-activity-metrics">
										<span class="metric-chip duration">{activity.duration}</span>
										<span class="metric-chip distance">{activity.distance}</span>
										<span class="metric-chip tss">TSS: {activity.tss}</span>
										{#if activity.avgPace}
											<span class="metric-chip pace">⚡ {activity.avgPace}</span>
										{/if}
										{#if activity.avgPower}
											<span class="metric-chip power">⚡ {activity.avgPower}W</span>
										{/if}
										{#if activity.calories}
											<span class="metric-chip calories">🔥 {activity.calories}kcal</span>
										{/if}
									</div>
									{#if activity.feeling}
										<div class="activity-feeling">Gefühl: {activity.feeling}</div>
									{/if}
									{#if activity.notes}
										<div class="neural-activity-notes">{activity.notes}</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="neural-card workouts-card">
					<div class="neural-card-header">
						<div class="card-icon">📅</div>
						<h3 class="card-title">Planned Workouts</h3>
						<div class="card-actions">
							<button class="action-btn" title="Add Workout" on:click={addWorkout}>➕</button
							>
							<button class="action-btn" title="Kalender öffnen" on:click={openCalendar}>📅</button>
						</div>
					</div>
					<div class="neural-workouts-list">
						{#each upcomingWorkouts.slice(0, 4) as workout}
							<div
								class="neural-workout-item enhanced"
								class:high-priority={workout.priority === 'high'}
							>
								<div
									class="workout-sport-icon"
									style="--sport-color: {getSportColor(workout.sport)}"
								>
									{getSportIcon(workout.sport)}
								</div>
								<div class="workout-content">
									<div class="workout-main">
										<span class="neural-workout-type">{workout.type}</span>
										<span class="neural-workout-time"
											>{new Date(workout.scheduled).toLocaleDateString('en-US')} at {new Date(
												workout.scheduled
											).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span
										>
										<span
											class="priority-badge"
											style="--priority-color: {getPriorityColor(workout.priority)}"
											>{workout.priority}</span
										>
									</div>
									<div class="neural-workout-metrics">
										<span class="metric-chip duration">{workout.duration}</span>
										<span class="metric-chip tss">TSS: {workout.tssPlanned}</span>
										{#if workout.targetPower}
											<span class="metric-chip power">🎯 {workout.targetPower}</span>
										{/if}
										{#if workout.targetPace}
											<span class="metric-chip pace">🎯 {workout.targetPace}</span>
										{/if}
										{#if workout.targetHR}
											<span class="metric-chip hr">💓 {workout.targetHR}</span>
										{/if}
									</div>
									<div class="neural-workout-description">{workout.description}</div>
									{#if workout.warmup || workout.mainSet || workout.cooldown}
										<div class="workout-structure">
											{#if workout.warmup}<div class="structure-item warmup">
													Warm-up: {workout.warmup}
												</div>{/if}
											{#if workout.mainSet}<div class="structure-item main">
													Main: {workout.mainSet}
												</div>{/if}
											{#if workout.cooldown}<div class="structure-item cooldown">
													Cool-down: {workout.cooldown}
												</div>{/if}
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="neural-card stats-card">
					<div class="neural-card-header">
						<div class="card-icon">📊</div>
						<h3 class="card-title">Weekly Statistics</h3>
						<div class="card-actions">
							<button class="action-btn" title="Monatsansicht" on:click={viewMonthlyStats}
								>📈</button
							>
						</div>
					</div>
					<div class="stats-overview">
						<div class="stats-summary">
							<div class="summary-item">
								<span class="summary-value">{weeklyStats.totalTime}</span>
								<span class="summary-label">Training Time</span>
							</div>
							<div class="summary-item">
								<span class="summary-value">{weeklyStats.totalDistance}km</span>
								<span class="summary-label">Distance</span>
							</div>
							<div class="summary-item">
								<span class="summary-value">{weeklyStats.totalTSS}</span>
								<span class="summary-label">TSS</span>
							</div>
							<div class="summary-item">
								<span class="summary-value">{weeklyStats.activities}</span>
								<span class="summary-label">Sessions</span>
							</div>
						</div>
						<div class="sport-breakdown">
							{#each Object.entries(weeklyStats.breakdown) as [sport, data]}
								<div class="breakdown-item">
									<div class="breakdown-header">
										<span class="sport-icon">{getSportIcon(sport)}</span>
										<span class="sport-name">{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
										<span class="percentage">{data.percentage}%</span>
									</div>
									<div class="breakdown-metrics">
										<span class="time-metric">{data.time}</span>
										<span class="distance-metric">{data.distance}km</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Row 3: Goals & Analysis -->
			<div class="grid-row row-goals">
				<div class="neural-card races-card">
					<div class="neural-card-header">
						<div class="card-icon">🏆</div>
						<h3 class="card-title">Races & Goals</h3>
						<div class="card-actions">
							<button class="action-btn" title="Add Race" on:click={addRace}>➕</button>
						</div>
					</div>
					<div class="races-list">
						{#each upcomingRaces.slice(0, 2) as race}
							<div class="race-item" class:a-race={race.priority === 'A-Race'}>
								<div class="race-header">
									<div class="race-title">
										<span class="race-name">{race.name}</span>
										<span class="race-priority" class:a-priority={race.priority === 'A-Race'}
											>{race.priority}</span
										>
									</div>
									<div class="race-countdown">
										<span class="days-left">{race.daysLeft}</span>
										<span class="days-label">Tage</span>
									</div>
								</div>
								<div class="race-details">
									<div class="race-info">
										<span class="race-date">{race.date}</span>
										<span class="race-location">{race.location}</span>
										<span class="race-distance">{race.distance} - {race.type}</span>
									</div>
									<div class="race-goals">
										<span class="goal-time">Zielzeit: {race.goalTime}</span>
										<span class="current-form">Form: {race.currentForm}</span>
									</div>
								</div>
								<div class="preparation-progress">
									<div class="progress-label">Vorbereitung: {race.preparation}%</div>
									<div class="progress-bar">
										<div class="progress-fill" style="width: {race.preparation}%"></div>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- New Recovery & Readiness Card -->
				<div class="neural-card recovery-card">
					<div class="neural-card-header">
						<div class="card-icon">🧘‍♂️</div>
						<h3 class="card-title">Recovery & Readiness</h3>
						<div class="card-actions">
							<button class="action-btn" title="Details" on:click={viewRecoveryDetails}>📊</button>
						</div>
					</div>
					<div class="recovery-overview">
						<div class="readiness-score">
							<div
								class="score-circle"
								style="--score: {Math.round(
									(readinessFactors.sleep.score +
										readinessFactors.hrv.score +
										readinessFactors.stress.score) /
										3
								)}"
							>
								<span class="score-value"
									>{Math.round(
										(readinessFactors.sleep.score +
											readinessFactors.hrv.score +
											readinessFactors.stress.score) /
											3
									)}</span
								>
								<span class="score-label">Readiness</span>
							</div>
						</div>
						<div class="readiness-factors">
							<div class="factor-item">
								<div class="factor-icon">😴</div>
								<div class="factor-content">
									<span class="factor-label">Schlaf</span>
									<span class="factor-value"
										>{readinessFactors.sleep.hours}h / {readinessFactors.sleep.quality}</span
									>
								</div>
								<div
									class="factor-score score-{readinessFactors.sleep.score >= 80
										? 'good'
										: readinessFactors.sleep.score >= 60
											? 'ok'
											: 'poor'}"
								>
									{readinessFactors.sleep.score}
								</div>
							</div>
							<div class="factor-item">
								<div class="factor-icon">💓</div>
								<div class="factor-content">
									<span class="factor-label">HRV</span>
									<span class="factor-value">{readinessFactors.hrv.rmssd}</span>
								</div>
								<div
									class="factor-score score-{readinessFactors.hrv.score >= 80
										? 'good'
										: readinessFactors.hrv.score >= 60
											? 'ok'
											: 'poor'}"
								>
									{readinessFactors.hrv.score}
								</div>
							</div>
							<div class="factor-item">
								<div class="factor-icon">🧠</div>
								<div class="factor-content">
									<span class="factor-label">Stress</span>
									<span class="factor-value">{readinessFactors.stress.level}</span>
								</div>
								<div
									class="factor-score score-{readinessFactors.stress.score >= 80
										? 'good'
										: readinessFactors.stress.score >= 60
											? 'ok'
											: 'poor'}"
								>
									{readinessFactors.stress.score}
								</div>
							</div>
							<div class="factor-item">
								<div class="factor-icon">🍎</div>
								<div class="factor-content">
									<span class="factor-label">Ernährung</span>
									<span class="factor-value">{readinessFactors.nutrition.hydration}</span>
								</div>
								<div
									class="factor-score score-{readinessFactors.nutrition.score >= 80
										? 'good'
										: readinessFactors.nutrition.score >= 60
											? 'ok'
											: 'poor'}"
								>
									{readinessFactors.nutrition.score}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- New Monthly Overview Card -->
				<div class="neural-card monthly-card">
					<div class="neural-card-header">
						<div class="card-icon">📅</div>
						<h3 class="card-title">Monthly Overview</h3>
						<div class="card-actions">
							<button class="action-btn" title="Yearly View" on:click={viewYearlyStats}>📆</button
							>
						</div>
					</div>
					<div class="monthly-overview">
						<div class="monthly-summary">
							<div class="summary-item">
								<span class="summary-value">{monthlyStats.totalTime}</span>
								<span class="summary-label">Total Time</span>
							</div>
							<div class="summary-item">
								<span class="summary-value">{monthlyStats.totalDistance}km</span>
								<span class="summary-label">Distance</span>
							</div>
							<div class="summary-item">
								<span class="summary-value">{monthlyStats.totalTSS}</span>
								<span class="summary-label">TSS</span>
							</div>
							<div class="summary-item">
								<span class="summary-value">{monthlyStats.activities}</span>
								<span class="summary-label">Sessions</span>
							</div>
						</div>
						<div class="monthly-targets">
							<div class="target-item">
								<span class="target-label">Monthly Goal</span>
								<div class="target-progress">
									<div class="progress-bar">
										<div
											class="progress-fill"
											style="width: {(monthlyStats.totalDistance / 450) * 100}%"
										></div>
									</div>
									<span class="progress-text">{monthlyStats.totalDistance}/450km</span>
								</div>
							</div>
							<div class="target-item">
								<span class="target-label">TSS Ziel</span>
								<div class="target-progress">
									<div class="progress-bar">
										<div
											class="progress-fill"
											style="width: {(monthlyStats.totalTSS / 1500) * 100}%"
										></div>
									</div>
									<span class="progress-text">{monthlyStats.totalTSS}/1500</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- End neural-dashboard-grid-symmetrical -->
	</div>
	<!-- End neural-dashboard-content -->
</div>

<!-- Closing quantum-page dashboard -->

<style>
	/* Neural Dashboard Styles - Clean & Modern */

	/* Neural Dashboard Styles - Step 1 */
	.quantum-page.dashboard {
		min-height: 100vh;
		background: radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 40% 60%, rgba(120, 219, 255, 0.1) 0%, transparent 50%),
			linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
		color: #e2e8f0;
	}

	.neural-dashboard-header {
		padding: 2rem 0;
		margin-bottom: 2rem;
		position: relative;
		overflow: hidden;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.neural-dashboard-header.mounted {
		animation: slideInFromTop 0.8s ease-out;
	}

	.dashboard-title-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 2;
	}

	.admin-section {
		display: flex;
		align-items: center;
		gap: 1rem;
		position: relative;
		z-index: 3;
	}

	.admin-btn {
		background: var(--neural-gradient);
		border: none;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 12px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 300;
		letter-spacing: 0.02em;
		transition: all var(--neural-transition);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
	}

	.admin-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 212, 255, 0.4);
	}

	.neural-logo-small {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo-pulse {
		width: 40px;
		height: 40px;
		background: radial-gradient(circle, #667eea 0%, #764ba2 50%, #f093fb 100%);
		border-radius: 50%;
		opacity: calc(0.7 + var(--glow) * 0.3);
		box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
		animation: pulse 2s ease-in-out infinite;
	}

	.dashboard-title {
		font-size: 1.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.athlete-status {
		text-align: right;
	}

	.athlete-name {
		font-size: 1.25rem;
		font-weight: 600;
		color: #e2e8f0;
		margin-bottom: 0.25rem;
	}

	.athlete-location {
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.neural-particles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
	}

	.particle {
		position: absolute;
		width: 2px;
		height: 2px;
		background: #667eea;
		border-radius: 50%;
		opacity: 0;
		left: var(--x);
		top: var(--y);
		animation: floatParticle 4s ease-in-out infinite;
		animation-delay: var(--delay);
	}

	@keyframes slideInFromTop {
		from {
			opacity: 0;
			transform: translateY(-30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	@keyframes floatParticle {
		0%,
		100% {
			opacity: 0;
			transform: translateY(0) scale(0);
		}
		50% {
			opacity: 1;
			transform: translateY(-20px) scale(1);
		}
	}

	/* Neural Container */
	.neural-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		position: relative;
	}

	/* Perfect Symmetrical Neural Dashboard Grid - 3x3 Layout */
	.neural-dashboard-grid-symmetrical {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		margin-bottom: 2rem;
		padding: 0 2rem;
	}

	.grid-row {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		width: 100%;
	}

	/* Ensure all cards in a row have equal height */
	.grid-row .neural-card {
		display: flex;
		flex-direction: column;
		min-height: 400px; /* Consistent minimum height */
	}

	/* Make card content flexible to fill available space */
	.neural-card > *:last-child {
		flex: 1;
	}

	/* Neural Cards */
	.neural-card {
		background: rgba(255, 255, 255, 0.05);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 16px;
		padding: 1.5rem;
		position: relative;
		overflow: hidden;
		transition: all 0.3s ease;
		animation: slideInFromBottom 0.6s ease-out;
	}

	.neural-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 20px 40px rgba(102, 126, 234, 0.1);
		border-color: rgba(102, 126, 234, 0.3);
	}

	.neural-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(102, 126, 234, 0.5) 50%,
			transparent 100%
		);
	}

	/* Neural Card Header */
	.neural-card-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.card-icon {
		font-size: 1.5rem;
		filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
	}

	.card-title {
		font-size: 1.125rem;
		font-weight: 600;
		color: #e2e8f0;
		margin: 0;
	}

	/* Card Actions */
	.card-actions {
		display: flex;
		gap: 0.5rem;
	}

	.action-btn {
		width: 32px;
		height: 32px;
		border: none;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		color: #e2e8f0;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
	}

	.action-btn:hover {
		background: rgba(102, 126, 234, 0.2);
		transform: scale(1.1);
	}

	.action-btn:active {
		transform: scale(0.95);
	}

	/* Zone Selection Buttons */
	.zone-btn {
		padding: 0.5rem 1rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.05);
		color: #e2e8f0;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 0.875rem;
		font-weight: 500;
	}

	.zone-btn:hover {
		background: rgba(102, 126, 234, 0.2);
		border-color: rgba(102, 126, 234, 0.4);
		transform: translateY(-1px);
	}

	.zone-btn.active {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		border-color: #667eea;
		color: white;
		box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
	}

	.zone-btn:active {
		transform: translateY(0);
	}

	/* Neural Metrics Grid */
	.neural-metrics-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.neural-metrics-grid.enhanced {
		grid-template-columns: repeat(3, 1fr);
	}

	.neural-metric-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
	}

	.neural-metric-item:hover {
		background: rgba(102, 126, 234, 0.1);
		border-color: rgba(102, 126, 234, 0.3);
	}

	.metric-icon {
		font-size: 1.25rem;
		filter: drop-shadow(0 0 8px rgba(102, 126, 234, 0.3));
	}

	.metric-content {
		display: flex;
		flex-direction: column;
	}

	.neural-metric-label {
		font-size: 0.75rem;
		color: #94a3b8;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.neural-metric-value {
		font-size: 1.125rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.metric-unit {
		font-size: 0.875rem;
		color: #64748b;
		font-weight: 400;
	}

	.metric-trend {
		font-size: 0.75rem;
		font-weight: 600;
		margin-top: 0.25rem;
	}

	.metric-trend.positive {
		color: #4caf50;
	}

	.metric-trend.stable {
		color: #94a3b8;
	}

	/* Neural Zones */
	.neural-zones-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.neural-zone-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
	}

	.neural-zone-item:hover {
		background: rgba(255, 255, 255, 0.05);
		transform: translateX(5px);
	}

	.zone-indicator {
		width: 4px;
		height: 30px;
		background: var(--zone-color);
		border-radius: 2px;
		box-shadow: 0 0 10px var(--zone-color);
	}

	.zone-content {
		flex: 1;
	}

	.zone-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}

	.neural-zone-name {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--zone-color);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.neural-zone-label {
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.neural-zone-range {
		font-size: 0.875rem;
		color: #e2e8f0;
		font-weight: 500;
	}

	/* Enhanced Activities */
	.neural-activity-item.enhanced {
		position: relative;
		overflow: hidden;
	}

	.neural-activity-item.enhanced::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		width: 3px;
		background: var(--sport-color);
		opacity: 0.7;
	}

	.effort-badge {
		background: var(--effort-color);
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
	}

	.activity-feeling {
		font-size: 0.875rem;
		color: #94a3b8;
		font-style: italic;
		margin-top: 0.5rem;
	}

	.metric-chip {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.metric-chip.duration {
		background: rgba(102, 126, 234, 0.1);
		border-color: rgba(102, 126, 234, 0.3);
	}

	.metric-chip.distance {
		background: rgba(76, 175, 80, 0.1);
		border-color: rgba(76, 175, 80, 0.3);
	}

	.metric-chip.pace,
	.metric-chip.power {
		background: rgba(255, 193, 7, 0.1);
		border-color: rgba(255, 193, 7, 0.3);
	}

	.metric-chip.calories {
		background: rgba(244, 67, 54, 0.1);
		border-color: rgba(244, 67, 54, 0.3);
	}

	.metric-chip.hr {
		background: rgba(233, 30, 99, 0.1);
		border-color: rgba(233, 30, 99, 0.3);
	}

	/* Enhanced Workouts */
	.neural-workout-item.enhanced {
		position: relative;
		border-left: 3px solid var(--sport-color);
	}

	.neural-workout-item.high-priority {
		box-shadow: 0 0 15px rgba(244, 67, 54, 0.2);
		border-color: #f44336;
	}

	.priority-badge {
		background: var(--priority-color);
		color: white;
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.workout-structure {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.structure-item {
		font-size: 0.875rem;
		padding: 0.5rem;
		border-radius: 6px;
		border-left: 3px solid;
	}

	.structure-item.warmup {
		background: rgba(76, 175, 80, 0.1);
		border-color: #4caf50;
	}

	.structure-item.main {
		background: rgba(255, 193, 7, 0.1);
		border-color: #ffc107;
	}

	.structure-item.cooldown {
		background: rgba(102, 126, 234, 0.1);
		border-color: #667eea;
	}

	/* Weekly Statistics */
	.stats-overview {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.stats-summary {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.summary-item {
		text-align: center;
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.summary-value {
		display: block;
		font-size: 1.5rem;
		font-weight: 700;
		color: #667eea;
		margin-bottom: 0.25rem;
	}

	.summary-label {
		font-size: 0.875rem;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.sport-breakdown {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.breakdown-item {
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.breakdown-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.sport-icon {
		font-size: 1.25rem;
	}

	.sport-name {
		flex: 1;
		font-weight: 600;
		color: #e2e8f0;
		text-transform: capitalize;
	}

	.percentage {
		font-weight: 600;
		color: #667eea;
	}

	.breakdown-metrics {
		display: flex;
		gap: 1rem;
		font-size: 0.875rem;
		color: #94a3b8;
	}

	/* Upcoming Races */
	.races-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.race-item {
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
	}

	.race-item.a-race {
		background: rgba(244, 67, 54, 0.05);
		border-color: rgba(244, 67, 54, 0.2);
		box-shadow: 0 0 20px rgba(244, 67, 54, 0.1);
	}

	.race-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.race-title {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.race-name {
		font-size: 1.125rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.race-priority {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
		background: rgba(255, 255, 255, 0.1);
		color: #94a3b8;
		align-self: flex-start;
	}

	.race-priority.a-priority {
		background: rgba(244, 67, 54, 0.2);
		color: #f44336;
	}

	.race-countdown {
		text-align: right;
	}

	.days-left {
		display: block;
		font-size: 2rem;
		font-weight: 700;
		color: #667eea;
	}

	.days-label {
		font-size: 0.875rem;
		color: #94a3b8;
	}

	.race-details {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.race-info,
	.race-goals {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.875rem;
	}

	.race-date,
	.race-location,
	.race-distance,
	.goal-time,
	.current-form {
		color: #94a3b8;
	}

	.preparation-progress {
		margin-top: 1rem;
	}

	.progress-label {
		font-size: 0.875rem;
		color: #e2e8f0;
		margin-bottom: 0.5rem;
	}

	.progress-bar {
		height: 6px;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #4caf50 0%, #667eea 100%);
		transition: width 0.3s ease;
	}

	/* Performance Trends */
	.trends-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.trend-item {
		padding: 1rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
		transition: all 0.3s ease;
	}

	.trend-item.improving {
		border-color: rgba(76, 175, 80, 0.3);
		background: rgba(76, 175, 80, 0.05);
	}

	.trend-item.declining {
		border-color: rgba(244, 67, 54, 0.3);
		background: rgba(244, 67, 54, 0.05);
	}

	.trend-metric {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.trend-label {
		font-size: 0.75rem;
		color: #94a3b8;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.trend-value {
		font-size: 1.25rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	.trend-change {
		font-size: 0.875rem;
		font-weight: 600;
	}

	.trend-change.positive {
		color: #4caf50;
	}

	.trend-change.negative {
		color: #f44336;
	}

	/* Recovery & Readiness Card */
	.recovery-overview {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.readiness-score {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
	}

	.score-circle {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		background: conic-gradient(
			from 0deg,
			#4caf50 0deg,
			#4caf50 calc(var(--score) * 3.6deg),
			rgba(255, 255, 255, 0.1) calc(var(--score) * 3.6deg),
			rgba(255, 255, 255, 0.1) 360deg
		);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.score-circle::before {
		content: '';
		position: absolute;
		width: 90px;
		height: 90px;
		border-radius: 50%;
		background: rgba(30, 41, 59, 0.95);
	}

	.score-value {
		font-size: 2rem;
		font-weight: 700;
		color: #4caf50;
		z-index: 1;
	}

	.score-label {
		font-size: 0.75rem;
		color: #94a3b8;
		z-index: 1;
	}

	.readiness-factors {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.factor-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.03);
		border-radius: 8px;
		border: 1px solid rgba(255, 255, 255, 0.05);
	}

	.factor-icon {
		font-size: 1.25rem;
		width: 24px;
		text-align: center;
	}

	.factor-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.factor-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #e2e8f0;
	}

	.factor-value {
		font-size: 0.75rem;
		color: #94a3b8;
	}

	.factor-score {
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
		font-size: 0.75rem;
		font-weight: 600;
		min-width: 30px;
		text-align: center;
	}

	.factor-score.score-good {
		background: rgba(76, 175, 80, 0.2);
		color: #4caf50;
	}

	.factor-score.score-ok {
		background: rgba(255, 193, 7, 0.2);
		color: #ffc107;
	}

	.factor-score.score-poor {
		background: rgba(244, 67, 54, 0.2);
		color: #f44336;
	}

	/* Monthly Overview Card */
	.monthly-overview {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.monthly-summary {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	.monthly-targets {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.target-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.target-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: #e2e8f0;
	}

	.target-progress {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.progress-text {
		font-size: 0.75rem;
		color: #94a3b8;
		text-align: right;
	}

	/* Mobile Responsiveness - Step 4 */
	@media (max-width: 768px) {
		/* Neural Container */
		.neural-container {
			padding: 0 1rem;
		}

		/* Dashboard Header */
		.neural-dashboard-header {
			padding: 1rem 0;
		}

		.dashboard-title-section {
			flex-direction: column;
			align-items: flex-start;
			gap: 1rem;
		}

		.neural-logo-small {
			align-self: center;
		}

		.athlete-status {
			text-align: center;
			width: 100%;
		}

		.dashboard-title {
			font-size: 1.25rem;
		}

		/* Dashboard Content */
		.neural-dashboard-content {
			padding: 1rem;
		}

		/* Dashboard Grid - Symmetrical */
		.neural-dashboard-grid-symmetrical {
			padding: 0 1rem;
		}

		.grid-row {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.grid-row .neural-card {
			min-height: 350px;
		}

		/* Neural Cards */
		.neural-card {
			padding: 1.25rem;
			border-radius: 12px;
		}

		.neural-card-header {
			margin-bottom: 1.25rem;
			padding-bottom: 0.75rem;
		}

		.card-title {
			font-size: 1rem;
		}

		/* Metrics Grid */
		.neural-metrics-grid {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}

		.neural-metric-item {
			padding: 0.75rem;
		}

		.neural-metric-value {
			font-size: 1rem;
		}

		/* Zones */
		.neural-zones-list {
			gap: 0.5rem;
		}

		.neural-zone-item {
			padding: 0.5rem;
			gap: 0.75rem;
		}

		.zone-indicator {
			width: 3px;
			height: 25px;
		}

		.zone-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		/* Activities & Workouts */
		.neural-activities-list,
		.neural-workouts-list {
			gap: 0.75rem;
		}

		.neural-activity-item,
		.neural-workout-item {
			padding: 0.75rem;
			gap: 0.75rem;
		}

		.activity-sport-icon,
		.workout-sport-icon {
			width: 32px;
			height: 32px;
			font-size: 1rem;
		}

		.activity-main,
		.workout-main {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		.neural-activity-metrics,
		.neural-workout-metrics {
			flex-wrap: wrap;
			gap: 0.25rem;
		}

		.metric-chip {
			font-size: 0.7rem;
			padding: 0.2rem 0.4rem;
		}

		/* Buttons - No live training functionality */
	}

	/* Tablet Responsiveness */
	@media (max-width: 1024px) and (min-width: 769px) {
		.grid-row {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}

		.grid-row .neural-card {
			min-height: 380px;
		}
	}

	/* Large Desktop */
	@media (min-width: 1400px) {
		.neural-container {
			max-width: 1400px;
		}

		.grid-row {
			grid-template-columns: repeat(3, 1fr);
		}

		.grid-row .neural-card {
			min-height: 420px;
		}
	}

	/* Landscape Phone */
	@media (max-width: 768px) and (orientation: landscape) {
		.neural-dashboard-header {
			padding: 0.75rem 0;
		}

		.dashboard-title-section {
			flex-direction: row;
			align-items: center;
		}
	}

	/* Extra Small Phones */
	@media (max-width: 480px) {
		.neural-container {
			padding: 0 0.75rem;
		}

		.neural-dashboard-content {
			padding: 0.75rem;
		}

		.neural-card {
			padding: 1rem;
		}

		.dashboard-title {
			font-size: 1.125rem;
		}

		.factor-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.factor-text {
			order: 1;
		}

		.factor-score {
			order: 2;
			align-self: flex-start;
		}

		.factor-icon {
			order: 0;
			align-self: center;
		}
	}
</style>
