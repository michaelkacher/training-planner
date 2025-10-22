<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/utils/api';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { WorkoutSession, TrainingPlan } from '$lib/types';

  let loading = $state(true);
  let error = $state('');
  let sessions = $state<WorkoutSession[]>([]);
  let activePlan = $state<TrainingPlan | null>(null);
  let selectedSession = $state<WorkoutSession | null>(null);
  let currentDate = $state(new Date());
  let viewMode = $state<'month' | 'week'>('month');

  onMount(async () => {
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }

    await loadData();
  });

  async function loadData() {
    loading = true;
    error = '';

    try {
      // Fetch active training plan
      const plans = await api.get<TrainingPlan[]>('/training-plans?status=active');
      if (plans.length > 0) {
        activePlan = plans[0];

        // Fetch sessions for this plan
        const fetchedSessions = await api.get<WorkoutSession[]>(
          `/workout-sessions?athlete_id=${activePlan.athlete_id}`
        );
        sessions = fetchedSessions;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load calendar';
    } finally {
      loading = false;
    }
  }

  async function updateSessionStatus(sessionId: string, status: 'completed' | 'skipped') {
    try {
      await api.put(`/workout-sessions/${sessionId}`, { status });
      await loadData();
      selectedSession = null;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to update session';
    }
  }

  function getMonthDays(): Date[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add days from previous month to fill the week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = new Date(year, month, -i);
      days.push(day);
    }

    // Add all days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    // Add days from next month to complete the grid
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  }

  function getSessionsForDate(date: Date): WorkoutSession[] {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter((s) => s.scheduled_date === dateStr);
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  function isCurrentMonth(date: Date): boolean {
    return date.getMonth() === currentDate.getMonth();
  }

  function previousMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  }

  function getMonthName(): string {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-blue-500';
      case 'partial':
        return 'bg-yellow-500';
      case 'skipped':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Training Calendar</h1>
      <p class="text-gray-600 mt-1">View and manage your scheduled workouts</p>
    </div>
  </div>

  {#if loading}
    <LoadingSpinner />
  {:else if error}
    <ErrorMessage message={error} />
  {:else if !activePlan}
    <div class="card text-center py-12">
      <div class="text-6xl mb-4">📅</div>
      <h3 class="text-xl font-semibold text-gray-900 mb-2">No Active Training Plan</h3>
      <p class="text-gray-600 mb-6">Create a training plan to see your calendar</p>
      <a href="/create" class="btn-primary inline-block">Create Training Plan</a>
    </div>
  {:else}
    <div class="card">
      <!-- Calendar Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">{getMonthName()}</h2>
        <div class="flex space-x-2">
          <button onclick={previousMonth} class="btn-secondary">←</button>
          <button onclick={nextMonth} class="btn-secondary">→</button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="grid grid-cols-7 gap-2">
        <!-- Day Headers -->
        {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
          <div class="text-center font-semibold text-gray-600 py-2">{day}</div>
        {/each}

        <!-- Calendar Days -->
        {#each getMonthDays() as date}
          {@const daySessions = getSessionsForDate(date)}
          <div
            class="min-h-24 p-2 border rounded-lg {isCurrentMonth(date)
              ? 'bg-white'
              : 'bg-gray-50'} {isToday(date) ? 'ring-2 ring-primary-500' : ''}"
          >
            <div class="text-sm font-medium {isCurrentMonth(date) ? 'text-gray-900' : 'text-gray-400'}">
              {date.getDate()}
            </div>
            <div class="mt-1 space-y-1">
              {#each daySessions as session}
                <button
                  onclick={() => (selectedSession = session)}
                  class="w-full text-left p-1 rounded text-xs hover:opacity-80 transition-opacity {getStatusColor(
                    session.status
                  )} text-white truncate"
                >
                  {session.workout_title || 'Workout'}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <!-- Legend -->
      <div class="mt-6 flex flex-wrap gap-4 text-sm">
        <div class="flex items-center">
          <div class="w-4 h-4 rounded bg-blue-500 mr-2"></div>
          <span>Scheduled</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded bg-green-500 mr-2"></div>
          <span>Completed</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
          <span>Partial</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 rounded bg-red-500 mr-2"></div>
          <span>Skipped</span>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Session Detail Modal -->
{#if selectedSession}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onclick={() => (selectedSession = null)}>
    <div class="card max-w-md w-full" onclick={(e) => e.stopPropagation()}>
      <h3 class="text-xl font-bold text-gray-900 mb-4">{selectedSession.workout_title || 'Workout'}</h3>

      <div class="space-y-3 mb-6">
        <div>
          <span class="text-gray-600">Date:</span>
          <span class="ml-2 font-medium">{new Date(selectedSession.scheduled_date).toLocaleDateString()}</span>
        </div>
        <div>
          <span class="text-gray-600">Status:</span>
          <span class="ml-2 px-3 py-1 rounded-full text-xs font-medium {getStatusColor(selectedSession.status)} text-white">
            {selectedSession.status}
          </span>
        </div>
        {#if selectedSession.workout_summary}
          <div>
            <span class="text-gray-600">Summary:</span>
            <p class="mt-1 text-gray-900">{selectedSession.workout_summary}</p>
          </div>
        {/if}
        {#if selectedSession.notes}
          <div>
            <span class="text-gray-600">Notes:</span>
            <p class="mt-1 text-gray-900">{selectedSession.notes}</p>
          </div>
        {/if}
      </div>

      <div class="flex space-x-3">
        {#if selectedSession.status === 'scheduled'}
          <button
            onclick={() => updateSessionStatus(selectedSession!.id, 'completed')}
            class="btn-primary flex-1"
          >
            Mark Complete
          </button>
          <button
            onclick={() => updateSessionStatus(selectedSession!.id, 'skipped')}
            class="btn-secondary flex-1"
          >
            Skip
          </button>
        {/if}
        <button onclick={() => (selectedSession = null)} class="btn-secondary">
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
