<!-- LaufplanerPro - Professional Triathlon Training -->

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

  function handleLogin() {
    goto('/auth');
  }
</script>

<svelte:head>
  <title>LaufplanerPro - AI-Powered Triathlon Training</title>
  <meta name="description" content="Professional triathlon training plans with AI-powered analytics and device integration" />
</svelte:head>

<div class="page-container">
  <!-- Header -->
  <header class="header">
    <div class="container">
      <div class="logo">
        <h1>🏆 LaufplanerPro</h1>
      </div>
      <nav class="nav">
        <a href="#features">Features</a>
        <a href="#integrations">Integrations</a>
        <button on:click={handleLogin} class="btn-login">Login</button>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero" class:animate={mounted}>
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title">Professional Triathlon Training</h1>
        <p class="hero-subtitle">AI-powered training plans that adapt to your performance</p>
        <p class="hero-description">
          Connect your fitness devices and get personalized training plans 
          based on real data from Strava, Garmin, Polar and more.
        </p>
        
        <!-- Statistics -->
        <div class="stats">
          <div class="stat">
            <div class="stat-number">1000+</div>
            <div class="stat-label">Athletes</div>
          </div>
          <div class="stat">
            <div class="stat-number">50k+</div>
            <div class="stat-label">Workouts</div>
          </div>
          <div class="stat">
            <div class="stat-number">95%</div>
            <div class="stat-label">Goal Achievement</div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="cta-buttons">
          <button on:click={handleGetStarted} class="btn-primary">Get Started Free</button>
          <a href="#features" class="btn-secondary">Learn More</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Features Section -->
  <section id="features" class="features-section">
    <div class="container">
      <h2>Everything You Need to Excel</h2>
      <p>Professional training tools trusted by athletes worldwide</p>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>AI-Powered Analytics</h3>
          <p>Get insights from your training data with advanced AI analysis</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📱</div>
          <h3>Device Integration</h3>
          <p>Connect Strava, Garmin, Polar and other fitness devices seamlessly</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🎯</div>
          <h3>Personalized Plans</h3>
          <p>Training plans that adapt to your progress and goals</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">📈</div>
          <h3>Progress Tracking</h3>
          <p>Monitor your improvement with detailed performance metrics</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">🏃‍♂️</div>
          <h3>Multi-Sport Support</h3>
          <p>Swimming, cycling, and running - all in one platform</p>
        </div>
        
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3>Real-time Feedback</h3>
          <p>Get instant coaching feedback during your workouts</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Integrations Section -->
  <section id="integrations" class="integrations-section">
    <div class="container">
      <h2>Connect Your Devices</h2>
      <p>Seamless integration with your favorite fitness platforms</p>
      
      <div class="integrations-grid">
        <div class="integration-card">
          <div class="integration-icon">🔥</div>
          <h3>Strava</h3>
          <p>Sync activities automatically</p>
        </div>
        
        <div class="integration-card">
          <div class="integration-icon">⌚</div>
          <h3>Garmin</h3>
          <p>Import workouts and metrics</p>
        </div>
        
        <div class="integration-card">
          <div class="integration-icon">🐻‍❄️</div>
          <h3>Polar</h3>
          <p>Heart rate and training data</p>
        </div>
        
        <div class="integration-card">
          <div class="integration-icon">📊</div>
          <h3>TrainingPeaks</h3>
          <p>Advanced performance metrics</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="cta-section">
    <div class="container">
      <h2>Ready to Transform Your Training?</h2>
      <p>Join thousands of athletes already using LaufplanerPro</p>
      <button on:click={handleGetStarted} class="btn-large">Start Your Free Trial</button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <h3>LaufplanerPro</h3>
          <p>Professional triathlon training platform</p>
        </div>
        <div class="footer-links">
          <a href="/auth">Get Started</a>
          <a href="#features">Features</a>
          <a href="#integrations">Integrations</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 LaufplanerPro. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
    background-color: #ffffff;
  }
  
  .page-container {
    min-height: 100vh;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }

  /* Header */
  .header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e1e8ed;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 20px;
  }
  
  .logo h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  .nav {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .nav a {
    text-decoration: none;
    color: #666;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  
  .nav a:hover {
    color: #333;
  }
  
  .btn-login {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .btn-login:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }

  /* Hero Section */
  .hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8rem 2rem 6rem;
    text-align: center;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease;
  }
  
  .hero.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }
  
  .hero-description {
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto 3rem;
    opacity: 0.8;
  }

  /* Statistics */
  .stats {
    display: flex;
    justify-content: center;
    gap: 4rem;
    margin: 3rem 0;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
  }
  
  .stat-label {
    font-size: 1rem;
    opacity: 0.8;
    margin-top: 0.5rem;
  }

  /* CTA Buttons */
  .cta-buttons {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 2rem;
  }
  
  .btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: inline-block;
    border: none;
    cursor: pointer;
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

  /* Features Section */
  .features-section {
    padding: 6rem 2rem;
    background: #f8f9fa;
  }
  
  .features-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .features-section > .container > p {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 4rem;
  }
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  }
  
  .feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .feature-card h3 {
    font-size: 1.3rem;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .feature-card p {
    color: #666;
    margin: 0;
  }

  /* Integrations Section */
  .integrations-section {
    padding: 6rem 2rem;
    background: white;
  }
  
  .integrations-section h2 {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 1rem;
    color: #333;
  }
  
  .integrations-section > .container > p {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 4rem;
  }
  
  .integrations-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .integration-card {
    background: #f8f9fa;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    border: 2px solid transparent;
  }
  
  .integration-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
  }
  
  .integration-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .integration-card h3 {
    font-size: 1.3rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .integration-card p {
    color: #666;
    margin: 0;
  }

  /* CTA Section */
  .cta-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4rem 2rem;
    text-align: center;
  }
  
  .cta-section h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .cta-section p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
  
  .btn-large {
    padding: 1.2rem 3rem;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.3rem;
    font-weight: 600;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.3);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  
  .btn-large:hover {
    background: #ff5252;
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
  }

  /* Footer */
  .footer {
    background: #2c3e50;
    color: white;
    padding: 3rem 2rem 1rem;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }
  
  .footer-brand h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.3rem;
  }
  
  .footer-brand p {
    margin: 0;
    opacity: 0.8;
  }
  
  .footer-links {
    display: flex;
    gap: 2rem;
  }
  
  .footer-links a {
    color: white;
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.3s ease;
  }
  
  .footer-links a:hover {
    opacity: 1;
  }
  
  .footer-bottom {
    border-top: 1px solid #34495e;
    padding-top: 1rem;
    text-align: center;
  }
  
  .footer-bottom p {
    margin: 0;
    opacity: 0.6;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2.5rem;
    }
    
    .stats {
      gap: 2rem;
    }
    
    .cta-buttons {
      flex-direction: column;
      align-items: center;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
    }
    
    .integrations-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-content {
      flex-direction: column;
      gap: 2rem;
      text-align: center;
    }
    
    .footer-links {
      justify-content: center;
    }
    
    .nav {
      gap: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    .integrations-grid {
      grid-template-columns: 1fr;
    }
    
    .stats {
      flex-direction: column;
      gap: 1rem;
    }
  }
</style>
