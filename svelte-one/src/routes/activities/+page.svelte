<!-- Activities page -->
<!-- src/routes/activities/+page.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  // Authentication
  let user = null;
  let authToken = '';
  
  // Activities data
  let activities = [];
  let summary = [];
  let loading = true;
  let error = '';
  
  // Filters and pagination
  let activityType = '';
  let currentPage = 0;
  let pageSize = 10;
  let totalActivities = 0;
  let hasMore = false;

  onMount(async () => {
    // Check authentication
    authToken = localStorage.getItem('authToken') || '';
    const userStr = localStorage.getItem('user');
    
    if (!authToken) {
      goto('/auth');
      return;
    }
    
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        goto('/auth');
        return;
      }
    }
    
    await loadActivities();
  });

  async function loadActivities() {
    loading = true;
    error = '';
    
    try {
      const params = new URLSearchParams({
        limit: pageSize.toString(),
        offset: (currentPage * pageSize).toString()
      });
      
      if (activityType) {
        params.append('type', activityType);
      }
      
      const response = await fetch(`/api/activities?${params}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        activities = data.activities;
        summary = data.summary;
        totalActivities = data.pagination.total;
        hasMore = data.pagination.hasMore;
      } else {
        error = data.error || 'Failed to load activities';
        if (response.status === 401) {
          goto('/auth');
        }
      }
    } catch (err) {
      error = 'Failed to load activities';
      console.error('Activities error:', err);
    } finally {
      loading = false;
    }
  }

  function formatDuration(seconds) {
    if (!seconds) return '—';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  function formatDistance(meters) {
    if (!meters) return '—';
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} m`;
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function getActivityIcon(type) {
    switch (type) {
      case 'swim': return '🏊‍♂️';
      case 'bike': case 'cycling': return '🚴‍♂️';
      case 'run': case 'running': return '🏃‍♂️';
      case 'brick': return '🧱';
      default: return '💪';
    }
  }

  function filterByType(type) {
    activityType = activityType === type ? '' : type;
    currentPage = 0;
    loadActivities();
  }

  function nextPage() {
    if (hasMore) {
      currentPage++;
      loadActivities();
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage--;
      loadActivities();
    }
  }
</script>

<svelte:head>
  <title>Activities - Triathlon Coach</title>
</svelte:head>

<div class="activities-page">
  <header class="page-header">
    <h1>🏃‍♂️ Your Activities</h1>
    <div class="header-actions">
      <a href="/dashboard" class="back-btn">← Dashboard</a>
    </div>
  </header>

  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading activities...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadActivities} class="retry-btn">Try Again</button>
    </div>
  {:else}
    <!-- Summary Cards -->
    {#if summary.length > 0}
      <section class="summary">
        <h2>Last 30 Days Summary</h2>
        <div class="summary-cards">
          {#each summary as stat}
            <div class="summary-card">
              <div class="summary-icon">{getActivityIcon(stat.activity_type)}</div>
              <div class="summary-info">
                <h3>{stat.activity_type}</h3>
                <p class="summary-count">{stat.count} activities</p>
                <p class="summary-stats">
                  {formatDistance(stat.total_distance)} • {formatDuration(stat.total_duration)}
                </p>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Activity Filters -->
    <section class="filters">
      <h2>Activity Type</h2>
      <div class="filter-buttons">
        <button 
          class="filter-btn" 
          class:active={activityType === ''}
          on:click={() => filterByType('')}
        >
          All
        </button>
        <button 
          class="filter-btn" 
          class:active={activityType === 'swim'}
          on:click={() => filterByType('swim')}
        >
          🏊‍♂️ Swim
        </button>
        <button 
          class="filter-btn" 
          class:active={activityType === 'bike'}
          on:click={() => filterByType('bike')}
        >
          🚴‍♂️ Bike
        </button>
        <button 
          class="filter-btn" 
          class:active={activityType === 'run'}
          on:click={() => filterByType('run')}
        >
          🏃‍♂️ Run
        </button>
      </div>
    </section>

    <!-- Activities List -->
    <section class="activities">
      <h2>Activities ({totalActivities})</h2>
      {#if activities.length === 0}
        <div class="empty-state">
          <p>No activities found. Connect your training apps to import your workouts!</p>
          <a href="/dashboard" class="connect-btn">Connect Apps</a>
        </div>
      {:else}
        <div class="activities-list">
          {#each activities as activity}
            <div class="activity-card">
              <div class="activity-icon">
                {getActivityIcon(activity.activity_type)}
              </div>
              <div class="activity-info">
                <h3>{activity.name || `${activity.activity_type} activity`}</h3>
                <p class="activity-date">{formatDate(activity.start_time)}</p>
                <div class="activity-stats">
                  <span class="stat">
                    <strong>{formatDistance(activity.distance_meters)}</strong>
                  </span>
                  <span class="stat">
                    <strong>{formatDuration(activity.duration_seconds)}</strong>
                  </span>
                  {#if activity.avg_heart_rate}
                    <span class="stat">
                      <strong>{Math.round(activity.avg_heart_rate)} bpm</strong>
                    </span>
                  {/if}
                </div>
                <div class="activity-source">
                  <span class="provider">{activity.provider}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            on:click={prevPage} 
            disabled={currentPage === 0}
            class="page-btn"
          >
            ← Previous
          </button>
          <span class="page-info">
            Page {currentPage + 1} of {Math.ceil(totalActivities / pageSize)}
          </span>
          <button 
            on:click={nextPage} 
            disabled={!hasMore}
            class="page-btn"
          >
            Next →
          </button>
        </div>
      {/if}
    </section>
  {/if}
</div>

<style>
  .activities-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e9ecef;
  }

  .page-header h1 {
    margin: 0;
    color: #333;
    font-size: 2rem;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    color: #495057;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
  }

  .back-btn:hover {
    background: #e9ecef;
  }

  .loading {
    text-align: center;
    padding: 3rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e9ecef;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error {
    text-align: center;
    padding: 2rem;
    color: #dc3545;
  }

  .retry-btn {
    padding: 0.5rem 1rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .summary {
    margin-bottom: 2rem;
  }

  .summary h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .summary-card {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .summary-icon {
    font-size: 2rem;
  }

  .summary-info h3 {
    margin: 0 0 0.25rem 0;
    text-transform: capitalize;
    color: #333;
  }

  .summary-count {
    font-weight: 600;
    color: #007bff;
    margin: 0;
  }

  .summary-stats {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
  }

  .filters {
    margin-bottom: 2rem;
  }

  .filters h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-btn:hover {
    background: #f8f9fa;
  }

  .filter-btn.active {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }

  .activities h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .connect-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    margin-top: 1rem;
  }

  .activities-list {
    display: grid;
    gap: 1rem;
  }

  .activity-card {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: box-shadow 0.2s;
  }

  .activity-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .activity-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .activity-info {
    flex: 1;
  }

  .activity-info h3 {
    margin: 0 0 0.25rem 0;
    color: #333;
  }

  .activity-date {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }

  .activity-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.5rem;
  }

  .stat {
    font-size: 0.9rem;
    color: #495057;
  }

  .provider {
    background: #e9ecef;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.8rem;
    color: #495057;
    text-transform: capitalize;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #dee2e6;
  }

  .page-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .page-btn:hover:not(:disabled) {
    background: #f8f9fa;
  }

  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    color: #666;
  }

  @media (max-width: 768px) {
    .activities-page {
      padding: 1rem;
    }
    
    .page-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
    
    .summary-cards {
      grid-template-columns: 1fr;
    }
    
    .activity-card {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .activity-stats {
      flex-wrap: wrap;
    }
    
    .pagination {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
