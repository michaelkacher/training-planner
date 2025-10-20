export interface Exercise {
  name: string;
  sets?: string;
  reps?: string;
  duration?: string;
  notes?: string;
  difficulty: 'easy' | 'medium' | 'challenging';
}

export interface Skill {
  id: string;
  title: string;
  description: string;
  icon: string;
  exercises: Exercise[];
}

export const VOLLEYBALL_SKILLS: Skill[] = [
  {
    id: 'vertical-jump',
    title: 'Vertical Jump',
    description: 'Increase your vertical leap for blocking and attacking',
    icon: '⬆️',
    exercises: [
      // Easy exercises
      {
        name: 'Wall Touches',
        sets: '3',
        reps: '10',
        notes: 'Jump and touch as high as possible on a wall',
        difficulty: 'easy'
      },
      {
        name: 'Jump Squats',
        sets: '3',
        reps: '8',
        notes: 'Squat down and explode upward',
        difficulty: 'easy'
      },
      {
        name: 'Calf Raises',
        sets: '3',
        reps: '15',
        notes: 'Stand on toes, hold, and lower',
        difficulty: 'easy'
      },
      // Medium exercises
      {
        name: 'Box Jumps',
        sets: '4',
        reps: '8',
        notes: 'Jump onto a sturdy box or platform (12-18 inches)',
        difficulty: 'medium'
      },
      {
        name: 'Bulgarian Split Squats',
        sets: '3',
        reps: '10 each leg',
        notes: 'Rear foot elevated split squat',
        difficulty: 'medium'
      },
      {
        name: 'Depth Jumps',
        sets: '3',
        reps: '6',
        notes: 'Step off box and immediately jump as high as possible',
        difficulty: 'medium'
      },
      // Challenging exercises
      {
        name: 'Weighted Box Jumps',
        sets: '4',
        reps: '6',
        notes: 'Box jumps while holding dumbbells (start light)',
        difficulty: 'challenging'
      },
      {
        name: 'Single-Leg Box Jumps',
        sets: '3',
        reps: '5 each leg',
        notes: 'Explosive single-leg power development',
        difficulty: 'challenging'
      },
      {
        name: 'Plyometric Lunges',
        sets: '4',
        reps: '12',
        notes: 'Jump and switch legs mid-air',
        difficulty: 'challenging'
      }
    ]
  },
  {
    id: 'serving-power',
    title: 'Serving Power',
    description: 'Build shoulder strength and explosiveness for powerful serves',
    icon: '🎯',
    exercises: [
      // Easy
      {
        name: 'Resistance Band Shoulder Press',
        sets: '3',
        reps: '12',
        notes: 'Build shoulder stability and strength',
        difficulty: 'easy'
      },
      {
        name: 'Medicine Ball Slams',
        sets: '3',
        reps: '10',
        notes: 'Overhead slam motion (use 6-8 lb ball)',
        difficulty: 'easy'
      },
      {
        name: 'Arm Circles',
        sets: '2',
        duration: '1 minute each direction',
        notes: 'Warm up and strengthen shoulders',
        difficulty: 'easy'
      },
      // Medium
      {
        name: 'Dumbbell Shoulder Press',
        sets: '4',
        reps: '10',
        notes: 'Seated or standing press',
        difficulty: 'medium'
      },
      {
        name: 'Rotational Medicine Ball Throws',
        sets: '3',
        reps: '8 each side',
        notes: 'Explosive rotational power against wall',
        difficulty: 'medium'
      },
      {
        name: 'Pike Push-ups',
        sets: '3',
        reps: '10',
        notes: 'Target shoulders with bodyweight',
        difficulty: 'medium'
      },
      // Challenging
      {
        name: 'Overhead Medicine Ball Throws',
        sets: '4',
        reps: '8',
        notes: 'Explosive overhead throw for maximum distance',
        difficulty: 'challenging'
      },
      {
        name: 'Barbell Push Press',
        sets: '4',
        reps: '6',
        notes: 'Use legs to drive weight overhead',
        difficulty: 'challenging'
      },
      {
        name: 'Plyometric Push-ups',
        sets: '3',
        reps: '8',
        notes: 'Explosive push-ups with hand clap',
        difficulty: 'challenging'
      }
    ]
  },
  {
    id: 'agility',
    title: 'Court Agility',
    description: 'Improve quick movements and change of direction',
    icon: '⚡',
    exercises: [
      // Easy
      {
        name: 'Ladder Drills - Basic',
        sets: '3',
        duration: '30 seconds',
        notes: 'One foot in each square, focus on speed',
        difficulty: 'easy'
      },
      {
        name: 'Cone Shuffle',
        sets: '3',
        reps: '5 each direction',
        notes: 'Defensive shuffle between cones 10ft apart',
        difficulty: 'easy'
      },
      {
        name: 'High Knees',
        sets: '3',
        duration: '30 seconds',
        notes: 'Drive knees up quickly in place',
        difficulty: 'easy'
      },
      // Medium
      {
        name: 'T-Drill',
        sets: '4',
        reps: '3',
        notes: 'Sprint forward, shuffle left/right, backpedal',
        difficulty: 'medium'
      },
      {
        name: 'Lateral Bounds',
        sets: '3',
        reps: '10 each direction',
        notes: 'Explosive side-to-side jumps',
        difficulty: 'medium'
      },
      {
        name: '5-10-5 Shuttle',
        sets: '4',
        reps: '3',
        notes: 'Sprint 5 yards, touch, 10 yards back, 5 yards return',
        difficulty: 'medium'
      },
      // Challenging
      {
        name: 'Box Drill (Pro Agility)',
        sets: '4',
        reps: '4',
        notes: 'Four-corner sprint with direction changes',
        difficulty: 'challenging'
      },
      {
        name: 'Reactive Cone Drills',
        sets: '4',
        reps: '5',
        notes: 'Partner calls out cone colors to sprint to',
        difficulty: 'challenging'
      },
      {
        name: 'Ladder Drills - Advanced',
        sets: '4',
        duration: '45 seconds',
        notes: 'Icky shuffle, crossovers, in-and-outs',
        difficulty: 'challenging'
      }
    ]
  },
  {
    id: 'core-strength',
    title: 'Core Strength',
    description: 'Build a strong core for stability and power transfer',
    icon: '💪',
    exercises: [
      // Easy
      {
        name: 'Plank',
        sets: '3',
        duration: '30 seconds',
        notes: 'Hold strong plank position',
        difficulty: 'easy'
      },
      {
        name: 'Dead Bug',
        sets: '3',
        reps: '10 each side',
        notes: 'Controlled arm and leg movements',
        difficulty: 'easy'
      },
      {
        name: 'Bird Dog',
        sets: '3',
        reps: '10 each side',
        notes: 'Opposite arm and leg extension',
        difficulty: 'easy'
      },
      // Medium
      {
        name: 'Russian Twists',
        sets: '3',
        reps: '20',
        notes: 'Rotational core work with medicine ball',
        difficulty: 'medium'
      },
      {
        name: 'Mountain Climbers',
        sets: '4',
        duration: '30 seconds',
        notes: 'Fast knee drives to chest',
        difficulty: 'medium'
      },
      {
        name: 'Side Plank with Hip Dips',
        sets: '3',
        reps: '10 each side',
        notes: 'Lower hip to ground and raise back up',
        difficulty: 'medium'
      },
      // Challenging
      {
        name: 'Ab Wheel Rollouts',
        sets: '4',
        reps: '10',
        notes: 'Controlled rollout and return',
        difficulty: 'challenging'
      },
      {
        name: 'Hanging Leg Raises',
        sets: '3',
        reps: '12',
        notes: 'Raise legs to 90 degrees from hanging position',
        difficulty: 'challenging'
      },
      {
        name: 'Turkish Get-ups',
        sets: '3',
        reps: '5 each side',
        notes: 'Full body stability exercise with kettlebell',
        difficulty: 'challenging'
      }
    ]
  },
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Sharpen reflexes for quick defensive plays',
    icon: '⚡',
    exercises: [
      // Easy
      {
        name: 'Ball Drop Catches',
        sets: '3',
        reps: '10',
        notes: 'Partner drops ball, catch before second bounce',
        difficulty: 'easy'
      },
      {
        name: 'Mirror Drill',
        sets: '3',
        duration: '30 seconds',
        notes: 'Mirror partner\'s movements as quickly as possible',
        difficulty: 'easy'
      },
      {
        name: 'Clap Push-ups',
        sets: '3',
        reps: '6',
        notes: 'Push up explosively and clap',
        difficulty: 'easy'
      },
      // Medium
      {
        name: 'Tennis Ball Tosses',
        sets: '4',
        reps: '15',
        notes: 'Throw ball against wall and catch with alternating hands',
        difficulty: 'medium'
      },
      {
        name: 'Reactive Step Drill',
        sets: '4',
        reps: '10',
        notes: 'Partner points direction, react and step quickly',
        difficulty: 'medium'
      },
      {
        name: 'Partner Reaction Taps',
        sets: '3',
        duration: '45 seconds',
        notes: 'Partner randomly taps shoulders, react and touch their hand',
        difficulty: 'medium'
      },
      // Challenging
      {
        name: 'Multi-Ball Reaction',
        sets: '4',
        reps: '12',
        notes: 'Two partners toss balls at random, react to both',
        difficulty: 'challenging'
      },
      {
        name: 'Whistle Sprint Drill',
        sets: '5',
        reps: '8',
        notes: 'Sprint on whistle, freeze, change direction on next whistle',
        difficulty: 'challenging'
      },
      {
        name: 'Light Reaction Training',
        sets: '4',
        duration: '60 seconds',
        notes: 'React to light cues by touching specific targets',
        difficulty: 'challenging'
      }
    ]
  },
  {
    id: 'endurance',
    title: 'Endurance',
    description: 'Build stamina to maintain performance through long matches',
    icon: '🏃',
    exercises: [
      // Easy
      {
        name: 'Jogging',
        sets: '1',
        duration: '15 minutes',
        notes: 'Steady pace, maintain conversation',
        difficulty: 'easy'
      },
      {
        name: 'Jump Rope',
        sets: '3',
        duration: '2 minutes',
        notes: 'Steady rhythm, rest 1 minute between sets',
        difficulty: 'easy'
      },
      {
        name: 'Burpees',
        sets: '3',
        reps: '10',
        notes: 'Full body conditioning',
        difficulty: 'easy'
      },
      // Medium
      {
        name: 'Interval Running',
        sets: '6',
        duration: '1 minute fast, 2 minutes slow',
        notes: 'Alternate between sprint and jog',
        difficulty: 'medium'
      },
      {
        name: 'Court Sprints',
        sets: '8',
        reps: '5',
        notes: 'Sprint baseline to baseline, rest 30 seconds',
        difficulty: 'medium'
      },
      {
        name: 'Stationary Bike',
        sets: '1',
        duration: '20 minutes',
        notes: 'Moderate to high intensity',
        difficulty: 'medium'
      },
      // Challenging
      {
        name: 'Suicide Sprints',
        sets: '5',
        reps: '3',
        notes: 'Touch lines at 10ft, 20ft, 30ft, baseline',
        difficulty: 'challenging'
      },
      {
        name: 'Tabata Intervals',
        sets: '8',
        duration: '20 seconds work, 10 seconds rest',
        notes: 'Maximum effort burpees or mountain climbers',
        difficulty: 'challenging'
      },
      {
        name: 'Long Distance Run',
        sets: '1',
        duration: '30-40 minutes',
        notes: 'Build aerobic base with steady run',
        difficulty: 'challenging'
      }
    ]
  }
];
