<script>
	export let currentPath = '/member/dashboard';

	const menuItems = [
		{
			title: 'Dashboard',
			icon: 'dashboard',
			path: '/member/dashboard'
		},
		{
			title: 'Trainingsplan',
			icon: 'calendar_today',
			path: '/member/training-plan'
		},
		{
			title: 'Fortschritt',
			icon: 'trending_up',
			path: '/member/progress'
		},
		{
			title: 'Profil',
			icon: 'person',
			path: '/member/profile'
		},
		{
			title: 'Einstellungen',
			icon: 'settings',
			path: '/member/settings'
		}
	];

	const planData = {
		name: '10K Laufplan - Anfänger',
		currentWeek: 3,
		totalWeeks: 8,
		percentComplete: 35
	};

	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}
</script>

<div class="sidebar-container">
	<!-- Mobile Menu Toggle -->
	<button
		class="mobile-menu-toggle"
		on:click={toggleMobileMenu}
		aria-label={isMobileMenuOpen ? 'Menü schließen' : 'Menü öffnen'}
	>
		<span class="material-icons">{isMobileMenuOpen ? 'close' : 'menu'}</span>
		<span class="toggle-text">Menü</span>
	</button>

	<!-- Sidebar Content -->
	<div class="sidebar" class:open={isMobileMenuOpen}>
		<nav class="sidebar-nav">
			<ul class="nav-list">
				{#each menuItems as item}
					<li class="nav-item">
						<a
							href={item.path}
							class="nav-link"
							class:active={currentPath === item.path}
							aria-current={currentPath === item.path ? 'page' : undefined}
						>
							<span class="material-icons">{item.icon}</span>
							<span class="nav-text">{item.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="sidebar-footer">
			<div class="plan-status">
				<div class="status-label">Dein Plan:</div>
				<div class="plan-name">{planData.name}</div>
				<div class="plan-progress">
					<div class="progress-bar">
						<div class="progress" style="width: {planData.percentComplete}%"></div>
					</div>
					<div class="progress-text">
						Woche {planData.currentWeek} von {planData.totalWeeks}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.sidebar-container {
		height: 100%;
	}

	.sidebar {
		width: 250px;
		background-color: var(--dark-gray);
		border-right: 1px solid rgba(0, 242, 254, 0.1);
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1.5rem 0;
	}

	.nav-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.nav-item {
		margin-bottom: 0.5rem;
	}

	.nav-link {
		display: flex;
		align-items: center;
		padding: 0.9rem 1.5rem;
		color: var(--text-gray);
		text-decoration: none;
		transition: all 0.2s;
		border-left: 4px solid transparent;
	}

	.nav-link:hover {
		background-color: rgba(0, 242, 254, 0.05);
		color: var(--text-light);
	}

	.nav-link.active {
		background-color: rgba(0, 242, 254, 0.1);
		border-left-color: var(--primary);
		color: var(--primary);
	}

	.material-icons {
		margin-right: 1rem;
		font-size: 1.25rem;
	}

	.sidebar-footer {
		padding: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.05);
		margin-top: auto;
	}

	.plan-status {
		padding: 1rem;
		background-color: rgba(0, 242, 254, 0.05);
		border-radius: 8px;
	}

	.status-label {
		color: var(--text-gray);
		font-size: 0.875rem;
		margin-bottom: 0.25rem;
	}

	.plan-name {
		color: var(--text-light);
		font-weight: 600;
		margin-bottom: 0.75rem;
	}

	.progress-bar {
		height: 6px;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
		margin-bottom: 0.5rem;
		overflow: hidden;
	}

	.progress {
		height: 100%;
		background-color: var(--primary);
		border-radius: 3px;
	}

	.progress-text {
		color: var(--text-gray);
		font-size: 0.875rem;
	}

	/* Mobile styles */
	.mobile-menu-toggle {
		display: none;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: fixed;
			left: -250px;
			top: 0;
			bottom: 0;
			z-index: 100;
			transition: left 0.3s ease;
			box-shadow: none;
		}

		.sidebar.open {
			left: 0;
			box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
		}

		.mobile-menu-toggle {
			display: flex;
			align-items: center;
			background-color: var(--dark-gray);
			border: none;
			border-radius: 0 4px 4px 0;
			color: var(--text-light);
			padding: 0.75rem 1rem;
			cursor: pointer;
			position: fixed;
			left: 0;
			top: 70px;
			z-index: 101;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		}

		.toggle-text {
			margin-left: 0.5rem;
		}
	}
</style>
