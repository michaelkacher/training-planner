<script lang="ts">
  import { onMount } from 'svelte';

  let backendHealth = $state('Checking...');

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      const data = await response.json();
      backendHealth = data.status === 'ok' ? 'Connected' : 'Error';
    } catch (error) {
      backendHealth = 'Disconnected';
    }
  });
</script>

<div class="container">
  <header>
    <h1>Athlete Training Planner</h1>
    <p class="subtitle">Your Volleyball Training Companion</p>
  </header>

  <main>
    <section class="hero">
      <h2>Build. Schedule. Track. Excel.</h2>
      <p>
        Take your volleyball game to the next level with personalized training plans,
        smart scheduling, and performance tracking designed for athletes like you.
      </p>
      <div class="hero-actions">
        <a href="/templates" class="btn-hero-primary">Browse Training Templates</a>
        <a href="/workouts" class="btn-hero-secondary">Create Custom Workouts</a>
      </div>
    </section>

    <section class="features">
      <a href="/plans" class="feature-card">
        <div class="icon">🎯</div>
        <h3>My Training Plans</h3>
        <p>View and manage your active and past training programs</p>
        <span class="cta">View Plans →</span>
      </a>

      <a href="/workouts" class="feature-card">
        <div class="icon">📋</div>
        <h3>Custom Workouts</h3>
        <p>Create workouts tailored to your position and goals</p>
        <span class="cta">Get Started →</span>
      </a>

      <div class="feature-card">
        <div class="icon">📅</div>
        <h3>Smart Calendar</h3>
        <p>Drag-and-drop scheduling with automatic reminders</p>
        <span class="cta-disabled">Coming Soon</span>
      </div>
    </section>

    <section class="status">
      <div class="status-indicator">
        <span class="label">Backend Status:</span>
        <span class="value {backendHealth === 'Connected' ? 'connected' : 'disconnected'}">
          {backendHealth}
        </span>
      </div>
    </section>
  </main>

  <footer>
    <p>Powered by SvelteKit + Fastify + Supabase</p>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    min-height: 100vh;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    text-align: center;
    color: white;
    margin-bottom: 3rem;
    padding: 2rem 0;
  }

  h1 {
    font-size: 3.5rem;
    margin: 0;
    font-weight: 800;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    font-size: 1.5rem;
    margin: 0.5rem 0 0;
    opacity: 0.95;
  }

  main {
    background: white;
    border-radius: 20px;
    padding: 3rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .hero {
    text-align: center;
    margin-bottom: 3rem;
  }

  .hero h2 {
    font-size: 2.5rem;
    color: #667eea;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .hero p {
    font-size: 1.2rem;
    color: #666;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto 2rem auto;
  }

  .hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-hero-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-block;
  }

  .btn-hero-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-hero-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    padding: 1rem 2.5rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.2s;
    display: inline-block;
  }

  .btn-hero-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
  }

  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .feature-card {
    text-align: center;
    padding: 2rem;
    border-radius: 15px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
    color: inherit;
    display: block;
    position: relative;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .feature-card h3 {
    color: #667eea;
    margin-bottom: 0.5rem;
    font-size: 1.3rem;
  }

  .feature-card p {
    color: #666;
    line-height: 1.5;
    margin-bottom: 1rem;
  }

  .cta {
    display: inline-block;
    color: #667eea;
    font-weight: 700;
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }

  .cta-disabled {
    display: inline-block;
    color: #999;
    font-weight: 600;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .status {
    text-align: center;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 10px;
    margin-bottom: 2rem;
  }

  .status-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    font-size: 1.1rem;
  }

  .label {
    font-weight: 600;
    color: #666;
  }

  .value {
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-weight: 700;
  }

  .value.connected {
    background: #10b981;
    color: white;
  }

  .value.disconnected {
    background: #ef4444;
    color: white;
  }

  footer {
    text-align: center;
    color: white;
    margin-top: 2rem;
    padding: 1rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    .hero h2 {
      font-size: 2rem;
    }

    .features {
      grid-template-columns: 1fr;
    }

    main {
      padding: 2rem;
    }
  }
</style>
