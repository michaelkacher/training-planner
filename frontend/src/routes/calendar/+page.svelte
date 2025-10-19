<script lang="ts">
  import { onMount } from "svelte";
  import type { TrainingPlan, WorkoutSession, SessionStatus } from "$lib/types";

  const ATHLETE_ID = "default-athlete-123";

  let activePlans = $state<TrainingPlan[]>([]);
  let currentWeekStart = $state(new Date());
  let weekSessions = $state<WorkoutSession[]>([]);
  let selectedSession = $state<WorkoutSession | null>(null);
  let isLoading = $state(true);
  let errorMessage = $state<string | null>(null);
  let sessionNotes = $state("");
  let isSaving = $state(false);

  // Drag and drop state
  let draggedSession = $state<WorkoutSession | null>(null);
  let dragOverDate = $state<string | null>(null);
  let isDragging = $state(false);

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  onMount(async () => {
    setToCurrentWeek();
    await loadActivePlans();
    await loadWeekSessions();
    isLoading = false;
  });

  function setToCurrentWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);
    currentWeekStart = weekStart;
  }

  async function loadActivePlans() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/training-plans?athlete_id=${ATHLETE_ID}&is_active=true`
      );
      if (response.ok) {
        activePlans = await response.json();
      }
    } catch (error) {
      console.error("Error loading active plans:", error);
    }
  }

  async function loadWeekSessions() {
    if (activePlans.length === 0) {
      weekSessions = [];
      return;
    }

    try {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);

      // Load sessions from all active plans
      const allSessions: WorkoutSession[] = [];

      for (const plan of activePlans) {
        const response = await fetch(
          `http://localhost:3000/api/v1/workout-sessions?athlete_id=${ATHLETE_ID}&training_plan_id=${plan.id}&start_date=${formatDateForAPI(currentWeekStart)}&end_date=${formatDateForAPI(weekEnd)}`
        );

        if (response.ok) {
          const sessions = await response.json();
          allSessions.push(...sessions);
        }
      }

      // Sort by date
      weekSessions = allSessions.sort((a, b) =>
        a.scheduled_date.localeCompare(b.scheduled_date)
      );
    } catch (error) {
      console.error("Error loading week sessions:", error);
      errorMessage = "Failed to load workout sessions";
    }
  }

  function formatDateForAPI(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function getWeekDays(): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart);
      day.setDate(currentWeekStart.getDate() + i);
      days.push(day);
    }
    return days;
  }

  function getSessionsForDay(date: Date): WorkoutSession[] {
    const dateStr = formatDateForAPI(date);
    return weekSessions.filter((s) => s.scheduled_date === dateStr);
  }

  async function previousWeek() {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    currentWeekStart = newStart;
    await loadWeekSessions();
  }

  async function nextWeek() {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    currentWeekStart = newStart;
    await loadWeekSessions();
  }

  async function goToCurrentWeek() {
    setToCurrentWeek();
    await loadWeekSessions();
  }

  function selectSession(session: WorkoutSession | null) {
    selectedSession = session;
    sessionNotes = session?.notes || "";
  }

  async function updateSessionStatus(status: SessionStatus) {
    if (!selectedSession) return;

    isSaving = true;
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/workout-sessions/${selectedSession.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        // Update local state
        weekSessions = weekSessions.map((s) =>
          s.id === updated.id ? updated : s
        );
        selectedSession = updated;
      }
    } catch (error) {
      console.error("Error updating session status:", error);
      errorMessage = "Failed to update workout status";
    } finally {
      isSaving = false;
    }
  }

  async function saveNotes() {
    if (!selectedSession) return;

    isSaving = true;
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/workout-sessions/${selectedSession.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes: sessionNotes }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        weekSessions = weekSessions.map((s) =>
          s.id === updated.id ? updated : s
        );
        selectedSession = updated;
      }
    } catch (error) {
      console.error("Error saving notes:", error);
      errorMessage = "Failed to save notes";
    } finally {
      isSaving = false;
    }
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function getStatusColor(status: SessionStatus): string {
    switch (status) {
      case "completed":
        return "#10b981";
      case "partial":
        return "#f59e0b";
      case "skipped":
        return "#9ca3af";
      default:
        return "#667eea";
    }
  }

  function getStatusLabel(status: SessionStatus): string {
    switch (status) {
      case "completed":
        return "Completed";
      case "partial":
        return "Partially Completed";
      case "skipped":
        return "Skipped";
      default:
        return "Scheduled";
    }
  }

  // Drag and drop handlers for desktop
  function handleDragStart(event: DragEvent, session: WorkoutSession) {
    if (!event.dataTransfer) return;
    draggedSession = session;
    isDragging = true;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", ""); // Required for Firefox
  }

  function handleDragEnd() {
    draggedSession = null;
    dragOverDate = null;
    isDragging = false;
  }

  function handleDragOver(event: DragEvent, date: Date) {
    event.preventDefault();
    if (!event.dataTransfer) return;
    event.dataTransfer.dropEffect = "move";
    dragOverDate = formatDateForAPI(date);
  }

  function handleDragLeave() {
    dragOverDate = null;
  }

  async function handleDrop(event: DragEvent, targetDate: Date) {
    event.preventDefault();
    if (!draggedSession) return;

    const newDate = formatDateForAPI(targetDate);
    const oldDate = draggedSession.scheduled_date;

    // Don't do anything if dropped on same day
    if (newDate === oldDate) {
      handleDragEnd();
      return;
    }

    // Verify target is within current week
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(currentWeekStart.getDate() + 6);

    if (targetDate < currentWeekStart || targetDate > weekEnd) {
      // Target is outside current week, don't allow
      console.log("Cannot drop outside current week");
      handleDragEnd();
      return;
    }

    // Update the session date
    await updateSessionDate(draggedSession.id, newDate);
    handleDragEnd();
  }

  // Touch handlers for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  function handleTouchStart(event: TouchEvent, session: WorkoutSession) {
    const touch = event.touches[0];
    if (!touch) return;

    draggedSession = session;
    isDragging = true;
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }

  function handleTouchMove(event: TouchEvent) {
    if (!draggedSession) return;

    const touch = event.touches[0];
    if (!touch) return;

    // Find which day card is under the touch point
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dayCard = element?.closest('.day-card');

    if (dayCard) {
      const dateStr = dayCard.getAttribute('data-date');
      if (dateStr) {
        dragOverDate = dateStr;
      }
    }
  }

  async function handleTouchEnd(event: TouchEvent) {
    if (!draggedSession) return;

    const touch = event.changedTouches[0];
    if (!touch) {
      handleDragEnd();
      return;
    }

    // Find which day card the touch ended on
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const dayCard = element?.closest('.day-card');

    if (dayCard) {
      const dateStr = dayCard.getAttribute('data-date');
      if (dateStr && dateStr !== draggedSession.scheduled_date) {
        // Verify target is within current week
        const targetDate = new Date(dateStr);
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(currentWeekStart.getDate() + 6);

        if (targetDate >= currentWeekStart && targetDate <= weekEnd) {
          await updateSessionDate(draggedSession.id, dateStr);
        } else {
          console.log("Cannot drop outside current week");
        }
      }
    }

    handleDragEnd();
  }

  async function updateSessionDate(sessionId: string, newDate: string) {
    isSaving = true;
    errorMessage = null;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/workout-sessions/${sessionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scheduled_date: newDate }),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        // Update local state
        weekSessions = weekSessions.map((s) =>
          s.id === updated.id ? updated : s
        );

        // Update selected session if it's the one being moved
        if (selectedSession?.id === updated.id) {
          selectedSession = updated;
        }
      } else {
        errorMessage = "Failed to move workout";
      }
    } catch (error) {
      console.error("Error updating session date:", error);
      errorMessage = "Failed to move workout";
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="container">
  <header>
    <div>
      <h1>Training Calendar</h1>
      {#if activePlans.length > 0}
        <p class="subtitle">
          {activePlans.length} Active Plan{activePlans.length > 1 ? 's' : ''}:
          {activePlans.map(p => p.name).join(', ')}
        </p>
      {:else}
        <p class="subtitle">No active training plans</p>
      {/if}
    </div>
  </header>

  {#if errorMessage}
    <div class="error-banner">{errorMessage}</div>
  {/if}

  {#if activePlans.length === 0 && !isLoading}
    <div class="empty-state">
      <div class="empty-icon">📅</div>
      <h2>No Active Training Plan</h2>
      <p>Activate a training plan to start using the calendar feature.</p>
      <a href="/plans" class="btn-primary">Go to My Plans</a>
    </div>
  {:else if isLoading}
    <div class="loading">Loading calendar...</div>
  {:else}
    <div class="calendar-controls">
      <button onclick={previousWeek} class="btn-nav">← Previous Week</button>
      <button onclick={goToCurrentWeek} class="btn-today">Current Week</button>
      <button onclick={nextWeek} class="btn-nav">Next Week →</button>
    </div>

    <div class="calendar-grid">
      {#each getWeekDays() as day, index (day.toISOString())}
        {@const sessions = getSessionsForDay(day)}
        {@const isTodayDay = isToday(day)}
        {@const dateStr = formatDateForAPI(day)}
        {@const isDropTarget = dragOverDate === dateStr}
        {@const hasBeingDragged = sessions.some(s => s.id === draggedSession?.id)}
        <div
          class="day-card {isTodayDay ? 'today' : ''} {sessions.length > 0
            ? 'has-session'
            : ''} {isDropTarget ? 'drop-target' : ''} {hasBeingDragged ? 'dragging' : ''}"
          data-date={dateStr}
          ondragover={(e) => handleDragOver(e, day)}
          ondragleave={handleDragLeave}
          ondrop={(e) => handleDrop(e, day)}
        >
          <div class="day-header">
            <span class="day-name">{daysOfWeek[index]}</span>
            <span class="day-date">{day.getDate()}</span>
          </div>

          {#if sessions.length > 0}
            <div class="sessions-container">
              {#each sessions as session (session.id)}
                <div
                  class="session-summary draggable-session"
                  style="border-left-color: {getStatusColor(session.status)}"
                  draggable="true"
                  ondragstart={(e) => handleDragStart(e, session)}
                  ondragend={handleDragEnd}
                  ontouchstart={(e) => handleTouchStart(e, session)}
                  ontouchmove={handleTouchMove}
                  ontouchend={handleTouchEnd}
                  onclick={() => !isDragging && selectSession(session)}
                >
                  <div class="session-title">
                    {session.workout_summary || "Workout Scheduled"}
                  </div>
                  <div
                    class="session-status"
                    style="color: {getStatusColor(session.status)}"
                  >
                    {getStatusLabel(session.status)}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="rest-day">Rest Day</div>
          {/if}
        </div>
      {/each}
    </div>

    {#if selectedSession}
      <div class="workout-detail">
        <div class="detail-header">
          <h2>Workout Details</h2>
          <button onclick={() => selectSession(null)} class="btn-close"
            >×</button
          >
        </div>

        <div class="detail-body">
          <div class="detail-section">
            <div class="detail-label">Date</div>
            <div class="detail-value">
              {formatDate(new Date(selectedSession.scheduled_date))}
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-label">Workout</div>
            <div class="detail-value workout-title">
              {selectedSession.workout_title || selectedSession.workout_summary || "No details available"}
            </div>
          </div>

          {#if selectedSession.exercises && selectedSession.exercises.length > 0}
            <div class="detail-section exercises-section">
              <div class="detail-label">Exercises</div>
              <div class="exercises-list">
                {#each selectedSession.exercises as exercise, index}
                  <div class="exercise-item">
                    <div class="exercise-header">
                      <span class="exercise-number">{index + 1}</span>
                      <strong class="exercise-name">{exercise.name}</strong>
                    </div>
                    <div class="exercise-details">
                      {#if exercise.sets}
                        <span class="exercise-meta">{exercise.sets} sets</span>
                      {/if}
                      {#if exercise.reps}
                        <span class="exercise-meta">× {exercise.reps} reps</span>
                      {/if}
                      {#if exercise.focus}
                        <span class="exercise-focus">Focus: {exercise.focus}</span>
                      {/if}
                    </div>
                    {#if exercise.notes}
                      <div class="exercise-notes">{exercise.notes}</div>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}

          <div class="detail-section">
            <div class="detail-label">Status</div>
            <div class="status-buttons">
              <button
                class="status-btn {selectedSession.status === 'completed'
                  ? 'active'
                  : ''}"
                style="--status-color: #10b981"
                onclick={() => updateSessionStatus("completed")}
                disabled={isSaving}
              >
                ✓ Completed
              </button>
              <button
                class="status-btn {selectedSession.status === 'partial'
                  ? 'active'
                  : ''}"
                style="--status-color: #f59e0b"
                onclick={() => updateSessionStatus("partial")}
                disabled={isSaving}
              >
                ◐ Partial
              </button>
              <button
                class="status-btn {selectedSession.status === 'skipped'
                  ? 'active'
                  : ''}"
                style="--status-color: #9ca3af"
                onclick={() => updateSessionStatus("skipped")}
                disabled={isSaving}
              >
                ⊘ Skipped
              </button>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-label">Notes</div>
            <textarea
              bind:value={sessionNotes}
              placeholder="Add notes about this workout session..."
              rows="5"
            ></textarea>
            <button
              onclick={saveNotes}
              class="btn-primary save-notes"
              disabled={isSaving ||
                sessionNotes === (selectedSession.notes || "")}
            >
              {isSaving ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  :global(body) {
    background: #f5f7fa;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    margin-bottom: 2rem;
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

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
    background: white;
    border-radius: 16px;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h2 {
    color: #333;
    margin: 0 0 0.5rem 0;
  }

  .empty-state p {
    color: #666;
    margin: 0 0 2rem 0;
  }

  .loading {
    text-align: center;
    color: #666;
    padding: 3rem;
    background: white;
    border-radius: 16px;
  }

  .calendar-controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .btn-nav,
  .btn-today {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-nav {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-nav:hover {
    background: #667eea;
    color: white;
  }

  .btn-today {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
  }

  .btn-today:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .day-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    min-height: 150px;
    border: 2px solid transparent;
    transition: all 0.2s;
  }

  .day-card.today {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .day-card.has-session {
    cursor: pointer;
  }

  .day-card.has-session:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .day-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .day-name {
    font-weight: 700;
    color: #333;
    font-size: 0.9rem;
  }

  .day-date {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  .sessions-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .session-summary {
    border-left: 4px solid #667eea;
    padding-left: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
  }

  .draggable-session {
    cursor: grab;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }

  .draggable-session:active {
    cursor: grabbing;
  }

  .day-card.dragging {
    opacity: 0.5;
  }

  .day-card.drop-target {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: scale(1.02);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  }

  .day-card.drop-target .day-name,
  .day-card.drop-target .day-date {
    color: white;
  }

  .day-card.drop-target .rest-day {
    color: rgba(255, 255, 255, 0.8);
  }

  .session-title {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  .session-status {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .rest-day {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 2rem 0;
  }

  .workout-detail {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #f0f0f0;
  }

  .detail-header h2 {
    color: #667eea;
    margin: 0;
    font-size: 1.8rem;
  }

  .btn-close {
    background: #f0f0f0;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
  }

  .btn-close:hover {
    background: #e0e0e0;
  }

  .detail-body {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .detail-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .detail-label {
    font-weight: 700;
    color: #333;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-value {
    color: #666;
    font-size: 1.1rem;
  }

  .status-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .status-btn {
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--status-color);
    background: white;
    color: var(--status-color);
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .status-btn:hover:not(:disabled) {
    background: var(--status-color);
    color: white;
  }

  .status-btn.active {
    background: var(--status-color);
    color: white;
  }

  .status-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  textarea {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
  }

  textarea:focus {
    outline: none;
    border-color: #667eea;
  }

  .save-notes {
    align-self: flex-start;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
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

  .workout-title {
    font-weight: 600;
    font-size: 1.2rem;
    color: #333;
  }

  .exercises-section {
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 12px;
  }

  .exercises-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .exercise-item {
    background: white;
    padding: 1rem;
    border-radius: 8px;
    border-left: 4px solid #667eea;
  }

  .exercise-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .exercise-number {
    background: #667eea;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .exercise-name {
    color: #333;
    font-size: 1rem;
  }

  .exercise-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-left: 2rem;
    margin-bottom: 0.5rem;
  }

  .exercise-meta {
    background: #e0e7ff;
    color: #667eea;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .exercise-focus {
    color: #666;
    font-size: 0.9rem;
    font-style: italic;
  }

  .exercise-notes {
    margin-left: 2rem;
    color: #666;
    font-size: 0.9rem;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 6px;
    border-left: 2px solid #d1d5db;
  }

  @media (max-width: 1024px) {
    .calendar-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .calendar-grid {
      grid-template-columns: 1fr;
    }

    .calendar-controls {
      flex-direction: column;
    }
  }
</style>
