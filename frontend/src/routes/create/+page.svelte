<script lang="ts">
  import { api } from '$lib/utils/api';
  import { authStore } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import type { CreateTrainingPlanDTO } from '$lib/types';
  import { onMount } from 'svelte';

  let name = $state('');
  let description = $state('');
  let phaseType = $state<'Off-Season' | 'Pre-Season' | 'Competition' | 'Recovery'>('Off-Season');
  let startDate = $state('');
  let endDate = $state('');
  let error = $state('');
  let loading = $state(false);
  let athleteId = $state('default-athlete-123'); // Default for now

  onMount(() => {
    if (!$authStore.isAuthenticated) {
      goto('/login');
      return;
    }

    // Set default dates
    const today = new Date();
    const fourWeeksLater = new Date(today);
    fourWeeksLater.setDate(today.getDate() + 28);

    startDate = today.toISOString().split('T')[0];
    endDate = fourWeeksLater.toISOString().split('T')[0];
  });

  async function handleSubmit() {
    if (!name || !phaseType) {
      error = 'Please fill in all required fields';
      return;
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      error = 'Start date must be before end date';
      return;
    }

    loading = true;
    error = '';

    try {
      const planData: CreateTrainingPlanDTO = {
        athlete_id: athleteId,
        name,
        description: description || undefined,
        phase_type: phaseType,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
      };

      const createdPlan = await api.post('/training-plans', planData);

      // Activate the newly created plan
      if (createdPlan && (createdPlan as any).id) {
        await api.post(`/training-plans/${(createdPlan as any).id}/activate`, {});
      }

      goto('/plans');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to create training plan';
    } finally {
      loading = false;
    }
  }

  const phaseOptions = [
    {
      value: 'Off-Season',
      label: 'Off-Season',
      description: 'Build base fitness and work on fundamental skills',
    },
    {
      value: 'Pre-Season',
      label: 'Pre-Season',
      description: 'Increase intensity and prepare for competition',
    },
    {
      value: 'Competition',
      label: 'Competition',
      description: 'Maintain fitness while competing',
    },
    {
      value: 'Recovery',
      label: 'Recovery',
      description: 'Rest and light training between seasons',
    },
  ];
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-3xl font-bold text-gray-900">Create Training Plan</h1>
    <p class="text-gray-600 mt-1">Design a custom training program</p>
  </div>

  <div class="card max-w-3xl">
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
      <ErrorMessage {error} />

      <!-- Plan Name -->
      <div>
        <label for="name" class="label">
          Plan Name <span class="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          bind:value={name}
          disabled={loading}
          class="input-field"
          placeholder="e.g., Summer Training Program"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="label">Description</label>
        <textarea
          id="description"
          bind:value={description}
          disabled={loading}
          class="input-field"
          rows="3"
          placeholder="Describe the goals and focus of this training plan"
        ></textarea>
      </div>

      <!-- Phase Type -->
      <div>
        <label class="label">
          Training Phase <span class="text-red-500">*</span>
        </label>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each phaseOptions as option}
            <label class="relative flex cursor-pointer">
              <input
                type="radio"
                name="phase"
                value={option.value}
                bind:group={phaseType}
                disabled={loading}
                class="sr-only peer"
              />
              <div class="w-full p-4 border-2 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:bg-gray-50 transition-colors">
                <div class="font-medium text-gray-900">{option.label}</div>
                <div class="text-sm text-gray-600 mt-1">{option.description}</div>
              </div>
            </label>
          {/each}
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="startDate" class="label">Start Date</label>
          <input
            id="startDate"
            type="date"
            bind:value={startDate}
            disabled={loading}
            class="input-field"
          />
        </div>
        <div>
          <label for="endDate" class="label">End Date</label>
          <input
            id="endDate"
            type="date"
            bind:value={endDate}
            disabled={loading}
            class="input-field"
          />
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start">
          <span class="text-2xl mr-3">💡</span>
          <div>
            <h4 class="font-medium text-blue-900">Auto-Generated Workouts</h4>
            <p class="text-sm text-blue-700 mt-1">
              This plan will automatically generate a 4-week training schedule based on your selected phase.
              You can view and modify the workouts in the calendar after creation.
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex space-x-3">
        <button
          type="submit"
          disabled={loading}
          class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {#if loading}
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          {:else}
            Create Training Plan
          {/if}
        </button>
        <a href="/plans" class="btn-secondary">Cancel</a>
      </div>
    </form>
  </div>

  <!-- Tips Section -->
  <div class="card max-w-3xl bg-gradient-to-br from-primary-50 to-accent-50">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Training Phase Tips</h3>
    <div class="space-y-3 text-sm text-gray-700">
      <div>
        <strong>Off-Season:</strong> Focus on building strength, improving technique, and developing weak areas. Lower intensity, higher volume.
      </div>
      <div>
        <strong>Pre-Season:</strong> Increase sport-specific training, elevate intensity, and prepare mentally for competition.
      </div>
      <div>
        <strong>Competition:</strong> Maintain fitness levels, focus on recovery between games, and keep skills sharp.
      </div>
      <div>
        <strong>Recovery:</strong> Active rest with light training to prevent deconditioning while allowing physical and mental recovery.
      </div>
    </div>
  </div>
</div>
