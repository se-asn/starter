<!-- Dashboard für API Integrationen -->
<!-- src/routes/dashboard/+page.svelte -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { ClientAuth } from '$lib/client-auth';
  
  // User state
  let user = null;
  let authToken = '';
  
  // Database connection status (simulated for GitHub Pages)
  let databaseStatus = {
    connected: true,
    loading: false,
    tables: ['athletes', 'activities', 'training_plans', 'api_connections'],
    recordCounts: {
      athletes: 156,
      activities: 2847,
      training_plans: 42,
      api_connections: 89
    },
    error: null
  };
  
  // API Integrations
  let integrations = [
    {
      id: 'strava',
      name: 'Strava',
      description: 'Sync activities, segments and performance data',
      icon: '🚴‍♂️',
      connected: false,
      lastSync: null,
      activities: 0
    },
    {
      id: 'garmin',
      name: 'Garmin Connect',
      description: 'Import workouts and health metrics',
      icon: '⌚',
      connected: false,
      lastSync: null,
      activities: 0
    },
    {
      id: 'polar',
      name: 'Polar Flow',
      description: 'Training data and recovery metrics',
      icon: '❄️',
      connected: false,
      lastSync: null,
      activities: 0
    },
    {
      id: 'wahoo',
      name: 'Wahoo',
      description: 'Bike computer and trainer data',
      icon: '📊',
      connected: false,
      lastSync: null,
      activities: 0
    }
  ];
  
  let statusMessage = '';
  let statusType: 'success' | 'error' | '' = '';
  onMount(() => {
    // Check authentication using ClientAuth
    if (!ClientAuth.isAuthenticated()) {
      goto('/auth');
      return;
    }
    
    user = ClientAuth.getCurrentUser();
    authToken = localStorage.getItem('authToken') || '';
    
    // Simulate some connected integrations for demo    integrations[0].connected = true; // Strava
    integrations[0].lastSync = new Date().toISOString();
    integrations[0].activities = 127;
    
    integrations[1].connected = true; // Garmin
    integrations[1].lastSync = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
    integrations[1].activities = 89;
    
    // Check URL params for OAuth callbacks
    const urlParams = new URLSearchParams($page.url.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    
    if (success === 'strava_connected') {
      statusMessage = 'Strava successfully connected! 🎉';
      statusType = 'success';
      // Update Strava connection status
      const strava = integrations.find(i => i.id === 'strava');
      if (strava) strava.connected = true;
    }
    
    if (error) {
      statusMessage = getErrorMessage(error);
      statusType = 'error';
    }
    
    // Clear URL params after 3 seconds
    if (success || error) {
      setTimeout(() => {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
        statusMessage = '';
      }, 3000);
    }
  });
  
  function getErrorMessage(error: string): string {
    switch (error) {
      case 'strava_auth_denied':
        return 'Strava connection was denied. Please try again.';
      case 'strava_auth_failed':
        return 'Failed to connect to Strava. Please try again.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
  
  function connectIntegration(id: string) {
    switch (id) {
      case 'strava':
        window.location.href = '/api/integrations/strava?action=auth';
        break;
      case 'garmin':
        // TODO: Implement Garmin OAuth
        alert('Garmin integration coming soon!');
        break;
      case 'polar':
        // TODO: Implement Polar OAuth  
        alert('Polar integration coming soon!');
        break;
      case 'wahoo':
        // TODO: Implement Wahoo OAuth
        alert('Wahoo integration coming soon!');
        break;
    }
  }
    function syncIntegration(id: string) {
    // Trigger manual sync
    fetch(`/api/integrations/${id}?action=sync`, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        statusMessage = `${id} sync started!`;
        statusType = 'success';
      })
      .catch(error => {
        statusMessage = `Failed to sync ${id}`;
        statusType = 'error';
      });
  }
  
  function disconnectIntegration(id: string) {
    if (confirm(`Are you sure you want to disconnect ${id}?`)) {
      // TODO: Implement disconnect
      const integration = integrations.find(i => i.id === id);
      if (integration) {
        integration.connected = false;
        integration.lastSync = null;
        integration.activities = 0;
      }
    }
  }
    function logout() {
    ClientAuth.logout();
    goto('/auth');
  }
  
  // Test database connection
  async function testDatabaseConnection() {
    databaseStatus.loading = true;
    try {
      const response = await fetch('/api/test/database');
      const data = await response.json();
      
      if (data.success) {
        databaseStatus = {
          connected: true,
          loading: false,
          tables: data.database.tables || [],
          recordCounts: data.database.recordCounts || {},
          error: null
        };
      } else {
        databaseStatus = {
          connected: false,
          loading: false,
          tables: [],
          recordCounts: {},
          error: data.error || 'Unknown error'
        };
      }
    } catch (error) {
      databaseStatus = {
        connected: false,
        loading: false,
        tables: [],
        recordCounts: {},
        error: error.message
      };
    }
  }
  
  onMount(async () => {
    // Test database on page load
    await testDatabaseConnection();
  });
</script>

<svelte:head>
  <title>Triathlon Coach - Dashboard</title>
  <meta name="description" content="Connect your training devices and apps to track your triathlon performance" />
</svelte:head>

<div class="dashboard">  <header class="header">
    <div class="header-content">
      <div class="header-title">
        <h1>🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Coach Dashboard</h1>
        <p>Connect your training apps and devices to track your performance</p>
      </div>
      <div class="header-user">
        {#if user}
          <div class="user-info">
            <span class="user-name">Welcome, {user.name}!</span>
            <button on:click={logout} class="logout-btn">Logout</button>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <!-- Database Status Section -->
  <section class="database-status">
    <h2>📊 Database Status</h2>
    {#if databaseStatus.loading}
      <div class="status-card loading">
        <div class="status-icon">⏳</div>
        <div class="status-info">
          <h3>Testing Connection...</h3>
          <p>Checking Cloudflare D1 database...</p>
        </div>
      </div>
    {:else if databaseStatus.connected}
      <div class="status-card connected">
        <div class="status-icon">✅</div>
        <div class="status-info">
          <h3>Database Connected</h3>
          <p>Cloudflare D1 • {databaseStatus.tables.length} tables ready</p>
          <div class="table-stats">
            {#each databaseStatus.tables as table}
              {#if table !== '_cf_METADATA'}
                <span class="table-stat">
                  {table}: {databaseStatus.recordCounts[table] || 0}
                </span>
              {/if}
            {/each}
          </div>
        </div>
        <button class="test-btn" on:click={testDatabaseConnection}>
          🔄 Refresh
        </button>
      </div>
    {:else}
      <div class="status-card error">
        <div class="status-icon">❌</div>
        <div class="status-info">
          <h3>Database Error</h3>
          <p>{databaseStatus.error || 'Connection failed'}</p>
        </div>
        <button class="test-btn" on:click={testDatabaseConnection}>
          🔄 Retry
        </button>
      </div>
    {/if}
  </section>

  {#if statusMessage}
    <div class="status-message {statusType}">
      {statusMessage}
    </div>
  {/if}

  <!-- Quick Navigation -->
  <section class="quick-nav">
    <h2>🚀 Quick Actions</h2>
    <div class="nav-cards">
      <a href="/activities" class="nav-card">
        <div class="nav-icon">🏃‍♂️</div>
        <div class="nav-info">
          <h3>View Activities</h3>
          <p>Browse your training history and performance data</p>
        </div>
      </a>
      <a href="/profile" class="nav-card">
        <div class="nav-icon">👤</div>
        <div class="nav-info">
          <h3>Profile Settings</h3>
          <p>Update your athlete profile and training zones</p>
        </div>
      </a>
      <a href="/training-plans" class="nav-card">
        <div class="nav-icon">📋</div>
        <div class="nav-info">
          <h3>Training Plans</h3>
          <p>AI-generated personalized training schedules</p>
        </div>
      </a>
    </div>
  </section>

  <!-- API Integrations Section -->
  <div class="integrations-grid">
    {#each integrations as integration}
      <div class="integration-card" class:connected={integration.connected}>
        <div class="integration-header">
          <span class="integration-icon">{integration.icon}</span>
          <h3>{integration.name}</h3>
          <div class="connection-status">
            {#if integration.connected}
              <span class="status-dot connected"></span>
              <span>Connected</span>
            {:else}
              <span class="status-dot"></span>
              <span>Not connected</span>
            {/if}
          </div>
        </div>
        
        <p class="integration-description">{integration.description}</p>
        
        {#if integration.connected}
          <div class="integration-stats">
            <div class="stat">
              <strong>{integration.activities}</strong>
              <span>Activities</span>
            </div>
            <div class="stat">
              <strong>{integration.lastSync || 'Never'}</strong>
              <span>Last Sync</span>
            </div>
          </div>
          
          <div class="integration-actions">
            <button 
              class="btn-secondary"
              on:click={() => syncIntegration(integration.id)}
            >
              🔄 Sync Now
            </button>
            <button 
              class="btn-danger"
              on:click={() => disconnectIntegration(integration.id)}
            >
              🔌 Disconnect
            </button>
          </div>
        {:else}
          <div class="integration-actions">
            <button 
              class="btn-primary"
              on:click={() => connectIntegration(integration.id)}
            >
              🔗 Connect {integration.name}
            </button>
          </div>
        {/if}
      </div>
    {/each}
  </div>
  
  <div class="help-section">
    <h2>🤔 Need Help?</h2>
    <div class="help-cards">
      <div class="help-card">
        <h4>🔗 Connecting Apps</h4>
        <p>Click "Connect" and authorize the app to access your training data. We only read your activities and performance metrics.</p>
      </div>
      <div class="help-card">
        <h4>📊 Data Privacy</h4>
        <p>Your data is securely stored and never shared. You can disconnect any app at any time.</p>
      </div>
      <div class="help-card">
        <h4>⚡ Auto Sync</h4>
        <p>Connected apps automatically sync new activities. Manual sync is available for immediate updates.</p>
      </div>
    </div>
  </div>
  
  <div class="database-status">
    <h2>🗄️ Database Connection</h2>
    <div class="status-message {databaseStatus.connected ? 'success' : 'error'}">
      {#if databaseStatus.loading}
        Testing database connection...
      {:else if databaseStatus.connected}
        Database connected successfully! 🎉
      {:else}
        Failed to connect to database: {databaseStatus.error}
      {/if}
    </div>
    
    <button 
      class="btn-primary"
      on:click={testDatabaseConnection}
      disabled={databaseStatus.loading}
    >
      {#if databaseStatus.loading}
        <span class="loader"></span> Testing...
      {:else}
        🔄 Test Database Connection
      {/if}
    </button>
    
    {#if databaseStatus.connected}
      <div class="database-info">
        <h3>Database Tables:</h3>
        <ul>
          {#each databaseStatus.tables as table}
            <li>{table} ({databaseStatus.recordCounts[table] || 0} records)</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style>
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
    .header {
    margin-bottom: 3rem;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .header-title {
    text-align: left;
  }
  
  .header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #1a1a1a;
  }
  
  .header p {
    font-size: 1.2rem;
    color: #666;
    margin: 0;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .user-name {
    font-weight: 600;
    color: #333;
  }
  
  .logout-btn {
    padding: 0.5rem 1rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    color: #495057;
    transition: all 0.2s;
  }
  
  .logout-btn:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }
  
  .status-message {
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    text-align: center;
    font-weight: 600;
  }
  
  .status-message.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .status-message.error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  .integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .integration-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.2s ease;
  }
  
  .integration-card:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  }
  
  .integration-card.connected {
    border-color: #28a745;
    background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
  }
  
  .integration-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .integration-icon {
    font-size: 2rem;
  }
  
  .integration-header h3 {
    flex: 1;
    margin: 0;
    font-size: 1.3rem;
  }
  
  .connection-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }
  
  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #dc3545;
  }
  
  .status-dot.connected {
    background: #28a745;
  }
  
  .integration-description {
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  .integration-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat strong {
    display: block;
    font-size: 1.2rem;
    color: #007bff;
  }
  
  .stat span {
    font-size: 0.9rem;
    color: #666;
  }
  
  .integration-actions {
    display: flex;
    gap: 1rem;
  }

  /* Database Status Styles */
  .database-status {
    margin-bottom: 2rem;
  }

  .database-status h2 {
    margin-bottom: 1rem;
    color: #333;
  }

  .status-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 12px;
    border: 2px solid #e9ecef;
    background: #fff;
    transition: all 0.3s ease;
  }

  .status-card.connected {
    border-color: #28a745;
    background: #f8fff9;
  }

  .status-card.error {
    border-color: #dc3545;
    background: #fff8f8;
  }

  .status-card.loading {
    border-color: #ffc107;
    background: #fffdf5;
  }

  .status-icon {
    font-size: 2rem;
    min-width: 3rem;
    text-align: center;
  }

  .status-info {
    flex: 1;
  }

  .status-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: #333;
  }

  .status-info p {
    margin: 0 0 0.5rem 0;
    color: #666;
    font-size: 0.9rem;
  }

  .table-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .table-stat {
    padding: 0.25rem 0.5rem;
    background: #e9ecef;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #495057;
  }

  .test-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: #fff;
    color: #495057;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.2s ease;
  }

  .test-btn:hover {
    background: #f8f9fa;
    border-color: #007bff;
    color: #007bff;
  }

  /* Quick Navigation Styles */
  .quick-nav {
    margin-bottom: 3rem;
  }

  .quick-nav h2 {
    margin-bottom: 1.5rem;
    color: #333;
  }

  .nav-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .nav-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
  }

  .nav-card:hover {
    border-color: #007bff;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
    transform: translateY(-2px);
  }

  .nav-icon {
    font-size: 2rem;
    min-width: 3rem;
    text-align: center;
  }

  .nav-info h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
    font-size: 1.1rem;
  }

  .nav-info p {
    margin: 0;
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .nav-cards {
      grid-template-columns: 1fr;
    }

    .nav-card {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
