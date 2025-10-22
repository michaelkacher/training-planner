<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/utils/api';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { TrainingPlan, WorkoutSession } from '$lib/types';

  let loading = $state(true);
  let error = $state('');
  let activePlan = $state<TrainingPlan | null>(null);
  let upcomingSessions = $state<WorkoutSession[]>([]);
  let weeklyCompliance = $state(0);

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }

    try {
      // Fetch active training plan
      const plans = await api.get<TrainingPlan[]>('/training-plans?status=active');
      if (plans.length > 0) {
        activePlan = plans[0];

        // Fetch upcoming sessions
        const today = new Date().toISOString().split('T')[0];
        const sessions = await api.get<WorkoutSession[]>(
          `/workout-sessions?athlete_id=${activePlan.athlete_id}`
        );

        upcomingSessions = sessions
          .filter((s) => s.scheduled_date >= today)
          .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
          .slice(0, 5);

        // Calculate weekly compliance
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoStr = weekAgo.toISOString().split('T')[0];

        const weeklySessions = sessions.filter(
          (s) => s.scheduled_date >= weekAgoStr && s.scheduled_date <= today
        );

        if (weeklySessions.length > 0) {
          const completed = weeklySessions.filter((s) => s.status === 'completed').length;
          weeklyCompliance = Math.round((completed / weeklySessions.length) * 100);
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load dashboard';
    } finally {
      loading = false;
    }
  });

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'skipped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-1">Track your training progress</p>
    </div>
    <a href="/create" class="btn-primary">
      Create New Plan
    </a>
  </div>

  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <ErrorMessage message={error} />
  {:else}
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Weekly Compliance</p>
            <p class="text-3xl font-bold text-primary-600 mt-2">{weeklyCompliance}%</p>
          </div>
          <div class="text-4xl">📈</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Active Plan</p>
            <p class="text-xl font-semibold text-gray-900 mt-2">
              {activePlan?.name || 'No active plan'}
            </p>
          </div>
          <div class="text-4xl">📋</div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Upcoming Sessions</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{upcomingSessions.length}</p>
          </div>
          <div class="text-4xl">📅</div>
        </div>
      </div>
    </div>

    <!-- Active Plan -->
    {#if activePlan}
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Current Training Plan</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Plan Name:</span>
            <span class="font-medium">{activePlan.name}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Phase:</span>
            <span class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
              {activePlan.phase_type}
            </span>
          </div>
          {#if activePlan.start_date && activePlan.end_date}
            <div class="flex justify-between">
              <span class="text-gray-600">Duration:</span>
              <span class="font-medium">
                {formatDate(activePlan.start_date)} - {formatDate(activePlan.end_date)}
              </span>
            </div>
          {/if}
          {#if activePlan.description}
            <div>
              <span class="text-gray-600">Description:</span>
              <p class="mt-1 text-gray-900">{activePlan.description}</p>
            </div>
          {/if}
        </div>
        <div class="mt-4 flex space-x-3">
          <a href="/calendar" class="btn-primary">View Calendar</a>
          <a href="/plans" class="btn-secondary">Manage Plans</a>
        </div>
      </div>
    {:else}
      <div class="card text-center py-12">
        <div class="text-6xl mb-4">🏐</div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No Active Training Plan</h3>
        <p class="text-gray-600 mb-6">Get started by creating your first training plan</p>
        <a href="/create" class="btn-primary inline-block">Create Training Plan</a>
      </div>
    {/if}

    <!-- Upcoming Sessions -->
    {#if upcomingSessions.length > 0}
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Upcoming Workouts</h2>
        <div class="space-y-3">
          {#each upcomingSessions as session}
            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <h3 class="font-medium text-gray-900">{session.workout_title || 'Workout'}</h3>
                <p class="text-sm text-gray-600 mt-1">{formatDate(session.scheduled_date)}</p>
                {#if session.workout_summary}
                  <p class="text-sm text-gray-500 mt-1">{session.workout_summary}</p>
                {/if}
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-medium {getStatusColor(session.status)}">
                {session.status}
              </span>
            </div>
          {/each}
        </div>
        <div class="mt-4">
          <a href="/calendar" class="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View all sessions →
          </a>
        </div>
      </div>
    {/if}

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <a href="/create" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center space-x-4">
          <div class="text-4xl">➕</div>
          <div>
            <h3 class="font-semibold text-gray-900">Create Training Plan</h3>
            <p class="text-sm text-gray-600 mt-1">Build a custom training plan</p>
          </div>
        </div>
      </a>

      <a href="/calendar" class="card hover:shadow-md transition-shadow cursor-pointer">
        <div class="flex items-center space-x-4">
          <div class="text-4xl">📅</div>
          <div>
            <h3 class="font-semibold text-gray-900">View Calendar</h3>
            <p class="text-sm text-gray-600 mt-1">See your scheduled workouts</p>
          </div>
        </div>
      </a>
    </div>
  {/if}
</div>
