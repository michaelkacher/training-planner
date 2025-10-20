<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { authStore } from "$lib/stores/auth";
  import favicon from "$lib/assets/favicon.svg";

  let { children } = $props();

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
  <nav class="navbar">
    <div class="nav-content">
      <a href="/" class="nav-brand">🏐 Training Planner</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/templates">Templates</a>
        <a href="/plans">Plans</a>
        <a href="/calendar">Calendar</a>
        <a href="/create">Create Workout</a>
        <span class="nav-user">Welcome, {auth.user.name}</span>
        <button onclick={handleLogout} class="btn-logout">Logout</button>
      </div>
    </div>
  </nav>
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
