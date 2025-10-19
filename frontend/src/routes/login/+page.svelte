<script lang="ts">
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleLogin() {
    error = '';
    loading = true;

    const result = await authStore.login(email, password);

    loading = false;

    if (result.success) {
      goto('/');
    } else {
      error = result.error || 'Login failed';
    }
  }
</script>

<div class="auth-container">
  <div class="auth-card">
    <h1>Welcome Back</h1>
    <p class="subtitle">Sign in to your account</p>

    {#if error}
      <div class="error-message">{error}</div>
    {/if}

    <form onsubmit={handleLogin}>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          placeholder="you@example.com"
          disabled={loading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          placeholder="Enter your password"
          minlength="6"
          disabled={loading}
        />
      </div>

      <button type="submit" class="btn-primary" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <p class="auth-switch">
      Don't have an account? <a href="/register">Sign up</a>
    </p>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  .auth-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .auth-card {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 450px;
  }

  h1 {
    font-size: 2.5rem;
    color: #667eea;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
    text-align: center;
  }

  .subtitle {
    color: #666;
    text-align: center;
    margin: 0 0 2rem 0;
    font-size: 1.1rem;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
  }

  input {
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
  }

  input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .auth-switch {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
  }

  .auth-switch a {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
  }

  .auth-switch a:hover {
    text-decoration: underline;
  }

  @media (max-width: 500px) {
    .auth-card {
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>
