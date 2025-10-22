<script lang="ts">
  import '../app.css';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { children } = $props();

  let isAuthenticated = $derived($authStore.isAuthenticated);
  let currentPath = $derived($page.url.pathname);

  function logout() {
    authStore.logout();
    goto('/login');
  }

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/plans', label: 'Training Plans', icon: '📋' },
    { href: '/create', label: 'Create Plan', icon: '➕' },
  ];
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
  {#if isAuthenticated}
    <!-- Navigation -->
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex space-x-8">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <a href="/" class="flex items-center space-x-2">
                <span class="text-2xl">🏐</span>
                <span class="font-bold text-xl bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Volleyball Training
                </span>
              </a>
            </div>

            <!-- Nav Links -->
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              {#each navItems as item}
                <a
                  href={item.href}
                  class="inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors {currentPath === item.href
                    ? 'border-primary-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
                >
                  <span class="mr-2">{item.icon}</span>
                  {item.label}
                </a>
              {/each}
            </div>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-700">
                {$authStore.user?.name || 'User'}
              </span>
              <button
                on:click={logout}
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Nav -->
      <div class="sm:hidden border-t border-gray-200">
        <div class="pt-2 pb-3 space-y-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {currentPath === item.href
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'}"
            >
              <span class="mr-2">{item.icon}</span>
              {item.label}
            </a>
          {/each}
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {@render children?.()}
    </main>
  {:else}
    <!-- Public pages (login, register) -->
    {@render children?.()}
  {/if}
</div>

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
