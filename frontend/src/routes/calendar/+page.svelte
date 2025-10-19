<script lang="ts">
  import { onMount } from "svelte";
  import type { TrainingPlan, WorkoutSession, SessionStatus } from "$lib/types";

  const ATHLETE_ID = "default-athlete-123";

  let activePlan = $state<TrainingPlan | null>(null);
  let currentWeekStart = $state(new Date());
  let weekSessions = $state<WorkoutSession[]>([]);
  let selectedSession = $state<WorkoutSession | null>(null);
  let isLoading = $state(true);
  let errorMessage = $state<string | null>(null);
  let sessionNotes = $state("");
  let isSaving = $state(false);

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
    await loadActivePlan();
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

  async function loadActivePlan() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/training-plans?athlete_id=${ATHLETE_ID}`
      );
      if (response.ok) {
        const plans: TrainingPlan[] = await response.json();
        activePlan = plans.find((p) => p.is_active) || null;
      }
    } catch (error) {
      console.error("Error loading active plan:", error);
    }
  }

  async function loadWeekSessions() {
    if (!activePlan) return;

    try {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);

      const response = await fetch(
        `http://localhost:3000/api/v1/workout-sessions?athlete_id=${ATHLETE_ID}&training_plan_id=${activePlan.id}&start_date=${formatDateForAPI(currentWeekStart)}&end_date=${formatDateForAPI(weekEnd)}`
      );

      if (response.ok) {
        weekSessions = await response.json();
      }
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

  function getSessionForDay(date: Date): WorkoutSession | undefined {
    const dateStr = formatDateForAPI(date);
    return weekSessions.find((s) => s.scheduled_date === dateStr);
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
</script>

<div class="container">
  <header>
    <div>
      <h1>Training Calendar</h1>
      {#if activePlan}
        <p class="subtitle">{activePlan.name} - {activePlan.phase_type}</p>
      {:else}
        <p class="subtitle">No active training plan</p>
      {/if}
    </div>
  </header>

  {#if errorMessage}
    <div class="error-banner">{errorMessage}</div>
  {/if}

  {#if !activePlan && !isLoading}
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
        {@const session = getSessionForDay(day)}
        {@const isTodayDay = isToday(day)}
        <div
          class="day-card {isTodayDay ? 'today' : ''} {session
            ? 'has-session'
            : ''}"
          onclick={() => session && selectSession(session)}
        >
          <div class="day-header">
            <span class="day-name">{daysOfWeek[index]}</span>
            <span class="day-date">{day.getDate()}</span>
          </div>

          {#if session}
            <div
              class="session-summary"
              style="border-left-color: {getStatusColor(session.status)}"
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
            <div class="detail-value">
              {selectedSession.workout_summary || "No details available"}
            </div>
          </div>

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

  .session-summary {
    border-left: 4px solid #667eea;
    padding-left: 0.75rem;
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
