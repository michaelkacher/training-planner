import type { WorkoutSession } from '../types/index.js';

// Simple workout schedule generator based on training plan
// Creates a weekly pattern of workouts for the duration of the plan
export function generateWorkoutSessions(
  trainingPlanId: string,
  athleteId: string,
  startDate: Date,
  endDate: Date
): Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>[] {
  const sessions: Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>[] = [];

  // Standard training week pattern (3-4 workout days per week)
  const weeklySchedule = [
    { dayOfWeek: 1, summary: 'Strength Training - Lower Body Focus' }, // Monday
    { dayOfWeek: 2, summary: 'Plyometric Training - Vertical Power' }, // Tuesday
    { dayOfWeek: 3, summary: 'Technique & Skills - Court Practice' }, // Wednesday
    { dayOfWeek: 5, summary: 'Strength Training - Upper Body & Core' }, // Friday
  ];

  const currentDate = new Date(startDate);
  const planEndDate = new Date(endDate);

  // Generate sessions for each week
  while (currentDate <= planEndDate) {
    const dayOfWeek = currentDate.getDay();

    // Find if this day has a scheduled workout
    const workout = weeklySchedule.find(w => w.dayOfWeek === dayOfWeek);

    if (workout) {
      sessions.push({
        athlete_id: athleteId,
        training_plan_id: trainingPlanId,
        workout_id: undefined,
        scheduled_date: currentDate.toISOString().split('T')[0],
        status: 'scheduled',
        notes: undefined,
        workout_summary: workout.summary
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessions;
}

// Alternative: Generate from template data if available
export function generateFromTemplateData(
  trainingPlanId: string,
  athleteId: string,
  startDate: Date,
  templateData: any // Would be the actual template structure
): Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>[] {
  const sessions: Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>[] = [];

  if (!templateData || !templateData.phases) {
    return sessions;
  }

  let currentDate = new Date(startDate);
  let sessionIndex = 0;

  // Iterate through phases
  for (const phase of templateData.phases) {
    // Get number of weeks from phase (e.g., "Weeks 1 & 2" -> 2 weeks)
    const weeksMatch = phase.weeks.match(/(\d+)/g);
    const numWeeks = weeksMatch ? parseInt(weeksMatch[weeksMatch.length - 1]) : 2;

    // For each week in the phase
    for (let week = 0; week < numWeeks; week++) {
      // For each workout day in the phase
      for (const workoutDay of phase.workoutDays) {
        // Calculate which day of the week to schedule this
        // Distribute workouts across the week
        const dayOffset = (workoutDay.day - 1) * 2; // Spread workouts through the week
        const workoutDate = new Date(currentDate);
        workoutDate.setDate(workoutDate.getDate() + dayOffset);

        // Create workout summary from exercises
        const exerciseSummary = workoutDay.exercises
          .slice(1, 4) // Skip warm-up, take first 3 main exercises
          .map(ex => ex.name)
          .join(', ');

        sessions.push({
          athlete_id: athleteId,
          training_plan_id: trainingPlanId,
          workout_id: undefined,
          scheduled_date: workoutDate.toISOString().split('T')[0],
          status: 'scheduled',
          notes: undefined,
          workout_summary: `${workoutDay.title} - ${exerciseSummary}`
        });

        sessionIndex++;
      }

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  return sessions;
}
