<script lang="ts">
  import { onMount } from "svelte";
  import type { WorkoutSession, TrainingPlan } from "$lib/types";

  const ATHLETE_ID = "default-athlete-123";

  let activePlans = $state<TrainingPlan[]>([]);
  let upcomingWorkouts = $state<WorkoutSession[]>([]);
  let isLoading = $state(true);
  let selectedCalendar = $state<string | null>(null);
  let showExportSuccess = $state(false);

  onMount(async () => {
    await loadActivePlans();
    await loadUpcomingWorkouts();
    isLoading = false;
  });

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

  async function loadUpcomingWorkouts() {
    try {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      const startDate = formatDateForAPI(today);
      const endDate = formatDateForAPI(nextMonth);

      const allSessions: WorkoutSession[] = [];

      for (const plan of activePlans) {
        const response = await fetch(
          `http://localhost:3000/api/v1/workout-sessions?athlete_id=${ATHLETE_ID}&training_plan_id=${plan.id}&start_date=${startDate}&end_date=${endDate}`
        );

        if (response.ok) {
          const sessions = await response.json();
          allSessions.push(...sessions);
        }
      }

      upcomingWorkouts = allSessions
        .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date))
        .slice(0, 10);
    } catch (error) {
      console.error("Error loading upcoming workouts:", error);
    }
  }

  function formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDisplayDate(dateString: string): string {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function generateICalendar(): string {
    const events = upcomingWorkouts.map((workout) => {
      const [year, month, day] = workout.scheduled_date.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      // Format date as YYYYMMDD for iCal
      const dateStr = workout.scheduled_date.replace(/-/g, "");

      // Create event with 1 hour duration
      const startTime = `${dateStr}T090000`;
      const endTime = `${dateStr}T100000`;

      const title = workout.workout_title || workout.workout_summary || "Volleyball Training";
      const description = workout.exercises
        ? workout.exercises.map(e => `${e.name}${e.sets ? ` - ${e.sets} sets` : ""}${e.reps ? ` x ${e.reps}` : ""}`).join("\\n")
        : "Scheduled training session";

      return `BEGIN:VEVENT
UID:${workout.id}@training-planner
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startTime}
DTEND:${endTime}
SUMMARY:${title}
DESCRIPTION:${description.replace(/\n/g, "\\n")}
STATUS:CONFIRMED
END:VEVENT`;
    }).join("\n");

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Athlete Training Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Volleyball Training
X-WR-TIMEZONE:America/New_York
${events}
END:VCALENDAR`;
  }

  function downloadICalendar() {
    const icsContent = generateICalendar();
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "volleyball-training.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showExportSuccess = true;
    setTimeout(() => {
      showExportSuccess = false;
    }, 3000);
  }

  function openGoogleCalendar() {
    // Generate Google Calendar URL with the first upcoming workout
    if (upcomingWorkouts.length > 0) {
      const workout = upcomingWorkouts[0];
      const [year, month, day] = workout.scheduled_date.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      const title = encodeURIComponent(workout.workout_title || workout.workout_summary || "Volleyball Training");
      const details = encodeURIComponent(
        workout.exercises
          ? workout.exercises.map(e => `${e.name}${e.sets ? ` - ${e.sets} sets` : ""}${e.reps ? ` x ${e.reps}` : ""}`).join("\n")
          : "Scheduled training session"
      );

      const dateStr = workout.scheduled_date.replace(/-/g, "");

      window.open(
        `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${dateStr}T090000/${dateStr}T100000`,
        "_blank"
      );
    }
  }

  function openOutlookCalendar() {
    downloadICalendar();
  }

  function openAppleCalendar() {
    downloadICalendar();
  }
</script>

<div class="container">
  <header>
    <h1>Smart Calendar Sync</h1>
    <p class="subtitle">Connect your training plan to your favorite calendar</p>
  </header>

  {#if showExportSuccess}
    <div class="success-banner">
      Calendar file downloaded! Import it into your calendar app to sync your workouts.
    </div>
  {/if}

  {#if isLoading}
    <div class="loading">Loading your training schedule...</div>
  {:else if activePlans.length === 0}
    <div class="empty-state">
      <div class="empty-icon">📅</div>
      <h2>No Active Training Plan</h2>
      <p>Create and activate a training plan to start syncing with your calendar.</p>
      <a href="/plans" class="btn-primary">Go to My Plans</a>
    </div>
  {:else}
    <div class="content">
      <section class="calendar-options">
        <h2>Choose Your Calendar</h2>
        <p class="section-description">
          Select your preferred calendar service to sync your volleyball training workouts
        </p>

        <div class="calendar-grid">
          <button
            class="calendar-card google"
            onclick={openGoogleCalendar}
          >
            <div class="calendar-icon">
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <h3>Google Calendar</h3>
            <p>Add workouts directly to your Google Calendar</p>
            <span class="cta">Connect →</span>
          </button>

          <button
            class="calendar-card outlook"
            onclick={openOutlookCalendar}
          >
            <div class="calendar-icon">
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="#0078D4" d="M24 7.875v8.25A3.375 3.375 0 0 1 20.625 19.5h-12A3.375 3.375 0 0 1 5.25 16.125V7.875A3.375 3.375 0 0 1 8.625 4.5h12A3.375 3.375 0 0 1 24 7.875z"/>
                <path fill="#FFF" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                <path fill="#0078D4" d="M0 7.5v9A1.5 1.5 0 0 0 1.5 18h5.25v-12H1.5A1.5 1.5 0 0 0 0 7.5z"/>
              </svg>
            </div>
            <h3>Outlook Calendar</h3>
            <p>Download calendar file for Outlook</p>
            <span class="cta">Download →</span>
          </button>

          <button
            class="calendar-card apple"
            onclick={openAppleCalendar}
          >
            <div class="calendar-icon">
              <svg viewBox="0 0 24 24" width="64" height="64">
                <path fill="#000000" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
            </div>
            <h3>Apple Calendar</h3>
            <p>Download calendar file for Apple devices</p>
            <span class="cta">Download →</span>
          </button>

          <button
            class="calendar-card ics"
            onclick={downloadICalendar}
          >
            <div class="calendar-icon">📥</div>
            <h3>Other Calendar Apps</h3>
            <p>Download .ics file for any calendar app</p>
            <span class="cta">Download .ics →</span>
          </button>
        </div>
      </section>

      <section class="upcoming-workouts">
        <h2>Upcoming Workouts ({upcomingWorkouts.length})</h2>
        <p class="section-description">
          These workouts will be added to your calendar
        </p>

        {#if upcomingWorkouts.length === 0}
          <div class="no-workouts">
            <p>No upcoming workouts scheduled. Your active plan may not have workouts in the next 30 days.</p>
            <a href="/calendar" class="btn-secondary">View Full Calendar</a>
          </div>
        {:else}
          <div class="workouts-list">
            {#each upcomingWorkouts as workout (workout.id)}
              <div class="workout-item">
                <div class="workout-date">
                  <div class="date-month">
                    {new Date(workout.scheduled_date.split("-").map(Number)[0], workout.scheduled_date.split("-").map(Number)[1] - 1, workout.scheduled_date.split("-").map(Number)[2]).toLocaleDateString("en-US", { month: "short" })}
                  </div>
                  <div class="date-day">
                    {workout.scheduled_date.split("-")[2]}
                  </div>
                </div>
                <div class="workout-details">
                  <h3>{workout.workout_title || workout.workout_summary || "Training Session"}</h3>
                  <p class="workout-date-full">{formatDisplayDate(workout.scheduled_date)}</p>
                  {#if workout.exercises && workout.exercises.length > 0}
                    <p class="workout-exercises">
                      {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""}:
                      {workout.exercises.slice(0, 3).map(e => e.name).join(", ")}
                      {#if workout.exercises.length > 3}
                        <span class="more">+{workout.exercises.length - 3} more</span>
                      {/if}
                    </p>
                  {/if}
                </div>
                <div class="workout-status">
                  <span class="status-badge {workout.status}">
                    {workout.status === "completed" ? "✓ Completed" : workout.status === "scheduled" ? "Scheduled" : workout.status}
                  </span>
                </div>
                <a href="/calendar?session={workout.id}" class="workout-info-icon" title="View workout details">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </a>
              </div>
            {/each}
          </div>
        {/if}
      </section>

      <section class="sync-info">
        <h2>How Calendar Sync Works</h2>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">🔄</div>
            <h3>One-Time Export</h3>
            <p>Download your workout schedule as a calendar file (.ics) that you can import into any calendar application.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">⏰</div>
            <h3>Default Timing</h3>
            <p>Workouts are scheduled for 9:00 AM with 1-hour duration. You can adjust the time in your calendar app after importing.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">🔔</div>
            <h3>Set Reminders</h3>
            <p>After importing, configure reminders in your calendar app to get notified before each workout session.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">📱</div>
            <h3>Multi-Device Sync</h3>
            <p>Once imported to Google, Outlook, or Apple Calendar, your workouts will sync across all your devices.</p>
          </div>
        </div>
      </section>
    </div>
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

  .success-banner {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    font-weight: 500;
    text-align: center;
  }

  .loading,
  .empty-state {
    text-align: center;
    color: #666;
    padding: 3rem;
    background: white;
    border-radius: 16px;
  }

  .empty-state {
    padding: 4rem 2rem;
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

  .content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  section {
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h2 {
    color: #667eea;
    font-size: 1.8rem;
    margin: 0 0 0.5rem 0;
  }

  .section-description {
    color: #666;
    margin: 0 0 2rem 0;
    font-size: 1rem;
  }

  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .calendar-card {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .calendar-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  .calendar-card.google:hover {
    border-color: #4285F4;
  }

  .calendar-card.outlook:hover {
    border-color: #0078D4;
  }

  .calendar-card.apple:hover {
    border-color: #000;
  }

  .calendar-card.ics:hover {
    border-color: #667eea;
  }

  .calendar-icon {
    margin-bottom: 1rem;
    font-size: 3rem;
  }

  .calendar-card h3 {
    color: #333;
    font-size: 1.3rem;
    margin: 0 0 0.5rem 0;
  }

  .calendar-card p {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
    line-height: 1.4;
  }

  .cta {
    color: #667eea;
    font-weight: 700;
    font-size: 1rem;
  }

  .workouts-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .workout-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 12px;
    border-left: 4px solid #667eea;
    position: relative;
  }

  .workout-date {
    text-align: center;
    min-width: 60px;
  }

  .date-month {
    color: #667eea;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .date-day {
    color: #333;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  .workout-details {
    flex: 1;
  }

  .workout-details h3 {
    color: #333;
    font-size: 1.1rem;
    margin: 0 0 0.25rem 0;
  }

  .workout-date-full {
    color: #666;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }

  .workout-exercises {
    color: #666;
    font-size: 0.85rem;
    margin: 0;
  }

  .more {
    color: #667eea;
    font-weight: 600;
  }

  .workout-status {
    min-width: 120px;
    text-align: right;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    display: inline-block;
  }

  .status-badge.scheduled {
    background: #e0e7ff;
    color: #667eea;
  }

  .status-badge.completed {
    background: #d1fae5;
    color: #10b981;
  }

  .workout-info-icon {
    position: absolute;
    bottom: 0.75rem;
    right: 0.75rem;
    color: #9ca3af;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
  }

  .workout-info-icon:hover {
    color: #667eea;
    transform: scale(1.1);
  }

  .no-workouts {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .no-workouts p {
    margin: 0 0 1.5rem 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .info-card {
    text-align: center;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 12px;
  }

  .info-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .info-card h3 {
    color: #333;
    font-size: 1.1rem;
    margin: 0 0 0.5rem 0;
  }

  .info-card p {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
  }

  .btn-primary,
  .btn-secondary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
  }

  .btn-secondary:hover {
    background: #667eea;
    color: white;
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

    .workout-item {
      flex-direction: column;
      text-align: center;
    }

    .workout-status {
      text-align: center;
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
