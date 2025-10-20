<script lang="ts">
  import { VOLLEYBALL_SKILLS, type Skill, type Exercise } from "$lib/data/skills";

  const ATHLETE_ID = "default-athlete-123";

  // Wizard state
  let selectedSkill = $state<Skill | null>(null);
  let wizardStep = $state<'skills' | 'schedule' | 'exercises'>('skills');

  // Schedule state
  let numberOfWeeks = $state(4);
  let selectedDays = $state<boolean[]>([false, true, false, true, false, true, false]); // Mon, Wed, Fri selected by default
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Exercise selection state
  let selectedExercises = $state<Exercise[]>([]);

  // UI state
  let isCreating = $state(false);
  let errorMessage = $state<string | null>(null);
  let successMessage = $state<string | null>(null);

  function selectSkill(skill: Skill) {
    selectedSkill = skill;
    wizardStep = 'schedule';
    selectedExercises = [];
  }

  function backToSkills() {
    wizardStep = 'skills';
    selectedSkill = null;
    selectedExercises = [];
  }

  function toggleDay(index: number) {
    selectedDays[index] = !selectedDays[index];
  }

  function proceedToExercises() {
    // Validate at least one day selected
    if (!selectedDays.some(day => day)) {
      errorMessage = "Please select at least one training day";
      return;
    }
    wizardStep = 'exercises';
  }

  function backToSchedule() {
    wizardStep = 'schedule';
  }

  function toggleExercise(exercise: Exercise) {
    const index = selectedExercises.findIndex(e => e.name === exercise.name);
    if (index >= 0) {
      selectedExercises = selectedExercises.filter((_, i) => i !== index);
    } else {
      selectedExercises = [...selectedExercises, exercise];
    }
  }

  function isExerciseSelected(exercise: Exercise): boolean {
    return selectedExercises.some(e => e.name === exercise.name);
  }

  function getExercisesByDifficulty(difficulty: 'easy' | 'medium' | 'challenging'): Exercise[] {
    if (!selectedSkill) return [];
    return selectedSkill.exercises.filter(e => e.difficulty === difficulty);
  }

  async function createWorkoutPlan() {
    if (!selectedSkill || selectedExercises.length === 0) {
      errorMessage = "Please select at least one exercise";
      return;
    }

    isCreating = true;
    errorMessage = null;
    successMessage = null;

    try {
      // Calculate dates
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const startDate = `${year}-${month}-${day}`;

      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() + (numberOfWeeks * 7));
      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');
      const endDateStr = `${endYear}-${endMonth}-${endDay}`;

      // Create training plan
      const planData = {
        athlete_id: ATHLETE_ID,
        name: `${selectedSkill.title} - Custom Plan`,
        description: `Custom workout plan focused on: ${selectedSkill.description}`,
        phase_type: "Off-Season",
        start_date: startDate,
        end_date: endDateStr,
        phases: [{
          name: selectedSkill.title,
          weeks: `${numberOfWeeks} weeks`,
          description: selectedSkill.description,
          workoutDays: createWorkoutDays()
        }]
      };

      const response = await fetch("http://localhost:3000/api/v1/training-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData)
      });

      if (!response.ok) {
        throw new Error("Failed to create training plan");
      }

      const createdPlan = await response.json();

      // Activate the plan
      const activateResponse = await fetch(
        `http://localhost:3000/api/v1/training-plans/${createdPlan.id}/activate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        }
      );

      if (!activateResponse.ok) {
        throw new Error("Failed to activate training plan");
      }

      successMessage = `Successfully created "${selectedSkill.title}" workout plan! Redirecting to calendar...`;

      setTimeout(() => {
        window.location.href = "/calendar";
      }, 2000);

    } catch (error) {
      console.error("Error creating workout plan:", error);
      errorMessage = error instanceof Error ? error.message : "An error occurred";
    } finally {
      isCreating = false;
    }
  }

  function createWorkoutDays() {
    const workoutDays: any[] = [];
    const selectedDayIndices = selectedDays
      .map((selected, index) => selected ? index : -1)
      .filter(index => index !== -1);

    // Give all selected exercises to each workout day
    selectedDayIndices.forEach((dayIndex) => {
      workoutDays.push({
        day: dayIndex,
        title: `${selectedSkill!.title} - ${daysOfWeek[dayIndex]}`,
        exercises: selectedExercises.map(ex => ({
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          duration: ex.duration,
          focus: selectedSkill!.title,
          notes: ex.notes
        }))
      });
    });

    return workoutDays;
  }

  $effect(() => {
    if (errorMessage) {
      setTimeout(() => {
        errorMessage = null;
      }, 5000);
    }
  });
</script>

<div class="container">
  <header>
    <h1>Create Workout Plan</h1>
    <p class="subtitle">Build a custom training plan focused on your goals</p>
  </header>

  {#if errorMessage}
    <div class="error-banner">{errorMessage}</div>
  {/if}

  {#if successMessage}
    <div class="success-banner">{successMessage}</div>
  {/if}

  {#if wizardStep === 'skills'}
    <div class="skills-grid">
      {#each VOLLEYBALL_SKILLS as skill (skill.id)}
        <div class="skill-card" onclick={() => selectSkill(skill)}>
          <div class="skill-icon">{skill.icon}</div>
          <h2>{skill.title}</h2>
          <p>{skill.description}</p>
          <div class="skill-footer">
            <span class="exercise-count">{skill.exercises.length} exercises</span>
            <span class="arrow">→</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if wizardStep === 'schedule' && selectedSkill}
    <div class="wizard-container">
      <div class="wizard-header">
        <button class="btn-back" onclick={backToSkills}>← Back to Skills</button>
        <h2>{selectedSkill.icon} {selectedSkill.title}</h2>
      </div>

      <div class="schedule-section">
        <h3>How many weeks do you want to train?</h3>
        <div class="weeks-selector">
          <input type="range" min="1" max="12" bind:value={numberOfWeeks} />
          <span class="weeks-value">{numberOfWeeks} weeks</span>
        </div>
      </div>

      <div class="schedule-section">
        <h3>Which days will you commit to training?</h3>
        <div class="days-grid">
          {#each daysOfWeek as day, index}
            <button
              class="day-button {selectedDays[index] ? 'selected' : ''}"
              onclick={() => toggleDay(index)}
            >
              {day}
            </button>
          {/each}
        </div>
        <p class="helper-text">
          {selectedDays.filter(d => d).length} days selected
        </p>
      </div>

      <div class="wizard-footer">
        <button class="btn-primary" onclick={proceedToExercises}>
          Next: Choose Exercises →
        </button>
      </div>
    </div>
  {/if}

  {#if wizardStep === 'exercises' && selectedSkill}
    <div class="wizard-container">
      <div class="wizard-header">
        <button class="btn-back" onclick={backToSchedule}>← Back to Schedule</button>
        <h2>{selectedSkill.icon} Choose Your Exercises</h2>
        <p class="subtitle">Select exercises that match your fitness level and goals</p>
      </div>

      <div class="exercises-columns">
        <div class="exercise-column easy">
          <h3>🟢 Easy</h3>
          <p class="column-description">Great for beginners or warm-up</p>
          {#each getExercisesByDifficulty('easy') as exercise}
            <div
              class="exercise-card {isExerciseSelected(exercise) ? 'selected' : ''}"
              onclick={() => toggleExercise(exercise)}
            >
              <div class="exercise-header">
                <strong>{exercise.name}</strong>
                {#if isExerciseSelected(exercise)}
                  <span class="check-mark">✓</span>
                {/if}
              </div>
              <div class="exercise-meta">
                {#if exercise.sets && exercise.reps}
                  <span>{exercise.sets} sets × {exercise.reps}</span>
                {:else if exercise.duration}
                  <span>{exercise.duration}</span>
                {/if}
              </div>
              {#if exercise.notes}
                <p class="exercise-notes">{exercise.notes}</p>
              {/if}
            </div>
          {/each}
        </div>

        <div class="exercise-column medium">
          <h3>🟡 Medium</h3>
          <p class="column-description">Intermediate level training</p>
          {#each getExercisesByDifficulty('medium') as exercise}
            <div
              class="exercise-card {isExerciseSelected(exercise) ? 'selected' : ''}"
              onclick={() => toggleExercise(exercise)}
            >
              <div class="exercise-header">
                <strong>{exercise.name}</strong>
                {#if isExerciseSelected(exercise)}
                  <span class="check-mark">✓</span>
                {/if}
              </div>
              <div class="exercise-meta">
                {#if exercise.sets && exercise.reps}
                  <span>{exercise.sets} sets × {exercise.reps}</span>
                {:else if exercise.duration}
                  <span>{exercise.duration}</span>
                {/if}
              </div>
              {#if exercise.notes}
                <p class="exercise-notes">{exercise.notes}</p>
              {/if}
            </div>
          {/each}
        </div>

        <div class="exercise-column challenging">
          <h3>🔴 Challenging</h3>
          <p class="column-description">Advanced athletes</p>
          {#each getExercisesByDifficulty('challenging') as exercise}
            <div
              class="exercise-card {isExerciseSelected(exercise) ? 'selected' : ''}"
              onclick={() => toggleExercise(exercise)}
            >
              <div class="exercise-header">
                <strong>{exercise.name}</strong>
                {#if isExerciseSelected(exercise)}
                  <span class="check-mark">✓</span>
                {/if}
              </div>
              <div class="exercise-meta">
                {#if exercise.sets && exercise.reps}
                  <span>{exercise.sets} sets × {exercise.reps}</span>
                {:else if exercise.duration}
                  <span>{exercise.duration}</span>
                {/if}
              </div>
              {#if exercise.notes}
                <p class="exercise-notes">{exercise.notes}</p>
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <div class="wizard-footer">
        <div class="selection-summary">
          {selectedExercises.length} exercise{selectedExercises.length !== 1 ? 's' : ''} selected
        </div>
        <button
          class="btn-primary"
          onclick={createWorkoutPlan}
          disabled={selectedExercises.length === 0 || isCreating}
        >
          {isCreating ? "Creating Plan..." : "Create Workout Plan"}
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    margin-bottom: 3rem;
  }

  h1 {
    color: white;
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
  }

  .subtitle {
    color: black;
    font-size: 1.1rem;
    margin: 0;
  }

  .error-banner {
    background: #fee;
    color: #c33;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  .success-banner {
    background: #efe;
    color: #3c3;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-weight: 500;
  }

  /* Skills Grid */
  .skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  .skill-card {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
  }

  .skill-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
    border-color: #667eea;
  }

  .skill-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .skill-card h2 {
    color: #333;
    font-size: 1.5rem;
    margin: 0 0 0.5rem 0;
  }

  .skill-card p {
    color: #666;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .skill-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .exercise-count {
    color: #667eea;
    font-weight: 600;
  }

  .arrow {
    font-size: 1.5rem;
    color: #667eea;
  }

  /* Wizard Container */
  .wizard-container {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .wizard-header {
    margin-bottom: 2rem;
  }

  .wizard-header h2 {
    color: #333;
    font-size: 2rem;
    margin: 1rem 0 0.5rem 0;
  }

  .btn-back {
    background: #f0f0f0;
    color: #667eea;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-back:hover {
    background: #e0e0e0;
  }

  /* Schedule Section */
  .schedule-section {
    margin-bottom: 3rem;
  }

  .schedule-section h3 {
    color: #333;
    font-size: 1.3rem;
    margin: 0 0 1rem 0;
  }

  .weeks-selector {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .weeks-selector input[type="range"] {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: #e0e0e0;
    outline: none;
  }

  .weeks-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
    min-width: 100px;
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
  }

  .day-button {
    padding: 1rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .day-button:hover {
    border-color: #667eea;
  }

  .day-button.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: #667eea;
  }

  .helper-text {
    color: #666;
    margin-top: 1rem;
    font-style: italic;
  }

  /* Exercise Columns */
  .exercises-columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .exercise-column {
    border-radius: 12px;
    padding: 1.5rem;
  }

  .exercise-column.easy {
    background: #f0fdf4;
    border: 2px solid #86efac;
  }

  .exercise-column.medium {
    background: #fffbeb;
    border: 2px solid #fcd34d;
  }

  .exercise-column.challenging {
    background: #fef2f2;
    border: 2px solid #fca5a5;
  }

  .exercise-column h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
  }

  .column-description {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
  }

  .exercise-card {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    border: 2px solid transparent;
  }

  .exercise-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .exercise-card.selected {
    border-color: #667eea;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
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

  .check-mark {
    color: #10b981;
    font-size: 1.2rem;
    font-weight: 700;
  }

  .exercise-meta {
    color: #667eea;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .exercise-notes {
    color: #666;
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
  }

  /* Wizard Footer */
  .wizard-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 2rem;
    border-top: 2px solid #e0e0e0;
  }

  .selection-summary {
    font-size: 1.1rem;
    font-weight: 600;
    color: #667eea;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 1024px) {
    .exercises-columns {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .skills-grid {
      grid-template-columns: 1fr;
    }

    .days-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
