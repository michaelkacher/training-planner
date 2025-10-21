# Athlete Training Planner Application: Requirements and Feature Outline

## 1. Project Goal

To provide **Volleyball Athletes** with an intuitive platform to create personalized training plans, manage them via an interactive calendar, receive timely reminders, and accurately track completion and performance data, focused on skill development, strength, and conditioning specific to the sport. The core principle is simplicity and focus on the athlete's daily execution.

## 2. Target Audience

- **Primary Audience:** Amateur to intermediate Volleyball Athletes (e.g., club, high school, or competitive recreational players).
- **Key Need:** Structure, accountability, visualization of training loads, and specific tracking for position-relevant metrics (e.g., jump height, lateral quickness).

## 3. Core Feature Requirements

The application must support the following three major workflows: **Plan Creation, Scheduling & Alerts, and Tracking & Review.**

### A. Plan Creation & Management

| Feature                      | Description                                                                                                                                            | Priority |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **Athlete Profile & Goals**  | User defines position (e.g., Setter, Hitter), target events (Tournaments), and high-level goals (e.g., "Increase Vertical Jump," "Improve Endurance"). | High     |
| **Custom Workout Builder**   | Users must be able to define structured workouts, including volleyball-specific types:                                                                 | High     |
|                              | \- **Types:** **Court Practice/Skills, Plyometrics, Agility, Strength, Conditioning (Cardio), Rest, Other.**                                           |          |
|                              | \- **Details:** Duration, Sets/Reps, Intensity Zone (e.g., RPE 7, specific jump count).                                                                |          |
| **Training Phase Templates** | Pre-loaded, editable templates for different training phases (e.g., Off-Season, Pre-Season, Competition Phase) that can be dragged into the calendar.  | Medium   |
| **"Build My Plan" Wizard**   | A guided sequence of questions to generate a basic 4/8/12-week plan based on the user's defined goal event (tournament date).                          | Medium   |

### B. Scheduling, Calendar, & Alerts

| Feature                         | Description                                                                                                                                    | Priority |
| :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------- |
| **Interactive Calendar View**   | Primary interface showing scheduled workouts. Must support Monthly, Weekly, and Daily views.                                                   | High     |
| **Drag-and-Drop Rescheduling**  | Users must be able to move an entire scheduled workout or rest day to a new date/time easily.                                                  | High     |
| **Recurring Workouts**          | Ability to set a workout (e.g., "Club Practice") to repeat every Tuesday and Thursday at 7:00 PM.                                              | High     |
| **Notification System**         | In-app notification bell and optional email alerts. Notifications should be sent 1 hour before a scheduled workout.                            | High     |
| **Schedule Load Visualization** | A simple color-coded bar (or similar) on the calendar showing the relative difficulty or total training volume scheduled for the current week. | Medium   |

### C. Tracking, Completion, & Review

| Feature                      | Description                                                                                                                                                                                                                                                                                                                                 | Priority |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------- |
| **Mark as Complete**         | Simple toggle to mark a workout as done.                                                                                                                                                                                                                                                                                                    | High     |
| **Post-Workout Logging**     | Users must be able to log actual data after completion: - **Actual Duration/Volume:** (e.g., Planned 60 min, Actual 58 min, Planned 5 sets, Actual 4 sets). - **Notes/Comments:** Field to record how the session felt (e.g., "Sore knees, need active recovery"). - **RPE (Rate of Perceived Exertion):** 1-10 scale slider to log effort. | High     |
| **Weekly Compliance Report** | Dashboard metric showing the percentage of planned workouts completed vs. missed/skipped.                                                                                                                                                                                                                                                   | High     |
| **Progress Graphs**          | Simple line or bar charts to visualize trends over time (e.g., Total Weekly Training Volume, RPE average).                                                                                                                                                                                                                                  | Medium   |

# Architecture and Design

This application will be deployed to Vercel. The frontend will use Sveltekit and the backend will use Node.js + Express/Fastify with Typescript.

The database will leverage PostreSQL via Supabase.

The local development will leverage a single command to get up and running locally `npm run dev` which will start both the front and backend. It is important that the local development has hot reloading and is easy to setup.

## Aesthetics/Tone

The design should be energetic and visual (like a fitness brand).

## Alert Methods

Besides in-app notifications, users should be able to configure **Email** and/or **SMS** notifications leveraging Twilio. For local development, this has an optional environmental setting to just log that the service was invoked. This allows local development without having a Twilio secret set up.

**Calendar Functionality:** The scheduled workouts should be able to leverage the iCal format and integrate directly with Google Calendar and Apple Calendar.
