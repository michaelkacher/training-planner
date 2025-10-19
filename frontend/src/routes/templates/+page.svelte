<script lang="ts">
  import { TRAINING_TEMPLATES } from '$lib/data/training-templates';
  import type { TrainingTemplate } from '$lib/data/training-templates';

  let selectedTemplate = $state<TrainingTemplate | null>(null);

  function selectTemplate(template: TrainingTemplate) {
    selectedTemplate = template;
  }

  function closeModal() {
    selectedTemplate = null;
  }

  function startFromTemplate(template: TrainingTemplate) {
    // TODO: Implement creating workouts from template
    alert(`Starting from template: ${template.title}\n\nThis will create ${template.phases.length} phases with multiple workouts. Coming soon!`);
  }
</script>

<div class="container">
  <header>
    <div>
      <h1>Training Plan Templates</h1>
      <p class="subtitle">Start from a pre-configured plan designed by experts</p>
    </div>
    <a href="/workouts" class="btn-secondary">My Custom Workouts →</a>
  </header>

  <div class="templates-grid">
    {#each TRAINING_TEMPLATES as template (template.id)}
      <div class="template-card" onclick={() => selectTemplate(template)}>
        <div class="template-header">
          <h2>{template.title}</h2>
          <span class="duration">{template.duration}</span>
        </div>

        <div class="level-badge">{template.level}</div>

        <div class="goals">
          <h3>What You'll Improve:</h3>
          <ul>
            {#each template.goals as goal}
              <li>{goal}</li>
            {/each}
          </ul>
        </div>

        <p class="description">{template.description}</p>

        <div class="phases-summary">
          <strong>{template.phases.length} Training Phases</strong>
          <span class="workout-count">
            {template.phases.reduce((sum, phase) => sum + phase.workoutDays.length, 0)} Workout Days
          </span>
        </div>

        <button class="btn-view">View Details →</button>
      </div>
    {/each}
  </div>
</div>

{#if selectedTemplate}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal" onclick={(e) => e.stopPropagation()}>
      <button class="modal-close" onclick={closeModal}>×</button>

      <div class="modal-header">
        <h2>{selectedTemplate.title}</h2>
        <div class="modal-meta">
          <span class="duration">{selectedTemplate.duration}</span>
          <span class="level-badge">{selectedTemplate.level}</span>
        </div>
      </div>

      <div class="modal-body">
        <div class="goals-section">
          <h3>Training Goals:</h3>
          <div class="goals-list">
            {#each selectedTemplate.goals as goal}
              <span class="goal-tag">{goal}</span>
            {/each}
          </div>
        </div>

        <p class="template-description">{selectedTemplate.description}</p>

        <div class="phases-section">
          {#each selectedTemplate.phases as phase}
            <div class="phase">
              <h3>{phase.name}</h3>
              <p class="phase-meta">{phase.weeks}</p>
              <p class="phase-description">{phase.description}</p>

              <div class="workout-days">
                {#each phase.workoutDays as workoutDay}
                  <div class="workout-day">
                    <h4>Day {workoutDay.day}: {workoutDay.title}</h4>
                    <div class="exercises">
                      {#each workoutDay.exercises as exercise}
                        <div class="exercise">
                          <div class="exercise-header">
                            <strong>{exercise.name}</strong>
                            {#if exercise.sets && exercise.reps}
                              <span class="sets-reps">{exercise.sets} × {exercise.reps}</span>
                            {:else if exercise.reps}
                              <span class="sets-reps">{exercise.reps}</span>
                            {/if}
                          </div>
                          <div class="exercise-details">
                            <span class="focus">Focus: {exercise.focus}</span>
                            {#if exercise.notes}
                              <span class="notes">{exercise.notes}</span>
                            {/if}
                          </div>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" onclick={closeModal}>Close</button>
        <button class="btn-primary" onclick={() => startFromTemplate(selectedTemplate)}>
          Start This Program
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
  }

  h1 {
    color: #667eea;
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
  }

  .btn-secondary {
    background: #f0f0f0;
    color: #667eea;
    border: 2px solid #667eea;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
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

  .templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 2rem;
  }

  .template-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 2px solid transparent;
  }

  .template-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .template-card h2 {
    color: #333;
    font-size: 1.5rem;
    margin: 0;
    flex: 1;
  }

  .duration {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .level-badge {
    display: inline-block;
    background: #f0f0f0;
    color: #667eea;
    padding: 0.4rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .goals h3 {
    color: #667eea;
    font-size: 1rem;
    margin: 1.5rem 0 0.75rem 0;
  }

  .goals ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .goals li {
    padding: 0.5rem 0;
    color: #555;
    position: relative;
    padding-left: 1.5rem;
  }

  .goals li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: bold;
  }

  .description {
    color: #666;
    line-height: 1.6;
    margin: 1.5rem 0;
  }

  .phases-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 1.5rem 0;
  }

  .phases-summary strong {
    color: #333;
  }

  .workout-count {
    color: #667eea;
    font-weight: 600;
  }

  .btn-view {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-view:hover {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }

  .modal {
    background: white;
    border-radius: 16px;
    max-width: 900px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .modal-close {
    position: sticky;
    top: 1rem;
    right: 1rem;
    float: right;
    background: #f0f0f0;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 10;
  }

  .modal-close:hover {
    background: #e0e0e0;
  }

  .modal-header {
    padding: 2rem 2rem 1rem 2rem;
  }

  .modal-header h2 {
    color: #333;
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  .modal-meta {
    display: flex;
    gap: 1rem;
  }

  .modal-body {
    padding: 0 2rem 2rem 2rem;
  }

  .goals-section h3 {
    color: #667eea;
    margin-bottom: 1rem;
  }

  .goals-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .goal-tag {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .template-description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .phase {
    margin-bottom: 2.5rem;
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
  }

  .phase h3 {
    color: #667eea;
    margin: 0 0 0.5rem 0;
  }

  .phase-meta {
    color: #999;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
  }

  .phase-description {
    color: #666;
    margin: 0 0 1.5rem 0;
  }

  .workout-day {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .workout-day h4 {
    color: #333;
    margin: 0 0 1rem 0;
  }

  .exercise {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 0.75rem;
  }

  .exercise:last-child {
    margin-bottom: 0;
  }

  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .exercise-header strong {
    color: #333;
  }

  .sets-reps {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .exercise-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .focus {
    color: #667eea;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .notes {
    color: #666;
    font-size: 0.85rem;
    font-style: italic;
  }

  .modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    position: sticky;
    bottom: 0;
    background: white;
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

    .templates-grid {
      grid-template-columns: 1fr;
    }

    .modal-overlay {
      padding: 1rem;
    }

    .modal {
      max-height: 95vh;
    }
  }
</style>
