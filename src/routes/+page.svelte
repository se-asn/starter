<!-- LaufplanerPro - Neural Triathlon Training System -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let mounted = false;
  let glowIntensity = 0;
  let particlesVisible = false;
  
  onMount(() => {
    mounted = true;
    
    // Animate glow effect
    const interval = setInterval(() => {
      glowIntensity = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
    }, 16);
    
    // Show particles after delay
    setTimeout(() => {
      particlesVisible = true;
    }, 1000);
    
    // Check if user is already authenticated
    const token = localStorage.getItem('authToken');
    if (token) {
      goto('/dashboard');
    }
    
    return () => clearInterval(interval);
  });

  function handleGetStarted() {
    goto('/auth');
  }

  function handleLogin() {
    goto('/auth');
  }
</script>

<svelte:head>
  <title>LaufplanerPro - Neural Triathlon Training System</title>
  <meta name="description" content="Advanced neural-powered triathlon training with quantum analytics and biometric integration" />
</svelte:head>

<div class="quantum-page">
  <!-- Neural Header -->
  <header class="neural-header" class:mounted>
    <div class="neural-container">
      <div class="neural-logo">
        <div class="logo-pulse" style="--glow: {glowIntensity}"></div>
        <span class="logo-text">LaufplanerPro</span>
        <span class="logo-version">2.0</span>
      </div>
        <nav class="neural-nav">
        <a href="#capabilities" class="nav-link">Capabilities</a>
        <a href="#integration" class="nav-link">Integration</a>
        <a href="#capabilities" class="nav-link">Analytics</a>
        <button on:click={handleLogin} class="neural-btn neural-btn-ghost">Access</button>
      </nav>
    </div>
  </header>

  <!-- Quantum Hero -->
  <section class="quantum-hero" class:animate={mounted}>
    <div class="hero-background">
      {#if particlesVisible}
        <div class="neural-particles">
          {#each Array(20) as _, i}
            <div class="particle" style="--delay: {i * 0.1}s; --x: {Math.random() * 100}%; --y: {Math.random() * 100}%"></div>
          {/each}
        </div>
      {/if}
    </div>
    
    <div class="neural-container">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">Neural Training System</span>
          <span class="badge-version">v2.0</span>
        </div>
        
        <h1 class="quantum-title">
          <span class="title-line">Elite Triathlon</span>
          <span class="title-line title-accent">Performance</span>
          <span class="title-line">Optimization</span>
        </h1>
        
        <p class="quantum-subtitle">
          Advanced neural algorithms analyze your biometric data streams 
          to generate precision training protocols for peak performance.
        </p>
        
        <!-- Quantum Stats -->
        <div class="quantum-stats">
          <div class="stat-item">
            <div class="stat-number">99.7%</div>
            <div class="stat-label">Accuracy</div>
            <div class="stat-glow"></div>
          </div>
          <div class="stat-item">
            <div class="stat-number">2.4s</div>
            <div class="stat-label">Response Time</div>
            <div class="stat-glow"></div>
          </div>
          <div class="stat-item">
            <div class="stat-number">15k+</div>
            <div class="stat-label">Elite Athletes</div>
            <div class="stat-glow"></div>
          </div>
        </div>

        <!-- Neural CTA -->
        <div class="neural-cta">
          <button on:click={handleGetStarted} class="neural-btn neural-btn-primary">
            <span class="btn-text">Initialize Training</span>
            <div class="btn-glow"></div>
          </button>
          <button class="neural-btn neural-btn-outline">
            <span class="btn-text">View Capabilities</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Neural Capabilities -->
  <section id="capabilities" class="neural-section">
    <div class="neural-container">
      <div class="section-header">
        <h2 class="section-title">Neural Capabilities</h2>
        <p class="section-subtitle">Advanced systems for peak performance</p>
      </div>
      
      <div class="capabilities-grid">
        <div class="capability-card">
          <div class="card-header">
            <div class="capability-icon">🧠</div>
            <div class="capability-pulse"></div>
          </div>
          <h3 class="capability-title">AI Performance Analysis</h3>
          <p class="capability-text">Neural networks process your training data to identify optimization patterns</p>
          <div class="capability-tags">
            <span class="tag">Machine Learning</span>
            <span class="tag">Predictive</span>
          </div>
        </div>
        
        <div class="capability-card">
          <div class="card-header">
            <div class="capability-icon">⚡</div>
            <div class="capability-pulse"></div>
          </div>
          <h3 class="capability-title">Real-time Biometrics</h3>
          <p class="capability-text">Live monitoring of heart rate, power, and recovery metrics</p>
          <div class="capability-tags">
            <span class="tag">Live Data</span>
            <span class="tag">Sensors</span>
          </div>
        </div>
        
        <div class="capability-card">
          <div class="card-header">
            <div class="capability-icon">🚀</div>
            <div class="capability-pulse"></div>
          </div>
          <h3 class="capability-title">Adaptive Protocols</h3>
          <p class="capability-text">Training plans that evolve based on your progress and performance</p>
          <div class="capability-tags">
            <span class="tag">Adaptive</span>
            <span class="tag">Personalized</span>
          </div>
        </div>
        
        <div class="capability-card">
          <div class="card-header">
            <div class="capability-icon">🔬</div>
            <div class="capability-pulse"></div>
          </div>
          <h3 class="capability-title">Quantum Analytics</h3>
          <p class="capability-text">Advanced statistical modeling for performance prediction</p>
          <div class="capability-tags">
            <span class="tag">Analytics</span>
            <span class="tag">Prediction</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Integration Matrix -->
  <section id="integration" class="integration-section">
    <div class="neural-container">
      <div class="section-header">
        <h2 class="section-title">Integration Matrix</h2>
        <p class="section-subtitle">Seamless connectivity with elite hardware</p>
      </div>
      
      <div class="integration-grid">
        <div class="integration-item">
          <div class="integration-logo">ST</div>
          <span class="integration-name">Strava</span>
          <div class="integration-status connected">●</div>
        </div>
        <div class="integration-item">
          <div class="integration-logo">GA</div>
          <span class="integration-name">Garmin</span>
          <div class="integration-status connected">●</div>
        </div>
        <div class="integration-item">
          <div class="integration-logo">PO</div>
          <span class="integration-name">Polar</span>
          <div class="integration-status connected">●</div>
        </div>
        <div class="integration-item">
          <div class="integration-logo">WH</div>
          <span class="integration-name">Wahoo</span>
          <div class="integration-status connected">●</div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* 2050 Neural Interface Styles */
  .quantum-page {
    min-height: 100vh;
    background: var(--neural-black);
    overflow-x: hidden;
  }

  /* Neural Header */
  .neural-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(10, 10, 11, 0.8);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--neural-border);
    transition: var(--transition-smooth);
    transform: translateY(-100%);
  }

  .neural-header.mounted {
    transform: translateY(0);
  }

  .neural-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--space-lg);
  }

  .neural-header .neural-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 70px;
  }

  .neural-logo {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    position: relative;
  }

  .logo-pulse {
    width: 12px;
    height: 12px;
    background: var(--neural-accent);
    border-radius: var(--radius-full);
    opacity: calc(0.5 + var(--glow) * 0.5);
    box-shadow: 0 0 20px var(--neural-accent-glow);
  }

  .logo-text {
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--neural-bright);
    letter-spacing: -0.02em;
  }

  .logo-version {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--neural-accent);
    background: rgba(59, 130, 246, 0.1);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  .neural-nav {
    display: flex;
    align-items: center;
    gap: var(--space-lg);
  }

  .nav-link {
    color: var(--neural-text);
    text-decoration: none;
    font-weight: 500;
    font-size: 0.875rem;
    transition: var(--transition-fast);
    position: relative;
  }

  .nav-link:hover {
    color: var(--neural-bright);
  }

  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 1px;
    background: var(--neural-accent);
    transition: var(--transition-fast);
  }

  .nav-link:hover::after {
    width: 100%;
  }

  /* Neural Buttons */
  .neural-btn {
    position: relative;
    padding: var(--space-sm) var(--space-lg);
    border: none;
    border-radius: var(--radius-md);
    font-family: var(--font-primary);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: pointer;
    transition: var(--transition-smooth);
    overflow: hidden;
  }

  .neural-btn-ghost {
    background: rgba(255, 255, 255, 0.05);
    color: var(--neural-text);
    border: 1px solid var(--neural-border);
  }

  .neural-btn-ghost:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--neural-bright);
    border-color: var(--neural-accent);
  }

  .neural-btn-primary {
    background: var(--neural-accent);
    color: white;
    border: 1px solid transparent;
    padding: var(--space-md) var(--space-xl);
    font-weight: 600;
  }

  .neural-btn-primary:hover {
    background: #2563eb;
    transform: translateY(-1px);
    box-shadow: var(--shadow-glow);
  }

  .neural-btn-outline {
    background: transparent;
    color: var(--neural-text);
    border: 1px solid var(--neural-border);
    padding: var(--space-md) var(--space-xl);
  }

  .neural-btn-outline:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--neural-accent);
    color: var(--neural-bright);
  }

  .btn-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: var(--transition-smooth);
  }

  .neural-btn-primary:hover .btn-glow {
    opacity: 1;
  }

  /* Quantum Hero */
  .quantum-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-top: 70px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 1s ease-out;
  }

  .quantum-hero.animate {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-background {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .neural-particles {
    position: absolute;
    inset: 0;
  }

  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--neural-accent);
    border-radius: var(--radius-full);
    left: var(--x);
    top: var(--y);
    animation: particle-float 4s ease-in-out infinite;
    animation-delay: var(--delay);
    opacity: 0.6;
  }

  @keyframes particle-float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
    50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
  }

  .hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    background: rgba(59, 130, 246, 0.1);
    border: 1px solid rgba(59, 130, 246, 0.2);
    border-radius: var(--radius-full);
    padding: var(--space-sm) var(--space-md);
    margin-bottom: var(--space-xl);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--neural-accent);
  }

  .badge-version {
    background: var(--neural-accent);
    color: white;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 0.625rem;
  }

  .quantum-title {
    margin-bottom: var(--space-xl);
  }

  .title-line {
    display: block;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    line-height: 0.9;
    color: var(--neural-bright);
    margin-bottom: var(--space-sm);
  }

  .title-accent {
    background: var(--quantum-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .quantum-subtitle {
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: var(--neural-text);
    max-width: 600px;
    margin: 0 auto var(--space-3xl);
    line-height: 1.6;
  }

  /* Quantum Stats */
  .quantum-stats {
    display: flex;
    justify-content: center;
    gap: var(--space-3xl);
    margin-bottom: var(--space-3xl);
    flex-wrap: wrap;
  }

  .stat-item {
    position: relative;
    text-align: center;
  }

  .stat-number {
    font-family: var(--font-mono);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--neural-bright);
    margin-bottom: var(--space-xs);
  }

  .stat-label {
    font-size: 0.875rem;
    color: var(--neural-text);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .stat-glow {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: var(--neural-accent);
    border-radius: var(--radius-full);
    box-shadow: 0 0 10px var(--neural-accent-glow);
  }

  /* Neural CTA */
  .neural-cta {
    display: flex;
    justify-content: center;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }

  /* Neural Sections */
  .neural-section {
    padding: var(--space-3xl) 0;
    border-top: 1px solid var(--neural-border);
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--space-3xl);
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--neural-bright);
    margin-bottom: var(--space-md);
  }

  .section-subtitle {
    font-size: 1.125rem;
    color: var(--neural-text);
    max-width: 600px;
    margin: 0 auto;
  }

  /* Capabilities Grid */
  .capabilities-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-xl);
  }

  .capability-card {
    background: var(--neural-surface);
    border: 1px solid var(--neural-border);
    border-radius: var(--radius-lg);
    padding: var(--space-xl);
    transition: var(--transition-smooth);
    position: relative;
    overflow: hidden;
  }

  .capability-card:hover {
    border-color: var(--neural-accent);
    transform: translateY(-4px);
    box-shadow: var(--shadow-neural);
  }

  .card-header {
    position: relative;
    margin-bottom: var(--space-lg);
  }

  .capability-icon {
    font-size: 2.5rem;
    margin-bottom: var(--space-md);
  }

  .capability-pulse {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background: var(--neural-success);
    border-radius: var(--radius-full);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }

  .capability-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--neural-bright);
    margin-bottom: var(--space-sm);
  }

  .capability-text {
    color: var(--neural-text);
    line-height: 1.6;
    margin-bottom: var(--space-md);
  }

  .capability-tags {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
  }

  .tag {
    background: rgba(59, 130, 246, 0.1);
    color: var(--neural-accent);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
    font-weight: 500;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  /* Integration Section */
  .integration-section {
    padding: var(--space-3xl) 0;
    background: var(--neural-dark);
  }

  .integration-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-lg);
  }

  .integration-item {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    background: var(--neural-surface);
    border: 1px solid var(--neural-border);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    transition: var(--transition-smooth);
  }

  .integration-item:hover {
    border-color: var(--neural-accent);
    transform: scale(1.02);
  }

  .integration-logo {
    width: 40px;
    height: 40px;
    background: var(--neural-accent);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-weight: 700;
    color: white;
    font-size: 0.875rem;
  }

  .integration-name {
    flex: 1;
    color: var(--neural-bright);
    font-weight: 500;
  }

  .integration-status {
    color: var(--neural-success);
    font-size: 1.25rem;
  }

  .connected {
    animation: status-pulse 2s ease-in-out infinite;
  }

  @keyframes status-pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  /* Mobile Optimizations */
  @media (max-width: 768px) {
    .neural-header .neural-container {
      padding: 0 var(--space-md);
    }

    .neural-nav {
      gap: var(--space-md);
    }

    .nav-link {
      font-size: 0.8rem;
    }

    .quantum-hero {
      padding: 70px var(--space-md) var(--space-3xl);
    }

    .quantum-stats {
      gap: var(--space-xl);
    }

    .neural-cta {
      flex-direction: column;
      align-items: center;
    }

    .neural-btn {
      width: 100%;
      max-width: 280px;
    }

    .capabilities-grid {
      grid-template-columns: 1fr;
    }

    .integration-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .integration-grid {
      grid-template-columns: 1fr;
    }
  }
</style>