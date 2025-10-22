<script lang="ts">
  import { api } from '$lib/utils/api';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { AuthResponse } from '$lib/types';

  let name = $state('');
  let email = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleSubmit() {
    if (!name || !email || !password || !confirmPassword) {
      error = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    loading = true;
    error = '';

    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      });

      authStore.setAuth(response.user, response.token);
      goto('/');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Registration failed';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 px-4">
  <div class="max-w-md w-full">
    <div class="text-center mb-8">
      <span class="text-6xl">🏐</span>
      <h1 class="mt-4 text-3xl font-bold text-gray-900">Create Account</h1>
      <p class="mt-2 text-gray-600">Start your volleyball training journey</p>
    </div>

    <div class="card">
      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <ErrorMessage {error} />

        <div>
          <label for="name" class="label">Full Name</label>
          <input
            id="name"
            type="text"
            bind:value={name}
            disabled={loading}
            class="input-field"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label for="email" class="label">Email</label>
          <input
            id="email"
            type="email"
            bind:value={email}
            disabled={loading}
            class="input-field"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label for="password" class="label">Password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            disabled={loading}
            class="input-field"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label for="confirmPassword" class="label">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            bind:value={confirmPassword}
            disabled={loading}
            class="input-field"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating account...
            </div>
          {:else}
            Create Account
          {/if}
        </button>

        <div class="text-center text-sm">
          <span class="text-gray-600">Already have an account?</span>
          <a href="/login" class="ml-1 text-primary-600 hover:text-primary-700 font-medium">
            Sign in
          </a>
        </div>
      </form>
    </div>
  </div>
</div>
