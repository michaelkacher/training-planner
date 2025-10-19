import type { WorkoutSession, Phase, WorkoutDay } from '../types/index.js';

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

  // Calculate total days in plan
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const finalDate = new Date(endDate);
  finalDate.setHours(23, 59, 59, 999);

  const totalDays = Math.ceil((finalDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Calculate how many days between workouts
  const daysPerWorkout = Math.max(1, Math.floor(totalDays / allWorkoutDays.length));

  // Generate sessions by distributing workout days across the date range
  let workoutIndex = 0;

  while (currentDate <= finalDate && workoutIndex < allWorkoutDays.length) {
    const workoutDay = allWorkoutDays[workoutIndex];

    // Create session with full exercise details
    sessions.push({
      athlete_id: athleteId,
      training_plan_id: trainingPlanId,
      workout_id: undefined,
      scheduled_date: currentDate.toISOString().split('T')[0],
      status: 'scheduled',
      notes: undefined,
      workout_summary: workoutDay.title,
      workout_title: workoutDay.title,
      exercises: workoutDay.exercises
    });

    // Move to next workout
    workoutIndex++;

    // Advance date by calculated interval
    currentDate.setDate(currentDate.getDate() + daysPerWorkout);
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
        scheduled_date: currentDate.toISOString().split('T')[0],
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
