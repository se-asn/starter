<!-- LaufplanerPro - Admin Dashboard for Application Management -->

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase';

	interface Application {
		id: string;
		created_at: string;
		updated_at: string;
		status: string;
		admin_notes: string;
		reviewed_by: string;
		reviewed_at: string;

		first_name: string;
		last_name: string;
		email: string;
		phone: string;
		birth_date: string;
		gender: string;
		location: string;

		experience: number;
		primary_discipline: string;
		current_level: string;
		weekly_training_hours: number;

		performance_score: number;
		experience_score: number;
		motivation_score: number;
		total_score: number;
		auto_recommendation: string;

		goals_2025: string;
		motivation: string;
		devices: string;
	}

	let applications: Application[] = [];
	let selectedApplication: Application | null = null;
	let loading = false;
	let error = '';
	let success = '';
	let mounted = false;

	// Filter and pagination
	let statusFilter = 'all';
	let currentPage = 1;
	let totalPages = 1;
	let totalApplications = 0;

	// Admin user check
	let isAdmin = false;
	let adminUser: any = null;

	onMount(async () => {
		mounted = true;
		await checkAdminAccess();
		if (isAdmin) {
			await loadApplications();
		}
	});

	async function checkAdminAccess() {
		try {
			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (!user) {
				goto('/auth');
				return;
			}

			// Check if user is admin
			const { data: admin } = await supabase
				.from('admin_users')
				.select('*')
				.eq('user_id', user.id)
				.single();

			if (!admin) {
				goto('/dashboard');
				return;
			}

			isAdmin = true;
			adminUser = admin;
		} catch (err) {
			console.error('Admin check error:', err);
			goto('/auth');
		}
	}

	async function loadApplications() {
		loading = true;
		error = '';

		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) throw new Error('No session');

			const params = new URLSearchParams({
				page: currentPage.toString(),
				limit: '20'
			});

			if (statusFilter !== 'all') {
				params.append('status', statusFilter);
			}

			const response = await fetch(`/api/applications?${params}`, {
				headers: {
					Authorization: `Bearer ${session.access_token}`
				}
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error);
			}

			applications = result.applications;
			totalApplications = result.pagination.total;
			totalPages = result.pagination.totalPages;
		} catch (err) {
			console.error('Load applications error:', err);
			error = 'Error loading applications.';
		} finally {
			loading = false;
		}
	}

	async function updateApplicationStatus(applicationId: string, status: string, notes?: string) {
		loading = true;
		error = '';
		success = '';

		try {
			const {
				data: { session }
			} = await supabase.auth.getSession();
			if (!session) throw new Error('No session');

			const response = await fetch(`/api/applications/${applicationId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`
				},
				body: JSON.stringify({
					status,
					adminNotes: notes,
					adminId: adminUser.user_id
				})
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error);
			}

			success = 'Status updated successfully!';
			await loadApplications();

			// Close detail view if it was open
			selectedApplication = null;
		} catch (err) {
			console.error('Update status error:', err);
			error = 'Error updating status.';
		} finally {
			loading = false;
		}
	}

	function selectApplication(app: Application) {
		selectedApplication = app;
	}

	function closeDetailView() {
		selectedApplication = null;
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'pending':
				return 'var(--warning-color)';
			case 'reviewing':
				return 'var(--info-color)';
			case 'approved':
				return 'var(--success-color)';
			case 'rejected':
				return 'var(--error-color)';
			case 'on_hold':
				return 'var(--neutral-color)';
			default:
				return 'var(--neural-text)';
		}
	}

	function getRecommendationIcon(recommendation: string): string {
		switch (recommendation) {
			case 'approve':
				return '✅';
			case 'reject':
				return '❌';
			default:
				return '🔍';
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	async function changePage(page: number) {
		currentPage = page;
		await loadApplications();
	}

	async function changeStatusFilter(status: string) {
		statusFilter = status;
		currentPage = 1;
		await loadApplications();
	}
</script>

<svelte:head>
	<title>Admin Dashboard - LaufplanerPro</title>
</svelte:head>

{#if !mounted}
	<div class="loading-container">
		<div class="loader"></div>
		<p>Checking admin access...</p>
	</div>
{:else if !isAdmin}
	<div class="error-container">
		<h1>🚫 Access Denied</h1>
		<p>You don't have admin access to this page.</p>
	</div>
{:else}
	<div class="admin-container">
		<!-- Header -->
		<header class="admin-header">
			<div class="header-content">
				<div class="header-left">
					<h1>🏃‍♂️ Admin Dashboard</h1>
					<p>Athlete Application Management</p>
				</div>
				<div class="header-right">
					<span class="admin-badge">Admin: {adminUser?.role}</span>
					<button class="btn-secondary" on:click={() => goto('/dashboard')}>
						← Back to Dashboard
					</button>
				</div>
			</div>
		</header>

		<!-- Alerts -->
		{#if error}
			<div class="alert error">
				<span class="alert-icon">⚠️</span>
				{error}
			</div>
		{/if}

		{#if success}
			<div class="alert success">
				<span class="alert-icon">✅</span>
				{success}
			</div>
		{/if}

		<!-- Filters and Stats -->
		<div class="admin-controls">
			<div class="filter-section">
				<h3>Filter by Status:</h3>
				<div class="filter-buttons">
					<button
						class="filter-btn"
						class:active={statusFilter === 'all'}
						on:click={() => changeStatusFilter('all')}
					>
						All ({totalApplications})
					</button>
					<button
						class="filter-btn"
						class:active={statusFilter === 'pending'}
						on:click={() => changeStatusFilter('pending')}
					>
						Pending
					</button>
					<button
						class="filter-btn"
						class:active={statusFilter === 'reviewing'}
						on:click={() => changeStatusFilter('reviewing')}
					>
						Reviewing
					</button>
					<button
						class="filter-btn"
						class:active={statusFilter === 'approved'}
						on:click={() => changeStatusFilter('approved')}
					>
						Approved
					</button>
					<button
						class="filter-btn"
						class:active={statusFilter === 'rejected'}
						on:click={() => changeStatusFilter('rejected')}
					>
						Rejected
					</button>
				</div>
			</div>

			<div class="refresh-section">
				<button class="btn-primary" on:click={loadApplications} disabled={loading}>
					{loading ? '🔄 Loading...' : '🔄 Refresh'}
				</button>
			</div>
		</div>

		<!-- Applications List -->
		<div class="applications-section">
			{#if loading && applications.length === 0}
				<div class="loading-state">
					<div class="loader"></div>
					<p>Loading applications...</p>
				</div>
			{:else if applications.length === 0}
				<div class="empty-state">
					<h3>No applications found</h3>
					<p>No applications match the current filter criteria.</p>
				</div>
			{:else}
				<div class="applications-grid">
					{#each applications as app}
						<button
							class="application-card"
							on:click={() => selectApplication(app)}
							on:keydown={(e) => e.key === 'Enter' && selectApplication(app)}
							tabindex="0"
						>
							<div class="app-header">
								<div class="app-name">
									<h4>{app.first_name} {app.last_name}</h4>
									<span class="app-email">{app.email}</span>
								</div>
								<div class="app-status" style="color: {getStatusColor(app.status)}">
									{app.status.toUpperCase()}
								</div>
							</div>

							<div class="app-details">
								<div class="detail-row">
									<span class="label">Sport:</span>
									<span>{app.primary_discipline} ({app.current_level})</span>
								</div>
								<div class="detail-row">
									<span class="label">Experience:</span>
									<span>{app.experience} years</span>
								</div>
								<div class="detail-row">
									<span class="label">Applied:</span>
									<span>{formatDate(app.created_at)}</span>
								</div>
							</div>

							<div class="app-scoring">
								<div class="score-section">
									<span class="score-label">Total Score:</span>
									<span class="score-value">{app.total_score}/100</span>
								</div>
								<div class="recommendation">
									{getRecommendationIcon(app.auto_recommendation)}
									{app.auto_recommendation.toUpperCase()}
								</div>
							</div>
						</button>
					{/each}
				</div>

				<!-- Pagination -->
				{#if totalPages > 1}
					<div class="pagination">
						<button
							class="page-btn"
							disabled={currentPage === 1}
							on:click={() => changePage(currentPage - 1)}
						>
							← Previous
						</button>

						<span class="page-info">
							Page {currentPage} of {totalPages}
						</span>

						<button
							class="page-btn"
							disabled={currentPage === totalPages}
							on:click={() => changePage(currentPage + 1)}
						>
							Next →
						</button>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Application Detail Modal -->
		{#if selectedApplication}
			<div
				class="modal-overlay"
				on:click={closeDetailView}
				on:keydown={(e) => e.key === 'Escape' && closeDetailView()}
				role="dialog"
				aria-modal="true"
				tabindex="-1"
			>
				<div class="application-detail">
					<div class="detail-header">
						<h2>{selectedApplication.first_name} {selectedApplication.last_name}</h2>
						<button class="close-btn" on:click={closeDetailView}>×</button>
					</div>

					<div class="detail-content">
						<!-- Personal Info Section -->
						<section class="detail-section">
							<h3>👤 Personal Information</h3>
							<div class="detail-grid">
								<div><strong>Email:</strong> {selectedApplication.email}</div>
								<div><strong>Phone:</strong> {selectedApplication.phone || 'N/A'}</div>
								<div><strong>Birth Date:</strong> {selectedApplication.birth_date || 'N/A'}</div>
								<div><strong>Gender:</strong> {selectedApplication.gender || 'N/A'}</div>
								<div><strong>Location:</strong> {selectedApplication.location || 'N/A'}</div>
							</div>
						</section>

						<!-- Athletic Background -->
						<section class="detail-section">
							<h3>🏃‍♂️ Athletic Background</h3>
							<div class="detail-grid">
								<div>
									<strong>Primary Discipline:</strong>
									{selectedApplication.primary_discipline}
								</div>
								<div><strong>Current Level:</strong> {selectedApplication.current_level}</div>
								<div><strong>Experience:</strong> {selectedApplication.experience} years</div>
								<div>
									<strong>Weekly Training Hours:</strong>
									{selectedApplication.weekly_training_hours || 'N/A'}
								</div>
							</div>
						</section>

						<!-- Goals & Motivation -->
						<section class="detail-section">
							<h3>🎯 Goals & Motivation</h3>
							<div class="text-section">
								<div><strong>2025 Goals:</strong></div>
								<p>{selectedApplication.goals_2025}</p>
							</div>
							<div class="text-section">
								<div><strong>Motivation:</strong></div>
								<p>{selectedApplication.motivation}</p>
							</div>
						</section>

						<!-- Scoring -->
						<section class="detail-section">
							<h3>📊 Automatic Scoring</h3>
							<div class="scoring-details">
								<div class="score-item">
									<span>Performance Score:</span>
									<span>{selectedApplication.performance_score}/40</span>
								</div>
								<div class="score-item">
									<span>Experience Score:</span>
									<span>{selectedApplication.experience_score}/30</span>
								</div>
								<div class="score-item">
									<span>Motivation Score:</span>
									<span>{selectedApplication.motivation_score}/30</span>
								</div>
								<div class="score-item total-score">
									<span><strong>Total Score:</strong></span>
									<span><strong>{selectedApplication.total_score}/100</strong></span>
								</div>
								<div class="recommendation-display">
									Recommendation: {getRecommendationIcon(selectedApplication.auto_recommendation)}
									{selectedApplication.auto_recommendation.toUpperCase()}
								</div>
							</div>
						</section>

						<!-- Admin Actions -->
						<section class="detail-section">
							<h3>⚙️ Admin Actions</h3>
							<div class="action-buttons">
								<button
									class="action-btn approve"
									on:click={() =>
										selectedApplication &&
										updateApplicationStatus(selectedApplication.id, 'approved')}
									disabled={loading || selectedApplication?.status === 'approved'}
								>
									✅ Approve
								</button>
								<button
									class="action-btn reject"
									on:click={() =>
										selectedApplication &&
										updateApplicationStatus(selectedApplication.id, 'rejected')}
									disabled={loading || selectedApplication?.status === 'rejected'}
								>
									❌ Reject
								</button>
								<button
									class="action-btn review"
									on:click={() =>
										selectedApplication &&
										updateApplicationStatus(selectedApplication.id, 'reviewing')}
									disabled={loading || selectedApplication?.status === 'reviewing'}
								>
									🔍 Set to Review
								</button>
								<button
									class="action-btn hold"
									on:click={() =>
										selectedApplication &&
										updateApplicationStatus(selectedApplication.id, 'on_hold')}
									disabled={loading || selectedApplication?.status === 'on_hold'}
								>
									⏸️ Put on Hold
								</button>
							</div>
						</section>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.admin-container {
		min-height: 100vh;
		background: var(--neural-bg);
		color: var(--neural-text);
		padding: 2rem;
	}

	.loading-container,
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		text-align: center;
	}

	.loader {
		width: 40px;
		height: 40px;
		border: 3px solid var(--neural-border);
		border-top: 3px solid var(--neural-accent);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Header */
	.admin-header {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.header-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.header-left h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: 200;
	}

	.header-left p {
		margin: 0;
		opacity: 0.8;
	}

	.admin-badge {
		background: var(--neural-accent);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.8rem;
		margin-right: 1rem;
	}

	/* Alerts */
	.alert {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-radius: 12px;
		margin-bottom: 1.5rem;
	}

	.alert.error {
		background: rgba(255, 68, 68, 0.15);
		border: 1px solid rgba(255, 68, 68, 0.3);
		color: #ff6b6b;
	}

	.alert.success {
		background: rgba(76, 175, 80, 0.15);
		border: 1px solid rgba(76, 175, 80, 0.3);
		color: #4caf50;
	}

	/* Controls */
	.admin-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 1.5rem;
		margin-bottom: 2rem;
	}

	.filter-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		font-weight: 300;
	}

	.filter-buttons {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.filter-btn {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		color: var(--neural-text);
		padding: 0.5rem 1rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all var(--neural-transition);
		font-size: 0.9rem;
	}

	.filter-btn:hover {
		background: var(--neural-hover);
	}

	.filter-btn.active {
		background: var(--neural-accent);
		color: white;
		border-color: var(--neural-accent);
	}

	/* Applications Grid */
	.applications-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
	}

	.application-card {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		padding: 1.5rem;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.application-card:hover {
		background: var(--neural-hover);
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	.app-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.app-name h4 {
		margin: 0 0 0.25rem 0;
		font-size: 1.1rem;
		font-weight: 300;
	}

	.app-email {
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.app-status {
		font-size: 0.8rem;
		font-weight: 500;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.1);
	}

	.app-details {
		margin-bottom: 1rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}

	.label {
		opacity: 0.7;
		font-weight: 300;
	}

	.app-scoring {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		border-top: 1px solid var(--neural-border);
	}

	.score-section {
		display: flex;
		gap: 0.5rem;
	}

	.score-value {
		font-weight: 500;
		color: var(--neural-accent);
	}

	.recommendation {
		font-size: 0.8rem;
		padding: 0.25rem 0.5rem;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.1);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		margin-top: 2rem;
		padding: 1rem;
	}

	.page-btn {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		color: var(--neural-text);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		transition: all var(--neural-transition);
	}

	.page-btn:hover:not(:disabled) {
		background: var(--neural-hover);
	}

	.page-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-info {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 2rem;
	}

	.application-detail {
		background: var(--neural-bg);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		overflow-y: auto;
	}

	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem;
		border-bottom: 1px solid var(--neural-border);
	}

	.detail-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 200;
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--neural-text);
		font-size: 2rem;
		cursor: pointer;
		padding: 0;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background var(--neural-transition);
	}

	.close-btn:hover {
		background: var(--neural-hover);
	}

	.detail-content {
		padding: 2rem;
	}

	.detail-section {
		margin-bottom: 2rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px solid var(--neural-border);
	}

	.detail-section:last-child {
		border-bottom: none;
		margin-bottom: 0;
	}

	.detail-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1.1rem;
		font-weight: 300;
		color: var(--neural-accent);
	}

	.detail-grid {
		display: grid;
		gap: 0.75rem;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	}

	.text-section {
		margin-bottom: 1rem;
	}

	.text-section p {
		margin: 0.5rem 0 0 0;
		line-height: 1.6;
		background: var(--neural-glass);
		padding: 1rem;
		border-radius: 8px;
		border: 1px solid var(--neural-border);
	}

	.scoring-details {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 12px;
		padding: 1.5rem;
	}

	.score-item {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.score-item:last-child {
		border-bottom: none;
	}

	.score-item.total-score {
		font-size: 1.1rem;
		padding-top: 1rem;
		margin-top: 0.5rem;
		border-top: 2px solid var(--neural-accent);
	}

	.recommendation-display {
		text-align: center;
		margin-top: 1rem;
		padding: 0.75rem;
		background: rgba(0, 212, 255, 0.1);
		border: 1px solid var(--neural-accent);
		border-radius: 8px;
		font-weight: 300;
	}

	.action-buttons {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	}

	.action-btn {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 300;
		transition: all var(--neural-transition);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
	}

	.action-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.approve {
		background: #4caf50;
		color: white;
	}

	.action-btn.reject {
		background: #f44336;
		color: white;
	}

	.action-btn.review {
		background: #2196f3;
		color: white;
	}

	.action-btn.hold {
		background: #ff9800;
		color: white;
	}

	.action-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	/* Buttons */
	.btn-primary,
	.btn-secondary {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 300;
		transition: all var(--neural-transition);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
	}

	.btn-primary {
		background: var(--neural-gradient);
		border: none;
		color: white;
	}

	.btn-secondary {
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		color: var(--neural-text);
	}

	.btn-primary:hover,
	.btn-secondary:hover {
		transform: translateY(-2px);
		box-shadow: var(--neural-shadow);
	}

	/* Loading and Empty States */
	.loading-state,
	.empty-state {
		text-align: center;
		padding: 3rem;
		background: var(--neural-glass);
		border: 1px solid var(--neural-border);
		border-radius: 16px;
	}

	.empty-state h3 {
		margin: 0 0 1rem 0;
		font-weight: 300;
	}

	/* Responsive */
	@media (max-width: 768px) {
		.admin-container {
			padding: 1rem;
		}

		.header-content {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}

		.admin-controls {
			flex-direction: column;
			gap: 1.5rem;
		}

		.applications-grid {
			grid-template-columns: 1fr;
		}

		.modal-overlay {
			padding: 1rem;
		}

		.detail-grid {
			grid-template-columns: 1fr;
		}

		.action-buttons {
			grid-template-columns: 1fr;
		}
	}

	/* CSS Variables */
	:root {
		--success-color: #4caf50;
		--error-color: #f44336;
		--warning-color: #ff9800;
		--info-color: #2196f3;
		--neutral-color: #9e9e9e;
	}
</style>
