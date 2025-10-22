<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/utils/api';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { TrainingPlan } from '$lib/types';

  let loading = $state(true);
  let error = $state('');
  let plans = $state<TrainingPlan[]>([]);

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }

    await loadPlans();
  });

  async function loadPlans() {
    loading = true;
    error = '';

    try {
      const fetchedPlans = await api.get<TrainingPlan[]>('/training-plans');
      plans = fetchedPlans;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load training plans';
    } finally {
      loading = false;
    }
  }

  async function activatePlan(planId: string) {
    try {
      await api.post(`/training-plans/${planId}/activate`, {});
      await loadPlans();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to activate plan';
    }
  }

  function formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Training Plans</h1>
      <p class="text-gray-600 mt-1">Manage your training programs</p>
    </div>
    <a href="/create" class="btn-primary">Create New Plan</a>
  </div>

  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <ErrorMessage message={error} />
  {:else if plans.length === 0}
    <div class="card text-center py-12">
      <div class="text-6xl mb-4">📋</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Training Plans Yet</h3>
      <p class="text-gray-600 mb-6">Create your first training plan to get started</p>
      <a href="/create" class="btn-primary inline-block">Create Training Plan</a>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6">
      {#each plans as plan}
        <div class="card hover:shadow-md transition-shadow">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <h3 class="text-xl font-semibold text-gray-900">{plan.name}</h3>
                {#if plan.is_active}
                  <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                {:else}
                  <span class="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                {/if}
              </div>
              {#if plan.description}
                <p class="text-gray-600 mt-2">{plan.description}</p>
              {/if}
            </div>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <span class="text-sm text-gray-600">Phase</span>
              <p class="font-medium text-gray-900">{plan.phase_type}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">Start Date</span>
              <p class="font-medium text-gray-900">{formatDate(plan.start_date)}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">End Date</span>
              <p class="font-medium text-gray-900">{formatDate(plan.end_date)}</p>
            </div>
            <div>
              <span class="text-sm text-gray-600">Created</span>
              <p class="font-medium text-gray-900">{formatDate(plan.created_at)}</p>
            </div>
          </div>

          <div class="flex space-x-3">
            {#if !plan.is_active}
              <button onclick={() => activatePlan(plan.id)} class="btn-primary">
                Activate Plan
              </button>
            {/if}
            <a href="/calendar" class="btn-secondary">View Calendar</a>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
