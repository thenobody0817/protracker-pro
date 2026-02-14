// Workout data for ProTracker Pro

export interface ExerciseData {
  name: string;
  type: 'strength' | 'mobility' | 'warmup';
  reps?: string;
  setsTarget: number;
  load?: string;
  rest?: number;
  instructions?: string;
  avoid?: string;
  icon?: string;
  order: number;
}

export interface SessionData {
  name: string;
  code: string;
  order: number;
  exercises: ExerciseData[];
}

export const workoutSessions: SessionData[] = [
  {
    name: 'Push + Shoulders',
    code: 'A',
    order: 0,
    exercises: [
      {
        name: 'Seated Machine Shoulder Press',
        type: 'strength',
        reps: '5-7',
        setsTarget: 3,
        load: '45kg',
        rest: 120,
        instructions: 'Sit with back against the pad, grip handles at shoulder height. Press upward until arms are fully extended. Control the descent back to starting position.',
        avoid: 'Do not arch your lower back. Avoid locking elbows at the top. Don\'t use momentum.',
        icon: 'dumbbell',
        order: 0
      },
      {
        name: 'Smith Flat Press',
        type: 'strength',
        reps: '6-8',
        setsTarget: 4,
        load: '48kg',
        rest: 120,
        instructions: 'Lie flat on the bench, grip bar slightly wider than shoulder width. Lower to chest level, then press up powerfully.',
        avoid: 'Don\'t bounce the bar off your chest. Avoid flaring elbows excessively. Keep feet flat on floor.',
        icon: 'barbell',
        order: 1
      },
      {
        name: 'Seated Cable Row',
        type: 'strength',
        reps: '6-8',
        setsTarget: 4,
        load: '55kg',
        rest: 120,
        instructions: 'Sit with feet on platform, slight knee bend. Pull handle to lower chest, squeezing shoulder blades together. Control the return.',
        avoid: 'Don\'t round your lower back. Avoid using momentum. Don\'t overextend at the bottom.',
        icon: 'cable',
        order: 2
      },
      {
        name: 'Cable Serratus Punch',
        type: 'strength',
        reps: '12-15',
        setsTarget: 2,
        load: '7.5kg',
        rest: 45,
        instructions: 'Stand facing away from cable, arm extended forward. Punch forward while protracting shoulder blade.',
        avoid: 'Don\'t bend the elbow during movement. Avoid rotating your torso.',
        icon: 'cable',
        order: 3
      },
      {
        name: 'Overhead Cable Triceps Extension',
        type: 'strength',
        reps: '8-10',
        setsTarget: 3,
        load: '12.5kg',
        rest: 90,
        instructions: 'Face away from cable machine, grip rope overhead. Extend arms forward, keeping elbows stationary.',
        avoid: 'Don\'t flare elbows out. Avoid leaning forward. Keep core tight.',
        icon: 'cable',
        order: 4
      },
      {
        name: 'Incline Dumbbell Curl',
        type: 'strength',
        reps: '8-10',
        setsTarget: 3,
        load: '12kg',
        rest: 75,
        instructions: 'Sit on incline bench with dumbbells at sides. Curl both dumbbells with supination at the top.',
        avoid: 'Don\'t swing the weights. Avoid arching back. Keep shoulders back.',
        icon: 'dumbbell',
        order: 5
      }
    ]
  },
  {
    name: 'Pull + Arms',
    code: 'B',
    order: 1,
    exercises: [
      {
        name: 'Neutral-Grip Lat Pulldown',
        type: 'strength',
        reps: '6-8',
        setsTarget: 4,
        load: '50kg',
        rest: 120,
        instructions: 'Grip the parallel handles, pull down to chest while leaning back slightly. Squeeze lats at the bottom.',
        avoid: 'Don\'t pull behind the neck. Avoid excessive leaning. Don\'t use momentum.',
        icon: 'cable',
        order: 0
      },
      {
        name: 'High-Incline Machine Press',
        type: 'strength',
        reps: '6-8',
        setsTarget: 3,
        load: '45kg',
        rest: 120,
        instructions: 'Set bench to high incline (30-45°). Press weight up, focusing on upper chest contraction.',
        avoid: 'Don\'t lock elbows. Avoid bouncing at bottom. Keep shoulders back.',
        icon: 'dumbbell',
        order: 1
      },
      {
        name: 'Straight-Arm Cable Pulldown',
        type: 'strength',
        reps: '10-12',
        setsTarget: 2,
        load: '25kg',
        rest: 90,
        instructions: 'Stand with arms extended, pull rope down to thighs while keeping arms straight. Focus on lats.',
        avoid: 'Don\'t bend elbows. Avoid using body weight. Keep posture upright.',
        icon: 'cable',
        order: 2
      },
      {
        name: 'Prone Y-Raise',
        type: 'strength',
        reps: '12-15',
        setsTarget: 2,
        load: '2kg',
        rest: 60,
        instructions: 'Lie prone on bench, raise arms in Y position with thumbs up. Focus on lower trap engagement.',
        avoid: 'Don\'t use momentum. Avoid excessive weight. Keep head neutral.',
        icon: 'body',
        order: 3
      },
      {
        name: 'Chest-Supported Row',
        type: 'strength',
        reps: '8-10',
        setsTarget: 3,
        load: '20kg',
        rest: 90,
        instructions: 'Chest against pad, pull handles back squeezing shoulder blades. Full range of motion.',
        avoid: 'Don\'t lift chest off pad. Avoid shrugging shoulders. Control the weight.',
        icon: 'dumbbell',
        order: 4
      },
      {
        name: 'Cable Lateral Raise',
        type: 'strength',
        reps: '12-15',
        setsTarget: 3,
        load: '5kg',
        rest: 60,
        instructions: 'Stand sideways to cable, raise arm to side until parallel. Control the descent.',
        avoid: 'Don\'t raise above shoulder height. Avoid using momentum. Keep slight bend in elbow.',
        icon: 'cable',
        order: 5
      },
      {
        name: 'Rope Triceps Pushdown',
        type: 'strength',
        reps: '10-12',
        setsTarget: 3,
        load: '20kg',
        rest: 60,
        instructions: 'Grip rope at chest height, push down while spreading rope apart at bottom.',
        avoid: 'Don\'t lean forward. Avoid using shoulders. Keep elbows pinned.',
        icon: 'cable',
        order: 6
      },
      {
        name: 'EZ-Bar Curl',
        type: 'strength',
        reps: '8-10',
        setsTarget: 3,
        load: '30kg',
        rest: 75,
        instructions: 'Grip EZ bar with underhand grip, curl bar to chest with controlled motion.',
        avoid: 'Don\'t swing the bar. Avoid leaning back. Keep elbows stationary.',
        icon: 'barbell',
        order: 7
      }
    ]
  },
  {
    name: 'Full Body',
    code: 'C',
    order: 2,
    exercises: [
      {
        name: 'Machine Chest Press',
        type: 'strength',
        reps: '8-10',
        setsTarget: 3,
        load: '40kg',
        rest: 120,
        instructions: 'Sit in machine, grip handles at chest level. Press forward until arms extended, control return.',
        avoid: 'Don\'t lock elbows. Avoid using momentum. Keep back against pad.',
        icon: 'dumbbell',
        order: 0
      },
      {
        name: 'Supinated Pulldown',
        type: 'strength',
        reps: '8-10',
        setsTarget: 3,
        load: '45kg',
        rest: 120,
        instructions: 'Use underhand grip on bar, pull down to upper chest. Squeeze lats at bottom.',
        avoid: 'Don\'t pull behind neck. Avoid excessive lean. Keep chest up.',
        icon: 'cable',
        order: 1
      },
      {
        name: 'SA Chest-Supported Row',
        type: 'strength',
        reps: '10-12',
        setsTarget: 3,
        load: '15kg',
        rest: 90,
        instructions: 'Single arm row with chest support. Pull dumbbell to hip, squeeze lat at top.',
        avoid: 'Don\'t rotate torso. Avoid using momentum. Keep chest on pad.',
        icon: 'dumbbell',
        order: 2
      },
      {
        name: 'Cable External Rotation',
        type: 'strength',
        reps: '12-15',
        setsTarget: 2,
        load: '2kg',
        rest: 60,
        instructions: 'Stand sideways to cable, elbow at 90°. Rotate arm outward against resistance.',
        avoid: 'Don\'t move elbow. Avoid using shoulder. Keep core tight.',
        icon: 'cable',
        order: 3
      },
      {
        name: 'Lateral Delt Machine',
        type: 'strength',
        reps: '12-15',
        setsTarget: 3,
        load: '20kg',
        rest: 60,
        instructions: 'Sit in machine, press arms outward to sides. Focus on medial deltoid.',
        avoid: 'Don\'t use momentum. Avoid shrugging. Control the return.',
        icon: 'dumbbell',
        order: 4
      },
      {
        name: 'Reverse Pec Deck',
        type: 'strength',
        reps: '12-15',
        setsTarget: 3,
        load: '25kg',
        rest: 60,
        instructions: 'Sit facing machine, pull handles back squeezing rear delts. Control forward motion.',
        avoid: 'Don\'t use momentum. Avoid pinching shoulder blades too hard. Keep chest up.',
        icon: 'cable',
        order: 5
      },
      {
        name: 'Rope Hammer Curl',
        type: 'strength',
        reps: '10-12',
        setsTarget: 3,
        load: '15kg',
        rest: 60,
        instructions: 'Grip rope attached to low cable, curl with neutral grip. Focus on brachialis.',
        avoid: 'Don\'t swing. Avoid leaning back. Keep elbows stationary.',
        icon: 'cable',
        order: 6
      },
      {
        name: 'SA Overhead Cable Triceps',
        type: 'strength',
        reps: '12-15',
        setsTarget: 2,
        load: '5kg',
        rest: 60,
        instructions: 'Single arm overhead extension with cable. Extend fully, control return.',
        avoid: 'Don\'t flare elbow. Avoid leaning. Keep core engaged.',
        icon: 'cable',
        order: 7
      }
    ]
  },
  {
    name: 'Recovery/Mobility',
    code: 'X',
    order: 3,
    exercises: [
      {
        name: 'Supine full-body reach',
        type: 'mobility',
        reps: '30s',
        setsTarget: 2,
        rest: 0,
        instructions: 'Lie on back, extend arms overhead and legs straight. Reach and stretch entire body.',
        avoid: 'Don\'t hold breath. Avoid straining neck.',
        icon: 'body',
        order: 0
      },
      {
        name: 'Child\'s pose',
        type: 'mobility',
        reps: '45s',
        setsTarget: 2,
        rest: 0,
        instructions: 'Kneel, sit back on heels, stretch arms forward on floor. Breathe deeply into stretch.',
        avoid: 'Don\'t force the position. Avoid holding breath.',
        icon: 'body',
        order: 1
      },
      {
        name: '90/90 floor traction',
        type: 'mobility',
        reps: '30s',
        setsTarget: 2,
        rest: 0,
        instructions: 'Sit with one leg in front at 90°, other to side at 90°. Shift weight forward and back.',
        avoid: 'Don\'t force range. Avoid knee pain.',
        icon: 'body',
        order: 2
      },
      {
        name: 'Slow nasal breathing',
        type: 'mobility',
        reps: '120s',
        setsTarget: 1,
        rest: 0,
        instructions: 'Sit comfortably, breathe slowly through nose. 4-6 breaths per minute ideal.',
        avoid: 'Don\'t mouth breathe. Avoid rushed breaths.',
        icon: 'body',
        order: 3
      },
      {
        name: 'Dead bug',
        type: 'mobility',
        reps: '8',
        setsTarget: 3,
        rest: 30,
        instructions: 'Lie on back, arms up and knees at 90°. Lower opposite arm and leg, return.',
        avoid: 'Don\'t let lower back arch. Avoid holding breath.',
        icon: 'body',
        order: 4
      },
      {
        name: 'Hollow body hold',
        type: 'mobility',
        reps: '30s',
        setsTarget: 3,
        rest: 30,
        instructions: 'Lie on back, lift shoulders and legs slightly off ground. Keep lower back pressed down.',
        avoid: 'Don\'t let back arch. Avoid straining neck.',
        icon: 'body',
        order: 5
      },
      {
        name: 'Side plank',
        type: 'mobility',
        reps: '30s',
        setsTarget: 3,
        rest: 30,
        instructions: 'Lie on side, prop up on elbow, lift hips. Hold while keeping body straight.',
        avoid: 'Don\'t let hips sag. Avoid holding breath.',
        icon: 'body',
        order: 6
      }
    ]
  },
  {
    name: 'Warmup',
    code: 'Y',
    order: 4,
    exercises: [
      {
        name: 'Wall slides',
        type: 'warmup',
        reps: '10',
        setsTarget: 2,
        rest: 15,
        instructions: 'Stand with back against wall, arms in goal post position. Slide arms up and down wall.',
        avoid: 'Don\'t arch lower back. Avoid forcing range. Keep ribs down.',
        icon: 'body',
        order: 0
      },
      {
        name: 'Scapular push-ups',
        type: 'warmup',
        reps: '10',
        setsTarget: 2,
        rest: 15,
        instructions: 'In push-up position, squeeze shoulder blades together then apart without bending elbows.',
        avoid: 'Don\'t bend arms. Avoid sagging hips. Keep core tight.',
        icon: 'body',
        order: 1
      },
      {
        name: 'Prone Y-hold',
        type: 'warmup',
        reps: '25s',
        setsTarget: 2,
        rest: 15,
        instructions: 'Lie prone, raise arms in Y position with thumbs up. Hold and engage lower traps.',
        avoid: 'Don\'t use momentum. Avoid excessive weight. Keep head neutral.',
        icon: 'body',
        order: 2
      },
      {
        name: 'Shoulder CARs',
        type: 'warmup',
        reps: '3',
        setsTarget: 2,
        rest: 15,
        instructions: 'Controlled articular rotations - move arm in full circles while keeping torso still.',
        avoid: 'Don\'t let torso move. Avoid rushing. Keep tension throughout.',
        icon: 'body',
        order: 3
      },
      {
        name: 'Deep squat hold',
        type: 'warmup',
        reps: '75s',
        setsTarget: 2,
        rest: 30,
        instructions: 'Sink into deep squat, keep heels down, chest up. Use support if needed.',
        avoid: 'Don\'t let heels rise. Avoid rounding back excessively. Breathe.',
        icon: 'body',
        order: 4
      },
      {
        name: 'Overhead reach + side bend',
        type: 'warmup',
        reps: '20s',
        setsTarget: 2,
        rest: 15,
        instructions: 'Reach arms overhead, then lean side to side in controlled motion.',
        avoid: 'Don\'t arch lower back. Avoid forcing range. Breathe.',
        icon: 'body',
        order: 5
      }
    ]
  }
];

export const getSessionByCode = (code: string): SessionData | undefined => {
  return workoutSessions.find(s => s.code === code);
};

export const getAllSessionCodes = (): string[] => {
  return workoutSessions.map(s => s.code);
};
