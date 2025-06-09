<!-- Triathlon Coach App - Landing Page -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
    
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      goto('/dashboard');
    }
  });

  function handleGetStarted() {
    goto('/auth');
  }
</script>

<svelte:head>
  <title>Triathlon Coach - AI-Powered Training Plans</title>
  <meta name="description" content="Connect your fitness devices and get personalized triathlon training plans powered by AI" />
</svelte:head>

<div class="hero">
  <div class="hero-content" class:animate={mounted}>
    <h1>🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Coach</h1>
    <p class="subtitle">AI-Powered Training Plans for Every Athlete</p>
    <p class="description">
      Connect your Strava, Garmin, Polar, and other fitness devices to get personalized 
      training plans that adapt to your performance and goals.
    </p>
    
    <div class="features">
      <div class="feature">
        <span class="feature-icon">📊</span>
        <span>Performance Analytics</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🎯</span>
        <span>Goal-Based Plans</span>
      </div>
      <div class="feature">
        <span class="feature-icon">🤖</span>
        <span>AI Optimization</span>
      </div>
      <div class="feature">
        <span class="feature-icon">📱</span>
        <span>Multi-Device Sync</span>
      </div>
    </div>
    
    <div class="cta-buttons">
      <button on:click={handleGetStarted} class="btn-primary">
        🚀 Get Started
      </button>
      <a href="#supported-devices" class="btn-secondary">
        📱 Supported Devices
      </a>
    </div>
  </div>
</div>

<section id="supported-devices" class="devices-section">
  <div class="container">
    <h2>🔗 Supported Integrations</h2>
    <p>Connect your favorite training apps and devices</p>
    
    <div class="devices-grid">
      <div class="device-card">
        <div class="device-icon">🚴‍♂️</div>
        <h3>Strava</h3>
        <p>Activities, segments, and performance data</p>
      </div>
      
      <div class="device-card">
        <div class="device-icon">⌚</div>
        <h3>Garmin</h3>
        <p>Connect IQ apps and health metrics</p>
      </div>
      
      <div class="device-card">
        <div class="device-icon">❄️</div>
        <h3>Polar</h3>
        <p>Training load and recovery insights</p>
      </div>
      
      <div class="device-card">
        <div class="device-icon">📊</div>
        <h3>Wahoo</h3>
        <p>Bike computers and trainer data</p>
      </div>
      
      <div class="device-card">
        <div class="device-icon">🍎</div>
        <h3>Apple Health</h3>
        <p>Workouts and health data sync</p>
      </div>
      
      <div class="device-card">
        <div class="device-icon">📈</div>
        <h3>TrainingPeaks</h3>
        <p>Advanced performance metrics</p>
      </div>
    </div>
    
    <div class="getting-started">
      <a href="/dashboard" class="btn-large">
        🏃‍♂️ Start Your Training Journey
      </a>
    </div>
  </div>
</section>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
  
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 2rem;
  }
  
  .hero-content {
    max-width: 800px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
  }
  
  .hero-content.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero h1 {
    font-size: 3.5rem;
    margin-bottom: 1rem;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    opacity: 0.9;
  }
  
  .description {
    font-size: 1.2rem;
    margin-bottom: 3rem;
    opacity: 0.8;
    line-height: 1.6;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .feature {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
  }
  
  .feature-icon {
    font-size: 2rem;
  }
  
  .cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: inline-block;
  }
  
  .btn-primary {
    background: #ff6b6b;
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }
  
  .btn-primary:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
  }
  
  .btn-secondary {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
  }
  
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  .devices-section {
    background: white;
    padding: 5rem 2rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }
  
  .devices-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .devices-section p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 4rem;
  }
  
  .devices-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
  .device-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .device-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
  
  .device-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .device-card h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .device-card p {
    color: #666;
    margin: 0;
  }
  
  .getting-started {
    margin-top: 3rem;
  }
  
  .btn-large {
    padding: 1.2rem 3rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-size: 1.3rem;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    display: inline-block;
  }
  
  .btn-large:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }
    
    .features {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .devices-grid {
      grid-template-columns: 1fr;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
  }
</style>
