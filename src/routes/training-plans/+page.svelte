<!-- Training Plans Page -->
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
  <title>Training Plans - LaufplanerPro</title>
</svelte:head>

<div class="training-plans-page">
  <header class="page-header">
    <div class="container">
      <h1>📋 Training Plans</h1>
      <a href="/dashboard" class="back-link">← Back to Dashboard</a>
    </div>
  </header>
  
  <main class="container">
    <div class="plans-card">
      <h2>AI-Generated Training Plans</h2>
      <p>Personalized triathlon training schedules based on your performance data and goals.</p>
      
      <div class="coming-soon">
        <div class="icon">🤖</div>
        <h3>AI Training Plans Coming Soon</h3>
        <p>Our advanced AI system is being trained to create the perfect training plans for you.</p>
        <p>Features in development:</p>
        <ul>
          <li>Personalized weekly schedules</li>
          <li>Adaptive training based on performance</li>
          <li>Integration with device data</li>
          <li>Recovery and rest day optimization</li>
          <li>Race preparation programs</li>
          <li>Injury prevention protocols</li>
        </ul>
        
        <div class="ai-preview">
          <h4>🎯 What to Expect</h4>
          <div class="feature-grid">
            <div class="feature">
              <div class="feature-icon">🏊‍♂️</div>
              <span>Swimming Plans</span>
            </div>
            <div class="feature">
              <div class="feature-icon">🚴‍♂️</div>
              <span>Cycling Plans</span>
            </div>
            <div class="feature">
              <div class="feature-icon">🏃‍♂️</div>
              <span>Running Plans</span>
            </div>
            <div class="feature">
              <div class="feature-icon">🧠</div>
              <span>AI Optimization</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  .training-plans-page {
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
  
  .plans-card {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .plans-card h2 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .plans-card > p {
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
    max-width: 350px;
    margin: 0 auto 2rem auto;
    color: #6c757d;
  }
  
  .coming-soon li {
    margin-bottom: 0.5rem;
  }
  
  .ai-preview {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    margin-top: 2rem;
  }
  
  .ai-preview h4 {
    color: #333;
    margin-bottom: 1rem;
  }
  
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    transition: transform 0.2s ease;
  }
  
  .feature:hover {
    transform: translateY(-2px);
  }
  
  .feature-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .feature span {
    font-size: 0.9rem;
    font-weight: 500;
    color: #495057;
  }
</style>
