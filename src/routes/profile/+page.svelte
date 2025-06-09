<!-- Profile Settings Page -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let user = null;
  
  onMount(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      goto('/auth');
      return;
    }
    
    const userData = localStorage.getItem('user');
    if (userData) {
      user = JSON.parse(userData);
    }
  });
</script>

<svelte:head>
  <title>Profile Settings - LaufplanerPro</title>
</svelte:head>

<div class="profile-page">
  <header class="page-header">
    <div class="container">
      <h1>👤 Profile Settings</h1>
      <a href="/dashboard" class="back-link">← Back to Dashboard</a>
    </div>
  </header>
  
  <main class="container">
    <div class="profile-card">
      <h2>Athlete Profile</h2>
      <p>Update your training zones, personal information, and preferences.</p>
      
      <div class="coming-soon">
        <div class="icon">🚧</div>
        <h3>Coming Soon</h3>
        <p>Profile management features are currently in development.</p>
        <p>You'll be able to:</p>
        <ul>
          <li>Update personal information</li>
          <li>Set training zones</li>
          <li>Configure notification preferences</li>
          <li>Manage device connections</li>
        </ul>
      </div>
    </div>
  </main>
</div>

<style>
  .profile-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem 0;
  }
  
  .page-header {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 1rem 0;
    margin-bottom: 2rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .page-header h1 {
    color: white;
    margin: 0;
    font-size: 2rem;
  }
  
  .back-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    display: inline-block;
    transition: color 0.3s ease;
  }
  
  .back-link:hover {
    color: white;
  }
  
  .profile-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .profile-card h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .profile-card > p {
    color: #666;
    margin-bottom: 2rem;
  }
  
  .coming-soon {
    text-align: center;
    padding: 3rem 2rem;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #dee2e6;
  }
  
  .coming-soon .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .coming-soon h3 {
    color: #495057;
    margin-bottom: 1rem;
  }
  
  .coming-soon p {
    color: #6c757d;
    margin-bottom: 1rem;
  }
  
  .coming-soon ul {
    text-align: left;
    max-width: 300px;
    margin: 0 auto;
    color: #6c757d;
  }
  
  .coming-soon li {
    margin-bottom: 0.5rem;
  }
</style>
