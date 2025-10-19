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
  },
  {
    id: 'libero-reaction-agility',
    title: "Libero's Reaction & Agility Drill",
    duration: '4 weeks',
    level: 'Intermediate to Advanced',
    goals: ['Improve Foot Speed', 'Enhance Reaction Time', 'Master Low-Angle Defense'],
    description: 'Specialized defensive training for liberos focusing on first-contact excellence, lateral quickness, and consistent low-angle passing. Build the foundation for elite-level defensive range.',
    phases: [
      {
        name: 'Defensive Foundation',
        weeks: 'Weeks 1 & 2',
        description: 'Develop core agility and reaction skills essential for defensive specialists.',
        workoutDays: [
          {
            day: 1,
            title: 'Agility & Footwork Fundamentals',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic stretching, ankle mobility, light cardio' },
              { name: 'T-Drill (Cone)', sets: 5, reps: '4', focus: 'Multi-directional Speed', notes: 'Focus on quick direction changes, stay low' },
              { name: 'Pro Agility Drill (5-10-5)', sets: 4, reps: '3', focus: 'Lateral Quickness', notes: 'Touch lines with hand, explosive starts' },
              { name: 'Ladder Drills', sets: 4, reps: '30 sec', focus: 'Foot Speed', notes: 'Various patterns: in-out, lateral, crossover' },
              { name: 'Defensive Shuffle', sets: 4, reps: '45 sec', focus: 'Defensive Stance', notes: 'Stay low, quick small steps, arms ready' }
            ]
          },
          {
            day: 2,
            title: 'Reaction Training',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Dynamic stretching, quick feet drills' },
              { name: 'Partner Reaction Ball Tosses', sets: 5, reps: '15', focus: 'Visual Reaction', notes: 'Partner tosses balls at random angles, dig to target' },
              { name: 'Mirror Drill', sets: 3, reps: '60 sec', focus: 'Anticipation', notes: 'Mirror partner movements, explosive reactions' },
              { name: 'Tennis Ball Drop', sets: 4, reps: '10', focus: 'Hand-Eye Coordination', notes: 'Partner drops ball, catch before second bounce' },
              { name: 'Reactive Cone Touch', sets: 4, reps: '8', focus: 'Decision Making', notes: 'Touch called cone as quickly as possible' }
            ]
          },
          {
            day: 3,
            title: 'Low-Angle Passing',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Platform prep, shoulder mobility' },
              { name: 'Low-Angle Pass with Movement', sets: 5, reps: '20', focus: 'Passing Technique', notes: 'Move to ball, pass to target, focus on platform angle' },
              { name: 'Dive & Roll Progression', sets: 4, reps: '8', focus: 'Emergency Defense', notes: 'Start controlled, gradually increase difficulty' },
              { name: 'Sprawl Technique', sets: 3, reps: '10', focus: 'Extension', notes: 'Controlled sprawls, keep ball up' },
              { name: 'Serve Receive Under Pressure', sets: 4, reps: '15', focus: 'Game Simulation', notes: 'Various serve speeds and angles' }
            ]
          }
        ]
      },
      {
        name: 'Advanced Defensive Skills',
        weeks: 'Weeks 3 & 4',
        description: 'Integrate speed, reaction, and technique under game-like pressure and fatigue.',
        workoutDays: [
          {
            day: 4,
            title: 'Speed & Endurance Circuit',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Dynamic prep, joint mobility' },
              { name: 'Suicide Sprints (Court Lines)', sets: 5, reps: '1', focus: 'Court Speed', notes: 'Touch each line, return to base' },
              { name: 'Continuous Defensive Dig', sets: 4, reps: '90 sec', focus: 'Fatigue Resistance', notes: 'Partner rapid-fires balls, maintain quality' },
              { name: 'Lateral Cone Weave', sets: 4, reps: '6', focus: 'Agility Under Fatigue', notes: 'Weave through cones as fast as possible' },
              { name: 'Burpee to Defensive Dig', sets: 3, reps: '10', focus: 'Explosive Recovery', notes: 'Burpee, then react to tossed ball' }
            ]
          },
          {
            day: 5,
            title: 'Game Simulation Defense',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Full defensive prep' },
              { name: 'Live Hitting Defense', sets: 5, reps: '15', focus: 'Reading Hitters', notes: 'React to live hits, focus on first contact' },
              { name: 'Free Ball to Defense Transition', sets: 4, reps: '12', focus: 'Court Awareness', notes: 'Read and react to various attack angles' },
              { name: 'Tip Coverage Drill', sets: 4, reps: '10', focus: 'Anticipation', notes: 'React to tips over block, sprint to ball' },
              { name: 'Six-Rotation Defense', sets: 3, reps: '20', focus: 'Positional Play', notes: 'Rotate through all back-row positions' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'setter-core-hands',
    title: "Precision Setter's Core and Hands Workout",
    duration: '6 weeks',
    level: 'Intermediate to Advanced',
    goals: ['Enhance Core Rotation', 'Develop Wrist Snap', 'Increase Finger Strength'],
    description: 'Elite setter development focusing on core stability for faster transitions, wrist control for dump shots, and finger strength for precision setting under pressure.',
    phases: [
      {
        name: 'Foundation & Strength',
        weeks: 'Weeks 1-3',
        description: 'Build core strength and hand/finger power essential for elite setting.',
        workoutDays: [
          {
            day: 1,
            title: 'Core Strength & Rotation',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Core activation, dynamic stretching' },
              { name: 'Weighted Russian Twists', sets: 4, reps: '20', focus: 'Rotational Power', notes: 'Hold medicine ball or plate, touch ground each side' },
              { name: 'Anti-Rotation Press', sets: 3, reps: '12/side', focus: 'Core Stability', notes: 'Use resistance band, resist rotation' },
              { name: 'Pallof Press', sets: 3, reps: '15/side', focus: 'Anti-Rotation', notes: 'Essential for body control while setting' },
              { name: 'Plank Variations', sets: 4, reps: '45 sec', focus: 'Core Endurance', notes: 'Side plank, front plank with shoulder taps' },
              { name: 'Cable Woodchops', sets: 3, reps: '12/side', focus: 'Diagonal Core Power', notes: 'Simulate rotational setting motion' }
            ]
          },
          {
            day: 2,
            title: 'Hand & Finger Strength',
            exercises: [
              { name: 'Warm-up', reps: '5 mins', focus: 'Finger and wrist mobility' },
              { name: 'Plate Pinches', sets: 4, reps: '30 sec', focus: 'Finger Grip Strength', notes: 'Pinch weight plates between fingers' },
              { name: 'Finger Push-ups', sets: 3, reps: '8-12', focus: 'Finger Power', notes: 'On fingertips only, modify to knees if needed' },
              { name: 'Wrist Curls', sets: 3, reps: '15', focus: 'Wrist Flexion', notes: 'Both regular and reverse curls' },
              { name: 'Rice Bucket Training', sets: 3, reps: '2 min', focus: 'Grip Endurance', notes: 'Various hand movements in rice bucket' },
              { name: 'Grip Trainer Squeezes', sets: 4, reps: '20', focus: 'Hand Closing Strength', notes: 'Use hand gripper or therapy putty' }
            ]
          },
          {
            day: 3,
            title: 'Weighted Ball Setting',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Setting-specific mobility' },
              { name: 'Weighted Ball Sets', sets: 5, reps: '25', focus: 'Finger Strength', notes: 'Use 2-3 lb weighted volleyball' },
              { name: 'Overhead Medicine Ball Throws', sets: 3, reps: '12', focus: 'Explosive Power', notes: 'Throw ball overhead to partner or wall' },
              { name: 'Wall Setting (Heavy Ball)', sets: 4, reps: '30', focus: 'Finger Endurance', notes: 'Maintain perfect form with heavier ball' },
              { name: 'Jump Setting Progression', sets: 3, reps: '15', focus: 'In-Air Control', notes: 'Start with normal ball, progress to weighted' }
            ]
          }
        ]
      },
      {
        name: 'Integration & Performance',
        weeks: 'Weeks 4-6',
        description: 'Apply strength gains to game-speed setting and develop consistency under fatigue.',
        workoutDays: [
          {
            day: 4,
            title: 'Farmer Carries & Loaded Carries',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Full-body activation' },
              { name: "Farmer's Carries", sets: 4, reps: '40 meters', focus: 'Grip & Core Stability', notes: 'Heavy dumbbells or kettlebells, maintain posture' },
              { name: 'Overhead Carry', sets: 3, reps: '30 meters', focus: 'Shoulder Stability', notes: 'Hold weight overhead, core tight' },
              { name: 'Suitcase Carry', sets: 3, reps: '40 meters/side', focus: 'Anti-Lateral Flexion', notes: 'One-sided carry, resist leaning' },
              { name: 'Bear Crawl', sets: 4, reps: '20 meters', focus: 'Core & Coordination', notes: 'Maintain neutral spine' }
            ]
          },
          {
            day: 5,
            title: 'High-Volume Setting Under Fatigue',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Setting prep, mobility' },
              { name: 'Continuous Setting (100 Reps)', sets: 2, reps: '100', focus: 'Endurance', notes: 'Maintain form throughout, short break between sets' },
              { name: 'Back-to-Back Jump Sets', sets: 4, reps: '20', focus: 'Explosive Endurance', notes: 'Minimal rest between reps' },
              { name: 'Multi-Position Setting Circuit', sets: 3, reps: '15/position', focus: 'Variety', notes: 'Set from various court positions' },
              { name: 'Dump Shot Practice', sets: 4, reps: '12', focus: 'Wrist Control', notes: 'Use new wrist strength for controlled dumps' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'explosive-blocking',
    title: 'Explosive Blocking & Lateral Speed Workout',
    duration: '4 weeks',
    level: 'Intermediate to Advanced',
    goals: ['Improve Lateral Movement', 'Increase Block Height', 'Strengthen Hand Penetration'],
    description: 'Develop explosive lateral power along the net, maintain blocking consistency under fatigue, and strengthen hands for aggressive penetration over the net.',
    phases: [
      {
        name: 'Lateral Power Development',
        weeks: 'Weeks 1 & 2',
        description: 'Build lateral speed and vertical consistency for effective blocking.',
        workoutDays: [
          {
            day: 1,
            title: 'Lateral Speed & Footwork',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic stretching, ankle mobility, blocking motion prep' },
              { name: 'Lateral Shuffle to Max Vertical', sets: 5, reps: '6', focus: 'Explosive Transition', notes: 'Shuffle 2-3 steps, plant, explode vertically' },
              { name: 'Resistance Band Block Steps', sets: 4, reps: '10/side', focus: 'Lateral Power', notes: 'Band around ankles, quick steps along net' },
              { name: 'Lateral Bound to Block', sets: 4, reps: '5/side', focus: 'Single-Leg Power', notes: 'Bound laterally, land, immediately vertical jump' },
              { name: 'Net Sprint Drill', sets: 5, reps: '4', focus: 'Court Speed', notes: 'Sprint sideline to sideline along net, touch antenna' }
            ]
          },
          {
            day: 2,
            title: 'Vertical Endurance',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Jump prep, dynamic movements' },
              { name: 'Continuous Double Block Jumps', sets: 4, reps: '12', focus: 'Block Endurance', notes: 'Back-to-back jumps, maintain max height' },
              { name: 'Three-Touch Block Series', sets: 4, reps: '8', focus: 'Fatigue Resistance', notes: 'Block left, middle, right without rest' },
              { name: 'Block to Transition', sets: 5, reps: '6', focus: 'Game Simulation', notes: 'Block jump, land, transition to approach' },
              { name: 'Timed Block Circuit', sets: 3, reps: '60 sec', focus: 'Maximum Effort', notes: 'As many quality blocks as possible in time' }
            ]
          },
          {
            day: 3,
            title: 'Hand Strength & Penetration',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Shoulder and wrist prep' },
              { name: 'Finger Taps on Net', sets: 5, reps: '30 sec', focus: 'Hand Speed', notes: 'Rapid finger taps at max reach on net' },
              { name: 'Push-up to Hand Clap', sets: 3, reps: '10', focus: 'Explosive Hands', notes: 'Explosive push to clap hands' },
              { name: 'Medicine Ball Overhead Throws', sets: 4, reps: '12', focus: 'Shoulder Power', notes: 'Throw ball forcefully overhead' },
              { name: 'Wall Blocking (Penetration)', sets: 4, reps: '15', focus: 'Hand Position', notes: 'Press hands over imaginary net on wall' }
            ]
          }
        ]
      },
      {
        name: 'Block Integration & Game Speed',
        weeks: 'Weeks 3 & 4',
        description: 'Apply power and speed to game-realistic blocking scenarios.',
        workoutDays: [
          {
            day: 4,
            title: 'Advanced Lateral Blocking',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Full blocking prep' },
              { name: 'Live Setter Read Block', sets: 5, reps: '12', focus: 'Reading', notes: 'React to setter, move and block' },
              { name: 'Cross-Court Block Movement', sets: 4, reps: '8', focus: 'Pin-to-Pin Coverage', notes: 'Outside to opposite, maintain height' },
              { name: 'Double Block Coordination', sets: 4, reps: '10', focus: 'Teamwork', notes: 'Practice with partner, seal block' },
              { name: 'Block and Cover', sets: 3, reps: '12', focus: 'Recovery', notes: 'Block, turn and cover tip' }
            ]
          },
          {
            day: 5,
            title: 'Maximum Height Under Fatigue',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Explosive movements' },
              { name: 'Depth Jump to Block', sets: 4, reps: '6', focus: 'Reactive Power', notes: 'Drop from box, immediate block jump' },
              { name: 'Block-Approach-Block Series', sets: 4, reps: '5', focus: 'Transition', notes: 'Block, approach to hit, block again' },
              { name: 'Fatigue Block Challenge', sets: 3, reps: '15', focus: 'Mental Toughness', notes: 'Maintain max effort when tired' },
              { name: 'One-on-One Block Battle', sets: 5, reps: '8', focus: 'Competition', notes: 'Block against live hitter' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'end-match-conditioning',
    title: 'End-of-Match Conditioning Circuit',
    duration: '4 weeks',
    level: 'Intermediate to Advanced',
    goals: ['Build Anaerobic Endurance', 'Maintain Power in Final Set', 'Improve Recovery Speed'],
    description: 'Develop the conditioning to maintain hitting power and defensive quality during the final set when fatigue peaks. High-intensity training for championship-level endurance.',
    phases: [
      {
        name: 'Anaerobic Base Building',
        weeks: 'Weeks 1 & 2',
        description: 'Build foundational anaerobic capacity and recovery efficiency.',
        workoutDays: [
          {
            day: 1,
            title: 'Court Sprint Intervals',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Dynamic prep, gradual intensity increase' },
              { name: 'Net-to-Baseline Sprints', sets: 10, reps: '1', focus: 'Court Speed', notes: '20 sec sprint, 40 sec active rest, repeat' },
              { name: 'Sideline-to-Sideline Shuttles', sets: 8, reps: '1', focus: 'Lateral Conditioning', notes: 'Touch each line, 30 sec work/60 sec rest' },
              { name: 'Diagonal Court Sprints', sets: 6, reps: '2', focus: 'Anaerobic Power', notes: 'Corner to corner, maximal effort' },
              { name: 'Cool-down Jog', reps: '5 mins', focus: 'Active recovery' }
            ]
          },
          {
            day: 2,
            title: 'HIIT Circuit - Upper Body Focus',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Joint mobility, light cardio' },
              { name: 'Burpees', sets: 6, reps: '20 sec', focus: 'Full-Body Explosive', notes: '20 sec max effort, 40 sec rest' },
              { name: 'Medicine Ball Slams', sets: 6, reps: '20 sec', focus: 'Hitting Power', notes: '20 sec max effort, 40 sec rest' },
              { name: 'Mountain Climbers', sets: 6, reps: '20 sec', focus: 'Core Endurance', notes: '20 sec max effort, 40 sec rest' },
              { name: 'Jump Squats', sets: 6, reps: '20 sec', focus: 'Leg Power', notes: '20 sec max effort, 40 sec rest' }
            ]
          },
          {
            day: 3,
            title: 'Box Jump HIIT',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Progressive jumping prep' },
              { name: 'Box Jumps (Max Effort)', sets: 8, reps: '20 sec', focus: 'Vertical Endurance', notes: '20 sec max jumps, 40 sec rest' },
              { name: 'Lateral Box Hops', sets: 6, reps: '20 sec', focus: 'Lateral Power', notes: 'Side-to-side over box' },
              { name: 'Step-Down Box Jumps', sets: 6, reps: '20 sec', focus: 'Eccentric Control', notes: 'Control the landing' },
              { name: 'Approach Jumps', sets: 5, reps: '6', focus: 'Volleyball-Specific', notes: 'Full approach, maintain height when tired' }
            ]
          }
        ]
      },
      {
        name: 'Advanced Conditioning & Game Simulation',
        weeks: 'Weeks 3 & 4',
        description: 'Increase intensity and add volleyball-specific movements under fatigue.',
        workoutDays: [
          {
            day: 4,
            title: 'Extended HIIT (20-Min Protocol)',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Full-body dynamic prep' },
              { name: 'HIIT Block 1: Burpees + Box Jumps', sets: 5, reps: '20 sec each', focus: 'Full-Body Explosive', notes: 'Alternate exercises, 40 sec rest between' },
              { name: 'HIIT Block 2: Mountain Climbers + Jump Squats', sets: 5, reps: '20 sec each', focus: 'Core & Legs', notes: 'Alternate exercises, 40 sec rest between' },
              { name: 'HIIT Block 3: Medicine Ball Slams + High Knees', sets: 5, reps: '20 sec each', focus: 'Power & Cardio', notes: 'Alternate exercises, 40 sec rest between' },
              { name: 'Cool-down', reps: '5 mins', focus: 'Walking, deep breathing' }
            ]
          },
          {
            day: 5,
            title: 'Game Simulation Circuit',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Volleyball-specific movements' },
              { name: 'Serve-Receive-Transition Circuit', sets: 4, reps: '90 sec', focus: 'Game Conditioning', notes: 'Continuous serve receive, transition to hit' },
              { name: 'Defense-to-Attack Rally', sets: 5, reps: '60 sec', focus: 'Rally Endurance', notes: 'Dig, transition, approach, repeat' },
              { name: 'Final Set Simulation', sets: 3, reps: '3 min', focus: 'Championship Conditioning', notes: 'Non-stop movement, simulate match intensity' },
              { name: 'Cool-down & Stretch', reps: '10 mins', focus: 'Recovery stretching' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'rotator-cuff-longevity',
    title: 'Rotator Cuff & Hitting Longevity Plan',
    duration: '8 weeks',
    level: 'All Levels',
    goals: ['Prevent Shoulder Injuries', 'Strengthen Rotator Cuff', 'Improve Shoulder Stability'],
    description: 'Essential prehabilitation program for all volleyball players. Strengthen the rotator cuff and surrounding muscles to prevent common hitting injuries and extend your career.',
    phases: [
      {
        name: 'Injury Prevention Foundation',
        weeks: 'Weeks 1-4',
        description: 'Build baseline strength in rotator cuff and stabilizing muscles.',
        workoutDays: [
          {
            day: 1,
            title: 'Rotator Cuff Strengthening',
            exercises: [
              { name: 'Warm-up', reps: '5 mins', focus: 'Arm circles, shoulder rolls, light band work' },
              { name: 'External Rotations (Band)', sets: 3, reps: '15', focus: 'Rotator Cuff', notes: 'Light resistance, elbow at 90 degrees' },
              { name: 'Internal Rotations (Band)', sets: 3, reps: '15', focus: 'Rotator Cuff', notes: 'Light resistance, controlled movement' },
              { name: 'Scapular Wall Slides', sets: 3, reps: '12', focus: 'Scapular Mobility', notes: 'Keep back flat against wall, slide arms up' },
              { name: 'Y-T-W-L Raises (Light Dumbbells)', sets: 3, reps: '10 each', focus: 'Shoulder Stabilizers', notes: 'Very light weight, focus on form' },
              { name: 'Prone I-Y-T', sets: 3, reps: '12 each', focus: 'Posterior Shoulder', notes: 'Face down on bench, thumbs up' }
            ]
          },
          {
            day: 2,
            title: 'Scapular Stability',
            exercises: [
              { name: 'Warm-up', reps: '5 mins', focus: 'Gentle shoulder mobility' },
              { name: 'Face Pulls', sets: 4, reps: '15', focus: 'Rear Delts', notes: 'Pull to face level, squeeze shoulder blades' },
              { name: 'Scapular Push-ups', sets: 3, reps: '12', focus: 'Serratus Anterior', notes: 'Push shoulder blades apart at top' },
              { name: 'Band Pull-Aparts', sets: 4, reps: '20', focus: 'Upper Back', notes: 'Squeeze shoulder blades together' },
              { name: 'Wall Angels', sets: 3, reps: '15', focus: 'Scapular Control', notes: 'Maintain contact with wall throughout' },
              { name: 'Prone Shoulder Flexion', sets: 3, reps: '12', focus: 'Shoulder Stability', notes: 'Light dumbbells, controlled motion' }
            ]
          },
          {
            day: 3,
            title: 'Light Overhead Pressing',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Thorough shoulder prep' },
              { name: 'Overhead Press (Light)', sets: 3, reps: '15', focus: 'Shoulder Strength', notes: 'Use light weight, high volume builds endurance' },
              { name: 'Landmine Press', sets: 3, reps: '12/side', focus: 'Natural Press Path', notes: 'Easier on shoulders than strict overhead' },
              { name: 'Cuban Press', sets: 3, reps: '10', focus: 'Rotator Cuff', notes: 'Combines external rotation with press' },
              { name: 'Dumbbell Shoulder Press (Seated)', sets: 3, reps: '12', focus: 'Controlled Strength', notes: 'Seated eliminates leg drive' },
              { name: 'Cool-down Stretch', reps: '5 mins', focus: 'Shoulder and chest stretches' }
            ]
          }
        ]
      },
      {
        name: 'Advanced Stability & Maintenance',
        weeks: 'Weeks 5-8',
        description: 'Progress exercises and integrate stability work with dynamic movements.',
        workoutDays: [
          {
            day: 4,
            title: 'Dynamic Stability',
            exercises: [
              { name: 'Warm-up', reps: '8 mins', focus: 'Dynamic shoulder prep' },
              { name: 'Bottoms-Up Kettlebell Press', sets: 3, reps: '10/side', focus: 'Rotator Cuff Stability', notes: 'Hold kettlebell upside down, very challenging' },
              { name: 'Pallof Press to Overhead', sets: 3, reps: '12', focus: 'Core to Shoulder', notes: 'Resist rotation while pressing' },
              { name: 'Turkish Get-Up', sets: 3, reps: '5/side', focus: 'Full-Body Stability', notes: 'Light weight, perfect form' },
              { name: 'Resistance Band Hitting Motion', sets: 3, reps: '15', focus: 'Sport-Specific', notes: 'Slow controlled hitting motion with band' },
              { name: 'Sleeper Stretch', sets: 3, reps: '30 sec/side', focus: 'Internal Rotation Flexibility', notes: 'Essential for shoulder health' }
            ]
          },
          {
            day: 5,
            title: 'Integrated Strength',
            exercises: [
              { name: 'Warm-up', reps: '10 mins', focus: 'Comprehensive shoulder prep' },
              { name: 'Trap Raises', sets: 4, reps: '12', focus: 'Upper Traps', notes: 'Shrug with slight upward angle' },
              { name: 'Rear Delt Flyes', sets: 4, reps: '15', focus: 'Posterior Shoulder', notes: 'Chest supported or bent over' },
              { name: 'High-Volume Rotator Work', sets: 4, reps: '20', focus: 'Endurance', notes: 'External rotations with very light weight' },
              { name: 'Overhead Carry', sets: 3, reps: '40 meters', focus: 'Loaded Stability', notes: 'Hold weight overhead while walking' },
              { name: 'Foam Rolling & Stretching', reps: '10 mins', focus: 'Recovery', notes: 'Focus on chest, lats, upper back' }
            ]
          }
        ]
      }
    ]
  }
];
