<script lang="ts">
  import { onMount } from 'svelte';
  import type { Workout, WorkoutType } from '$lib/types';

  let workouts = $state<Workout[]>([]);
  let loading = $state(true);
  let error = $state('');
  let showCreateForm = $state(false);

  // Form fields
  let name = $state('');
  let type = $state<WorkoutType>('Court Practice/Skills');
  let durationMinutes = $state<number | undefined>(60);
  let sets = $state<number | undefined>();
  let reps = $state<number | undefined>();
  let intensityRpe = $state<number | undefined>();
  let description = $state('');

  const workoutTypes: WorkoutType[] = [
    'Court Practice/Skills',
    'Plyometrics',
    'Agility',
    'Strength',
    'Conditioning',
    'Rest',
    'Other'
  ];

  onMount(async () => {
    await loadWorkouts();
  });

  async function loadWorkouts() {
    try {
      loading = true;
      // For now, using demo athlete ID
      const response = await fetch('http://localhost:3000/api/v1/workouts?athlete_id=demo');
      if (response.ok) {
        workouts = await response.json();
      } else {
        workouts = [];
      }
    } catch (err) {
      console.error('Error loading workouts:', err);
      error = 'Failed to load workouts';
      workouts = [];
    } finally {
      loading = false;
    }
  }

  async function createWorkout() {
    try {
      const workoutData = {
        athlete_id: 'demo', // Will be replaced with actual auth
        name,
        type,
        duration_minutes: durationMinutes,
        sets,
        reps,
        intensity_rpe: intensityRpe,
        description
      };

      const response = await fetch('http://localhost:3000/api/v1/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workoutData)
      });

      if (response.ok) {
        await loadWorkouts();
        resetForm();
        showCreateForm = false;
      } else {
        error = 'Failed to create workout';
      }
    } catch (err) {
      console.error('Error creating workout:', err);
      error = 'Failed to create workout';
    }
  }

  function resetForm() {
    name = '';
    type = 'Court Practice/Skills';
    durationMinutes = 60;
    sets = undefined;
    reps = undefined;
    intensityRpe = undefined;
    description = '';
  }

  async function deleteWorkout(id: string) {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/workouts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadWorkouts();
      }
    } catch (err) {
      console.error('Error deleting workout:', err);
    }
  }

  function getTypeEmoji(type: WorkoutType): string {
    const emojiMap: Record<WorkoutType, string> = {
      'Court Practice/Skills': '🏐',
      'Plyometrics': '💪',
      'Agility': '⚡',
      'Strength': '🏋️',
      'Conditioning': '🏃',
      'Rest': '😴',
      'Other': '📋'
    };
    return emojiMap[type];
  }
</script>

<div class="container">
  <div class="top-nav">
    <a href="/templates" class="link-templates">← Browse Training Templates</a>
  </div>

  <header>
    <h1>My Custom Workouts</h1>
    <button class="btn-primary" onclick={() => showCreateForm = !showCreateForm}>
      {showCreateForm ? 'Cancel' : '+ Create Workout'}
    </button>
  </header>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  {#if showCreateForm}
    <div class="create-form">
      <h2>Create New Workout</h2>
      <form onsubmit={(e) => { e.preventDefault(); createWorkout(); }}>
        <div class="form-group">
          <label for="name">Workout Name *</label>
          <input
            id="name"
            type="text"
            bind:value={name}
            placeholder="e.g., Morning Jump Training"
            required
          />
        </div>

        <div class="form-group">
          <label for="type">Type *</label>
          <select id="type" bind:value={type} required>
            {#each workoutTypes as workoutType}
              <option value={workoutType}>{getTypeEmoji(workoutType)} {workoutType}</option>
            {/each}
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="duration">Duration (minutes)</label>
            <input
              id="duration"
              type="number"
              bind:value={durationMinutes}
              placeholder="60"
              min="1"
            />
          </div>

          <div class="form-group">
            <label for="sets">Sets</label>
            <input
              id="sets"
              type="number"
              bind:value={sets}
              placeholder="3"
              min="1"
            />
          </div>

          <div class="form-group">
            <label for="reps">Reps</label>
            <input
              id="reps"
              type="number"
              bind:value={reps}
              placeholder="10"
              min="1"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="rpe">Intensity (RPE 1-10)</label>
          <input
            id="rpe"
            type="range"
            bind:value={intensityRpe}
            min="1"
            max="10"
            step="1"
          />
          {#if intensityRpe}
            <span class="rpe-value">RPE: {intensityRpe}</span>
          {/if}
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            bind:value={description}
            placeholder="Add notes about this workout..."
            rows="4"
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick={() => showCreateForm = false}>
            Cancel
          </button>
          <button type="submit" class="btn-primary">Create Workout</button>
        </div>
      </form>
    </div>
  {/if}

  <div class="workouts-list">
    {#if loading}
      <p class="loading">Loading workouts...</p>
    {:else if workouts.length === 0}
      <div class="empty-state">
        <p>🏐 No workouts yet!</p>
        <p>Create your first workout to start building your training plan.</p>
      </div>
    {:else}
      {#each workouts as workout (workout.id)}
        <div class="workout-card">
          <div class="workout-header">
            <div class="workout-title">
              <span class="type-emoji">{getTypeEmoji(workout.type)}</span>
              <h3>{workout.name}</h3>
            </div>
            <button
              class="btn-delete"
              onclick={() => deleteWorkout(workout.id)}
              aria-label="Delete workout"
            >
              🗑️
            </button>
          </div>

          <p class="workout-type">{workout.type}</p>

          <div class="workout-details">
            {#if workout.duration_minutes}
              <span class="detail">⏱️ {workout.duration_minutes} min</span>
            {/if}
            {#if workout.sets && workout.reps}
              <span class="detail">📊 {workout.sets} x {workout.reps}</span>
            {/if}
            {#if workout.intensity_rpe}
              <span class="detail">💪 RPE {workout.intensity_rpe}</span>
            {/if}
          </div>

          {#if workout.description}
            <p class="workout-description">{workout.description}</p>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .top-nav {
    margin-bottom: 1.5rem;
  }

  .link-templates {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s;
    display: inline-block;
  }

  .link-templates:hover {
    color: #764ba2;
    transform: translateX(-4px);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    color: #667eea;
    font-size: 2.5rem;
    margin: 0;
  }

  .error {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #333;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
  }

  .btn-delete {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .btn-delete:hover {
    opacity: 1;
  }

  .create-form {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .create-form h2 {
    color: #667eea;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }

  input,
  select,
  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  input:focus,
  select:focus,
  textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .rpe-value {
    display: inline-block;
    margin-top: 0.5rem;
    font-weight: 600;
    color: #667eea;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .workouts-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }

  .workout-card {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .workout-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }

  .workout-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  .workout-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .type-emoji {
    font-size: 1.5rem;
  }

  .workout-card h3 {
    margin: 0;
    color: #333;
    font-size: 1.25rem;
  }

  .workout-type {
    color: #667eea;
    font-weight: 600;
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
  }

  .workout-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .detail {
    background: #f5f7fa;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.9rem;
    color: #555;
  }

  .workout-description {
    color: #666;
    line-height: 1.5;
    margin: 0;
    font-size: 0.95rem;
  }

  .loading {
    text-align: center;
    color: #999;
    padding: 3rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #999;
  }

  .empty-state p:first-child {
    font-size: 3rem;
    margin: 0 0 1rem 0;
  }

  .empty-state p:last-child {
    font-size: 1.1rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    h1 {
      font-size: 2rem;
    }

    .workouts-list {
      grid-template-columns: 1fr;
    }
  }
</style>
