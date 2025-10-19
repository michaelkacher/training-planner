// Pre-configured training plan templates

export interface WorkoutDay {
  day: number;
  title: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  focus: string;
  notes?: string;
}

export interface TrainingTemplate {
  id: string;
  title: string;
  duration: string;
  level: string;
  goals: string[];
  description: string;
  phases: Phase[];
}

export interface Phase {
  name: string;
  weeks: string;
  description: string;
  workoutDays: WorkoutDay[];
}

export const TRAINING_TEMPLATES: TrainingTemplate[] = [
  {
    id: '4-week-volleyball-performance',
    title: '4-Week Volleyball Performance Program',
    duration: '4 weeks',
    level: 'Intermediate',
    goals: ['Increase Hit Strength', 'Improve Hit Form', 'Increase Jump Height'],
    description: 'This program creates a solid base for hit strength, improves hit form consistency, and dramatically increases vertical explosiveness.',
    phases: [
      {
        name: 'Phase 1: Strength and Foundational Form',
        weeks: 'Weeks 1 & 2',
        description: 'Focus on building maximum strength to generate hitting power and solidifying muscle memory for form.',
        workoutDays: [
          {
            day: 1,
            title: 'Max Strength & Power (Lower Body Focus)',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic stretching, light cardio, band work' },
              { name: 'Squat Variation (Back/Front)', sets: 3, reps: '5', focus: 'Max Power', notes: 'Heavy weight, controlled descent, explosive ascent' },
              { name: 'RDL (Romanian Deadlift)', sets: 3, reps: '8', focus: 'Posterior Chain', notes: 'Focus on hamstring stretch and glute engagement' },
              { name: 'Walking Lunges (Weighted)', sets: 3, reps: '10/leg', focus: 'Unilateral Strength', notes: 'Improves stability and hitting rotation' },
              { name: 'Calf Raises (Weighted)', sets: 3, reps: '15', focus: 'Explosiveness', notes: 'Pause briefly at the top' },
              { name: 'Abdominal Circuit', sets: 3, reps: '45 sec', focus: 'Core Stability', notes: 'Planks, Russian Twists - essential for hit torque' }
            ]
          },
          {
            day: 2,
            title: 'Vertical Explosiveness (Low Volume Plyometrics)',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic stretching, light cardio, band work' },
              { name: 'Box Jumps (High)', sets: 4, reps: '5', focus: 'Vertical Power', notes: 'Step down after landing; do not jump down' },
              { name: 'Squat Jumps', sets: 3, reps: '8', focus: 'Quick Response', notes: 'Explode straight up, minimize ground contact time' },
              { name: 'Lateral Bounds', sets: 3, reps: '5/leg', focus: 'Agility/Lateral Power', notes: 'Focus on sticking the landing' },
              { name: 'Depth Jumps', sets: 3, reps: '4', focus: 'Reaction', notes: 'Step off box, instantly jump vertically upon ground contact' }
            ]
          },
          {
            day: 3,
            title: 'Hitting Form & Consistency (Court Day)',
            exercises: [
              { name: 'Approach Footwork', sets: 5, reps: '10', focus: 'Tempo/Timing', notes: 'Practice full approach without hitting' },
              { name: 'Self-Feed Hitting', sets: 3, reps: '20', focus: 'Arm Swing', notes: 'Focus on high elbow, full shoulder rotation, and snap' },
              { name: 'Block & Transition', sets: 5, reps: '5', focus: 'Form Flow', notes: 'Practice blocking, landing, transitioning to hit' },
              { name: 'Target Hitting', sets: 3, reps: '10', focus: 'Placement', notes: 'Use targets to practice angled hits' }
            ]
          }
        ]
      },
      {
        name: 'Phase 2: Power and Integration',
        weeks: 'Weeks 3 & 4',
        description: 'Translate raw strength into explosive power and integrate refined form under fatigue.',
        workoutDays: [
          {
            day: 4,
            title: 'Power & Upper Body Focus',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic stretching, light cardio, band work' },
              { name: 'Hang Clean or Power Snatch', sets: 4, reps: '3', focus: 'Full-body Explosiveness', notes: 'Focus on perfect form and speed' },
              { name: 'Dumbbell Bench Press (Incline)', sets: 3, reps: '6', focus: 'Upper Chest/Shoulder', notes: 'Key for pushing power in hitting motion' },
              { name: 'Pull-ups/Lat Pulldowns', sets: 3, reps: '8', focus: 'Back Strength', notes: 'Helps generate snap and control in arm swing' },
              { name: 'Medicine Ball Slams', sets: 3, reps: '10', focus: 'Core & Hitting Speed', notes: 'Explode ball down as hard as possible' },
              { name: 'Split Squats (Bulgarian)', sets: 3, reps: '8/leg', focus: 'Stability', notes: 'Increases hitting and jumping control' }
            ]
          },
          {
            day: 5,
            title: 'Max Vertical Jump Training (High Intensity Plyometrics)',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic stretching, light cardio, band work' },
              { name: 'Broad Jumps', sets: 4, reps: '5', focus: 'Horizontal Power', notes: 'Focus on reaching max distance, using arm swing' },
              { name: 'Continuous Cone Hops', sets: 3, reps: '20 sec', focus: 'Agility/Foot Speed', notes: 'Light and fast, quick ground contact' },
              { name: 'Single-Leg Hops (Forward)', sets: 3, reps: '8/leg', focus: 'Jump Stability', notes: 'Essential for single-leg take-off' },
              { name: 'Approach Jumps', sets: 4, reps: '6', focus: 'Volleyball Specific', notes: 'Use full approach, jump as high as possible' }
            ]
          },
          {
            day: 6,
            title: 'Hitting Volume & Fatigue Resistance (Court Day)',
            exercises: [
              { name: 'Conditioning', reps: '10 mins', focus: 'Light cardio, dynamic stretching' },
              { name: 'Setter-Dump-Hit Drill', sets: 4, reps: '15', focus: 'Game-Speed', notes: 'Transition between defense and full-speed hit' },
              { name: 'Tipping/Off-Speed Practice', sets: 3, reps: '15', focus: 'Control/Touch', notes: 'Place tips over blockers, soft angles' },
              { name: 'High Rep Approach & Hit', sets: 5, reps: '10', focus: 'Endurance', notes: 'Maintain good form under fatigue' },
              { name: 'Serving Practice', sets: 2, reps: '20', focus: 'Power & Consistency' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'beginner-fundamentals',
    title: 'Beginner Volleyball Fundamentals',
    duration: '6 weeks',
    level: 'Beginner',
    goals: ['Build Base Fitness', 'Learn Proper Form', 'Develop Consistency'],
    description: 'Perfect for athletes new to structured volleyball training. Focuses on building a fitness foundation and learning proper technique for all fundamental skills.',
    phases: [
      {
        name: 'Foundation Building',
        weeks: 'Weeks 1-3',
        description: 'Build basic fitness and learn fundamental movements.',
        workoutDays: [
          {
            day: 1,
            title: 'Basic Strength & Conditioning',
            exercises: [
              { name: 'Bodyweight Squats', sets: 3, reps: '15', focus: 'Leg Strength', notes: 'Focus on form over speed' },
              { name: 'Push-ups', sets: 3, reps: '10-15', focus: 'Upper Body', notes: 'Modify on knees if needed' },
              { name: 'Plank Hold', sets: 3, reps: '30-45 sec', focus: 'Core Stability' },
              { name: 'Jump Rope', sets: 3, reps: '2 min', focus: 'Cardio & Footwork', notes: 'Rest 1 min between sets' }
            ]
          },
          {
            day: 2,
            title: 'Passing & Footwork (Court)',
            exercises: [
              { name: 'Platform Practice', sets: 5, reps: '20', focus: 'Passing Form', notes: 'Against wall or with partner' },
              { name: 'Shuffle Drills', sets: 4, reps: '30 sec', focus: 'Lateral Movement', notes: 'Stay low, quick feet' },
              { name: 'Serve Receive Position', sets: 3, reps: '15', focus: 'Ready Position', notes: 'Hold and practice movement' }
            ]
          },
          {
            day: 3,
            title: 'Setting & Approach Basics',
            exercises: [
              { name: 'Wall Setting', sets: 4, reps: '25', focus: 'Hand Position', notes: 'Focus on creating window with hands' },
              { name: 'Approach Steps (No Jump)', sets: 5, reps: '10', focus: 'Footwork Pattern', notes: 'Left-right-left or right-left-right' },
              { name: 'Vertical Jumps', sets: 3, reps: '8', focus: 'Jump Mechanics', notes: 'Focus on arm swing timing' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'setter-specialist',
    title: 'Setter Development Program',
    duration: '8 weeks',
    level: 'Intermediate to Advanced',
    goals: ['Improve Setting Accuracy', 'Increase Court Vision', 'Develop Quick Hands'],
    description: 'Specialized program for setters focusing on hand speed, accuracy, decision-making, and overall court leadership.',
    phases: [
      {
        name: 'Technical Precision',
        weeks: 'Weeks 1-4',
        description: 'Master fundamental setting technique and build consistency.',
        workoutDays: [
          {
            day: 1,
            title: 'Hand Speed & Accuracy',
            exercises: [
              { name: 'Wall Setting (Rapid Fire)', sets: 5, reps: '50', focus: 'Quick Hands', notes: 'Maintain perfect form while increasing speed' },
              { name: 'Target Setting', sets: 4, reps: '20', focus: 'Accuracy', notes: 'Set to specific targets at different positions' },
              { name: 'Back Sets', sets: 3, reps: '15', focus: 'Technique', notes: 'Focus on arch and follow-through' },
              { name: 'Jump Setting', sets: 3, reps: '12', focus: 'In-Air Control', notes: 'Practice setting while airborne' }
            ]
          },
          {
            day: 2,
            title: 'Strength & Conditioning',
            exercises: [
              { name: 'Finger/Wrist Strengthening', sets: 3, reps: '15', focus: 'Hand Strength', notes: 'Use resistance bands or grip trainers' },
              { name: 'Core Rotations', sets: 3, reps: '20', focus: 'Torso Stability', notes: 'Essential for body control while setting' },
              { name: 'Box Jumps', sets: 4, reps: '8', focus: 'Vertical', notes: 'Setters need vertical too!' },
              { name: 'Ladder Drills', sets: 4, reps: '30 sec', focus: 'Footwork', notes: 'Quick feet to ball' }
            ]
          }
        ]
      }
    ]
  }
];
