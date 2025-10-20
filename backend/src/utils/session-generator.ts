import type { WorkoutSession, Phase, WorkoutDay } from '../types/index.js';

function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateWorkoutSessions(
  trainingPlanId: string,
  athleteId: string,
  startDate: Date,
  endDate: Date,
  phases?: Phase[]
): Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>[] {
  const sessions: Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>[] = [];

  // If no phases provided, use default schedule
  if (!phases || phases.length === 0) {
    return generateDefaultSchedule(trainingPlanId, athleteId, startDate, endDate);
  }

  // Flatten all workout days from all phases
  const allWorkoutDays: WorkoutDay[] = [];
  phases.forEach(phase => {
    allWorkoutDays.push(...phase.workoutDays);
  });

  if (allWorkoutDays.length === 0) {
    return generateDefaultSchedule(trainingPlanId, athleteId, startDate, endDate);
  }

  // Initialize date at start of plan
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const finalDate = new Date(endDate);
  finalDate.setHours(23, 59, 59, 999);

  // Generate sessions for each week, scheduling workouts on their specified days
  while (currentDate <= finalDate) {
    // For each workout day, find the next occurrence of that day of week
    for (const workoutDay of allWorkoutDays) {
      const targetDayOfWeek = workoutDay.day; // 0 = Sunday, 1 = Monday, etc.

      // Find the next occurrence of this day of week within the current week
      const tempDate = new Date(currentDate);
      const currentDayOfWeek = tempDate.getDay();

      // Calculate days to add to reach the target day of week
      let daysToAdd = targetDayOfWeek - currentDayOfWeek;
      if (daysToAdd < 0) {
        daysToAdd += 7; // Move to next week if day has already passed this week
      }

      tempDate.setDate(tempDate.getDate() + daysToAdd);

      // Only create session if the date is within the plan's date range
      if (tempDate >= startDate && tempDate <= finalDate) {
        sessions.push({
          athlete_id: athleteId,
          training_plan_id: trainingPlanId,
          workout_id: undefined,
          scheduled_date: formatDateForAPI(tempDate),
          status: 'scheduled',
          notes: undefined,
          workout_summary: workoutDay.title,
          workout_title: workoutDay.title,
          exercises: workoutDay.exercises
        });
      }
    }

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return sessions;
}

// Fallback: Generate default schedule if no template data
function generateDefaultSchedule(
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
        scheduled_date: formatDateForAPI(currentDate),
        status: 'scheduled',
        notes: undefined,
        workout_summary: workout.summary,
        workout_title: workout.summary,
        exercises: undefined
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessions;
}
