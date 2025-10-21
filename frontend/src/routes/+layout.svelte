<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authStore } from "$lib/stores/auth";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();
  let showMobileMenu = false;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];

  onMount(async () => {
    // Check authentication status
    const isAuthenticated = await authStore.checkAuth();

    // Get current path
    const currentPath = window.location.pathname;

    // If not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated && !publicRoutes.includes(currentPath)) {
      goto("/login");
    }

    // If authenticated and on login/register page, redirect to home
    if (isAuthenticated && publicRoutes.includes(currentPath)) {
      goto("/");
    }
  });

  async function handleLogout() {
    await authStore.logout();
    goto("/login");
  }

  // Subscribe to auth store
  const auth = $derived($authStore);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{#if auth.user}
  <header class="nav-bar shadow-sm">
    <div class="page-container flex items-center justify-between py-3">
      <a href="/" class="flex items-center gap-3 nav-brand">
        <span
          class="rounded-full bg-[linear-gradient(90deg,var(--primary),var(--accent))] w-9 h-9 flex items-center justify-center text-white font-bold"
          >🏐</span
        >
        <span class="hidden sm:inline-block ml-1 text-lg font-bold"
          >Training Planner</span
        >
      </a>

      <nav class="hidden sm:flex items-center gap-6">
        <a href="/" class="nav-link">Home</a>
        <a href="/plans" class="nav-link">Plans</a>
        <a href="/calendar" class="nav-link">Calendar</a>
        <a href="/create" class="nav-link">Create</a>
      </nav>

      <div class="hidden sm:flex items-center gap-4">
        <div class="text-sm text-slate-700">Welcome, {auth.user.name}</div>
        <button onclick={handleLogout} class="btn-secondary">Logout</button>
      </div>

      <!-- Mobile menu button -->
      <div class="sm:hidden">
        <button
          aria-expanded={showMobileMenu}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          class="btn-ghost focus-ring"
          onclick={() => (showMobileMenu = !showMobileMenu)}
        >
          {#if showMobileMenu}
            <svg
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          {:else}
            <svg
              class="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          {/if}
        </button>
      </div>
    </div>

    {#if showMobileMenu}
      <div
        id="mobile-menu"
        class="sm:hidden border-t border-slate-100 bg-white"
      >
        <div class="page-container py-3 flex flex-col gap-2">
          <a href="/" class="nav-link">Home</a>
          <a href="/plans" class="nav-link">Plans</a>
          <a href="/calendar" class="nav-link">Calendar</a>
          <a href="/create" class="nav-link">Create</a>
          <div
            class="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between"
          >
            <div class="text-sm text-slate-700">{auth.user.name}</div>
            <button onclick={handleLogout} class="btn-secondary">Logout</button>
          </div>
        </div>
      </div>
    {/if}
  </header>
{/if}

{@render children?.()}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .navbar {
    background: black;
    padding: 1rem 0;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-brand {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .nav-links a:hover {
    opacity: 0.8;
  }

  .nav-user {
    color: white;
    font-weight: 500;
    opacity: 0.9;
  }

  .btn-logout {
    background: white;
    color: #667eea;
    border: none;
    padding: 0.5rem 1.5rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .btn-logout:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .nav-content {
      flex-direction: column;
      gap: 1rem;
    }

    .nav-links {
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
  }
</style>
